/**
 * Política de penalización derivada de CREG 101-035 / 2024.
 * Aproximación pedagógica — usa un factor multiplicador M proporcional al déficit
 * de FP y a la potencia instalada. No es contractual.
 */

import { FP_REGULATORIO_MIN, PENALIZACION_COP } from "./constants";
import type { Kw, PowerFactor } from "./types";

export function penaltyFromFp(fp: PowerFactor, activeKw: Kw): number {
  if (fp >= FP_REGULATORIO_MIN) return 0;
  const deficit = (FP_REGULATORIO_MIN - fp) / 0.3; // 0..1 desde 0.90 a 0.60
  const sizeFactor = Math.min(activeKw / 5, 3); // 1× a 5 kW, cap 3×
  const span = PENALIZACION_COP.max - PENALIZACION_COP.min;
  const raw = PENALIZACION_COP.min + deficit * sizeFactor * span;
  const clamped = Math.min(Math.max(raw, 0), PENALIZACION_COP.max);
  return Math.round(clamped / 1000) * 1000;
}

export type FpQuality = "bad" | "warn" | "signal" | "ok";

export function fpQuality(fp: PowerFactor): FpQuality {
  if (fp < 0.8) return "bad";
  if (fp < 0.9) return "warn";
  if (fp < 0.95) return "signal";
  return "ok";
}
