import React, { useState, useEffect } from 'react';
import { TabModulo, UsuarioSesion } from '../../types';
import { databaseService } from '../../lib/databaseService';
import { mockPlanesCatalogo } from '../../data/mockData';

interface PlanesModuleProps {
  sesion?: UsuarioSesion | null;
  onNavigateToTab: (tab: TabModulo) => void;
}

export const PlanesModule: React.FC<PlanesModuleProps> = ({ sesion, onNavigateToTab }) => {
  const [activeView, setActiveView] = useState<'activa' | 'catalogo'>('catalogo');
  const [suscripciones, setSuscripciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [validateQuery, setValidateQuery] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  // Formulario de Afiliación
  const [afiliarNombre, setAfiliarNombre] = useState('');
  const [afiliarTutor, setAfiliarTutor] = useState('');
  const [afiliarDni, setAfiliarDni] = useState('');
  const [afiliarCuota, setAfiliarCuota] = useState('10000');

  const loadData = async () => {
    setLoading(true);
    const res = await databaseService.getSuscripciones(sesion?.clinica?.id);
    if (res.data) {
      setSuscripciones(res.data);
      if (res.data.length > 0) {
        setActiveView('activa');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [sesion?.clinica?.id]);

  const handleValidarDni = (e: React.FormEvent) => {
    e.preventDefault();
    const query = validateQuery.trim().toLowerCase();
    const encontrada = suscripciones.find(
      (s) =>
        s.tutor?.dni?.toLowerCase().includes(query) ||
        s.paciente?.nombre?.toLowerCase().includes(query) ||
        s.paciente?.microchip_id?.toLowerCase().includes(query) ||
        s.numero_socio?.toLowerCase().includes(query)
    );

    if (encontrada) {
      setValidationResult(encontrada);
    } else {
      setValidationResult('not_found');
    }
  };

  const handleConfirmarAfiliacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!afiliarNombre || !afiliarTutor || !afiliarDni) {
      alert('Por favor completá nombre de mascota, tutor y DNI.');
      return;
    }

    // Crear paciente y afiliarlo al plan de $10.000
    const res = await databaseService.crearPaciente({
      clinica_id: sesion?.clinica?.id,
      nombre: afiliarNombre,
      especie: 'Canino',
      raza: 'Mestizo',
      sexo: 'macho',
      peso_actual: 15,
      tutor_nombre: afiliarTutor,
      tutor_dni: afiliarDni,
      tutor_telefono: '+54 11 0000-0000',
      tutor_direccion: 'Sede Local',
      afiliar_plan_10k: true,
    });

    if (res.error) {
      alert(`Error al afiliar: ${res.error}`);
    } else {
      alert(`¡${afiliarNombre} fue afiliado/a exitosamente al Plan Socio Particular ($10.000/mes)!`);
      setShowAffiliateModal(false);
      setAfiliarNombre('');
      setAfiliarTutor('');
      setAfiliarDni('');
      await loadData();
      setActiveView('activa');
    }
  };

  const cuotaConfigurada = sesion?.clinica?.cuota_socio_defecto || 10000;

  return (
    <div className="flex flex-col w-full px-margin py-space-md space-y-space-md pb-28 max-w-5xl mx-auto text-left">
      
      {/* 4.1 Encabezado */}
      <div className="flex flex-col space-y-space-xs">
        <div className="inline-flex items-center space-x-1.5 self-start px-space-sm py-0.5 rounded-full bg-surface-container text-secondary">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span className="font-label-sm text-[11px] uppercase tracking-wider font-bold">
            Medicina Prepaga &amp; Plan Comunitario
          </span>
        </div>
        <h1 className="font-headline-xl-mobile font-bold text-on-surface tracking-tight">
          Planes de Socios Particulares
        </h1>
        <p className="font-body-md text-on-surface-variant max-w-2xl">
          Sistema solidario para que cada persona pague una cuota de <strong>${cuotaConfigurada.toLocaleString('es-AR')}/mes</strong> y ante una urgencia 24/7 o ciclo de vacunaciones no necesite todo el dinero junto.
        </p>
      </div>

      {/* 4.2 Switcher de Vistas */}
      <div className="bg-surface-container-high p-1 rounded-2xl flex items-center shadow-sm">
        <button
          onClick={() => setActiveView('catalogo')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all flex items-center justify-center space-x-1.5 font-bold ${
            activeView === 'catalogo'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">view_carousel</span>
          <span className="truncate">Catálogo de Planes</span>
        </button>
        <button
          onClick={() => setActiveView('activa')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all flex items-center justify-center space-x-1.5 font-bold ${
            activeView === 'activa'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="truncate">Socios Activos ({suscripciones.length})</span>
        </button>
      </div>

      {/* 4.3 Bandeja de Acciones Rápidas */}
      <div className="grid grid-cols-2 gap-space-sm">
        <button
          onClick={() => { setShowValidateModal(true); setValidationResult(null); setValidateQuery(''); }}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-surface-container-low text-secondary font-label-md text-label-md shadow-sm border border-surface-container-high/40 active:scale-[0.98] transition-transform font-bold hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[19px]">qr_code_scanner</span>
          <span className="truncate">Validar DNI / Socio</span>
        </button>
        <button
          onClick={() => setShowAffiliateModal(true)}
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-[0.98] transition-transform font-bold hover:bg-primary/95"
        >
          <span className="material-symbols-outlined text-[19px]">add_circle</span>
          <span className="truncate">+ Afiliar Mascota</span>
        </button>
      </div>

      {/* VISTA 1: Catálogo de Planes (Destacando el Plan de $10.000) */}
      {activeView === 'catalogo' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-surface-container-lowest rounded-3xl p-6 border-2 border-primary/30 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-primary/20">
              <div>
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-[11px] font-extrabold uppercase tracking-wider inline-block mb-1">
                  Recomendado para Familias
                </span>
                <h3 className="font-headline-lg font-bold text-on-surface">Plan Socio Particular</h3>
                <p className="text-[13px] text-on-surface-variant max-w-lg mt-0.5">
                  Cuota mensual fija para que ninguna mascota quede desprotegida por motivos económicos.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[32px] font-extrabold text-primary block leading-none">
                  ${cuotaConfigurada.toLocaleString('es-AR')}
                </span>
                <span className="text-[11px] text-on-surface-variant font-semibold">por mes · Débito automático</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span><strong>100% de Urgencias 24/7</strong> cubiertas en guardia sin copagos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span><strong>100% de Vacunación Anual</strong> (Antirrábica + Séxtuple/Triple Felina)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span><strong>50% de Bonificación</strong> en cirugías e internaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span><strong>Credencial Digital QR (VetCare Pass)</strong> para atención inmediata</span>
              </div>
            </div>

            <button
              onClick={() => setShowAffiliateModal(true)}
              className="w-full py-3 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Afiliar Mascota a ${cuotaConfigurada.toLocaleString('es-AR')}/mes</span>
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: Socios Activos */}
      {activeView === 'activa' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] animate-spin text-primary">progress_activity</span>
              <p className="text-[13px] mt-2">Consultando socios en Supabase...</p>
            </div>
          ) : suscripciones.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-surface-container-high rounded-3xl p-8 text-center flex flex-col items-center justify-center my-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px]">health_and_safety</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface">No hay socios afiliados todavía</h3>
              <p className="text-body-sm text-on-surface-variant max-w-sm mt-1 mb-5">
                Comenzá afiliando pacientes al <strong>Plan Socio Particular ($10.000/mes)</strong> para brindar cobertura de emergencias y calendario de vacunas.
              </p>
              <button
                onClick={() => setShowAffiliateModal(true)}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-2xl font-label-md font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Afiliar Primer Socio</span>
              </button>
            </div>
          ) : (
            suscripciones.map((sub) => (
              <div
                key={sub.id}
                className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container-high/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-[24px]">pets</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm font-bold text-on-surface">
                        {sub.paciente?.nombre || 'Paciente'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold">
                        {sub.numero_socio || 'Socio Activo'}
                      </span>
                    </div>
                    <span className="text-[12px] text-on-surface-variant font-medium block">
                      Tutor: {sub.tutor?.nombre_completo || 'Tutor'} (DNI: {sub.tutor?.dni || 'S/D'})
                    </span>
                    <span className="text-[12px] text-primary font-bold block mt-0.5">
                      ${Number(sub.cuota_mensual_ars || 10000).toLocaleString('es-AR')}/mes · 100% Urgencias y Vacunas
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-primary rounded-xl text-[12px] font-bold border border-surface-container-high flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code</span>
                  <span>Ver Carnet QR</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de Validación Rápida por DNI / Chip */}
      {showValidateModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-headline-sm font-bold text-on-surface">Validar Carnet de Socio</h3>
              <button onClick={() => setShowValidateModal(false)} className="text-on-surface-variant p-1">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleValidarDni} className="space-y-3 mt-4">
              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">
                  DNI del Tutor, Nombre de la Mascota o Microchip:
                </label>
                <input
                  type="text"
                  value={validateQuery}
                  onChange={(e) => setValidateQuery(e.target.value)}
                  placeholder="ej: 32.849.201, Thor, 9810..."
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-secondary text-on-secondary rounded-xl font-label-md font-bold shadow-md hover:bg-secondary/95 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Buscar en Padrón de Socios</span>
              </button>
            </form>

            {validationResult && validationResult !== 'not_found' && (
              <div className="mt-4 p-4 bg-secondary-fixed/20 border border-secondary-fixed rounded-2xl text-[13px]">
                <div className="flex items-center gap-2 text-secondary font-bold mb-1">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>¡Suscripción Activa y al Día!</span>
                </div>
                <p><strong>Paciente:</strong> {validationResult.paciente?.nombre}</p>
                <p><strong>Tutor:</strong> {validationResult.tutor?.nombre_completo} (DNI: {validationResult.tutor?.dni})</p>
                <p><strong>Plan:</strong> Plan Socio Particular ($10.000/mes)</p>
                <p><strong>Cobertura:</strong> 100% Urgencias y Vacunas sin copagos</p>
              </div>
            )}

            {validationResult === 'not_found' && (
              <div className="mt-4 p-4 bg-error-container text-on-error-container rounded-2xl text-[13px]">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>No se encontró socio activo</span>
                </div>
                <p>El DNI o mascota ingresada no figura en el padrón de socios con cuota al día.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Nueva Afiliación al Plan de $10.000 */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-headline-sm font-bold text-on-surface">Afiliar Mascota a Plan Socio</h3>
              <button onClick={() => setShowAffiliateModal(false)} className="text-on-surface-variant p-1">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmarAfiliacion} className="space-y-3 mt-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-[12px]">
                <span className="font-bold text-primary block">Plan Socio Particular:</span>
                Cuota mensual de <strong>${cuotaConfigurada.toLocaleString('es-AR')}/mes</strong> para que el tutor no afronte gastos imprevistos de golpe.
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">Nombre de la Mascota *</label>
                <input
                  type="text"
                  value={afiliarNombre}
                  onChange={(e) => setAfiliarNombre(e.target.value)}
                  placeholder="ej: Rocky, Milo, Luna..."
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">Nombre del Tutor *</label>
                <input
                  type="text"
                  value={afiliarTutor}
                  onChange={(e) => setAfiliarTutor(e.target.value)}
                  placeholder="ej: Florencia Morales"
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">DNI del Tutor *</label>
                <input
                  type="text"
                  value={afiliarDni}
                  onChange={(e) => setAfiliarDni(e.target.value)}
                  placeholder="33.456.789"
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-primary text-on-primary rounded-xl font-label-md font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-all"
              >
                Confirmar Afiliación ($10.000/mes)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Carnet QR Digital */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-center animate-in zoom-in-95 duration-200">
            <h3 className="font-headline-sm font-bold text-on-surface mb-1">VetCare Pass Digital</h3>
            <p className="text-[12px] text-on-surface-variant mb-4">Credencial de Socio con Cobertura 100% Activa</p>
            <div className="w-48 h-48 mx-auto bg-surface-container-low rounded-2xl flex items-center justify-center p-4 border border-surface-container-high">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=VETCARE-SOCIO-ACTIVO-10K"
                alt="QR Carnet"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full mt-5 py-2.5 bg-surface-container-high rounded-xl font-bold text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              Cerrar Carnet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlanesModule;
