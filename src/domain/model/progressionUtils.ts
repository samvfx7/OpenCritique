import { RANK_TIER_LIST, RankTierInfo } from './types';

export function getRankForXp(xp: number): {
  currentRank: RankTierInfo;
  nextRank: RankTierInfo | null;
  currentXp: number;
  nextRankXp: number;
  xpToNext: number;
  progressPercent: number;
} {
  let currentRank = RANK_TIER_LIST[0];
  let nextRank: RankTierInfo | null = RANK_TIER_LIST[1] || null;

  for (let i = RANK_TIER_LIST.length - 1; i >= 0; i--) {
    if (xp >= RANK_TIER_LIST[i].minXp) {
      currentRank = RANK_TIER_LIST[i];
      nextRank = RANK_TIER_LIST[i + 1] || null;
      break;
    }
  }

  const prevTierXp = currentRank.minXp;
  const nextRankXp = nextRank ? nextRank.minXp : currentRank.minXp;
  const xpToNext = nextRank ? Math.max(0, nextRank.minXp - xp) : 0;

  const range = nextRank ? nextRank.minXp - prevTierXp : 1;
  const currentInRange = xp - prevTierXp;
  const progressPercent = nextRank ? Math.min(1, Math.max(0, currentInRange / range)) : 1;

  return {
    currentRank,
    nextRank,
    currentXp: xp,
    nextRankXp: nextRank ? nextRank.minXp : currentRank.minXp,
    xpToNext,
    progressPercent,
  };
}
