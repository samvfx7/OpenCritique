import React from 'react';
import { User, Check, Circle, Dumbbell } from 'lucide-react';
import { RankGemstone } from '../../components/RankGemstone';
import { OCButton } from '../../components/OCButton';
import { OCRow } from '../../components/OCRow';
import { OCProgress } from '../../components/OCProgress';
import { OCSectionHeader } from '../../components/OCSectionHeader';
import { OCIconButton } from '../../components/OCIconButton';
import { RankTierKey, HabitDifficulty, TimeOfDay } from '../../domain/model/types';
import { RecentActivity } from '../../domain/storage/localStorageService';

export interface HomeTaskItem {
  id: string;
  name: string;
  difficulty: HabitDifficulty;
  completed: boolean;
  xpValue: number;
  timeOfDay?: TimeOfDay;
}

export interface HomeWorkoutInfo {
  id: string;
  name: string;
  difficulty: string;
  estimatedMinutes: number;
  exerciseCount: number;
  estimatedXp: number;
}

export const HomeTopArea: React.FC<{ onProfileClicked: () => void }> = ({ onProfileClicked }) => {
  return (
    <div className="w-full flex justify-between items-center py-5">
      <div>
        <p className="text-xs text-[#A7A3AF] font-medium tracking-wide">Good afternoon</p>
        <h1 className="text-2xl font-bold text-[#F5F3F8] tracking-tight mt-0.5">Ready to train?</h1>
      </div>
      <OCIconButton
        onClick={onProfileClicked}
        icon={<User size={20} />}
        title="View Profile"
        className="bg-[#18161E] border border-[#2A2733]"
      />
    </div>
  );
};

export const HomeRankSection: React.FC<{
  currentRankKey: RankTierKey;
  currentRankTitle: string;
  currentXp: number;
  nextRankXp: number;
  nextRankName: string;
  progressPercent: number;
}> = ({
  currentRankKey,
  currentRankTitle,
  currentXp,
  nextRankXp,
  nextRankName,
  progressPercent,
}) => {
  const xpRemaining = Math.max(0, nextRankXp - currentXp);

  return (
    <div className="w-full flex flex-col items-center text-center pb-8 pt-2">
      <RankGemstone rankTier={currentRankKey} size="LARGE" className="mb-4" />

      <h2 className="text-2xl font-bold text-[#F5F3F8] tracking-tight">{currentRankTitle}</h2>

      <div className="text-3xl font-bold text-[#7C5CFF] tracking-tight mt-1 mb-3">
        {currentXp.toLocaleString()} <span className="text-sm font-semibold text-[#A58CFF]">XP</span>
      </div>

      <div className="w-full max-w-sm px-2">
        <OCProgress
          progress={progressPercent}
          label={`${currentXp} / ${nextRankXp} XP`}
          percentage={false}
          className="my-2"
        />

        <p className="text-xs text-[#A7A3AF] mt-1 font-medium">
          {xpRemaining > 0
            ? `${xpRemaining} XP to ${nextRankName}`
            : `Max tier reached: ${currentRankTitle}`}
        </p>
      </div>
    </div>
  );
};

export const HomeTodayTrainingSection: React.FC<{
  workout: HomeWorkoutInfo | null;
  onStartWorkout: () => void;
  onViewPlan: () => void;
}> = ({ workout, onStartWorkout, onViewPlan }) => {
  return (
    <div className="w-full flex flex-col pb-8">
      <OCSectionHeader
        title="Today's Training"
        action={
          workout && (
            <button
              onClick={onViewPlan}
              className="text-xs font-semibold text-[#7C5CFF] hover:text-[#A58CFF] cursor-pointer"
            >
              View plan
            </button>
          )
        }
      />

      {workout ? (
        <OCRow className="justify-between items-center">
          <div className="flex flex-col gap-1 flex-1 pr-3">
            <h3 className="text-base font-semibold text-[#F5F3F8] tracking-tight">{workout.name}</h3>
            <p className="text-xs text-[#A7A3AF]">
              {workout.difficulty.replace('_', ' ')} · {workout.estimatedMinutes} min
            </p>
            <p className="text-[11px] text-[#A7A3AF]">{workout.exerciseCount} exercises</p>
            <p className="text-xs font-semibold text-[#7C5CFF]">Estimated XP {workout.estimatedXp}</p>
          </div>
          <OCButton text="Start" onClick={onStartWorkout} variant="PRIMARY" />
        </OCRow>
      ) : (
        <div className="w-full bg-[#18161E] rounded-[16px] p-6 text-center border border-[#2A2733]/50">
          <p className="text-sm font-semibold text-[#F5F3F8]">Rest day</p>
          <p className="text-xs text-[#A7A3AF] mt-1">Your next scheduled session is tomorrow.</p>
        </div>
      )}
    </div>
  );
};

export const HomeTodayTasksSection: React.FC<{
  tasks: HomeTaskItem[];
  onTaskClicked: (taskId: string) => void;
}> = ({ tasks, onTaskClicked }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="w-full flex flex-col pb-8">
      <OCSectionHeader title="Today's Tasks" subtitle="Complete daily habits to earn XP & maintain rank" />

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <OCRow
            key={task.id}
            onClick={() => onTaskClicked(task.id)}
            className="justify-between group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-[#6FA876]/20 text-[#6FA876] border border-[#6FA876]/40'
                    : 'text-[#A7A3AF] border border-[#3A3744] group-hover:border-[#7C5CFF]'
                }`}
              >
                {task.completed ? <Check size={14} strokeWidth={3} /> : <Circle size={10} />}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium transition-colors ${
                    task.completed ? 'text-[#A7A3AF] line-through' : 'text-[#F5F3F8]'
                  }`}
                >
                  {task.name}
                </span>
                <span className="text-[11px] text-[#A7A3AF]">
                  {task.difficulty} · +{task.xpValue} XP
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-semibold ${
                task.completed ? 'text-[#6FA876]' : 'text-[#A58CFF]'
              }`}
            >
              {task.completed ? 'Done' : `+${task.xpValue} XP`}
            </span>
          </OCRow>
        ))}
      </div>
    </div>
  );
};

export const HomeRecentActivitySection: React.FC<{
  activities: RecentActivity[];
}> = ({ activities }) => {
  if (activities.length === 0) return null;

  return (
    <div className="w-full flex flex-col pb-8">
      <OCSectionHeader title="Recent Activity" />

      <div className="flex flex-col gap-3">
        {activities.map((activity) => (
          <OCRow key={activity.id} className="justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-[#77737F] font-medium uppercase tracking-wider">
                {activity.date}
              </span>
              <span className="text-sm font-medium text-[#F5F3F8]">{activity.title}</span>
            </div>

            <span className="text-sm font-bold text-[#7C5CFF]">+{activity.xpEarned} XP</span>
          </OCRow>
        ))}
      </div>
    </div>
  );
};
