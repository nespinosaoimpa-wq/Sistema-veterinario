import React from 'react';
import { TabModulo, UsuarioSesion } from '../types';

interface SidebarProps {
  activeTab: TabModulo;
  onTabChange: (tab: TabModulo) => void;
  sesion: UsuarioSesion;
  onOpenAuth: () => void;
  onUrgencyClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  sesion,
  onOpenAuth,
  onUrgencyClick,
}) => {
  const navItems: { id: TabModulo; label: string; icon: string; badge?: string; badgeColor?: string }[] = [
    { id: 'agenda', label: 'Agenda & Turnos', icon: 'calendar_month', badge: '8', badgeColor: 'bg-primary/10 text-primary' },
    { id: 'pacientes', label: 'Ficha de Pacientes', icon: 'pets' },
    { id: 'bot-y-alertas', label: 'VetBot & Alertas', icon: 'smart_toy', badge: 'En vivo', badgeColor: 'bg-primary text-on-primary' },
    { id: 'planes-salud', label: 'Planes de Socios', icon: 'health_and_safety', badge: '$10k', badgeColor: 'bg-secondary-fixed text-on-secondary-fixed' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-container-lowest border-r border-surface-container-high/60 h-screen fixed left-0 top-0 z-40 p-4 justify-between">
      {/* Top: Logo & Clínica */}
      <div className="flex flex-col space-y-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md">
            <span className="material-symbols-outlined text-[24px]">pets</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight leading-none">
              VetCare Pro
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold mt-1">
              SaaS B2B Multi-Clínica
            </span>
          </div>
        </div>

        {/* Info de la Clínica Activa (B2B Tenant) */}
        <div className="bg-surface-container-low rounded-2xl p-3 text-left border border-surface-container-high/40">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Veterinaria Activa
            </span>
            <button
              onClick={onOpenAuth}
              title="Cambiar clínica o registrar nueva"
              className="text-[10px] text-primary font-bold hover:underline flex items-center"
            >
              Cambiar <span className="material-symbols-outlined text-[12px] ml-0.5">swap_horiz</span>
            </button>
          </div>
          <span className="font-label-md text-label-md font-bold text-on-surface block truncate">
            {sesion.clinica.nombre_fantasia}
          </span>
          <span className="font-body-sm text-[11px] text-on-surface-variant block truncate">
            CUIT: {sesion.clinica.cuit}
          </span>
        </div>

        {/* Acceso Crítico de Urgencias */}
        <button
          onClick={onUrgencyClick}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-error-container text-on-error-container font-label-md text-label-md font-bold shadow-sm active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-error animate-pulse">emergency</span>
            <span className="text-error uppercase tracking-wider text-[12px]">Urgencias</span>
          </div>
          <span className="bg-surface-container-lowest text-error text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-sm">
            1 en cola
          </span>
        </button>

        {/* Enlaces de Navegación */}
        <nav className="flex flex-col space-y-1 text-left pt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-label-md text-label-md transition-all font-semibold ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary' : 'text-primary'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-primary-container text-on-primary-container' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Perfil del Profesional Activo */}
      <div className="pt-3 border-t border-surface-container-high/60">
        <div
          onClick={onOpenAuth}
          className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer text-left"
        >
          <img
            alt={sesion.nombre}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
            src={sesion.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3QXudc9qfIv8DaxZy4ToV1UJMSy_PgLRz12B8VqQaWrrmfPlQ5EoWbTYngTvMx03BVfcL0yc2yRretLB_XH-sFPnlfEvLTfbFmWV6VxC8g_zSpNrMZq8WRXyvKrd2rhpKBczPCNcafzSa7sE2V6sNNQlAqXx5rgbz7QE3fUZrepqne5mVbJcZTe1cx_gDe_Aih3MZWgVfofskMw9g25xkoWv2WrxEX9REbcHH_FQ'}
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-label-md font-bold text-on-surface truncate">
              {sesion.rol === 'veterinario' ? 'Dra. ' : ''}{sesion.nombre} {sesion.apellido}
            </span>
            <span className="font-body-sm text-[11px] text-primary font-semibold truncate">
              {sesion.matricula_provincial || 'Staff Recepción'}
            </span>
            <span className="text-[10px] text-on-surface-variant truncate">
              {sesion.box_actual} • {sesion.turno_actual}
            </span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">logout</span>
        </div>
      </div>
    </aside>
  );
};
