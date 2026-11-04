import React, { useState } from 'react';
import { TabModulo, UsuarioSesion } from './types';
import { databaseService } from './lib/databaseService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AuthModal } from './modules/Auth/AuthModal';
import { AgendaModule } from './modules/Agenda/AgendaModule';
import { PacientesModule } from './modules/Pacientes/PacientesModule';
import { BotModule } from './modules/Bot/BotModule';
import { PlanesModule } from './modules/Planes/PlanesModule';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabModulo>('agenda');
  
  // Sesión obtenida de localStorage (o null si es primera vez / cerrado de sesión)
  const [sesion, setSesion] = useState<UsuarioSesion | null>(() => databaseService.getLocalSession());
  
  // Si no hay sesión, se abre el modal de login directamente
  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => !databaseService.getLocalSession());

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

  // Notificación de Llamado a Box
  const handleCallPatient = (patientName: string, tutorName: string) => {
    setToastConfig({
      show: true,
      title: `Llamando a ${sesion?.box_actual || 'Box 01'}...`,
      subtitle: `${patientName} & ${tutorName} convocados a consulta médica.`,
      icon: 'ring_volume',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  // Simulación de prueba de VetBot
  const handleTriggerTestSimulation = () => {
    setToastConfig({
      show: true,
      title: 'Mensaje de WhatsApp enviado',
      subtitle: 'Simulación completada con IA de seguimiento clínico.',
      icon: 'mark_chat_read',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3400);
  };

  // Inicio de consulta médica
  const handleTriggerConsultation = () => {
    setToastConfig({
      show: true,
      title: 'Consulta médica iniciada',
      subtitle: `Ficha clínica vinculada a ${sesion?.matricula_provincial || 'Staff'}.`,
      icon: 'edit_note',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Acceso de Urgencias
  const handleUrgencyClick = () => {
    setActiveTab('agenda');
    setToastConfig({
      show: true,
      title: 'Protocolo de Urgencias',
      subtitle: 'Acceso prioritario a triaje y salas de shock.',
      icon: 'emergency',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Cerrar Sesión
  const handleLogout = () => {
    databaseService.clearLocalSession();
    setSesion(null);
    setShowAuthModal(true);
    setToastConfig({
      show: true,
      title: 'Sesión finalizada',
      subtitle: 'Podés iniciar sesión con otro profesional o registrar una nueva clínica.',
      icon: 'logout',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3000);
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

      {/* Si hay sesión iniciada, mostrar interfaz completa */}
      {sesion ? (
        <>
          {/* Barra Lateral Persistente en PC (>= 1024px) */}
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

          {/* Header Superior Adaptable */}
          <Header
            activeTab={activeTab}
            sesion={sesion}
            onUrgencyClick={handleUrgencyClick}
            onProfileClick={() => setShowAuthModal(true)}
          />

          {/* Contenedor Principal: Responsivo PC (lg:pl-64) y Móvil (pb-20) */}
          <main className="flex-1 flex flex-col relative w-full pt-16 lg:pl-64 pb-20 lg:pb-8 bg-surface min-h-screen">
            {activeTab === 'agenda' && (
              <AgendaModule
                sesion={sesion}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onCallPatient={handleCallPatient}
              />
            )}

            {activeTab === 'pacientes' && (
              <PacientesModule
                sesion={sesion}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onTriggerConsultation={handleTriggerConsultation}
              />
            )}

            {activeTab === 'bot-y-alertas' && (
              <BotModule onTriggerTestSimulation={handleTriggerTestSimulation} />
            )}

            {activeTab === 'planes-salud' && (
              <PlanesModule
                sesion={sesion}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
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
        </>
      ) : (
        /* Pantalla Inicial Cuando No Hay Sesión Iniciada */
        <div className="flex-1 flex items-center justify-center p-4 bg-surface min-h-screen">
          <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-surface-container-high/40 text-center">
            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-on-primary shadow-lg mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px]">pets</span>
            </div>
            <h1 className="font-headline-lg font-bold text-on-surface">VetCare Pro</h1>
            <p className="font-body-md text-on-surface-variant mt-1 mb-6">
              Sistema de Gestión Veterinaria &amp; Planes de Socios ($10.000/mes)
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3.5 bg-primary text-on-primary rounded-2xl font-bold shadow-md hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">login</span>
              <span>Iniciar Sesión / Registrar Clínica</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Autenticación Profesional y Onboarding SaaS B2B */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          if (sesion) setShowAuthModal(false);
        }}
        currentSesion={sesion}
        onLoginSuccess={(newSesion) => {
          setSesion(newSesion);
          setShowAuthModal(false);
          setToastConfig({
            show: true,
            title: `Bienvenido/a, ${newSesion.nombre}`,
            subtitle: `Sede: ${newSesion.clinica.nombre_fantasia} (${newSesion.box_actual})`,
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
