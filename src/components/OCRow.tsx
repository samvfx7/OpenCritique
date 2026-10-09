import React from 'react';

interface OCRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const OCRow: React.FC<OCRowProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-full bg-[#18161E] rounded-[16px] p-4 flex items-center gap-4 border border-[#2A2733]/50 hover:border-[#3A3744] transition-colors ${
        onClick ? 'cursor-pointer hover:bg-[#211E29]/60' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
