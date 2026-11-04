---
name: Clinical Empathy & Care
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system merges clinical precision with emotional reassurance. Designed specifically for veterinary practitioners, technicians, and clinic managers operating under high-tempo, emotionally charged conditions, the visual language conveys unwavering medical rigor, impeccable sanitation, and deep empathy toward animals and their caretakers.

The aesthetic fuses **Corporate/Modern** structure with **Soft Tactility**:
- **Sterile yet Inviting**: Light, pristine backgrounds that reflect hygiene without feeling detached or institutional.
- **Calm Authority**: Deep emerald greens and tranquil clinical blues instill immediate trust and diagnostic clarity.
- **Cognitive Relief**: High-contrast, unambiguous alert signals (amber for attention, coral red for emergencies) minimize friction and diagnostic hesitation during acute triage.

## Colors

The palette is engineered for high legibility under harsh clinic fluorescent lighting and mobile screen glare:

- **Primary (`#0D9488` / `#0F766E`)**: Medical Emerald. Anchors vital interactions, key status confirmations, and clinical sign-offs. Represents restorative healing and authority.
- **Secondary (`#0284C7` / `#0369A1`)**: Serene Clinical Blue. Applied to diagnostic filters, laboratory references, patient records, and non-urgent navigational pathways.
- **Tertiary (`#F59E0B`)**: Soft Warning Amber. Dedicated to triaged holds, pending lab results, and scheduled vaccine expiries.
- **Emergency Accent (`#EF4444`)**: Medical Coral Red. Strictly reserved for life-threatening triage alerts, allergies, and drug contraindications.
- **Neutral Foundation (`#F8FAFC` base, `#FFFFFF` surface, `#64748B` neutral tone, `#0F172A` deep text)**: Ensures maximum contrast and clean, hygienic spatial layering.

## Typography

The type system relies entirely on **Plus Jakarta Sans** for its balanced geometry, wide aperture, and warm humanistic undertones. It guarantees rapid scanning of medical dosages, patient weights, vitals, and surgical histories.

- **Headlines**: Set in semi-bold and bold weights to ground medical files, pet identities, and diagnosis headers.
- **Body**: Uses regular weight with comfortable line heights to reduce eye fatigue during extended clinical rounds.
- **Labels & Micro-data**: Elevated to medium or bold weights for badges, dosages, vital metric stamps, and triage indicators.

## Layout & Spacing

A fluid grid architecture engineered primarily for mobile single-hand ergonomics, scaling consistently up to clinic tablets (iPad/Surface) and workstation dashboards.

- **Mobile Rhythm**: 4-column fluid layout with a base 16px (`1rem`) outer margin and gutter, providing comfortable touch zones while keeping critical patient lists dense and readable.
- **Tablet / Clinical Cart Rhythm**: 8-column layout with 24px margins, introducing split-view panels (patient index alongside real-time medical chart).
- **Desktop Rhythm**: 12-column fixed-max layout (1280px container) with 32px margins.
- **Vertical Rhythm**: Built on a strict 4px/8px incremental base, preventing awkward alignment jumps in multi-line clinical observation notes.

## Elevation & Depth

Visual depth reinforces physical clinic cleanliness. Heavy, dark drop-shadows are eliminated in favor of pristine white surfaces delineated by hairline borders and ambient, tinted blurs.

- **Surface 0 (Canvas)**: `#F8FAFC` flat canvas, evoking sterile architectural cleanrooms.
- **Surface 1 (Cards & Modules)**: Pure white `#FFFFFF` paired with an ultra-soft ambient shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.05)` and a delicate border `1px solid rgba(226, 232, 240, 0.8)`.
- **Surface 2 (Floating Action Buttons & Clinical Bottom Sheets)**: `0 12px 28px -6px rgba(15, 23, 42, 0.10)`, creating explicit actionable prominence over background charts.
- **Surface 3 (Urgent Modals & Emergency Triage Banners)**: Highlighted with an emerald- or coral-tinted ambient glow (`0 8px 24px -4px rgba(239, 68, 68, 0.15)` for critical events) to guarantee immediate sensory capture.

## Shapes

The design system implements a **Rounded (Level 2)** shape discipline, scaling from `0.5rem` on basic interactive elements up to `1rem` (`rounded-lg`) and `1.5rem` (`rounded-2xl`) on primary patient cards and medical containers.

The rounded geometry counters clinical anxiety, creating an inviting, modern aesthetic that feels both technically cutting-edge and safe for animal guardians and medical staff. Full pill-radius shapes are dedicated to status chips and quick filter pills.

## Components

### Buttons
- **Primary**: Solid emerald `#0D9488` with white text, `0.75rem` (`12px`) vertical padding, minimum 48px target height for sterile-glove touch compatibility. Soft-press scale effect (`active:scale-[0.98]`).
- **Secondary**: Tinted clinical blue wash `#F0F9FF` with `#0369A1` text, providing clear differentiation from primary clinical actions.
- **Emergency Callout**: Solid `#EF4444` button with high-contrast white text for immediate triage routing.

### Status Microchips
Full pill-shaped (`rounded-full`), compact vertical padding (`space-xs`), bold label styling:
- **En Espera (Pending/Waitlist)**: Soft amber background (`#FEF3C7`), text `#B45309`, with a subtle pulsing amber ping dot.
- **Atendido (Completed)**: Soft emerald background (`#CCFBF1`), text `#0F766E`, paired with a crisp checkmark.
- **Urgencia (Emergency)**: High-visibility coral background (`#FEE2E2`), text `#B91C1C`, accompanied by an exclamation indicator.
- **Plan Activo (Active Care Plan)**: Serene sky background (`#E0F2FE`), text `#0369A1`.

### Patient & Clinical Cards
Constructed using pure white surfaces, `1.25rem` (`20px`) border-radii (`rounded-2xl`), hair-line borders (`#E2E8F0`), and generous internal padding (`space-md` to `space-lg`). Each card displays the animal species/breed badge, weight, age, and owner contact within a structured, scannable modular hierarchy.

### Input Fields
Crisp, medical-grade text and numeric inputs with neutral slate borders (`#CBD5E1`) on white backgrounds. Focused states transition cleanly to a 2px emerald outline (`#0D9488`) with zero layout shift. Specialized numerical steppers are optimized for weight (kg/lb) and drug dosage titrations (ml/mg).

### Checkboxes & Radios
Custom-styled rounded squares (`rounded-md`, 20px x 20px) for treatment checkboxes and pill rings for dosage selections. Active state uses medical emerald fill with crisp white glyphs.

### Specialized Veterinary Components
- **Vital Sign Micro-Trackers**: Compact card modules highlighting heart rate, respiratory rate, and temperature with directional trend arrows.
- **Dosage Calculator Bar**: Fixed contextual tray showing unit conversions and max toxicity alerts.