# corrector-fp

Landing + backend del proyecto **Corrector Automático de Factor de Potencia para Pequeños Comercios en Medellín** — Universidad Nacional de Colombia, Facultad de Minas. Proyecto Integrado de Ingeniería (2026).

## Arquitectura

Clean Architecture con flecha de dependencia **solo hacia adentro**:

```
src/
├── domain/           Entidades + puertos (TelemetrySource, LeadRepository, Mailer, …)
│   ├── power-factor/ Cálculos puros: histéresis, banco de capacitores, penalización
│   ├── telemetry/    Reading, Device, value objects
│   ├── leads/        Lead
│   ├── events/       DomainEvent
│   └── ports/        Interfaces que la app consume
├── application/      Casos de uso (ingest-reading, create-lead, stream-telemetry, …)
├── infrastructure/   Adapters (in-memory + stubs Postgres/Resend) + container.ts
├── presentation/     Componentes, secciones, dashboard, formularios
├── shared/           Copy, env, logger, utilidades
└── app/              Next.js App Router (rutas + API)
```

`src/infrastructure/container.ts` lee `process.env` y selecciona los adapters que cumplen los puertos del dominio. La UI consume puertos vía `getContainer()` — nunca instancia adapters.

## Estado v1

- ✅ Landing existente (10 secciones, 3D, GSAP, Framer Motion) **sin tocar diseño**
- ✅ `/dashboard` con telemetría en vivo (SSE)
- ✅ `/cotizar` con form validado (Zod + react-hook-form)
- ✅ `/api/telemetry/{ingest,snapshot,stream}` autenticadas
- ✅ `/api/leads` + `/api/health`
- ✅ Adapters: `SimulatedTelemetrySource`, `InMemoryTelemetrySource`, `HybridTelemetrySource`, `InMemoryLeadRepository`, `ConsoleMailer`
- 🟡 Stubs listos pero no activados: `PostgresTelemetrySource`, `DrizzleLeadRepository`, `ResendMailer`
- ⏭️ Pendiente decisión: deploy (Fly.io fuera de Bogotá / Oracle Free / Vercel+Neon / Railway)

## Stack

Next.js 16 · React 19 · TypeScript estricto · Tailwind v4 · Zod · react-hook-form · bcryptjs · R3F · GSAP · Framer Motion.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

Visita:
- `http://localhost:3000/` — landing
- `http://localhost:3000/dashboard` — telemetría en vivo
- `http://localhost:3000/cotizar` — formulario de leads
- `http://localhost:3000/api/health` — healthcheck

### Scripts

```bash
npm run dev         # next dev --turbopack
npm run build       # next build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Simular el firmware (curl)

```bash
NOW=$(node -e "console.log(new Date().toISOString())")
curl -X POST http://localhost:3000/api/telemetry/ingest \
  -H "x-device-key: $DEMO_DEVICE_API_KEY" \
  -H "content-type: application/json" \
  -d "{\"ts\":\"$NOW\",\"pf\":0.95,\"p_w\":1500,\"q_var\":300,\"s_va\":1530,\"v_rms\":120,\"i_rms\":12.75,\"active_stage\":3}"
```

Respuestas:
- `202 { id }` — lectura aceptada
- `401` — header `x-device-key` ausente o inválido
- `409` — duplicado de `(deviceId, ts)`
- `422` — body no cumple schema

Cuando el `TELEMETRY_SOURCE` es `hybrid` (default), el dashboard mostrará la lectura ingerida si tiene < 60 s; cuando supera ese umbral, el dashboard cae a la fuente simulada.

## Cambiar adapters sin tocar código

Variables relevantes (ver `.env.example`):

| Variable | Valores | Efecto |
|---|---|---|
| `TELEMETRY_SOURCE` | `simulated` · `in-memory` · `hybrid` · `postgres` | Cambia origen de telemetría sin tocar UI/dominio |
| `MAILER` | `console` · `resend` | Cambia destino de notificaciones |
| `DEMO_DEVICE_ID` / `DEMO_DEVICE_API_KEY` | strings | Bootstrap del dispositivo demo |
| `LEAD_NOTIFY_EMAIL` / `LEAD_FROM_EMAIL` | emails | Destino y remitente de notificación de leads |
| `LEADS_JSONL_PATH` | path | Archivo append-only de leads (no se relee al iniciar) |

## Activar adapters reales (post-v1)

### Postgres

```bash
npm install drizzle-orm drizzle-kit postgres
```

1. Crear `src/infrastructure/db/{schema.ts,client.ts,migrate.ts}` siguiendo las shapes de `src/domain/`.
2. Implementar el cuerpo de `src/infrastructure/telemetry/postgres-source.ts` y `src/infrastructure/leads/drizzle-repository.ts`.
3. `TELEMETRY_SOURCE=postgres` + `DATABASE_URL=postgres://…`.

UI / casos de uso / firmware: cero cambios.

### Resend

```bash
npm install resend
```

1. Implementar `src/infrastructure/mail/resend-mailer.ts`.
2. `MAILER=resend` + `RESEND_API_KEY=…`.

## Deploy (post-v1)

Aún sin destino fijado. Opciones contempladas:

- **Fly.io** (no `bog`, ya no existe): regiones cercanas `mia`/`iad`. Postgres clásico managed.
- **Oracle Cloud Free Tier**: VM + Postgres en Docker.
- **Vercel + Neon**: el camino más rápido.
- **Railway**: app + postgres en un solo dashboard.

Plan completo del deploy queda redactado en el ultraplan `(.claude/plans/the-remote-ultraplan-session-shimmering-honey.md)` para activar cuando se decida.
