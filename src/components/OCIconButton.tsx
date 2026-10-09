import React from 'react';

interface OCIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  selected?: boolean;
}

export const OCIconButton: React.FC<OCIconButtonProps> = ({
  icon,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  title,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed ${
        selected
          ? 'text-[#7C5CFF] bg-[#7C5CFF]/15'
          : 'text-[#A7A3AF] hover:text-[#F5F3F8] hover:bg-[#18161E]'
      } ${disabled ? 'text-[#4A4755]' : ''} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
};
