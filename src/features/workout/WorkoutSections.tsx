import React, { useState, useEffect } from 'react';
import {
  Check,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  AlertCircle,
  Dumbbell,
  Timer,
  Navigation,
} from 'lucide-react';
import { OCRow } from '../../components/OCRow';
import { OCSectionHeader } from '../../components/OCSectionHeader';
import { OCButton } from '../../components/OCButton';
import { OCStatusPill } from '../../components/OCStatusPill';
import { MeasurementType, WorkoutDifficulty } from '../../domain/model/types';
import { SetValidator, SetValidationIssue } from '../../domain/validation/SetValidator';

export interface SetUiModel {
  id: string;
  setNumber: number;
  measurementType: MeasurementType;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetDuration?: number | null;
  targetDistance?: number | null;
  actualReps?: number | null;
  actualWeight?: number | null;
  actualDuration?: number | null;
  actualDistance?: number | null;
  isCompleted?: boolean;
}

export interface ExerciseUiModel {
  id: string;
  name: string;
  measurementType: MeasurementType;
  sets: SetUiModel[];
  note?: string | null;
}

export interface WorkoutUiModel {
  id: string;
  name: string;
  difficulty: WorkoutDifficulty;
  estimatedMinutes: number;
  estimatedXp: number;
  exercises: ExerciseUiModel[];
}

/** Formats target values into human-readable text */
export function formatSetTarget(set?: SetUiModel): string {
  if (!set) return '';
  switch (set.measurementType) {
    case 'WEIGHT_REPS':
      if (set.targetWeight && set.targetReps) return `${set.targetWeight} kg × ${set.targetReps} reps`;
      if (set.targetReps) return `${set.targetReps} reps`;
      return '';
    case 'REPS':
      return set.targetReps ? `${set.targetReps} reps` : '';
    case 'DURATION':
      if (!set.targetDuration) return '';
      const mins = Math.floor(set.targetDuration / 60);
      const secs = (set.targetDuration % 60).toString().padStart(2, '0');
      return `${mins}:${secs} min`;
    case 'DISTANCE':
      if (!set.targetDistance) return '';
      return set.targetDistance >= 1000
        ? `${(set.targetDistance / 1000).toFixed(1)} km`
        : `${set.targetDistance} m`;
    default:
      return '';
  }
}

/** Workout Top Bar */
export const WorkoutTopBar: React.FC<{
  workoutName: string;
  exerciseIndex?: number;
  totalExercises?: number;
  onExit?: () => void;
}> = ({ workoutName, exerciseIndex, totalExercises, onExit }) => {
  return (
    <div className="w-full flex flex-col py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#A7A3AF] font-medium tracking-wide uppercase">
          {exerciseIndex !== undefined ? 'Active Session' : 'Planned Workout'}
        </span>
        {onExit && (
          <button
            onClick={onExit}
            className="text-xs text-[#A7A3AF] hover:text-[#F5F3F8] transition-colors cursor-pointer"
          >
            Leave session
          </button>
        )}
      </div>

      <div className="w-full flex justify-between items-center mt-1">
        <h1 className="text-2xl font-bold text-[#F5F3F8] tracking-tight">{workoutName}</h1>
        {exerciseIndex !== undefined && totalExercises !== undefined && (
          <span className="text-xs font-semibold text-[#A7A3AF] bg-[#18161E] px-2.5 py-1 rounded-[10px] border border-[#2A2733]">
            {exerciseIndex + 1} / {totalExercises}
          </span>
        )}
      </div>

      {exerciseIndex !== undefined && totalExercises !== undefined && (
        <div className="w-full h-1 bg-[#18161E] rounded-full mt-3 overflow-hidden border border-[#2A2733]/40">
          <div
            className="h-full bg-[#7C5CFF] rounded-full transition-all duration-300"
            style={{ width: `${((exerciseIndex + 1) / totalExercises) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

/** Overview details for Planned Workout */
export const WorkoutOverviewSection: React.FC<{ workout: WorkoutUiModel }> = ({ workout }) => {
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="w-full flex flex-col pb-6">
      <div className="flex items-center gap-2 mb-2">
        <OCStatusPill
          text={workout.difficulty.replace('_', ' ')}
          variant="INFO"
        />
        <span className="text-xs text-[#A7A3AF] font-medium">· {workout.estimatedMinutes} min</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 bg-[#18161E] p-3 rounded-[16px] border border-[#2A2733]/60">
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <span className="text-lg font-bold text-[#F5F3F8]">{workout.exercises.length}</span>
          <span className="text-[11px] text-[#A7A3AF]">Exercises</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center border-x border-[#2A2733]/60">
          <span className="text-lg font-bold text-[#F5F3F8]">{totalSets}</span>
          <span className="text-[11px] text-[#A7A3AF]">Total Sets</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <span className="text-lg font-bold text-[#7C5CFF]">+{workout.estimatedXp}</span>
          <span className="text-[11px] text-[#A7A3AF]">XP Reward</span>
        </div>
      </div>
    </div>
  );
};

/** List of exercises in Planned Workout */
export const ExerciseListSection: React.FC<{ exercises: ExerciseUiModel[] }> = ({ exercises }) => {
  return (
    <div className="w-full flex flex-col pb-6">
      <OCSectionHeader title="Exercise Roster" subtitle={`${exercises.length} planned movements`} />
      <div className="flex flex-col gap-3">
        {exercises.map((exercise, index) => (
          <OCRow key={exercise.id} className="justify-between items-start">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#121117] border border-[#2A2733] flex items-center justify-center text-xs font-semibold text-[#A7A3AF] shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F3F8]">{exercise.name}</span>
                <span className="text-xs text-[#A7A3AF] mt-0.5">
                  {exercise.sets.length} sets · {formatSetTarget(exercise.sets[0])}
                </span>
                {exercise.note && (
                  <span className="text-[11px] text-[#77737F] mt-1 italic">
                    "{exercise.note}"
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#A7A3AF] bg-[#121117] px-2.5 py-1 rounded-[8px] border border-[#2A2733]/60 shrink-0">
              {exercise.measurementType.replace('_', ' ')}
            </span>
          </OCRow>
        ))}
      </div>
    </div>
  );
};

/** Exercise selector strip during active workout */
export const ExerciseNavigationTabs: React.FC<{
  exercises: ExerciseUiModel[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}> = ({ exercises, currentIndex, onSelectIndex }) => {
  return (
    <div className="w-full flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
      {exercises.map((ex, idx) => {
        const isCurrent = idx === currentIndex;
        const allSetsDone = ex.sets.length > 0 && ex.sets.every((s) => s.isCompleted);
        const hasSomeDone = ex.sets.some((s) => s.isCompleted);

        return (
          <button
            key={ex.id}
            onClick={() => onSelectIndex(idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
              isCurrent
                ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#F5F3F8]'
                : allSetsDone
                ? 'bg-[#18161E] border-[#6FA876]/40 text-[#6FA876]'
                : hasSomeDone
                ? 'bg-[#18161E] border-[#3A3744] text-[#F5F3F8]'
                : 'bg-[#18161E] border-[#2A2733] text-[#A7A3AF] hover:text-[#F5F3F8]'
            }`}
          >
            {allSetsDone && <Check size={12} strokeWidth={3} className="text-[#6FA876]" />}
            <span>
              {idx + 1}. {ex.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/** Active exercise set tracking section */
export const ActiveExerciseSection: React.FC<{
  exercise: ExerciseUiModel;
  onCompleteSet: (setId: string) => void;
  onUpdateSet: (
    setId: string,
    updates: {
      reps?: number | null;
      weight?: number | null;
      duration?: number | null;
      distance?: number | null;
    }
  ) => void;
  validator: SetValidator;
}> = ({ exercise, onCompleteSet, onUpdateSet, validator }) => {
  return (
    <div className="w-full flex flex-col pb-6">
      <div className="w-full bg-[#18161E] rounded-[16px] p-4 border border-[#2A2733]/60 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-[#F5F3F8]">{exercise.name}</h2>
            {exercise.note && (
              <p className="text-xs text-[#A7A3AF] mt-1">{exercise.note}</p>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#A58CFF] bg-[#7C5CFF]/15 px-2 py-0.5 rounded-[8px] border border-[#7C5CFF]/30">
            {exercise.measurementType.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {exercise.sets.map((set) => {
          const isDone = !!set.isCompleted;

          // Determine current working values
          const activeReps = set.actualReps !== undefined && set.actualReps !== null
            ? set.actualReps
            : set.targetReps ?? null;
          const activeWeight = set.actualWeight !== undefined && set.actualWeight !== null
            ? set.actualWeight
            : set.targetWeight ?? null;
          const activeDuration = set.actualDuration !== undefined && set.actualDuration !== null
            ? set.actualDuration
            : set.targetDuration ?? null;
          const activeDistance = set.actualDistance !== undefined && set.actualDistance !== null
            ? set.actualDistance
            : set.targetDistance ?? null;

          // Validate set using SetValidator
          const validation = validator.validate({
            id: set.id,
            index: set.setNumber,
            measurementType: set.measurementType,
            repetitions: activeReps,
            weightKg: activeWeight,
            durationSeconds: activeDuration,
            distanceMeters: activeDistance,
          });

          return (
            <div
              key={set.id}
              className={`w-full rounded-[16px] p-4 flex flex-col gap-2.5 transition-all border ${
                isDone
                  ? 'bg-[#18161E]/80 border-[#6FA876]/40'
                  : 'bg-[#18161E] border-[#2A2733]/80 hover:border-[#3A3744]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? 'bg-[#6FA876]/20 text-[#6FA876] border border-[#6FA876]/40'
                        : 'bg-[#121117] text-[#A7A3AF] border border-[#2A2733]'
                    }`}
                  >
                    {set.setNumber}
                  </span>
                  <span className="text-sm font-semibold text-[#F5F3F8]">
                    Set {set.setNumber}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-bold text-[#6FA876] uppercase tracking-wider bg-[#6FA876]/15 px-1.5 py-0.5 rounded">
                      Completed
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onCompleteSet(set.id)}
                  aria-label={isDone ? 'Mark set incomplete' : 'Mark set complete'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isDone
                      ? 'bg-[#6FA876] text-[#0B0A0F] shadow-sm shadow-[#6FA876]/30'
                      : 'border-2 border-[#3A3744] text-[#3A3744] hover:border-[#7C5CFF] hover:text-[#7C5CFF]'
                  }`}
                >
                  {isDone ? <Check size={16} strokeWidth={3} /> : <Circle size={14} />}
                </button>
              </div>

              {/* Target subtitle */}
              <div className="text-xs text-[#A7A3AF] flex items-center gap-2">
                <span>Target:</span>
                <span className="font-medium text-[#F5F3F8]">
                  {formatSetTarget(set) || 'Not specified'}
                </span>
              </div>

              {/* Dynamic Inputs per MeasurementType */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {set.measurementType === 'WEIGHT_REPS' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#868094] font-medium">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="0.0"
                        value={set.actualWeight ?? set.targetWeight ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          onUpdateSet(set.id, { weight: val });
                        }}
                        className="w-full bg-[#121117] border border-[#23202E] focus:border-[#7C5CFF] rounded-[10px] px-3 py-2 text-sm text-[#F5F3F8] outline-none font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-[#868094] font-medium">Repetitions</label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        placeholder="0"
                        value={set.actualReps ?? set.targetReps ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          onUpdateSet(set.id, { reps: val });
                        }}
                        className="w-full bg-[#121117] border border-[#23202E] focus:border-[#7C5CFF] rounded-[10px] px-3 py-2 text-sm text-[#F5F3F8] outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {set.measurementType === 'REPS' && (
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] text-[#A7A3AF] font-medium">Repetitions</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      placeholder="0"
                      value={set.actualReps ?? set.targetReps ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        onUpdateSet(set.id, { reps: val });
                      }}
                      className="w-full bg-[#121117] border border-[#2A2733] focus:border-[#7C5CFF] rounded-[10px] px-3 py-2 text-sm text-[#F5F3F8] outline-none"
                    />
                  </div>
                )}

                {set.measurementType === 'DURATION' && (
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] text-[#A7A3AF] font-medium">Duration (seconds)</label>
                    <input
                      type="number"
                      step="5"
                      min="1"
                      placeholder="Seconds (e.g. 60)"
                      value={set.actualDuration ?? set.targetDuration ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        onUpdateSet(set.id, { duration: val });
                      }}
                      className="w-full bg-[#121117] border border-[#2A2733] focus:border-[#7C5CFF] rounded-[10px] px-3 py-2 text-sm text-[#F5F3F8] outline-none"
                    />
                  </div>
                )}

                {set.measurementType === 'DISTANCE' && (
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] text-[#A7A3AF] font-medium">Distance (meters)</label>
                    <input
                      type="number"
                      step="50"
                      min="1"
                      placeholder="Meters (e.g. 500)"
                      value={set.actualDistance ?? set.targetDistance ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                        onUpdateSet(set.id, { distance: val });
                      }}
                      className="w-full bg-[#121117] border border-[#2A2733] focus:border-[#7C5CFF] rounded-[10px] px-3 py-2 text-sm text-[#F5F3F8] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Inline SetValidator issues */}
              {!validation.isValid && (
                <div className="flex items-center gap-1.5 text-xs text-[#C7584F] mt-1 pt-1 border-t border-[#2A2733]/40">
                  <AlertCircle size={13} />
                  <span>{validation.issues[0]?.message}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Rest Timer Component */
export const RestTimer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  defaultSeconds?: number;
}> = ({ isOpen, onClose, defaultSeconds = 60 }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(true);
  const [totalTime, setTotalTime] = useState(defaultSeconds);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(defaultSeconds);
      setTotalTime(defaultSeconds);
      setIsActive(true);
    }
  }, [isOpen, defaultSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressRatio = totalTime > 0 ? (totalTime - secondsRemaining) / totalTime : 1;

  const handleAdd30s = () => {
    setSecondsRemaining((prev) => prev + 30);
    setTotalTime((prev) => prev + 30);
    setIsActive(true);
  };

  const handleReset = () => {
    setSecondsRemaining(defaultSeconds);
    setTotalTime(defaultSeconds);
    setIsActive(true);
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-40 bg-[#18161E] border border-[#7C5CFF]/40 shadow-xl rounded-[16px] p-4 flex flex-col gap-2.5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#7C5CFF]" />
          <span className="text-xs font-bold text-[#F5F3F8] tracking-wide uppercase">
            Rest Interval
          </span>
          {secondsRemaining === 0 && (
            <span className="text-[10px] font-bold text-[#6FA876] bg-[#6FA876]/20 px-1.5 py-0.5 rounded">
              Ready!
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#A7A3AF] hover:text-[#F5F3F8] p-1 rounded-full cursor-pointer"
          title="Dismiss rest timer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold font-mono text-[#F5F3F8] tracking-tight">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-[10px] bg-[#121117] text-[#F5F3F8] border border-[#2A2733] hover:border-[#7C5CFF] cursor-pointer"
            title={isActive ? 'Pause' : 'Resume'}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={handleAdd30s}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] bg-[#121117] text-[#A58CFF] text-xs font-semibold border border-[#2A2733] hover:border-[#7C5CFF] cursor-pointer"
          >
            <Plus size={12} /> 30s
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-[10px] bg-[#121117] text-[#A7A3AF] border border-[#2A2733] hover:text-[#F5F3F8] cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#121117] rounded-full overflow-hidden border border-[#2A2733]/50">
        <div
          className="h-full bg-[#7C5CFF] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, (1 - progressRatio) * 100))}%` }}
        />
      </div>
    </div>
  );
};

/** Workout Completion Summary Section */
export const WorkoutCompletionSection: React.FC<{
  workout: WorkoutUiModel;
  totalXp: number;
}> = ({ workout, totalXp }) => {
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );

  return (
    <div className="w-full flex flex-col items-center text-center py-8 px-4">
      <div className="w-16 h-16 rounded-full bg-[#6FA876]/20 border border-[#6FA876]/40 flex items-center justify-center text-[#6FA876] mb-4">
        <Check size={32} strokeWidth={3} />
      </div>

      <h2 className="text-2xl font-bold text-[#F5F3F8] tracking-tight">Workout Complete</h2>
      <p className="text-sm font-semibold text-[#A7A3AF] mt-1">{workout.name}</p>
      <p className="text-xs text-[#77737F] mt-0.5">{workout.difficulty.replace('_', ' ')}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-6 bg-[#18161E] p-4 rounded-[16px] border border-[#2A2733]">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-[#F5F3F8]">
            {workout.exercises.length}
          </span>
          <span className="text-xs text-[#A7A3AF]">Exercises</span>
        </div>
        <div className="flex flex-col items-center border-l border-[#2A2733]">
          <span className="text-xl font-bold text-[#F5F3F8]">
            {completedSets} / {totalSets}
          </span>
          <span className="text-xs text-[#A7A3AF]">Sets Completed</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <span className="text-xs text-[#A7A3AF] font-semibold uppercase tracking-wider">
          Experience Awarded
        </span>
        <div className="text-3xl font-bold text-[#7C5CFF] tracking-tight mt-1">
          +{totalXp} <span className="text-base font-semibold text-[#A58CFF]">XP</span>
        </div>
      </div>
    </div>
  );
};

/** Empty State */
export const WorkoutEmptyState: React.FC<{
  onSetUpTraining: () => void;
}> = ({ onSetUpTraining }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#18161E] border border-[#2A2733] flex items-center justify-center text-[#A7A3AF] mb-5">
        <Dumbbell size={28} />
      </div>

      <h2 className="text-2xl font-bold text-[#F5F3F8] tracking-tight">No training plan yet</h2>
      <p className="text-sm text-[#A7A3AF] mt-2 max-w-sm">
        Set your goals, experience, schedule, equipment, and limitations to create your personalized 7-day training program.
      </p>

      <OCButton
        text="Set Up Training"
        onClick={onSetUpTraining}
        className="mt-6 w-full max-w-xs"
        variant="PRIMARY"
      />
    </div>
  );
};
