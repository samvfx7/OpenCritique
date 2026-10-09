import { HabitDifficulty, HABIT_XP_POLICY } from '../model/types';

export const analyzeHabit = (name: string): { difficulty: HabitDifficulty; xp: number } => {
  const lowerName = name.toLowerCase();

  if (
    lowerName.includes('sleep') ||
    lowerName.includes('intense') ||
    lowerName.includes('training') ||
    lowerName.includes('workout')
  ) {
    return { difficulty: 'HARD', xp: HABIT_XP_POLICY.HARD };
  } else if (
    lowerName.includes('mobility') ||
    lowerName.includes('stretch') ||
    lowerName.includes('routine')
  ) {
    return { difficulty: 'MODERATE', xp: HABIT_XP_POLICY.MODERATE };
  } else {
    return { difficulty: 'EASY', xp: HABIT_XP_POLICY.EASY };
  }
};
