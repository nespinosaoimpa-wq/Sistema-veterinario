-- ============================================================================
-- VETCARE PRO - SEED DATA INICIAL
-- Carga de datos base congruente con el diseño y el sistema de socios
-- ============================================================================

-- 1. Planes de Salud y Socios Particulares
INSERT INTO public.planes_salud (id, codigo, nombre, subtitulo, descripcion, precio_mensual, es_destacado, cobertura_urgencias_pct, cobertura_consultas_pct, cobertura_cirugias_pct, cobertura_vacunas_pct, limpieza_dental_anual_gratis)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'PLAN-SOCIO-COMUNIDAD',
    'Plan Socio Comunidad',
    'Cuota mensual accesible para cobertura de emergencias y calendario de vacunas',
    'Pensado para que cada familia pague una cuota fija de $10.000 al mes y no afronte gastos imprevistos de golpe ante urgencias críticas o vacunaciones.',
    10000.00,
    TRUE,
    100, -- 100% urgencias
    100, -- Consultas básicas
    50,  -- 50% cirugías
    100, -- 100% vacunas obligatorias
    FALSE
),
(
    'a2222222-2222-2222-2222-222222222222',
    'PLAN-ESENCIAL',
    'Plan Esencial',
    'Protección básica y medicina preventiva',
    'Consultas clínicas generales al 100% bonificadas (hasta 6 al año), vacunación y 15% descuento en farmacia.',
    12900.00,
    FALSE,
    50,
    100,
    20,
    100,
    FALSE
),
(
    'a3333333-3333-3333-3333-333333333333',
    'PLAN-PLATINUM',
    'PetCare Platinum',
    'Máxima tranquilidad para cachorros y adultos (VIP Care)',
    'Consultas ilimitadas + Urgencias 24/7 sin copago, 40% en cirugías e internación, profilaxis dental anual gratis y 50% en estudios.',
    24500.00,
    TRUE,
    100,
    100,
    40,
    100,
    TRUE
),
(
    'a4444444-4444-4444-4444-444444444444',
    'PLAN-SENIOR',
    'Plan Senior (+7 Años)',
    'Diagnóstico precoz y geriatría preventiva',
    'Chequeos geriátricos semestrales (perfil renal/hepático), ecografías bonificadas y 30% off en medicación crónica.',
    28900.00,
    FALSE,
    100,
    100,
    50,
    100,
    TRUE
)
ON CONFLICT (codigo) DO NOTHING;

-- 2. Veterinarios
INSERT INTO public.veterinarios (id, nombre, apellido, email, telefono, matricula_provincial, colegio_jurisdiccion, especialidad, avatar_url)
VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'Valeria',
    'Gómez',
    'valeria.gomez@vetcarepro.com',
    '+54 9 11 4829-1100',
    'MP 10.492',
    'Colegio de Médicos Veterinarios CABA / PBA',
    'Clínica Médica & Urgencias',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3QXudc9qfIv8DaxZy4ToV1UJMSy_PgLRz12B8VqQaWrrmfPlQ5EoWbTYngTvMx03BVfcL0yc2yRretLB_XH-sFPnlfEvLTfbFmWV6VxC8g_zSpNrMZq8WRXyvKrd2rhpKBczPCNcafzSa7sE2V6sNNQlAqXx5rgbz7QE3fUZrepqne5mVbJcZTe1cx_gDe_Aih3MZWgVfofskMw9g25xkoWv2WrxEX9REbcHH_FQ'
)
ON CONFLICT (email) DO NOTHING;

-- 3. Tutores
INSERT INTO public.tutores (id, nombre_completo, dni, email, telefono, direccion, ciudad, avatar_url)
VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'Carlos Méndez',
    '32.849.201',
    'carlos.mendez@gmail.com',
    '+54 9 11 4829-1122',
    'Av. Libertador 2420, CABA',
    'CABA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBco4TFUWv85KuidPXoqRgc65JoKwWjDj-tPUWNpvnb_-VR5l0tnkqgnW0tAS0sqR-Kxu3RFeukY-_okryyYAn106vv08og5gEBAoI60BHejnFWvlEnbshFwOkXFG1Jx7IyWeMkzJ4bfSETRUL15MLmwDE0tmWBf4U5QmvTNFfHUFna7ytTG4SLUkl93S3z7v2MQ18LDos96A9e5UBIp_cjwDJGvQk-4du0KfowvPdf'
),
(
    'c2222222-2222-2222-2222-222222222222',
    'Sofía Lara',
    '38.910.450',
    'sofia.lara@outlook.com',
    '+54 9 11 5120-3344',
    'Juramento 1850, Belgrano, CABA',
    'CABA',
    NULL
)
ON CONFLICT (dni) DO NOTHING;

-- 4. Pacientes
INSERT INTO public.pacientes (id, tutor_id, nombre, especie, raza, sexo, fecha_nacimiento, peso_actual, tendencia_peso, grupo_sanguineo, microchip_id, foto_url)
VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Thor',
    'Canino',
    'Golden Retriever',
    'macho',
    '2022-08-15',
    32.40,
    'sube',
    'DEA 1.1 Positivo',
    '9810-AR-94812',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCCRB4Dhl2-TO5RjbWS5P8cNI7KhjxSRkyNBF4tg7SxUcxZRbotP-XRJWS_cCGL61nWiLBjFQfJftNXEk6udHlTb67EQ2uU08ZRjidCgBWtjXKrzpRV_CwfquaNxDHptesiEFkaLBferVGf1dLoyo68chnGK-tHXZ3mI61Ic5VaxREINpIjwgCFqT4QxMNeDUX6wBztdHTIPtEMA8AzD6fEhJtZZaRUYuUoArPC8j2C'
),
(
    'd2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Mimi',
    'Felino',
    'Siamés',
    'hembra',
    '2024-06-10',
    3.80,
    'estable',
    'Tipo A',
    '9820-AR-44102',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCj3HyO4wp053VMcbdOEL9bliMIpkZEKOCWtxK3bCH-r6Sh0hKJnFc5J1aWkDfZyB76TPy5tjiF5SpkmbgAZf6x2vSxmnKOVV6Eig72t2YP2-2o0lygpXJAs2pF-_RoffDbj5HxaSueUrbEqaWlpPFamLqTQXX8rBrH9QLrjNTxMaslUHI-xikangYts3hakvDKg5q_aUAznMWHxYvYPJv1IfJsXbI2LkCLaxnOQchO'
)
ON CONFLICT (microchip_id) DO NOTHING;

-- 5. Suscripción Activa de Thor
INSERT INTO public.suscripciones_socios (id, paciente_id, plan_id, tutor_id, numero_carnet_digital, codigo_qr_token, estado, precio_acordado, ahorro_acumulado_estimado)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'a3333333-3333-3333-3333-333333333333', -- Platinum
    'c1111111-1111-1111-1111-111111111111',
    'VC-THOR-9810-PLAT',
    'VC_SECURE_QR_9810_THOR_PLATINUM_TOKEN_2026',
    'activo',
    24500.00,
    58200.00
)
ON CONFLICT (numero_carnet_digital) DO NOTHING;

-- 6. Turnos de la Agenda
INSERT INTO public.turnos (paciente_id, veterinario_id, fecha, hora_inicio, duracion_minutos, box_sala, motivo_consulta, estado)
VALUES
('d1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', CURRENT_DATE, '09:00', 45, 'Box 1', 'Control cardiológico semestral', 'en_espera'),
('d2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', CURRENT_DATE, '10:15', 30, 'Box 2', 'Vacunación Anual (Triple Felina)', 'confirmado');

-- 7. Triaje de Urgencia en Espera
INSERT INTO public.triajes_urgencia (paciente_id, nivel, sintoma_principal, sala_asignada, spo2_porcentaje, temperatura_celsius)
VALUES
('d1111111-1111-1111-1111-111111111111', 'critico_rojo', 'Dificultad respiratoria aguda', 'Sala 2 / Urgencias', 89, 39.4);

