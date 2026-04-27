# Design Previews — Landing Factor de Potencia

4 variantes estéticas radicalmente distintas para elegir dirección antes de Fase 2 (3D, dominio, física).

Cada archivo es HTML autocontenido: abrir directo en el navegador. No build.

## Cómo elegir

1. Abre `index.html` — selector con las 4 direcciones.
2. Navega cada variante completa (scroll de las 8 secciones).
3. Tapa el contenido y mira solo estilos: debería reconocerse la variante a golpe de vista.
4. Rankea por impacto + encaje con el tono del seminario.

## Las 8 secciones (comunes)

1. Hero
2. El problema del PF (triángulo P/Q/S)
3. Laboratorio interactivo `[escena 3D — Fase 2]`
4. Corrección con condensador
5. Calculadora de coste (mock visual)
6. Ventilador — del 3D al prototipo
7. CTA
8. Footer técnico

## Las 4 direcciones

### 01 · Editorial Brutalist
- **Display**: Space Mono oversized
- **Body**: JetBrains Mono
- **Paleta**: `#0a0a0a` / `#fafafa` + amarillo `#ffd400` solo en métricas críticas
- **Layout**: grid de ingeniería asimétrico, reglas visibles con medidas, numeración `§01` gigante
- **Mood**: blueprint técnico frío, editorial
- **Prohíbe**: gradientes, bordes redondeados, sombras suaves

### 02 · Retro CRT Synthwave
- **Display**: VT323
- **Body**: IBM Plex Mono
- **Paleta**: `#0a0014` base + cyan `#00f0ff` + magenta `#ff2bd6`
- **Layout**: ventanas CRT con barra de título tipo OS antiguo, scanlines overlay fijo, cursor parpadeando
- **Mood**: laboratorio 80s, synthwave, retro-futurista
- **Obliga**: osciloscopio SVG animado (V/I desfasadas) como ornamento omnipresente

### 03 · Luxury Technical
- **Display**: Fraunces (serif editorial)
- **Body**: Outfit
- **Paleta**: navy `#0b1220` + cobre `#b87333` + crema `#efe9db`
- **Layout**: informe técnico premium, dense typography, tablas, capitulares, pull-quotes
- **Mood**: whitepaper de ingeniería de lujo
- **Obliga**: textura de papel SVG-noise, numerales tabulares, reglas finas doradas

### 04 · Techno-Organic
- **Display**: Instrument Serif
- **Body**: Outfit
- **Paleta**: verde bosque `#0f1a14` + cobre `#c97a3b` + crema `#f2ead3`
- **Layout**: SVGs de circuitos que se enroscan como enredaderas cruzando secciones, curvas orgánicas, bordes ligeramente irregulares
- **Mood**: naturaleza + ingeniería, cálido
- **Obliga**: grano animado, easing orgánico en interacciones

## Reglas comunes

- Spanish copy real, no lorem.
- Placeholder 3D: bloque punteado con `[ escena 3D — Fase 2 ]` estilizado a la variante.
- Sin Inter/Roboto/Arial/system-ui. Sin morado-sobre-blanco. Sin gradient meshes genéricos.
- Animaciones solo CSS + `IntersectionObserver` mínimo.
