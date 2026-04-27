/**
 * Banco escalonado binario 1:2:4 → 7 niveles discretos.
 * El estado del banco se representa como una máscara de bits (0..7).
 */

import { BANCO_CAPACITORES } from "./constants";
import type { CapacitorStep, Kvar } from "./types";

export const BANK_LEVELS = 7; // 2^3 − 1

/** kVAR totales para una combinación de escalones codificada en bits. */
export function kvarAtLevel(mask: number): Kvar {
  let total = 0;
  for (const step of BANCO_CAPACITORES) {
    if ((mask >> step.id) & 1) total += step.kvar;
  }
  return total;
}

/** Máscara mínima que aporta al menos `targetKvar`; capa a `BANK_LEVELS`. */
export function smallestMaskAtLeast(targetKvar: Kvar): number {
  for (let mask = 0; mask <= BANK_LEVELS; mask++) {
    if (kvarAtLevel(mask) >= targetKvar) return mask;
  }
  return BANK_LEVELS;
}

/** Expande una máscara a la vista de escalones con su estado actual. */
export function describeBank(mask: number): readonly CapacitorStep[] {
  return BANCO_CAPACITORES.map((step) => ({
    id: step.id,
    microFarads: step.microFarads,
    kvar: step.kvar,
    engaged: Boolean((mask >> step.id) & 1),
  }));
}
