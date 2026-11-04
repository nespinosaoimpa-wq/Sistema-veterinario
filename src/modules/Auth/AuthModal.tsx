import React, { useState } from 'react';
import { UsuarioSesion, Clinica } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (usuario: UsuarioSesion) => void;
  currentSesion?: UsuarioSesion;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentSesion,
}) => {
  const [mode, setMode] = useState<'login' | 'registro_clinica'>('login');
  
  // Login Form States
  const [email, setEmail] = useState(currentSesion?.email || 'valeria.gomez@vetcarepro.com');
  const [password, setPassword] = useState('********');
  const [selectedBox, setSelectedBox] = useState(currentSesion?.box_actual || 'Box 1');
  const [selectedTurno, setSelectedTurno] = useState(currentSesion?.turno_actual || 'Turno Mañana');

  // Nueva Clínica B2B States
  const [clinicaNombre, setClinicaNombre] = useState('');
  const [clinicaCuit, setClinicaCuit] = useState('');
  const [clinicaDireccion, setClinicaDireccion] = useState('');
  const [clinicaCuotaSocio, setClinicaCuotaSocio] = useState('10000');
  const [adminNombre, setAdminNombre] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminMatricula, setAdminMatricula] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoLogin = (perfil: 'valeria' | 'recepcion' | 'admin') => {
    let mockUser: UsuarioSesion;
    const mockClinica: Clinica = {
      id: '00000000-0000-0000-0000-000000000001',
      slug: 'vetcare-central',
      nombre_fantasia: 'VetCare Central & Hospital 24h',
      cuit: '30-71928491-9',
      email_contacto: 'contacto@vetcarepro.com',
      direccion: 'Av. Libertador 2420, CABA',
      cuota_socio_defecto: 10000,
    };

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

    onLoginSuccess(mockUser);
    onClose();
  };

  const handleCrearClinica = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicaNombre || !clinicaCuit) {
      alert('Por favor complete el nombre de la clínica y CUIT.');
      return;
    }

    const nuevaClinica: Clinica = {
      id: crypto.randomUUID(),
      slug: clinicaNombre.toLowerCase().replace(/\s+/g, '-'),
      nombre_fantasia: clinicaNombre,
      cuit: clinicaCuit,
      email_contacto: adminEmail || 'admin@' + clinicaNombre.toLowerCase().replace(/\s+/g, '') + '.com',
      direccion: clinicaDireccion || 'Sede Central',
      cuota_socio_defecto: Number(clinicaCuotaSocio) || 10000,
    };

    const nuevoAdmin: UsuarioSesion = {
      id: crypto.randomUUID(),
      nombre: adminNombre.split(' ')[0] || 'Director',
      apellido: adminNombre.split(' ').slice(1).join(' ') || 'Médico',
      email: adminEmail,
      rol: 'administrador',
      matricula_provincial: adminMatricula || 'MP 12.000',
      box_actual: 'Box 1',
      turno_actual: 'Turno Mañana',
      clinica: nuevaClinica,
    };

    alert(`¡Clínica "${nuevaClinica.nombre_fantasia}" registrada con éxito! Plan de socios configurado en $${nuevaClinica.cuota_socio_defecto.toLocaleString('es-AR')}/mes.`);
    onLoginSuccess(nuevoAdmin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-surface-container-high/40 text-left animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">pets</span>
            </div>
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface leading-tight">VetCare Pro</h2>
              <span className="font-label-sm text-[11px] text-primary font-semibold">
                Plataforma SaaS B2B Veterinaria
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Pestañas: Login vs Registro de Clínica B2B */}
        <div className="flex bg-surface-container-high p-1 rounded-2xl my-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl font-label-md text-label-md font-bold transition-all ${
              mode === 'login' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Acceso Profesional
          </button>
          <button
            onClick={() => setMode('registro_clinica')}
            className={`flex-1 py-2 rounded-xl font-label-md text-label-md font-bold transition-all ${
              mode === 'registro_clinica' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Registrar Veterinaria (B2B)
          </button>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            {/* Accesos rápidos de demostración */}
            <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container-high/40 text-left">
              <span className="font-label-sm text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block mb-2">
                ⚡ Acceso Rápido de Demostración:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('valeria')}
                  className="py-2 px-2 bg-primary text-on-primary rounded-xl font-label-sm text-[11px] font-bold shadow-sm active:scale-95 text-center"
                >
                  Dra. Valeria (MP 10.492)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('recepcion')}
                  className="py-2 px-2 bg-surface-container-lowest text-on-surface rounded-xl font-label-sm text-[11px] font-bold border border-surface-container-high active:scale-95 text-center"
                >
                  Recepción
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="py-2 px-2 bg-secondary text-on-secondary rounded-xl font-label-sm text-[11px] font-bold shadow-sm active:scale-95 text-center"
                >
                  Admin Clínica
                </button>
              </div>
            </div>

            {/* Formulario tradicional */}
            <form onSubmit={(e) => { e.preventDefault(); handleQuickDemoLogin('valeria'); }} className="space-y-3">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Email Profesional
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
                    Turno Asignado
                  </label>
                  <select
                    value={selectedTurno}
                    onChange={(e) => setSelectedTurno(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  >
                    <option value="Turno Mañana">Turno Mañana (08-14h)</option>
                    <option value="Turno Tarde">Turno Tarde (14-20h)</option>
                    <option value="Guardia 24h">Guardia Nocturna / 24h</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                    Box / Consultorio
                  </label>
                  <select
                    value={selectedBox}
                    onChange={(e) => setSelectedBox(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  >
                    <option value="Box 1">Box 1 (Clínica)</option>
                    <option value="Box 2">Box 2 (Vacunación)</option>
                    <option value="Sala 2 (Urgencias)">Sala 2 (Urgencias)</option>
                    <option value="Quirófano">Quirófano Central</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-on-primary rounded-2xl font-label-md text-label-md font-bold shadow-md hover:bg-primary-container active:scale-95 transition-all mt-2"
              >
                Ingresar al Sistema
              </button>
            </form>
          </div>
        ) : (
          /* Formulario de Alta de Clínica B2B */
          <form onSubmit={handleCrearClinica} className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/20 text-[12px] text-primary">
              🏢 <strong>Crea el espacio para tu veterinaria:</strong> Podrás invitar a tus colegas veterinarios, configurar tus cajas de atención y habilitar el <strong>Plan Socio a $10.000/mes</strong> para tus clientes.
            </div>

            <div>
              <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                Nombre de Fantasía de la Clínica
              </label>
              <input
                type="text"
                value={clinicaNombre}
                onChange={(e) => setClinicaNombre(e.target.value)}
                placeholder="Ej: Veterinaria Belgrano Norte"
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  CUIT Fiscal
                </label>
                <input
                  type="text"
                  value={clinicaCuit}
                  onChange={(e) => setClinicaCuit(e.target.value)}
                  placeholder="30-71829301-4"
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                  Cuota Mensual de Socio ($)
                </label>
                <input
                  type="number"
                  value={clinicaCuotaSocio}
                  onChange={(e) => setClinicaCuotaSocio(e.target.value)}
                  className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md font-bold text-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-semibold">
                Dirección de la Sede Central
              </label>
              <input
                type="text"
                value={clinicaDireccion}
                onChange={(e) => setClinicaDireccion(e.target.value)}
                placeholder="Av. Cabildo 1420, CABA"
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface focus:outline-none"
              />
            </div>

            <div className="border-t border-surface-container-high pt-2">
              <span className="font-label-sm text-[11px] text-on-surface font-bold uppercase tracking-wider block mb-2">
                Datos del Director Médico / Administrador:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={adminNombre}
                    onChange={(e) => setAdminNombre(e.target.value)}
                    placeholder="Dr. Martín Gómez"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[12px] text-on-surface focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-sm text-[10px] text-on-surface-variant block mb-1">Matrícula Provincial</label>
                  <input
                    type="text"
                    value={adminMatricula}
                    onChange={(e) => setAdminMatricula(e.target.value)}
                    placeholder="MP 11.450"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[12px] text-on-surface focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="font-label-sm text-[10px] text-on-surface-variant block mb-1">Email de Administrador</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@veterinaria.com"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-[12px] text-on-surface focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-on-primary rounded-2xl font-label-md text-label-md font-bold shadow-md hover:bg-primary-container active:scale-95 transition-all mt-3"
            >
              Registrar Clínica y Comenzar Prueba
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
