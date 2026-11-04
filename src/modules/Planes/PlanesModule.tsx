import React, { useState } from 'react';
import { mockSuscripcionThor, mockPlanesCatalogo } from '../../data/mockData';
import { TabModulo } from '../../types';

interface PlanesModuleProps {
  onNavigateToTab: (tab: TabModulo) => void;
}

export const PlanesModule: React.FC<PlanesModuleProps> = ({ onNavigateToTab }) => {
  const [activeView, setActiveView] = useState<'activa' | 'catalogo'>('activa');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [selectedPlanForAffiliation, setSelectedPlanForAffiliation] = useState('PLAN-SOCIO-COMUNIDAD');
  const [walletSaved, setWalletSaved] = useState(false);

  const handleSaveToWallet = () => {
    setWalletSaved(true);
    setTimeout(() => {
      setShowQRModal(false);
      setWalletSaved(false);
    }, 1300);
  };

  return (
    <div className="flex flex-col w-full px-margin py-space-md space-y-space-md pb-28 max-w-5xl mx-auto text-left">
      
      {/* 4.1 Encabezado */}
      <div className="flex flex-col space-y-space-xs">
        <div className="inline-flex items-center space-x-1.5 self-start px-space-sm py-0.5 rounded-full bg-surface-container text-secondary">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span className="font-label-sm text-[11px] uppercase tracking-wider font-bold">
            Cobertura Médica &amp; Obra Social
          </span>
        </div>
        <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight font-bold">
          Medicina Prepaga &amp; Planes Sanitarios
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Gestión clínica integral de beneficios sanitarios, seguimiento de consumos preventivos y credenciales digitales.
        </p>
      </div>

      {/* 4.2 Switcher de Vistas (Tabs) */}
      <div className="bg-surface-container-high p-1 rounded-2xl flex items-center shadow-sm">
        <button
          onClick={() => setActiveView('activa')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all duration-200 flex items-center justify-center space-x-1.5 font-bold ${
            activeView === 'activa'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="truncate">Suscripción Activa</span>
        </button>
        <button
          onClick={() => setActiveView('catalogo')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all duration-200 flex items-center justify-center space-x-1.5 font-bold ${
            activeView === 'catalogo'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">view_carousel</span>
          <span className="truncate">Catálogo de Planes</span>
        </button>
      </div>

      {/* 4.3 Bandeja de Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-space-sm">
        <button
          onClick={() => setShowValidateModal(true)}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-surface-container-low text-secondary font-label-md text-label-md shadow-sm border border-surface-container-high/40 active:scale-[0.98] transition-transform font-bold hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[19px]">qr_code_scanner</span>
          <span className="truncate">Validar DNI / Chip</span>
        </button>
        <button
          onClick={() => setShowAffiliateModal(true)}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-[0.98] transition-transform font-bold hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[19px]">add_circle</span>
          <span className="truncate">Afiliar Mascota</span>
        </button>
      </div>

      {/* VISTA 1: Suscripción Activa */}
      {activeView === 'activa' && (
        <div className="flex flex-col space-y-space-md">
          {/* Header del Paciente Titular */}
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex items-center justify-between">
            <div className="flex items-center space-x-space-md">
              <div className="relative">
                <img
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                  alt="Thor"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1B-V6SRVck3OOOvEjepguu-jdMGufduWi6bcjLgKPq-VX7iH0leAqcVAda5onLMq2WcuR11EQvaDa_-hzU8L1zugWPqjgpO12x8cJZnsQ7EDqUuqizWddgDo9D5LrpAulDf9qq3CyDq1Z_pcy7uMsllsLc85mvDuN5sHIWwH22PX0lt0YwW4CfwfNpqis2qgefaq0sFZTIFJwPlLL_YCeNq8MJhFXoROSvWcC7Ra7"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full ring-2 ring-surface-container-lowest" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Thor</span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold">
                    Canino
                  </span>
                </div>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Golden Retriever · 4 años · Chip #9810-AR
                </span>
                <span className="font-label-sm text-[11px] text-primary font-semibold">
                  Titular: Lic. Martín Albarracín
                </span>
              </div>
            </div>
            <button
              onClick={() => alert("Cambiando entre pacientes del mismo titular")}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          </div>

          {/* Tarjeta de Membresía VIP */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary p-space-lg shadow-xl">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <svg fill="currentColor" height="180" viewBox="0 0 24 24" width="180">
                <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 3C6.7 5 6 5.7 6 6.5S6.7 8 7.5 8 9 7.3 9 6.5 8.3 5 7.5 5zm9 0c-.8 0-1.5.7-1.5 1.5S15.7 8 16.5 8 18 7.3 18 6.5 17.3 5 16.5 5zM5 9c-.8 0-1.5.7-1.5 1.5S4.2 12 5 12s1.5-.7 1.5-1.5S5.8 9 5 9zm14 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5S19.8 9 19 9zm-7 2.5c-3 0-5.5 2-5.5 4.5 0 2.1 1.7 3.5 3.5 3.5 1 0 1.5-.5 2-.5s1 .5 2 .5c1.8 0 3.5-1.4 3.5-3.5 0-2.5-2.5-4.5-5.5-4.5z" />
              </svg>
            </div>

            <div className="relative flex flex-col space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[24px] text-tertiary-fixed-dim">stars</span>
                  <span className="font-headline-md text-headline-md tracking-tight font-bold">
                    {mockSuscripcionThor.plan_nombre}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full font-label-sm text-[10px] bg-surface-container-lowest/20 backdrop-blur-md uppercase text-on-primary tracking-wider font-bold">
                  {mockSuscripcionThor.categoria}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse" />
                  <span className="font-label-md text-label-md font-semibold">Afiliado Activo · Cuota al día</span>
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-headline-lg text-headline-lg font-extrabold text-[28px]">
                    $ {mockSuscripcionThor.cuota_mensual.toLocaleString('es-AR')}
                  </span>
                  <span className="font-body-sm text-[12px] opacity-90">/ mes (Débito Automático)</span>
                </div>
              </div>

              <div className="pt-space-sm flex items-center justify-between border-t border-white/20">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] opacity-80">Próxima facturación:</span>
                  <span className="font-label-md text-[13px] font-bold">{mockSuscripcionThor.proxima_facturacion}</span>
                </div>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-md hover:bg-surface-bright active:scale-95 transition-all font-bold"
                >
                  <span className="material-symbols-outlined text-[17px]">qr_code_2</span>
                  <span>Carnet Digital</span>
                </button>
              </div>
            </div>
          </div>

          {/* Coberturas del Ejercicio Anual */}
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary text-[20px]">medical_services</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Coberturas del Ejercicio 2026
                </h2>
              </div>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">Período Anual</span>
            </div>

            {/* Lista de Prestaciones y Coberturas */}
            <div className="space-y-3">
              {mockSuscripcionThor.consumos.map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-1.5 p-space-sm rounded-2xl bg-surface-container-low border border-surface-container-high/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[16px]">
                          {idx === 0 ? 'stethoscope' : idx === 1 ? 'vaccines' : idx === 2 ? 'healing' : idx === 3 ? 'dentistry' : 'emergency'}
                        </span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        {item.prestacion}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container text-primary font-bold">
                      {item.cobertura_label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-body-sm text-[11px] text-on-surface-variant">{item.detalle}</span>
                    <span className="font-label-sm text-[11px] text-on-surface font-semibold">{item.uso_label}</span>
                  </div>

                  {item.porcentaje_uso > 0 && (
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${item.porcentaje_uso}%` }}
                      />
                    </div>
                  )}

                  {item.alerta_siguiente && (
                    <span className="font-label-sm text-[10px] text-tertiary flex items-center space-x-1 pt-0.5 font-bold">
                      <span className="material-symbols-outlined text-[14px]">event_repeat</span>
                      <span>{item.alerta_siguiente}</span>
                    </span>
                  )}

                  {item.permite_reserva && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          alert("Redirigiendo a Agenda para reservar turno de profilaxis dental bonificada");
                          onNavigateToTab('agenda');
                        }}
                        className="px-3 py-1 rounded-xl bg-surface-container text-primary font-label-sm text-[11px] font-bold hover:bg-surface-container-highest transition-colors active:scale-95"
                      >
                        Reservar Turno
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Ahorro Acumulado */}
          <div className="bg-surface-container-low rounded-3xl p-space-md flex items-start space-x-3 border border-surface-container-high/40">
            <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">tips_and_updates</span>
            <div className="flex flex-col space-y-1">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Ahorro Preventivo Acumulado
              </span>
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                En lo que va del año, la membresía le ha bonificado a Thor un total estimado de{' '}
                <strong className="text-primary font-bold">
                  $ {mockSuscripcionThor.ahorro_acumulado.toLocaleString('es-AR')}
                </strong>{' '}
                en tratamientos, urgencias y vacunas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: Catálogo de Planes Disponibles */}
      {activeView === 'catalogo' && (
        <div className="flex flex-col space-y-space-md">
          <div className="flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Planes Disponibles para Pacientes
            </h2>
            <span className="font-body-sm text-[12px] text-on-surface-variant">
              Planes accesibles para evitar desembolsos elevados en urgencias y vacunas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* PLAN 1: Plan Socio Particular ($10.000/mes) - DESTACADO POR EL USUARIO */}
            <div className="bg-gradient-to-br from-surface-container-lowest via-primary/5 to-surface-container-low rounded-3xl p-space-md shadow-lg border-2 border-primary space-y-space-sm relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-0.5 rounded-full font-label-sm text-[10px] bg-primary text-on-primary font-bold uppercase tracking-wider">
                    ★ Plan Socio Recomendado
                  </span>
                  <span className="font-label-sm text-[11px] text-primary font-bold">
                    Cuota Fija Sin Sorpresas
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Plan Socio Particular
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant font-medium">
                      Cuota comunitaria mensual para no pagar todo de golpe
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm text-primary font-extrabold text-[22px]">
                      $ 10.000
                    </span>
                    <span className="block font-body-sm text-[11px] text-on-surface-variant">/ mes</span>
                  </div>
                </div>

                <p className="font-body-sm text-[12px] text-on-surface-variant italic bg-surface-container/60 p-2.5 rounded-xl border border-primary/20 my-2">
                  "Con solo $10.000 por mes, si tu mascota sufre una urgencia o le tocan las vacunas del año, tenés la atención 100% cubierta sin tener que desembolsar $80.000 o más en el acto."
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span><strong>100% Cubierto en Urgencias 24/7</strong> sin copago</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span><strong>100% Bonificado en Vacunas</strong> (Rabia, Séxtuple/Triple Felina)</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Consultas clínicas generales (hasta 6 al año) sin cargo</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span><strong>50% de descuento directo</strong> en cirugías e internación</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Carnet digital QR con atención prioritaria</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForAffiliation('PLAN-SOCIO-COMUNIDAD');
                  setShowAffiliateModal(true);
                }}
                className="w-full mt-space-sm py-3 px-4 rounded-2xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container shadow-md active:scale-95 transition-all"
              >
                Afiliar a Plan Socio ($10.000/mes)
              </button>
            </div>

            {/* PLAN 2: Plan Esencial ($12.900/mes) */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 space-y-space-sm relative h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Plan Esencial</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Protección básica y medicina preventiva</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">$ 12.900</span>
                    <span className="block font-body-sm text-[11px] text-on-surface-variant">/ mes</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-3">
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Consultas clínicas: 100% bonificadas (hasta 6 al año)</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Vacunación anual y desparasitaciones periódicas</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>15% descuento en farmacia y medicamentos</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForAffiliation('PLAN-ESENCIAL');
                  setShowAffiliateModal(true);
                }}
                className="w-full mt-space-sm py-2.5 px-4 rounded-2xl bg-surface-container text-primary font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
              >
                Afiliar a Plan Esencial
              </button>
            </div>

            {/* PLAN 3: Plan Platinum ($24.500/mes) */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-md border border-surface-container-high/40 space-y-space-sm relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full font-label-sm text-[10px] bg-secondary text-on-secondary font-bold">
                    Plan de Thor · Cobertura Integral
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Plan Platinum</span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Máxima tranquilidad para cachorros y adultos</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">$ 24.500</span>
                    <span className="block font-body-sm text-[11px] text-on-surface-variant">/ mes</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-3">
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Consultas ilimitadas + Urgencias 24/7 sin copago</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>40% de cobertura en cirugías e internaciones</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Limpieza dental con ultrasonido anual gratuita</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Estudios de laboratorio y radiografías al 50%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-space-xs mt-3">
                <button
                  onClick={() => alert("Mostrando comparativa detallada de coberturas")}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold"
                >
                  Comparar Coberturas
                </button>
                <button
                  onClick={() => alert("Compartiendo ficha del plan por WhatsApp")}
                  className="py-2.5 px-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>

            {/* PLAN 4: Plan Senior (+7 Años) */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 space-y-space-sm relative h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Plan Senior</span>
                      <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                        +7 Años
                      </span>
                    </div>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">Diagnóstico precoz y geriatría preventiva</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">$ 28.900</span>
                    <span className="block font-body-sm text-[11px] text-on-surface-variant">/ mes</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-3">
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Chequeos geriátricos semestrales (perfil renal/hepático)</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Ecografías abdominales y electrocardiogramas bonificados</span>
                  </div>
                  <div className="flex items-center space-x-2 font-body-sm text-[12px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span>Soporte nutricional y medicación crónica con 30% off</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForAffiliation('PLAN-SENIOR');
                  setShowAffiliateModal(true);
                }}
                className="w-full mt-space-sm py-2.5 px-4 rounded-2xl bg-surface-container text-primary font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
              >
                Cambiar a Plan Senior
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Red Propia VetCare */}
      <div className="bg-gradient-to-r from-surface-container-low to-surface-container rounded-3xl p-space-md flex items-center space-x-space-md border border-surface-container-high/40">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex-shrink-0 flex items-center justify-center text-primary shadow-sm">
          <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-label-md text-label-md text-on-surface font-bold">Red Veterinaria Propia VetCare</span>
          <span className="font-body-sm text-[12px] text-on-surface-variant">
            Atención directa sin reintegros ni autorizaciones demoradas. Acceso directo a quirófano y laboratorio central.
          </span>
        </div>
      </div>

      {/* MODAL 1: Carnet Digital QR (VetCare Pass) */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-margin">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-space-lg shadow-2xl flex flex-col items-center space-y-space-md text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Carnet Digital · VetCare Pass
              </h3>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                Muestra este código al ingresar a cualquier sede hospitalaria para validar cobertura instantánea.
              </p>
            </div>

            {/* Código QR SVG Sintético */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-md border border-surface-container-high flex flex-col items-center">
              <svg className="w-44 h-44 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0 0h30v30H0V0zm6 6v18h18V6H6zm40-6h30v30H46V0zm6 6v18h18V6H52zM0 46h30v30H0V46zm6 6v18h18V52H6zm40 0h10v10H46V52zm10 10h10v10H56V62zm10-10h10v10H66V52zm-10 20h10v10H56V72zm20 0h10v10H76V72zm-20-20h10v10H56V52zm30 0h10v10H86V52zm0 20h10v10H86V72zm-40 20h10v10H46V92zm20 0h10v10H66V92zm20 0h10v10H86V92z" />
                <circle className="text-primary" cx="50" cy="50" fill="currentColor" r="7" />
              </svg>
              <span className="font-label-sm text-[11px] text-on-surface-variant mt-2 font-mono font-bold">
                ID: {mockSuscripcionThor.numero_carnet}
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full pt-1">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 py-3 rounded-2xl bg-surface-container text-on-surface font-label-md text-label-md font-bold"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveToWallet}
                className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center space-x-1.5 font-bold shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {walletSaved ? 'check' : 'file_download'}
                </span>
                <span>{walletSaved ? 'Guardado en Wallet' : 'Guardar Pass'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Validar DNI / Chip */}
      {showValidateModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-surface-container-lowest w-full rounded-t-3xl p-space-lg shadow-2xl max-w-lg text-left animate-in slide-in-from-bottom-6">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Validar Cobertura por DNI o Chip
                </h3>
              </div>
              <button onClick={() => setShowValidateModal(false)}>
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant mb-3">
              Escanee el microchip RFID o ingrese el número de documento del titular afiliado.
            </p>
            <div className="relative flex items-center mb-3">
              <input
                type="text"
                placeholder="Ej: 9810-AR-94812 o DNI 32.849.201"
                className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={() => alert("Validación exitosa: Thor (Plan Platinum Activo, cuota al día)")}
                className="absolute right-2 px-3 py-1.5 bg-primary text-on-primary rounded-xl font-label-sm text-label-sm font-bold shadow-sm"
              >
                Buscar
              </button>
            </div>
            <div className="flex items-center justify-center p-4 rounded-2xl bg-surface-container-low border border-dashed border-primary/40">
              <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">barcode_reader</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant ml-2 font-medium">
                Lector NFC/RFID listo para aproximación del animal
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Afiliar Mascota a Obra Social */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-surface-container-lowest w-full rounded-t-3xl p-space-lg shadow-2xl max-w-lg text-left animate-in slide-in-from-bottom-6">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Afiliar Mascota a Plan Sanitario
                </h3>
              </div>
              <button onClick={() => setShowAffiliateModal(false)}>
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant mb-3">
              Seleccione el paciente clínico y el plan elegido para emitir el carnet digital.
            </p>
            <div className="space-y-3">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Paciente Clínico Registrado
                </label>
                <select className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl font-body-md focus:outline-none">
                  <option>Mimi (Felino - Siamés) - Prop. Sofía Lara</option>
                  <option>Rocky (Canino - Bulldog Francés) - Prop. Carlos Méndez</option>
                  <option>Luna (Canino - Caniche Toy) - Prop. Roberto Paz</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Plan a Contratar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedPlanForAffiliation('PLAN-SOCIO-COMUNIDAD')}
                    className={`p-2.5 rounded-2xl font-label-sm text-[11px] font-bold text-center border transition-all ${
                      selectedPlanForAffiliation === 'PLAN-SOCIO-COMUNIDAD'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface border-transparent'
                    }`}
                  >
                    Socio ($10k)
                  </button>
                  <button
                    onClick={() => setSelectedPlanForAffiliation('PLAN-PLATINUM')}
                    className={`p-2.5 rounded-2xl font-label-sm text-[11px] font-bold text-center border transition-all ${
                      selectedPlanForAffiliation === 'PLAN-PLATINUM'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface border-transparent'
                    }`}
                  >
                    Platinum
                  </button>
                  <button
                    onClick={() => setSelectedPlanForAffiliation('PLAN-SENIOR')}
                    className={`p-2.5 rounded-2xl font-label-sm text-[11px] font-bold text-center border transition-all ${
                      selectedPlanForAffiliation === 'PLAN-SENIOR'
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface border-transparent'
                    }`}
                  >
                    Senior
                  </button>
                </div>
              </div>

              <div className="p-3 bg-primary/5 rounded-2xl border border-primary/20 text-[12px] text-primary">
                {selectedPlanForAffiliation === 'PLAN-SOCIO-COMUNIDAD' ? (
                  <span>
                    🎉 <strong>Plan Socio Particular ($10.000/mes):</strong> Cubre 100% urgencias 24/7 y vacunas de calendario. La primera cuota se debita automáticamente.
                  </span>
                ) : selectedPlanForAffiliation === 'PLAN-PLATINUM' ? (
                  <span>
                    ⭐ <strong>Plan Platinum ($24.500/mes):</strong> Cobertura VIP integral con limpiezas dentales anuales y cirugías bonificadas.
                  </span>
                ) : (
                  <span>
                    🩺 <strong>Plan Senior ($28.900/mes):</strong> Chequeos geriátricos completos y medicación crónica.
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  alert("¡Afiliación confirmada con éxito! Se ha generado el carnet digital QR y enviado la confirmación por WhatsApp.");
                  setShowAffiliateModal(false);
                }}
                className="w-full py-3.5 bg-primary text-on-primary rounded-2xl font-label-md text-label-md font-bold shadow-md active:scale-95 transition-transform mt-2"
              >
                Confirmar Alta &amp; Emitir Carnet Digital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

