import { Paciente, TurnoAgenda, TriajeUrgencia, PlanSalud, SuscripcionActiva, BotMensajeItem } from '../types';

export const mockDraValeria = {
  nombre: "Valeria",
  apellido: "Gómez",
  matricula: "MP 10.492",
  jurisdiccion: "Colegio de Veterinarios de la Prov. de Bs. As.",
  avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm3QXudc9qfIv8DaxZy4ToV1UJMSy_PgLRz12B8VqQaWrrmfPlQ5EoWbTYngTvMx03BVfcL0yc2yRretLB_XH-sFPnlfEvLTfbFmWV6VxC8g_zSpNrMZq8WRXyvKrd2rhpKBczPCNcafzSa7sE2V6sNNQlAqXx5rgbz7QE3fUZrepqne5mVbJcZTe1cx_gDe_Aih3MZWgVfofskMw9g25xkoWv2WrxEX9REbcHH_FQ"
};

export const mockTriajeUrgencia: TriajeUrgencia = {
  id: "triaje-1",
  paciente_nombre: "Thor (Golden Retriever)",
  especie_raza: "Canino Golden Retriever",
  sintoma: "Dificultad respiratoria aguda • Sala 2",
  sala: "Sala 2",
  spo2: 89,
  temperatura: 39.4,
  foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5u2HTPGQtWgomlKVUh8slxCBEwrbJsOJfAG5THh4ttkIru5q-v9LxDgy4jedoxpVouMzZ8aajO0ZILkLMXEE8UEeonXukATX48xf-whSkfzFvXVyfTWD90VLsE9pxNp4nWf0W6HVoFGQQ_0zP8VTieQAT-WGYZoA41T0-W95Y5rpCDRlvgmQg1C-gQbbxiPwkFq_F_7TITY2f671Q1K9QgvZSs8pV_SyebMFnlYnT",
  tiempo_espera: "Llegó hace 8 min",
  atendido: false
};

export const mockTurnosAgenda: TurnoAgenda[] = [
  {
    id: "turno-1",
    hora: "09:00",
    duracion: "45 min",
    paciente: {
      id: "paciente-thor",
      nombre: "Thor",
      especie_raza: "Golden Retriever • 4 años • 32 kg",
      sexo: "male",
      foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC5IOvlkuSi1kmjB2W5AThSljxrIUVbdY_FhK2eEJwVya76uhJXx0RkEvkgoDrYex4ndjejh8mXInBQLLKZFyweruNUyhYo5c57HjaZrT6ubLCdLc-x3IjW2btrogdcSMKcWNazhtWHzKv57Wj86yYuc0X-loQWI4RAMBFsSTax8eyz_1jqZBNMI-h4qxD123q077pKc20J7PrXtP8G4sUnD1PJkV_zanNhKBdWE5P",
      tutor_nombre: "Carlos Méndez",
      plan_nombre: "PetCare Platinum"
    },
    motivo: "Control cardiológico semestral",
    icono_motivo: "stethoscope",
    sede_o_info: "Carlos Méndez",
    estado: "waiting",
    estado_label: "En Sala",
    tipo_accion: "llamar"
  },
  {
    id: "turno-2",
    hora: "10:15",
    duracion: "30 min",
    paciente: {
      id: "paciente-mimi",
      nombre: "Mimi",
      especie_raza: "Gata Siamés • 2 años • 3.8 kg",
      sexo: "female",
      foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj3HyO4wp053VMcbdOEL9bliMIpkZEKOCWtxK3bCH-r6Sh0hKJnFc5J1aWkDfZyB76TPy5tjiF5SpkmbgAZf6x2vSxmnKOVV6Eig72t2YP2-2o0lygpXJAs2pF-_RoffDbj5HxaSueUrbEqaWlpPFamLqTQXX8rBrH9QLrjNTxMaslUHI-xikangYts3hakvDKg5q_aUAznMWHxYvYPJv1IfJsXbI2LkCLaxnOQchO",
      tutor_nombre: "Sofía Lara",
      plan_nombre: "Plan Socio Comunidad"
    },
    motivo: "Vacunación Anual (Triple Felina)",
    icono_motivo: "vaccines",
    sede_o_info: "Sofía Lara",
    badge_extra: "Al día",
    estado: "confirmed",
    estado_label: "Confirmado",
    tipo_accion: "preparar"
  },
  {
    id: "turno-3",
    hora: "11:30",
    duracion: "30 min",
    paciente: {
      id: "paciente-rocky",
      nombre: "Rocky",
      especie_raza: "Bulldog Francés • 3 años • 12 kg",
      sexo: "male",
      foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKTqXE3wfo5lbBKx-6JQwAidWyv-LoEnQUNOBSrrr1aLlrZdKAFbKNoHLLAQLPUp2m3ptIAzueyyUZi-C5pp-IY8qrFeS4n9sLfn-zQfLfUkiuoqddLeu7ZoSVaNUrXrykfhrvAlMFtvU1gpU2aezB8Rz9fSU13fpTNFVS-e6NJgP949fNNGI5pTuls75ZKUERf9f5c9pxf3JWmKEBLckxSXYbqHvTbhnjkArwTyGP",
      tutor_nombre: "VetCare Norte",
      plan_nombre: "PetCare Platinum"
    },
    motivo: "Revisión posquirúrgica de rodilla",
    icono_motivo: "healing",
    sede_o_info: "VetCare Norte",
    badge_extra: "Día 14 post-op",
    estado: "confirmed",
    estado_label: "Confirmado",
    tipo_accion: "placas"
  },
  {
    id: "turno-4",
    hora: "12:45",
    duracion: "45 min",
    paciente: {
      id: "paciente-luna",
      nombre: "Luna",
      especie_raza: "Poodle Toy • 6 años • 4.5 kg",
      sexo: "female",
      foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfAZG-ZdhYOV085Yyd3nG2E974O6WHGvK_vxoUzkJ8Ns5HToMR9NhsgY7etJzsN_oxUlRpoBy3q1tdEo6o2kRStUFzXTLEnN_VoUXpLui3OpnswAbbIaGV0e-vNC_iAOfzxesPePUSKCz_nl5aFY6EfnmwG_twk6MT5qTv4gQOgG5twuh__PoZ1-D2GhYM1FJ4rsF0sAzLmj0Qg6690-UuGwEQ7QL-8paNIu-BZ7NG",
      tutor_nombre: "Roberto Paz",
      plan_nombre: "Plan Esencial"
    },
    motivo: "Limpieza dental & perfil prequirúrgico",
    icono_motivo: "dentistry",
    sede_o_info: "Recordatorio enviado",
    badge_extra: "Ayuno requerido",
    estado: "pending",
    estado_label: "Pendiente",
    tipo_accion: "recordatorio"
  }
];

export const mockThorPaciente: Paciente = {
  id: "paciente-thor",
  nombre: "Thor",
  especie: "Canino",
  raza: "Golden Retriever",
  sexo: "macho",
  edad_texto: "4a 2m",
  peso_actual: 32.4,
  tendencia_peso: "sube",
  grupo_sanguineo: "DEA 1.1 Positivo",
  microchip_id: "9810-AR-94812",
  foto_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCRB4Dhl2-TO5RjbWS5P8cNI7KhjxSRkyNBF4tg7SxUcxZRbotP-XRJWS_cCGL61nWiLBjFQfJftNXEk6udHlTb67EQ2uU08ZRjidCgBWtjXKrzpRV_CwfquaNxDHptesiEFkaLBferVGf1dLoyo68chnGK-tHXZ3mI61Ic5VaxREINpIjwgCFqT4QxMNeDUX6wBztdHTIPtEMA8AzD6fEhJtZZaRUYuUoArPC8j2C",
  tutor: {
    id: "tutor-carlos",
    nombre_completo: "Carlos Méndez",
    dni: "32.849.201",
    telefono: "+54 9 11 4829-1122",
    direccion: "Av. Libertador 2420, CABA",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBco4TFUWv85KuidPXoqRgc65JoKwWjDj-tPUWNpvnb_-VR5l0tnkqgnW0tAS0sqR-Kxu3RFeukY-_okryyYAn106vv08og5gEBAoI60BHejnFWvlEnbshFwOkXFG1Jx7IyWeMkzJ4bfSETRUL15MLmwDE0tmWBf4U5QmvTNFfHUFna7ytTG4SLUkl93S3z7v2MQ18LDos96A9e5UBIp_cjwDJGvQk-4du0KfowvPdf"
  },
  plan_salud: "PetCare Platinum Activo",
  activo: true
};

export const mockSuscripcionThor: SuscripcionActiva = {
  paciente_id: "paciente-thor",
  plan_nombre: "PetCare Platinum",
  categoria: "VIP Care",
  cuota_mensual: 24500,
  proxima_facturacion: "05 de Noviembre, 2026",
  numero_carnet: "VC-THOR-9810-PLAT",
  ahorro_acumulado: 58200,
  consumos: [
    {
      prestacion: "Consultas Clínicas Generales",
      cobertura_label: "100% Cubierto",
      detalle: "Ilimitadas en sedes ambulatorias",
      uso_label: "4 consultas realizadas",
      porcentaje_uso: 40
    },
    {
      prestacion: "Vacunas Calendario Obligatorio",
      cobertura_label: "100% Bonificado",
      detalle: "Sextuple, Antirrábica, KC Tos de Perrera",
      uso_label: "2 de 3 aplicadas",
      porcentaje_uso: 66.6,
      alerta_siguiente: "Próxima dosis sugerida: Antirrábica en Diciembre"
    },
    {
      prestacion: "Cirugías Menores & Anestesia Inhalatoria",
      cobertura_label: "40% OFF",
      detalle: "Incluye monitoreo multiparamétrico",
      uso_label: "Sin consumos en 2026",
      porcentaje_uso: 0
    },
    {
      prestacion: "Profilaxis Dental por Ultrasonido",
      cobertura_label: "1 Anual Gratis",
      detalle: "Disponible para agendar en quirófano",
      uso_label: "Disponible",
      porcentaje_uso: 0,
      permite_reserva: true
    },
    {
      prestacion: "Urgencias y Triage 24/7",
      cobertura_label: "100% Cubierto",
      detalle: "En todas las sedes hospitalarias VetCare",
      uso_label: "Ilimitado",
      porcentaje_uso: 10
    }
  ]
};

export const mockPlanesCatalogo: PlanSalud[] = [
  {
    id: "plan-socio-10k",
    codigo: "PLAN-SOCIO-COMUNIDAD",
    nombre: "Plan Socio Particular",
    subtitulo: "Cuota accesible mensual para no afrontar gastos de golpe",
    descripcion: "Especialmente diseñado para que cada tutor pague una cuota fija de $10.000/mes y tenga cubiertas las urgencias 24/7 y vacunas obligatorias sin imprevistos financieros.",
    precio_mensual: 10000,
    moneda: "ARS",
    es_destacado: true,
    es_plan_socio_10k: true,
    beneficios: [
      "100% de cobertura en urgencias y triage 24/7 sin copago",
      "100% bonificado en vacunas obligatorias (Rabia + Séxtuple/Triple)",
      "Consultas clínicas programadas al 100% (hasta 6 al año)",
      "50% de descuento directo en cirugías e internación",
      "Carnet digital QR con atención prioritaria en guardia"
    ],
    cobertura_urgencias: "100%",
    cobertura_consultas: "100% (hasta 6)",
    cobertura_cirugias: "50% OFF",
    cobertura_vacunas: "100% bonificadas"
  },
  {
    id: "plan-esencial",
    codigo: "PLAN-ESENCIAL",
    nombre: "Plan Esencial",
    subtitulo: "Protección básica y medicina preventiva",
    descripcion: "Cobertura inicial de consultas de rutina y control veterinario anual.",
    precio_mensual: 12900,
    moneda: "ARS",
    beneficios: [
      "Consultas clínicas: 100% bonificadas (hasta 6 al año)",
      "Vacunación anual y desparasitaciones periódicas",
      "15% descuento en farmacia y medicamentos"
    ],
    cobertura_urgencias: "50% copago",
    cobertura_consultas: "100% (hasta 6)",
    cobertura_cirugias: "20% OFF",
    cobertura_vacunas: "100% bonificadas"
  },
  {
    id: "plan-platinum",
    codigo: "PLAN-PLATINUM",
    nombre: "Plan Platinum",
    subtitulo: "Máxima tranquilidad para cachorros y adultos",
    descripcion: "El plan más completo para cobertura integral en todas las sedes.",
    precio_mensual: 24500,
    moneda: "ARS",
    es_destacado: false,
    beneficios: [
      "Consultas ilimitadas + Urgencias 24/7 sin copago",
      "40% de cobertura en cirugías e internaciones",
      "Limpieza dental con ultrasonido anual gratuita",
      "Estudios de laboratorio y radiografías al 50%"
    ],
    cobertura_urgencias: "100% Cubierto",
    cobertura_consultas: "Ilimitadas",
    cobertura_cirugias: "40% OFF",
    cobertura_vacunas: "100% bonificadas"
  },
  {
    id: "plan-senior",
    codigo: "PLAN-SENIOR",
    nombre: "Plan Senior (+7 Años)",
    subtitulo: "Diagnóstico precoz y geriatría preventiva",
    descripcion: "Tratamiento de patologías crónicas y chequeos geriátricos profundos.",
    precio_mensual: 28900,
    moneda: "ARS",
    beneficios: [
      "Chequeos geriátricos semestrales (perfil renal/hepático)",
      "Ecografías abdominales y electrocardiogramas bonificados",
      "Soporte nutricional y medicación crónica con 30% off"
    ],
    cobertura_urgencias: "100% Cubierto",
    cobertura_consultas: "Ilimitadas",
    cobertura_cirugias: "50% OFF",
    cobertura_vacunas: "100% bonificadas"
  }
];

export const mockBotMensajes: BotMensajeItem[] = [
  {
    id: "bot-1",
    titulo: "Vacunación Giardia",
    paciente_nombre: "Thor",
    especie_raza: "Golden Retriever",
    tutor_nombre: "Carlos Méndez",
    estado_badge: "Programado",
    estado_tipo: "programado",
    meta_tiempo: "Mañana 09:00 hs por WhatsApp Business",
    icono_categoria: "vaccines",
    preview_texto: "¡Hola Carlos! 🐾 Recordá que a Thor le corresponde el refuerzo de su vacuna contra Giardia. Hacé clic para agendar turno directo...",
    categoria_filtro: "vacunacion"
  },
  {
    id: "bot-2",
    titulo: "Seguimiento 48h Castración",
    paciente_nombre: "Lucas",
    especie_raza: "Felino DSH",
    tutor_nombre: "María Elena",
    estado_badge: "Enviado 10:30 hs",
    estado_tipo: "enviado",
    meta_tiempo: "Ficha clínica actualizada",
    icono_categoria: "medical_services",
    ai_analisis: {
      tipo: "Respuesta Analizada por IA",
      badge: "Evolución Favorable",
      texto_respuesta: "Está comiendo bien y sin dolor 👍 Ya jugó un ratito con su juguete."
    },
    categoria_filtro: "posquirurgico"
  },
  {
    id: "bot-3",
    titulo: "Recordatorio Cita 24h",
    paciente_nombre: "Mimi",
    especie_raza: "Caniche Toy",
    tutor_nombre: "Sofía Lara",
    estado_badge: "Confirmada",
    estado_tipo: "confirmada",
    meta_tiempo: "Turno mañana a las 16:30 hs",
    icono_categoria: "event_upcoming",
    preview_texto: "Hola Sofía, recordá que mañana a las 16:30 hs tenés turno para Mimi en Box 02.",
    categoria_filtro: "turnos"
  },
  {
    id: "bot-4",
    titulo: "Antiparasitario Trimestral",
    paciente_nombre: "Campaña Preventiva Estacional",
    especie_raza: "18 envíos programados",
    tutor_nombre: "Pacientes con dosis vencida esta semana",
    estado_badge: "Lote Automático",
    estado_tipo: "lote",
    meta_tiempo: "Programación en cola",
    icono_categoria: "pest_control",
    total_lote: 18,
    lote_desc: "Pacientes con dosis vencida esta semana",
    categoria_filtro: "desparasitacion"
  }
];

