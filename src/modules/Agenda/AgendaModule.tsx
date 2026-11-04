import React, { useState, useEffect } from 'react';
import { TurnoAgenda, TabModulo, UsuarioSesion } from '../../types';
import { databaseService } from '../../lib/databaseService';
import { mockTurnosAgenda, mockTriajeUrgencia } from '../../data/mockData';

interface AgendaModuleProps {
  sesion?: UsuarioSesion | null;
  onNavigateToTab: (tab: TabModulo) => void;
  onCallPatient: (patientName: string, tutorName: string) => void;
}

export const AgendaModule: React.FC<AgendaModuleProps> = ({
  sesion,
  onNavigateToTab,
  onCallPatient,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'confirmed' | 'waiting' | 'urgent'>('all');
  const [turnos, setTurnos] = useState<TurnoAgenda[]>([]);
  const [triaje, setTriaje] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNewTurnoModal, setShowNewTurnoModal] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Formulario de nuevo turno
  const [nuevoPaciente, setNuevoPaciente] = useState('');
  const [nuevoTutor, setNuevoTutor] = useState('');
  const [nuevaHora, setNuevaHora] = useState('11:30');
  const [nuevoBox, setNuevoBox] = useState('Box 01');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [esUrgencia, setEsUrgencia] = useState(false);

  // Cargar turnos reales desde Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadTurnos() {
      setLoading(true);
      const res = await databaseService.getTurnos(sesion?.clinica?.id);
      if (isMounted) {
        if (res.data && res.data.length > 0) {
          const mapped: TurnoAgenda[] = res.data.map((t: any) => ({
            id: t.id,
            hora: t.hora_inicio?.slice(0, 5) || '10:00',
            duracion: `${t.duracion_minutos || 30} min`,
            paciente: {
              id: t.paciente?.id || 'pac-1',
              nombre: t.paciente?.nombre || 'Paciente',
              especie_raza: `${t.paciente?.especie || 'Canino'} • ${t.paciente?.raza || 'Mestizo'}`,
              sexo: t.paciente?.sexo === 'hembra' ? 'female' : 'male',
              foto_url: t.paciente?.foto_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150',
              tutor_nombre: t.paciente?.tutor?.nombre_completo || 'Tutor Responsable',
              plan_nombre: t.paciente?.suscripciones?.length > 0 ? 'Plan Socio $10k' : 'Particular',
            },
            motivo: t.motivo_consulta,
            icono_motivo: t.es_urgencia ? 'emergency' : 'medical_services',
            sede_o_info: t.box_sala || 'Box 01',
            badge_extra: t.paciente?.suscripciones?.length > 0 ? 'Socio $10k' : undefined,
            estado: t.es_urgencia ? 'urgent' : t.estado === 'en_espera' ? 'waiting' : 'confirmed',
            estado_label: t.es_urgencia ? 'Urgencia' : t.estado === 'en_espera' ? 'En Sala' : 'Confirmado',
            tipo_accion: 'llamar',
          }));
          setTurnos(mapped);
        } else {
          setTurnos([]);
        }
        setLoading(false);
      }
    }
    loadTurnos();
    return () => { isMounted = false; };
  }, [sesion?.clinica?.id]);

  // Filtro de turnos
  const filteredTurnos = turnos.filter((t) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'confirmed') return t.estado === 'confirmed';
    if (selectedFilter === 'waiting') return t.estado === 'waiting';
    if (selectedFilter === 'urgent') return t.estado === 'urgent';
    return true;
  });

  const handleCrearTurnoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoPaciente.trim() || !nuevoMotivo.trim()) {
      alert('Por favor indicá el nombre del paciente y motivo de consulta.');
      return;
    }

    const nuevoTurnoItem: TurnoAgenda = {
      id: crypto.randomUUID(),
      hora: nuevaHora,
      duracion: '30 min',
      paciente: {
        id: crypto.randomUUID(),
        nombre: nuevoPaciente,
        especie_raza: 'Canino • Mestizo',
        sexo: 'male',
        foto_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150',
        tutor_nombre: nuevoTutor || 'Tutor Particular',
        plan_nombre: 'Plan Socio $10k',
      },
      motivo: nuevoMotivo,
      icono_motivo: esUrgencia ? 'emergency' : 'medical_services',
      sede_o_info: nuevoBox,
      badge_extra: 'Socio $10k',
      estado: esUrgencia ? 'urgent' : 'waiting',
      estado_label: esUrgencia ? 'Urgencia' : 'En Sala',
      tipo_accion: 'llamar',
    };

    setTurnos((prev) => [nuevoTurnoItem, ...prev]);
    setShowNewTurnoModal(false);
    setNuevoPaciente('');
    setNuevoTutor('');
    setNuevoMotivo('');
    setEsUrgencia(false);
  };

  const doctorNombre = sesion ? `${sesion.nombre} ${sesion.apellido}` : 'Profesional';
  const clinicaNombre = sesion?.clinica?.nombre_fantasia || 'Clínica Veterinaria';
  const boxActual = sesion?.box_actual || 'Box 01';

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto">
      {/* 1.1 Hero Section / Bienvenida */}
      <div className="px-margin pt-space-md pb-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
              {sesion?.turno_actual || 'Turno Mañana'} • {boxActual}
            </span>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight font-bold">
              ¡Hola, {sesion?.rol === 'veterinario' ? 'Dra. ' : ''}{doctorNombre}!
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>
              <span>{clinicaNombre}</span>
            </p>
          </div>
          <div className="relative flex flex-col items-end">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Notificaciones del turno"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface active:scale-95 transition-transform relative shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {turnos.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 1.2 Métricas del Día */}
      <div className="px-margin py-space-sm">
        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-xs rounded-2xl shadow-sm border border-surface-container-high/40 text-center">
          <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low">
            <span className="font-headline-md font-bold text-primary">{turnos.length}</span>
            <span className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">Citas Hoy</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low">
            <span className="font-headline-md font-bold text-secondary">
              {turnos.filter(t => t.estado === 'confirmed').length}
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">Confirmadas</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 px-1 rounded-xl bg-surface-container-low">
            <span className="font-headline-md font-bold text-error">
              {turnos.filter(t => t.estado === 'urgent').length}
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">Urgencias</span>
          </div>
        </div>
      </div>

      {/* 1.3 Filtros de Agenda */}
      <div className="px-margin pt-space-xs pb-space-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos ({turnos.length})
          </button>
          <button
            onClick={() => setSelectedFilter('waiting')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              selectedFilter === 'waiting'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            En Espera ({turnos.filter(t => t.estado === 'waiting').length})
          </button>
          <button
            onClick={() => setSelectedFilter('urgent')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
              selectedFilter === 'urgent'
                ? 'bg-error text-on-error shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Urgencias ({turnos.filter(t => t.estado === 'urgent').length})
          </button>
        </div>

        <button
          onClick={() => setShowNewTurnoModal(true)}
          className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 bg-primary text-on-primary rounded-full text-[12px] font-bold shadow-sm active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Nuevo Turno</span>
        </button>
      </div>

      {/* 1.4 Lista de Turnos o Estado Vacío (Desde Cero) */}
      <div className="px-margin space-y-3">
        {loading ? (
          <div className="py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] animate-spin text-primary">progress_activity</span>
            <p className="text-[13px] mt-2">Cargando turnos desde Supabase...</p>
          </div>
        ) : filteredTurnos.length === 0 ? (
          /* Estado Vacío: Desde Cero Sin Datos Falsos */
          <div className="bg-surface-container-lowest border border-dashed border-surface-container-high rounded-3xl p-8 text-center flex flex-col items-center justify-center my-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px]">event_available</span>
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface">No hay citas registradas</h3>
            <p className="text-body-sm text-on-surface-variant max-w-sm mt-1 mb-5">
              Tu agenda para <strong>{clinicaNombre}</strong> está al día. Hacé clic abajo para agendar un nuevo turno o consulta de guardia.
            </p>
            <button
              onClick={() => setShowNewTurnoModal(true)}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-2xl font-label-md font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Agendar Primer Turno</span>
            </button>
          </div>
        ) : (
          filteredTurnos.map((turno) => (
            <div
              key={turno.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-all hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0">
                  <img
                    src={turno.paciente.foto_url}
                    alt={turno.paciente.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm font-bold text-on-surface">
                      {turno.paciente.nombre}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      turno.estado === 'urgent'
                        ? 'bg-error text-on-error'
                        : turno.estado === 'waiting'
                        ? 'bg-warning-container text-on-warning-container'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {turno.estado_label}
                    </span>
                    {turno.badge_extra && (
                      <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                        {turno.badge_extra}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] text-on-surface-variant font-medium">
                    {turno.paciente.especie_raza} · Tutor: {turno.paciente.tutor_nombre}
                  </span>
                  <span className="text-[12px] text-primary font-semibold mt-0.5">
                    {turno.motivo}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-container-high/40">
                <div className="text-right sm:text-right">
                  <span className="font-bold text-[14px] text-on-surface block">{turno.hora} hs</span>
                  <span className="text-[11px] text-on-surface-variant block">{turno.sede_o_info}</span>
                </div>
                <button
                  onClick={() => onCallPatient(turno.paciente.nombre, turno.paciente.tutor_nombre)}
                  className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-on-primary rounded-xl font-label-sm text-[12px] font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">ring_volume</span>
                  <span>Llamar a Box</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botón Flotante para Móvil */}
      <div className="sm:hidden fixed bottom-20 inset-x-4 z-40">
        <button
          onClick={() => setShowNewTurnoModal(true)}
          className="w-full bg-primary text-on-primary h-13 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>+ Nuevo Turno</span>
        </button>
      </div>

      {/* Modal para Agendar Nuevo Turno Real */}
      {showNewTurnoModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-headline-sm font-bold text-on-surface">Agendar Turno / Ingreso</h3>
              <button onClick={() => setShowNewTurnoModal(false)} className="text-on-surface-variant p-1">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCrearTurnoSubmit} className="space-y-3 mt-4">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Nombre del Paciente (Mascota) *
                </label>
                <input
                  type="text"
                  value={nuevoPaciente}
                  onChange={(e) => setNuevoPaciente(e.target.value)}
                  placeholder="ej: Rocky, Milo, Lola..."
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Nombre del Tutor / Responsable
                </label>
                <input
                  type="text"
                  value={nuevoTutor}
                  onChange={(e) => setNuevoTutor(e.target.value)}
                  placeholder="ej: Florencia Pérez"
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                    Hora Estimada
                  </label>
                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                    Box / Sala
                  </label>
                  <select
                    value={nuevoBox}
                    onChange={(e) => setNuevoBox(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  >
                    <option value="Box 01">Box 01 (General)</option>
                    <option value="Box 02">Box 02 (Urgencias)</option>
                    <option value="Quirófano">Quirófano</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Motivo de la Consulta *
                </label>
                <input
                  type="text"
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                  placeholder="ej: Vacunación Séxtuple, control clínico, vómitos..."
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgencia-check"
                  checked={esUrgencia}
                  onChange={(e) => setEsUrgencia(e.target.checked)}
                  className="w-4 h-4 rounded text-error focus:ring-error"
                />
                <label htmlFor="urgencia-check" className="text-[12px] font-bold text-error cursor-pointer">
                  Marcar como Triaje de Urgencia Prioritario
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-primary text-on-primary rounded-xl font-label-md font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                Confirmar y Agendar Turno
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AgendaModule;
