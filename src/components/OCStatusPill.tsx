import React from 'react';

export type OCStatusPillVariant = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

interface OCStatusPillProps {
  text: string;
  variant?: OCStatusPillVariant;
  className?: string;
}

export const OCStatusPill: React.FC<OCStatusPillProps> = ({
  text,
  variant = 'INFO',
  className = '',
}) => {
  const variantStyles = {
    SUCCESS: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-space',
    WARNING: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-space',
    ERROR: 'bg-white/10 text-white/80 border border-white/20 font-space',
    INFO: 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-space',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-[10px] text-[11px] font-semibold tracking-wide ${variantStyles} ${className}`}
    >
      {text}
    </span>
  );
};
