import React, { useState } from 'react';
import { TabModulo, UsuarioSesion, Clinica } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AuthModal } from './modules/Auth/AuthModal';
import { AgendaModule } from './modules/Agenda/AgendaModule';
import { PacientesModule } from './modules/Pacientes/PacientesModule';
import { BotModule } from './modules/Bot/BotModule';
import { PlanesModule } from './modules/Planes/PlanesModule';
import { mockDraValeria } from './data/mockData';

const DEFAULT_CLINICA: Clinica = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'vetcare-central',
  nombre_fantasia: 'VetCare Central & Hospital 24h',
  cuit: '30-71928491-9',
  email_contacto: 'central@vetcarepro.com.ar',
  telefono: '+54 11 4782-9000',
  direccion: 'Av. Libertador 2420, CABA',
  cuota_socio_defecto: 10000,
};

const DEFAULT_SESION: UsuarioSesion = {
  id: 'b1111111-1111-1111-1111-111111111111',
  nombre: 'Valeria',
  apellido: 'Gómez',
  email: 'valeria.gomez@vetcarepro.com',
  rol: 'veterinario',
  matricula_provincial: 'MP 10.492',
  box_actual: 'Box 01',
  turno_actual: 'Turno Mañana (08:00 - 14:00)',
  clinica: DEFAULT_CLINICA,
  avatar_url: mockDraValeria.avatar_url,
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabModulo>('agenda');
  const [sesion, setSesion] = useState<UsuarioSesion>(DEFAULT_SESION);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    title: string;
    subtitle: string;
    icon?: string;
  }>({
    show: false,
    title: '',
    subtitle: '',
    icon: 'ring_volume',
  });

  // Notificación de Llamado a Box (Caso de uso UC-02)
  const handleCallPatient = (patientName: string, tutorName: string) => {
    setToastConfig({
      show: true,
      title: `Llamando a ${sesion.box_actual}...`,
      subtitle: `${patientName} & ${tutorName} han sido convocados por pantalla y notificación push.`,
      icon: 'ring_volume',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  // Simulación de respuesta VetBot por WhatsApp (Caso de uso UC-20)
  const handleTriggerTestSimulation = () => {
    setToastConfig({
      show: true,
      title: 'Mensaje de prueba enviado por WhatsApp',
      subtitle: 'Simulación completada con IA de triaje en lenguaje natural.',
      icon: 'mark_chat_read',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3400);
  };

  // Inicio de consulta médica reglamentada por Ley 14.072 (Caso de uso UC-13)
  const handleTriggerConsultation = () => {
    setToastConfig({
      show: true,
      title: 'Consulta médica iniciada',
      subtitle: `Ficha clínica vinculada a ${sesion.matricula_provincial || 'Staff'}. Protocolo de custodia activo.`,
      icon: 'edit_note',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Acceso inmediato a urgencias
  const handleUrgencyClick = () => {
    setActiveTab('agenda');
    setToastConfig({
      show: true,
      title: 'Protocolo de Urgencia Rojo Activado',
      subtitle: 'Paciente Rocky (Golden Retriever) en shock alérgico prioritario en Box 01.',
      icon: 'emergency',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-primary selection:text-on-primary">
      {/* Toast Notificación Superior Global */}
      <Toast
        show={toastConfig.show}
        title={toastConfig.title}
        subtitle={toastConfig.subtitle}
        icon={toastConfig.icon}
        onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
      />

      {/* Barra Lateral Persistente en Pantallas Desktop (>= 1024px) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        sesion={sesion}
        onOpenAuth={() => setShowAuthModal(true)}
        onUrgencyClick={handleUrgencyClick}
      />

      {/* Header Superior Adaptable (Móvil y Desktop) */}
      <Header
        activeTab={activeTab}
        sesion={sesion}
        onUrgencyClick={handleUrgencyClick}
        onProfileClick={() => setShowAuthModal(true)}
      />

      {/* Contenedor Principal: Ajuste responsivo de márgenes laterales en PC (lg:pl-64) y móvil (pb-20) */}
      <main className="flex-1 flex flex-col relative w-full pt-16 lg:pl-64 pb-20 lg:pb-8 bg-surface min-h-screen">
        {activeTab === 'agenda' && (
          <AgendaModule
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onCallPatient={handleCallPatient}
          />
        )}

        {activeTab === 'pacientes' && (
          <PacientesModule
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onTriggerConsultation={handleTriggerConsultation}
          />
        )}

        {activeTab === 'bot-y-alertas' && (
          <BotModule onTriggerTestSimulation={handleTriggerTestSimulation} />
        )}

        {activeTab === 'planes-salud' && (
          <PlanesModule onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Barra de Navegación Inferior Fija para Móviles (< 1024px) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal Autenticación Profesional y Onboarding SaaS B2B */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentSesion={sesion}
        onLoginSuccess={(newSesion) => {
          setSesion(newSesion);
          setToastConfig({
            show: true,
            title: `Sesión iniciada: ${newSesion.nombre} ${newSesion.apellido}`,
            subtitle: `Sede: ${newSesion.clinica.nombre_fantasia} (${newSesion.box_actual || 'Recepción'})`,
            icon: 'verified_user',
          });
          setTimeout(() => {
            setToastConfig((prev) => ({ ...prev, show: false }));
          }, 3500);
        }}
      />
    </div>
  );
};
export default App;
