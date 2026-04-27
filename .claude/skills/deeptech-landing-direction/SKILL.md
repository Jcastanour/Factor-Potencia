---
name: deeptech-landing-direction
description: Guardrails estéticos para la landing del corrector FP. Evita caer en plantilla SaaS genérica. Actívalo al diseñar layouts, secciones, componentes visuales, microinteracciones o elegir referencias.
---

# Deeptech Landing Direction

Direcciones de diseño obligatorias para que la página se sienta como hardware/deeptech real y no como cualquier startup de SaaS.

## Estética objetivo

Fusión de cuatro vibras:

1. **Laboratorio técnico** — grids finas, etiquetas mono con coordenadas, tipografía condensada, mediciones visibles (cifras, unidades, rangos).
2. **Producto industrial moderno** — superficies mate, metal cepillado, siliconas matizadas, sombras duras. Nada de glassmorphism plástico.
3. **Smart device premium** — microinteracciones suaves, indicadores de estado (pulse, glow), fidelidad de detalle.
4. **Energía y señal** — ondas, flujos de partículas, pulsos, wireframes de campo.

## Qué SÍ

- Fondo `#07090B`, jerarquía por luz (no por color).
- Acento cian `#22D3EE` escaso y quirúrgico — reservado para el producto y para el estado "corregido".
- Ámbar `#F59E0B` exclusivo para la alerta/penalización.
- Verde `#10B981` solo cuando el sistema está operando correctamente.
- Grid técnico sutil (`rgba(255,255,255,0.06)`) de fondo constante — ancla visual del lenguaje.
- Etiquetas mono con unidades visibles: `FP = 0.72`, `Q = 497 kVARh/mes`, `120 V · 60 Hz`.
- Reveals por scroll que sienten inercia (80–120ms stagger, easing tipo `power3.out`).
- 3D del dispositivo presente desde el hero, aunque sea con una cámara estática.
- Copy corto, con números grandes. Un número por card, no 5.
- Ilustraciones que parezcan planos técnicos o diagramas P&ID, no stock art.

## Qué NO

- ❌ Glassmorphism genérico con blur 20px.
- ❌ Gradientes púrpura-rosa o morado-azul "creative agency".
- ❌ Ilustraciones isométricas vectoriales tipo Undraw / StoryBlocks.
- ❌ Fotos de stock de "gente sonriendo viendo un laptop".
- ❌ Emojis en el copy. Íconos lineales simples sí.
- ❌ CTAs tipo "Get started free". Esto no vende SaaS.
- ❌ Pricing cards. No hay producto comercial.
- ❌ "Reviews" o testimoniales falsos.
- ❌ Animaciones cargadas (Lottie recargados).
- ❌ Arcoíris, neón rosa, vaporwave.

## Composición

- **Espacio generoso:** padding top/bottom de secciones ≥ 160 px en desktop.
- **Tipografía grande:** hero H1 ≥ 72 px desktop, 40 px mobile. Titulares de sección ≥ 48 px.
- **Rejilla 12 columnas** pero romperla cuando el contenido lo pida. Algunas secciones deben ser asimétricas (60/40, 70/30).
- **Números como héroes:** cifras clave en 120–200 px, mono.
- **Scroll storytelling:** al menos 2 secciones con pin (hero y "cómo funciona").

## Referencias textuales (no copiar literal)

Pensar en: Teenage Engineering (product pages), Framer (landing), Linear (dashboard density), Rabbit (device reveal), TinyCorp, Arc browser. No pensar en: Stripe landings genéricas, HubSpot, páginas de Bootstrap pre-hechas.

## Checklist al cerrar una sección

- [ ] Hay al menos un valor numérico claro visible.
- [ ] El fondo se lee `#07090B` o `#0E1116`.
- [ ] Usa max 2 acentos cromáticos simultáneos.
- [ ] Tiene al menos una animación de entrada con inercia.
- [ ] La etiqueta/eyebrow del título está en mono UPPERCASE con tracking.
- [ ] Ninguna imagen de stock humana.
