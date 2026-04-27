/**
 * Constantes regulatorias y del prototipo. No inventar — ver PROJECT_CONTEXT §11.
 */

import type { HysteresisConfig } from "./types";

/** Factor de potencia mínimo exigido por CREG 101-035/2024. */
export const FP_REGULATORIO_MIN = 0.9;

/** Rango típico de FP en MiPymes sin compensar. */
export const FP_RANGO_TIPICO = { min: 0.6, max: 0.85 } as const;

/** Red objetivo del prototipo (monofásico residencial/comercial). */
export const RED_OBJETIVO = {
  voltageVolts: 120,
  frequencyHz: 60,
} as const;

/** Configuración por defecto del controlador de histéresis. */
export const HISTERESIS_DEFAULT: HysteresisConfig = {
  target: 0.95,
  lower: 0.88,
  upper: 0.97,
  dwellSeconds: 30,
};

/**
 * Banco escalonado binario 1:2:4 → 7 niveles discretos.
 * Capacitancias a 450 V; aporte kVAR calculado a 120 V / 60 Hz.
 */
export const BANCO_CAPACITORES = [
  { id: 0, microFarads: 5, kvar: 1 },
  { id: 1, microFarads: 10, kvar: 2 },
  { id: 2, microFarads: 20, kvar: 4 },
] as const;

/** Rango de penalización mensual observado en MiPymes (COP). */
export const PENALIZACION_COP = { min: 25_000, max: 1_500_000 } as const;

/** Ahorro mensual esperado tras corrección (COP). */
export const AHORRO_MENSUAL_COP = { min: 25_000, max: 150_000 } as const;
