import { Milestone, MILESTONE_CATALOG, MilestoneCode } from './types';

export class MilestoneEvaluator {
  evaluate(
    totalXp: number,
    completedHabitCount: number,
    completedWorkoutCount: number
  ): Milestone[] {
    const unlocked: Milestone[] = [];

    if (completedWorkoutCount >= 1) {
      const m = MILESTONE_CATALOG.find((it) => it.code === 'FIRST_WORKOUT');
      if (m) unlocked.push(m);
    }

    if (completedHabitCount >= 5) {
      const m = MILESTONE_CATALOG.find((it) => it.code === 'FIVE_HABITS_COMPLETED');
      if (m) unlocked.push(m);
    }

    if (totalXp >= 1000) {
      const m = MILESTONE_CATALOG.find((it) => it.code === 'ONE_THOUSAND_XP');
      if (m) unlocked.push(m);
    }

    if (totalXp >= 500) {
      const m = MILESTONE_CATALOG.find((it) => it.code === 'RANK_APPRENTICE');
      if (m) unlocked.push(m);
    }

    if (totalXp >= 3000) {
      const m = MILESTONE_CATALOG.find((it) => it.code === 'RANK_ELITE');
      if (m) unlocked.push(m);
    }

    // Deduplicate by code
    const seen = new Set<MilestoneCode>();
    return unlocked.filter((it) => {
      if (seen.has(it.code)) return false;
      seen.add(it.code);
      return true;
    });
  }
}
