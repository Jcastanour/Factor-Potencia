# PROJECT_CONTEXT — Source of Truth

Consolida lo esencial del proyecto para cualquier agente/skill que trabaje sobre este repo. Trátalo como la verdad operativa del proyecto. Los archivos fuente originales son `contexto1.md`, `contexto2.md` y el PDF "Corrector Automático de Factor de Potencia para Pequeños Comercios en Medellín.pdf".

---

## 1. Qué estamos construyendo

Una **landing page / demo conceptual web** (NO el prototipo físico) que presenta el proyecto académico:

**Corrector Automático de Factor de Potencia para Pequeños Comercios en Medellín**

- Institución: Universidad Nacional de Colombia — Facultad de Minas, Instituto de Educación en Ingeniería
- Curso: Proyecto Integrado de Ingeniería
- Asesor: Diego Alexander Herrera Uribe
- Entrega: 23/03/2026
- Integrantes: Maria Fernanda Rodríguez Morales, Maria Camila Chica Quintero, Juan Pablo Castaño Uribe, Cristian David Montoya Gómez, Argenis David Marín Adames, Cristobal Henao Rueda, José Simón Higuita Lopera, Luis David Mendoza Orozco.

La web debe **impresionar y comunicar** mejor que un PDF/diapositivas. Es un boceto técnico-visual, no un producto comercial terminado.

---

## 2. Problema que comunica la página

Los pequeños comercios de Medellín con cargas inductivas (panaderías, talleres, carpinterías, lavanderías, tiendas con refrigeración) suelen tener **factor de potencia bajo** (0,60–0,85) por usar motores, compresores y equipos similares. La regulación colombiana (CREG 101-035 de 2024) exige **FP ≥ 0,90**; el incumplimiento activa un factor multiplicador **M** (escala progresiva 1–12) que traduce en penalizaciones mensuales de **25 000 – 1 500 000 COP** por comercio.

Las soluciones industriales existentes cuestan 2–15 millones COP — inaccesibles para MiPymes.

---

## 3. Qué propone el dispositivo (hardware)

Corrector automático de factor de potencia, **plug-and-play**, de bajo costo:

- **Microcontrolador:** ESP32 (doble núcleo, ADC 12 bits, WiFi, ~35 000 COP)
- **Sensor de voltaje:** ZMPT101B (transformador de potencial aislado)
- **Sensor de corriente:** SCT-013-030 (pinza no invasiva, hasta 30 A)
- **Banco escalonado:** 3 condensadores (5, 10, 20 µF a 450 V) en proporción binaria 1:2:4 → **7 niveles discretos** de compensación (1–7 kVAR)
- **Conmutación:** relés de estado sólido (SSR) 30 A con cierre por cruce por cero
- **Display:** OLED

**Algoritmo de control (histéresis):**
- Umbral inferior: 0,88 (conecta escalón adicional)
- Umbral superior: 0,97 (desconecta un escalón)
- FP objetivo: 0,95
- Retardo mínimo entre conmutaciones: 30 s

**4 modos secuenciales:** inicialización → autocalibración → diagnóstico 24 h → control activo.

**Costo materiales:** ~193 000 COP. **Precio venta sugerido:** 350 000 – 450 000 COP. **ROI:** 2–7 meses.

---

## 4. Mercado y contexto

- **1,73 M** empresas en Colombia; **99,5 %** MiPymes.
- **118 441** empresas activas en Medellín; **97,1 %** microempresas.
- **40–60 %** operan con cargas inductivas significativas.
- Mercado direccionable: **47 000 – 71 000** comercios en Medellín.
- **Sin competidores directos bajo 500 000 COP** (Schneider, ABB, EPCOS, Siemens, WEG están en rango 2M–15M y dirigidos a industria).

---

## 5. Marco regulatorio y normativo

- Resolución **CREG 015/2018** (metodología cobro reactiva) y **CREG 101-035/2024** (FP mín. 0,90).
- Factor multiplicador **M** (1–12) escala progresiva.
- **RETIE** actualizado por Resolución 40117 de 2024 (MinMinas).
- **Ley 2099 de 2021** (transición energética).
- Estándares: IEC 60831-1/2, IEEE Std 18, NTC 3422, IEEE 519-2022.
- Vía **Declaración de Conformidad del Productor** para lotes <50 unidades (aplicable al prototipo).

---

## 6. Arquitectura narrativa (secciones de la página)

1. **Hero** — "Sobrecostos invisibles en la electricidad de los pequeños comercios." Dispositivo 3D + grid técnico + pulso.
2. **El Problema** — Lo que no se ve, se paga. Penalización 25 000 – 1 500 000 COP/mes (factor M).
3. **Dónde Aparece** — Panaderías, talleres, carpinterías, lavanderías, tiendas con refrigeración (FP 0,60–0,85).
4. **Qué Pasa Eléctricamente** — Triángulo de potencias (P, Q, S) animado + onda V/I desfasadas.
5. **La Propuesta** — Dispositivo plug-and-play. Explosión isométrica de capas (ESP32, sensores, banco, SSR, OLED).
6. **Cómo Funciona** — Pipeline detecta → analiza → activa escalón → mide → ajusta. Diagrama de 4 modos.
7. **Demo Interactivo** — Toggle FP bajo ↔ corregido, onda se alinea, medidor sube 0,72→0,95, kVAR compensados, ahorro mensual.
8. **Por Qué Importa** — ROI 2–7 meses vs 12–24 industriales; 47k–71k comercios; sin competencia <500k COP.
9. **Estado Actual** — Explícito: prototipo en construcción, boceto técnico-visual, no producto terminado.
10. **Equipo / Cierre** — UNAL Facultad de Minas, Proyecto Integrado de Ingeniería.

---

## 7. Tono y estética

**Tono narrativo:** claro, convincente, técnico pero entendible, elegante. No comercial exagerado, no académico/institucional frío, no futurista de ciencia ficción.

**Estética:** deeptech / hardware / energía / smart device. Mezcla de:
- Proyecto de ingeniería serio
- Startup tecnológica
- Demo de producto
- Visualización técnica moderna

**Rechazar:**
- Plantilla SaaS genérica
- Lenguaje corporativo
- Vender como producto terminado
- Clichés de IA/tech sin narrativa
- Visuales vacíos sin relación con el problema

**Abrazar:**
- Storytelling visual
- Scroll storytelling
- Animaciones fluidas y microinteracciones
- Visuales 3D o pseudo-3D
- Glow, wireframes, grids, partículas sutiles
- Jerarquía visual clara
- Coherencia problema → usuario → propuesta

---

## 8. Stack técnico

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Estilos:** Tailwind CSS 4 + shadcn/ui (tokens, no plantilla)
- **Motion:** Framer Motion (microinteracciones) + GSAP + ScrollTrigger (storytelling)
- **3D:** Three.js + React Three Fiber + drei
- **Gráficos:** visx / Recharts (onda, triángulo, medidor FP)
- **Deploy:** Vercel

### Paleta — Oscuro Techno

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#07090B` | Fondo principal |
| `--bg-elevated` | `#0E1116` | Cards, paneles |
| `--fg-primary` | `#E8EEF5` | Texto principal |
| `--fg-muted` | `#8892A0` | Texto secundario |
| `--accent-electric` | `#22D3EE` | Acento cian eléctrico |
| `--accent-signal` | `#3B82F6` | Azul señal |
| `--accent-warn` | `#F59E0B` | Ámbar — penalización/alerta |
| `--accent-ok` | `#10B981` | Verde — FP corregido |
| `--grid-line` | `rgba(232,238,245,0.06)` | Líneas del grid técnico |

**Tipografía:** Geist / Inter Tight (sans técnica) + JetBrains Mono / Geist Mono (valores numéricos).

---

## 9. Idioma

**Español.** Público objetivo: jurado UNAL + MiPymes de Medellín. Términos técnicos e identificadores en código en inglés; copy en español.

---

## 10. Skills del proyecto

### Skills externas instaladas
- `frontend-dev` (MiniMax-AI/skills) — orquestación landing
- `gsap-scrolltrigger` + familia GSAP (greensock/gsap-skills) — animación scroll
- `frontend-design-review` (microsoft/skills) — auditoría de UI
- `plan-design-review` (garrytan/gstack) — review antes de codear
- `threejs-fundamentals` + familia (CloudAI-X/threejs-skills) — 3D del dispositivo

### Skills propias (en `.claude/skills/`)
1. `power-factor-storytelling` — cómo narrar FP sin sonar denso
2. `reactive-power-demo-logic` — lógica de la demo (umbrales, 7 niveles, histéresis)
3. `deeptech-landing-direction` — guardrails estéticos anti-SaaS
4. `small-business-electrical-context` — perfiles de MiPymes objetivo

---

## 11. Números clave para usar en UI/copy (no inventar)

| Valor | Fuente |
|---|---|
| FP mínimo regulatorio | 0,90 (CREG 101-035/2024) |
| FP típico MiPymes sin compensar | 0,60 – 0,85 |
| Penalización mensual | 25 000 – 1 500 000 COP |
| Factor multiplicador M | escala 1 – 12 |
| Costo materiales del prototipo | ~193 000 COP |
| Precio venta sugerido | 350 000 – 450 000 COP |
| Ahorro mensual esperado | 25 000 – 150 000 COP |
| ROI | 2 – 7 meses |
| Mercado direccionable Medellín | 47 000 – 71 000 comercios |
| Niveles de compensación | 7 (1–7 kVAR) |
| Umbral histéresis inferior | FP < 0,88 |
| Umbral histéresis superior | FP > 0,97 |
| FP objetivo | 0,95 |
| Retardo entre conmutaciones | 30 s |
| Frecuencia de muestreo | 500 muestras/ciclo (33,3 µs) |
| Red objetivo | 120 V / 60 Hz monofásico |
| Instalación | 20 – 30 min plug-and-play |
