// Tipos de dominio para VetCare Pro (SaaS B2B Multi-tenant)

export type TabModulo = 'agenda' | 'pacientes' | 'bot-y-alertas' | 'planes-salud';
export type RolUsuario = 'veterinario' | 'recepcionista' | 'administrador';

export interface Clinica {
  id: string;
  slug: string;
  nombre_fantasia: string;
  razon_social?: string;
  cuit: string;
  email_contacto: string;
  telefono?: string;
  direccion: string;
  cuota_socio_defecto: number;
}

export interface UsuarioSesion {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  matricula_provincial?: string;
  box_actual: string;
  turno_actual: string;
  clinica: Clinica;
  avatar_url?: string;
}

export interface Veterinario {
  id: string;
  clinica_id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  matricula_provincial: string;
  colegio_jurisdiccion: string;
  especialidad: string;
  avatar_url?: string;
}

export interface Tutor {
  id: string;
  clinica_id?: string;
  nombre_completo: string;
  dni: string;
  email?: string;
  telefono: string;
  direccion: string;
  avatar_url?: string;
}

export interface Paciente {
  id: string;
  clinica_id?: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: 'macho' | 'hembra';
  edad_texto?: string;
  peso_actual: number;
  tendencia_peso?: 'sube' | 'baja' | 'estable';
  grupo_sanguineo: string;
  microchip_id: string;
  foto_url: string;
  tutor: Tutor;
  plan_salud?: string;
  activo: boolean;
}

export interface TurnoAgenda {
  id: string;
  hora: string;
  duracion: string;
  paciente: {
    id: string;
    nombre: string;
    especie_raza: string;
    sexo: 'male' | 'female';
    foto_url: string;
    tutor_nombre: string;
    plan_nombre: string;
  };
  motivo: string;
  icono_motivo: string;
  sede_o_info: string;
  badge_extra?: string;
  estado: 'all' | 'confirmed' | 'waiting' | 'urgent' | 'pending';
  estado_label: string;
  tipo_accion: 'llamar' | 'preparar' | 'placas' | 'recordatorio';
}

export interface TriajeUrgencia {
  id: string;
  paciente_nombre: string;
  especie_raza: string;
  sintoma: string;
  sala: string;
  spo2: number;
  temperatura: number;
  foto_url: string;
  tiempo_espera: string;
  atendido: boolean;
}

export interface PlanSalud {
  id: string;
  codigo: string;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  precio_mensual: number;
  moneda: string;
  es_destacado?: boolean;
  es_plan_socio_10k?: boolean;
  beneficios: string[];
  cobertura_urgencias: string;
  cobertura_consultas: string;
  cobertura_cirugias: string;
  cobertura_vacunas: string;
}

export interface SuscripcionActiva {
  paciente_id: string;
  plan_nombre: string;
  categoria: string;
  cuota_mensual: number;
  proxima_facturacion: string;
  numero_carnet: string;
  ahorro_acumulado: number;
  consumos: {
    prestacion: string;
    cobertura_label: string;
    detalle: string;
    uso_label: string;
    porcentaje_uso: number;
    alerta_siguiente?: string;
    permite_reserva?: boolean;
  }[];
}

export interface BotMensajeItem {
  id: string;
  titulo: string;
  paciente_nombre: string;
  especie_raza: string;
  tutor_nombre: string;
  estado_badge: string;
  estado_tipo: 'programado' | 'enviado' | 'confirmada' | 'lote';
  meta_tiempo: string;
  icono_categoria: string;
  preview_texto?: string;
  ai_analisis?: {
    tipo: string;
    badge: string;
    texto_respuesta: string;
  };
  total_lote?: number;
  lote_desc?: string;
  categoria_filtro: 'vacunacion' | 'posquirurgico' | 'desparasitacion' | 'turnos';
}
