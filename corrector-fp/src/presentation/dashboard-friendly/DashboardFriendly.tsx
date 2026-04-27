"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useTheme } from "@shared/hooks/useTheme";
import { useScenarioSimulation } from "@application/scenarios/useScenarioSimulation";
import {
  SCENARIOS,
  isScenarioId,
  type Scenario,
  type ScenarioId,
} from "@domain/scenarios/scenarios";
import type { Reading } from "@domain/telemetry";
import { useTelemetryStream } from "@presentation/dashboard/useTelemetryStream";

import "./dashboard-light.css";

interface Props {
  readonly initialReading: Reading | null;
  readonly deviceId: string;
  readonly source: "simulated" | "in-memory" | "hybrid" | "postgres";
}

const fmtCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const fmtNum = (n: number, digits = 2) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n)
    : "—";

type Verdict = { tone: "ok" | "signal" | "warn" | "bad"; word: string; emoji: string; copy: string };

function verdictFor(fp: number): Verdict {
  if (fp >= 0.95) return { tone: "ok", word: "Excelente", emoji: "✓", copy: "Tu energía está fluyendo eficientemente. No hay penalización." };
  if (fp >= 0.9) return { tone: "signal", word: "Bien", emoji: "→", copy: "Estás dentro de la regulación CREG, pero hay margen para mejorar." };
  if (fp >= 0.8) return { tone: "warn", word: "Regular", emoji: "!", copy: "Estás pagando una penalización mensual. Tu factor está por debajo del mínimo legal." };
  return { tone: "bad", word: "Crítico", emoji: "✕", copy: "La penalización es alta. La red está enviando mucha corriente reactiva." };
}

const TONE_COLOR: Record<Verdict["tone"], string> = {
  ok: "var(--df-green)",
  signal: "var(--df-blue)",
  warn: "var(--df-amber)",
  bad: "var(--df-red)",
};

const TONE_BG: Record<Verdict["tone"], string> = {
  ok: "color-mix(in srgb, var(--df-green) 12%, var(--df-surface))",
  signal: "color-mix(in srgb, var(--df-blue) 10%, var(--df-surface))",
  warn: "color-mix(in srgb, var(--df-amber) 12%, var(--df-surface))",
  bad: "color-mix(in srgb, var(--df-red) 14%, var(--df-surface))",
};

interface Snapshot {
  readonly fp: number;
  readonly pKw: number;
  readonly qKvar: number;
  readonly sKva: number;
  readonly mask: number;
  readonly vRms: number;
  readonly iRms: number;
  readonly ts: string | null;
}

function snapshotFromReading(r: Reading | null): Snapshot {
  if (!r) return { fp: 0, pKw: 0, qKvar: 0, sKva: 0, mask: 0, vRms: 0, iRms: 0, ts: null };
  return {
    fp: r.pf,
    pKw: r.pW / 1000,
    qKvar: r.qVar / 1000,
    sKva: r.sVa / 1000,
    mask: r.activeStage,
    vRms: r.vRms,
    iRms: r.iRms,
    ts: r.ts,
  };
}

export function DashboardFriendly({ initialReading, deviceId, source }: Props) {
  const params = useSearchParams();
  const escenarioParam = params.get("escenario");
  const scenarioId: ScenarioId | null = isScenarioId(escenarioParam) ? escenarioParam : null;
  const scenario: Scenario | null = scenarioId ? SCENARIOS[scenarioId] : null;

  // Tema sincronizado con el global
  const { theme, toggle: toggleTheme } = useTheme();

  // Si hay escenario en query Y el source no es postgres real → usamos simulación cliente
  // Si NO hay escenario o source es postgres → usamos SSE real
  const useScenarioMode = scenario !== null && source !== "postgres";

  // Stream real (siempre montado, así no perdemos contrato cuando se desactiva escenario)
  const { reading: streamReading, connected } = useTelemetryStream(initialReading, deviceId);
  const sim = useScenarioSimulation(scenario ?? SCENARIOS.libre, { corrector: true });

  const snapshot: Snapshot = useScenarioMode
    ? {
        fp: sim.compensatedReading.powerFactor,
        pKw: sim.compensatedReading.activeKw,
        qKvar: Math.max(0, sim.compensatedReading.reactiveKvar),
        sKva: sim.compensatedReading.apparentKva,
        mask: sim.mask,
        vRms: 120,
        iRms: (sim.compensatedReading.apparentKva * 1000) / 120,
        ts: new Date(sim.nowMs).toISOString(),
      }
    : snapshotFromReading(streamReading);

  const fp = snapshot.fp;
  const verdict = verdictFor(fp);

  // Penalización mensual estimada (kWh ~ P_kW × 10h × 26 días, recargo lineal en déficit)
  const penaltyNow = useMemo(() => {
    if (fp >= 0.9 || snapshot.pKw === 0) return 0;
    const kWh = snapshot.pKw * 10 * 26;
    return Math.min(1_500_000, Math.max(25_000, (0.9 - fp) * kWh * 380));
  }, [fp, snapshot.pKw]);

  // Penalización si NO hubiera corrector (usa baseFp del escenario o estimación)
  const penaltyWithout = useMemo(() => {
    if (useScenarioMode && scenario) {
      const baseFp = scenario.baseFp;
      if (baseFp >= 0.9) return 0;
      const kWh = scenario.baseLoadKw * 10 * 26;
      return Math.min(1_500_000, Math.max(25_000, (0.9 - baseFp) * kWh * 380));
    }
    return scenario?.currentBillCop ?? penaltyNow;
  }, [useScenarioMode, scenario, penaltyNow]);

  const monthlySavings = Math.max(0, penaltyWithout - penaltyNow);

  // Histórico simulado de 24h (24 puntos): el "antes" mantiene el FP base; el "ahora" oscila cerca del corregido
  const history = useMemo(() => {
    const N = 24;
    const baseFp = scenario?.baseFp ?? 0.78;
    const targetFp = fp || 0.95;
    return Array.from({ length: N }, (_, i) => {
      const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 0.02;
      return {
        hour: i,
        before: Math.max(0.55, Math.min(0.99, baseFp + noise)),
        after: Math.max(0.55, Math.min(0.99, targetFp + noise * 0.4)),
      };
    });
  }, [fp, scenario]);

  // Animación entrada
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="df-root" data-dashboard-theme={theme}>
      <div className="df-container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <Link href="/" className="df-link-back">← Volver al inicio</Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="df-eyebrow">
              {useScenarioMode
                ? `Escenario · ${scenario?.name}`
                : connected
                  ? "Conectado en vivo"
                  : "Modo demo"}
            </span>
            <button className="df-toggle-theme" onClick={toggleTheme}>
              {theme === "light" ? "☾ Oscuro" : "☀ Claro"}
            </button>
          </div>
        </div>

        {/* Bloque 1 — Veredicto */}
        <div className="df-card strong" style={{ background: TONE_BG[verdict.tone], borderColor: TONE_COLOR[verdict.tone], opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px)", transition: "all .5s ease" }}>
          <div className="df-verdict-row">
            <div>
              <div className="df-eyebrow">¿Cómo está tu energía hoy?</div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
                <div className="df-verdict-icon" style={{ background: TONE_COLOR[verdict.tone], color: "white" }}>
                  {verdict.emoji}
                </div>
                <div>
                  <div className="df-h1" style={{ color: TONE_COLOR[verdict.tone] }}>{verdict.word}</div>
                  <div className="df-muted" style={{ marginTop: 4, fontSize: 15, lineHeight: 1.5, maxWidth: 520 }}>
                    {verdict.copy}
                  </div>
                </div>
              </div>
              {scenario && (
                <div className="df-muted" style={{ marginTop: 18, fontSize: 13 }}>
                  Estás viendo: <strong style={{ color: "var(--df-fg)" }}>{scenario.business}</strong> · {scenario.location}
                  {sim.activeEvent && useScenarioMode && (
                    <span style={{ marginLeft: 12, color: TONE_COLOR[verdict.tone] }}>· {sim.activeEvent}</span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: 6 }}>
              <div className="df-eyebrow">Tu factor de potencia</div>
              <div className="df-num" style={{ fontSize: 64, fontWeight: 600, color: TONE_COLOR[verdict.tone], lineHeight: 1 }}>
                {fmtNum(fp, 2)}
              </div>
              <div className="df-muted" style={{ fontSize: 12 }}>
                Mínimo legal CREG: 0.90
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2 — Termómetro */}
        <div className="df-card" style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
            <h2 className="df-h2">¿Dónde estás en la escala?</h2>
            <span className="df-eyebrow">FP en vivo</span>
          </div>
          <div className="df-thermo">
            <div className="df-thermo-cursor" style={{ left: `${Math.max(0, Math.min(100, ((fp - 0.6) / 0.4) * 100))}%` }} />
          </div>
          <div className="df-num" style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 13, letterSpacing: "0.10em", color: "var(--df-fg-dim)", fontWeight: 500 }}>
            <span>0.60</span>
            <span style={{ color: "var(--df-amber)" }}>0.90 · mínimo legal</span>
            <span style={{ color: "var(--df-green)" }}>0.95 · meta</span>
            <span>1.00</span>
          </div>
        </div>

        {/* Bloque 3 — Dinero */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <h2 className="df-h2">Lo que esto te cuesta</h2>
            <span className="df-eyebrow">Estimación mensual</span>
          </div>
          <div className="df-money-grid">
            <div className="df-money-card">
              <div className="label">Sin corrector</div>
              <div className="value" style={{ color: "var(--df-red)" }}>{fmtCOP(penaltyWithout)}</div>
              <div className="desc">Penalización que pagarías hoy</div>
            </div>
            <div className="df-money-card">
              <div className="label">Con corrector</div>
              <div className="value" style={{ color: "var(--df-amber)" }}>{fmtCOP(penaltyNow)}</div>
              <div className="desc">Lo que pagarías ahora mismo</div>
            </div>
            <div className="df-money-card">
              <div className="label">Ahorro mensual</div>
              <div className="value" style={{ color: "var(--df-green)" }}>{fmtCOP(monthlySavings)}</div>
              <div className="desc">Lo que dejas de pagar</div>
            </div>
          </div>
        </div>

        {/* Bloque 4 — Banco */}
        <div className="df-card" style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <h2 className="df-h2">El corrector está trabajando</h2>
            <span className="df-eyebrow">Banco binario · {snapshot.mask.toString(2).padStart(3, "0")}</span>
          </div>
          <div className="df-bank">
            {[
              { label: "5 µF", k: 1, bit: 0 },
              { label: "10 µF", k: 2, bit: 1 },
              { label: "20 µF", k: 4, bit: 2 },
            ].map((c) => {
              const on = ((snapshot.mask >> c.bit) & 1) === 1;
              return (
                <div key={c.label} className={"df-bank-cap " + (on ? "on" : "")}>
                  <div className="df-bank-led" />
                  <div className="df-num" style={{ fontSize: 22, fontWeight: 600 }}>{c.label}</div>
                  <div className="df-muted" style={{ fontSize: 13 }}>{c.k} kVAR</div>
                  <div className="df-eyebrow" style={{ marginTop: 4 }}>{on ? "Conectado" : "En reposo"}</div>
                </div>
              );
            })}
          </div>
          <div className="df-muted" style={{ marginTop: 16, fontSize: 13, lineHeight: 1.5 }}>
            Cada vez que tu carga pide más reactiva, el corrector engancha el capacitor justo. No prende todo a la vez — usa pasos de 1, 2 y 4 kVAR para llegar al objetivo sin sobrepasarse.
          </div>
        </div>

        {/* Bloque 5 — Histórico simple */}
        <div className="df-card" style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <h2 className="df-h2">Últimas 24 horas</h2>
            <div style={{ display: "flex", gap: 14 }}>
              <span className="df-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 14, height: 2, background: "var(--df-amber)", borderTop: "2px dashed var(--df-amber)" }} /> sin corrector
              </span>
              <span className="df-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 14, height: 2, background: "var(--df-cyan)" }} /> con corrector
              </span>
            </div>
          </div>
          <svg viewBox="0 0 600 180" width="100%" style={{ display: "block" }}>
            {/* Grid */}
            {[0.6, 0.7, 0.8, 0.9, 1.0].map((v) => {
              const y = 170 - ((v - 0.55) / 0.45) * 150;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="590" y2={y} className="df-history-axis" strokeWidth="1" strokeDasharray="2 4" />
                  <text x="32" y={y + 4} fontSize="9" fontFamily="JetBrains Mono" fill="var(--df-fg-faint)" textAnchor="end">{v.toFixed(1)}</text>
                </g>
              );
            })}
            {/* Línea 0.9 destacada */}
            {(() => {
              const y = 170 - ((0.9 - 0.55) / 0.45) * 150;
              return <line x1="40" y1={y} x2="590" y2={y} stroke="var(--df-amber)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />;
            })()}
            {/* Curva sin corrector */}
            <path
              d={history
                .map((p, i) => {
                  const x = 40 + (i / (history.length - 1)) * 550;
                  const y = 170 - ((p.before - 0.55) / 0.45) * 150;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              className="df-history-line before"
              strokeWidth="2"
            />
            {/* Curva con corrector */}
            <path
              d={history
                .map((p, i) => {
                  const x = 40 + (i / (history.length - 1)) * 550;
                  const y = 170 - ((p.after - 0.55) / 0.45) * 150;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}
              fill="none"
              className="df-history-line"
              strokeWidth="2.4"
            />
            <text x="40" y="178" fontSize="10" fontFamily="JetBrains Mono" fill="var(--df-fg-faint)">−24h</text>
            <text x="585" y="178" fontSize="10" fontFamily="JetBrains Mono" fill="var(--df-fg-faint)" textAnchor="end">ahora</text>
          </svg>
          <div className="df-muted" style={{ marginTop: 12, fontSize: 13 }}>
            La línea cyan muestra cómo te va con el corrector. La línea naranja punteada es lo que te pasaría sin él.
          </div>
        </div>

        {/* Bloque 6 — Detalles técnicos colapsados */}
        <details className="df-details" style={{ marginTop: 18 }}>
          <summary>
            <span>Detalles técnicos</span>
            <span style={{ color: "var(--df-fg-faint)" }}>+</span>
          </summary>
          <div className="df-details-body">
            <div>
              <div className="df-details-row"><span className="k">Potencia activa P</span><span className="v">{fmtNum(snapshot.pKw)} kW</span></div>
              <div className="df-details-row"><span className="k">Potencia reactiva Q</span><span className="v">{fmtNum(snapshot.qKvar)} kVAR</span></div>
              <div className="df-details-row"><span className="k">Potencia aparente S</span><span className="v">{fmtNum(snapshot.sKva)} kVA</span></div>
              <div className="df-details-row"><span className="k">Tensión RMS</span><span className="v">{fmtNum(snapshot.vRms, 1)} V</span></div>
              <div className="df-details-row"><span className="k">Corriente RMS</span><span className="v">{fmtNum(snapshot.iRms, 2)} A</span></div>
            </div>
            <div>
              <div className="df-details-row"><span className="k">Banco activo (mask)</span><span className="v">{snapshot.mask.toString(2).padStart(3, "0")} · stage {snapshot.mask}</span></div>
              <div className="df-details-row"><span className="k">Device ID</span><span className="v">{deviceId}</span></div>
              <div className="df-details-row"><span className="k">Telemetry source</span><span className="v">{source}</span></div>
              <div className="df-details-row"><span className="k">Última muestra</span><span className="v" style={{ wordBreak: "break-all" }}>{snapshot.ts ?? "—"}</span></div>
              <div className="df-details-row"><span className="k">Conexión SSE</span><span className="v" style={{ color: connected ? "var(--df-green)" : "var(--df-fg-faint)" }}>{connected ? "live" : "offline"}</span></div>
            </div>
          </div>
        </details>

        {/* Footer CTAs */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <Link href="/#demo" className="df-link-back">← Volver al demo interactivo</Link>
          <Link href="/cotizar" className="df-link-back" style={{ color: "var(--df-cyan)" }}>
            Solicitar cotización →
          </Link>
        </div>
      </div>
    </div>
  );
}
