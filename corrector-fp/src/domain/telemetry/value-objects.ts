/**
 * Value objects de telemetría.
 * Las unidades del wire format (firmware → API) son SI base: watts, vars, voltios, amperios.
 * El dominio power-factor existente usa kW/kVAR para cifras "humanas" (cálculos visuales).
 * Los adapters convierten en el borde si hace falta.
 */

export type PowerFactor = number; // adimensional, [0, 1]
export type Watts = number;
export type Vars = number;
export type VoltAmperes = number;
export type Volts = number;
export type Amperes = number;

export const isValidPowerFactor = (x: number): boolean =>
  Number.isFinite(x) && x >= 0 && x <= 1;
