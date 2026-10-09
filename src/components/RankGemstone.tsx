import React from 'react';
import { RankTierKey, RANK_TIERS } from '../domain/model/types';

export type RankGemstoneSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'HERO';

interface RankGemstoneProps {
  rankTier: RankTierKey;
  size?: RankGemstoneSize;
  className?: string;
}

export const RankGemstone: React.FC<RankGemstoneProps> = ({
  rankTier,
  size = 'MEDIUM',
  className = '',
}) => {
  const tier = RANK_TIERS[rankTier] || RANK_TIERS.INTERMEDIATE;

  const sizeStyles = {
    SMALL: 'w-12 h-12 text-sm rounded-[10px]',
    MEDIUM: 'w-[72px] h-[72px] text-lg rounded-[16px]',
    LARGE: 'w-24 h-24 text-2xl rounded-[18px]',
    HERO: 'w-36 h-36 text-4xl rounded-[24px]',
  }[size];

  const abbreviation = tier.title.slice(0, 1).toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center font-bold tracking-wider select-none shadow-lg transition-transform duration-200 ${sizeStyles} ${className}`}
      style={{
        backgroundColor: tier.bgHex,
        color: tier.textHex,
        boxShadow: `0 8px 24px -4px ${tier.bgHex}44, inset 0 2px 4px rgba(255,255,255,0.25)`,
        border: `1.5px solid ${tier.accentHex}`,
      }}
      title={`${tier.title} (${tier.colorName})`}
    >
      {/* Gem facet specular highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none rounded-[inherit]" />
      <span className="relative z-10 drop-shadow-sm">{abbreviation}</span>
    </div>
  );
};
