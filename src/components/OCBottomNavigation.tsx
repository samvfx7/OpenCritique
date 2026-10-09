import React from 'react';
import { Compass, Dumbbell, Sparkles, User } from 'lucide-react';

export type PrimaryDestination = 'HOME' | 'WORKOUT' | 'AI_COACH' | 'PROFILE';

interface OCBottomNavigationProps {
  currentTab: PrimaryDestination;
  onSelectTab: (tab: PrimaryDestination) => void;
}

export const OCBottomNavigation: React.FC<OCBottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { key: PrimaryDestination; label: string; icon: React.ReactNode }[] = [
    { key: 'HOME', label: 'Home', icon: <Compass size={18} /> },
    { key: 'WORKOUT', label: 'Workout', icon: <Dumbbell size={18} /> },
    { key: 'AI_COACH', label: 'AI Coach', icon: <Sparkles size={18} /> },
    { key: 'PROFILE', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-50 bg-[#121214]/90 backdrop-blur-[24px] border border-white/10 h-16 max-w-[400px] mx-auto flex items-center justify-around px-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
      style={{
        borderRadius: '35px',
      }}
    >
      {tabs.map((tab) => {
        const isSelected = currentTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onSelectTab(tab.key)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-sans text-[0.65rem] select-none ${
              isSelected
                ? 'text-white font-bold'
                : 'text-white/45 hover:text-white/80'
            }`}
          >
            <div
              className={`transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'text-[#8B5CF6] scale-110 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                  : 'text-white/50'
              }`}
            >
              {tab.icon}
            </div>

            <span className="leading-none tracking-tight">{tab.label}</span>

            {isSelected && (
              <div className="w-1 h-1 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6] transition-all" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
