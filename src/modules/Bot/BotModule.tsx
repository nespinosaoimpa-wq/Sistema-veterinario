import React, { useState } from 'react';
import { mockBotMensajes } from '../../data/mockData';
import { BotMensajeItem } from '../../types';

interface BotModuleProps {
  onTriggerTestSimulation: () => void;
}

export const BotModule: React.FC<BotModuleProps> = ({ onTriggerTestSimulation }) => {
  const [botActive, setBotActive] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [mensajes, setMensajes] = useState<BotMensajeItem[]>(mockBotMensajes);
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    email: false,
  });

  const filteredMensajes = mensajes.filter((m) => {
    if (selectedFilter === 'todos') return true;
    return m.categoria_filtro === selectedFilter;
  });

  const handleSendNow = (id: string) => {
    setMensajes((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, estado_badge: 'Enviado ahora', estado_tipo: 'enviado' }
          : m
      )
    );
    alert('Mensaje despachado inmediatamente por WhatsApp Business API.');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto text-left">
      {/* 3.1 Bot Master Status Banner */}
      <div className="px-margin pt-space-md pb-space-sm">
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">smart_toy</span>
                {botActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                    VetBot Asistente
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      botActive
                        ? 'bg-primary text-on-primary'
                        : 'bg-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {botActive ? 'Activo' : 'En Pausa'}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                  Conectado a WhatsApp Business API oficial
                </p>
              </div>
            </div>

            {/* Global Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={botActive}
                onChange={(e) => setBotActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-sm" />
            </label>
          </div>

          {/* Quick Channels Sub-Bar */}
          <div className="mt-space-md pt-space-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-surface-container-high/40">
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
              <span className="font-label-sm text-[11px] text-on-surface font-semibold">WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-primary ml-1" />
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] text-secondary">sms</span>
              <span className="font-label-sm text-[11px] text-on-surface font-semibold">SMS Backup</span>
              <span className="w-2 h-2 rounded-full bg-secondary ml-1" />
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] text-outline">alternate_email</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">Email</span>
              <span className="w-2 h-2 rounded-full bg-outline-variant ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 3.2 Performance Metrics Bar */}
      <div className="px-margin py-space-xs">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-surface-container-lowest rounded-2xl p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40">
            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim/40 text-primary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">142</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
              Enviados este mes
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-secondary font-bold leading-tight">94%</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
              Citas confirmadas
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-3 flex flex-col items-center text-center shadow-sm border border-surface-container-high/40">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed/60 text-tertiary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-tertiary font-bold leading-tight">28</span>
            <span className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
              Vacunas rescatadas
            </span>
          </div>
        </div>
      </div>

      {/* 3.3 Botones de Acción */}
      <div className="px-margin py-space-sm flex gap-2">
        <button
          onClick={() => alert("Formulario de Nueva Regla: Disparador + Plantilla WhatsApp + Timing")}
          className="flex-1 bg-primary text-on-primary py-3 px-3 rounded-2xl font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Nueva Regla</span>
        </button>
        <button
          onClick={onTriggerTestSimulation}
          className="bg-surface-container-lowest text-secondary py-3 px-3 rounded-2xl font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm border border-surface-container-high/40 active:scale-[0.98] transition-transform font-bold hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          <span>Simular Test</span>
        </button>
      </div>

      {/* 3.4 Filtros de Categoría */}
      <div className="pt-space-xs pb-space-xs">
        <div className="flex items-center gap-2 overflow-x-auto px-margin no-scrollbar">
          {[
            { id: 'todos', label: 'Todos (24)' },
            { id: 'vacunacion', label: 'Vacunación' },
            { id: 'posquirurgico', label: 'Control Posquirúrgico' },
            { id: 'desparasitacion', label: 'Desparasitación' },
            { id: 'turnos', label: 'Turnos Próximos' },
          ].map((cat) => {
            const isActive = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-full font-label-sm text-[11px] flex-shrink-0 transition-all font-semibold ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3.5 Flujo en Tiempo Real */}
      <div className="px-margin py-space-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
            Flujo en Tiempo Real
          </span>
          <span className="font-body-sm text-[12px] text-primary flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Sincronizado
          </span>
        </div>

        {/* Lista de Items de Mensajería */}
        {filteredMensajes.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{item.icono_categoria}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                      {item.titulo}
                    </span>
                    {item.estado_tipo === 'programado' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    )}
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    {item.tutor_nombre} • <span className="font-medium text-on-surface">{item.paciente_nombre}</span> ({item.especie_raza})
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold flex-shrink-0 ${
                  item.estado_tipo === 'programado'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                    : item.estado_tipo === 'enviado'
                    ? 'bg-primary-fixed text-on-primary-fixed-variant'
                    : item.estado_tipo === 'confirmada'
                    ? 'bg-secondary-fixed text-on-secondary-fixed-variant flex items-center gap-1'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {item.estado_tipo === 'confirmada' && (
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                )}
                {item.estado_badge}
              </span>
            </div>

            {/* Meta de Horario / Canal */}
            <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-label-sm">
              <span className="material-symbols-outlined text-[15px] text-tertiary">schedule</span>
              <span>{item.meta_tiempo}</span>
            </div>

            {/* Vista previa de WhatsApp si existe */}
            {item.preview_texto && (
              <div className="bg-surface-container-low rounded-2xl p-3 relative text-left">
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-primary">
                  <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                  <span>Vista Previa del Mensaje</span>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface leading-snug">
                  {item.preview_texto}
                </p>
                <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-on-surface-variant font-label-sm">
                  <span>Bot Trigger: Calendario +365d</span>
                  <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>
                </div>
              </div>
            )}

            {/* Respuesta analizada por IA si existe */}
            {item.ai_analisis && (
              <div className="bg-primary/5 rounded-2xl p-3 flex flex-col gap-1.5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-primary flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    {item.ai_analisis.tipo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-primary text-on-primary font-bold">
                    {item.ai_analisis.badge}
                  </span>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface italic">
                  "{item.ai_analisis.texto_respuesta}"
                </p>
              </div>
            )}

            {/* Acciones */}
            {item.estado_tipo === 'programado' && (
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/30">
                <button
                  onClick={() => alert("Editor de plantilla abierto para personalizar el texto")}
                  className="text-secondary font-label-sm text-label-sm flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  Editar Texto
                </button>
                <button
                  onClick={() => handleSendNow(item.id)}
                  className="text-primary font-label-sm text-label-sm flex items-center gap-1 font-bold"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  Enviar Ahora
                </button>
              </div>
            )}

            {item.ai_analisis && (
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  Ficha clínica actualizada automáticamente
                </span>
                <button
                  onClick={() => alert("Abriendo chat completo de WhatsApp con María Elena")}
                  className="text-secondary font-label-md text-label-md flex items-center gap-0.5 font-bold"
                >
                  Ver Chat
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            )}

            {item.estado_tipo === 'lote' && (
              <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">batch_prediction</span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-bold">18 envíos programados</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Pacientes con dosis vencida esta semana</span>
                  </div>
                </div>
                <button
                  onClick={() => alert("Mostrando los 18 pacientes del lote masivo")}
                  className="px-3 py-1 rounded-xl bg-surface-container-highest text-primary font-label-sm text-[11px] font-bold flex items-center gap-1"
                >
                  <span>Ver Lote</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3.6 Configuración de Canales de Despacho */}
      <div className="px-margin pt-space-sm pb-space-lg">
        <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-sm border border-surface-container-high/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Canales de Despacho
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-on-surface-variant">Prioridad de red</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">WhatsApp Cloud API</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Canal primario de alta tasa de lectura</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.whatsapp}
                onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                className="accent-primary w-5 h-5 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">sms</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">SMS Respaldo (Backup)</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Se envía si WhatsApp falla tras 15 min</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.sms}
                onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                className="accent-primary w-5 h-5 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-surface-container-high text-outline flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">Correo Electrónico</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Resumen mensual e historial de vacunas</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.email}
                onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                className="accent-primary w-5 h-5 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

