import {
  Workout,
  Habit,
  HabitCompletion,
  TrainingProgram,
  XpEvent,
  HABIT_XP_POLICY,
  HabitDifficulty,
  TimeOfDay,
} from '../model/types';
import { WorkoutXpPolicy } from '../xp/WorkoutXpPolicy';

const STORAGE_KEY_XP = 'opencritique_total_xp';
const STORAGE_KEY_HABITS = 'opencritique_habits';
const STORAGE_KEY_COMPLETIONS = 'opencritique_habit_completions';
const STORAGE_KEY_WORKOUTS = 'opencritique_workouts';
const STORAGE_KEY_ACTIVE_WORKOUT_ID = 'opencritique_active_workout_id';
const STORAGE_KEY_PROGRAMS = 'opencritique_programs';
const STORAGE_KEY_RECENT_ACTIVITY = 'opencritique_recent_activity';
const STORAGE_KEY_COMPLETED_WORKOUTS_COUNT = 'opencritique_completed_workouts_count';

export interface RecentActivity {
  id: string;
  title: string;
  date: string;
  xpEarned: number;
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'task-1',
    name: 'Morning Mobility Routine',
    description: '15-minute hip and shoulder mobility routine',
    difficulty: 'MODERATE',
    timeOfDay: 'MORNING',
    createdAtEpochMillis: Date.now() - 86400000,
  },
  {
    id: 'task-2',
    name: 'Hydration 1.5L',
    description: 'Drink 1.5 liters of water before noon',
    difficulty: 'EASY',
    timeOfDay: 'MORNING',
    createdAtEpochMillis: Date.now() - 86400000 * 2,
  },
  {
    id: 'task-3',
    name: 'Nutrient-Dense Lunch',
    description: 'High-protein whole food nourishment',
    difficulty: 'EASY',
    timeOfDay: 'NOON',
    createdAtEpochMillis: Date.now() - 86400000 * 3,
  },
  {
    id: 'task-4',
    name: 'Mid-Day Posture Reset',
    description: '5-minute chest opening & spinal extension',
    difficulty: 'EASY',
    timeOfDay: 'NOON',
    createdAtEpochMillis: Date.now() - 86400000 * 3.5,
  },
  {
    id: 'task-5',
    name: 'Afternoon Training Session',
    description: 'Hypertrophy or conditioning scheduled block',
    difficulty: 'HARD',
    timeOfDay: 'AFTERNOON',
    createdAtEpochMillis: Date.now() - 86400000 * 4,
  },
  {
    id: 'task-6',
    name: 'Evening Stretch & Unwind',
    description: 'Hamstring & hip decompression',
    difficulty: 'EASY',
    timeOfDay: 'NIGHT',
    createdAtEpochMillis: Date.now() - 86400000 * 5,
  },
  {
    id: 'task-7',
    name: 'Sleep 8 Hours (Zero Screens)',
    description: 'High-quality recovery with zero screens before bed',
    difficulty: 'HARD',
    timeOfDay: 'NIGHT',
    createdAtEpochMillis: Date.now() - 86400000 * 6,
  },
];

const DEFAULT_COMPLETIONS: HabitCompletion[] = [
  {
    id: 'comp-1',
    habitId: 'task-2',
    completedAtEpochMillis: Date.now() - 3600000,
  },
];

const DEFAULT_WORKOUT: Workout = {
  id: 'workout-1',
  name: 'Upper Body',
  difficulty: 'UPPER_BODY',
  description: 'Chest, back, and arm hyper-focus session',
  createdAtEpochMillis: Date.now() - 86400000 * 2,
  exercises: [
    {
      id: 'ex-1',
      exerciseId: 'bench-press',
      order: 1,
      note: 'Focus on explosive concentric phase',
      sets: [
        { id: 'set-1-1', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 8, weightKg: 40.0 },
        { id: 'set-1-2', index: 2, measurementType: 'WEIGHT_REPS', repetitions: 8, weightKg: 40.0 },
        { id: 'set-1-3', index: 3, measurementType: 'WEIGHT_REPS', repetitions: 8, weightKg: 40.0 },
      ],
    },
    {
      id: 'ex-2',
      exerciseId: 'pull-up',
      order: 2,
      note: 'Full range of motion, dead hang at bottom',
      sets: [
        { id: 'set-2-1', index: 1, measurementType: 'REPS', repetitions: 6 },
        { id: 'set-2-2', index: 2, measurementType: 'REPS', repetitions: 6 },
        { id: 'set-2-3', index: 3, measurementType: 'REPS', repetitions: 6 },
      ],
    },
    {
      id: 'ex-3',
      exerciseId: 'shoulder-press',
      order: 3,
      note: 'Keep core engaged',
      sets: [
        { id: 'set-3-1', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 10, weightKg: 25.0 },
        { id: 'set-3-2', index: 2, measurementType: 'WEIGHT_REPS', repetitions: 10, weightKg: 25.0 },
        { id: 'set-3-3', index: 3, measurementType: 'WEIGHT_REPS', repetitions: 10, weightKg: 25.0 },
      ],
    },
    {
      id: 'ex-4',
      exerciseId: 'biceps-curl',
      order: 4,
      note: 'Control the eccentric tempo',
      sets: [
        { id: 'set-4-1', index: 1, measurementType: 'WEIGHT_REPS', repetitions: 12, weightKg: 12.0 },
        { id: 'set-4-2', index: 2, measurementType: 'WEIGHT_REPS', repetitions: 12, weightKg: 12.0 },
      ],
    },
  ],
};

const DEFAULT_RECENT_ACTIVITIES: RecentActivity[] = [
  { id: 'activity-1', title: 'Upper Body completed', date: 'Today', xpEarned: 90 },
  { id: 'activity-2', title: 'Mobility completed', date: 'Yesterday', xpEarned: 20 },
  { id: 'activity-3', title: 'Full Body completed', date: 'Monday', xpEarned: 150 },
];

export const LocalStorageService = {
  isReady(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  },

  getTotalXp(): number {
    if (!this.isReady()) return 0;
    const val = localStorage.getItem(STORAGE_KEY_XP);
    return val ? parseInt(val, 10) : 0;
  },

  setTotalXp(xp: number): void {
    if (!this.isReady()) return;
    localStorage.setItem(STORAGE_KEY_XP, xp.toString());
  },

  addXp(amount: number, title?: string): number {
    const current = this.getTotalXp();
    const updated = Math.max(0, current + amount);
    this.setTotalXp(updated);

    if (title && amount > 0) {
      this.addRecentActivity({
        id: `act-${Date.now()}`,
        title,
        date: 'Just now',
        xpEarned: amount,
      });
    }

    return updated;
  },

  getHabits(): Habit[] {
    if (!this.isReady()) return DEFAULT_HABITS;
    const data = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(DEFAULT_HABITS));
      return DEFAULT_HABITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_HABITS;
    }
  },

  saveHabits(habits: Habit[]): void {
    if (!this.isReady()) return;
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  },

  createHabit(name: string, difficulty: HabitDifficulty, timeOfDay: TimeOfDay): Habit {
    const habits = this.getHabits();
    const newHabit: Habit = {
      id: `task-${Date.now()}`,
      name,
      difficulty,
      timeOfDay,
      createdAtEpochMillis: Date.now(),
    };
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  },

  deleteHabit(habitId: string): void {
    const habits = this.getHabits().filter((h) => h.id !== habitId);
    this.saveHabits(habits);
    const completions = this.getHabitCompletions().filter((c) => c.habitId !== habitId);
    if (this.isReady()) {
      localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
    }
  },

  getHabitCompletions(): HabitCompletion[] {
    if (!this.isReady()) return DEFAULT_COMPLETIONS;
    const data = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(DEFAULT_COMPLETIONS));
      return DEFAULT_COMPLETIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_COMPLETIONS;
    }
  },

  toggleHabitCompletion(habitId: string): { completed: boolean; xpDelta: number } {
    const habits = this.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return { completed: false, xpDelta: 0 };

    const completions = this.getHabitCompletions();
    const existingIndex = completions.findIndex((c) => c.habitId === habitId);
    const xpReward = HABIT_XP_POLICY[habit.difficulty];

    if (existingIndex >= 0) {
      // Uncomplete
      completions.splice(existingIndex, 1);
      localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
      this.addXp(-xpReward);
      return { completed: false, xpDelta: -xpReward };
    } else {
      // Complete
      completions.push({
        id: `comp-${Date.now()}`,
        habitId,
        completedAtEpochMillis: Date.now(),
      });
      localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
      this.addXp(xpReward, `${habit.name} completed`);
      return { completed: true, xpDelta: xpReward };
    }
  },

  getWorkouts(): Workout[] {
    if (!this.isReady()) return [DEFAULT_WORKOUT];
    const data = localStorage.getItem(STORAGE_KEY_WORKOUTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify([DEFAULT_WORKOUT]));
      return [DEFAULT_WORKOUT];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [DEFAULT_WORKOUT];
    }
  },

  getTodayWorkout(): Workout | null {
    const workouts = this.getWorkouts();
    return workouts[0] || null;
  },

  saveWorkout(workout: Workout): void {
    if (!this.isReady()) return;
    const list = this.getWorkouts().filter((w) => w.id !== workout.id);
    list.unshift(workout);
    localStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify(list));
  },

  getRecentActivities(): RecentActivity[] {
    if (!this.isReady()) return DEFAULT_RECENT_ACTIVITIES;
    const data = localStorage.getItem(STORAGE_KEY_RECENT_ACTIVITY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_RECENT_ACTIVITY, JSON.stringify(DEFAULT_RECENT_ACTIVITIES));
      return DEFAULT_RECENT_ACTIVITIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_RECENT_ACTIVITIES;
    }
  },

  addRecentActivity(activity: RecentActivity): void {
    if (!this.isReady()) return;
    const acts = this.getRecentActivities();
    acts.unshift(activity);
    localStorage.setItem(STORAGE_KEY_RECENT_ACTIVITY, JSON.stringify(acts.slice(0, 15)));
  },

  getCompletedWorkoutsCount(): number {
    if (!this.isReady()) return 0;
    const val = localStorage.getItem(STORAGE_KEY_COMPLETED_WORKOUTS_COUNT);
    return val ? parseInt(val, 10) : 0;
  },

  incrementCompletedWorkoutsCount(): number {
    const count = this.getCompletedWorkoutsCount() + 1;
    if (this.isReady()) {
      localStorage.setItem(STORAGE_KEY_COMPLETED_WORKOUTS_COUNT, count.toString());
    }
    return count;
  },

  resetAll(): void {
    if (!this.isReady()) return;
    localStorage.removeItem(STORAGE_KEY_XP);
    localStorage.removeItem(STORAGE_KEY_HABITS);
    localStorage.removeItem(STORAGE_KEY_COMPLETIONS);
    localStorage.removeItem(STORAGE_KEY_WORKOUTS);
    localStorage.removeItem(STORAGE_KEY_PROGRAMS);
    localStorage.removeItem(STORAGE_KEY_RECENT_ACTIVITY);
    localStorage.removeItem(STORAGE_KEY_COMPLETED_WORKOUTS_COUNT);
  },
};
