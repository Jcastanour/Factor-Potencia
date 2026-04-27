"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { demo } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";
import { WaveformChart } from "@/components/charts/WaveformChart";
import { FPMeter } from "@/components/charts/FPMeter";
import {
  CONTROL,
  bankKvar,
  controlStep,
  fpAfterCompensation,
  penaltyFromFP,
  powerTriangle,
  BANK_STEPS_UF,
  BANK_STEPS_KVAR,
} from "@/lib/power-factor";
import { fmtCOP } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Demo() {
  const [corrector, setCorrector] = useState(true);
  const [P, setP] = useState(5000);
  const [fpBase, setFpBase] = useState(0.72);
  const [mask, setMask] = useState(0);
  const lastSwitchRef = useRef(0);

  const { Q } = useMemo(() => powerTriangle(P, fpBase), [P, fpBase]);
  const QcBank = useMemo(() => bankKvar(mask) * 1000, [mask]); // VAR
  const fpNow = corrector ? fpAfterCompensation(P, Q, QcBank) : fpBase;

  // Lazo de control (histéresis) cuando corrector está encendido
  useEffect(() => {
    if (!corrector) {
      setMask(0);
      return;
    }
    const id = setInterval(() => {
      const now = performance.now();
      const current = fpAfterCompensation(P, Q, bankKvar(mask) * 1000);
      const { mask: nextMask, fired } = controlStep({
        fp: current,
        mask,
        now,
        lastSwitch: lastSwitchRef.current,
        delayMs: CONTROL.SWITCH_DELAY_MS_DEMO,
      });
      if (fired) {
        lastSwitchRef.current = now;
        setMask(nextMask);
      }
    }, 300);
    return () => clearInterval(id);
  }, [corrector, P, Q, mask]);

  const penaltyBase = penaltyFromFP(fpBase, P);
  const penaltyNow = penaltyFromFP(fpNow, P);
  const savings = Math.max(0, penaltyBase - penaltyNow);

  const bankLevel = [...Array(3)].map((_, i) => !!(mask & (1 << i)));

  return (
    <Section id="demo">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={demo.eyebrow}
            headline={demo.headline}
            body={demo.body}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Panel principal: onda + medidor + banco */}
          <Reveal className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
            <div className="flex items-center justify-between">
              <Monolabel>Señales en tiempo real · 60 Hz</Monolabel>
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.22em]",
                  corrector ? "text-[var(--accent-ok)]" : "text-[var(--accent-warn)]",
                )}
              >
                {corrector ? "CORRECTOR · ON" : "CORRECTOR · OFF"}
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-sm">
              <WaveformChart fp={fpNow} width={720} height={200} className="w-full" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <Monolabel>Banco escalonado · 3 condensadores</Monolabel>
                <div className="mt-4 flex items-end gap-3">
                  {BANK_STEPS_UF.map((uF, i) => (
                    <div key={uF} className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "flex h-20 w-12 items-end justify-center overflow-hidden rounded-sm border transition-all",
                          bankLevel[i]
                            ? "border-[var(--accent-electric)] bg-[var(--accent-electric)]/10 glow-cyan"
                            : "border-[var(--hairline)] bg-[var(--bg-base)]",
                        )}
                      >
                        <div
                          className={cn(
                            "w-full bg-gradient-to-t from-[var(--accent-electric)]/40 to-transparent transition-all",
                            bankLevel[i] ? "h-full" : "h-0",
                          )}
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg-muted)]">
                        {uF} µF
                      </span>
                      <span className="font-mono text-[10px] text-[var(--fg-dim)]">
                        {BANK_STEPS_KVAR[i]} kVAR
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs text-[var(--fg-muted)]">
                  Nivel activo:{" "}
                  <span className="text-[var(--accent-electric)]">
                    {mask.toString(2).padStart(3, "0")}
                  </span>
                  {"  "}· Q compensada:{" "}
                  <span className="text-[var(--accent-electric)]">
                    {(QcBank / 1000).toFixed(2)} kVAR
                  </span>
                </p>
              </div>

              <FPMeter fp={fpNow} size={220} className="justify-self-center" />
            </div>
          </Reveal>

          {/* Controles + impacto */}
          <Reveal delay={120} className="flex flex-col gap-6">
            <div className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
              <Monolabel>Controles</Monolabel>

              <div className="mt-6">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-[var(--fg-primary)]">
                    Corrector automático
                  </span>
                  <button
                    type="button"
                    onClick={() => setCorrector((v) => !v)}
                    aria-pressed={corrector}
                    className={cn(
                      "relative h-6 w-11 rounded-full border transition-colors",
                      corrector
                        ? "border-[var(--accent-ok)] bg-[var(--accent-ok)]/30"
                        : "border-[var(--hairline)] bg-[var(--bg-surface)]",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-[var(--fg-primary)] transition-transform",
                        corrector ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </label>
              </div>

              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow">Potencia activa</span>
                  <span className="font-mono text-sm text-[var(--fg-primary)] tabular-nums">
                    {(P / 1000).toFixed(1)} kW
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={250}
                  value={P}
                  onChange={(e) => setP(parseInt(e.target.value, 10))}
                  className="mt-3 w-full accent-[var(--accent-electric)]"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow">FP base (sin compensar)</span>
                  <span className="font-mono text-sm text-[var(--accent-warn)] tabular-nums">
                    {fpBase.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={0.9}
                  step={0.01}
                  value={fpBase}
                  onChange={(e) => {
                    setFpBase(parseFloat(e.target.value));
                    setMask(0);
                  }}
                  className="mt-3 w-full accent-[var(--accent-warn)]"
                />
              </div>
            </div>

            <div className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
              <Monolabel>Impacto mensual estimado</Monolabel>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                    Penalización
                  </div>
                  <div
                    className="mt-1 font-mono text-2xl font-semibold tabular-nums"
                    style={{
                      color: penaltyNow > 0 ? "var(--accent-warn)" : "var(--accent-ok)",
                    }}
                  >
                    {fmtCOP(penaltyNow)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                    Ahorro vs sin corrector
                  </div>
                  <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--accent-ok)]">
                    {fmtCOP(savings)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[var(--fg-dim)]">
                Aproximación pedagógica basada en la escala CREG del factor multiplicador M
                (1–12). No constituye una proyección contractual.
              </p>
            </div>
          </Reveal>
        </div>
      </SectionInner>
    </Section>
  );
}
