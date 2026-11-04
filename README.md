# 🐾 VetCare Pro — Sistema Integral de Gestión Veterinaria & Planes de Socios

Plataforma médica veterinaria y de gestión integral de pacientes, turnos con triaje de urgencias en vivo, automatizaciones de mensajería (VetBot) y sistema de **Planes de Socios Particulares** con cuota mensual comunitaria de **$10.000/mes**.

---

## 🚀 Tecnologías Implementadas

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS (Diseño *Clinical Empathy & Care*).
- **Base de Datos & Auth:** Supabase (PostgreSQL 15 con Row Level Security y triggers de auditoría).
- **Hosting & CI/CD:** Vercel (conectado al repositorio GitHub).
- **Mensajería & Notificaciones:** WhatsApp Business API + IA Sentiment Analysis.

---

## 📦 Estructura del Proyecto

```
sistema de mascotas/
├── src/
│   ├── components/         # Header, BottomNav, Toast
│   ├── modules/
│   │   ├── Agenda/         # Turnos, triaje en espera, llamada a box
│   │   ├── Pacientes/      # Ficha médica, vitales, vacunas, cirugías, recetas
│   │   ├── Bot/            # VetBot, canales, IA de seguimiento, métricas
│   │   └── Planes/         # Suscripción activa, carnet QR, Plan Socio $10k
│   ├── data/               # Semilla y mocks de demostración
│   ├── lib/                # Conexión con Supabase
│   ├── types/              # Tipos TypeScript
│   ├── App.tsx             # Orquestador principal
│   └── main.tsx            # Punto de entrada
├── supabase/
│   ├── schema.sql          # Estructura de tablas, ENUMs, triggers y auditoría
│   └── seed.sql            # Datos iniciales (Dra. Valeria, Thor, Mimi, etc.)
├── ARCHITECTURE.md         # Documento de arquitectura técnica detallada
├── Manual_Casos_de_Uso_VetCare_Pro.pdf # Manual funcional completo (44 CUs)
├── Investigacion_Mercado_Legal_VetCare.pdf # Estudio de mercado y marco legal
└── package.json
```

---

## 💡 Modelo de Socios: Plan Particular a $10.000/mes

Para evitar que una familia tenga que desembolsar $80.000 a $300.000 de golpe ante una urgencia o un ciclo anual de vacunas:
* **Cuota mensual:** $10.000 ARS (por débito automático).
* **100% de Urgencias 24/7 cubiertas** en guardia sin copagos imprevistos.
* **100% de Vacunas obligatorias bonificadas** (Antirrábica, Séxtuple/Triple Felina).
* **50% de descuento directo en cirugías e internaciones.**
* **Carnet Digital QR (VetCare Pass)** con validación inmediata por aproximación o DNI.

---

## 🛠️ Puesta en Marcha Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abrir en el navegador: `http://localhost:3000`

3. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 🗄️ Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta en orden:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
3. En el archivo `.env` o en Vercel Environment Variables, configura:
   ```env
   VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```

---

## 🌐 Conexión a GitHub y Despliegue en Vercel

1. **Subir a GitHub:**
   ```bash
   git add .
   git commit -m "feat: VetCare Pro con Supabase, Planes de Socios a $10k y Vercel"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git branch -M main
   git push -u origin main
   ```
2. **Desplegar en Vercel:**
   - Inicia sesión en [vercel.com](https://vercel.com).
   - Haz clic en **"Add New Project"** e importa tu repositorio de GitHub.
   - Framework preset: **Vite**.
   - Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
   - Haz clic en **Deploy**. ¡Tu sistema estará en línea con HTTPS automático!

