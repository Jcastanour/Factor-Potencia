"use client";
import { useEffect, useRef, useState } from "react";
import { clamp, lerp, fpColor, fpLabel } from "@shared/utils/design";

function Fan({ fp, setFp }: { fp: number; setFp: (n: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startFp: number; w: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [angle, setAngle] = useState(0);
  const fpRef = useRef(fp);
  useEffect(() => {
    fpRef.current = fp;
  }, [fp]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const f = fpRef.current;
      const t = (f - 0.6) / 0.4;
      const speed = 20 + Math.pow(clamp(t, 0, 1), 1.6) * 540;
      setAngle((a) => (a + speed * dt) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = wrapRef.current!.getBoundingClientRect();
    dragRef.current = { startX: e.clientX, startFp: fpRef.current, w: rect.width };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dfp = (dx / dragRef.current.w) * 0.5;
    setFp(clamp(dragRef.current.startFp + dfp, 0.6, 1.0));
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const phi = (Math.acos(clamp(fp, 0, 1)) * 180) / Math.PI;
  const color = fpColor(fp);
  const label = fpLabel(fp);

  const CX = 250,
    CY = 250,
    R = 220;

  const blade = (rotation: number) => {
    const hubR = 34;
    const tipR = R - 18;
    const innerA = 12;
    const P = (r: number, deg: number): [number, number] => {
      const rad = (deg * Math.PI) / 180;
      return [Math.cos(rad) * r, Math.sin(rad) * r];
    };
    const [p1x, p1y] = P(hubR, -innerA);
    const [p2x, p2y] = P(tipR, -4);
    const [p3x, p3y] = P(tipR, 4);
    const [p4x, p4y] = P(hubR, innerA);
    const cpLower1 = P(hubR + 50, -20);
    const cpLower2 = P(tipR - 30, -18);
    const cpUpper1 = P(tipR - 20, 25);
    const cpUpper2 = P(hubR + 40, 30);
    const d = `M ${p1x} ${p1y}
               C ${cpLower1[0]} ${cpLower1[1]}, ${cpLower2[0]} ${cpLower2[1]}, ${p2x} ${p2y}
               A ${tipR} ${tipR} 0 0 1 ${p3x} ${p3y}
               C ${cpUpper1[0]} ${cpUpper1[1]}, ${cpUpper2[0]} ${cpUpper2[1]}, ${p4x} ${p4y}
               A ${hubR} ${hubR} 0 0 0 ${p1x} ${p1y} Z`;
    return (
      <g transform={`rotate(${rotation})`}>
        <path d={d} fill={color} opacity="0.92" />
        <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      </g>
    );
  };

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const deg = i * 30;
    const rad = (deg * Math.PI) / 180;
    const r1 = R + 4,
      r2 = R + 14;
    const x1 = Math.cos(rad) * r1,
      y1 = Math.sin(rad) * r1;
    const x2 = Math.cos(rad) * r2,
      y2 = Math.sin(rad) * r2;
    ticks.push(
      <line key={i} x1={x1 + CX} y1={y1 + CY} x2={x2 + CX} y2={y2 + CY} stroke="var(--line-strong)" strokeWidth="1" />
    );
    if (deg % 90 === 0) {
      const lblX = Math.cos(rad) * (R + 28) + CX;
      const lblY = Math.sin(rad) * (R + 28) + CY;
      ticks.push(
        <text
          key={"l" + i}
          x={lblX}
          y={lblY}
          fill="var(--fg-faint)"
          fontSize="8.5"
          fontFamily="var(--mono)"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="2"
        >
          {deg.toString().padStart(3, "0")}°
        </text>
      );
    }
  }

  const fpToDeg = (f: number) => lerp(180, 360, (f - 0.6) / 0.4);
  const arcR = R + 26;
  const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arcPath = (r: number, d1: number, d2: number) => {
    const [x1, y1] = polar(CX, CY, r, d1);
    const [x2, y2] = polar(CX, CY, r, d2);
    const large = Math.abs(d2 - d1) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${d2 > d1 ? 1 : 0} ${x2} ${y2}`;
  };
  const target = fpToDeg(0.95);
  const [tx1, ty1] = polar(CX, CY, arcR - 6, target);
  const [tx2, ty2] = polar(CX, CY, arcR + 6, target);
  const [tlx, tly] = polar(CX, CY, arcR + 20, target);

  return (
    <div
      ref={wrapRef}
      className={"fan-wrap " + (dragging ? "dragging" : "")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="fan-hint" style={{ opacity: dragging ? 0 : 0.9 }}>
        ← ARRASTRA →
      </div>
      <svg viewBox="0 0 500 500" width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <radialGradient id="bezelGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--bg-elev)" />
            <stop offset="80%" stopColor="var(--bg-elev)" />
            <stop offset="100%" stopColor="var(--bg-elev-2)" />
          </radialGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="60%" stopColor={color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r={R + 60} fill="url(#glow)" />
        <circle cx={CX} cy={CY} r={R + 18} fill="url(#bezelGrad)" stroke="var(--line)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R + 4} fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={CX} cy={CY} r={R - 4} fill="none" stroke="var(--line)" strokeWidth="1" />

        <g>{ticks}</g>

        <path d={arcPath(arcR, 180, 360)} fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
        <path d={arcPath(arcR, 180, fpToDeg(fp))} fill="none" stroke={color} strokeWidth="2" />
        <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="var(--green)" strokeWidth="2" />
        <text x={tlx} y={tly} fill="var(--green)" fontSize="9" fontFamily="var(--mono)" textAnchor="middle" letterSpacing="1.5">
          OBJ 0.95
        </text>

        <g transform={`rotate(${angle} ${CX} ${CY})`}>
          <g transform={`translate(${CX} ${CY})`}>
            {blade(0)}
            {blade(120)}
            {blade(240)}
          </g>
        </g>

        <circle cx={CX} cy={CY} r="30" fill="var(--bg-elev)" stroke="var(--line-strong)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r="22" fill="none" stroke="var(--line)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r="6" fill={color} />
        <circle cx={CX} cy={CY} r="6" fill={color} opacity="0.4" filter="url(#soft)" />

        <line x1={CX - R - 30} y1={CY} x2={CX - R - 10} y2={CY} stroke="var(--line-strong)" />
        <line x1={CX + R + 10} y1={CY} x2={CX + R + 30} y2={CY} stroke="var(--line-strong)" />
        <line x1={CX} y1={CY - R - 30} x2={CX} y2={CY - R - 10} stroke="var(--line-strong)" />
        <line x1={CX} y1={CY + R + 10} x2={CX} y2={CY + R + 30} stroke="var(--line-strong)" />
      </svg>

      <div className="fan-callouts">
        <div className="callout tl">
          <div className="k">MOTOR</div>
          <div className={"v c-" + (fp < 0.8 ? "red" : fp < 0.9 ? "amber" : fp < 0.95 ? "blue" : "green")}>{label}</div>
          <div className="k" style={{ marginTop: 8 }}>
            φ
          </div>
          <div className="v">{phi.toFixed(1)}°</div>
        </div>
        <div className="callout br">
          <div className="k">FP · cosφ</div>
          <div className="v" style={{ fontSize: 20, color }}>
            {fp.toFixed(2)}
          </div>
          <div className="k" style={{ marginTop: 8 }}>
            ω
          </div>
          <div className="v">
            {(20 + Math.pow(clamp((fp - 0.6) / 0.4, 0, 1), 1.6) * 540).toFixed(0)} °/s
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [fp, setFp] = useState(0.72);
  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="grid-bg" />
      <div className="container hero-grid">
        <div className="reveal in">
          <div className="chip" style={{ marginBottom: 28 }}>
            <span className="dot" />
            Prototipo en construcción · UNAL Facultad de Minas
          </div>
          <h1>
            Cada mes <em>pagas</em> por electricidad
            <br />
            que no usaste.
          </h1>
          <p className="lead">
            Los motores de tu panadería, taller o lavandería no solo consumen energía útil — también
            mueven una corriente reactiva invisible que la red debe transportar. El operador la
            factura de vuelta como penalización por bajo factor de potencia.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
            <a href="#demo" className="btn">
              Ver cómo funciona →
            </a>
            <a href="/dashboard" className="btn ghost">
              Dashboard en vivo
            </a>
            <a href="/cotizar" className="btn ghost">
              Cotizar
            </a>
          </div>
          <div className="stat-row">
            <div className="stat">
              <div className="label">FP mínimo</div>
              <div className="val">0.90</div>
              <div className="unit">CREG 101-035</div>
            </div>
            <div className="stat">
              <div className="label">Penalización</div>
              <div className="val">25k–1.5M</div>
              <div className="unit">COP / mes</div>
            </div>
            <div className="stat">
              <div className="label">ROI</div>
              <div className="val">2–7</div>
              <div className="unit">meses</div>
            </div>
          </div>
        </div>
        <div className="reveal in" data-reveal-delay="150">
          <Fan fp={fp} setFp={setFp} />
        </div>
      </div>
    </section>
  );
}
