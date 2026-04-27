import type {
  Amperes,
  PowerFactor,
  VoltAmperes,
  Vars,
  Volts,
  Watts,
} from "./value-objects";

/**
 * Lectura instantánea reportada por el dispositivo.
 * `id` se asigna en el adapter de persistencia.
 * `ts` es el timestamp del firmware (no el de recepción).
 */
export interface Reading {
  readonly id: string;
  readonly deviceId: string;
  readonly ts: string; // ISO-8601
  readonly pf: PowerFactor;
  readonly pW: Watts;
  readonly qVar: Vars;
  readonly sVa: VoltAmperes;
  readonly vRms: Volts;
  readonly iRms: Amperes;
  readonly activeStage: number; // 0..7 mask del banco
  readonly raw?: Record<string, unknown>;
}

export type ReadingDraft = Omit<Reading, "id">;
