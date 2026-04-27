---
name: reactive-power-demo-logic
description: Lógica numérica y de estado para la demo interactiva de corrección de factor de potencia. Actívalo al implementar lib/power-factor.ts, la sección DemoInteractive, medidores, ondas o simulación de histéresis.
---

# Reactive Power Demo Logic

Especificación operativa para simular el corrector en el cliente. Todos los valores son consistentes con el firmware real descrito en el PDF del proyecto.

## Parámetros base

```ts
export const GRID = { V_RMS: 120, FREQ_HZ: 60 } as const;

export const CONTROL = {
  FP_LOWER: 0.88,     // < → conectar escalón
  FP_UPPER: 0.97,     // > → desconectar escalón
  FP_TARGET: 0.95,
  SWITCH_DELAY_MS: 30_000, // en la demo se puede acelerar a 1500 ms
} as const;

// Banco binario 1:2:4 → 7 niveles discretos.
// Cada índice es un bitmask: b0 = 5µF, b1 = 10µF, b2 = 20µF
export const BANK_STEPS_UF = [5, 10, 20] as const;
// kVAR aproximados por paso a 120V/60Hz (ver cálculo abajo)
```

## Fórmulas

```ts
// Triángulo de potencias
// S² = P² + Q²
// FP = P / S = cos(φ)
// Potencia reactiva capacitiva necesaria:
// Qc = P * (tan(arccos(FP1)) - tan(arccos(FP2)))

// Capacitancia para Qc a V, f:
// C = Qc / (2π · f · V²)

export function fpFromAngle(phiRad: number) {
  return Math.cos(phiRad);
}

export function qcRequired(P_W: number, fp1: number, fp2: number) {
  return P_W * (Math.tan(Math.acos(fp1)) - Math.tan(Math.acos(fp2)));
}

export function kvarOfCap(C_uF: number, V = GRID.V_RMS, f = GRID.FREQ_HZ) {
  return (2 * Math.PI * f * V * V * C_uF * 1e-6) / 1000;
}
```

## Máquina de estados (4 modos)

```
INIT ─► AUTOCAL ─► DIAGNOSTIC_24H ─► ACTIVE_CONTROL
                                      │  ▲
                                      └──┘ (lazo de histéresis)
```

En la demo interactiva se muestra **ACTIVE_CONTROL** con la posibilidad de recorrer los modos via un timeline scroll.

## Lógica de histéresis (tick del control activo)

```ts
function step(fp: number, activeMask: number, now: number, lastSwitch: number) {
  if (now - lastSwitch < CONTROL.SWITCH_DELAY_MS) return { activeMask, fired: false };
  if (fp < CONTROL.FP_LOWER && activeMask < 0b111) {
    return { activeMask: activeMask + 1, fired: true };
  }
  if (fp > CONTROL.FP_UPPER && activeMask > 0) {
    return { activeMask: activeMask - 1, fired: true };
  }
  return { activeMask, fired: false };
}
```

Para la demo, incrementar `activeMask` de forma binaria es suficiente (no necesitamos buscar el subconjunto óptimo). El usuario ve el banco subiendo/bajando en pasos.

## Visualizaciones derivadas

1. **Onda V/I** — dos sinusoides a 60 Hz, fase inicial de I según `φ = arccos(FP_actual)`. Animar la fase al reducirse al compensar.
2. **Triángulo P/Q/S** — SVG con lados que cambian de largo al modificar Q.
3. **Medidor FP** — arco semi-circular 0→1, color interpolado rojo (0.60) → ámbar (0.88) → verde (0.95+).
4. **Indicador de banco** — 3 LEDs/barras que se encienden según bits del `activeMask`.
5. **Contador de ahorro** — mapear `FP_actual` a rango de penalización `25k – 1.5M` con función monotónica; animar con `useTransition`.

## Defaults para la demo

- Carga inicial: panadería típica — `P = 5000 W`, `FP_inicial = 0,72`.
- Sliders expuestos: potencia activa (1–10 kW), FP inicial (0,60–0,90).
- Toggle: "Sin corrector" vs "Con corrector".
- `SWITCH_DELAY_MS` acelerado a **1500 ms** en la demo para que sea visible sin esperar medio minuto real.
