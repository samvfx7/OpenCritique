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
    SUCCESS: 'bg-[#6FA876]/20 text-[#6FA876] border border-[#6FA876]/30',
    WARNING: 'bg-[#D4A548]/20 text-[#D4A548] border border-[#D4A548]/30',
    ERROR: 'bg-[#C7584F]/20 text-[#C7584F] border border-[#C7584F]/30',
    INFO: 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-[10px] text-[11px] font-semibold tracking-wide ${variantStyles} ${className}`}
    >
      {text}
    </span>
  );
};
