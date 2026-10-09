import React, { useState, useEffect, useCallback } from 'react';
import { OCBottomNavigation, PrimaryDestination } from './components/OCBottomNavigation';
import { HomeScreen } from './features/home/HomeScreen';
import { WorkoutScreen } from './features/workout/WorkoutScreen';
import { AiCoachScreen } from './features/aicoach/AiCoachScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { BuildProgramModal } from './components/BuildProgramModal';
import { LocalStorageService, RecentActivity } from './domain/storage/localStorageService';
import { HomeTaskItem } from './features/home/HomeSections';
import { WorkoutUiModel } from './features/workout/WorkoutSections';
import { WorkoutXpPolicy } from './domain/xp/WorkoutXpPolicy';
import { HABIT_XP_POLICY, Workout, HabitDifficulty, TimeOfDay } from './domain/model/types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<PrimaryDestination>('HOME');
  const [totalXp, setTotalXp] = useState<number>(0);
  const [tasks, setTasks] = useState<HomeTaskItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [activeWorkoutUi, setActiveWorkoutUi] = useState<WorkoutUiModel | null>(null);
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState<number>(0);
  const [isBuildProgramOpen, setIsBuildProgramOpen] = useState(false);

  // Helper to convert domain Workout to WorkoutUiModel
  const mapWorkoutToUi = useCallback((workout: Workout): WorkoutUiModel => {
    const exerciseNames: Record<string, string> = {
      'bench-press': 'Bench Press',
      'pull-up': 'Pull-Up',
      'shoulder-press': 'Shoulder Press',
      'biceps-curl': 'Biceps Curl',
    };

    return {
      id: workout.id,
      name: workout.name,
      difficulty: workout.difficulty,
      estimatedMinutes: 45,
      estimatedXp: WorkoutXpPolicy.xpForDifficulty(workout.difficulty),
      exercises: workout.exercises.map((ex, idx) => ({
        id: ex.id,
        name: exerciseNames[ex.exerciseId] || `Exercise ${idx + 1}`,
        measurementType: ex.sets[0]?.measurementType || 'WEIGHT_REPS',
        note: ex.note,
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
      })),
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
  const handleApplyProgram = (programName: string, workouts: WorkoutUiModel[]) => {
    if (workouts.length > 0) {
      setActiveWorkoutUi(workouts[0]);
    }
    loadAppState();
    setCurrentTab('WORKOUT');
  };

  const handleResetData = () => {
    LocalStorageService.resetAll();
    loadAppState();
  };

  const completedHabitsCount = tasks.filter((t) => t.completed).length;

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
            onStartWorkout={() => setIsBuildProgramOpen(true)}
            onViewPlan={() => setCurrentTab('WORKOUT')}
            onNavigateToProfile={() => setCurrentTab('PROFILE')}
          />
        )}

        {currentTab === 'WORKOUT' && (
          <WorkoutScreen
            workout={activeWorkoutUi}
            onWorkoutFinished={handleWorkoutFinished}
            onSetUpTraining={() => setIsBuildProgramOpen(true)}
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
          />
        )}
      </main>

      {/* Floating pill navigation bar (with border-radius: 30px preserved) */}
      <OCBottomNavigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 6-Question Build Program Onboarding Modal */}
      <BuildProgramModal
        isOpen={isBuildProgramOpen}
        onClose={() => setIsBuildProgramOpen(false)}
        onProgramGenerated={handleApplyProgram}
      />
    </div>
  );
};
