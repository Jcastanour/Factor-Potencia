"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SCENARIOS, SCENARIO_ORDER, type ScenarioId } from "@domain/scenarios/scenarios";
import { useScenarioSimulation } from "@application/scenarios/useScenarioSimulation";
import { clamp, fmtCOP, fpColor, lerp } from "@shared/utils/design";

function MiniStat({ k, v, unit, color }: { k: string; v: string; unit: string; color: string }) {
  return (
    <div style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 3, background: "var(--input-bg)" }}>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "var(--fg-faint)", textTransform: "uppercase" }}>{k}</div>
      <div className="mono" style={{ fontSize: 16, color, fontVariantNumeric: "tabular-nums" }}>{v}</div>
      <div className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>{unit}</div>
    </div>
  );
}

export default function Demo() {
  const [on, setOn] = useState(true);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("panaderia");
  const isLibre = scenarioId === "libre";
  const scenario = SCENARIOS[scenarioId];

  // Modo libre — sliders manuales
  const [power, setPower] = useState(scenario.baseLoadKw);
  const [baseFp, setBaseFp] = useState(scenario.baseFp);

  // Cuando cambia escenario, sincronizar sliders al baseline (útil en libre y como fallback)
  useEffect(() => {
    setPower(scenario.baseLoadKw);
    setBaseFp(scenario.baseFp);
  }, [scenario.baseLoadKw, scenario.baseFp]);

  // Simulación de escenario con eventos
  const sim = useScenarioSimulation(scenario, { corrector: on });

  // En modo libre, derivamos del slider; en escenarios, del simulador
  const activeKw = isLibre ? power : sim.baseReading.activeKw;
  const fpBaseEff = isLibre ? baseFp : sim.baseReading.powerFactor;
  const Qload = activeKw * Math.tan(Math.acos(clamp(fpBaseEff, 0, 1)));
  const Qcap = on ? sim.compensatedKvar : 0;
  // En libre seguimos el cálculo simple; en escenarios usamos lo del sim
  const fpNow = isLibre
    ? activeKw / Math.sqrt(activeKw * activeKw + (Qload - (on ? freeBank(activeKw, Qload) : 0)) ** 2)
    : sim.compensatedReading.powerFactor;
  const Qnet = isLibre ? Qload - (on ? freeBank(activeKw, Qload) : 0) : Math.max(0, sim.compensatedReading.reactiveKvar);
  const bank = isLibre ? freeBank(activeKw, Qload) : sim.mask;

  // ondas
  const W = 600, H = 180, MID = H / 2, AMP = 56;
  const cycles = 2;
  const phi = Math.acos(clamp(fpNow, 0, 1));
  const pts = (phase: number) => {
    const arr: string[] = [];
    const N = 240;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = t * W;
      const y = MID - AMP * Math.sin(t * cycles * 2 * Math.PI - phase);
      arr.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return arr.join(" ");
  };

  const kWh = activeKw * 10 * 26;
  const penaltyNow = fpNow < 0.9 ? Math.min(1_500_000, Math.max(25_000, (0.9 - fpNow) * kWh * 380)) : 0;
  const penaltyNoCorrector = fpBaseEff < 0.9 ? Math.min(1_500_000, Math.max(25_000, (0.9 - fpBaseEff) * kWh * 380)) : 0;
  const savings = Math.max(0, penaltyNoCorrector - penaltyNow);

  const needleDeg = lerp(180, 360, clamp((fpNow - 0.6) / 0.4, 0, 1));
  const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
    cx + r * Math.cos((deg * Math.PI) / 180),
    cy + r * Math.sin((deg * Math.PI) / 180),
  ];
  const arcPath = (cx: number, cy: number, r: number, d1: number, d2: number) => {
    const [x1, y1] = polar(cx, cy, r, d1);
    const [x2, y2] = polar(cx, cy, r, d2);
    const large = Math.abs(d2 - d1) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${d2 > d1 ? 1 : 0} ${x2} ${y2}`;
  };

  const dashboardHref = `/dashboard?escenario=${scenarioId}`;

  return (
    <section id="demo" data-screen-label="07 Demo">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">07 / 10</span>
          <span className="kicker">· Demo interactivo</span>
        </div>

        <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2>
              Pruébalo con un comercio real.
              <br />
              <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>Mira cómo reacciona.</em>
            </h2>
            <p className="sec-sub">
              Elige un escenario y observa cómo el corrector engancha condensadores en pasos binarios
              cuando el equipo del comercio empieza a tirar reactiva. Cada escenario simula los eventos
              raros que ocurren en la realidad — arranques de compresor, secadores, sierra eléctrica.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "var(--fg-faint)", textTransform: "uppercase" }}>CORRECTOR</span>
            <div className={"toggle " + (on ? "on" : "")} onClick={() => setOn(!on)}>
              <div className="toggle-track"><div className="toggle-thumb" /></div>
              <span className="mono" style={{ fontSize: 11, color: on ? "var(--cyan)" : "var(--fg-faint)", letterSpacing: "0.18em" }}>
                {on ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* Selector de escenarios */}
        <div className="reveal" style={{ marginTop: 36, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {SCENARIO_ORDER.map((id) => {
            const s = SCENARIOS[id];
            const active = scenarioId === id;
            return (
              <button
                key={id}
                onClick={() => setScenarioId(id)}
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "1px solid " + (active ? "var(--cyan)" : "var(--line)"),
                  background: active ? "color-mix(in srgb, var(--cyan) 10%, transparent)" : "var(--bg-elev)",
                  color: active ? "var(--cyan)" : "var(--fg-dim)",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "all .15s ease",
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Ficha del comercio (solo si no es libre) */}
        {!isLibre && (
          <div className="reveal" style={{ marginTop: 18, padding: 22, border: "1px solid var(--line)", borderRadius: 6, background: "var(--bg-elev)", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)", textTransform: "uppercase" }}>
                {scenario.location}
              </div>
              <div style={{ fontSize: 22, marginTop: 6, color: "var(--fg)", fontWeight: 500 }}>{scenario.business}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)", marginTop: 8, lineHeight: 1.5 }}>
                {scenario.equipment}
              </div>
              <div style={{ marginTop: 14, paddingLeft: 14, borderLeft: "1px solid var(--line-strong)", color: "var(--fg-dim)", fontStyle: "italic", fontSize: 13, lineHeight: 1.55 }}>
                "{scenario.quote}"
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "space-between" }}>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)", textTransform: "uppercase" }}>
                  Penalización actual / mes
                </div>
                <div className="mono" style={{ fontSize: 28, color: "var(--amber)", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
                  {fmtCOP(scenario.currentBillCop)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {sim.activeEvent && (
                  <span className="chip live" style={{ height: 26, fontSize: 10 }}>
                    <span className="dot" />
                    {sim.activeEvent}
                  </span>
                )}
                <Link href={dashboardHref} className="btn ghost" style={{ height: 36, fontSize: 11, padding: "0 14px" }}>
                  Ver en el dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="demo-grid reveal" style={{ marginTop: 28 }}>
          <div className="demo-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <h4>V(t) · I(t) corregida</h4>
              <span className="chip live"><span className="dot" />LIVE</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              {[...Array(9)].map((_, i) => (
                <line key={"v" + i} x1={i * (W / 8)} y1="0" x2={i * (W / 8)} y2={H} stroke="var(--line)" strokeDasharray="2 4" />
              ))}
              <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--line-strong)" />
              <path d={pts(0)} fill="none" stroke="var(--fg)" strokeWidth="1.4" />
              <path d={pts(phi)} fill="none" stroke={fpColor(fpNow)} strokeWidth="1.7" />
            </svg>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "var(--fg-faint)", textTransform: "uppercase" }}>
                  BANCO BINARIO · {bank.toString(2).padStart(3, "0")}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--cyan)" }}>{Qcap.toFixed(0)} kVAR</span>
              </div>
              <div className="cap-row">
                {[
                  { uf: "5 µF", k: "1 kVAR", bit: 1, idx: 0 },
                  { uf: "10 µF", k: "2 kVAR", bit: 2, idx: 1 },
                  { uf: "20 µF", k: "4 kVAR", bit: 4, idx: 2 },
                ].map((c) => {
                  const active = on && !!(bank & c.bit);
                  return (
                    <div key={c.uf} className={"cap " + (active ? "on" : "")}>
                      <div className="bit">BIT {c.idx} · SSR{c.idx + 1}</div>
                      <div className="uf">{c.uf}</div>
                      <div className="kvar">{c.k}</div>
                      <div style={{ position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: "50%", background: active ? "var(--cyan)" : "#2a3340", boxShadow: active ? "0 0 12px var(--cyan)" : "none", transition: "all .2s" }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sliders solo en modo libre */}
            {isLibre && (
              <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>POTENCIA ACTIVA</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--fg)" }}>{power.toFixed(1)} kW</span>
                  </div>
                  <input type="range" min="1" max="10" step="0.1" value={power} onChange={(e) => setPower(parseFloat(e.target.value))} className="slider" />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>FP BASE (CARGA)</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--amber)" }}>{baseFp.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.60" max="0.90" step="0.01" value={baseFp} onChange={(e) => setBaseFp(parseFloat(e.target.value))} className="slider" />
                </div>
              </div>
            )}
            {!isLibre && (
              <div style={{ marginTop: 22, padding: "14px 16px", border: "1px dashed var(--line-strong)", borderRadius: 4, background: "rgba(34,211,238,0.03)" }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)", textTransform: "uppercase", marginBottom: 6 }}>
                  Carga en vivo
                </div>
                <div className="mono" style={{ fontSize: 13, color: "var(--fg-dim)" }}>
                  P · <span style={{ color: "var(--fg)" }}>{activeKw.toFixed(2)} kW</span> · FP base{" "}
                  <span style={{ color: "var(--amber)" }}>{fpBaseEff.toFixed(2)}</span>
                  {sim.activeEvent && <span style={{ color: "var(--cyan)" }}> · {sim.activeEvent}</span>}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="demo-panel">
              <h4 style={{ marginBottom: 8 }}>Factor de potencia</h4>
              <svg viewBox="0 0 360 200" width="100%" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="meterGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="75%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <path d={arcPath(180, 170, 120, 180, 360)} fill="none" stroke="var(--line)" strokeWidth="22" />
                <path d={arcPath(180, 170, 120, 180, 360)} fill="none" stroke="url(#meterGrad)" strokeWidth="2" />
                {[0.88, 0.97, 0.95].map((v) => {
                  const d = lerp(180, 360, (v - 0.6) / 0.4);
                  const [x1, y1] = polar(180, 170, 100, d);
                  const [x2, y2] = polar(180, 170, 140, d);
                  const color = v === 0.95 ? "var(--green)" : "var(--fg-dim)";
                  const [lx, ly] = polar(180, 170, 152, d);
                  return (
                    <g key={v}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={v === 0.95 ? 2 : 1} strokeDasharray={v === 0.95 ? "" : "2 3"} />
                      <text x={lx} y={ly} fill={color} fontSize="9" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1">{v.toFixed(2)}</text>
                    </g>
                  );
                })}
                {[0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0].map((v) => {
                  const d = lerp(180, 360, (v - 0.6) / 0.4);
                  const [x1, y1] = polar(180, 170, 110, d);
                  const [x2, y2] = polar(180, 170, 122, d);
                  return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--fg-faint)" strokeWidth="0.8" />;
                })}
                <g transform={`rotate(${needleDeg} 180 170)`} style={{ transition: "transform .45s cubic-bezier(0.2,0.7,0.2,1)" }}>
                  <line x1="180" y1="170" x2="300" y2="170" stroke={fpColor(fpNow)} strokeWidth="2.2" />
                  <circle cx="300" cy="170" r="3" fill={fpColor(fpNow)} />
                </g>
                <circle cx="180" cy="170" r="10" fill="var(--input-bg)" stroke="var(--line-strong)" />
                <circle cx="180" cy="170" r="4" fill={fpColor(fpNow)} />
                <text x="180" y="195" fill={fpColor(fpNow)} fontSize="28" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="2" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {fpNow.toFixed(3)}
                </text>
              </svg>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 8 }}>
                <MiniStat k="P" v={activeKw.toFixed(1)} unit="kW" color="var(--fg)" />
                <MiniStat k="Q neta" v={Qnet.toFixed(2)} unit="kVAR" color="var(--amber)" />
                <MiniStat k="S" v={Math.sqrt(activeKw * activeKw + Qnet * Qnet).toFixed(2)} unit="kVA" color="var(--cyan)" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="readout amber">
                <div className="label">Penalización / mes</div>
                <div className="val">{penaltyNow === 0 ? "0" : Math.round(penaltyNow / 1000) + "k"}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 4 }}>{fmtCOP(penaltyNow)}</div>
              </div>
              <div className="readout green">
                <div className="label">Ahorro vs sin corrector</div>
                <div className="val">{savings === 0 ? "0" : Math.round(savings / 1000) + "k"}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 4 }}>{fmtCOP(savings)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Histéresis simple para el modo libre (replica la lógica anterior). */
function freeBank(power: number, Qload: number): number {
  let bestMask = 0;
  let bestDelta = Infinity;
  for (let m = 0; m <= 7; m++) {
    const qc = m;
    const qn = Qload - qc;
    const fp = power / Math.sqrt(power * power + qn * qn);
    if (fp >= 0.88 && fp <= 0.97) {
      const delta = Math.abs(fp - 0.95);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestMask = m;
      }
    }
  }
  return bestMask;
}
