import React, { useState } from 'react';
import { X, Plus, Sun, Sunrise, Sunset, Moon, Sparkles } from 'lucide-react';
import { HabitDifficulty, TimeOfDay, HABIT_XP_POLICY } from '../domain/model/types';
import { analyzeHabit } from '../domain/xp/habitAnalyzer';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (name: string, difficulty: HabitDifficulty, timeOfDay: TimeOfDay) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('MORNING');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('MODERATE');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!name.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const { difficulty: recommendedDifficulty } = analyzeHabit(name);
      setDifficulty(recommendedDifficulty);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddTask(name.trim(), difficulty, timeOfDay);
    setName('');
    onClose();
  };

  const timeOptions: { key: TimeOfDay; label: string; icon: React.ReactNode }[] = [
    { key: 'MORNING', label: 'Morning', icon: <Sunrise size={14} /> },
    { key: 'NOON', label: 'Noon', icon: <Sun size={14} /> },
    { key: 'AFTERNOON', label: 'Afternoon', icon: <Sunset size={14} /> },
    { key: 'NIGHT', label: 'Night', icon: <Moon size={14} /> },
  ];

  const difficultyOptions: { key: HabitDifficulty; label: string; xp: number }[] = [
    { key: 'EASY', label: 'Easy', xp: HABIT_XP_POLICY.EASY },
    { key: 'MODERATE', label: 'Moderate', xp: HABIT_XP_POLICY.MODERATE },
    { key: 'HARD', label: 'Hard', xp: HABIT_XP_POLICY.HARD },
    { key: 'VERY_HARD', label: 'Elite', xp: HABIT_XP_POLICY.VERY_HARD },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#121214] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
          <div>
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#8B5CF6] font-bold">
              NEW PROTOCOL
            </div>
            <h2 className="text-xl font-display font-bold text-white tracking-tight mt-0.5">
              Add Daily Habit
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[0.65rem] uppercase tracking-wider text-white/50">
              Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10,000 Steps, Cold Plunge, Creatine 5g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#18181B] border border-white/10 focus:border-[#8B5CF6] rounded-[14px] px-3.5 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !name.trim()}
              className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-[#8B5CF6] hover:text-white mt-1 cursor-pointer disabled:opacity-40"
            >
              <Sparkles size={12} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Smart Analyze Difficulty & XP'}</span>
            </button>
          </div>

          {/* Time of Day selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[0.65rem] uppercase tracking-wider text-white/50">
              Time of Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTimeOfDay(opt.key)}
                  className={`p-2.5 rounded-[12px] border flex items-center gap-2 cursor-pointer transition-all ${
                    timeOfDay === opt.key
                      ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white font-semibold'
                      : 'bg-[#18181B] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className={timeOfDay === opt.key ? 'text-[#8B5CF6]' : 'text-white/40'}>
                    {opt.icon}
                  </span>
                  <span className="font-sans text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty / XP Tier */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[0.65rem] uppercase tracking-wider text-white/50">
              Intensity & XP Reward
            </label>
            <div className="grid grid-cols-2 gap-2">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setDifficulty(opt.key)}
                  className={`p-2.5 rounded-[12px] border flex items-center justify-between cursor-pointer transition-all ${
                    difficulty === opt.key
                      ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white font-semibold'
                      : 'bg-[#18181B] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{opt.label}</span>
                  <span className="font-mono text-[0.65rem] font-bold text-[#8B5CF6]">
                    +{opt.xp} XP
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[12px] bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/60 hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-[12px] bg-[#8B5CF6] hover:bg-[#7C3AED] active:scale-[0.99] font-mono text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#8B5CF6]/25 transition-all"
            >
              <Plus size={14} />
              <span>Add Protocol</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
