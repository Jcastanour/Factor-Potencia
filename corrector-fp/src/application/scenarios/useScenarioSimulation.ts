"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  applyCompensation,
  BANK_LEVELS,
  decide,
  HISTERESIS_DEFAULT,
  kvarAtLevel,
  penaltyFromFp,
  readingFromActiveAndFp,
  type BusReading,
  type ControllerState,
} from "@domain/power-factor";
import type { Scenario } from "@domain/scenarios/scenarios";

export interface ScenarioState {
  readonly corrector: boolean;
  readonly baseReading: BusReading;
  readonly compensatedReading: BusReading;
  readonly mask: number;
  readonly compensatedKvar: number;
  readonly penaltyBefore: number;
  readonly penaltyAfter: number;
  readonly savings: number;
  readonly activeEvent: string | null;
  readonly nowMs: number;
}

const TICK_MS = 250;
const DWELL_SECONDS = 0.6;

/**
 * Simulación cliente-side de un escenario completo (carga base + eventos pulsantes
 * del comercio). El controlador de histéresis del dominio decide la conmutación
 * del banco. Se usa en la landing para el demo y en el dashboard amigable
 * cuando llega `?escenario=` en la URL.
 *
 * Cuando el dispositivo real ingiere por /api/telemetry/ingest, el dashboard
 * cambia a SSE y este hook deja de usarse — el contrato de Reading es el mismo.
 */
export function useScenarioSimulation(
  scenario: Scenario,
  options?: { corrector?: boolean },
): ScenarioState {
  const corrector = options?.corrector ?? true;
  const [tick, setTick] = useState(0);
  const [mask, setMask] = useState(0);
  const lastSwitchRef = useRef(0);
  const startRef = useRef(performance.now());

  // Loop de simulación
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Eventos activos según ventana temporal
  const elapsed = (tick * TICK_MS) / 1000;
  const activeEvent = useMemo(() => {
    for (const ev of scenario.events) {
      const phase = elapsed % ev.periodSeconds;
      if (phase < ev.durationSeconds) return ev;
    }
    return null;
  }, [scenario.events, elapsed]);

  // Carga + FP base (con evento pulsante aplicado)
  const activeKw = scenario.baseLoadKw + (activeEvent?.deltaKw ?? 0);
  const baseFp = Math.max(0.5, Math.min(0.99, scenario.baseFp + (activeEvent?.deltaFp ?? 0)));

  const baseReading = useMemo(
    () => readingFromActiveAndFp(activeKw, baseFp),
    [activeKw, baseFp],
  );

  const compensatedKvar = kvarAtLevel(mask);
  const compensatedReading = corrector
    ? applyCompensation(baseReading, compensatedKvar)
    : baseReading;

  // Controlador de histéresis
  useEffect(() => {
    if (!corrector) {
      setMask(0);
      lastSwitchRef.current = 0;
      return;
    }
    const now = performance.now() / 1000;
    const current = applyCompensation(baseReading, kvarAtLevel(mask));
    const state: ControllerState = { level: mask, lastSwitchAt: lastSwitchRef.current };
    const decision = decide(current.powerFactor, state, now, {
      ...HISTERESIS_DEFAULT,
      dwellSeconds: DWELL_SECONDS,
    });
    if (decision.action !== "hold" && decision.nextLevel !== mask) {
      const next = Math.max(0, Math.min(BANK_LEVELS, decision.nextLevel));
      lastSwitchRef.current = now;
      setMask(next);
    }
  }, [corrector, baseReading, mask, tick]);

  const penaltyBefore = penaltyFromFp(baseReading.powerFactor, baseReading.activeKw);
  const penaltyAfter = penaltyFromFp(compensatedReading.powerFactor, compensatedReading.activeKw);
  const savings = Math.max(0, penaltyBefore - penaltyAfter);

  return {
    corrector,
    baseReading,
    compensatedReading,
    mask,
    compensatedKvar,
    penaltyBefore,
    penaltyAfter,
    savings,
    activeEvent: activeEvent?.label ?? null,
    nowMs: startRef.current + elapsed * 1000,
  };
}
