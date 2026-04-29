# Memoria del proyecto FactorPro

> Este documento existe para que cualquier persona que llegue al repo entienda qué se construyó, por qué se tomaron las decisiones que se tomaron, y por dónde puede entrar a trabajar sin romper lo que ya funciona. No es un README operativo (eso es `README.md`); es la historia y el razonamiento detrás del código.

---

## 1. El problema que resolvemos

En Medellín hay entre 47 y 71 mil pequeños comercios — panaderías, talleres mecánicos, lavanderías, carnicerías, salones de belleza — que pagan mes a mes una **penalización por bajo factor de potencia** que la mayoría no entiende. La regulación CREG 101‑035/2024 exige FP ≥ 0.90; cuando una panadería tiene un FP típico de 0.72, el operador (EPM) le cobra un recargo que va de **25.000 a 1.500.000 COP/mes** según el déficit y la potencia instalada.

La causa es física: motores, hornos, neveras y compresores consumen energía reactiva que la red debe transportar, sin que se traduzca en trabajo útil. Existe una solución bien conocida (banco de capacitores + control automático), pero los productos comerciales empiezan en **5–8 millones COP**, lo que los pone fuera del alcance de una panadería de barrio.

**FactorPro** es un dispositivo plug‑and‑play que esquiva ese precio: ESP32 + 3 SSR + 3 capacitores binarios (5/10/20 µF, aporte 1:2:4 kVAR), con sensores aislados (ZMPT101B + SCT‑013‑030), control por histéresis (FP objetivo 0.95, banda 0.88–0.97) y meta de costo de **350–450 mil COP al consumidor**. La hipótesis es: si conseguimos un retorno de inversión de 2 a 7 meses según consumo, el comercio firma de inmediato.

---

## 2. Qué es este código exactamente

No es el firmware del dispositivo. Es el **ecosistema digital** del proyecto: una landing técnica que comunica el producto, un dashboard amigable donde el comerciante ve qué le está pasando, un endpoint real al que el firmware le hablará, y la infraestructura para deployar todo eso.

**Audiencias que tiene que servir:**

| Audiencia | Qué necesita ver |
|---|---|
| Profesores del curso (UNAL) | Que el proyecto está pensado de verdad, no es maqueta |
| Comerciante objetivo | Qué le cuesta hoy, qué se ahorraría, sin tecnicismos |
| Compañero del equipo | Cómo está construido, dónde meter mano sin romper |
| Firmware del prototipo (cuando exista) | Un endpoint estable contra el cual ingestar lecturas |
| Inversionistas / jurado de feria | Que se ve premium, deeptech, profesional |

Por eso el proyecto tiene **dos lenguajes visuales coexistiendo**: la landing es deeptech oscura por default (cyan eléctrico, grids técnicos, mono labels) — habla al jurado y al ingeniero —, mientras el dashboard es claro y narrativo — habla al panadero. Hay toggle global de tema para que la landing también sirva en proyector.

---

## 3. Cómo llegamos hasta aquí

El repo arrancó como `BOCETO-SEMINARIO3` con un Next.js 16 ya estructurado en capas (presentation / application / domain / infrastructure / shared) que tenía solo la landing y la simulación de demo. La memoria del proyecto se construyó en sesiones sucesivas:

1. **Plan inicial** — se diseñó arquitectura clean con puertos/adapters para que cuando el firmware exista, sea cuestión de cambiar una env var.
2. **Núcleo arquitectónico** — se crearon los puertos (`TelemetrySource`, `LeadRepository`, `Mailer`, `DevicesRegistry`), value objects, casos de uso y composition root.
3. **Telemetría in‑memory funcional** — adapter simulado que reusa el dominio `power-factor` existente, adapter in‑memory para writes reales del firmware, adapter híbrido que mezcla los dos.
4. **API real** — `POST /ingest` autenticado con bcrypt, `GET /snapshot`, `GET /stream` SSE, `GET /health`.
5. **Honestidad visual** — componente `<Badge>` con variantes prototype/projection/concept/estimation, integrado puntualmente en secciones donde había cifras especulativas.
6. **Dashboard amigable** — reescritura completa del dashboard técnico inicial: pasamos de tablero mono‑oscuro a página narrativa con verdict (Excelente/Bien/Regular/Crítico), termómetro, dinero en COP, banco de capacitores con LEDs, histórico simple, detalles técnicos colapsados.
7. **Form `/cotizar` + leads** — Zod + react-hook-form, repo in‑memory con backup en `tmp/leads.jsonl`, ConsoleMailer que loguea el correo a stdout.
8. **Demo con escenarios** — 5 comercios reales (panadería, taller, lavandería, carnicería, salón) con eventos pulsantes (compresor que arranca, horno que prende, secador) que demuestran cómo el corrector reacciona en vivo. CTA cruzado: del demo al dashboard pasando el escenario por query param.
9. **Tema global claro/oscuro** — variables CSS duales, toggle persistente en Nav, script inline en `<head>` para evitar flash. Default oscuro porque la landing está construida sobre ese lenguaje.
10. **Visor 3D del dispositivo** — wireframe en estado idle, vista externa con OLED en vivo (alimentado por la simulación), vista interna agrupada por función (alimentación / control / sensado / actuación / compensación), modo "explorar" con hotspots y panel debajo del stage. SVG isométrico hasta que tengamos GLB real.
11. **Responsive mobile** — breakpoints en 900/600/420 px.
12. **Deploy a Fly.io** — Dockerfile multi‑stage, `next.config.ts` con `output: "standalone"`, app `factorpro` en región `iad`, GitHub Actions con `FLY_API_TOKEN`.

Cada paso quedó verde en `npm run typecheck` y `npm run build`.

---

## 4. Decisiones que importan (y por qué)

### 4.1 Clean architecture con adapters in‑memory desde v1

**Decisión:** todo el flujo (ingestar lectura → mostrar en dashboard → notificar lead) funciona end‑to‑end sin Postgres, sin Resend, sin nada externo. Los puertos están definidos, los adapters in‑memory los cumplen, los stubs Postgres/Resend están escritos pero no activos.

**Por qué:** el firmware tarda. La universidad puede dar el visto bueno mientras el hardware sigue en ensamblaje. Cuando el firmware exista, lo único que cambia es `TELEMETRY_SOURCE=postgres` + implementar el cuerpo del stub. Cero deuda técnica acumulada esperando hardware.

**Trade‑off:** más archivos de los que tendría una versión "rápida". Pero la curva de pago es altísima cuando se conecte hardware real.

### 4.2 Default oscuro, toggle a claro

**Decisión:** la landing se ve en oscuro por default; el toggle expone el modo claro.

**Por qué:** la estética deeptech de la landing fue construida sobre fondo negro (cyan eléctrico, grids técnicos, glows sutiles, callouts hardcoded). Forzar el modo claro como default rompía la mitad de las secciones. Pero el dashboard amigable (audiencia comerciante) sí va claro por default — y el toggle global cubre el caso "presentación con proyector en sala iluminada".

**Trade‑off:** mantener dos temas multiplica el costo de cualquier cambio visual. Por eso `globals.css` centraliza tokens y los componentes nuevos siempre deben usar `var(--*)` en vez de literales.

### 4.3 Dashboard amigable separado del técnico

**Decisión:** `presentation/dashboard-friendly/` (claro, narrativo) y `presentation/dashboard/` (oscuro, técnico) coexisten. El que se monta en `/dashboard` es el amigable.

**Por qué:** el comerciante no entiende "potencia reactiva 1.34 kVAR"; entiende "estás pagando $87.000 de más cada mes". Pero el ingeniero/director de tesis sí necesita ver P/Q/S/V/I/mask. Solución: dashboard amigable como entrada principal, con sección "Detalles técnicos" colapsable al final.

### 4.4 Visor 3D en SVG isométrico, no GLB

**Decisión:** el visor del dispositivo (vista externa + interna + hotspots) está hecho con SVG y transformaciones CSS, no con un modelo 3D real cargado vía R3F.

**Por qué:** el GLB no existe todavía (lo hará industrial design). Mientras tanto, un SVG isométrico bien ejecutado es más rápido, más coherente con la estética técnica plana, y no depende de un asset que aún no se ha modelado. El componente está aislado: cuando llegue el GLB, se reemplaza el render interno y los controles externos siguen iguales.

### 4.5 Endpoint de telemetría con autenticación real desde el primer commit

**Decisión:** `POST /api/telemetry/ingest` valida bcrypt contra un registry de devices desde v1, aunque solo haya un device demo.

**Por qué:** si se monta sin auth y luego "ya lo agregamos cuando esté el firmware", se introduce una brecha por la cual cualquiera puede ensuciar la telemetría pública. Mejor partir con la fricción correcta. Bcrypt es trivial; el firmware solo tiene que mandar un header HTTP.

### 4.6 Tipografía base 17 px, eyebrows 12.5 px, peso 500

**Decisión:** subimos los tamaños base (16 → 17 px) y le dimos peso 500 a labels mono.

**Por qué:** en la primera ronda de feedback varios elementos se leían con dificultad sobre fondo claro. La tipografía mono fina (peso 400) sobre claro pierde mucho contraste. Cambiar a peso 500 + 1.5 pt arriba en eyebrows arregló el 80% de los problemas de legibilidad sin alterar la jerarquía.

### 4.7 Escenarios mockeados pero serializables

**Decisión:** los 5 escenarios de comercios viven en `domain/scenarios/scenarios.ts` como datos estructurados (carga base, FP base, eventos, copy del dueño). El simulador `useScenarioSimulation` los consume desde el cliente.

**Por qué:** cuando el firmware ingese de verdad, la mayoría de la magia (controlador de histéresis aplicado a una carga con eventos) se mantiene; la diferencia es que `Reading` viene de Postgres en vez de calcularse client‑side. Como los shapes son los mismos, el dashboard amigable no cambia.

---

## 5. Cosas que se vieron y se descartaron

- **Modo proyector** como toggle separado: descartado en favor del toggle claro/oscuro global. Si en el evento la sala está oscura → modo oscuro; iluminada → modo claro. Más simple, menos código.
- **R3F real con GLB**: pospuesto hasta que industrial design entregue el modelo. El SVG isométrico cumple el rol pedagógico mientras tanto.
- **eslint-plugin-boundaries**: se planeó pero el config de Next 16 + flat config tiene un bug pre‑existente que rompe lint. Se documentaron las reglas en `container.ts` y se confía en code review.
- **Pasarela de pago**: descartado por honestidad — el producto no se vende todavía. `/cotizar` es lista de espera.
- **i18n**: solo español. La audiencia es local.
- **Auth de usuarios finales**: arquitectura está lista (puertos, devices registry), pero la UI no se construye en v1. Cuando se haga multi‑comercio se monta auth.

---

## 6. Lo que falta y dónde meter mano

### Crítico para entrega final
- [ ] **GLB del dispositivo** — cuando industrial design lo entregue, reemplazar el SVG en `presentation/sections/DeviceClient.tsx` con un `<Canvas>` de R3F. La barra de controles y el HotspotPanel ya están listos para conectarse.
- [ ] **Conectar Postgres real** — instalar drizzle, implementar stubs `postgres-source.ts` y `drizzle-repository.ts`, attach managed postgres en Fly. Documentado paso a paso en `README.md`.
- [ ] **Conectar Resend** — `npm install resend` + cuerpo del stub `resend-mailer.ts`. Verificar dominio si quieres mandar desde uno propio.
- [ ] **Tests del dominio** — `power-factor` (histéresis, penalización, calculations) y los casos de uso son testeables sin mocks. vitest + 1 hora.

### Mejoras de producto
- [ ] Histórico real (24h, 7d, mes) cuando exista Postgres. Hoy se simula client‑side.
- [ ] Multi‑device (un dashboard por device id). El schema ya soporta N devices.
- [ ] Alertas push cuando FP cae bajo 0.85 (cuando exista hardware).
- [ ] Modo offline del firmware con buffer + reintentos cuando vuelve la red.

### Deuda técnica menor
- [ ] Lint roto por bug de Next 16 + eslintrc circular. Migrar a flat config puro cuando Next saque fix.
- [ ] Algunos colores hardcoded en SVGs muy puntuales (callouts del Hero ventilador). Migrar a `currentColor` o variables si rompen el tema claro.
- [ ] `tmp/leads.jsonl` en producción se pierde al redeploy (el tmp del contenedor es efímero). Cuando exista Postgres se va el archivo.

---

## 7. Cómo está organizada la información del proyecto

| Archivo | Para qué |
|---|---|
| `corrector-fp/README.md` | Guía operativa: arrancar, scripts, deploy, comandos |
| `corrector-fp/MEMORIA.md` | Este documento — contexto, decisiones, qué falta |
| `corrector-fp/.env.example` | Variables de entorno con explicación |
| `corrector-fp/fly.toml` | Config de producción Fly.io |
| `corrector-fp/Dockerfile` | Multi-stage para deploy |
| `.github/workflows/deploy.yml` | CI/CD: push a main → Fly |

Lo que **NO** está en el repo (excluido en `.gitignore`):
- PDFs y `.md` de contexto (`PROJECT_CONTEXT.md`, `contexto1.md`, `contexto2.md`)
- Carpetas exploratorias (`legacy/`, `design-previews/`, `web/`)
- Locales de Claude Code (`.claude/`, `.agents/`)
- `tmp/` (datos efímeros)

---

## 8. Cómo razonar antes de cambiar cosas

**Antes de tocar `domain/`:** te mueves al núcleo del proyecto. Cualquier cambio aquí ripplea por toda la app. Pregúntate: ¿es lógica pura? ¿no depende de React/Next/HTTP? ¿está expresada en términos del dominio (FP, kVAR, histéresis)? Si la respuesta a alguna es no, probablemente va en `application/` o `infrastructure/`.

**Antes de tocar `application/`:** los casos de uso son orquestadores. Reciben puertos por DI, devuelven datos del dominio. Si tu caso de uso necesita hablar con HTTP/DB/email directamente, lo estás haciendo mal — necesita un puerto nuevo en `domain/ports/` y un adapter en `infrastructure/`.

**Antes de tocar `infrastructure/`:** estás escribiendo un adapter. El test mental es: ¿podría reemplazar este archivo por otro que cumpla la misma interfaz sin que nada arriba se entere? Si la respuesta es sí, vas bien.

**Antes de tocar `presentation/`:** componentes React puros que consumen casos de uso a través del container. Si necesitas datos nuevos, sale de un caso de uso. Si necesitas un caso de uso nuevo, lo agregas en `application/` y lo expones en el container.

**Antes de tocar `app/`:** son las rutas de Next.js + las rutas API. Aquí hay frontera HTTP y de SSR/CSR. Mantén estos archivos delgados — la lógica vive en `application/`, no aquí.

---

## 9. Línea de tiempo

| Fecha | Hito |
|---|---|
| Abril 2026 | Repo inicial con landing + 10 secciones + simulación demo |
| Abril 2026 | Clean architecture + adapters + dashboard amigable + form leads + visor 3D + tema global + deploy Fly |
| Mayo 2026 | (TODO) GLB real + Postgres conectado + Resend |
| **30 / 04 / 2026** | **Entrega final del Proyecto Integrado de Ingeniería** |

---

## 10. Una nota sobre honestidad

Este proyecto se presenta como FactorPro pero todavía no existe un dispositivo terminado. La landing y el dashboard usan datos simulados que reflejan el firmware diseñado. Cada cifra especulativa lleva un badge `Estimación`, `Proyección` o `Concepto`. Cuando el hardware esté listo y empiece a ingestar lecturas reales, los badges se quitan y los números se vuelven medidos.

Esa decisión de honestidad visual no es cosmética: es lo que diferencia un proyecto académico defendible de un demo que infla resultados. Cualquier persona que llegue a este repo y agregue una cifra nueva debería preguntarse: ¿esto está medido, proyectado o estimado? Y poner el badge correspondiente.

---

**Última actualización:** abril 2026
**Mantenedor actual:** Juan Pablo Castaño Uribe
