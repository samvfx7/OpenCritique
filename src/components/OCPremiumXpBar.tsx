import React from 'react';

interface OCPremiumXpBarProps {
  progressRatio: number; // 0 to 100
  className?: string;
  glow?: boolean;
}

export const OCPremiumXpBar: React.FC<OCPremiumXpBarProps> = ({
  progressRatio,
  className = '',
  glow = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progressRatio));

  return (
    <div className={`relative w-full ${className}`}>
      {/* Soft ambient glow beneath the active portion */}
      {glow && clamped > 0 && (
        <div
          className="absolute -inset-y-0.5 left-0 rounded-full bg-[#7C5CFF]/25 blur-[3px] pointer-events-none transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      )}

      {/* Recessed luxury groove track */}
      <div className="relative w-full h-[5px] bg-[#161322] rounded-full p-[0.5px] border border-[#2B253D] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
        {/* Active progress fill */}
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-[#5B30DB] via-[#7C5CFF] to-[#A78BFA] transition-all duration-500 ease-out"
          style={{ width: `${Math.max(6, clamped)}%` }}
        >
          {/* Top specular highlight reflection line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/35 rounded-full" />

          {/* Leading edge luminous tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_4px_#FFFFFF,0_0_8px_#A78BFA]" />
        </div>
      </div>
    </div>
  );
};
