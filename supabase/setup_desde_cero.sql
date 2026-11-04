-- ============================================================================
-- VETCARE PRO - SETUP COMPLETO DESDE CERO (SIN DATOS FALSOS)
-- Ejecutá este script en el SQL Editor de tu proyecto Supabase (dcvalcycbpfdmkctelka)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TIPOS Y ENUMS
DO $$ BEGIN
    CREATE TYPE rol_usuario AS ENUM ('veterinario', 'recepcionista', 'administrador', 'tutor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE estado_turno AS ENUM ('pendiente', 'confirmado', 'en_espera', 'en_atencion', 'atendido', 'cancelado', 'urgencia');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE estado_suscripcion AS ENUM ('activo', 'mora', 'pausado', 'cancelado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE nivel_triaje AS ENUM ('critico_rojo', 'urgente_naranja', 'moderado_amarillo', 'estandar_verde');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLA: CLÍNICAS VETERINARIAS (TENANTS B2B)
CREATE TABLE IF NOT EXISTS public.clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(80) UNIQUE NOT NULL,
    nombre_fantasia VARCHAR(160) NOT NULL,
    razon_social VARCHAR(180),
    cuit VARCHAR(20) NOT NULL,
    email_contacto VARCHAR(160) NOT NULL,
    telefono VARCHAR(30),
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'CABA',
    logo_url TEXT,
    cuota_socio_defecto NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: VETERINARIOS Y PERSONAL
CREATE TABLE IF NOT EXISTS public.veterinarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    user_id UUID,
    nombre VARCHAR(120) NOT NULL,
    apellido VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    telefono VARCHAR(30),
    matricula_provincial VARCHAR(50) NOT NULL,
    colegio_jurisdiccion VARCHAR(120) NOT NULL DEFAULT 'Colegio de Veterinarios',
    especialidad VARCHAR(100) DEFAULT 'Clínica Médica General',
    avatar_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: TUTORES / RESPONSABLES LEGALES
CREATE TABLE IF NOT EXISTS public.tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(200) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    email VARCHAR(160),
    telefono VARCHAR(30) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'CABA',
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: PACIENTES / MASCOTAS
CREATE TABLE IF NOT EXISTS public.pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES public.tutores(id) ON DELETE CASCADE,
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

-- 6. TABLA: PLANES DE SALUD
CREATE TABLE IF NOT EXISTS public.planes_salud (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    subtitulo VARCHAR(200),
    descripcion TEXT NOT NULL,
    precio_mensual NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    moneda VARCHAR(10) DEFAULT 'ARS',
    es_destacado BOOLEAN DEFAULT FALSE,
    cobertura_urgencias_pct INT DEFAULT 100,
    cobertura_consultas_pct INT DEFAULT 100,
    cobertura_cirugias_pct INT DEFAULT 50,
    cobertura_vacunas_pct INT DEFAULT 100,
    limpieza_dental_anual_gratis BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: SUSCRIPCIONES DE SOCIOS
CREATE TABLE IF NOT EXISTS public.suscripciones_socios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES public.tutores(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.planes_salud(id) ON DELETE RESTRICT,
    numero_socio VARCHAR(40) UNIQUE NOT NULL,
    estado estado_suscripcion DEFAULT 'activo',
    fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE,
    cuota_mensual_ars NUMERIC(10, 2) NOT NULL DEFAULT 10000.00,
    metodo_pago VARCHAR(50) DEFAULT 'debito_automatico',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: TURNOS
CREATE TABLE IF NOT EXISTS public.turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_inicio TIME NOT NULL,
    duracion_minutos INT DEFAULT 30,
    box_sala VARCHAR(50) DEFAULT 'Box 01',
    motivo_consulta VARCHAR(200) NOT NULL,
    estado estado_turno DEFAULT 'pendiente',
    es_urgencia BOOLEAN DEFAULT FALSE,
    llamado_a_box TIMESTAMPTZ,
    notas_recepcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA: TRIAJE DE URGENCIAS
CREATE TABLE IF NOT EXISTS public.triajes_urgencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    turno_id UUID REFERENCES public.turnos(id),
    nivel nivel_triaje DEFAULT 'critico_rojo',
    sintoma_principal VARCHAR(200) NOT NULL,
    sala_asignada VARCHAR(50) DEFAULT 'Sala 1 / Shock Room',
    spo2_porcentaje INT,
    temperatura_celsius NUMERIC(4, 1),
    frecuencia_cardiaca_lpm INT,
    frecuencia_respiratoria_rpm INT,
    llegada_tiempo TIMESTAMPTZ DEFAULT NOW(),
    atendido_tiempo TIMESTAMPTZ,
    resuelto BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLA: HISTORIAL CLÍNICO
CREATE TABLE IF NOT EXISTS public.historias_clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES public.clinicas(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
    veterinario_id UUID REFERENCES public.veterinarios(id) ON DELETE SET NULL,
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
    matricula_veterinario_firmante VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABLA: VACUNACIONES
CREATE TABLE IF NOT EXISTS public.vacunaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
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

-- ============================================================================
-- HABILITAR PERMISOS PÚBLICOS (RLS POLICIES PARA FRONTEND WEB)
-- Permite que la app web (usando la clave anon) lea y escriba datos sin restricciones de bloqueo.
-- ============================================================================

ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_clinicas" ON public.clinicas;
CREATE POLICY "public_access_clinicas" ON public.clinicas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.veterinarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_veterinarios" ON public.veterinarios;
CREATE POLICY "public_access_veterinarios" ON public.veterinarios FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_tutores" ON public.tutores;
CREATE POLICY "public_access_tutores" ON public.tutores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_pacientes" ON public.pacientes;
CREATE POLICY "public_access_pacientes" ON public.pacientes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.planes_salud ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_planes" ON public.planes_salud;
CREATE POLICY "public_access_planes" ON public.planes_salud FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.suscripciones_socios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_suscripciones" ON public.suscripciones_socios;
CREATE POLICY "public_access_suscripciones" ON public.suscripciones_socios FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_turnos" ON public.turnos;
CREATE POLICY "public_access_turnos" ON public.turnos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.triajes_urgencia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_triajes" ON public.triajes_urgencia;
CREATE POLICY "public_access_triajes" ON public.triajes_urgencia FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.historias_clinicas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_historias" ON public.historias_clinicas;
CREATE POLICY "public_access_historias" ON public.historias_clinicas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.vacunaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_access_vacunaciones" ON public.vacunaciones;
CREATE POLICY "public_access_vacunaciones" ON public.vacunaciones FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- LIMPIEZA TOTAL: DEJAR LA BASE DE DATOS LIMPIA (SIN INFORMACIÓN FALSA)
-- ============================================================================

TRUNCATE TABLE 
    public.historias_clinicas, 
    public.vacunaciones, 
    public.triajes_urgencia, 
    public.turnos, 
    public.suscripciones_socios, 
    public.pacientes, 
    public.tutores, 
    public.veterinarios, 
    public.clinicas,
    public.planes_salud 
CASCADE;

-- Plan de Socios de referencia ($10.000/mes) para que el catálogo de planes no esté vacío:
INSERT INTO public.planes_salud (
    codigo, nombre, subtitulo, descripcion, precio_mensual, moneda, es_destacado, 
    cobertura_urgencias_pct, cobertura_consultas_pct, cobertura_cirugias_pct, cobertura_vacunas_pct
) VALUES (
    'PLAN-SOCIO-10K', 
    'Plan Socio Particular', 
    'Cuota comunitaria mensual para urgencias y vacunación', 
    'Cuota mensual accesible de $10.000 para que las familias cuenten con 100% de cobertura en urgencias y vacunas anuales sin desembolsos imprevistos.', 
    10000.00, 
    'ARS', 
    true, 
    100, 100, 50, 100
);
