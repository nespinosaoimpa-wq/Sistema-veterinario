import React, { useState } from 'react';
import { mockTurnosAgenda, mockTriajeUrgencia, mockDraValeria } from '../../data/mockData';
import { TurnoAgenda, TabModulo } from '../../types';

interface AgendaModuleProps {
  onNavigateToTab: (tab: TabModulo) => void;
  onCallPatient: (patientName: string, tutorName: string) => void;
}

export const AgendaModule: React.FC<AgendaModuleProps> = ({ onNavigateToTab, onCallPatient }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'confirmed' | 'waiting' | 'urgent'>('all');
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [turnos, setTurnos] = useState<TurnoAgenda[]>(mockTurnosAgenda);
  const [triaje, setTriaje] = useState(mockTriajeUrgencia);
  const [showNewTurnoModal, setShowNewTurnoModal] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Días de la semana 43
  const weekDays = [
    { dia: 'LUN', num: 21, hasEvent: false },
    { dia: 'MAR', num: 22, hasEvent: true },
    { dia: 'MIÉ', num: 23, hasEvent: true },
    { dia: 'JUE', num: 24, hasEvent: true, today: true },
    { dia: 'VIE', num: 25, hasEvent: true },
    { dia: 'SÁB', num: 26, hasEvent: false },
    { dia: 'DOM', num: 27, hasEvent: false },
  ];

  // Filtro de turnos
  const filteredTurnos = turnos.filter((t) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'confirmed') return t.estado === 'confirmed';
    if (selectedFilter === 'waiting') return t.estado === 'waiting';
    if (selectedFilter === 'urgent') return t.estado === 'urgent';
    return true;
  });

  const handleAtenderUrgencia = () => {
    setTriaje(prev => ({ ...prev, atendido: true }));
    onNavigateToTab('pacientes');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto">
      {/* 1.1 Hero Section / Bienvenida */}
      <div className="px-margin pt-space-md pb-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
              Turno Mañana • Box 1
            </span>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight font-bold">
              ¡Hola, Dra. {mockDraValeria.nombre}!
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span>Jueves, 24 de Octubre</span>
            </p>
          </div>
          <div className="relative flex flex-col items-end">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Notificaciones del turno"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface active:scale-95 transition-transform relative shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
            </button>
          </div>
        </div>

        {/* Modal/Dropdown de notificaciones */}
        {notificationOpen && (
          <div className="mt-3 p-3 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high text-left animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <span className="font-label-md font-bold text-on-surface">Notificaciones del Turno</span>
              <span className="text-[11px] text-primary font-bold">2 nuevas</span>
            </div>
            <div className="mt-2 space-y-2 text-[12px]">
              <div className="flex items-start gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-error">emergency</span>
                <span>Ingreso en Sala 2: Golden Retriever con disnea aguda.</span>
              </div>
              <div className="flex items-start gap-2 text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                <span>El bot confirmó el turno de Mimi para las 10:15 hs.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1.2 Banner de Urgencia Crítico (Triaje en Espera) */}
      {!triaje.atendido && (
        <div className="px-margin mt-space-sm">
          <div className="rounded-2xl bg-error-container text-on-error-container p-space-md shadow-md flex flex-col gap-space-xs relative overflow-hidden border border-error/20 text-left">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-error animate-pulse">warning</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-error font-bold">
                  Triaje de Urgencia en Espera
                </span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-lowest text-error px-2.5 py-0.5 rounded-full shadow-sm font-semibold">
                {triaje.tiempo_espera}
              </span>
            </div>

            <div className="flex items-center gap-space-sm mt-1">
              <div className="w-13 h-13 rounded-xl bg-surface-container-lowest flex items-center justify-center text-error flex-shrink-0 shadow-sm overflow-hidden">
                <img
                  className="w-14 h-14 object-cover rounded-xl"
                  alt="Canino en Urgencias"
                  src={triaje.foto_url}
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                  {triaje.especie_raza}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {triaje.sintoma}
                </span>
              </div>
            </div>

            <div className="mt-space-xs pt-space-xs flex items-center justify-between gap-space-sm border-t border-error/10">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-error">ecg_heart</span>
                SpO2 {triaje.spo2}% • Temp {triaje.temperatura}°C
              </span>
              <button
                onClick={handleAtenderUrgencia}
                className="bg-error text-on-error px-4 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 active:scale-95 transition-transform shadow-md font-bold"
              >
                <span>Atender Ya</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1.3 Panel de Estadísticas del Día */}
      <div className="px-margin mt-space-md">
        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-xs rounded-2xl shadow-sm border border-surface-container-high/40">
          <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-surface-container-low text-center">
            <span className="font-headline-md text-headline-md text-primary font-bold">8</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Citas Hoy</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-surface-container-low text-center">
            <span className="font-headline-md text-headline-md text-secondary font-bold">3</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Atendidas</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-surface-container-low text-center">
            <span className="font-headline-md text-headline-md text-tertiary font-bold">1</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Urg. Resuelta</span>
          </div>
        </div>
      </div>

      {/* 1.4 Selector de Semana */}
      <div className="mt-space-md">
        <div className="px-margin flex items-center justify-between mb-space-xs">
          <span className="font-label-lg text-label-lg text-on-surface font-bold">Semana 43</span>
          <button 
            onClick={() => alert("Calendario mensual en desarrollo")}
            className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            <span>Mes completo</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-margin pb-1 no-scrollbar">
          {weekDays.map((wd) => {
            const isSelected = selectedDay === wd.num;
            return (
              <button
                key={wd.num}
                onClick={() => setSelectedDay(wd.num)}
                className={`flex flex-col items-center justify-center min-w-[50px] py-2 px-1 rounded-xl active:scale-95 transition-all text-center ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className={`font-label-sm text-label-sm ${isSelected ? 'opacity-90' : ''}`}>
                  {wd.dia}
                </span>
                <span className={`font-headline-sm text-headline-sm mt-0.5 ${isSelected ? 'font-bold' : ''}`}>
                  {wd.num}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected ? 'bg-primary-fixed' : wd.hasEvent ? 'bg-secondary' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 1.5 Chips de Filtro */}
      <div className="mt-space-md px-margin">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95 transition-transform ${
              selectedFilter === 'all'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span>Todos</span>
            <span className="bg-primary-container text-on-primary-container px-1.5 py-0.2 rounded-full text-[10px]">
              8
            </span>
          </button>
          <button
            onClick={() => setSelectedFilter('confirmed')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95 transition-transform ${
              selectedFilter === 'confirmed'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span>Confirmados</span>
            <span className="bg-surface-container text-on-secondary-container px-1.5 py-0.2 rounded-full text-[10px]">
              5
            </span>
          </button>
          <button
            onClick={() => setSelectedFilter('waiting')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95 transition-transform ${
              selectedFilter === 'waiting'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span>En Espera</span>
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.2 rounded-full text-[10px]">
              2
            </span>
          </button>
          <button
            onClick={() => setSelectedFilter('urgent')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95 transition-transform ${
              selectedFilter === 'urgent'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>Urgencias</span>
            <span className="bg-error-container text-on-error-container px-1.5 py-0.2 rounded-full text-[10px]">
              1
            </span>
          </button>
        </div>
      </div>

      {/* 1.6 Cronograma del Día (Tarjetas de Pacientes con Timeline) */}
      <div className="px-margin mt-space-md flex flex-col gap-space-md text-left">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Cronograma del Día
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            Box Principal 01
          </span>
        </div>

        <div className="relative flex flex-col gap-space-md">
          {filteredTurnos.map((turno) => (
            <div key={turno.id} className="flex gap-space-sm items-start">
              {/* Timeline izquierdo */}
              <div className="flex flex-col items-center flex-shrink-0 w-12 pt-1 text-center">
                <span className={`font-label-md text-label-md font-bold ${
                  turno.estado === 'waiting' ? 'text-primary' : 'text-on-surface'
                }`}>
                  {turno.hora}
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  {turno.duracion}
                </span>
                <div className="w-0.5 h-16 bg-surface-container-highest mt-2 rounded-full" />
              </div>

              {/* Tarjeta del Paciente */}
              <div className="flex-1 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-xs relative overflow-hidden">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex-shrink-0 overflow-hidden shadow-sm">
                      <img
                        className="w-full h-full object-cover"
                        alt={turno.paciente.nombre}
                        src={turno.paciente.foto_url}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                          {turno.paciente.nombre}
                        </span>
                        <span className={`material-symbols-outlined text-[16px] ${
                          turno.paciente.sexo === 'male' ? 'text-secondary' : 'text-tertiary'
                        }`}>
                          {turno.paciente.sexo}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {turno.paciente.especie_raza}
                      </span>
                    </div>
                  </div>

                  {/* Chip de estado */}
                  {turno.estado === 'waiting' && (
                    <div className="flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                      <span className="font-label-sm text-[11px] font-bold">En Sala</span>
                    </div>
                  )}
                  {turno.estado === 'confirmed' && (
                    <div className="flex items-center gap-1 bg-surface-container text-on-secondary-container px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">check</span>
                      <span className="font-label-sm text-[11px] font-semibold">Confirmado</span>
                    </div>
                  )}
                  {turno.estado === 'pending' && (
                    <div className="flex items-center gap-1 bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">hourglass_empty</span>
                      <span className="font-label-sm text-[11px] font-semibold">Pendiente</span>
                    </div>
                  )}
                </div>

                {/* Motivo de consulta */}
                <div className="bg-surface-container-low rounded-xl p-space-xs flex flex-col gap-1 mt-1 text-left">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">{turno.icono_motivo}</span>
                    <span className="font-label-md text-label-md font-medium truncate">{turno.motivo}</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant pt-0.5">
                    <span className="font-body-sm text-body-sm truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span> {turno.sede_o_info}
                    </span>
                    <span className="font-label-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-semibold">
                      {turno.paciente.plan_nombre}
                    </span>
                  </div>
                </div>

                {/* Acciones según el tipo de turno */}
                <div className="pt-space-xs flex items-center justify-between gap-space-sm">
                  {turno.tipo_accion === 'llamar' && (
                    <>
                      <button
                        onClick={() => onCallPatient(turno.paciente.nombre, turno.paciente.tutor_nombre)}
                        className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform font-bold"
                      >
                        <span className="material-symbols-outlined text-[18px]">volume_up</span>
                        <span>Llamar a Consulta</span>
                      </button>
                      <button
                        onClick={() => onNavigateToTab('pacientes')}
                        title="Ver Ficha Médica"
                        className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[18px]">medical_information</span>
                      </button>
                    </>
                  )}

                  {turno.tipo_accion === 'preparar' && (
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => onNavigateToTab('pacientes')}
                        className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit_note</span>
                        <span>Preparar Ficha</span>
                      </button>
                    </div>
                  )}

                  {turno.tipo_accion === 'placas' && (
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => alert("Mostrando visor radiográfico (Día 14 post-op)")}
                        className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">radiology</span>
                        <span>Ver Placas RX</span>
                      </button>
                    </div>
                  )}

                  {turno.tipo_accion === 'recordatorio' && (
                    <div className="w-full flex items-center justify-between">
                      <button
                        onClick={() => alert("Reenviando WhatsApp de preparación a Roberto Paz")}
                        className="text-secondary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Reenviar WhatsApp</span>
                      </button>
                      <button
                        onClick={() => alert("Opciones de turno: reprogramar o confirmar")}
                        className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-sm text-label-sm active:scale-95 transition-transform"
                      >
                        <span>Gestionar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1.7 Banner del Bot Asistente */}
      <div className="px-margin mt-space-lg mb-space-sm text-left">
        <div
          onClick={() => onNavigateToTab('bot-y-alertas')}
          className="rounded-2xl bg-surface-container-low p-space-md flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">Bot Asistente VetCare</span>
              <span className="font-body-sm text-[12px] text-on-surface-variant">Confirmó 4 turnos automáticamente hoy</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px]">chevron_right</span>
        </div>
      </div>

      {/* 1.8 Botón Flotante Sticky de Nuevo Turno */}
      <div className="sticky bottom-20 px-margin mt-space-md z-40">
        <button
          onClick={() => setShowNewTurnoModal(true)}
          className="w-full bg-primary text-on-primary h-14 rounded-full font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-transform font-bold"
        >
          <span className="material-symbols-outlined text-[24px]">add_circle</span>
          <span>+ Nuevo Turno / Ingreso Rápido</span>
        </button>
      </div>

      {/* Modal de Nuevo Turno */}
      {showNewTurnoModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-surface-container-lowest w-full rounded-t-3xl p-space-lg shadow-2xl max-w-lg text-left animate-in slide-in-from-bottom-6">
            <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Agendar Nuevo Turno / Ingreso
              </h3>
              <button 
                onClick={() => setShowNewTurnoModal(false)}
                className="text-on-surface-variant p-1"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Paciente</label>
                <input 
                  type="text" 
                  placeholder="Nombre de la mascota o DNI del tutor..." 
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Horario</label>
                  <input 
                    type="time" 
                    defaultValue="14:00" 
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-on-surface-variant block mb-1">Box / Sala</label>
                  <select className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md focus:outline-none">
                    <option>Box 1 (Dra. Valeria)</option>
                    <option>Box 2 (Cirugía)</option>
                    <option>Sala 2 (Urgencias)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-label-sm text-on-surface-variant block mb-1">Motivo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Vacunación, control de peso, decaimiento..." 
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                onClick={() => {
                  alert("Turno registrado exitosamente.");
                  setShowNewTurnoModal(false);
                }}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-bold shadow-md active:scale-95 transition-transform mt-2"
              >
                Confirmar e Ingresar a Cola
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

