import React from 'react';
import { TabModulo, UsuarioSesion } from '../types';

interface HeaderProps {
  activeTab: TabModulo;
  sesion: UsuarioSesion;
  onUrgencyClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  sesion,
  onUrgencyClick,
  onProfileClick,
}) => {
  const getSubtitulo = () => {
    switch (activeTab) {
      case 'agenda': return 'Agenda & Turnos';
      case 'pacientes': return 'Ficha de Pacientes';
      case 'bot-y-alertas': return 'VetBot & Alertas';
      case 'planes-salud': return 'Planes de Socios';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 lg:left-64 z-40 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe border-b border-surface-container-high/40">
      <div className="h-16 px-margin flex items-center justify-between max-w-6xl mx-auto">
        
        {/* Lado Izquierdo: Brand en móvil o Título de Sección en Desktop */}
        <div className="flex items-center gap-space-sm cursor-pointer">
          {/* Logo visible solo en móviles (en desktop está en el sidebar) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">pets</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-bold">
                VetCare Pro
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant leading-none mt-1 font-semibold">
                {getSubtitulo()}
              </span>
            </div>
          </div>

          {/* En desktop: Indicador de módulo y sede */}
          <div className="hidden lg:flex items-center gap-3 text-left">
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
              {getSubtitulo()}
            </h1>
            <span className="text-[12px] bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-semibold">
              {sesion.clinica.nombre_fantasia} · {sesion.box_actual}
            </span>
          </div>
        </div>

        {/* Lado Derecho: Urgencias, Estado y Perfil */}
        <div className="flex items-center gap-space-sm">
          {/* Badge de Urgencias Crítico */}
          <button 
            onClick={onUrgencyClick}
            className="flex items-center bg-error-container text-on-error-container px-3 py-1.5 rounded-full gap-1.5 shadow-sm active:scale-95 transition-transform"
            title="Ver triaje de urgencias activo"
          >
            <span className="material-symbols-outlined text-[16px] text-error animate-pulse">emergency</span>
            <span className="font-label-sm text-label-sm uppercase text-error font-bold tracking-wider">
              Urgencias
            </span>
          </button>

          {/* Avatar del Veterinario con Matrícula visible en desktop */}
          <button 
            onClick={onProfileClick}
            className="relative flex items-center gap-2 p-1 rounded-2xl hover:bg-surface-container-low transition-colors active:scale-95"
            title={`Perfil de ${sesion.nombre} (${sesion.matricula_provincial || 'Staff'})`}
          >
            <div className="relative">
              <img 
                alt={sesion.nombre} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30" 
                src={sesion.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3QXudc9qfIv8DaxZy4ToV1UJMSy_PgLRz12B8VqQaWrrmfPlQ5EoWbTYngTvMx03BVfcL0yc2yRretLB_XH-sFPnlfEvLTfbFmWV6VxC8g_zSpNrMZq8WRXyvKrd2rhpKBczPCNcafzSa7sE2V6sNNQlAqXx5rgbz7QE3fUZrepqne5mVbJcZTe1cx_gDe_Aih3MZWgVfofskMw9g25xkoWv2WrxEX9REbcHH_FQ'}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface-container-lowest" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-sm text-[12px] font-bold text-on-surface leading-tight">
                {sesion.rol === 'veterinario' ? 'Dra. ' : ''}{sesion.nombre} {sesion.apellido}
              </span>
              <span className="text-[10px] text-primary font-semibold">
                {sesion.matricula_provincial || 'Recepción'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
