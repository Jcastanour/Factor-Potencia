/**
 * Controlador de histéresis: decide si sube, baja o mantiene el nivel del banco.
 * Incluye retardo mínimo entre conmutaciones (`dwellSeconds`).
 */

import { BANK_LEVELS } from "./capacitor-bank";
import type { HysteresisConfig, PowerFactor } from "./types";

export type ControlAction = "hold" | "engage" | "disengage";

export interface ControllerState {
  readonly level: number;
  readonly lastSwitchAt: number;
}

export interface ControlDecision {
  readonly action: ControlAction;
  readonly nextLevel: number;
  readonly reason: string;
}

/**
 * Decide la siguiente acción dado:
 *  - FP actual medido
 *  - estado del controlador
 *  - tiempo actual en segundos
 *  - configuración de histéresis
 */
export function decide(
  fp: PowerFactor,
  state: ControllerState,
  nowSeconds: number,
  config: HysteresisConfig,
): ControlDecision {
  const waited = nowSeconds - state.lastSwitchAt >= config.dwellSeconds;

  if (fp < config.lower && state.level < BANK_LEVELS) {
    return waited
      ? { action: "engage", nextLevel: state.level + 1, reason: `fp<${config.lower} → sube escalón` }
      : { action: "hold", nextLevel: state.level, reason: "dwell pendiente" };
  }

  if (fp > config.upper && state.level > 0) {
    return waited
      ? { action: "disengage", nextLevel: state.level - 1, reason: `fp>${config.upper} → baja escalón` }
      : { action: "hold", nextLevel: state.level, reason: "dwell pendiente" };
  }

  return { action: "hold", nextLevel: state.level, reason: "dentro de banda" };
}
