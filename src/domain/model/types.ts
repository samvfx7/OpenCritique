export type MeasurementType = 'REPS' | 'WEIGHT_REPS' | 'DURATION' | 'DISTANCE';

export type WorkoutDifficulty =
  | 'LEG_DAY'
  | 'UPPER_BODY'
  | 'FULL_BODY'
  | 'CONDITIONING'
  | 'CALISTHENICS'
  | 'SPORT_PERFORMANCE';

export interface WorkoutSet {
  id: string;
  index: number;
  measurementType: MeasurementType;
  repetitions?: number | null;
  weightKg?: number | null;
  durationSeconds?: number | null;
  distanceMeters?: number | null;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSet[];
  note?: string | null;
}

export interface Workout {
  id: string;
  name: string;
  difficulty: WorkoutDifficulty;
  description?: string | null;
  exercises: WorkoutExercise[];
  createdAtEpochMillis: number;
}

export interface Exercise {
  id: string;
  name: string;
  measurementType: MeasurementType;
  muscleGroup?: string | null;
  notes?: string | null;
  isCustom?: boolean;
}

export type RankTierKey =
  | 'BEGINNER'
  | 'NOVICE'
  | 'APPRENTICE'
  | 'INTERMEDIATE'
  | 'SKILLED'
  | 'ADVANCED'
  | 'ELITE'
  | 'EXPERT'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'LEGEND'
  | 'APEX';

export interface RankTierInfo {
  key: RankTierKey;
  title: string;
  colorName: string;
  order: number;
  minXp: number;
  bgHex: string;
  accentHex: string;
  textHex: string;
}

export const RANK_TIERS: Record<RankTierKey, RankTierInfo> = {
  BEGINNER: {
    key: 'BEGINNER',
    title: 'Beginner',
    colorName: 'Bronze',
    order: 1,
    minXp: 0,
    bgHex: '#92400E',
    accentHex: '#F59E0B',
    textHex: '#FFFFFF',
  },
  NOVICE: {
    key: 'NOVICE',
    title: 'Novice',
    colorName: 'Silver',
    order: 2,
    minXp: 200,
    bgHex: '#0284C7',
    accentHex: '#38BDF8',
    textHex: '#FFFFFF',
  },
  APPRENTICE: {
    key: 'APPRENTICE',
    title: 'Apprentice',
    colorName: 'Jade',
    order: 3,
    minXp: 500,
    bgHex: '#047857',
    accentHex: '#10B981',
    textHex: '#FFFFFF',
  },
  INTERMEDIATE: {
    key: 'INTERMEDIATE',
    title: 'Intermediate',
    colorName: 'Garnet',
    order: 4,
    minXp: 1000,
    bgHex: '#BE123C',
    accentHex: '#F43F5E',
    textHex: '#FFFFFF',
  },
  SKILLED: {
    key: 'SKILLED',
    title: 'Skilled',
    colorName: 'Topaz',
    order: 5,
    minXp: 1500,
    bgHex: '#A16207',
    accentHex: '#EAB308',
    textHex: '#FFFFFF',
  },
  ADVANCED: {
    key: 'ADVANCED',
    title: 'Advanced',
    colorName: 'Citrine',
    order: 6,
    minXp: 2200,
    bgHex: '#C2410C',
    accentHex: '#F97316',
    textHex: '#FFFFFF',
  },
  ELITE: {
    key: 'ELITE',
    title: 'Elite',
    colorName: 'Sapphire',
    order: 7,
    minXp: 3000,
    bgHex: '#1D4ED8',
    accentHex: '#3B82F6',
    textHex: '#FFFFFF',
  },
  EXPERT: {
    key: 'EXPERT',
    title: 'Expert',
    colorName: 'Emerald',
    order: 8,
    minXp: 4000,
    bgHex: '#047857',
    accentHex: '#10B981',
    textHex: '#FFFFFF',
  },
  MASTER: {
    key: 'MASTER',
    title: 'Master',
    colorName: 'Ruby',
    order: 9,
    minXp: 5200,
    bgHex: '#BE123C',
    accentHex: '#E11D48',
    textHex: '#FFFFFF',
  },
  GRANDMASTER: {
    key: 'GRANDMASTER',
    title: 'Grandmaster',
    colorName: 'Amethyst',
    order: 10,
    minXp: 6500,
    bgHex: '#7E22CE',
    accentHex: '#A855F7',
    textHex: '#FFFFFF',
  },
  LEGEND: {
    key: 'LEGEND',
    title: 'Legend',
    colorName: 'Opal',
    order: 11,
    minXp: 8000,
    bgHex: '#9D174D',
    accentHex: '#EC4899',
    textHex: '#FFFFFF',
  },
  APEX: {
    key: 'APEX',
    title: 'Apex',
    colorName: 'Diamond',
    order: 12,
    minXp: 10000,
    bgHex: '#0369A1',
    accentHex: '#38BDF8',
    textHex: '#FFFFFF',
  },
};

export const RANK_TIER_LIST: RankTierInfo[] = Object.values(RANK_TIERS).sort(
  (a, b) => a.order - b.order
);

export type TimeOfDay = 'MORNING' | 'NOON' | 'AFTERNOON' | 'NIGHT';

export type HabitDifficulty = 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';

export const HABIT_XP_POLICY: Record<HabitDifficulty, number> = {
  EASY: 20,
  MODERATE: 40,
  HARD: 80,
  VERY_HARD: 150,
};

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  difficulty: HabitDifficulty;
  timeOfDay?: TimeOfDay;
  createdAtEpochMillis: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAtEpochMillis: number;
}

export type MilestoneCode =
  | 'FIRST_WORKOUT'
  | 'FIRST_PROGRAM'
  | 'FIVE_HABITS_COMPLETED'
  | 'ONE_THOUSAND_XP'
  | 'RANK_APPRENTICE'
  | 'RANK_ELITE';

export interface Milestone {
  id: string;
  code: MilestoneCode;
  title: string;
  description: string;
  requiredXp: number;
  unlocksFeature?: string | null;
}

export const MILESTONE_CATALOG: Milestone[] = [
  {
    id: 'first-workout',
    code: 'FIRST_WORKOUT',
    title: 'First Workout',
    description: 'Complete your first workout.',
    requiredXp: 0,
    unlocksFeature: 'Workout history view',
  },
  {
    id: 'first-program',
    code: 'FIRST_PROGRAM',
    title: 'Program Started',
    description: 'Start a training program.',
    requiredXp: 0,
    unlocksFeature: 'Program tracking',
  },
  {
    id: 'five-habits',
    code: 'FIVE_HABITS_COMPLETED',
    title: 'Habit Builder',
    description: 'Complete five habit entries.',
    requiredXp: 0,
    unlocksFeature: 'Habit insights',
  },
  {
    id: 'one-thousand-xp',
    code: 'ONE_THOUSAND_XP',
    title: 'XP Milestone',
    description: 'Reach 1,000 total XP.',
    requiredXp: 1000,
    unlocksFeature: 'Progression summary',
  },
  {
    id: 'rank-apprentice',
    code: 'RANK_APPRENTICE',
    title: 'Apprentice Ascendance',
    description: 'Achieve Apprentice Rank (Jade Tier).',
    requiredXp: 500,
    unlocksFeature: 'Advanced workout critique',
  },
  {
    id: 'rank-elite',
    code: 'RANK_ELITE',
    title: 'Elite Status',
    description: 'Ascend to Elite Rank (Sapphire Tier).',
    requiredXp: 3000,
    unlocksFeature: 'Elite training programs',
  },
];

export interface TrainingDay {
  id: string;
  name: string;
  workoutIds: string[];
  order: number;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description?: string | null;
  days: TrainingDay[];
  createdAtEpochMillis: number;
}

export type XpEventType =
  | 'WORKOUT_COMPLETED'
  | 'HABIT_COMPLETED'
  | 'PROGRAM_COMPLETED'
  | 'MILESTONE_UNLOCKED';

export interface XpEvent {
  id: string;
  type: XpEventType;
  xp: number;
  sourceId?: string | null;
  createdAtEpochMillis: number;
  title: string;
}
