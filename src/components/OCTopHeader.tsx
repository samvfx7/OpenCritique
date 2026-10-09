import React from 'react';

interface OCTopHeaderProps {
  onProfileClick?: () => void;
  userInitial?: string;
}

export const OCTopHeader: React.FC<OCTopHeaderProps> = () => {
  return (
    <header className="w-full flex items-center justify-between pt-6 pb-6 px-1">
      {/* Brand logo: Space Mono bold with accent color */}
      <div className="font-space font-bold text-[0.7rem] tracking-[0.15em] text-[#8B5CF6] uppercase">
        OPENCRITIQUE
      </div>
    </header>
  );
};
