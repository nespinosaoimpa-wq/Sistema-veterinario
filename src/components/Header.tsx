import React from 'react';
import { TabModulo } from '../types';
import { mockDraValeria } from '../data/mockData';

interface HeaderProps {
  activeTab: TabModulo;
  onUrgencyClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onUrgencyClick, onProfileClick }) => {
  const getSubtitulo = () => {
    switch (activeTab) {
      case 'agenda': return 'Agenda';
      case 'pacientes': return 'Pacientes';
      case 'bot-y-alertas': return 'Bot Y Alertas';
      case 'planes-salud': return 'Planes Salud';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between max-w-5xl mx-auto">
        {/* Logo & Subtítulo */}
        <div className="flex items-center gap-space-sm cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[22px]">pets</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-bold">
              VetCare Pro
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-space-xs font-semibold">
              {getSubtitulo()}
            </span>
          </div>
        </div>

        {/* Acciones Rápidas del Header */}
        <div className="flex items-center gap-space-sm">
          {/* Badge de Urgencias Crítico */}
          <button 
            onClick={onUrgencyClick}
            className="flex items-center bg-error-container text-on-error-container px-3 py-1 rounded-full gap-1.5 shadow-sm active:scale-95 transition-transform"
            title="Ver triaje de urgencias activo"
          >
            <span className="material-symbols-outlined text-[16px] text-error animate-pulse">emergency</span>
            <span className="font-label-sm text-label-sm uppercase text-error font-bold tracking-wider">
              Urgencias
            </span>
          </button>

          {/* Avatar del Veterinario */}
          <button 
            onClick={onProfileClick}
            className="relative flex items-center justify-center p-0.5 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
            title={`Perfil de Dra. ${mockDraValeria.nombre} (${mockDraValeria.matricula})`}
          >
            <img 
              alt={`Dra. ${mockDraValeria.nombre}`} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30" 
              src={mockDraValeria.avatar_url}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full ring-2 ring-surface-container-lowest" />
          </button>
        </div>
      </div>
    </header>
  );
};
