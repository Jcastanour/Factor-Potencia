"use client";
import { useState } from "react";
import { clamp, fpColor } from "@shared/utils/design";

function Readout({ k, v, unit, color }: { k: string; v: string; unit: string; color: string }) {
  return (
    <div style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 3, background: "#0A0D12" }}>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>
        {k}
      </div>
      <div className="mono" style={{ fontSize: 18, color, fontVariantNumeric: "tabular-nums" }}>
        {v}
      </div>
      <div className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
        {unit}
      </div>
    </div>
  );
}

export default function Electrical() {
  const [fp, setFp] = useState(0.75);
  const phi = Math.acos(clamp(fp, 0, 1));
  const phiDeg = (phi * 180) / Math.PI;

  const W = 720,
    H = 240,
    MID = H / 2,
    AMP = 78;
  const cycles = 2;
  const pts = (phase: number) => {
    const arr: string[] = [];
    const N = 360;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = t * W;
      const y = MID - AMP * Math.sin(t * cycles * 2 * Math.PI - phase);
      arr.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    return arr.join(" ");
  };
  const vPath = pts(0);
  const iPath = pts(phi);

  const P = 1;
  const Q = Math.tan(phi);
  const S = 1 / Math.max(fp, 0.001);
  const TW = 360,
    TH = 260;
  const pad = 36;
  const maxQ = Math.tan(Math.acos(0.6));
  const scaleX = (TW - pad * 2) / 1;
  const scaleY = (TH - pad * 2) / maxQ;
  const ox = pad,
    oy = TH - pad;
  const px = ox + P * scaleX;
  const py = oy - Q * scaleY;

  const t1 = 0.25 / cycles;
  const t2 = (0.25 + phi / (2 * Math.PI)) / cycles;
  const x1p = t1 * W;
  const x2p = t2 * W;

  return (
    <section id="electrico" data-screen-label="04 Electrico">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">04 / 10</span>
          <span className="kicker">· Qué pasa eléctricamente</span>
        </div>
        <div className="reveal">
          <h2>
            Dos ondas. Una <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>desfasada</em>.
          </h2>
          <p className="sec-sub">
            El voltaje y la corriente deberían estar en fase. Las cargas inductivas retrasan la
            corriente un ángulo φ. Cuanto mayor el retraso, menor el factor de potencia y mayor la
            penalización.
          </p>
        </div>

        <div className="reveal" style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div className="demo-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <h4>V(t) · I(t) · 120 V / 60 Hz</h4>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <span className="chip live">
                  <span className="dot" />
                  LIVE
                </span>
                <div className="mono" style={{ fontSize: 12, color: "var(--fg-dim)" }}>
                  FP <span style={{ color: fpColor(fp) }}>{fp.toFixed(2)}</span>
                  <span style={{ marginLeft: 16 }}>
                    φ <span style={{ color: "var(--amber)" }}>{phiDeg.toFixed(1)}°</span>
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignItems: "start" }}
              className="responsive-split"
            >
              <div>
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
                  {[...Array(5)].map((_, i) => (
                    <line
                      key={"h" + i}
                      x1="0"
                      y1={i * (H / 4)}
                      x2={W}
                      y2={i * (H / 4)}
                      stroke="var(--line)"
                      strokeDasharray="2 4"
                    />
                  ))}
                  <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--line-strong)" />
                  <path d={vPath} fill="none" stroke="#E8EEF5" strokeWidth="1.6" />
                  <path d={iPath} fill="none" stroke={fpColor(fp)} strokeWidth="1.8" />
                  <g>
                    <line x1={x1p} y1={MID} x2={x1p} y2={MID - AMP} stroke="var(--fg)" strokeDasharray="2 3" />
                    <line
                      x1={x2p}
                      y1={MID}
                      x2={x2p}
                      y2={MID - AMP * fp}
                      stroke={fpColor(fp)}
                      strokeDasharray="2 3"
                    />
                    <line x1={x1p} y1={MID - AMP - 8} x2={x2p} y2={MID - AMP - 8} stroke="var(--amber)" strokeWidth="1.4" />
                    <text
                      x={(x1p + x2p) / 2}
                      y={MID - AMP - 14}
                      fill="var(--amber)"
                      fontSize="10"
                      fontFamily="var(--mono)"
                      textAnchor="middle"
                    >
                      φ = {phiDeg.toFixed(1)}°
                    </text>
                  </g>
                  <g transform={`translate(14 22)`}>
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#E8EEF5" strokeWidth="1.6" />
                    <text x="26" y="4" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">
                      V(t)
                    </text>
                    <line x1="70" y1="0" x2="90" y2="0" stroke={fpColor(fp)} strokeWidth="1.8" />
                    <text x="96" y="4" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">
                      I(t)
                    </text>
                  </g>
                </svg>
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: "var(--fg-faint)", letterSpacing: "0.2em" }}
                    >
                      FACTOR DE POTENCIA
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: fpColor(fp) }}>
                      {fp.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.60"
                    max="1.00"
                    step="0.01"
                    value={fp}
                    onChange={(e) => setFp(parseFloat(e.target.value))}
                    className="slider"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-faint)" }}>
                      0.60
                    </span>
                    <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-faint)" }}>
                      0.90 MIN
                    </span>
                    <span className="mono" style={{ fontSize: 9.5, color: "var(--fg-faint)" }}>
                      1.00
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    color: "var(--fg-faint)",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  TRIÁNGULO DE POTENCIA
                </div>
                <svg viewBox={`0 0 ${TW} ${TH}`} width="100%" style={{ display: "block" }}>
                  <line x1={ox} y1={oy} x2={ox + scaleX} y2={oy} stroke="var(--line)" />
                  <line x1={ox} y1={oy} x2={ox} y2={oy - maxQ * scaleY} stroke="var(--line)" />
                  <line x1={ox} y1={oy} x2={px} y2={oy} stroke="#E8EEF5" strokeWidth="2" />
                  <line x1={px} y1={oy} x2={px} y2={py} stroke="var(--amber)" strokeWidth="2" />
                  <line x1={ox} y1={oy} x2={px} y2={py} stroke="var(--cyan)" strokeWidth="2" />
                  <path
                    d={`M ${ox + 28} ${oy} A 28 28 0 0 0 ${ox + 28 * Math.cos(-phi)} ${oy + 28 * Math.sin(-phi)}`}
                    fill="none"
                    stroke="var(--fg-faint)"
                    strokeDasharray="2 3"
                  />
                  <text x={ox + 42} y={oy - 10} fill="var(--fg-dim)" fontSize="10" fontFamily="var(--mono)">
                    φ
                  </text>
                  <text
                    x={(ox + px) / 2}
                    y={oy + 18}
                    fill="#E8EEF5"
                    fontSize="11"
                    fontFamily="var(--mono)"
                    textAnchor="middle"
                    letterSpacing="1.5"
                  >
                    P · kW
                  </text>
                  <text
                    x={px + 10}
                    y={(oy + py) / 2}
                    fill="var(--amber)"
                    fontSize="11"
                    fontFamily="var(--mono)"
                    letterSpacing="1.5"
                  >
                    Q · kVAR
                  </text>
                  <text
                    x={(ox + px) / 2 - 24}
                    y={(oy + py) / 2 - 6}
                    fill="var(--cyan)"
                    fontSize="11"
                    fontFamily="var(--mono)"
                    letterSpacing="1.5"
                  >
                    S · kVA
                  </text>
                </svg>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  <Readout k="P" v={P.toFixed(2)} unit="p.u." color="#E8EEF5" />
                  <Readout k="Q" v={Q.toFixed(2)} unit="p.u." color="var(--amber)" />
                  <Readout k="S" v={S.toFixed(2)} unit="p.u." color="var(--cyan)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
