/**
 * Generador determinista (PRNG con seed) que produce lecturas coherentes con el
 * dominio power-factor existente: usa histéresis y banco de capacitores reales.
 * Implementa solo lectura — writes no soportados (es solo simulación).
 */

import {
  BANCO_CAPACITORES,
  HISTERESIS_DEFAULT,
  RED_OBJETIVO,
  decide,
  kvarAtLevel,
  reactiveFromActive,
} from "@domain/power-factor";
import type { DomainEvent, DomainEventDraft } from "@domain/events";
import type {
  TelemetrySource,
  TelemetryWindow,
  Unsubscribe,
} from "@domain/ports";
import type { Reading, ReadingDraft } from "@domain/telemetry";

interface Options {
  readonly deviceId: string;
  readonly intervalMs?: number;
  readonly seed?: number;
}

let counter = 0;
const nextId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

// PRNG mulberry32 — determinista
function makePrng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class SimulatedTelemetrySource implements TelemetrySource {
  private readonly deviceId: string;
  private readonly intervalMs: number;
  private readonly rand: () => number;
  private level = 0;
  private lastSwitchAt = 0;
  private readonly history: Reading[] = [];
  private readonly subs = new Set<(r: Reading) => void>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private startAt: number;

  constructor(opts: Options) {
    this.deviceId = opts.deviceId;
    this.intervalMs = opts.intervalMs ?? 2000;
    this.rand = makePrng(opts.seed ?? 0xc0ffee);
    this.startAt = Date.now();
  }

  private ensureTimer() {
    if (this.timer || typeof setInterval === "undefined") return;
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    if (typeof this.timer === "object" && this.timer && "unref" in this.timer) {
      (this.timer as { unref: () => void }).unref();
    }
  }

  private tick() {
    const reading = this.synthesizeReading();
    this.history.unshift(reading);
    if (this.history.length > 240) this.history.pop();
    this.subs.forEach((fn) => {
      try {
        fn(reading);
      } catch {
        /* ignore */
      }
    });
  }

  private synthesizeReading(): Reading {
    const nowSec = (Date.now() - this.startAt) / 1000;
    // Carga activa sintética: oscila 0.8..1.6 kW con ruido
    const baseKw = 1.2 + 0.3 * Math.sin(nowSec / 30) + (this.rand() - 0.5) * 0.15;
    const activeKw = Math.max(0.4, baseKw);

    // FP "real" antes de compensar: 0.72..0.85 con variación
    const naturalFp = 0.78 + (this.rand() - 0.5) * 0.06;

    // El controlador decide a partir del FP medido (con compensación actual aplicada)
    const compensatedKvar = kvarAtLevel(this.level);
    const naturalReactive = reactiveFromActive(activeKw, naturalFp);
    const compensatedReactive = Math.max(0, naturalReactive - compensatedKvar);
    const apparent = Math.hypot(activeKw, compensatedReactive);
    const measuredFp = apparent === 0 ? 1 : activeKw / apparent;

    const decision = decide(
      measuredFp,
      { level: this.level, lastSwitchAt: this.lastSwitchAt },
      nowSec,
      HISTERESIS_DEFAULT,
    );
    if (decision.action !== "hold") {
      this.level = decision.nextLevel;
      this.lastSwitchAt = nowSec;
    }

    return {
      id: nextId("sim"),
      deviceId: this.deviceId,
      ts: new Date().toISOString(),
      pf: Math.max(0, Math.min(1, measuredFp)),
      pW: activeKw * 1000,
      qVar: compensatedReactive * 1000,
      sVa: apparent * 1000,
      vRms: RED_OBJETIVO.voltageVolts,
      iRms: (apparent * 1000) / RED_OBJETIVO.voltageVolts,
      activeStage: this.level,
    };
  }

  async writeReading(_draft: ReadingDraft): Promise<Reading> {
    throw new Error("SimulatedTelemetrySource is read-only");
  }

  async latestReading(deviceId: string): Promise<Reading | null> {
    if (deviceId !== this.deviceId) return null;
    this.ensureTimer();
    if (this.history.length === 0) this.tick();
    return this.history[0] ?? null;
  }

  async listReadings(window: TelemetryWindow): Promise<readonly Reading[]> {
    if (window.deviceId !== this.deviceId) return [];
    this.ensureTimer();
    return window.limit ? this.history.slice(0, window.limit) : this.history.slice();
  }

  subscribeReadings(deviceId: string, listener: (r: Reading) => void): Unsubscribe {
    if (deviceId !== this.deviceId) return () => {};
    this.ensureTimer();
    this.subs.add(listener);
    return () => {
      this.subs.delete(listener);
    };
  }

  async writeEvent(_draft: DomainEventDraft): Promise<DomainEvent> {
    throw new Error("SimulatedTelemetrySource is read-only");
  }

  async listEvents(_window: TelemetryWindow): Promise<readonly DomainEvent[]> {
    return [];
  }

  /** Conveniencia para testing/diagnóstico. */
  readonly capacitors = BANCO_CAPACITORES;
}
