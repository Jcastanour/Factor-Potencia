/**
 * Tipos del dominio de factor de potencia.
 * Ver PROJECT_CONTEXT §3 y §11 para valores de referencia.
 */

/** Factor de potencia adimensional ∈ [0, 1]. */
export type PowerFactor = number;

/** Potencia reactiva en kVAR. */
export type Kvar = number;

/** Potencia activa en kW. */
export type Kw = number;

/** Potencia aparente en kVA. */
export type Kva = number;

/** Ángulo de desfase φ en radianes. */
export type PhaseAngle = number;

/** Un escalón del banco de condensadores. */
export interface CapacitorStep {
  /** Índice 0..N-1 del escalón. */
  readonly id: number;
  /** Capacitancia nominal en microfaradios (µF). */
  readonly microFarads: number;
  /** Potencia reactiva entregada a 120 V / 60 Hz (kVAR). */
  readonly kvar: Kvar;
  /** Si está actualmente conectado al bus. */
  readonly engaged: boolean;
}

/** Estado de los 4 modos secuenciales del controlador. */
export type ControllerMode =
  | "initialization"
  | "autocalibration"
  | "diagnostic"
  | "active-control";

/** Parámetros de control de histéresis. */
export interface HysteresisConfig {
  /** FP objetivo (default 0.95). */
  readonly target: PowerFactor;
  /** Umbral inferior: bajo este valor se conecta escalón adicional (default 0.88). */
  readonly lower: PowerFactor;
  /** Umbral superior: sobre este valor se desconecta un escalón (default 0.97). */
  readonly upper: PowerFactor;
  /** Retardo mínimo entre conmutaciones en segundos (default 30). */
  readonly dwellSeconds: number;
}

/** Medición instantánea del bus. */
export interface BusReading {
  readonly activeKw: Kw;
  readonly reactiveKvar: Kvar;
  readonly apparentKva: Kva;
  readonly powerFactor: PowerFactor;
  readonly phaseRadians: PhaseAngle;
}
