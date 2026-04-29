# FactorPro

**Corrector Automático de Factor de Potencia para Pequeños Comercios en Medellín**
Universidad Nacional de Colombia · Facultad de Minas · Proyecto Integrado de Ingeniería

Producción: <https://factorpro.fly.dev>

---

## Qué es

Una landing técnica + dashboard + endpoint de telemetría real que comunica el proyecto del corrector de FP, deja al usuario probar escenarios reales (panadería, taller, lavandería…) y queda listo para conectar el firmware del prototipo cuando exista.

Tres principios que guían el código:

1. **Funcional desde el primer día.** El endpoint `POST /api/telemetry/ingest` valida, autentica y persiste. Cuando el firmware del prototipo haga POST, los datos fluyen al dashboard sin tocar UI.
2. **Clean architecture decide mock vs real.** El swap entre simulado, in‑memory y postgres vive en `infrastructure/container.ts`, no en `if` regados por la UI.
3. **Honestidad visual.** Cada cifra estimada / proyectada lleva su badge.

---

## Arrancar en local

```bash
cd corrector-fp
cp .env.example .env.local
npm install
npm run dev
```

Abre:

- <http://localhost:3000/> — landing (10 secciones)
- <http://localhost:3000/dashboard> — dashboard amigable (modo claro por default + toggle)
- <http://localhost:3000/cotizar> — formulario de leads
- <http://localhost:3000/api/health> — healthcheck

Toggle de tema en el Nav (☾/☀). Persiste en `localStorage`.

### Scripts

```bash
npm run dev         # next dev --turbopack
npm run build       # next build (output standalone para Docker)
npm run typecheck   # tsc --noEmit  (verde es la verdad)
npm run lint        # eslint
```

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind v4 + `globals.css` con tokens CSS para tema claro/oscuro |
| 3D | three + @react-three/fiber + @react-three/drei (visor del dispositivo); SVG isométrico hoy, GLB cuando exista |
| Animación | Framer Motion + GSAP |
| Validación | Zod (env + API + form) |
| Form | react-hook-form + @hookform/resolvers |
| Auth device | bcryptjs (hash de `x-device-key`) |
| Infra | Docker multi‑stage → Fly.io (región `iad`) |
| CI/CD | GitHub Actions → `flyctl deploy --remote-only` |

---

## Arquitectura — clean

Flecha de dependencia **solo hacia adentro**:

```
src/
├── domain/                 ← reglas y tipos puros, no importa nada externo
│   ├── power-factor/         # cálculos: histéresis, banco, penalización (ya estaba)
│   ├── telemetry/            # Reading, Device, value objects
│   ├── leads/                # Lead
│   ├── events/               # DomainEvent
│   ├── scenarios/            # 5 comercios reales (panadería, taller, …)
│   └── ports/                # interfaces que la app consume
├── application/            ← casos de uso, solo importa de domain
│   ├── telemetry/            # ingest-reading, get-latest, stream, list-events
│   ├── leads/                # create-lead
│   ├── scenarios/            # useScenarioSimulation (cliente)
│   └── demo/                 # useDemoSimulation (sliders)
├── infrastructure/         ← implementa puertos del dominio
│   ├── telemetry/            # SimulatedTelemetrySource, InMemory, Hybrid, Postgres (stub)
│   ├── leads/                # InMemoryLeadRepository, DrizzleLeadRepository (stub)
│   ├── mail/                 # ConsoleMailer, ResendMailer (stub)
│   ├── devices/              # InMemoryDevicesRegistry (bcrypt)
│   └── container.ts          # composition root: lee env, expone {telemetry, leads, mailer, devices}
├── presentation/           ← componentes React, consume casos de uso vía container
│   ├── sections/             # las 10 secciones de la landing
│   ├── components/           # Nav, primitives, illustrations, charts, three
│   ├── primitives/Badge.tsx  # honestidad visual: prototype/projection/concept/estimation
│   ├── dashboard/            # SSE hook (oscuro técnico, no usado hoy)
│   ├── dashboard-friendly/   # dashboard amigable claro (5 bloques narrativos)
│   ├── cotizar/              # CotizarForm
│   └── components/device/    # HotspotPanel, components-data
├── shared/                 ← env, logger, copy, hooks, utilidades
└── app/                    ← Next.js App Router (rutas + API)
    ├── (landing) page.tsx
    ├── dashboard/page.tsx
    ├── cotizar/page.tsx + gracias/page.tsx
    └── api/
        ├── health/route.ts
        ├── leads/route.ts
        └── telemetry/{ingest,snapshot,stream}/route.ts
```

**Regla clave:** `presentation/` y `app/` **nunca** instancian adapters ni hablan con `infrastructure/` directamente. Siempre via `getContainer()`.

---

## Estrategia de adapters (lo más importante para entender el código)

Cada puerto del dominio tiene **al menos dos** implementaciones desde v1: una funcional in‑memory y un stub listo para Postgres/Resend cuando se quiera conectar.

| Puerto | Adapter activo en v1 | Adapter futuro (stub) |
|---|---|---|
| `TelemetrySource` | `SimulatedTelemetrySource`, `InMemoryTelemetrySource`, `HybridTelemetrySource` | `PostgresTelemetrySource` |
| `LeadRepository` | `InMemoryLeadRepository` (+ append a `tmp/leads.jsonl`) | `DrizzleLeadRepository` |
| `Mailer` | `ConsoleMailer` (loguea a stdout) | `ResendMailer` |
| `DevicesRegistry` | `InMemoryDevicesRegistry` (bcrypt) | (cuando haya Postgres → trivial) |

`container.ts` decide qué instanciar leyendo `process.env`:

```bash
TELEMETRY_SOURCE=simulated   # generador determinista
TELEMETRY_SOURCE=in-memory   # solo lo que ingestó hardware (RAM)
TELEMETRY_SOURCE=hybrid      # in-memory si hay lectura <60s, sino simulated   ← default
TELEMETRY_SOURCE=postgres    # stub, lanza excepción hasta que se conecte

MAILER=console               # default v1
MAILER=resend                # stub
```

**Cambiar de modo = cambiar env var + redeploy. Cero código tocado en UI/dominio/firmware.**

---

## Flujo de telemetría

### Endpoint `POST /api/telemetry/ingest`

- Header: `x-device-key: <api-key>` → bcrypt compare contra `DevicesRegistry`
- Body validado con Zod:
  ```json
  {
    "ts": "ISO-8601",
    "pf": 0.95,
    "p_w": 1500,
    "q_var": 300,
    "s_va": 1530,
    "v_rms": 120,
    "i_rms": 12.75,
    "active_stage": 3
  }
  ```
- Caso de uso `ingestReading` → `TelemetrySource.writeReading()`
- Respuestas: `202 {id}`, `401` key inválida, `409` duplicado `(deviceId, ts)`, `422` body inválido

### Simular el firmware desde tu terminal

```bash
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
curl -X POST https://factorpro.fly.dev/api/telemetry/ingest \
  -H "x-device-key: $DEMO_DEVICE_API_KEY" \
  -H "content-type: application/json" \
  -d "{\"ts\":\"$NOW\",\"pf\":0.95,\"p_w\":1500,\"q_var\":300,\"s_va\":1530,\"v_rms\":120,\"i_rms\":12.75,\"active_stage\":3}"
```

Cuando `TELEMETRY_SOURCE=hybrid` (default) y la última lectura tiene <60s, el dashboard la muestra real; si pasa el umbral, cae a la simulación. Cuando se conecte Postgres se quita el fallback.

### Endpoints derivados

- `GET /api/telemetry/snapshot` → última lectura (JSON)
- `GET /api/telemetry/stream` → SSE en vivo (lo que consume el dashboard)
- `GET /api/health` → healthcheck para Fly

---

## Variables de entorno

Ver `.env.example`. Las relevantes:

| Variable | Default | Para qué |
|---|---|---|
| `TELEMETRY_SOURCE` | `hybrid` | Selector del adapter de telemetría |
| `MAILER` | `console` | Selector del adapter de email |
| `DEMO_DEVICE_ID` | `demo-device` | ID del dispositivo demo |
| `DEMO_DEVICE_API_KEY` | (obligatorio) | Hash bcrypt para `x-device-key` |
| `LEAD_NOTIFY_EMAIL` | `equipo@example.com` | A dónde llegan las notificaciones de `/cotizar` |
| `LEAD_FROM_EMAIL` | `onboarding@resend.dev` | Remitente |
| `LEADS_JSONL_PATH` | `tmp/leads.jsonl` | Append‑only de leads (no se relee en arranque) |
| `RESEND_API_KEY` | — | Solo cuando se active el adapter Resend |
| `DATABASE_URL` | — | Solo cuando se active el adapter Postgres |

`shared/env.ts` valida todo con Zod en arranque. Si falta algo crítico, el server no levanta y dice qué.

---

## Producción · Fly.io

### App
- Nombre: `factorpro`
- Región: `iad` (Ashburn — Bogotá ya no existe en Fly)
- URL: <https://factorpro.fly.dev>
- Config: `corrector-fp/fly.toml`

### Imagen
- `corrector-fp/Dockerfile` — Node 22 alpine, multi‑stage (deps → builder → runner), `next.config.ts` con `output: "standalone"`, usuario no‑root

### CI/CD
- `.github/workflows/deploy.yml` se dispara en `push` a `main` con paths `corrector-fp/**`
- Secret de repo: `FLY_API_TOKEN` (token de deploy creado con `flyctl tokens create deploy --name "github-actions-factorpro"`)
- Comando: `flyctl deploy --remote-only`

### Comandos útiles

```bash
flyctl status --app factorpro                         # estado de las máquinas
flyctl logs --app factorpro                           # logs en vivo
flyctl secrets list --app factorpro                   # nombres (no valores) de secrets
flyctl secrets set CLAVE=valor --app factorpro        # rotar/agregar secret (reinicia las máquinas)
flyctl ssh console --app factorpro                    # entrar al contenedor
flyctl scale count 1 --app factorpro                  # bajar a 1 máquina (ahorra créditos)
flyctl scale count 2 --app factorpro                  # subir a 2 (HA)
flyctl deploy --remote-only --app factorpro           # deploy manual sin pasar por GitHub
```

### Auto‑stop

`fly.toml` tiene `auto_stop_machines = "stop"` y `min_machines_running = 0`: las máquinas duermen si no hay tráfico (gratis hasta que alguien entre, primer request tarda 1–2 s en arrancar). Si querés siempre prendido para una demo, sube `min_machines_running = 1` y redeploya.

---

## Activar adapters reales (cuando llegue el momento)

### Postgres

```bash
cd corrector-fp
npm install drizzle-orm drizzle-kit postgres
```

1. Crear `src/infrastructure/db/{schema.ts,client.ts,migrate.ts}` siguiendo las shapes del dominio (`Reading`, `Lead`, `Device`, `Event`).
2. Reemplazar el cuerpo de `src/infrastructure/telemetry/postgres-source.ts` y `src/infrastructure/leads/drizzle-repository.ts` con drizzle.
3. En Fly:
   ```bash
   flyctl postgres create --name factorpro-db --region iad
   flyctl postgres attach factorpro-db --app factorpro
   flyctl secrets set TELEMETRY_SOURCE=postgres --app factorpro
   ```
   Ese `attach` setea `DATABASE_URL` automáticamente.
4. Agregar `release_command = "node ./dist/migrate.js"` al `fly.toml` para correr migraciones en cada deploy.

UI / casos de uso / firmware: cero cambios.

### Resend

```bash
npm install resend
```

1. Implementar `src/infrastructure/mail/resend-mailer.ts` (la firma ya está).
2. `flyctl secrets set MAILER=resend RESEND_API_KEY=re_... LEAD_FROM_EMAIL=hola@tudominio.com --app factorpro`
3. Verificar dominio en panel de Resend si querés mandar desde tu propio dominio; mientras tanto `onboarding@resend.dev` funciona para tests.

---

## Convenciones del repo

- **Tipos de archivos por capa.** Todo lo que importes en `application/` debe venir de `domain/`. Si necesitas algo de infra, lo recibís por DI a través del container.
- **No instancies adapters fuera del container.** Si necesitas un caso de uso desde una ruta API, llamas `getContainer()` y le pasas los puertos al factory `makeXxx({ ... })`.
- **Badges de honestidad obligatorios** en cualquier cifra que no esté medida en hardware real (ver `<Badge>` en `presentation/primitives/`).
- **Tests:** no hay framework instalado. El dominio (`power-factor`, value objects) es testeable trivialmente con vitest cuando se quiera.
- **Modo claro / oscuro:** todo usa CSS variables. Si agregas un componente nuevo con color hardcoded (`#0A0D12`, `#E8EEF5`, etc.) probablemente rompa un tema. Usa `var(--bg-elev)`, `var(--fg)`, `var(--cyan)`, etc.
- **Mobile:** todos los breakpoints están en `globals.css` (`@media(max-width:900px|600px|420px)`). Si un componente nuevo no entra en móvil, ahí es donde se ajusta.

---

## Para un compañero que llega ahora

1. Lee `MEMORIA.md` (15 min) — entiende qué se hizo, por qué, y qué falta.
2. Clona, `npm install`, `npm run dev`. Mete `escenario=taller` en `/dashboard?escenario=taller` y juega con la simulación.
3. Mira `src/infrastructure/container.ts` — ese archivo te dice cómo encaja todo.
4. Si vas a tocar el firmware: tu contrato es `POST /api/telemetry/ingest` con bcrypt en `x-device-key`. Nada más.
5. Si vas a conectar Postgres: implementa los stubs en `infrastructure/telemetry/postgres-source.ts` y `infrastructure/leads/drizzle-repository.ts`. No toques `domain/` ni `application/` ni `presentation/`.
6. Si vas a tocar diseño: el lenguaje visual está en `globals.css` + `presentation/components/ui/primitives.tsx`. Modo claro y oscuro tienen que verse bien en cada componente que toques.

---

## Estado actual

- ✅ Landing 10 secciones (3D + animaciones)
- ✅ Dashboard amigable claro/oscuro con SSE
- ✅ Demo con 5 escenarios reales + CTA al dashboard pasando el escenario por query
- ✅ Form `/cotizar` con Zod + react-hook-form + ConsoleMailer
- ✅ Endpoint `/api/telemetry/ingest` autenticado, listo para firmware
- ✅ Toggle global de tema (oscuro default, claro para proyector)
- ✅ Responsive móvil
- ✅ Deploy automático en `main` → factorpro.fly.dev
- 🟡 Stubs listos pero no activos: Postgres, Resend
- ⏳ GLB del dispositivo: hoy es SVG isométrico provisional
- 📅 Entrega final: 30 / 04 / 2026

---

## Equipo

- Maria Fernanda Rodríguez Morales
- Maria Camila Chica Quintero
- Juan Pablo Castaño Uribe
- Cristian David Montoya Gómez
- Argenis David Marín Adames
- Cristobal Henao Rueda
- José Simón Higuita Lopera
- Luis David Mendoza Orozco

Director: Diego Alexander Herrera Uribe
