import React from 'react';

interface OCSurfaceProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

export const OCSurface: React.FC<OCSurfaceProps> = ({
  children,
  className = '',
  backgroundColor = 'bg-[#121117]',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${backgroundColor} rounded-[16px] border border-[#2A2733]/60 p-5 ${
        onClick ? 'cursor-pointer hover:border-[#3A3744] transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
