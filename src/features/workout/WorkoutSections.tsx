import React, { useState, useEffect } from 'react';
import {
  Check,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  X,
  AlertCircle,
  Dumbbell,
  Timer,
  ChevronRight,
  Sparkles,
  Edit2,
} from 'lucide-react';
import { OCRow } from '../../components/OCRow';
import { OCSectionHeader } from '../../components/OCSectionHeader';
import { OCButton } from '../../components/OCButton';
import { OCStatusPill } from '../../components/OCStatusPill';
import { MeasurementType, WorkoutDifficulty, AvailableEquipment } from '../../domain/model/types';
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
  instructions?: string | null;
  alternative?: string | null;
  restSeconds?: number;
  equipmentRequired?: AvailableEquipment;
  muscleGroup?: string;
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
    <div className="w-full flex flex-col py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-space text-[0.65rem] text-[#8B5CF6] font-bold tracking-[0.2em] uppercase">
          {exerciseIndex !== undefined ? 'ACTIVE SESSION' : 'WORKOUT OVERVIEW'}
        </span>
        {onExit && (
          <button
            onClick={onExit}
            className="font-space text-[0.65rem] text-white/40 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
          >
            Exit
          </button>
        )}
      </div>

      <div className="w-full flex justify-between items-baseline mt-0.5">
        <h1 className="text-2xl font-[800] text-white tracking-tight">{workoutName}</h1>
        {exerciseIndex !== undefined && totalExercises !== undefined && (
          <span className="font-space text-xs font-bold text-white/50">
            {exerciseIndex + 1} <span className="text-white/20">/</span> {totalExercises}
          </span>
        )}
      </div>

      {exerciseIndex !== undefined && totalExercises !== undefined && (
        <div className="w-full h-[3px] bg-black rounded-full mt-3 overflow-hidden border border-white/5">
          <div
            className="h-full bg-[#8B5CF6] rounded-full transition-all duration-300 ease-out"
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
    <div className="w-full flex flex-col pb-6 font-geist">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-space text-[0.65rem] font-bold text-[#8B5CF6] bg-[#8B5CF6]/15 px-2.5 py-1 rounded-[8px] border border-[#8B5CF6]/30 uppercase tracking-wider">
          {workout.difficulty.replace('_', ' ')}
        </span>
        <span className="font-space text-xs text-white/50 font-medium">· ~{workout.estimatedMinutes} min</span>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-[#121214] p-3 rounded-[18px] border border-white/10">
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <span className="text-xl font-bold text-white font-space">{workout.exercises.length}</span>
          <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider mt-0.5">Exercises</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center border-x border-white/10">
          <span className="text-xl font-bold text-white font-space">{totalSets}</span>
          <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider mt-0.5">Total Sets</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <span className="text-xl font-bold text-[#8B5CF6] font-space">+{workout.estimatedXp}</span>
          <span className="font-space text-[0.65rem] text-white/50 uppercase tracking-wider mt-0.5">XP Reward</span>
        </div>
      </div>
    </div>
  );
};

/** List of exercises in Planned Workout - Minimal compact list layout */
export const ExerciseListSection: React.FC<{
  exercises: ExerciseUiModel[];
  totalSessionSets?: number;
  completedSessionSets?: number;
  onEditExercise?: (exercise: ExerciseUiModel) => void;
}> = ({ exercises, totalSessionSets, completedSessionSets, onEditExercise }) => {
  const sessionTotal = totalSessionSets ?? exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const sessionCompleted = completedSessionSets ?? exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const sessionProgressPercent =
    sessionTotal > 0 ? Math.round((sessionCompleted / sessionTotal) * 100) : 0;

  return (
    <div className="w-full flex flex-col pb-4 font-geist">
      <div className="bg-[#121214] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {exercises.map((exercise, index) => {
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
                  {String(index + 1).padStart(2, '0')}
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

              {onEditExercise && (
                <button
                  onClick={() => onEditExercise(exercise)}
                  className="text-white/30 hover:text-white/70 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                  title="Edit prescription"
                >
                  <Edit2 size={13} />
                </button>
              )}
            </div>
          );
        })}
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
    <div className="w-full flex gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none select-none font-geist">
      {exercises.map((ex, idx) => {
        const isCurrent = idx === currentIndex;
        const allSetsDone = ex.sets.length > 0 && ex.sets.every((s) => s.isCompleted);

        return (
          <button
            key={ex.id}
            onClick={() => onSelectIndex(idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] font-space text-xs transition-all shrink-0 cursor-pointer border ${
              isCurrent
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white font-bold shadow-md shadow-[#8B5CF6]/20'
                : allSetsDone
                ? 'bg-[#121214] border-[#8B5CF6]/40 text-white hover:border-[#8B5CF6]'
                : 'bg-[#121214]/60 border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            {allSetsDone && <Check size={12} strokeWidth={3} className="text-[#8B5CF6]" />}
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
  totalSessionSets?: number;
  completedSessionSets?: number;
}> = ({
  exercise,
  onCompleteSet,
  onUpdateSet,
  validator,
  totalSessionSets,
  completedSessionSets,
}) => {
  const completedSetsCount = exercise.sets.filter((s) => s.isCompleted).length;
  const sessionTotal = totalSessionSets ?? exercise.sets.length;
  const sessionCompleted = completedSessionSets ?? completedSetsCount;
  const sessionProgressPercent =
    sessionTotal > 0 ? Math.round((sessionCompleted / sessionTotal) * 100) : 0;

  return (
    <div className="w-full flex flex-col pb-4 font-geist">
      {/* Restructured Premium Exercise Header Card */}
      <div className="w-full bg-[#121214] rounded-[22px] p-5 border border-white/10 mb-4 shadow-xl relative overflow-hidden font-geist">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Kicker & Measurement Type Tag */}
        <div className="flex items-center justify-between gap-3 mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-space text-[0.62rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
              CURRENT MOVEMENT
            </span>
            <span className="text-white/20 text-xs">/</span>
            <span className="font-space text-[0.62rem] text-white/50 tracking-wider">
              {completedSetsCount} OF {exercise.sets.length} SETS DONE
            </span>
          </div>

          <span className="font-space text-[0.62rem] font-bold text-white/70 bg-white/5 px-2.5 py-0.5 rounded-[6px] border border-white/10 uppercase tracking-wider shrink-0">
            {exercise.measurementType.replace('_', ' ')}
          </span>
        </div>

        {/* Exercise Name - Bold & Clean Typography */}
        <h2 className="text-2xl sm:text-[1.65rem] font-[800] text-white tracking-tight leading-tight mb-2 relative z-10">
          {exercise.name}
        </h2>

        {/* Target Metrics Strip */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-2 px-3 bg-black/60 border border-white/5 rounded-[12px] font-space text-[0.7rem] relative z-10">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            <span>{exercise.sets.length} Target Sets</span>
          </div>
          <span className="text-white/20">·</span>
          <div className="text-[#8B5CF6] font-semibold">
            {formatSetTarget(exercise.sets[0]) || 'Prescribed Load'}
          </div>
          <span className="text-white/20">·</span>
          <div className="text-white/50">
            {exercise.restSeconds || 60}s Rest Interval
          </div>
          {exercise.equipmentRequired && exercise.equipmentRequired !== 'NONE' && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-white/40 uppercase text-[0.65rem]">
                {exercise.equipmentRequired.replace('_', ' ')}
              </span>
            </>
          )}
        </div>

        {/* Dedicated 'note' badge section with session progress indicator */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2.5 relative z-10">
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <span className="font-space text-[0.6rem] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#8B5CF6]/15 px-2 py-0.5 rounded-[6px] border border-[#8B5CF6]/30">
              NOTE
            </span>
            <span
              title="Progress through session total sets"
              className="font-space text-[0.6rem] font-bold text-white/80 bg-white/5 px-2 py-0.5 rounded-[6px] border border-white/10 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span>{sessionProgressPercent}%</span>
            </span>
          </div>
          <p className="text-xs text-white/75 leading-relaxed font-geist flex-1">
            {exercise.note || exercise.instructions || 'Maintain controlled eccentric tempo, neutral spine, and full range of motion.'}
          </p>
        </div>

        {/* Safe Alternative (if provided) */}
        {exercise.alternative && (
          <div className="mt-2.5 flex items-center gap-2 font-space text-[0.65rem] text-white/40 relative z-10">
            <span className="uppercase text-white/30 tracking-wider">Alternative:</span>
            <span className="text-white/70 font-medium">{exercise.alternative}</span>
          </div>
        )}
      </div>

      {/* Sets Checklist & Tactile Stepper Inputs */}
      <div className="flex flex-col gap-2.5">
        {exercise.sets.map((set) => {
          const isDone = !!set.isCompleted;

          // Determine current working values
          const activeReps =
            set.actualReps !== undefined && set.actualReps !== null
              ? set.actualReps
              : set.targetReps ?? null;
          const activeWeight =
            set.actualWeight !== undefined && set.actualWeight !== null
              ? set.actualWeight
              : set.targetWeight ?? null;
          const activeDuration =
            set.actualDuration !== undefined && set.actualDuration !== null
              ? set.actualDuration
              : set.targetDuration ?? null;
          const activeDistance =
            set.actualDistance !== undefined && set.actualDistance !== null
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
              className={`w-full rounded-[18px] p-3.5 flex flex-col gap-3 transition-all border ${
                isDone
                  ? 'bg-[#121214] border-[#8B5CF6]/50 shadow-sm shadow-[#8B5CF6]/5'
                  : 'bg-[#121214] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Set Title, Target & Quick Complete Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-space text-[0.65rem] font-bold ${
                      isDone
                        ? 'bg-[#8B5CF6] text-white shadow-sm'
                        : 'bg-black text-white/50 border border-white/10'
                    }`}
                  >
                    {set.setNumber}
                  </span>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Set {set.setNumber}
                      </span>
                      {isDone && (
                        <span className="font-space text-[0.6rem] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#8B5CF6]/15 px-1.5 py-0.2 rounded border border-[#8B5CF6]/30">
                          DONE
                        </span>
                      )}
                    </div>
                    <span className="font-space text-[0.65rem] text-white/50 mt-0.5">
                      Target: {formatSetTarget(set) || 'Standard load'}
                    </span>
                  </div>
                </div>

                {/* Tactile 44px Touch-Target Complete Button */}
                <button
                  type="button"
                  onClick={() => onCompleteSet(set.id)}
                  aria-label={isDone ? 'Mark set incomplete' : 'Mark set complete'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isDone
                      ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 scale-105'
                      : 'bg-black border border-white/20 text-white/30 hover:border-[#8B5CF6] hover:text-[#8B5CF6]'
                  }`}
                >
                  {isDone ? <Check size={18} strokeWidth={3} /> : <Circle size={16} />}
                </button>
              </div>

              {/* Dynamic Measurement Inputs with Quick Steppers */}
              <div className="pt-1 border-t border-white/5">
                {set.measurementType === 'WEIGHT_REPS' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Weight (kg) stepper */}
                    <div className="flex flex-col gap-1">
                      <label className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                        Weight (kg)
                      </label>
                      <div className="flex items-center bg-black border border-white/10 focus-within:border-[#8B5CF6] rounded-[12px] p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = activeWeight ?? 0;
                            const next = Math.max(0, cur - 2.5);
                            onUpdateSet(set.id, { weight: next });
                          }}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0"
                          value={activeWeight ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            onUpdateSet(set.id, { weight: val });
                          }}
                          className="flex-1 bg-transparent text-center font-space text-sm font-bold text-white outline-none w-10"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = activeWeight ?? 0;
                            const next = cur + 2.5;
                            onUpdateSet(set.id, { weight: next });
                          }}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Reps stepper */}
                    <div className="flex flex-col gap-1">
                      <label className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                        Reps
                      </label>
                      <div className="flex items-center bg-black border border-white/10 focus-within:border-[#8B5CF6] rounded-[12px] p-1">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = activeReps ?? 0;
                            const next = Math.max(1, cur - 1);
                            onUpdateSet(set.id, { reps: next });
                          }}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          step="1"
                          min="1"
                          placeholder="0"
                          value={activeReps ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                            onUpdateSet(set.id, { reps: val });
                          }}
                          className="flex-1 bg-transparent text-center font-space text-sm font-bold text-white outline-none w-10"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = activeReps ?? 0;
                            const next = cur + 1;
                            onUpdateSet(set.id, { reps: next });
                          }}
                          className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {set.measurementType === 'REPS' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                      Reps Completed
                    </label>
                    <div className="flex items-center bg-black border border-white/10 focus-within:border-[#8B5CF6] rounded-[12px] p-1 max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeReps ?? 0;
                          const next = Math.max(1, cur - 1);
                          onUpdateSet(set.id, { reps: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        placeholder="0"
                        value={activeReps ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          onUpdateSet(set.id, { reps: val });
                        }}
                        className="flex-1 bg-transparent text-center font-space text-sm font-bold text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeReps ?? 0;
                          const next = cur + 1;
                          onUpdateSet(set.id, { reps: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {set.measurementType === 'DURATION' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                      Duration (seconds)
                    </label>
                    <div className="flex items-center bg-black border border-white/10 focus-within:border-[#8B5CF6] rounded-[12px] p-1 max-w-[220px]">
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeDuration ?? 0;
                          const next = Math.max(5, cur - 5);
                          onUpdateSet(set.id, { duration: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        step="5"
                        min="1"
                        placeholder="0"
                        value={activeDuration ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          onUpdateSet(set.id, { duration: val });
                        }}
                        className="flex-1 bg-transparent text-center font-space text-sm font-bold text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeDuration ?? 0;
                          const next = cur + 5;
                          onUpdateSet(set.id, { duration: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {set.measurementType === 'DISTANCE' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-space text-[0.6rem] uppercase tracking-wider text-white/50">
                      Distance (meters)
                    </label>
                    <div className="flex items-center bg-black border border-white/10 focus-within:border-[#8B5CF6] rounded-[12px] p-1 max-w-[240px]">
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeDistance ?? 0;
                          const next = Math.max(50, cur - 50);
                          onUpdateSet(set.id, { distance: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        step="50"
                        min="1"
                        placeholder="0"
                        value={activeDistance ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          onUpdateSet(set.id, { distance: val });
                        }}
                        className="flex-1 bg-transparent text-center font-space text-sm font-bold text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cur = activeDistance ?? 0;
                          const next = cur + 50;
                          onUpdateSet(set.id, { distance: next });
                        }}
                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white rounded-[8px] bg-white/5 hover:bg-white/10 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Inline Validation Warnings */}
              {!validation.isValid && (
                <div className="flex items-center gap-1.5 font-space text-[0.65rem] text-[#8B5CF6] mt-1 pt-1 border-t border-white/5">
                  <AlertCircle size={12} className="shrink-0" />
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
    <div className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-40 bg-[#121214] border border-[#8B5CF6]/40 shadow-2xl rounded-[18px] p-4 flex flex-col gap-2.5 backdrop-blur-md font-geist">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#8B5CF6]" />
          <span className="font-space text-xs font-bold text-white tracking-wide uppercase">
            REST INTERVAL
          </span>
          {secondsRemaining === 0 && (
            <span className="font-space text-[10px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/20 px-1.5 py-0.5 rounded">
              Ready!
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
          title="Dismiss rest timer"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-3xl font-[800] font-mono text-white tracking-tight">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-[10px] bg-black text-white border border-white/10 hover:border-[#8B5CF6] cursor-pointer transition-colors"
            title={isActive ? 'Pause' : 'Resume'}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={handleAdd30s}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] bg-black text-[#8B5CF6] text-xs font-semibold border border-white/10 hover:border-[#8B5CF6] cursor-pointer transition-colors"
          >
            <Plus size={12} /> 30s
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-[10px] bg-black text-white/50 border border-white/10 hover:text-white cursor-pointer transition-colors"
            title="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-black rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-[#8B5CF6] transition-all duration-300"
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
    <div className="w-full flex flex-col items-center text-center py-8 px-4 font-geist">
      <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mb-4 shadow-lg shadow-[#8B5CF6]/15">
        <Check size={32} strokeWidth={3} />
      </div>

      <h2 className="text-2xl font-[800] text-white tracking-tight">Workout Complete</h2>
      <p className="font-space text-sm font-semibold text-white/80 mt-1">{workout.name}</p>
      <p className="font-space text-xs text-white/40 mt-0.5">{workout.difficulty.replace('_', ' ')}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-6 bg-[#121214] p-4 rounded-[18px] border border-white/10 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-white font-space">
            {workout.exercises.length}
          </span>
          <span className="font-space text-[0.65rem] text-white/40 uppercase tracking-wider mt-0.5">Exercises</span>
        </div>
        <div className="flex flex-col items-center border-l border-white/10">
          <span className="text-xl font-bold text-white font-space">
            {completedSets} / {totalSets}
          </span>
          <span className="font-space text-[0.65rem] text-white/40 uppercase tracking-wider mt-0.5">Sets Completed</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <span className="font-space text-[0.65rem] text-white/40 uppercase tracking-[0.2em] font-bold">
          EXPERIENCE AWARDED
        </span>
        <div className="text-4xl font-[800] text-[#8B5CF6] tracking-tight mt-1 font-space drop-shadow-sm">
          +{totalXp} <span className="text-lg font-bold text-white/80">XP</span>
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
    <div className="w-full flex flex-col items-center justify-center text-center py-16 px-4 font-geist">
      <div className="w-16 h-16 rounded-full bg-[#121214] border border-white/10 flex items-center justify-center text-[#8B5CF6] mb-5 shadow-lg">
        <Dumbbell size={28} />
      </div>

      <h2 className="text-2xl font-[800] text-white tracking-tight">No training plan yet</h2>
      <p className="text-sm text-white/60 mt-2 max-w-sm leading-relaxed">
        Set your goals, experience, schedule, equipment, and limitations to create your personalized 7-day training program.
      </p>

      <button
        onClick={onSetUpTraining}
        className="mt-6 w-full max-w-xs bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white py-3.5 rounded-[12px] font-semibold text-xs font-space uppercase tracking-wider transition-all shadow-md shadow-[#8B5CF6]/20 cursor-pointer"
      >
        Set Up Training
      </button>
    </div>
  );
};
