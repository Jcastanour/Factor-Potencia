# corrector-fp

Landing page del proyecto **Corrector Automático de Factor de Potencia para Pequeños Comercios en Medellín** — Universidad Nacional de Colombia, Facultad de Minas. Proyecto Integrado de Ingeniería (2026).

## Arquitectura

Organizado por capas de Clean Architecture:

```
src/
├── domain/           Reglas y tipos puros (factor de potencia, histéresis, escalones)
├── application/      Casos de uso / estado de la demo
├── infrastructure/   Adaptadores externos (Three.js, GSAP, Framer Motion)
├── presentation/     Next.js App Router, componentes, secciones
└── shared/           Copy, tokens, utilidades
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · R3F + drei + postprocessing · GSAP · Framer Motion.

## Desarrollo

```bash
pnpm install   # o npm install
pnpm dev
```

Fuente de verdad del proyecto: `../PROJECT_CONTEXT.md`.
