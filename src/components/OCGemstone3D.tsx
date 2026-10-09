import React from 'react';
import { RankTierKey } from '../domain/model/types';

interface OCGemstone3DProps {
  rankTier?: RankTierKey;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const OCGemstone3D: React.FC<OCGemstone3DProps> = ({
  rankTier = 'BEGINNER',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-11 h-9',
    md: 'w-18 h-14',
    lg: 'w-24 h-19',
    xl: 'w-32 h-26',
  };

  // Color palettes for all 12 distinct gemstone tiers (Bronze, Silver, Jade, Garnet, Topaz, Citrine, Sapphire, Emerald, Ruby, Amethyst, Opal, Diamond)
  const palettes: Record<string, {
    table: string;
    upperL: string;
    upperR: string;
    frontCenter: string;
    frontL: string;
    frontR: string;
    base: string;
    stroke: string;
    glow: string;
  }> = {
    BEGINNER: {
      table: '#FDE68A',
      upperL: '#F59E0B',
      upperR: '#D97706',
      frontCenter: '#B45309',
      frontL: '#92400E',
      frontR: '#78350F',
      base: '#451A03',
      stroke: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.45)',
    },
    NOVICE: {
      table: '#FFFFFF',
      upperL: '#E0F2FE',
      upperR: '#BAE6FD',
      frontCenter: '#7DD3FC',
      frontL: '#38BDF8',
      frontR: '#0284C7',
      base: '#0C4A6E',
      stroke: '#E0F2FE',
      glow: 'rgba(56, 189, 248, 0.45)',
    },
    APPRENTICE: {
      table: '#D1FAE5',
      upperL: '#6EE7B7',
      upperR: '#34D399',
      frontCenter: '#10B981',
      frontL: '#059669',
      frontR: '#047857',
      base: '#064E3B',
      stroke: '#A7F3D0',
      glow: 'rgba(16, 185, 129, 0.45)',
    },
    INTERMEDIATE: {
      table: '#FECDD3',
      upperL: '#FB7185',
      upperR: '#F43F5E',
      frontCenter: '#E11D48',
      frontL: '#BE123C',
      frontR: '#9F1239',
      base: '#4C0519',
      stroke: '#FDA4AF',
      glow: 'rgba(225, 29, 72, 0.45)',
    },
    SKILLED: {
      table: '#FEF08A',
      upperL: '#FACC15',
      upperR: '#EAB308',
      frontCenter: '#CA8A04',
      frontL: '#A16207',
      frontR: '#854D0E',
      base: '#422006',
      stroke: '#FEF08A',
      glow: 'rgba(234, 179, 8, 0.45)',
    },
    ADVANCED: {
      table: '#FFEDD5',
      upperL: '#FB923C',
      upperR: '#F97316',
      frontCenter: '#EA580C',
      frontL: '#C2410C',
      frontR: '#9A3412',
      base: '#431407',
      stroke: '#FDBA74',
      glow: 'rgba(249, 115, 22, 0.45)',
    },
    ELITE: {
      table: '#DBEAFE',
      upperL: '#60A5FA',
      upperR: '#3B82F6',
      frontCenter: '#2563EB',
      frontL: '#1D4ED8',
      frontR: '#1E40AF',
      base: '#172554',
      stroke: '#93C5FD',
      glow: 'rgba(37, 99, 235, 0.45)',
    },
    EXPERT: {
      table: '#ECFDF5',
      upperL: '#34D399',
      upperR: '#10B981',
      frontCenter: '#059669',
      frontL: '#047857',
      frontR: '#065F46',
      base: '#022C22',
      stroke: '#6EE7B7',
      glow: 'rgba(5, 150, 105, 0.45)',
    },
    MASTER: {
      table: '#FFE4E6',
      upperL: '#FB7185',
      upperR: '#F43F5E',
      frontCenter: '#E11D48',
      frontL: '#BE123C',
      frontR: '#881337',
      base: '#4C0519',
      stroke: '#FECDD3',
      glow: 'rgba(244, 63, 94, 0.5)',
    },
    GRANDMASTER: {
      table: '#F3E8FF',
      upperL: '#C084FC',
      upperR: '#A855F7',
      frontCenter: '#9333EA',
      frontL: '#7E22CE',
      frontR: '#6B21A8',
      base: '#3B0764',
      stroke: '#E9D5FF',
      glow: 'rgba(168, 85, 247, 0.5)',
    },
    LEGEND: {
      table: '#FCE7F3',
      upperL: '#F472B6',
      upperR: '#A855F7',
      frontCenter: '#EC4899',
      frontL: '#06B6D4',
      frontR: '#7C3AED',
      base: '#581C87',
      stroke: '#FBCFE8',
      glow: 'rgba(236, 72, 153, 0.5)',
    },
    APEX: {
      table: '#FFFFFF',
      upperL: '#E0F2FE',
      upperR: '#C7D2FE',
      frontCenter: '#38BDF8',
      frontL: '#818CF8',
      frontR: '#06B6D4',
      base: '#1E1B4B',
      stroke: '#FFFFFF',
      glow: 'rgba(56, 189, 248, 0.6)',
    },
  };

  const p = palettes[rankTier] || palettes.BEGINNER;

  return (
    <div className={`relative flex items-center justify-center shrink-0 -ml-1 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 100"
        className="w-full h-full drop-shadow-md overflow-visible"
        style={{ filter: `drop-shadow(0 4px 10px ${p.glow})` }}
      >
        {/* 7. Bottom Pavilion Shadow Base */}
        <polygon
          points="30,70 60,78 90,70 60,88"
          fill={p.base}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 5. Front Left Facet */}
        <polygon
          points="15,36 25,42 60,78 30,70"
          fill={p.frontL}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 6. Front Right Facet */}
        <polygon
          points="95,42 105,36 90,70 60,78"
          fill={p.frontR}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 4. Front Center Facet */}
        <polygon
          points="25,42 60,52 95,42 60,78"
          fill={p.frontCenter}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 2. Top-Left Upper Slope */}
        <polygon
          points="15,36 42,16 25,42"
          fill={p.upperL}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 3. Top-Right Upper Slope */}
        <polygon
          points="78,16 105,36 95,42"
          fill={p.upperR}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* 1. Top Table Facet (Brightest highlight face) */}
        <polygon
          points="42,16 78,16 95,42 60,52 25,42"
          fill={p.table}
          stroke={p.stroke}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Specular highlight ridge on top edge */}
        <line
          x1="43"
          y1="16.5"
          x2="77"
          y2="16.5"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
