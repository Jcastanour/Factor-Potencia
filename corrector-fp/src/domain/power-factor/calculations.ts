/**
 * Cálculos puros del triángulo de potencias y magnitudes derivadas.
 * Todas las funciones son puras — sin efectos secundarios, sin I/O.
 */

import type { BusReading, Kvar, Kw, PhaseAngle, PowerFactor } from "./types";

/** Clamp a [0, 1]. */
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * Desfase φ a partir del factor de potencia (asumiendo carga inductiva, φ ≥ 0).
 * fp = cos(φ) ⇒ φ = arccos(fp).
 */
export function phaseFromPowerFactor(fp: PowerFactor): PhaseAngle {
  return Math.acos(clamp01(fp));
}

/** FP a partir del desfase φ. */
export function powerFactorFromPhase(phi: PhaseAngle): PowerFactor {
  return clamp01(Math.cos(phi));
}

/** Potencia reactiva Q a partir de P activa y FP. Q = P · tan(arccos(fp)). */
export function reactiveFromActive(activeKw: Kw, fp: PowerFactor): Kvar {
  return activeKw * Math.tan(phaseFromPowerFactor(fp));
}

/** Potencia aparente S = √(P² + Q²). */
export function apparentFromComponents(activeKw: Kw, reactiveKvar: Kvar): number {
  return Math.hypot(activeKw, reactiveKvar);
}

/**
 * Lectura completa del bus a partir de P y FP.
 * Útil para la demo: el usuario fija carga activa y FP, derivamos el resto.
 */
export function readingFromActiveAndFp(activeKw: Kw, fp: PowerFactor): BusReading {
  const safeFp = clamp01(fp);
  const phi = phaseFromPowerFactor(safeFp);
  const reactive = activeKw * Math.tan(phi);
  const apparent = Math.hypot(activeKw, reactive);
  return {
    activeKw,
    reactiveKvar: reactive,
    apparentKva: apparent,
    powerFactor: safeFp,
    phaseRadians: phi,
  };
}

/**
 * Nuevo FP tras compensar `compensatedKvar` kVAR capacitivos sobre una lectura dada.
 * Q_nuevo = Q_actual − Q_comp ; fp = P / √(P² + Q_nuevo²).
 */
export function applyCompensation(reading: BusReading, compensatedKvar: Kvar): BusReading {
  const newReactive = reading.reactiveKvar - compensatedKvar;
  const newApparent = Math.hypot(reading.activeKw, newReactive);
  const newFp = newApparent === 0 ? 1 : reading.activeKw / newApparent;
  return {
    activeKw: reading.activeKw,
    reactiveKvar: newReactive,
    apparentKva: newApparent,
    powerFactor: clamp01(newFp),
    phaseRadians: Math.atan2(newReactive, reading.activeKw),
  };
}
