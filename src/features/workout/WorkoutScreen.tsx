import React, { useState, useEffect } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import {
  WorkoutUiModel,
  ExerciseUiModel,
  formatSetTarget,
} from './WorkoutSections';
import { BetweenExerciseRestOverlay } from './BetweenExerciseRestOverlay';
import { EditExerciseModal } from './EditExerciseModal';
import { FirstLaunchOnboarding } from '../onboarding/FirstLaunchOnboarding';
import { SetValidator } from '../../domain/validation/SetValidator';
import { LocalStorageService } from '../../domain/storage/localStorageService';
import { DayOfWeek, WeeklyProgram, UserPreferences } from '../../domain/model/types';
import {
  Play,
  Check,
  Circle,
  X,
  ArrowRight,
  ArrowLeft,
  Settings2,
  Edit2,
  RotateCcw,
  Coffee,
  CheckCircle2,
  Timer,
  AlertCircle,
} from 'lucide-react';

interface WorkoutScreenProps {
  workout: WorkoutUiModel | null;
  onWorkoutFinished: (workout: WorkoutUiModel, earnedXp: number) => void;
  onSetUpTraining: () => void;
}

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  workout,
  onWorkoutFinished,
  onSetUpTraining,
}) => {
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutUiModel | null>(workout);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validator] = useState(() => new SetValidator());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  // Active workout elapsed timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeSession && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession, isCompleted]);

  const formatElapsedTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAttemptExit = () => {
    const hasCompletedAnySet = activeWorkout?.exercises.some((ex) =>
      ex.sets.some((s) => s.isCompleted)
    );
    if (hasCompletedAnySet || elapsedSeconds > 10) {
      setIsExitConfirmOpen(true);
    } else {
      setActiveSession(false);
      setElapsedSeconds(0);
    }
  };

  const handleConfirmExit = () => {
    setIsExitConfirmOpen(false);
    setActiveSession(false);
    setElapsedSeconds(0);
  };

  // Inter-exercise rest overlay state
  const [isRestOverlayOpen, setIsRestOverlayOpen] = useState(false);
  const [completedExerciseForRest, setCompletedExerciseForRest] = useState<ExerciseUiModel | null>(null);
  const [nextExerciseForRest, setNextExerciseForRest] = useState<ExerciseUiModel | null>(null);
  const [restDurationForOverlay, setRestDurationForOverlay] = useState(60);

  // Active program & preferences state
  const [activeProgram, setActiveProgram] = useState<WeeklyProgram | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // Secondary actions modals
  const [editingExercise, setEditingExercise] = useState<ExerciseUiModel | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Sync workout prop when updated from outside
  useEffect(() => {
    setActiveWorkout(workout);
  }, [workout]);

  // Load active program & preferences from LocalStorage
  useEffect(() => {
    const prog = LocalStorageService.getWeeklyProgram();
    setActiveProgram(prog);
    const prefs = LocalStorageService.getUserPreferences();
    setUserPreferences(prefs);
  }, []);

  const todayDayOfWeek = DAYS_MAP[new Date().getDay()];
  const todaySchedule = activeProgram?.schedule.find((s) => s.dayOfWeek === todayDayOfWeek);
  const isTodayRest = todaySchedule ? todaySchedule.isRestDay : false;

  const handleStartWorkout = (targetWorkout?: WorkoutUiModel | null) => {
    const toStart = targetWorkout || activeWorkout;
    if (toStart) {
      setActiveWorkout(toStart);
      setActiveSession(true);
      setCurrentExerciseIndex(0);
      setIsCompleted(false);
      setElapsedSeconds(0);
    } else {
      setIsPreferencesOpen(true);
    }
  };

  /**
   * Toggle set completion status by set ID
   */
  const handleToggleSetCompletion = (setId: string) => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[currentExerciseIndex];
    if (!currentEx) return;

    let justMarkedDone = false;
    const updatedExercises = activeWorkout.exercises.map((ex, exIdx) => {
      if (exIdx !== currentExerciseIndex) return ex;
      return {
        ...ex,
        sets: ex.sets.map((set) => {
          if (set.id === setId) {
            const nextState = !set.isCompleted;
            if (nextState) justMarkedDone = true;
            return { ...set, isCompleted: nextState };
          }
          return set;
        }),
      };
    });

    const updatedEx = updatedExercises[currentExerciseIndex];
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });

    // Check if all sets of current exercise are completed
    const allSetsDone = updatedEx.sets.every((s) => s.isCompleted);
    if (justMarkedDone && allSetsDone) {
      triggerInterExerciseRest(updatedEx, currentExerciseIndex, updatedExercises);
    }
  };

  /**
   * Primary action in active workout: Complete Next Incomplete Set
   */
  const handleCompleteCurrentSet = () => {
    if (!activeWorkout) return;
    const currentEx = activeWorkout.exercises[currentExerciseIndex];
    if (!currentEx) return;

    const nextIncomplete = currentEx.sets.find((s) => !s.isCompleted);
    if (nextIncomplete) {
      handleToggleSetCompletion(nextIncomplete.id);
    } else {
      // If all sets are already done, move forward
      handleAdvanceToNextExercise();
    }
  };

  /**
   * Triggers the minimal rest timer overlay after completing the final set of an exercise
   */
  const triggerInterExerciseRest = (
    finishedExercise: ExerciseUiModel,
    finishedIndex: number,
    allExercises: ExerciseUiModel[]
  ) => {
    const nextIdx = finishedIndex + 1;
    if (nextIdx < allExercises.length) {
      // Start configured rest period automatically
      setCompletedExerciseForRest(finishedExercise);
      setNextExerciseForRest(allExercises[nextIdx]);
      setRestDurationForOverlay(finishedExercise.restSeconds || activeProgram?.defaultRestSeconds || 60);
      setIsRestOverlayOpen(true);
    } else {
      // Last set of final exercise finished!
      setIsCompleted(true);
    }
  };

  /**
   * Rest period finished or skipped -> advance to next exercise in ready state
   */
  const handleProceedAfterRest = () => {
    setIsRestOverlayOpen(false);
    if (activeWorkout && currentExerciseIndex + 1 < activeWorkout.exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  /**
   * Manual advance to next exercise
   */
  const handleAdvanceToNextExercise = () => {
    if (!activeWorkout) return;
    const nextIdx = currentExerciseIndex + 1;
    if (nextIdx >= activeWorkout.exercises.length) {
      setIsCompleted(true);
    } else {
      setCurrentExerciseIndex(nextIdx);
    }
  };

  /**
   * Advanced Editing: Apply updated exercise prescription
   */
  const handleSaveExerciseEdit = (updatedEx: ExerciseUiModel) => {
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises.map((ex) =>
      ex.id === updatedEx.id ? updatedEx : ex
    );
    const updatedWorkout = { ...activeWorkout, exercises: updatedExercises };
    setActiveWorkout(updatedWorkout);
    LocalStorageService.saveWorkout(updatedWorkout as any);
  };

  /**
   * Workout completed handler (Idempotent XP awarding)
   */
  const handleFinishDone = () => {
    if (!activeWorkout) return;
    const isNew = LocalStorageService.recordCompletedSession(activeWorkout.id);
    const earnedXp = isNew ? activeWorkout.estimatedXp : 0;

    onWorkoutFinished(activeWorkout, earnedXp);
    setIsCompleted(false);
    setActiveSession(false);
    setCurrentExerciseIndex(0);
  };

  /**
   * Re-generate or update preferences from modal
   */
  const handlePreferencesUpdated = (newProgram: WeeklyProgram, newWorkouts: WorkoutUiModel[]) => {
    setActiveProgram(newProgram);
    if (newWorkouts.length > 0) {
      setActiveWorkout(newWorkouts[0]);
    }
    setIsPreferencesOpen(false);
  };

  // ==========================================
  // VIEW 1: ACTIVE WORKOUT EXECUTION
  // ==========================================
  if (activeSession && activeWorkout) {
    if (isCompleted) {
      return (
        <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist">
          <OCTopHeader />
          <div className="p-6 bg-[#121214] border border-white/10 rounded-[22px] flex flex-col items-center text-center my-6 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Workout Completed</h2>
            <p className="text-xs text-white/50 mt-1">
              All prescribed sets for {activeWorkout.name} are complete.
            </p>
            <div className="mt-4 py-2 px-4 rounded-xl bg-black/60 border border-white/5 font-space text-xs text-[#8B5CF6] font-bold">
              +{activeWorkout.estimatedXp} XP Awarded
            </div>
          </div>

          <button
            onClick={handleFinishDone}
            className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-sm cursor-pointer shadow-lg shadow-[#8B5CF6]/20 transition-all font-space"
          >
            Complete Session & Record XP
          </button>
        </div>
      );
    }

    const currentExercise = activeWorkout.exercises[currentExerciseIndex];
    const nextExercise = activeWorkout.exercises[currentExerciseIndex + 1];
    const totalSets = currentExercise?.sets.length || 0;
    const completedSets = currentExercise?.sets.filter((s) => s.isCompleted).length || 0;
    const allCurrentSetsDone = totalSets > 0 && completedSets === totalSets;

    const activeTotalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const activeCompletedSets = activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
      0
    );
    const activeSessionProgressPercent =
      activeTotalSets > 0 ? Math.round((activeCompletedSets / activeTotalSets) * 100) : 0;

    return (
      <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist text-white">
        <OCTopHeader />

        {/* Compact Top Bar: Back control, workout title, elapsed timer, discreet progress */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/5 mb-5">
          <button
            onClick={handleAttemptExit}
            className="w-8 h-8 rounded-lg bg-[#141417] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Exit workout"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex flex-col items-center min-w-0 px-2">
            <span className="font-space text-[0.68rem] font-bold text-white/90 uppercase tracking-wider truncate max-w-[170px]">
              {activeWorkout.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-space text-[0.62rem] text-white/50">
                Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
              <span className="font-space text-[0.62rem] text-[#8B5CF6] font-semibold">
                {activeSessionProgressPercent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141417] border border-white/10 font-roboto-mono text-xs text-white/90">
            <Timer size={12} className="text-[#8B5CF6]" />
            <span>{formatElapsedTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Current Exercise Name & Prescription Header */}
        {currentExercise && (
          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[26px] font-[800] tracking-tight text-white leading-tight font-manrope">
                {currentExercise.name}
              </h2>
              <button
                onClick={() => setEditingExercise(currentExercise)}
                className="font-space text-[0.65rem] text-white/40 hover:text-white transition-colors flex items-center gap-1 cursor-pointer pt-1 shrink-0"
              >
                <Edit2 size={11} />
                <span>Edit</span>
              </button>
            </div>

            {/* Target Metrics Strip */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-space text-xs text-white/60">
              <span className="text-white/90 font-semibold">{totalSets} sets</span>
              <span className="text-white/20">×</span>
              <span>
                {formatSetTarget(currentExercise.sets[0]) ||
                  (currentExercise.measurementType === 'DURATION' ? '30 sec' : '10 reps')}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-white/50">{currentExercise.restSeconds || 60}s rest</span>
              {currentExercise.equipmentRequired && currentExercise.equipmentRequired !== 'NONE' && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="uppercase text-[0.62rem] text-white/40">
                    {currentExercise.equipmentRequired.replace('_', ' ')}
                  </span>
                </>
              )}
            </div>

            {/* Note badge with session progress indicator */}
            {currentExercise.note && (
              <div className="mt-1 flex items-start gap-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <span className="font-space text-[0.55rem] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#8B5CF6]/15 px-1.5 py-0.2 rounded border border-[#8B5CF6]/30">
                    NOTE
                  </span>
                  <span
                    title="Progress through session total sets"
                    className="font-space text-[0.55rem] font-bold text-white/80 bg-white/5 px-1.5 py-0.2 rounded border border-white/10 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                    <span>{activeSessionProgressPercent}%</span>
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-geist flex-1">
                  {currentExercise.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Clean Sets Checklist (Set 1  ✓ / Set 2  ✓ / Set 3  ○) */}
        {currentExercise && (
          <div className="bg-[#121214] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden mb-6">
            {currentExercise.sets.map((set) => {
              const isDone = !!set.isCompleted;
              return (
                <div
                  key={set.id}
                  onClick={() => handleToggleSetCompletion(set.id)}
                  className="py-3.5 px-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-white font-geist">
                      Set {set.setNumber}
                    </span>
                    <span className="font-space text-xs text-white/40">
                      {set.targetReps ? `${set.targetReps} reps` : set.targetDuration ? `${set.targetDuration}s` : ''}
                      {set.targetWeight ? ` · ${set.targetWeight} kg` : ''}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                        : 'border-white/20 bg-black/40 text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Primary Action Button: Complete Set / Next Exercise */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCompleteCurrentSet}
            className="w-full h-13 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-sm cursor-pointer shadow-lg shadow-[#8B5CF6]/20 transition-all font-space flex items-center justify-center gap-2"
          >
            <span>
              {allCurrentSetsDone
                ? currentExerciseIndex === activeWorkout.exercises.length - 1
                  ? 'Finish Workout'
                  : 'Next Exercise'
                : 'Complete Set'}
            </span>
          </button>

          {/* Next Exercise Preview */}
          <div className="text-center font-space text-xs text-white/50 pt-1">
            {nextExercise ? (
              <span>Next: {nextExercise.name}</span>
            ) : (
              <span className="text-[#8B5CF6]">Final Movement</span>
            )}
          </div>
        </div>

        {/* Exit Confirmation Dialog: Safeguards unsaved progress */}
        {isExitConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-[#121214] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 font-geist">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-1">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-base font-bold text-white text-center">Unfinished Workout</h3>
              <p className="text-xs text-white/50 text-center leading-relaxed">
                You have unfinished progress in this session. Exiting now will leave this session incomplete.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setIsExitConfirmOpen(false)}
                  className="w-full h-10 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-space text-xs font-semibold cursor-pointer transition-colors"
                >
                  Resume Workout
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-space text-xs font-medium cursor-pointer transition-colors"
                >
                  Discard & Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Between-exercise Rest Overlay */}
        <BetweenExerciseRestOverlay
          isOpen={isRestOverlayOpen}
          completedExercise={completedExerciseForRest}
          nextExercise={nextExerciseForRest}
          durationSeconds={restDurationForOverlay}
          onFinishRest={handleProceedAfterRest}
          onSkipRest={handleProceedAfterRest}
        />

        {/* Secondary Edit Exercise Modal */}
        {editingExercise && (
          <EditExerciseModal
            isOpen={!!editingExercise}
            onClose={() => setEditingExercise(null)}
            exercise={editingExercise}
            allowedEquipment={activeProgram?.equipment || ['NONE']}
            limitations={activeProgram?.limitations || []}
            onSave={handleSaveExerciseEdit}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORKOUT OVERVIEW (Sections 4 & 5)
  // ==========================================
  if (!activeWorkout) {
    return (
      <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist text-white">
        <OCTopHeader />
        <div className="p-6 bg-[#121214] border border-white/10 rounded-[22px] flex flex-col items-center text-center my-6 shadow-xl">
          <h2 className="text-xl font-bold text-white tracking-tight">No Active Program</h2>
          <p className="text-xs text-white/50 mt-1">
            Build your personalized program to begin training.
          </p>
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="mt-4 px-5 py-3 rounded-xl bg-[#8B5CF6] text-white font-space text-xs font-semibold hover:bg-[#7C3AED] transition-colors cursor-pointer"
          >
            Build My Program
          </button>
        </div>

        {isPreferencesOpen && (
          <FirstLaunchOnboarding
            isModalMode={true}
            onCancel={() => setIsPreferencesOpen(false)}
            onComplete={handlePreferencesUpdated}
          />
        )}
      </div>
    );
  }

  // Calculate session set metrics for percentage display
  const totalSessionSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSessionSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const sessionProgressPercent =
    totalSessionSets > 0 ? Math.round((completedSessionSets / totalSessionSets) * 100) : 0;

  return (
    <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist text-white">
      <OCTopHeader />

      {/* 1. Compact Header */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <span className="font-space text-[0.68rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
          TODAY'S WORKOUT
        </span>
        <button
          onClick={() => setIsPreferencesOpen(true)}
          className="font-space text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Settings2 size={13} />
          <span>Preferences</span>
        </button>
      </div>

      {/* 2. Workout Name and Duration */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-geist">
            {activeWorkout.name}
          </h1>
          {isTodayRest && (
            <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
              <Coffee size={13} className="text-[#8B5CF6]" />
              <span>Scheduled Recovery Day</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 font-space text-xs text-white/60">
          <span>{activeWorkout.estimatedMinutes} min</span>
          <span className="text-white/20">·</span>
          <span className="text-[#8B5CF6]/90">+{activeWorkout.estimatedXp} XP</span>
        </div>
      </div>

      {/* 3. Minimal Exercise List (Section 4 layout) */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden mb-5">
        {activeWorkout.exercises.map((exercise, idx) => {
          const targetStr = formatSetTarget(exercise.sets[0]);
          const prescription = `${exercise.sets.length} sets × ${
            targetStr || (exercise.measurementType === 'DURATION' ? '30 sec' : '10 reps')
          }`;

          return (
            <div
              key={exercise.id}
              className="py-3.5 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
                <span className="font-space text-xs text-white/30 w-6 pt-0.5 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate font-geist">
                      {exercise.name}
                    </span>
                    {exercise.note && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="font-space text-[0.55rem] font-bold text-[#8B5CF6] bg-[#8B5CF6]/15 px-1.5 py-0.2 rounded border border-[#8B5CF6]/30 uppercase">
                          NOTE
                        </span>
                        <span
                          title="Progress through session total sets"
                          className="font-space text-[0.55rem] font-bold text-white/80 bg-white/5 px-1.5 py-0.2 rounded border border-white/10 flex items-center gap-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#8B5CF6]" />
                          <span>{sessionProgressPercent}%</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-space text-xs text-white/50 mt-0.5">
                    <span>{prescription}</span>
                    {exercise.equipmentRequired && exercise.equipmentRequired !== 'NONE' && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="uppercase text-[0.62rem] text-white/40">
                          {exercise.equipmentRequired.replace('_', ' ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Edit Action */}
              <button
                onClick={() => setEditingExercise(exercise)}
                className="text-white/30 hover:text-white/70 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Edit prescription"
              >
                <Edit2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Primary Start Workout Action */}
      <button
        onClick={() => handleStartWorkout(activeWorkout)}
        className="w-full h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white rounded-[14px] font-semibold text-sm cursor-pointer shadow-lg shadow-[#8B5CF6]/20 transition-all font-space flex items-center justify-center gap-2 mb-6"
      >
        <Play size={14} fill="white" />
        <span>{isTodayRest ? 'Start Workout Anyway' : 'Start Workout'}</span>
      </button>

      {/* 5. Optional Compact Weekly Schedule */}
      {activeProgram && (
        <div className="p-3.5 bg-[#121214]/60 border border-white/5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-space text-[0.65rem] uppercase tracking-wider text-white/40">
              Weekly Schedule
            </span>
            <span className="font-space text-[0.62rem] text-white/40">
              {activeProgram.daysPerWeek} training days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {activeProgram.schedule.map((day) => {
              const isToday = day.dayOfWeek === todayDayOfWeek;
              return (
                <div
                  key={day.dayOfWeek}
                  className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center ${
                    isToday
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                      : day.isRestDay
                      ? 'bg-transparent border-transparent text-white/30'
                      : 'bg-white/5 border-white/5 text-white/70'
                  }`}
                >
                  <span className="font-space text-[0.65rem] font-bold">
                    {day.dayName.slice(0, 3)}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      day.isRestDay ? 'bg-white/20' : 'bg-[#8B5CF6]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Secondary Edit Exercise Modal */}
      {editingExercise && (
        <EditExerciseModal
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          exercise={editingExercise}
          allowedEquipment={activeProgram?.equipment || ['NONE']}
          limitations={activeProgram?.limitations || []}
          onSave={handleSaveExerciseEdit}
        />
      )}

      {/* Preferences / Program Regeneration Modal */}
      {isPreferencesOpen && (
        <FirstLaunchOnboarding
          isModalMode={true}
          initialPreferences={userPreferences}
          onCancel={() => setIsPreferencesOpen(false)}
          onComplete={handlePreferencesUpdated}
        />
      )}
    </div>
  );
};
