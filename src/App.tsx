import React, { useState, useEffect, useCallback } from 'react';
import { OCBottomNavigation, PrimaryDestination } from './components/OCBottomNavigation';
import { HomeScreen } from './features/home/HomeScreen';
import { WorkoutScreen } from './features/workout/WorkoutScreen';
import { AiCoachScreen } from './features/aicoach/AiCoachScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { FirstLaunchOnboarding } from './features/onboarding/FirstLaunchOnboarding';
import { LocalStorageService, RecentActivity } from './domain/storage/localStorageService';
import { HomeTaskItem } from './features/home/HomeSections';
import { WorkoutUiModel } from './features/workout/WorkoutSections';
import { WorkoutXpPolicy } from './domain/xp/WorkoutXpPolicy';
import { HABIT_XP_POLICY, Workout, HabitDifficulty, TimeOfDay, WeeklyProgram } from './domain/model/types';
import { EXERCISE_LIBRARY } from './domain/program/ExerciseLibrary';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<PrimaryDestination>('HOME');
  const [totalXp, setTotalXp] = useState<number>(0);
  const [tasks, setTasks] = useState<HomeTaskItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activeWorkoutUi, setActiveWorkoutUi] = useState<WorkoutUiModel | null>(null);
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState<number>(0);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => LocalStorageService.isOnboardingCompleted());
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Helper to convert domain Workout to WorkoutUiModel
  const mapWorkoutToUi = useCallback((workout: Workout): WorkoutUiModel => {
    const exerciseDetails: Record<
      string,
      { name: string; note: string; instructions: string; alternative?: string; restSeconds: number }
    > = {
      'bench-press': {
        name: 'Bench Press',
        note: 'Keep shoulder blades retracted and drive feet firmly into the floor.',
        instructions: 'Lower bar with 45-degree elbow path until light chest touch, press to full lockout.',
        alternative: 'Floor Press or Incline Dumbbell Press',
        restSeconds: 90,
      },
      'pull-up': {
        name: 'Pull-Up',
        note: 'Full range of motion, dead hang at bottom, chin clearing bar.',
        instructions: 'Engage lats from dead hang, pull chest toward bar, control eccentric descent.',
        alternative: 'Inverted Bodyweight Rows or Resistance Band Assisted Pull-Ups',
        restSeconds: 90,
      },
      'shoulder-press': {
        name: 'Shoulder Press',
        note: 'Keep core engaged and ribcage pinned down; do not arch lumbar spine.',
        instructions: 'Press dumbbells vertically overhead in front of ears, brace abdominal wall.',
        alternative: 'Seated Dumbbell Overhead Press or Pike Push-Ups',
        restSeconds: 75,
      },
      'biceps-curl': {
        name: 'Biceps Curl',
        note: 'Control the eccentric tempo; eliminate swinging or lumbar momentum.',
        instructions: 'Supinate wrists as you curl, keep elbows pinned at sides, lower slowly under tension.',
        alternative: 'Incline Bench Dumbbell Curls',
        restSeconds: 60,
      },
    };

    return {
      id: workout.id,
      name: workout.name,
      difficulty: workout.difficulty,
      estimatedMinutes: 45,
      estimatedXp: WorkoutXpPolicy.xpForDifficulty(workout.difficulty),
      exercises: workout.exercises.map((ex, idx) => {
        const detail = exerciseDetails[ex.exerciseId];
        const libDef = EXERCISE_LIBRARY.find((item) => item.id === ex.exerciseId);
        const resolvedName = libDef?.name || detail?.name || ex.exerciseId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const resolvedNote = ex.note || detail?.note || `Controlled tempo, neutral spine, and full range of motion.`;
        const resolvedInstructions = libDef?.instructions || detail?.instructions || 'Execute each repetition with strict form and intentional contraction.';
        const resolvedAlternative = libDef?.alternative || detail?.alternative;
        const resolvedRest = libDef?.defaultRestSeconds || detail?.restSeconds || 60;

        return {
          id: ex.id,
          name: resolvedName,
          measurementType: ex.sets[0]?.measurementType || libDef?.measurementType || 'WEIGHT_REPS',
          note: resolvedNote,
          instructions: resolvedInstructions,
          alternative: resolvedAlternative,
          restSeconds: resolvedRest,
          equipmentRequired: libDef?.equipmentRequired,
          muscleGroup: libDef?.muscleGroup,
          sets: ex.sets.map((s) => ({
            id: s.id,
            setNumber: s.index,
            measurementType: s.measurementType,
            targetReps: s.repetitions,
            targetWeight: s.weightKg,
            targetDuration: s.durationSeconds,
            targetDistance: s.distanceMeters,
            actualReps: s.repetitions,
            actualWeight: s.weightKg,
            actualDuration: s.durationSeconds,
            actualDistance: s.distanceMeters,
            isCompleted: false,
          })),
        };
      }),
    };
  }, []);

  // Reload data from LocalStorage
  const loadAppState = useCallback(() => {
    const xp = LocalStorageService.getTotalXp();
    setTotalXp(xp);

    const habits = LocalStorageService.getHabits();
    const completions = LocalStorageService.getHabitCompletions();
    const completedSet = new Set(completions.map((c) => c.habitId));

    const taskItems: HomeTaskItem[] = habits.map((h) => ({
      id: h.id,
      name: h.name,
      difficulty: h.difficulty,
      completed: completedSet.has(h.id),
      xpValue: HABIT_XP_POLICY[h.difficulty],
      timeOfDay: h.timeOfDay || 'MORNING',
    }));
    setTasks(taskItems);

    setRecentActivities(LocalStorageService.getRecentActivities());
    setCompletedWorkoutsCount(LocalStorageService.getCompletedWorkoutsCount());

    const w = LocalStorageService.getTodayWorkout();
    if (w) {
      setActiveWorkoutUi(mapWorkoutToUi(w));
    }
  }, [mapWorkoutToUi]);

  useEffect(() => {
    loadAppState();
  }, [loadAppState]);

  // Task click handler
  const handleTaskClick = (taskId: string) => {
    LocalStorageService.toggleHabitCompletion(taskId);
    loadAppState();
  };

  const handleAddTask = (name: string, difficulty: HabitDifficulty, timeOfDay: TimeOfDay) => {
    LocalStorageService.createHabit(name, difficulty, timeOfDay);
    loadAppState();
  };

  const handleDeleteTask = (taskId: string) => {
    LocalStorageService.deleteHabit(taskId);
    loadAppState();
  };

  // Workout completed
  const handleWorkoutFinished = (workout: WorkoutUiModel, earnedXp: number) => {
    LocalStorageService.addXp(earnedXp, `${workout.name} completed`);
    LocalStorageService.incrementCompletedWorkoutsCount();
    loadAppState();
    setCurrentTab('HOME');
  };

  // Program generator applied
  const handleApplyProgram = (programName: string, workouts: WorkoutUiModel[], program?: WeeklyProgram) => {
    if (workouts.length > 0) {
      setActiveWorkoutUi(workouts[0]);
    }
    setIsOnboarded(true);
    loadAppState();
    setCurrentTab('WORKOUT');
  };

  const handleResetData = () => {
    LocalStorageService.resetAll();
    setIsOnboarded(false);
    loadAppState();
    setCurrentTab('HOME');
  };

  const completedHabitsCount = tasks.filter((t) => t.completed).length;

  // Requirement 1 & 2: First-launch onboarding flow appears when user has not completed setup
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-white">
        <FirstLaunchOnboarding
          initialPreferences={LocalStorageService.getUserPreferences()}
          onComplete={(program, workouts) => {
            handleApplyProgram(program.name, workouts, program);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white antialiased">
      <main className="max-w-[400px] mx-auto min-h-screen flex flex-col pt-1">
        {currentTab === 'HOME' && (
          <HomeScreen
            totalXp={totalXp}
            tasks={tasks}
            onTaskClicked={handleTaskClick}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onStartWorkout={() => setCurrentTab('WORKOUT')}
            onViewPlan={() => setCurrentTab('WORKOUT')}
            onNavigateToProfile={() => setCurrentTab('PROFILE')}
          />
        )}

        {currentTab === 'WORKOUT' && (
          <WorkoutScreen
            workout={activeWorkoutUi}
            onWorkoutFinished={handleWorkoutFinished}
            onSetUpTraining={() => setIsPreferencesOpen(true)}
          />
        )}

        {currentTab === 'AI_COACH' && (
          <AiCoachScreen
            onApplyNewProgram={handleApplyProgram}
            onNavigateToWorkout={() => setCurrentTab('WORKOUT')}
            workoutsCompletedCount={completedWorkoutsCount}
            totalXp={totalXp}
          />
        )}

        {currentTab === 'PROFILE' && (
          <ProfileScreen
            totalXp={totalXp}
            completedWorkoutsCount={completedWorkoutsCount}
            completedHabitsCount={completedHabitsCount}
            onResetData={handleResetData}
            onEditPreferences={() => setIsPreferencesOpen(true)}
          />
        )}
      </main>

      {/* Floating navigation bar */}
      <OCBottomNavigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Preferences / Program Reconfiguration Modal */}
      {isPreferencesOpen && (
        <FirstLaunchOnboarding
          isModalMode={true}
          initialPreferences={LocalStorageService.getUserPreferences()}
          onCancel={() => setIsPreferencesOpen(false)}
          onComplete={(program, workouts) => {
            handleApplyProgram(program.name, workouts, program);
            setIsPreferencesOpen(false);
          }}
        />
      )}
    </div>
  );
};
