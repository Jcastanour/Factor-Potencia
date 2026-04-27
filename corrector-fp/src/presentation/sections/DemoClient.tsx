"use client";
import { useEffect, useRef, useState } from "react";
import { clamp, fmtCOP, fpColor, lerp } from "@shared/utils/design";

function MiniStat({ k, v, unit, color }: { k: string; v: string; unit: string; color: string }) {
  return (
    <div style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 3, background: "#0A0D12" }}>
      <div
        className="mono"
        style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "var(--fg-faint)", textTransform: "uppercase" }}
      >
        {k}
      </div>
      <div className="mono" style={{ fontSize: 16, color, fontVariantNumeric: "tabular-nums" }}>
        {v}
      </div>
      <div className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
        {unit}
      </div>
    </div>
  );
}

export default function Demo() {
  const [on, setOn] = useState(true);
  const [power, setPower] = useState(4.5);
  const [baseFp, setBaseFp] = useState(0.72);
  const [bank, setBank] = useState(0);
  const lastChange = useRef(0);
  const DWELL = 600;

  useEffect(() => {
    lastChange.current = performance.now();
  }, []);

  const Qload = power * Math.tan(Math.acos(clamp(baseFp, 0, 1)));
  const Qcap = on ? bank : 0;
  const Qnet = Qload - Qcap;
  const fpNow = power / Math.sqrt(power * power + Qnet * Qnet);

  useEffect(() => {
    if (!on) {
      setBank(0);
      return;
    }
    const id = setInterval(() => {
      const now = performance.now();
      if (now - lastChange.current < DWELL) return;
      setBank((b) => {
        const qc = b;
        const qn = Qload - qc;
        const fp = power / Math.sqrt(power * power + qn * qn);
        if (fp < 0.88 && b < 7) {
          lastChange.current = now;
          return b + 1;
        }
        if (fp > 0.97 && b > 0) {
          lastChange.current = now;
          return b - 1;
        }
        return b;
      });
    }, 200);
    return () => clearInterval(id);
  }, [on, power, baseFp, Qload]);

  const W = 600,
    H = 180,
    MID = H / 2,
    AMP = 56;
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

  const kWh = power * 10 * 26;
  const penaltyNow =
    fpNow < 0.9 ? Math.min(1_500_000, Math.max(25_000, (0.9 - fpNow) * kWh * 380)) : 0;
  const penaltyNoCorrector =
    baseFp < 0.9 ? Math.min(1_500_000, Math.max(25_000, (0.9 - baseFp) * kWh * 380)) : 0;
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

  return (
    <section id="demo" data-screen-label="07 Demo">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">07 / 10</span>
          <span className="kicker">· Demo interactivo</span>
        </div>
        <div
          className="reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2>
              Control con histéresis
              <br />
              <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>en vivo.</em>
            </h2>
            <p className="sec-sub">
              Ajusta la carga y el factor de potencia base. El controlador engancha condensadores en
              pasos binarios hasta llevar FP entre 0.88 y 0.97.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              className="mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.22em",
                color: "var(--fg-faint)",
                textTransform: "uppercase",
              }}
            >
              CORRECTOR
            </span>
            <div className={"toggle " + (on ? "on" : "")} onClick={() => setOn(!on)}>
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: on ? "var(--cyan)" : "var(--fg-faint)",
                  letterSpacing: "0.18em",
                }}
              >
                {on ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        <div className="demo-grid reveal" style={{ marginTop: 48 }}>
          <div className="demo-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <h4>V(t) · I(t) corregida</h4>
              <span className="chip live">
                <span className="dot" />
                LIVE
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              {[...Array(9)].map((_, i) => (
                <line
                  key={"v" + i}
                  x1={i * (W / 8)}
                  y1="0"
                  x2={i * (W / 8)}
                  y2={H}
                  stroke="var(--line)"
                  strokeDasharray="2 4"
                />
              ))}
              <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--line-strong)" />
              <path d={pts(0)} fill="none" stroke="#E8EEF5" strokeWidth="1.4" />
              <path d={pts(phi)} fill="none" stroke={fpColor(fpNow)} strokeWidth="1.7" />
            </svg>

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 10,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    letterSpacing: "0.22em",
                    color: "var(--fg-faint)",
                    textTransform: "uppercase",
                  }}
                >
                  BANCO BINARIO · {bank.toString(2).padStart(3, "0")}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--cyan)" }}>
                  {Qcap.toFixed(0)} kVAR
                </span>
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
                      <div className="bit">
                        BIT {c.idx} · SSR{c.idx + 1}
                      </div>
                      <div className="uf">{c.uf}</div>
                      <div className="kvar">{c.k}</div>
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: active ? "var(--cyan)" : "#2a3340",
                          boxShadow: active ? "0 0 12px var(--cyan)" : "none",
                          transition: "all .2s",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span
                    className="mono"
                    style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}
                  >
                    POTENCIA ACTIVA
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg)" }}>
                    {power.toFixed(1)} kW
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={power}
                  onChange={(e) => setPower(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span
                    className="mono"
                    style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}
                  >
                    FP BASE (CARGA)
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--amber)" }}>
                    {baseFp.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="0.90"
                  step="0.01"
                  value={baseFp}
                  onChange={(e) => setBaseFp(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>
            </div>
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
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={color}
                        strokeWidth={v === 0.95 ? 2 : 1}
                        strokeDasharray={v === 0.95 ? "" : "2 3"}
                      />
                      <text
                        x={lx}
                        y={ly}
                        fill={color}
                        fontSize="9"
                        fontFamily="var(--mono)"
                        textAnchor="middle"
                        letterSpacing="1"
                      >
                        {v.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                {[0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0].map((v) => {
                  const d = lerp(180, 360, (v - 0.6) / 0.4);
                  const [x1, y1] = polar(180, 170, 110, d);
                  const [x2, y2] = polar(180, 170, 122, d);
                  return (
                    <line
                      key={v}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--fg-faint)"
                      strokeWidth="0.8"
                    />
                  );
                })}
                <g
                  transform={`rotate(${needleDeg} 180 170)`}
                  style={{ transition: "transform .45s cubic-bezier(0.2,0.7,0.2,1)" }}
                >
                  <line x1="180" y1="170" x2="300" y2="170" stroke={fpColor(fpNow)} strokeWidth="2.2" />
                  <circle cx="300" cy="170" r="3" fill={fpColor(fpNow)} />
                </g>
                <circle cx="180" cy="170" r="10" fill="#0A0D12" stroke="var(--line-strong)" />
                <circle cx="180" cy="170" r="4" fill={fpColor(fpNow)} />
                <text
                  x="180"
                  y="195"
                  fill={fpColor(fpNow)}
                  fontSize="28"
                  fontFamily="var(--mono)"
                  textAnchor="middle"
                  letterSpacing="2"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {fpNow.toFixed(3)}
                </text>
              </svg>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 8 }}>
                <MiniStat k="P" v={power.toFixed(1)} unit="kW" color="#E8EEF5" />
                <MiniStat k="Q neta" v={Qnet.toFixed(2)} unit="kVAR" color="var(--amber)" />
                <MiniStat
                  k="S"
                  v={Math.sqrt(power * power + Qnet * Qnet).toFixed(2)}
                  unit="kVA"
                  color="var(--cyan)"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="readout amber">
                <div className="label">Penalización / mes</div>
                <div className="val">
                  {penaltyNow === 0 ? "0" : Math.round(penaltyNow / 1000) + "k"}
                </div>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 4 }}>
                  {fmtCOP(penaltyNow)}
                </div>
              </div>
              <div className="readout green">
                <div className="label">Ahorro vs sin corrector</div>
                <div className="val">{savings === 0 ? "0" : Math.round(savings / 1000) + "k"}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--fg-faint)", marginTop: 4 }}>
                  {fmtCOP(savings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
