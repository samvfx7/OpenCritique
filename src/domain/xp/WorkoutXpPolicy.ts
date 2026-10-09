import { WorkoutDifficulty, Workout } from '../model/types';

export const WORKOUT_XP_BY_DIFFICULTY: Record<WorkoutDifficulty, number> = {
  LEG_DAY: 80,
  UPPER_BODY: 90,
  FULL_BODY: 150,
  CONDITIONING: 85,
  CALISTHENICS: 110,
  SPORT_PERFORMANCE: 120,
};

export class WorkoutXpPolicy {
  static xpForDifficulty(difficulty: WorkoutDifficulty): number {
    const xp = WORKOUT_XP_BY_DIFFICULTY[difficulty];
    if (xp === undefined) {
      throw new Error(`No XP rule configured for ${difficulty}`);
    }
    return xp;
  }

  static xpForWorkout(workout: Workout): number {
    return this.xpForDifficulty(workout.difficulty);
  }
}
