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
  type PowerFactor,
} from "@domain/power-factor";

export interface DemoState {
  readonly corrector: boolean;
  readonly baseReading: BusReading;
  readonly compensatedReading: BusReading;
  readonly mask: number;
  readonly compensatedKvar: number;
  readonly penaltyBefore: number;
  readonly penaltyAfter: number;
  readonly savings: number;
}

export interface DemoControls {
  setCorrector(enabled: boolean): void;
  setActiveKw(kw: number): void;
  setBaseFp(fp: PowerFactor): void;
}

export interface DemoSimulation {
  readonly state: DemoState;
  readonly controls: DemoControls;
  readonly activeKw: number;
  readonly baseFp: PowerFactor;
}

const TICK_MS = 250;
/** En la demo aceleramos el dwell del firmware (30 s → 0.6 s) para que se note. */
const DEMO_DWELL_SECONDS = 0.6;

export function useDemoSimulation(): DemoSimulation {
  const [corrector, setCorrector] = useState(true);
  const [activeKw, setActiveKw] = useState(5);
  const [baseFp, setBaseFp] = useState(0.72);
  const [mask, setMask] = useState(0);
  const lastSwitchRef = useRef(0);

  const baseReading = useMemo(() => readingFromActiveAndFp(activeKw, baseFp), [activeKw, baseFp]);

  const compensatedKvar = kvarAtLevel(mask);
  const compensatedReading = corrector
    ? applyCompensation(baseReading, compensatedKvar)
    : baseReading;

  useEffect(() => {
    if (!corrector) {
      setMask(0);
      lastSwitchRef.current = 0;
      return;
    }
    const id = setInterval(() => {
      const now = performance.now() / 1000;
      const current = applyCompensation(baseReading, kvarAtLevel(mask));
      const state: ControllerState = { level: mask, lastSwitchAt: lastSwitchRef.current };
      const decision = decide(current.powerFactor, state, now, {
        ...HISTERESIS_DEFAULT,
        dwellSeconds: DEMO_DWELL_SECONDS,
      });
      if (decision.action !== "hold" && decision.nextLevel !== mask) {
        const next = Math.max(0, Math.min(BANK_LEVELS, decision.nextLevel));
        lastSwitchRef.current = now;
        setMask(next);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [corrector, baseReading, mask]);

  const penaltyBefore = penaltyFromFp(baseReading.powerFactor, baseReading.activeKw);
  const penaltyAfter = penaltyFromFp(compensatedReading.powerFactor, compensatedReading.activeKw);
  const savings = Math.max(0, penaltyBefore - penaltyAfter);

  return {
    state: {
      corrector,
      baseReading,
      compensatedReading,
      mask,
      compensatedKvar,
      penaltyBefore,
      penaltyAfter,
      savings,
    },
    controls: {
      setCorrector,
      setActiveKw,
      setBaseFp,
    },
    activeKw,
    baseFp,
  };
}
