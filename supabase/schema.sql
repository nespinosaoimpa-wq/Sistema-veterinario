-- ============================================================================
-- VETCARE PRO - SISTEMA INTEGRAL DE GESTIÓN VETERINARIA (SAAS B2B MULTI-TENANT)
-- DATABASE SCHEMA PARA SUPABASE (POSTGRESQL 15+)
-- Incluye: Módulos de Agenda, Ficha Médica, Bot Automatizado, Triaje,
-- Sistema de Planes de Socios Particulares ($10.000/mes) y Soporte Multi-Clínica
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TIPOS Y ENUMS DEL SISTEMA
-- ----------------------------------------------------------------------------
CREATE TYPE rol_usuario AS ENUM ('veterinario', 'recepcionista', 'administrador', 'tutor');
CREATE TYPE estado_turno AS ENUM ('pendiente', 'confirmado', 'en_espera', 'en_atencion', 'atendido', 'cancelado', 'urgencia');
CREATE TYPE estado_suscripcion AS ENUM ('activo', 'mora', 'pausado', 'cancelado');
CREATE TYPE nivel_triaje AS ENUM ('critico_rojo', 'urgente_naranja', 'moderado_amarillo', 'estandar_verde');
CREATE TYPE canal_despacho AS ENUM ('whatsapp', 'sms', 'email');
CREATE TYPE estado_mensaje_bot AS ENUM ('programado', 'enviado', 'entregado', 'leido', 'respondido', 'fallido');

-- ----------------------------------------------------------------------------
-- 2. TABLA: CLÍNICAS VETERINARIAS (TENANTS B2B)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(80) UNIQUE NOT NULL, -- ej: 'vetcare-central', 'san-isidro'
    nombre_fantasia VARCHAR(160) NOT NULL,
    razon_social VARCHAR(180),
    cuit VARCHAR(20) NOT NULL,
    email_contacto VARCHAR(160) NOT NULL,
    telefono VARCHAR(30),
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'CABA',
    logo_url TEXT,
    cuota_socio_defecto NUMERIC(10, 2) NOT NULL DEFAULT 10000.00, -- Cuota comunitaria $10.000/mes
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TABLA: VETERINARIOS Y PERSONAL (Ley 14.072)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.veterinarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre VARCHAR(120) NOT NULL,
    apellido VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    telefono VARCHAR(30),
    matricula_provincial VARCHAR(50) NOT NULL, -- Obligación legal según Ley 14.072
    colegio_jurisdiccion VARCHAR(120) NOT NULL DEFAULT 'Colegio de Veterinarios de la Provincia',
    especialidad VARCHAR(100) DEFAULT 'Clínica Médica General',
    avatar_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: TUTORES / RESPONSABLES LEGALES (Ley 24.240 y Ley 25.326)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    email VARCHAR(160),
    telefono VARCHAR(30) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'CABA',
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,
    notas_contacto TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tutor_dni_clinica UNIQUE (dni, clinica_id)
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: PACIENTES / MASCOTAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES public.tutores(id) ON DELETE CASCADE,
    nombre VARCHAR(80) NOT NULL,
    especie VARCHAR(50) NOT NULL DEFAULT 'Canino',
    raza VARCHAR(80) NOT NULL,
    sexo VARCHAR(10) CHECK (sexo IN ('macho', 'hembra')),
    fecha_nacimiento DATE,
    peso_actual NUMERIC(5, 2) NOT NULL,
    tendencia_peso VARCHAR(20) DEFAULT 'estable',
    grupo_sanguineo VARCHAR(30) DEFAULT 'No determinado',
    microchip_id VARCHAR(50),
    foto_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    esterilizado BOOLEAN DEFAULT FALSE,
    alergias_contraindicaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: PLANES DE SALUD Y SOCIOS PARTICULARES
-- Cuota comunitaria mensual ($10.000/mes) para cobertura de emergencias y vacunas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.planes_salud (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    codigo VARCHAR(40) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    subtitulo VARCHAR(200),
    descripcion TEXT,
    precio_mensual NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    moneda VARCHAR(5) DEFAULT 'ARS',
    es_destacado BOOLEAN DEFAULT FALSE,
    cobertura_urgencias_pct INT DEFAULT 100,
    cobertura_consultas_pct INT DEFAULT 100,
    cobertura_cirugias_pct INT DEFAULT 50,
    cobertura_vacunas_pct INT DEFAULT 100,
    limpieza_dental_anual_gratis BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_plan_codigo_clinica UNIQUE (codigo, clinica_id)
);

-- ----------------------------------------------------------------------------
-- 7. TABLA: SUSCRIPCIONES DE SOCIOS / MEMBRESÍAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.suscripciones_socios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.planes_salud(id),
    tutor_id UUID NOT NULL REFERENCES public.tutores(id),
    numero_carnet_digital VARCHAR(60) UNIQUE NOT NULL,
    codigo_qr_token VARCHAR(120) UNIQUE NOT NULL,
    estado estado_suscripcion DEFAULT 'activo',
    precio_acordado NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    fecha_alta DATE DEFAULT CURRENT_DATE,
    proxima_facturacion DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month')::DATE,
    metodo_pago VARCHAR(50) DEFAULT 'Debito Automatico',
    ahorro_acumulado_estimado NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. TABLA: CONSUMOS Y PRESTACIONES USADAS POR EL SOCIO
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consumos_prestaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suscripcion_id UUID NOT NULL REFERENCES public.suscripciones_socios(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
    tipo_prestacion VARCHAR(100) NOT NULL,
    fecha_consumo DATE DEFAULT CURRENT_DATE,
    monto_original NUMERIC(10, 2) NOT NULL,
    monto_bonificado NUMERIC(10, 2) NOT NULL,
    monto_abonado_copago NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    veterinario_id UUID REFERENCES public.veterinarios(id),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. TABLA: AGENDA Y TURNOS DEL DÍA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
    veterinario_id UUID REFERENCES public.veterinarios(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME NOT NULL,
    duracion_minutos INT DEFAULT 30,
    box_sala VARCHAR(50) DEFAULT 'Box 1',
    motivo_consulta VARCHAR(200) NOT NULL,
    estado estado_turno DEFAULT 'pendiente',
    es_urgencia BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    llamado_a_box TIMESTAMPTZ,
    notas_recepcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. TABLA: TRIAJE DE URGENCIAS EN VIVO (BANNER ROJO CRÍTICO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.triajes_urgencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
    turno_id UUID REFERENCES public.turnos(id),
    nivel nivel_triaje DEFAULT 'critico_rojo',
    sintoma_principal VARCHAR(200) NOT NULL,
    sala_asignada VARCHAR(50) DEFAULT 'Sala 2 / Urgencias',
    spo2_porcentaje INT,
    temperatura_celsius NUMERIC(4, 1),
    frecuencia_cardiaca_lpm INT,
    frecuencia_respiratoria_rpm INT,
    llegada_tiempo TIMESTAMPTZ DEFAULT NOW(),
    atendido_tiempo TIMESTAMPTZ,
    veterinario_atencion_id UUID REFERENCES public.veterinarios(id),
    resuelto BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. TABLA: HISTORIAL CLÍNICO / FICHA MÉDICA (Requisito Legal Ley 14.072)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.historias_clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    veterinario_id UUID NOT NULL REFERENCES public.veterinarios(id),
    fecha_atencion TIMESTAMPTZ DEFAULT NOW(),
    motivo_consulta VARCHAR(200) NOT NULL,
    anamnesis TEXT NOT NULL,
    fc_lpm INT,
    fr_rpm INT,
    temperatura NUMERIC(4, 1),
    peso_kg NUMERIC(5, 2),
    diagnostico_presuntivo TEXT NOT NULL,
    diagnostico_definitivo TEXT,
    tratamiento_indicado TEXT NOT NULL,
    indicaciones_cuidado TEXT,
    receta_digital_pdf_url TEXT,
    matricula_veterinario_firmante VARCHAR(50) NOT NULL,
    sucursal VARCHAR(80) DEFAULT 'Sede Central',
    hash_integridad_sha256 VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. TABLA: HISTORIAL DE VACUNACIÓN (SENASA / Libreta Sanitaria)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vacunaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id),
    nombre_vacuna VARCHAR(100) NOT NULL,
    laboratorio VARCHAR(100),
    numero_lote VARCHAR(80) NOT NULL,
    fecha_aplicacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(30) DEFAULT 'al_dia',
    bonificada_por_plan BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. TABLA: CIRUGÍAS Y PROCEDIMIENTOS (Ley 14.346)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cirugias_procedimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
    veterinario_cirujano_id UUID NOT NULL REFERENCES public.veterinarios(id),
    veterinario_anestesista_id UUID REFERENCES public.veterinarios(id),
    tipo_procedimiento VARCHAR(150) NOT NULL,
    fecha_cirugia DATE NOT NULL DEFAULT CURRENT_DATE,
    protocolo_anestesico TEXT NOT NULL,
    evolucion_postquirurgica TEXT,
    estado_alta VARCHAR(50) DEFAULT 'Sin complicaciones',
    consentimiento_informado_id UUID,
    sede VARCHAR(80) DEFAULT 'Sede Central',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. TABLA: REGLAS Y MENSAJES AUTOMÁTICOS DEL BOT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bot_reglas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    nombre_regla VARCHAR(120) NOT NULL,
    categoria VARCHAR(60) NOT NULL,
    trigger_dias_offset INT NOT NULL DEFAULT 0,
    plantilla_mensaje TEXT NOT NULL,
    canal_preferido canal_despacho DEFAULT 'whatsapp',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bot_mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID NOT NULL REFERENCES public.clinicas(id) ON DELETE CASCADE,
    regla_id UUID REFERENCES public.bot_reglas(id),
    paciente_id UUID NOT NULL REFERENCES public.pacientes(id),
    tutor_id UUID NOT NULL REFERENCES public.tutores(id),
    canal canal_despacho DEFAULT 'whatsapp',
    contenido_mensaje TEXT NOT NULL,
    estado estado_mensaje_bot DEFAULT 'programado',
    programado_para TIMESTAMPTZ NOT NULL,
    enviado_at TIMESTAMPTZ,
    respuesta_tutor TEXT,
    analisis_ia_sentimiento VARCHAR(80),
    ficha_actualizada_auto BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 15. TABLA: LOGS DE AUDITORÍA LEGAL INMUTABLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE SET NULL,
    tabla_afectada VARCHAR(80) NOT NULL,
    registro_id UUID NOT NULL,
    accion VARCHAR(20) NOT NULL,
    usuario_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índices Multi-tenant
CREATE INDEX IF NOT EXISTS idx_clinicas_slug ON public.clinicas(slug);
CREATE INDEX IF NOT EXISTS idx_turnos_clinica ON public.turnos(clinica_id, fecha);
CREATE INDEX IF NOT EXISTS idx_pacientes_clinica ON public.pacientes(clinica_id);
CREATE INDEX IF NOT EXISTS idx_veterinarios_clinica ON public.veterinarios(clinica_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_clinica ON public.suscripciones_socios(clinica_id);
