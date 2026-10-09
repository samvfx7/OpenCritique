import React from 'react';

export type PrimaryDestination = 'HOME' | 'WORKOUT' | 'AI_COACH' | 'PROFILE';

interface OCBottomNavigationProps {
  currentTab: PrimaryDestination;
  onSelectTab: (tab: PrimaryDestination) => void;
}

export const OCBottomNavigation: React.FC<OCBottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { key: PrimaryDestination; label: string }[] = [
    { key: 'HOME', label: 'Home' },
    { key: 'WORKOUT', label: 'Workout' },
    { key: 'AI_COACH', label: 'AI Coach' },
    { key: 'PROFILE', label: 'Profile' },
  ];

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-50 bg-[#121214]/85 backdrop-blur-[20px] border border-white/10 h-16 max-w-[400px] mx-auto flex items-center justify-around px-2 shadow-2xl"
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
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-space text-[0.7rem] ${
              isSelected
                ? 'text-[#8B5CF6] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {isSelected && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] transition-all" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
