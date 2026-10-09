import React, { useState } from 'react';
import { OCTopHeader } from '../../components/OCTopHeader';
import { OCGemstone3D } from '../../components/OCGemstone3D';
import { RankProgressionModal } from '../../components/RankProgressionModal';
import { AddTaskModal } from '../../components/AddTaskModal';
import { getRankForXp } from '../../domain/model/progressionUtils';
import { HomeTaskItem } from './HomeSections';
import { HabitDifficulty, TimeOfDay } from '../../domain/model/types';
import { Check, Plus, Sunrise, Sun, Sunset, Moon, Trash2, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  totalXp: number;
  tasks?: HomeTaskItem[];
  onTaskClicked?: (taskId: string) => void;
  onAddTask?: (name: string, difficulty: HabitDifficulty, timeOfDay: TimeOfDay) => void;
  onDeleteTask?: (taskId: string) => void;
  onStartWorkout?: () => void;
  onViewPlan?: () => void;
  onNavigateToProfile: () => void;
}

const DEFAULT_HABITS: HomeTaskItem[] = [
  { id: 'task-1', name: 'Morning Mobility Routine', difficulty: 'MODERATE', completed: false, xpValue: 40, timeOfDay: 'MORNING' },
  { id: 'task-2', name: 'Hydration 1.5L', difficulty: 'EASY', completed: false, xpValue: 20, timeOfDay: 'MORNING' },
  { id: 'task-3', name: 'Nutrient-Dense Lunch', difficulty: 'EASY', completed: false, xpValue: 20, timeOfDay: 'NOON' },
  { id: 'task-4', name: 'Mid-Day Posture Reset', difficulty: 'EASY', completed: false, xpValue: 20, timeOfDay: 'NOON' },
  { id: 'task-5', name: 'Afternoon Training Session', difficulty: 'HARD', completed: false, xpValue: 80, timeOfDay: 'AFTERNOON' },
  { id: 'task-6', name: 'Evening Stretch & Unwind', difficulty: 'EASY', completed: false, xpValue: 20, timeOfDay: 'NIGHT' },
  { id: 'task-7', name: 'Sleep 8 Hours (Zero Screens)', difficulty: 'HARD', completed: false, xpValue: 80, timeOfDay: 'NIGHT' },
];

interface PeriodMeta {
  key: TimeOfDay;
  label: string;
  icon: React.ReactNode;
  accentHex: string;
  badgeClass: string;
  checkClass: string;
}

const PERIOD_METAS: PeriodMeta[] = [
  {
    key: 'MORNING',
    label: 'Morning',
    icon: <Sunrise size={13} />,
    accentHex: '#8B5CF6',
    badgeClass: 'text-white/60 bg-white/5 border-white/10',
    checkClass: 'bg-[#8B5CF6] shadow-[#8B5CF6]/25',
  },
  {
    key: 'NOON',
    label: 'Noon',
    icon: <Sun size={13} />,
    accentHex: '#8B5CF6',
    badgeClass: 'text-white/60 bg-white/5 border-white/10',
    checkClass: 'bg-[#8B5CF6] shadow-[#8B5CF6]/25',
  },
  {
    key: 'AFTERNOON',
    label: 'Afternoon',
    icon: <Sunset size={13} />,
    accentHex: '#8B5CF6',
    badgeClass: 'text-white/60 bg-white/5 border-white/10',
    checkClass: 'bg-[#8B5CF6] shadow-[#8B5CF6]/25',
  },
  {
    key: 'NIGHT',
    label: 'Night',
    icon: <Moon size={13} />,
    accentHex: '#8B5CF6',
    badgeClass: 'text-white/60 bg-white/5 border-white/10',
    checkClass: 'bg-[#8B5CF6] shadow-[#8B5CF6]/25',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  totalXp,
  tasks = DEFAULT_HABITS,
  onTaskClicked,
  onAddTask,
  onDeleteTask,
  onNavigateToProfile,
}) => {
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const rankState = getRankForXp(totalXp);
  const nextRankThreshold = rankState.nextRank ? rankState.nextRank.minXp : 250;
  const xpNeeded = Math.max(0, nextRankThreshold - totalXp);
  const progressRatio = Math.min(100, Math.max(0, (totalXp / nextRankThreshold) * 100));

  const activeTasks = tasks && tasks.length > 0 ? tasks : DEFAULT_HABITS;
  const completedCount = activeTasks.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-[400px] mx-auto px-6 pb-28 flex flex-col font-geist">
      {/* Header */}
      <OCTopHeader onProfileClick={onNavigateToProfile} userInitial="S" />

      {/* Greeting Header */}
      <div className="mb-6 mt-1">
        <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-1.5">
          Good evening
        </div>
        <h1 className="text-[2.75rem] font-[800] tracking-[-0.04em] leading-[0.9] text-white">
          sam<span className="text-[#8B5CF6]">.</span>
        </h1>
      </div>

      {/* Current Rank Card */}
      <div
        onClick={() => setIsRankModalOpen(true)}
        className="bg-[#121214] border border-white/10 rounded-[22px] p-5 relative cursor-pointer hover:border-[#8B5CF6]/50 transition-all shadow-xl group"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-1">
              Current Rank
            </div>
            <div className="text-[1.35rem] font-[600] text-white tracking-tight leading-tight group-hover:text-[#8B5CF6] transition-colors">
              {rankState.currentRank.title}
            </div>
            <div className="font-space text-[0.6rem] uppercase tracking-[0.15em] text-[#8B5CF6] mt-0.5">
              {rankState.currentRank.colorName} Tier
            </div>
          </div>

          <div className="shrink-0 -mt-1 group-hover:scale-105 transition-transform duration-300">
            <OCGemstone3D rankTier={rankState.currentRank.key} size="md" />
          </div>
        </div>

        {/* Stat Bar */}
        <div className="h-[5px] bg-black rounded-[3px] my-3.5 overflow-hidden">
          <div
            className="h-full bg-[#8B5CF6] rounded-[3px] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(8, progressRatio)}%` }}
          />
        </div>

        {/* XP Meta Row */}
        <div className="flex justify-between font-space text-[0.65rem] text-white/60">
          <span>{totalXp} XP</span>
          <span>{xpNeeded} XP to {rankState.nextRank ? rankState.nextRank.title : 'Novice'}</span>
        </div>
      </div>

      {/* Compact & Organized Daily Protocols Section */}
      <div className="bg-[#121214] border border-white/10 rounded-[22px] p-5 mt-5 shadow-xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="font-space text-[0.6rem] uppercase tracking-[0.2em] text-white/50 mb-0.5">
              Daily Protocols
            </div>
            <h2 className="text-lg font-[600] text-white tracking-tight">
              Habits & Recovery
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-space text-[0.65rem] text-[#8B5CF6] font-bold bg-[#8B5CF6]/15 px-2.5 py-1 rounded-full border border-[#8B5CF6]/30">
              {completedCount}/{activeTasks.length} DONE
            </span>

            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              title="Add New Protocol"
              className="w-7 h-7 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] flex items-center justify-center text-white cursor-pointer shadow-md shadow-[#8B5CF6]/25 transition-transform hover:scale-105 active:scale-95"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Grouped Category Blocks */}
        <div className="flex flex-col gap-3.5">
          {PERIOD_METAS.map((period) => {
            const periodTasks = activeTasks.filter(
              (t) => (t.timeOfDay || 'MORNING') === period.key
            );

            if (periodTasks.length === 0) return null;

            const periodDoneCount = periodTasks.filter((t) => t.completed).length;
            const periodAllDone = periodDoneCount === periodTasks.length;

            return (
              <div key={period.key} className="flex flex-col">
                {/* Category Header Strip */}
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: period.accentHex }}>
                      {period.icon}
                    </span>
                    <span className="font-space text-[0.65rem] font-bold uppercase tracking-wider text-white/80">
                      {period.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-space text-[0.6rem] text-white/40">
                      {periodDoneCount}/{periodTasks.length} COMPLETED
                    </span>
                    {periodAllDone && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                    )}
                  </div>
                </div>

                {/* Compact List Container for this Category */}
                <div className="bg-[#161619] border border-white/5 rounded-[14px] divide-y divide-white/5 overflow-hidden">
                  {periodTasks.map((habit) => (
                    <div
                      key={habit.id}
                      className={`flex items-center justify-between py-2.5 px-3 transition-all select-none group cursor-pointer ${
                        habit.completed
                          ? 'bg-white/[0.01]'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Left: Checkmark + Task Info */}
                      <div
                        onClick={() => onTaskClicked && onTaskClicked(habit.id)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 pr-2"
                      >
                        {/* Compact Circular Checkbox */}
                        <div
                          className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            habit.completed
                              ? `${period.checkClass} text-white shadow-sm`
                              : 'border border-white/25 hover:border-white/50'
                          }`}
                        >
                          {habit.completed && <Check size={11} strokeWidth={3} />}
                        </div>

                        {/* Title and Difficulty */}
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-[13px] font-medium leading-tight truncate transition-colors ${
                              habit.completed ? 'text-white/40 line-through' : 'text-white/95'
                            }`}
                          >
                            {habit.name}
                          </span>
                          <span className="font-space text-[9px] text-white/40 uppercase mt-0.5">
                            {habit.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Right: XP Badge & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          onClick={() => onTaskClicked && onTaskClicked(habit.id)}
                          className={`font-space text-[10.5px] font-bold px-1.5 py-0.5 rounded-[6px] border transition-colors ${
                            habit.completed
                              ? 'text-white/50 bg-white/10 border-white/10'
                              : 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30'
                          }`}
                        >
                          +{habit.xpValue} XP
                        </span>

                        {onDeleteTask && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(habit.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-white/30 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete habit"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ascension Ladder / Rank Progression Modal */}
      <RankProgressionModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        totalXp={totalXp}
      />

      {/* Add Custom Task / Protocol Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={(name, difficulty, timeOfDay) => {
          if (onAddTask) {
            onAddTask(name, difficulty, timeOfDay);
          }
        }}
      />
    </div>
  );
};
