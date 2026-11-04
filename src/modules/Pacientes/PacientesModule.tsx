import React, { useState } from 'react';
import { mockThorPaciente } from '../../data/mockData';
import { TabModulo } from '../../types';

interface PacientesModuleProps {
  onNavigateToTab: (tab: TabModulo) => void;
  onTriggerConsultation: () => void;
}

export const PacientesModule: React.FC<PacientesModuleProps> = ({
  onNavigateToTab,
  onTriggerConsultation,
}) => {
  const [paciente] = useState(mockThorPaciente);
  const [vacunasOpen, setVacunasOpen] = useState(true);
  const [cirugiasOpen, setCirugiasOpen] = useState(false);
  const [consultasOpen, setConsultasOpen] = useState(false);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto text-left">
      <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-md">
        
        {/* 2.1 Barra Superior / Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateToTab('agenda')}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">arrow_back</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Agenda</span>
          </button>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => alert("Compartiendo ficha médica vía PDF / Link")}
              className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              title="Compartir"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              title="Imprimir"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
            <button
              onClick={() => alert("Opciones de paciente: Editar datos, exportar o archivar")}
              className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
              title="Más opciones"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>

        {/* 2.2 Tarjeta de Perfil Principal (Hero Card) */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none" />

          {/* Fila superior: Foto + Datos esenciales */}
          <div className="flex items-start gap-space-md relative z-10">
            <div className="relative flex-shrink-0">
              <img
                className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-surface-container"
                alt={paciente.nombre}
                src={paciente.foto_url}
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-primary text-on-primary rounded-full p-1 shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">pets</span>
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface leading-tight font-bold tracking-tight truncate">
                  {paciente.nombre}
                </h1>
                <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[11px] inline-flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Activo
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary mt-0.5 font-bold flex items-center gap-1">
                {paciente.especie} · {paciente.raza}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                  Macho · {paciente.edad_texto}
                </span>
                <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-primary">fitness_center</span>
                  {paciente.peso_actual} kg <span className="text-primary font-bold">(↑ 0.5kg)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Vitales Rápidos en grilla de 2 columnas */}
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <div className="bg-error-container/30 rounded-2xl p-2.5 flex items-center gap-2 border border-error/10">
              <div className="w-8 h-8 rounded-xl bg-error-container text-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">bloodtype</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Grupo Sanguíneo</span>
                <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                  {paciente.grupo_sanguineo}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-2.5 flex items-center gap-2 border border-surface-container-high/40">
              <div className="w-8 h-8 rounded-xl bg-surface-container text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">tag</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Microchip ID</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate tracking-tight">
                  ...{paciente.microchip_id.slice(-5)}
                </span>
              </div>
            </div>
          </div>

          {/* Banner de Membresía de Salud (Atajo a Módulo 4) */}
          <div
            onClick={() => onNavigateToTab('planes-salud')}
            className="bg-gradient-to-r from-secondary/10 via-primary-container/10 to-surface-container rounded-2xl p-space-sm flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-on-secondary-container">Suscripción Médica</span>
                <span className="font-label-md text-label-md text-secondary font-bold">
                  {paciente.plan_salud}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
          </div>
        </div>

        {/* 2.3 Módulo de Contacto del Responsable Legal */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
              Responsable Legal
            </span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">Tutor Principal</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm min-w-0">
              <img
                className="w-11 h-11 rounded-full object-cover bg-surface-container-high flex-shrink-0 ring-2 ring-surface-container"
                alt={paciente.tutor.nombre_completo}
                src={paciente.tutor.avatar_url}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                  {paciente.tutor.nombre_completo}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant truncate">
                  {paciente.tutor.direccion}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                className="w-9 h-9 rounded-full bg-surface-container text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-95 shadow-sm"
                href={`tel:${paciente.tutor.telefono.replace(/\s+/g, '')}`}
                title="Llamar al tutor"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
              <a
                className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:bg-primary transition-all active:scale-95 shadow-sm"
                href={`https://wa.me/${paciente.tutor.telefono.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir WhatsApp"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2.4 Constantes Vitales de Base */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">ecg_heart</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Constantes Vitales de Base
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-on-surface-variant">18/09/2026</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="font-body-sm text-[11px] text-on-surface-variant">FC (lpm)</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">88</span>
              <span className="font-label-sm text-[11px] text-primary flex items-center gap-0.5 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> Normal
              </span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="font-body-sm text-[11px] text-on-surface-variant">FR (rpm)</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">24</span>
              <span className="font-label-sm text-[11px] text-primary flex items-center gap-0.5 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> Normal
              </span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="font-body-sm text-[11px] text-on-surface-variant">Temp (°C)</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">38.6</span>
              <span className="font-label-sm text-[11px] text-primary flex items-center gap-0.5 mt-0.5 font-semibold">
                <span className="material-symbols-outlined text-[12px]">check_circle</span> Óptima
              </span>
            </div>
          </div>
        </div>

        {/* 2.5 Sección Colapsable: Historial de Vacunación */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-sm">
          <div
            onClick={() => setVacunasOpen(!vacunasOpen)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">vaccines</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Historial de Vacunación
                </h2>
                <p className="font-body-sm text-[12px] text-on-surface-variant">2 al día · 1 pendiente</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform">
              {vacunasOpen ? 'expand_more' : 'chevron_right'}
            </span>
          </div>

          {vacunasOpen && (
            <div className="flex flex-col gap-2.5 pt-1">
              {/* Rabia */}
              <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">Rabia (Rabisin)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[12px]">done</span> Al día
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[12px]">
                  <span>Aplicada: 15/05/2026</span>
                  <span className="font-semibold text-primary">Vence: 15/05/2027</span>
                </div>
              </div>

              {/* Óctuple */}
              <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">Óctuple Canina</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[12px]">done</span> Al día
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[12px]">
                  <span>Aplicada: 10/01/2026</span>
                  <span className="font-semibold text-primary">Vence: 10/01/2027</span>
                </div>
              </div>

              {/* Giardia Alerta */}
              <div className="bg-tertiary-fixed/30 rounded-2xl p-3 flex flex-col gap-1.5 border border-tertiary/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">Giardia</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-[10px] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-ping" /> Refuerzo pendiente
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[12px]">
                  <span>Última dosis: 15/09/2025</span>
                  <span className="font-bold text-tertiary">Venció: 15/09/2026</span>
                </div>
              </div>

              <button
                onClick={() => setShowAddVaccineModal(true)}
                className="w-full mt-1 py-2.5 rounded-xl bg-surface-container text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors font-bold active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                + Registrar Vacuna
              </button>
            </div>
          )}
        </div>

        {/* 2.6 Sección Colapsable: Cirugías & Procedimientos */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-sm">
          <div
            onClick={() => setCirugiasOpen(!cirugiasOpen)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Cirugías &amp; Procedimientos
                </h2>
                <p className="font-body-sm text-[12px] text-on-surface-variant">2 antecedentes quirúrgicos</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform">
              {cirugiasOpen ? 'expand_more' : 'chevron_right'}
            </span>
          </div>

          {cirugiasOpen && (
            <div className="flex flex-col gap-2.5 pt-1">
              <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Castración programada</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">12/08/2023</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-on-surface-variant">
                  <span>Sede: Clínica San Isidro</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant font-label-sm text-[10px] font-semibold">
                    Sin complicaciones
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Sutura por herida en almohadilla</span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">03/03/2025</span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-[12px] text-on-surface-variant">
                  <span>Sede: Sede Central</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-[10px] font-semibold">
                    Alta médica
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2.7 Sección Colapsable: Consultas y Tratamientos */}
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-sm">
          <div
            onClick={() => setConsultasOpen(!consultasOpen)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Consultas y Tratamientos
                </h2>
                <p className="font-body-sm text-[12px] text-on-surface-variant">Historial ambulatorio</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant transition-transform">
              {consultasOpen ? 'expand_more' : 'chevron_right'}
            </span>
          </div>

          {consultasOpen && (
            <div className="flex flex-col gap-2.5 pt-1">
              <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-bold block">
                      Otitis externa leve
                    </span>
                    <span className="font-body-sm text-[12px] text-on-surface-variant">
                      18/09/2026 · Dra. Valeria Gómez
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px] flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[13px]">check</span> Recuperado
                  </span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-2.5 flex flex-col gap-1 border border-surface-container-high/30">
                  <span className="font-label-sm text-[11px] text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">medication</span> Tratamiento Indicado
                  </span>
                  <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                    Gotas óticas antiinflamatorias y antibióticas cada 12 horas durante 7 días. Limpieza previa con solución ótica secante.
                  </p>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Sucursal Norte
                  </span>
                  <button
                    onClick={() => alert("Descargando Receta Digital PDF firmada con MP 10.492")}
                    className="text-primary font-label-sm text-label-sm flex items-center gap-0.5 hover:underline font-bold"
                  >
                    Ver Receta PDF <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2.8 Botón Flotante de Acción Clínica */}
        <div className="pt-space-xs pb-space-sm flex flex-col gap-2">
          <button
            onClick={onTriggerConsultation}
            className="w-full h-13 bg-primary text-on-primary rounded-2xl font-label-lg text-label-lg shadow-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">note_add</span>
            + Nueva Entrada Clínica / Receta Digital
          </button>
          <div className="flex items-center justify-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span className="font-label-sm text-[11px]">
              Expediente Médico Protegido (Ley 14.346) · Sincronizado en tiempo real
            </span>
          </div>
        </div>
      </div>

      {/* Modal Registrar Vacuna */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-surface-container-lowest w-full rounded-t-3xl p-space-lg shadow-2xl max-w-lg text-left">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Registrar Nueva Vacuna
              </h3>
              <button onClick={() => setShowAddVaccineModal(false)}>
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Biológico / Vacuna</label>
                <input 
                  type="text" 
                  placeholder="Ej: Rabisin (Antirrábica), Giardiavax..." 
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">N° de Lote (SENASA)</label>
                  <input 
                    type="text" 
                    placeholder="Lote #84920" 
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Vencimiento</label>
                  <input 
                    type="date" 
                    defaultValue="2027-11-04" 
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  alert("Vacuna registrada y certificado emitido.");
                  setShowAddVaccineModal(false);
                }}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md font-bold shadow-md mt-2"
              >
                Guardar en Libreta Sanitaria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

