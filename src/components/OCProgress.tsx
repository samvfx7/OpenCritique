import React from 'react';

interface OCProgressProps {
  progress: number; // 0 to 1
  label?: string;
  percentage?: boolean;
  className?: string;
}

export const OCProgress: React.FC<OCProgressProps> = ({
  progress,
  label,
  percentage = true,
  className = '',
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentText = `${Math.round(clampedProgress * 100)}%`;

  return (
    <div className={`w-full flex flex-col text-left ${className}`}>
      {(label || percentage) && (
        <div className="w-full flex justify-between items-center mb-2 text-xs text-[#A7A3AF] font-medium">
          {label && <span>{label}</span>}
          {percentage && <span className="ml-auto">{percentText}</span>}
        </div>
      )}
      <div className="w-full h-2 bg-[#18161E] rounded-[10px] overflow-hidden border border-[#2A2733]/40">
        <div
          className="h-full bg-[#7C5CFF] rounded-[10px] transition-all duration-300"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>
    </div>
  );
};
