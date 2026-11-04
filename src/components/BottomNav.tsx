import React from 'react';
import { TabModulo } from '../types';

interface BottomNavProps {
  activeTab: TabModulo;
  onTabChange: (tab: TabModulo) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabModulo; label: string; icon: string }[] = [
    { id: 'agenda', label: 'Agenda', icon: 'calendar_month' },
    { id: 'pacientes', label: 'Pacientes', icon: 'pets' },
    { id: 'bot-y-alertas', label: 'Bot & Alertas', icon: 'smart_toy' },
    { id: 'planes-salud', label: 'Planes Salud', icon: 'health_and_safety' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.05)] border-t border-surface-container-high/60">
      <div className="flex items-center justify-around h-16 px-space-xs max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 transition-all group ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-primary/10' : 'group-hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-primary font-bold' : ''}`}>
                  {tab.icon}
                </span>
              </div>
              <span className="font-label-sm text-[11px] mt-0.5 tracking-tight leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

