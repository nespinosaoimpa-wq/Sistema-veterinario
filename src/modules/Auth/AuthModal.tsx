import React, { useState } from 'react';
import { UsuarioSesion, Clinica } from '../../types';
import { databaseService } from '../../lib/databaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (usuario: UsuarioSesion) => void;
  currentSesion?: UsuarioSesion | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentSesion,
}) => {
  const [mode, setMode] = useState<'login' | 'registro_clinica'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados de Login
  const [email, setEmail] = useState(currentSesion?.email || 'valeria.gomez@vetcarepro.com');
  const [password, setPassword] = useState('********');
  const [selectedBox, setSelectedBox] = useState(currentSesion?.box_actual || 'Box 01');
  const [selectedTurno, setSelectedTurno] = useState(currentSesion?.turno_actual || 'Turno Mañana (08:00 - 14:00)');

  // Estados de Registro de Clínica B2B (Desde Cero)
  const [clinicaNombre, setClinicaNombre] = useState('');
  const [clinicaCuit, setClinicaCuit] = useState('');
  const [clinicaDireccion, setClinicaDireccion] = useState('');
  const [clinicaEmail, setClinicaEmail] = useState('');
  const [clinicaCuotaSocio, setClinicaCuotaSocio] = useState('10000');
  
  // Datos del Profesional a cargo
  const [adminNombre, setAdminNombre] = useState('');
  const [adminApellido, setAdminApellido] = useState('');
  const [adminMatricula, setAdminMatricula] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  if (!isOpen) return null;

  // Acceso Rápido con Perfiles de Demostración
  const handleQuickDemoLogin = (perfil: 'valeria' | 'recepcion' | 'admin') => {
    setLoading(true);
    setErrorMessage(null);

    const mockClinica: Clinica = {
      id: '00000000-0000-0000-0000-000000000001',
      slug: 'vetcare-central',
      nombre_fantasia: 'VetCare Central & Hospital 24h',
      cuit: '30-71928491-9',
      email_contacto: 'contacto@vetcarepro.com',
      direccion: 'Av. Libertador 2420, CABA',
      cuota_socio_defecto: 10000,
    };

    let mockUser: UsuarioSesion;

    if (perfil === 'valeria') {
      mockUser = {
        id: 'b1111111-1111-1111-1111-111111111111',
        nombre: 'Valeria',
        apellido: 'Gómez',
        email: 'valeria.gomez@vetcarepro.com',
        rol: 'veterinario',
        matricula_provincial: 'MP 10.492',
        box_actual: selectedBox,
        turno_actual: selectedTurno,
        clinica: mockClinica,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3QXudc9qfIv8DaxZy4ToV1UJMSy_PgLRz12B8VqQaWrrmfPlQ5EoWbTYngTvMx03BVfcL0yc2yRretLB_XH-sFPnlfEvLTfbFmWV6VxC8g_zSpNrMZq8WRXyvKrd2rhpKBczPCNcafzSa7sE2V6sNNQlAqXx5rgbz7QE3fUZrepqne5mVbJcZTe1cx_gDe_Aih3MZWgVfofskMw9g25xkoWv2WrxEX9REbcHH_FQ',
      };
    } else if (perfil === 'recepcion') {
      mockUser = {
        id: 'b2222222-2222-2222-2222-222222222222',
        nombre: 'Carlos',
        apellido: 'Recepción',
        email: 'recepcion@vetcarepro.com',
        rol: 'recepcionista',
        box_actual: 'Mostrador Central',
        turno_actual: selectedTurno,
        clinica: mockClinica,
      };
    } else {
      mockUser = {
        id: 'b3333333-3333-3333-3333-333333333333',
        nombre: 'Martín',
        apellido: 'Albarracín',
        email: 'martin.albarracin@vetcarepro.com',
        rol: 'administrador',
        matricula_provincial: 'MP 8.210',
        box_actual: 'Dirección Médica',
        turno_actual: 'Completo',
        clinica: mockClinica,
      };
    }

    databaseService.saveLocalSession(mockUser);
    setLoading(false);
    onLoginSuccess(mockUser);
    onClose();
  };

  // Iniciar Sesión buscando en Supabase
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await databaseService.login({
      email,
      box_actual: selectedBox,
      turno_actual: selectedTurno,
    });

    setLoading(false);

    if (result.error || !result.sesion) {
      setErrorMessage(result.error || 'Credenciales no encontradas en Supabase.');
      return;
    }

    onLoginSuccess(result.sesion);
    onClose();
  };

  // Registrar Clínica B2B en Supabase desde cero
  const handleCrearClinica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicaNombre || !clinicaCuit || !adminNombre || !adminEmail) {
      setErrorMessage('Por favor completá el Nombre de la Clínica, CUIT, Nombre del Veterinario y Email.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await databaseService.registrarClinica({
      nombre_fantasia: clinicaNombre,
      cuit: clinicaCuit,
      direccion: clinicaDireccion || 'Consultorio Principal',
      email: clinicaEmail || adminEmail,
      cuota_socio: Number(clinicaCuotaSocio) || 10000,
      admin_nombre: adminNombre,
      admin_apellido: adminApellido || 'Responsable',
      admin_matricula: adminMatricula || 'MP 10.000',
      admin_email: adminEmail,
      box_actual: 'Box 01',
      turno_actual: 'Turno Mañana (08:00 - 14:00)',
    });

    setLoading(false);

    if (res.error || !res.sesion) {
      setErrorMessage(`No se pudo crear en Supabase: ${res.error}. Verificá haber ejecutado 'supabase/setup_desde_cero.sql' en el SQL Editor.`);
      return;
    }

    onLoginSuccess(res.sesion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">pets</span>
            </div>
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface leading-tight">VetCare Pro</h2>
              <span className="font-label-sm text-[11px] text-primary font-semibold">
                Plataforma SaaS B2B Veterinaria &amp; Supabase
              </span>
            </div>
          </div>
          {currentSesion && (
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-error-container text-on-error-container rounded-2xl text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0">error</span>
            <div className="flex-1">
              <span className="font-bold block">Aviso:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Pestañas: Acceso vs Registro de Nueva Clínica */}
        <div className="flex bg-surface-container-high p-1 rounded-2xl my-4">
          <button
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl font-label-md text-label-md font-bold transition-all ${
              mode === 'login' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Acceso Profesional
          </button>
          <button
            onClick={() => { setMode('registro_clinica'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl font-label-md text-label-md font-bold transition-all ${
              mode === 'registro_clinica' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Registrar Clínica (Desde Cero)
          </button>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            {/* Formulario tradicional de login */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Email del Profesional / Clínica
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  placeholder="ej: doctora@clinica.com"
                  required
                />
              </div>

              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-surface"
                  required
                />
              </div>

              {/* Selección de Turno y Box (Check-in de Guardia Ley 14.072) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                    Turno de Guardia
                  </label>
                  <select
                    value={selectedTurno}
                    onChange={(e) => setSelectedTurno(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  >
                    <option value="Turno Mañana (08:00 - 14:00)">Mañana (08-14h)</option>
                    <option value="Turno Tarde (14:00 - 20:00)">Tarde (14-20h)</option>
                    <option value="Guardia 24h">Guardia 24h</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                    Box / Quirófano
                  </label>
                  <select
                    value={selectedBox}
                    onChange={(e) => setSelectedBox(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  >
                    <option value="Box 01">Box 01 (Consultorio)</option>
                    <option value="Box 02">Box 02 (Urgencias)</option>
                    <option value="Quirófano Central">Quirófano Central</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-primary text-on-primary rounded-xl font-label-md font-bold shadow-md hover:bg-primary/95 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Conectando con Supabase...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                    <span>Ingresar a Consultorio</span>
                  </>
                )}
              </button>
            </form>

            {/* Accesos rápidos de demostración */}
            <div className="pt-3 border-t border-surface-container-high/60">
              <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block mb-2">
                O ingresar con perfil demo para pruebas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('valeria')}
                  className="py-2 px-2 bg-surface-container-low hover:bg-primary/10 text-primary rounded-xl font-label-sm text-[11px] font-bold border border-primary/20 active:scale-95 text-center transition-colors"
                >
                  Dra. Valeria (MP 10.492)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('recepcion')}
                  className="py-2 px-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl font-label-sm text-[11px] font-bold border border-surface-container-high active:scale-95 text-center transition-colors"
                >
                  Recepción
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="py-2 px-2 bg-surface-container-low hover:bg-secondary/10 text-secondary rounded-xl font-label-sm text-[11px] font-bold border border-secondary/20 active:scale-95 text-center transition-colors"
                >
                  Admin Clínica
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario Registro de Clínica Nueva B2B */
          <form onSubmit={handleCrearClinica} className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/20 text-[12px] text-on-surface-variant leading-relaxed">
              <span className="font-bold text-primary block mb-0.5">Creación de Clínica Veterinaria en Supabase:</span>
              Registrá tu propia veterinaria desde cero con base de datos aislada y plan de socios de <strong>$10.000/mes</strong>.
            </div>

            <div>
              <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                Nombre de Fantasía de la Clínica *
              </label>
              <input
                type="text"
                value={clinicaNombre}
                onChange={(e) => setClinicaNombre(e.target.value)}
                placeholder="ej: Hospital Veterinario San Martín"
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  CUIT Fiscal *
                </label>
                <input
                  type="text"
                  value={clinicaCuit}
                  onChange={(e) => setClinicaCuit(e.target.value)}
                  placeholder="30-71829384-9"
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Cuota Plan Socio (ARS) *
                </label>
                <input
                  type="number"
                  value={clinicaCuotaSocio}
                  onChange={(e) => setClinicaCuotaSocio(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md font-bold text-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                Dirección de la Sede
              </label>
              <input
                type="text"
                value={clinicaDireccion}
                onChange={(e) => setClinicaDireccion(e.target.value)}
                placeholder="ej: Av. San Martín 1540, Morón"
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
              />
            </div>

            {/* Datos del Veterinario Responsable */}
            <div className="pt-2 border-t border-surface-container-high/60 space-y-2">
              <span className="font-label-sm text-[11px] font-bold text-on-surface block uppercase tracking-wider">
                Profesional Responsable (Ley 14.072)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-0.5">Nombre *</label>
                  <input
                    type="text"
                    value={adminNombre}
                    onChange={(e) => setAdminNombre(e.target.value)}
                    placeholder="ej: Lucas"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-0.5">Apellido</label>
                  <input
                    type="text"
                    value={adminApellido}
                    onChange={(e) => setAdminApellido(e.target.value)}
                    placeholder="ej: Rossi"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-0.5">Matrícula (MP)</label>
                  <input
                    type="text"
                    value={adminMatricula}
                    onChange={(e) => setAdminMatricula(e.target.value)}
                    placeholder="MP 12.450"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-0.5">Email de Acceso *</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="doctor@clinica.com"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[13px] text-on-surface focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-secondary text-on-secondary rounded-xl font-label-md font-bold shadow-md hover:bg-secondary/95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Creando en Supabase...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add_business</span>
                  <span>Registrar Clínica &amp; Iniciar</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default AuthModal;
