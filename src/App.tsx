import React, { useState } from 'react';
import { TabModulo } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { AgendaModule } from './modules/Agenda/AgendaModule';
import { PacientesModule } from './modules/Pacientes/PacientesModule';
import { BotModule } from './modules/Bot/BotModule';
import { PlanesModule } from './modules/Planes/PlanesModule';
import { mockDraValeria } from './data/mockData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabModulo>('agenda');
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
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Llamado a Box desde Agenda
  const handleCallPatient = (patientName: string, tutorName: string) => {
    setToastConfig({
      show: true,
      title: 'Llamando a Box 01...',
      subtitle: `${patientName} & ${tutorName} han sido notificados por pantalla y app.`,
      icon: 'ring_volume',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  // Simulación de test de Bot
  const handleTriggerTestSimulation = () => {
    setToastConfig({
      show: true,
      title: 'Mensaje de prueba enviado',
      subtitle: 'Revisá el WhatsApp registrado para ver la interacción con VetBot.',
      icon: 'mark_chat_read',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3400);
  };

  // Nueva consulta clínica iniciada
  const handleTriggerConsultation = () => {
    setToastConfig({
      show: true,
      title: 'Iniciando consulta para Thor...',
      subtitle: 'Ficha médica en edición. Matrícula MP 10.492 vinculada.',
      icon: 'edit_note',
    });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-primary selection:text-on-primary">
      {/* Toast Notificación Superior */}
      <Toast
        show={toastConfig.show}
        title={toastConfig.title}
        subtitle={toastConfig.subtitle}
        icon={toastConfig.icon}
        onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
      />

      {/* Header Fijo Global */}
      <Header
        activeTab={activeTab}
        onUrgencyClick={() => setActiveTab('agenda')}
        onProfileClick={() => setShowProfileModal(true)}
      />

      {/* Contenedor Principal de la App */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
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

      {/* Barra de Navegación Inferior Fija */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal de Perfil Médico y Configuración */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-space-lg shadow-2xl text-left border border-surface-container-high/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <span className="font-headline-sm font-bold text-on-surface">Perfil Profesional</span>
              <button onClick={() => setShowProfileModal(false)}>
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
            <div className="flex flex-col items-center py-4 text-center">
              <img
                src={mockDraValeria.avatar_url}
                alt={mockDraValeria.nombre}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 mb-2"
              />
              <h4 className="font-headline-sm font-bold text-on-surface">
                Dra. {mockDraValeria.nombre} {mockDraValeria.apellido}
              </h4>
              <span className="text-[12px] bg-primary-fixed text-on-primary-fixed px-3 py-0.5 rounded-full font-bold mt-1">
                {mockDraValeria.matricula}
              </span>
              <p className="text-[12px] text-on-surface-variant mt-2 px-4">
                {mockDraValeria.jurisdiccion}
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-surface-container-high text-[13px]">
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Sede de atención:</span>
                <span className="font-bold text-on-surface">Sede Central / Box 01</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Horario asignado:</span>
                <span className="font-bold text-on-surface">08:00 - 14:00 hs</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Base de datos:</span>
                <span className="font-bold text-primary">Supabase PostgreSQL</span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full mt-4 py-2.5 bg-surface-container-high rounded-xl font-label-md font-bold text-on-surface"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
