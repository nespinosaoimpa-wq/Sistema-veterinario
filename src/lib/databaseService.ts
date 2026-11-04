import { supabase } from './supabase';
import { UsuarioSesion, Clinica, TurnoAgenda, PlanSalud } from '../types';

const SESSION_KEY = 'vetcare_user_session';

export const databaseService = {
  // -------------------------------------------------------------
  // GESTIÓN DE SESIÓN LOCAL
  // -------------------------------------------------------------
  getLocalSession(): UsuarioSesion | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveLocalSession(sesion: UsuarioSesion): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  },

  clearLocalSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  // -------------------------------------------------------------
  // REGISTRO DE CLÍNICA B2B & VETERINARIO (DESDE CERO)
  // -------------------------------------------------------------
  async registrarClinica(params: {
    nombre_fantasia: string;
    cuit: string;
    direccion: string;
    email: string;
    cuota_socio: number;
    admin_nombre: string;
    admin_apellido: string;
    admin_matricula: string;
    admin_email: string;
    box_actual: string;
    turno_actual: string;
  }): Promise<{ sesion: UsuarioSesion; error?: string }> {
    try {
      const slug = params.nombre_fantasia
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 1. Insertar Clínica
      const { data: clinicaData, error: clinicaError } = await supabase
        .from('clinicas')
        .insert({
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          nombre_fantasia: params.nombre_fantasia,
          cuit: params.cuit,
          direccion: params.direccion,
          email_contacto: params.email,
          cuota_socio_defecto: params.cuota_socio || 10000,
        })
        .select()
        .single();

      if (clinicaError) {
        console.error('Error creando clínica:', clinicaError);
        return { sesion: null as any, error: clinicaError.message };
      }

      // 2. Insertar Veterinario Responsable
      const { data: vetData, error: vetError } = await supabase
        .from('veterinarios')
        .insert({
          clinica_id: clinicaData.id,
          nombre: params.admin_nombre,
          apellido: params.admin_apellido,
          email: params.admin_email,
          matricula_provincial: params.admin_matricula || 'MP 10.492',
          especialidad: 'Clínica Médica & Urgencias',
        })
        .select()
        .single();

      if (vetError) {
        console.error('Error creando veterinario:', vetError);
        return { sesion: null as any, error: vetError.message };
      }

      // 3. Crear Plan de Socios de $10.000 para esta clínica
      await supabase.from('planes_salud').insert({
        clinica_id: clinicaData.id,
        codigo: `PLAN-10K-${slug.toUpperCase()}`,
        nombre: 'Plan Socio Particular',
        subtitulo: 'Cuota mensual comunitaria de urgencias y vacunas',
        descripcion: 'Cuota de $10.000/mes para cubrir 100% de urgencias 24/7 y vacunas anuales sin gastos imprevistos.',
        precio_mensual: params.cuota_socio || 10000,
        moneda: 'ARS',
        es_destacado: true,
        cobertura_urgencias_pct: 100,
        cobertura_consultas_pct: 100,
        cobertura_cirugias_pct: 50,
        cobertura_vacunas_pct: 100,
      });

      const nuevaSesion: UsuarioSesion = {
        id: vetData.id,
        nombre: vetData.nombre,
        apellido: vetData.apellido,
        email: vetData.email,
        rol: 'veterinario',
        matricula_provincial: vetData.matricula_provincial,
        box_actual: params.box_actual || 'Box 01',
        turno_actual: params.turno_actual || 'Turno Mañana (08:00 - 14:00)',
        clinica: {
          id: clinicaData.id,
          slug: clinicaData.slug,
          nombre_fantasia: clinicaData.nombre_fantasia,
          cuit: clinicaData.cuit,
          email_contacto: clinicaData.email_contacto,
          direccion: clinicaData.direccion,
          cuota_socio_defecto: clinicaData.cuota_socio_defecto,
        },
      };

      this.saveLocalSession(nuevaSesion);
      return { sesion: nuevaSesion };
    } catch (err: any) {
      return { sesion: null as any, error: err.message || 'Error inesperado al registrar' };
    }
  },

  // -------------------------------------------------------------
  // INICIAR SESIÓN CON VETERINARIO EXISTENTE
  // -------------------------------------------------------------
  async login(params: {
    email: string;
    box_actual: string;
    turno_actual: string;
  }): Promise<{ sesion?: UsuarioSesion; error?: string }> {
    try {
      const { data: vets, error: vetError } = await supabase
        .from('veterinarios')
        .select('*, clinica:clinicas(*)')
        .eq('email', params.email.trim().toLowerCase());

      if (vetError) {
        return { error: `Error en base de datos: ${vetError.message}` };
      }

      if (!vets || vets.length === 0) {
        return { error: 'No se encontró ningún profesional registrado con ese correo electrónico.' };
      }

      const vet = vets[0];
      const clinica = vet.clinica;

      const sesion: UsuarioSesion = {
        id: vet.id,
        nombre: vet.nombre,
        apellido: vet.apellido,
        email: vet.email,
        rol: 'veterinario',
        matricula_provincial: vet.matricula_provincial,
        box_actual: params.box_actual || 'Box 01',
        turno_actual: params.turno_actual || 'Turno Mañana',
        avatar_url: vet.avatar_url,
        clinica: {
          id: clinica?.id || vet.clinica_id,
          slug: clinica?.slug || 'clinica-activa',
          nombre_fantasia: clinica?.nombre_fantasia || 'Clínica Veterinaria',
          cuit: clinica?.cuit || '30-00000000-0',
          email_contacto: clinica?.email_contacto || vet.email,
          direccion: clinica?.direccion || 'Sede Central',
          cuota_socio_defecto: clinica?.cuota_socio_defecto || 10000,
        },
      };

      this.saveLocalSession(sesion);
      return { sesion };
    } catch (err: any) {
      return { error: err.message || 'Error en inicio de sesión' };
    }
  },

  // -------------------------------------------------------------
  // PACIENTES (DESDE SUPABASE)
  // -------------------------------------------------------------
  async getPacientes(clinicaId?: string) {
    try {
      let query = supabase
        .from('pacientes')
        .select('*, tutor:tutores(*), suscripciones:suscripciones_socios(*, plan:planes_salud(*))')
        .order('created_at', { ascending: false });

      if (clinicaId) {
        query = query.eq('clinica_id', clinicaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  },

  async crearPaciente(params: {
    clinica_id?: string;
    nombre: string;
    especie: string;
    raza: string;
    sexo: 'macho' | 'hembra';
    peso_actual: number;
    microchip_id?: string;
    tutor_nombre: string;
    tutor_dni: string;
    tutor_telefono: string;
    tutor_direccion: string;
    afiliar_plan_10k?: boolean;
  }) {
    try {
      // 1. Crear o buscar tutor por DNI
      let tutorId: string;
      const { data: existingTutores } = await supabase
        .from('tutores')
        .select('id')
        .eq('dni', params.tutor_dni.trim())
        .limit(1);

      if (existingTutores && existingTutores.length > 0) {
        tutorId = existingTutores[0].id;
      } else {
        const { data: newTutor, error: tutorError } = await supabase
          .from('tutores')
          .insert({
            clinica_id: params.clinica_id,
            nombre_completo: params.tutor_nombre,
            dni: params.tutor_dni,
            telefono: params.tutor_telefono,
            direccion: params.tutor_direccion,
          })
          .select()
          .single();

        if (tutorError) throw tutorError;
        tutorId = newTutor.id;
      }

      // 2. Crear Paciente
      const { data: newPaciente, error: pacError } = await supabase
        .from('pacientes')
        .insert({
          clinica_id: params.clinica_id,
          tutor_id: tutorId,
          nombre: params.nombre,
          especie: params.especie,
          raza: params.raza,
          sexo: params.sexo,
          peso_actual: params.peso_actual,
          microchip_id: params.microchip_id || `AR-${Math.floor(10000 + Math.random() * 90000)}`,
        })
        .select()
        .single();

      if (pacError) throw pacError;

      // 3. Afiliar al plan de $10.000 si está seleccionado
      if (params.afiliar_plan_10k) {
        const { data: plan10k } = await supabase
          .from('planes_salud')
          .select('id')
          .eq('precio_mensual', 10000)
          .limit(1)
          .single();

        if (plan10k) {
          await supabase.from('suscripciones_socios').insert({
            clinica_id: params.clinica_id,
            paciente_id: newPaciente.id,
            tutor_id: tutorId,
            plan_id: plan10k.id,
            numero_socio: `VET-${Math.floor(100000 + Math.random() * 900000)}`,
            cuota_mensual_ars: 10000,
            estado: 'activo',
          });
        }
      }

      return { data: newPaciente, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  // -------------------------------------------------------------
  // TURNOS & AGENDA (DESDE SUPABASE)
  // -------------------------------------------------------------
  async getTurnos(clinicaId?: string, fecha?: string) {
    try {
      let query = supabase
        .from('turnos')
        .select('*, paciente:pacientes(*, tutor:tutores(*)), veterinario:veterinarios(*)')
        .order('hora_inicio', { ascending: true });

      if (clinicaId) {
        query = query.eq('clinica_id', clinicaId);
      }
      if (fecha) {
        query = query.eq('fecha', fecha);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  },

  async crearTurno(params: {
    clinica_id?: string;
    paciente_id: string;
    veterinario_id?: string;
    fecha: string;
    hora_inicio: string;
    box_sala: string;
    motivo_consulta: string;
    es_urgencia?: boolean;
  }) {
    try {
      const { data, error } = await supabase
        .from('turnos')
        .insert({
          clinica_id: params.clinica_id,
          paciente_id: params.paciente_id,
          veterinario_id: params.veterinario_id,
          fecha: params.fecha,
          hora_inicio: params.hora_inicio,
          box_sala: params.box_sala,
          motivo_consulta: params.motivo_consulta,
          es_urgencia: params.es_urgencia || false,
          estado: params.es_urgencia ? 'urgencia' : 'confirmado',
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  },

  // -------------------------------------------------------------
  // PLANES DE SOCIOS (DESDE SUPABASE)
  // -------------------------------------------------------------
  async getPlanes(clinicaId?: string) {
    try {
      let query = supabase
        .from('planes_salud')
        .select('*')
        .eq('activo', true)
        .order('precio_mensual', { ascending: true });

      if (clinicaId) {
        query = query.or(`clinica_id.eq.${clinicaId},clinica_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  },

  async getSuscripciones(clinicaId?: string) {
    try {
      let query = supabase
        .from('suscripciones_socios')
        .select('*, paciente:pacientes(*), tutor:tutores(*), plan:planes_salud(*)')
        .order('created_at', { ascending: false });

      if (clinicaId) {
        query = query.eq('clinica_id', clinicaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
  },
};

