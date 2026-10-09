import React, { useState } from 'react';
import { X, Check, Lock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { OCGemstone3D } from './OCGemstone3D';
import { getRankForXp } from '../domain/model/progressionUtils';
import { RANK_TIER_LIST, RankTierKey } from '../domain/model/types';

interface RankProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalXp: number;
}

const TIER_PERKS: Record<RankTierKey, { perk: string; description: string }> = {
  BEGINNER: {
    perk: 'Foundation Protocol',
    description: 'Local session tracking & basic volume telemetry',
  },
  NOVICE: {
    perk: 'Volume Analytics',
    description: 'Interactive rest countdown & completed set analytics',
  },
  APPRENTICE: {
    perk: 'Superset Generator',
    description: 'Smart compound rotations & movement cadence',
  },
  INTERMEDIATE: {
    perk: 'Overload Calibration',
    description: 'Automated progressive overload & weight recommendations',
  },
  SKILLED: {
    perk: 'RPE Load Monitoring',
    description: 'Autoregulation & personalized movement variations',
  },
  ADVANCED: {
    perk: 'Fatigue Management',
    description: 'Recovery curves & intelligent deload week planning',
  },
  ELITE: {
    perk: 'Performance Intelligence',
    description: 'AI Coach deep biometric and capacity insights',
  },
  EXPERT: {
    perk: 'Periodization Engine',
    description: 'Multi-week mesocycle design & volume waves',
  },
  MASTER: {
    perk: 'Master Prestige',
    description: 'Prestige badge flair & elevated tier leaderboard status',
  },
  GRANDMASTER: {
    perk: 'Velocity Profiling',
    description: 'Power output curve & concentric bar velocity analysis',
  },
  LEGEND: {
    perk: 'Hall of Champions',
    description: 'Permanent athlete legacy profile & lifetime milestones',
  },
  APEX: {
    perk: 'Apex Ascendant',
    description: 'The pinnacle of athletic conditioning and strength',
  },
};

export const RankProgressionModal: React.FC<RankProgressionModalProps> = ({
  isOpen,
  onClose,
  totalXp,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [expandedTierKey, setExpandedTierKey] = useState<RankTierKey | null>(null);

  if (!isOpen) return null;

  const rankState = getRankForXp(totalXp);
  const currentTierOrder = rankState.currentRank.order;
  const nextRankThreshold = rankState.nextRank ? rankState.nextRank.minXp : 250;
  const xpNeeded = Math.max(0, nextRankThreshold - totalXp);
  const progressRatio = Math.min(100, Math.max(0, (totalXp / nextRankThreshold) * 100));

  const unlockedCount = RANK_TIER_LIST.filter((t) => t.order <= currentTierOrder).length;
  const lockedCount = RANK_TIER_LIST.length - unlockedCount;

  const filteredTiers = RANK_TIER_LIST.filter((t) => {
    if (filter === 'UNLOCKED') return t.order <= currentTierOrder;
    if (filter === 'LOCKED') return t.order > currentTierOrder;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-geist">
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 bg-[#121214]">
          <div className="flex items-center gap-2">
            <span className="font-space font-bold text-[0.65rem] tracking-[0.2em] text-[#8B5CF6] uppercase">
              OPENCRITIQUE
            </span>
            <span className="text-white/20 text-xs">/</span>
            <span className="font-space text-[0.65rem] tracking-[0.15em] text-white/50 uppercase">
              ASCENSION LADDER
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Minimalist Hero Spotlight Card */}
          <div className="bg-[#121214] border border-white/10 rounded-[22px] p-5 mb-5 relative overflow-hidden shadow-xl">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-[#8B5CF6] mb-1">
                  CURRENT TIER {String(currentTierOrder).padStart(2, '0')} OF 12
                </div>
                <h2 className="text-2xl font-[800] text-white tracking-tight">
                  {rankState.currentRank.title}
                </h2>
                <div className="font-space text-[0.65rem] uppercase tracking-[0.15em] text-white/50 mt-0.5">
                  {rankState.currentRank.colorName} Tier
                </div>
              </div>

              <div className="shrink-0 -mt-1 drop-shadow-lg">
                <OCGemstone3D rankTier={rankState.currentRank.key} size="md" />
              </div>
            </div>

            {/* Precision Hairline Stat Bar */}
            <div className="mt-4 relative z-10">
              <div className="h-[4px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(5, progressRatio)}%` }}
                />
              </div>

              <div className="flex justify-between items-center font-space text-[0.65rem] text-white/50 mt-2">
                <span>{totalXp} XP</span>
                <span>
                  {rankState.nextRank
                    ? `${xpNeeded} XP to ${rankState.nextRank.title}`
                    : 'MAX ASCENSION ACHIEVED'}
                </span>
              </div>
            </div>

            {/* Protocol One-Liner */}
            <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2 text-white/60">
              <Sparkles size={12} className="text-[#8B5CF6] shrink-0" />
              <span className="text-[11px] truncate">
                {TIER_PERKS[rankState.currentRank.key]?.perk}: {TIER_PERKS[rankState.currentRank.key]?.description}
              </span>
            </div>
          </div>

          {/* Minimal Segmented Filter Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#121214] rounded-[12px] border border-white/5 mb-4 select-none">
            <button
              onClick={() => setFilter('ALL')}
              className={`py-1.5 rounded-[9px] font-space text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer text-center ${
                filter === 'ALL'
                  ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => setFilter('UNLOCKED')}
              className={`py-1.5 rounded-[9px] font-space text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer text-center ${
                filter === 'UNLOCKED'
                  ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('LOCKED')}
              className={`py-1.5 rounded-[9px] font-space text-[0.6rem] uppercase tracking-wider transition-all cursor-pointer text-center ${
                filter === 'LOCKED'
                  ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Upcoming ({lockedCount})
            </button>
          </div>

          {/* Minimalist Vertical Ascension Ladder */}
          <div className="relative flex flex-col gap-2 pl-2">
            {/* Elegant vertical rail spine */}
            <div className="absolute left-[26px] top-3 bottom-3 w-[1.5px] bg-white/10" />

            {filteredTiers.map((tier) => {
              const isCurrent = tier.key === rankState.currentRank.key;
              const isUnlocked = tier.order <= currentTierOrder;
              const isExpanded = expandedTierKey === tier.key;
              const perkInfo = TIER_PERKS[tier.key];
              const remainingToUnlock = Math.max(0, tier.minXp - totalXp);

              return (
                <div
                  key={tier.key}
                  onClick={() => setExpandedTierKey(isExpanded ? null : tier.key)}
                  className={`relative rounded-[16px] border transition-all cursor-pointer select-none ${
                    isCurrent
                      ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 shadow-sm ring-1 ring-[#8B5CF6]/20'
                      : isUnlocked
                      ? 'bg-[#121214] border-white/10 hover:border-white/20'
                      : 'bg-[#121214]/50 border-white/5 opacity-55 hover:opacity-100 hover:border-white/15'
                  }`}
                >
                  {/* Row content */}
                  <div className="flex items-center gap-3.5 p-3">
                    {/* Node Gemstone */}
                    <div className="relative shrink-0 flex items-center justify-center z-10 bg-[#0A0A0C] rounded-full p-1 border border-white/10">
                      <OCGemstone3D rankTier={tier.key} size="sm" />
                      {isCurrent && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#0A0A0C]" />
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-space text-[0.6rem] text-white/40">
                          #{String(tier.order).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-[600] text-white tracking-tight truncate">
                          {tier.title}
                        </h3>
                        <span className="font-space text-[0.6rem] text-white/40">
                          · {tier.colorName}
                        </span>
                      </div>

                      <div className="font-space text-[0.6rem] text-white/40 mt-0.5">
                        {tier.minXp} XP · {perkInfo.perk}
                      </div>
                    </div>

                    {/* Right Status Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent ? (
                        <span className="font-space text-[0.6rem] font-bold bg-[#8B5CF6] text-white px-2 py-0.5 rounded-full">
                          CURRENT
                        </span>
                      ) : isUnlocked ? (
                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8B5CF6]">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-space text-[0.6rem] text-white/40">
                          <Lock size={10} />
                          <span>+{remainingToUnlock} XP</span>
                        </div>
                      )}

                      <span className="text-white/30">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Protocol Insight */}
                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 border-t border-white/5 text-[11px] text-white/60 animate-in fade-in duration-150">
                      <div className="font-space text-[0.6rem] uppercase tracking-wider text-[#8B5CF6] mb-1">
                        Unlocked Protocol Perk
                      </div>
                      <p className="text-white/80 font-medium">
                        {perkInfo.perk}
                      </p>
                      <p className="text-white/50 text-[10.5px] mt-0.5 leading-relaxed">
                        {perkInfo.description}
                      </p>
                      <div className="font-space text-[0.6rem] text-white/40 mt-2">
                        Requirement: {tier.minXp} XP total volume
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Bottom Action Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#121214] flex items-center justify-between">
          <div className="font-space text-[0.6rem] text-white/40">
            Current: <strong className="text-white">{rankState.currentRank.title}</strong> · {totalXp} XP
          </div>

          <button
            onClick={onClose}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.98] text-white font-space text-[0.65rem] font-bold px-4 py-2 rounded-[10px] cursor-pointer transition-all shadow-md shadow-[#8B5CF6]/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
