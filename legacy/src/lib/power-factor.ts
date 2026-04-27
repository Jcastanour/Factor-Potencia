/**
 * Lógica del corrector de factor de potencia para la demo.
 * Valores consistentes con el firmware real del prototipo ESP32.
 */

export const GRID = { V_RMS: 120, FREQ_HZ: 60 } as const;

export const CONTROL = {
  FP_LOWER: 0.88,
  FP_UPPER: 0.97,
  FP_TARGET: 0.95,
  SWITCH_DELAY_MS_REAL: 30_000,
  SWITCH_DELAY_MS_DEMO: 600,
} as const;

// Banco binario 1:2:4
// Nota: los capacitores físicos son 5/10/20 µF a 450 V, pero el dispositivo
// entrega en servicio 1/2/4 kVAR por escalón (7 niveles totales 1–7 kVAR)
// según especificación de diseño del proyecto.
export const BANK_STEPS_UF = [5, 10, 20] as const;
export const BANK_STEPS_KVAR = [1, 2, 4] as const;

export const PENALTY = {
  MIN_COP: 25_000,
  MAX_COP: 1_500_000,
} as const;

export type Mode = "INIT" | "AUTOCAL" | "DIAGNOSTIC_24H" | "ACTIVE";

/** cos(φ) del desfase */
export function fpFromAngle(phiRad: number) {
  return Math.cos(phiRad);
}

/** Qc requerida para llevar de fp1 a fp2 dado P activa (W) */
export function qcRequired(P_W: number, fp1: number, fp2: number) {
  return P_W * (Math.tan(Math.acos(fp1)) - Math.tan(Math.acos(fp2)));
}

/** kVAR entregados por una capacitancia (µF) a la tensión V y frecuencia f */
export function kvarOfCap(C_uF: number, V = GRID.V_RMS, f = GRID.FREQ_HZ) {
  return (2 * Math.PI * f * V * V * C_uF * 1e-6) / 1000;
}

/** Triángulo de potencias */
export function powerTriangle(P_W: number, fp: number) {
  const S = P_W / Math.max(fp, 1e-3);
  const Q = Math.sqrt(Math.max(S * S - P_W * P_W, 0));
  return { P: P_W, Q, S };
}

/** FP resultante al inyectar Qc capacitiva sobre una carga P, Q inductiva */
export function fpAfterCompensation(P_W: number, Q_VAR: number, Qc_VAR: number) {
  const Qnet = Q_VAR - Qc_VAR;
  const S = Math.sqrt(P_W * P_W + Qnet * Qnet);
  return P_W / S;
}

/** kVAR total del banco según bitmask (bit 0 = escalón 1 kVAR, bit 1 = 2 kVAR, bit 2 = 4 kVAR) */
export function bankKvar(mask: number) {
  let total = 0;
  BANK_STEPS_KVAR.forEach((kvar, i) => {
    if (mask & (1 << i)) total += kvar;
  });
  return total;
}

/** Tick del control activo con histéresis */
export function controlStep(params: {
  fp: number;
  mask: number;
  now: number;
  lastSwitch: number;
  delayMs?: number;
}) {
  const delay = params.delayMs ?? CONTROL.SWITCH_DELAY_MS_DEMO;
  if (params.now - params.lastSwitch < delay) {
    return { mask: params.mask, fired: false };
  }
  if (params.fp < CONTROL.FP_LOWER && params.mask < 0b111) {
    return { mask: params.mask + 1, fired: true };
  }
  if (params.fp > CONTROL.FP_UPPER && params.mask > 0) {
    return { mask: params.mask - 1, fired: true };
  }
  return { mask: params.mask, fired: false };
}

/** Mapeo no-lineal de FP → penalización mensual estimada (COP) */
export function penaltyFromFP(fp: number, P_W: number): number {
  if (fp >= 0.9) return 0;
  // Escala proporcional al déficit de FP y a la potencia
  const deficit = (0.9 - fp) / 0.3; // 0..1 cuando fp pasa de 0.9 a 0.6
  const sizeFactor = Math.min(P_W / 5000, 3); // 1x a 5kW, hasta 3x a 15kW
  const raw = PENALTY.MIN_COP + deficit * sizeFactor * (PENALTY.MAX_COP - PENALTY.MIN_COP);
  return Math.round(Math.min(Math.max(raw, 0), PENALTY.MAX_COP) / 1000) * 1000;
}

/** Color para el medidor según FP */
export function fpColor(fp: number): string {
  if (fp < 0.8) return "var(--accent-bad)";
  if (fp < 0.9) return "var(--accent-warn)";
  if (fp < 0.95) return "var(--accent-signal)";
  return "var(--accent-ok)";
}
