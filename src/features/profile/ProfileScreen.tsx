import React, { useState } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import { OCGemstone3D } from '../../components/OCGemstone3D';
import { RankProgressionModal } from '../../components/RankProgressionModal';
import { getRankForXp } from '../../domain/model/progressionUtils';
import { RANK_TIER_LIST, MILESTONE_CATALOG } from '../../domain/model/types';
import { MilestoneEvaluator } from '../../domain/model/MilestoneEvaluator';
import { ArrowUpRight, ChevronRight, X, Trophy, Award, Clock } from 'lucide-react';

interface ProfileScreenProps {
  totalXp: number;
  completedWorkoutsCount: number;
  completedHabitsCount: number;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  totalXp,
  completedWorkoutsCount,
  completedHabitsCount,
  onResetData,
}) => {
  const [activeModal, setActiveModal] = useState<'RANKS' | 'LEADERBOARD' | 'HISTORY' | 'MILESTONES' | null>(null);
  const rankInfo = getRankForXp(totalXp);
  const evaluator = new MilestoneEvaluator();
  const unlockedMilestones = evaluator.evaluate(
    totalXp,
    completedHabitsCount,
    completedWorkoutsCount
  );
  const unlockedCodes = new Set(unlockedMilestones.map((m) => m.code));

  const leaderboardEntries = [
    { name: 'Kaelen R.', rank: 'Skilled', xp: 1680, isUser: false },
    { name: 'Marcus Vance', rank: 'Skilled', xp: 1540, isUser: false },
    { name: 'sam', rank: rankInfo.currentRank.title, xp: totalXp, isUser: true },
    { name: 'Sarah Lin', rank: 'Intermediate', xp: 1190, isUser: false },
    { name: 'David K.', rank: 'Intermediate', xp: 1040, isUser: false },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist">
      {/* Top Header */}
      <OCTopHeader />

      {/* Hero Gemstone & Athlete Info Card */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-6 mb-6 flex flex-col items-center text-center shadow-xl mt-2">
        <OCGemstone3D rankTier={rankInfo.currentRank.key} size="xl" className="my-2" />

        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-[#8B5CF6] mt-4">
          {rankInfo.currentRank.colorName.toUpperCase()} TIER
        </div>

        <h1 className="text-[2.5rem] font-[800] tracking-[-0.04em] text-white mt-1">
          sam<span className="text-[#8B5CF6]">.</span>
        </h1>

        <div className="font-space text-[0.7rem] text-white/60 mt-1">
          {rankInfo.currentRank.title} · {totalXp} XP
        </div>

        <button
          onClick={() => setActiveModal('RANKS')}
          className="mt-4 flex items-center gap-1.5 font-space text-[0.65rem] text-[#8B5CF6] hover:text-white transition-colors cursor-pointer"
        >
          <span>View rank progression</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* PROGRESS Section */}
      <div className="bg-[#121214] border border-white/10 rounded-[24px] p-6 shadow-xl">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-3">
          Progress
        </div>

        <div className="w-full flex flex-col">
          {/* Leaderboard */}
          <button
            onClick={() => setActiveModal('LEADERBOARD')}
            className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">
                Leaderboard
              </span>
              <span className="text-xs text-white/50 mt-0.5">
                Your place in the wider picture
              </span>
            </div>
            <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
          </button>

          <div className="w-full h-[1px] bg-white/10" />

          {/* Training history */}
          <button
            onClick={() => setActiveModal('HISTORY')}
            className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">
                Training history
              </span>
              <span className="text-xs text-white/50 mt-0.5">
                {completedWorkoutsCount} sessions on this device
              </span>
            </div>
            <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
          </button>

          <div className="w-full h-[1px] bg-white/10" />

          {/* Milestones */}
          <button
            onClick={() => setActiveModal('MILESTONES')}
            className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">
                Milestones
              </span>
              <span className="text-xs text-white/50 mt-0.5">
                {unlockedMilestones.length > 0
                  ? `${unlockedMilestones.length} discoveries unlocked`
                  : 'A new discovery is approaching'}
              </span>
            </div>
            <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Rank Progression Ascension Ladder Modal */}
      <RankProgressionModal
        isOpen={activeModal === 'RANKS'}
        onClose={() => setActiveModal(null)}
        totalXp={totalXp}
      />

      {/* MODAL / DRAWER FOR DETAILED VIEWS */}
      {activeModal && activeModal !== 'RANKS' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-[#121214] rounded-t-[26px] sm:rounded-[26px] border border-white/10 p-5 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl font-geist">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="font-space text-xs font-bold text-white uppercase tracking-wider">
                {activeModal === 'LEADERBOARD' && 'Tier Leaderboard'}
                {activeModal === 'HISTORY' && 'Training History'}
                {activeModal === 'MILESTONES' && 'Milestones'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content per modal */}
            {activeModal === 'LEADERBOARD' && (
              <div className="flex flex-col gap-2.5">
                {leaderboardEntries.map((athlete, idx) => (
                  <div
                    key={athlete.name}
                    className={`p-3 rounded-[16px] border flex items-center justify-between ${
                      athlete.isUser
                        ? 'bg-[#282038] border-[#7C5CFF]'
                        : 'bg-[#18161E] border-[#23202E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#868094]">#{idx + 1}</span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${athlete.isUser ? 'text-white' : 'text-[#D0CBDC]'}`}>
                          {athlete.name}
                        </span>
                        <span className="text-[10px] text-[#868094]">{athlete.rank}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#A58CFF]">
                      {athlete.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeModal === 'HISTORY' && (
              <div className="flex flex-col items-center text-center py-6">
                <Clock size={28} className="text-[#554E62] mb-2" />
                <span className="text-sm font-bold text-[#F5F3F8]">
                  {completedWorkoutsCount} sessions logged
                </span>
                <p className="text-xs text-[#868094] mt-1 max-w-xs">
                  All workout logs are kept locally in secure offline storage on this device.
                </p>
              </div>
            )}

            {activeModal === 'MILESTONES' && (
              <div className="flex flex-col gap-2.5">
                {MILESTONE_CATALOG.map((m) => {
                  const unlocked = unlockedCodes.has(m.code);
                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-[16px] border flex items-center justify-between ${
                        unlocked ? 'bg-[#18161E] border-[#7C5CFF]/30' : 'bg-[#14131A] border-[#23202E] opacity-60'
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <span className="text-xs font-bold text-[#F5F3F8]">{m.title}</span>
                        <span className="text-[11px] text-[#868094]">{m.description}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${unlocked ? 'bg-[#6FA876]/20 text-[#6FA876]' : 'bg-[#23202E] text-[#868094]'}`}>
                        {unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
