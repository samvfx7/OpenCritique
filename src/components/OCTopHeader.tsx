import React from 'react';

interface OCTopHeaderProps {
  onProfileClick?: () => void;
  userInitial?: string;
  streakDays?: number;
}

export const OCTopHeader: React.FC<OCTopHeaderProps> = ({
  onProfileClick,
  streakDays = 5,
}) => {
  return (
    <header className="w-full flex items-center justify-between pt-6 pb-5 px-1 select-none">
      {/* Brand logo: Syne display bold with accent color */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
        <span className="font-display font-extrabold text-[0.8rem] tracking-[0.25em] text-white uppercase">
          OPEN<span className="text-[#8B5CF6]">CRITIQUE</span>
        </span>
      </div>

      {/* Right Telemetry Badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141417] border border-white/10 font-mono text-[0.6rem] text-white/70">
          <span className="text-amber-400">🔥</span>
          <span className="font-bold text-white">{streakDays}D</span>
          <span className="text-white/40">STREAK</span>
        </div>

        {onProfileClick && (
          <button
            onClick={onProfileClick}
            aria-label="Profile"
            className="w-7 h-7 rounded-full bg-[#18181B] border border-white/15 hover:border-[#8B5CF6] flex items-center justify-center font-mono text-[10px] font-bold text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            S
          </button>
        )}
      </div>
    </header>
  );
};
