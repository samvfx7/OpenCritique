import React from 'react';

export type OCButtonVariant = 'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'DESTRUCTIVE';

interface OCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: OCButtonVariant;
  isLoading?: boolean;
}

export const OCButton: React.FC<OCButtonProps> = ({
  text,
  onClick,
  variant = 'PRIMARY',
  disabled = false,
  isLoading = false,
  className = '',
  ...rest
}) => {
  const variantStyles = {
    PRIMARY: 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] active:bg-[#6D28D9] shadow-md shadow-[#8B5CF6]/20 font-space',
    SECONDARY: 'bg-[#121214] text-white hover:bg-[#18181B] border border-white/10 font-space',
    TERTIARY: 'bg-transparent text-[#8B5CF6] hover:bg-[#8B5CF6]/10 font-space',
    DESTRUCTIVE: 'bg-white/10 text-white hover:bg-white/20 border border-white/15 font-space',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`h-12 px-6 py-3 rounded-[16px] text-sm font-semibold tracking-wide transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#4A4755] disabled:text-[#77737F] disabled:border-transparent ${variantStyles} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Loading
        </span>
      ) : (
        text
      )}
    </button>
  );
};
