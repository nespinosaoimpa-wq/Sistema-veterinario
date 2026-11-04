import React, { useState, useEffect } from 'react';
import { TabModulo, UsuarioSesion } from '../../types';
import { databaseService } from '../../lib/databaseService';

interface PacientesModuleProps {
  sesion?: UsuarioSesion | null;
  onNavigateToTab: (tab: TabModulo) => void;
  onTriggerConsultation: () => void;
}

export const PacientesModule: React.FC<PacientesModuleProps> = ({
  sesion,
  onNavigateToTab,
  onTriggerConsultation,
}) => {
  const [pacientesList, setPacientesList] = useState<any[]>([]);
  const [selectedPacienteIndex, setSelectedPacienteIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showAddPacienteModal, setShowAddPacienteModal] = useState(false);
  const [vacunasOpen, setVacunasOpen] = useState(true);
  const [consultasOpen, setConsultasOpen] = useState(false);

  // Estados del Formulario de Nuevo Paciente
  const [nombreMascota, setNombreMascota] = useState('');
  const [especie, setEspecie] = useState('Canino');
  const [raza, setRaza] = useState('');
  const [sexo, setSexo] = useState<'macho' | 'hembra'>('macho');
  const [peso, setPeso] = useState('12.5');
  const [nombreTutor, setNombreTutor] = useState('');
  const [dniTutor, setDniTutor] = useState('');
  const [telTutor, setTelTutor] = useState('');
  const [afiliarPlan, setAfiliarPlan] = useState(true);

  const loadPacientes = async () => {
    setLoading(true);
    const res = await databaseService.getPacientes(sesion?.clinica?.id);
    if (res.data) {
      setPacientesList(res.data);
      if (res.data.length > 0) {
        setSelectedPacienteIndex(0);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPacientes();
  }, [sesion?.clinica?.id]);

  const handleCrearPacienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreMascota.trim() || !nombreTutor.trim() || !dniTutor.trim()) {
      alert('Por favor completá el nombre de la mascota, tutor y DNI.');
      return;
    }

    const res = await databaseService.crearPaciente({
      clinica_id: sesion?.clinica?.id,
      nombre: nombreMascota,
      especie,
      raza: raza || 'Mestizo',
      sexo,
      peso_actual: Number(peso) || 10,
      tutor_nombre: nombreTutor,
      tutor_dni: dniTutor,
      tutor_telefono: telTutor || '+54 11 0000-0000',
      tutor_direccion: 'Domicilio Particular',
      afiliar_plan_10k: afiliarPlan,
    });

    if (res.error) {
      alert(`Error al registrar paciente: ${res.error}`);
    } else {
      setShowAddPacienteModal(false);
      setNombreMascota('');
      setRaza('');
      setNombreTutor('');
      setDniTutor('');
      setTelTutor('');
      await loadPacientes();
    }
  };

  const pacienteActivo = pacientesList[selectedPacienteIndex];

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto text-left">
      <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-md">
        
        {/* Barra Superior / Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateToTab('agenda')}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">arrow_back</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Volver a Agenda</span>
          </button>
          
          <button
            onClick={() => setShowAddPacienteModal(true)}
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-primary text-on-primary font-label-sm text-[12px] font-bold shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Registrar Mascota</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[36px] animate-spin text-primary">progress_activity</span>
            <p className="text-[13px] mt-2 font-medium">Cargando pacientes desde Supabase...</p>
          </div>
        ) : pacientesList.length === 0 ? (
          /* Estado Vacío: Desde Cero Sin Datos Falsos */
          <div className="bg-surface-container-lowest border border-dashed border-surface-container-high rounded-3xl p-10 text-center flex flex-col items-center justify-center my-6">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px]">pets</span>
            </div>
            <h3 className="font-headline-md font-bold text-on-surface">No hay pacientes registrados</h3>
            <p className="text-body-md text-on-surface-variant max-w-md mt-1 mb-6">
              Comenzá dando de alta la primera mascota de <strong>{sesion?.clinica?.nombre_fantasia || 'tu veterinaria'}</strong> con su tutor responsable y opción de afiliación al Plan de Socios de $10.000/mes.
            </p>
            <button
              onClick={() => setShowAddPacienteModal(true)}
              className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-label-md font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Registrar Primer Paciente</span>
            </button>
          </div>
        ) : (
          /* Ficha de Paciente Real */
          <div className="space-y-4">
            {/* Selector de Pacientes Si Hay Más de Uno */}
            {pacientesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {pacientesList.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPacienteIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 transition-all ${
                      idx === selectedPacienteIndex
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">pets</span>
                    <span>{p.nombre} ({p.especie})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tarjeta de Perfil Principal */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-start gap-space-md relative z-10">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm overflow-hidden">
                    {pacienteActivo.foto_url ? (
                      <img src={pacienteActivo.foto_url} alt={pacienteActivo.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[40px]">pets</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h1 className="font-headline-xl-mobile font-bold text-on-surface tracking-tight truncate">
                      {pacienteActivo.nombre}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold">
                      {pacienteActivo.suscripciones?.length > 0 ? 'Socio $10.000/mes' : 'Particular'}
                    </span>
                  </div>
                  <span className="text-[13px] text-primary font-bold mt-0.5">
                    {pacienteActivo.especie} · {pacienteActivo.raza}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="bg-surface-container-low text-on-surface-variant text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                      {pacienteActivo.sexo === 'macho' ? 'Macho' : 'Hembra'}
                    </span>
                    <span className="bg-surface-container-low text-on-surface-variant text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                      {pacienteActivo.peso_actual} kg
                    </span>
                    {pacienteActivo.microchip_id && (
                      <span className="bg-surface-container-low text-on-surface-variant text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                        Chip: {pacienteActivo.microchip_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tutor Responsable */}
              <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container-high/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div>
                    <span className="font-bold text-[13px] text-on-surface block">
                      {pacienteActivo.tutor?.nombre_completo || 'Tutor no asignado'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant block">
                      DNI: {pacienteActivo.tutor?.dni || 'S/D'} · Tel: {pacienteActivo.tutor?.telefono || 'S/D'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Contactando por WhatsApp a ${pacienteActivo.tutor?.telefono}`)}
                  className="px-3 py-1 bg-surface-container-lowest hover:bg-surface-container text-primary rounded-xl text-[12px] font-bold border border-surface-container-high flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Mensaje</span>
                </button>
              </div>

              {/* Botón de Iniciar Consulta Médica */}
              <button
                onClick={onTriggerConsultation}
                className="w-full py-3 bg-primary text-on-primary rounded-2xl font-label-md font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                <span>Nueva Consulta Médica (Ley 14.072)</span>
              </button>
            </div>

            {/* Sección de Vacunaciones */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container-high/40">
              <div
                onClick={() => setVacunasOpen(!vacunasOpen)}
                className="flex items-center justify-between cursor-pointer py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">vaccines</span>
                  <span className="font-bold text-on-surface text-[15px]">Libreta Sanitaria &amp; Vacunas</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  {vacunasOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {vacunasOpen && (
                <div className="pt-3 border-t border-surface-container-high/40 mt-2 space-y-2">
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-[12px]">
                    <div>
                      <span className="font-bold text-on-surface block">Vacuna Antirrábica Anual</span>
                      <span className="text-on-surface-variant">Obligatoria por Ley Nacional de Zoonosis</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[10px]">
                      100% Bonificada Plan Socio
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-[12px]">
                    <div>
                      <span className="font-bold text-on-surface block">Vacuna Séxtuple / Triple Felina</span>
                      <span className="text-on-surface-variant">Parvovirus, Moquillo, Hepatitis</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[10px]">
                      100% Bonificada Plan Socio
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal para Registrar Nuevo Paciente Real */}
      {showAddPacienteModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-headline-sm font-bold text-on-surface">Registrar Mascota &amp; Tutor</h3>
              <button onClick={() => setShowAddPacienteModal(false)} className="text-on-surface-variant p-1">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCrearPacienteSubmit} className="space-y-3 mt-4">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                Datos de la Mascota
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Nombre *</label>
                  <input
                    type="text"
                    value={nombreMascota}
                    onChange={(e) => setNombreMascota(e.target.value)}
                    placeholder="ej: Simón, Luna..."
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Especie</label>
                  <select
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  >
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Exótico">Exótico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Raza</label>
                  <input
                    type="text"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    placeholder="Mestizo"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Sexo</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as any)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  >
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block pt-2 border-t border-surface-container-high/60">
                Tutor / Responsable Legal
              </span>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Nombre Completo *</label>
                <input
                  type="text"
                  value={nombreTutor}
                  onChange={(e) => setNombreTutor(e.target.value)}
                  placeholder="ej: Matías Romero"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">DNI *</label>
                  <input
                    type="text"
                    value={dniTutor}
                    onChange={(e) => setDniTutor(e.target.value)}
                    placeholder="35.123.456"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-0.5">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={telTutor}
                    onChange={(e) => setTelTutor(e.target.value)}
                    placeholder="+54 11 4000-0000"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20 flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="afiliar-plan"
                  checked={afiliarPlan}
                  onChange={(e) => setAfiliarPlan(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary"
                />
                <label htmlFor="afiliar-plan" className="text-[12px] font-bold text-on-surface cursor-pointer">
                  Afiliar al <strong>Plan Socio Particular ($10.000/mes)</strong> con 100% de cobertura en urgencias y vacunas
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-primary text-on-primary rounded-xl font-label-md font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                Guardar Ficha en Supabase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PacientesModule;
