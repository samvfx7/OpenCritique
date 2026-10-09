import React, { useState } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import {
  WorkoutTopBar,
  WorkoutOverviewSection,
  ExerciseListSection,
  ExerciseNavigationTabs,
  ActiveExerciseSection,
  RestTimer,
  WorkoutCompletionSection,
  WorkoutUiModel,
} from './WorkoutSections';
import { SetValidator } from '../../domain/validation/SetValidator';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface WorkoutScreenProps {
  workout: WorkoutUiModel | null;
  onWorkoutFinished: (workout: WorkoutUiModel, earnedXp: number) => void;
  onSetUpTraining: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
  workout,
  onWorkoutFinished,
  onSetUpTraining,
}) => {
  // If the user hasn't explicitly entered a session, show the exact screenshot view
  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutUiModel | null>(workout);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validator] = useState(() => new SetValidator());

  const handleStartProgram = () => {
    if (activeWorkout) {
      setActiveSession(true);
      setCurrentExerciseIndex(0);
    } else {
      onSetUpTraining();
    }
  };

  const handleCompleteSet = (setId: string) => {
    if (!activeWorkout) return;
    let justDone = false;
    const updatedExercises = activeWorkout.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => {
        if (set.id === setId) {
          const nextState = !set.isCompleted;
          if (nextState) justDone = true;
          return { ...set, isCompleted: nextState };
        }
        return set;
      }),
    }));
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
    if (justDone) {
      setIsRestTimerOpen(true);
    }
  };

  const handleUpdateSet = (
    setId: string,
    updates: {
      reps?: number | null;
      weight?: number | null;
      duration?: number | null;
      distance?: number | null;
    }
  ) => {
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => {
        if (set.id === setId) {
          return {
            ...set,
            actualReps: updates.reps !== undefined ? updates.reps : set.actualReps,
            actualWeight: updates.weight !== undefined ? updates.weight : set.actualWeight,
            actualDuration: updates.duration !== undefined ? updates.duration : set.actualDuration,
            actualDistance: updates.distance !== undefined ? updates.distance : set.actualDistance,
          };
        }
        return set;
      }),
    }));
    setActiveWorkout({ ...activeWorkout, exercises: updatedExercises });
  };

  const handleNextExercise = () => {
    if (!activeWorkout) return;
    const nextIdx = currentExerciseIndex + 1;
    if (nextIdx >= activeWorkout.exercises.length) {
      setIsRestTimerOpen(false);
      setIsCompleted(true);
    } else {
      setCurrentExerciseIndex(nextIdx);
    }
  };

  const handleFinishDone = () => {
    if (!activeWorkout) return;
    onWorkoutFinished(activeWorkout, activeWorkout.estimatedXp);
    setIsCompleted(false);
    setActiveSession(false);
    setCurrentExerciseIndex(0);
  };

  // If active session is in progress, render the interactive session
  if (activeSession && activeWorkout) {
    if (isCompleted) {
      return (
        <div className="w-full max-w-sm mx-auto px-4 pb-28 flex flex-col">
          <OCTopHeader />
          <WorkoutCompletionSection
            workout={activeWorkout}
            totalXp={activeWorkout.estimatedXp}
          />
          <button
            onClick={handleFinishDone}
            className="w-full h-12 bg-[#734BE8] hover:bg-[#683FDC] text-white rounded-full font-semibold text-sm cursor-pointer mt-4"
          >
            Done
          </button>
        </div>
      );
    }

    const currentExercise = activeWorkout.exercises[currentExerciseIndex];

    return (
      <div className="w-full max-w-sm mx-auto px-4 pb-28 flex flex-col">
        <OCTopHeader />
        <WorkoutTopBar
          workoutName={currentExercise?.name || activeWorkout.name}
          exerciseIndex={currentExerciseIndex}
          totalExercises={activeWorkout.exercises.length}
          onExit={() => setActiveSession(false)}
        />

        <ExerciseNavigationTabs
          exercises={activeWorkout.exercises}
          currentIndex={currentExerciseIndex}
          onSelectIndex={setCurrentExerciseIndex}
        />

        {currentExercise && (
          <ActiveExerciseSection
            exercise={currentExercise}
            onCompleteSet={handleCompleteSet}
            onUpdateSet={handleUpdateSet}
            validator={validator}
          />
        )}

        <div className="w-full pt-2 flex gap-3">
          {currentExerciseIndex > 0 && (
            <button
              onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
              className="w-1/3 h-12 bg-[#18161E] border border-[#2A2733] text-[#F5F3F8] rounded-full font-semibold text-sm cursor-pointer"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNextExercise}
            className="flex-1 h-12 bg-[#734BE8] hover:bg-[#683FDC] text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#734BE8]/25"
          >
            <span>
              {currentExerciseIndex === activeWorkout.exercises.length - 1
                ? 'Finish Workout'
                : 'Next Exercise'}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>

        <RestTimer
          isOpen={isRestTimerOpen}
          onClose={() => setIsRestTimerOpen(false)}
          defaultSeconds={60}
        />
      </div>
    );
  }

  // DEFAULT VIEW: Variation 4 style
  return (
    <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist">
      {/* Top Header */}
      <OCTopHeader />

      {/* Section Label & Title */}
      <div className="mb-6 mt-2">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-2">
          Your training starts here
        </div>
        <h1 className="text-[2.5rem] font-[800] tracking-[-0.04em] leading-[0.95] text-white">
          Build your program<span className="text-[#8B5CF6]">.</span>
        </h1>
        <p className="text-sm text-white/60 mt-3 leading-relaxed">
          Create a weekly plan around your goal, schedule, equipment, and experience.
        </p>
      </div>

      {/* Feature 01 */}
      <div className="py-4 flex gap-4 items-start">
        <span className="font-space text-xs font-bold text-[#8B5CF6] pt-0.5">
          01
        </span>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-white">Made for your week</h2>
          <p className="text-xs text-white/60 mt-1 leading-relaxed">
            Training, rest and recovery in one clear plan.
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/10" />

      {/* Feature 02 */}
      <div className="py-4 flex gap-4 items-start">
        <span className="font-space text-xs font-bold text-[#8B5CF6] pt-0.5">
          02
        </span>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-white">Adapt as you progress</h2>
          <p className="text-xs text-white/60 mt-1 leading-relaxed">
            Replace exercises and move sessions anytime.
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/10 mb-8" />

      {/* Primary Action Button */}
      <button
        onClick={handleStartProgram}
        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] text-white p-4 rounded-[12px] font-[600] text-center border-none cursor-pointer transition-all shadow-lg shadow-[#8B5CF6]/20 text-sm flex items-center justify-center gap-2 mb-3"
      >
        <span>Build my program</span>
        <ArrowRight size={16} />
      </button>

      {/* Footnote */}
      <p className="font-space text-[0.65rem] text-white/50 leading-relaxed text-center">
        Six focused questions. All preferences stay on this device.
      </p>
    </div>
  );
};
