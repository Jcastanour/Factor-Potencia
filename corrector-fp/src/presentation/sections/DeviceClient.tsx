"use client";
import { useEffect, useState } from "react";

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
);
const IconBoxOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 8 12 3l9 5v9l-9 4-9-4z" />
    <path d="M3 8l9 5 9-5M8 5.8V11" />
  </svg>
);
const IconRotate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 3" />
    <path d="M21 3v6h-6" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 21" />
    <path d="M3 21v-6h6" />
  </svg>
);
const IconPinch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="8" />
    <path d="M9 12h6M12 9v6" />
  </svg>
);
const IconCube = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
    <path d="M3 7.5 12 12l9-4.5" />
  </svg>
);
const IconPlug = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 2v5M15 2v5" />
    <rect x="6" y="7" width="12" height="7" rx="2" />
    <path d="M12 14v4a3 3 0 0 0 3 3" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M13 2 4 14h7l-2 8 9-12h-7z" />
  </svg>
);
const IconGauge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 17a9 9 0 1 1 18 0" />
    <path d="M12 17l4-5" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

function FeatureCell({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="feature-cell">
      <div className="ico">{icon}</div>
      <div>
        <h5>{title}</h5>
        <p>{body}</p>
      </div>
    </div>
  );
}

function SkeletonOverlay() {
  return (
    <div className="skeleton-overlay">
      <div className="skeleton-card">
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.24em", color: "var(--fg-faint)" }}>
          VISOR 3D · EN PREPARACIÓN
        </div>
        <div className="skeleton-bar" />
        <div
          className="mono"
          style={{ fontSize: 10.5, color: "var(--fg-dim)", maxWidth: 260, textAlign: "center", lineHeight: 1.6 }}
        >
          Aquí irá el modelo interactivo del prototipo. Presiona{" "}
          <span style={{ color: "var(--cyan)" }}>Cargar modelo</span> para previsualizar el contenedor.
        </div>
      </div>
    </div>
  );
}

function DeviceExternal() {
  return (
    <g transform="translate(400 260)">
      {/* ground shadow */}
      <ellipse cx="0" cy="190" rx="260" ry="16" fill="#000" opacity="0.5" />

      {/* isometric 3/4 body: back face offset */}
      <g transform="skewY(-8)">
        {/* side panel (perspective strip on right) */}
        <path
          d="M 200 -130 L 234 -112 L 234 150 L 200 130 Z"
          fill="url(#caseSide)"
          stroke="rgba(34,211,238,0.18)"
          strokeWidth="0.8"
        />
        {/* bottom panel */}
        <path
          d="M -200 130 L -166 148 L 234 150 L 200 130 Z"
          fill="url(#caseSide2)"
          stroke="rgba(34,211,238,0.12)"
          strokeWidth="0.8"
        />
        {/* front face */}
        <rect
          x="-200"
          y="-130"
          width="400"
          height="260"
          rx="14"
          fill="url(#caseFront)"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="1.2"
        />
        {/* subtle inner bevel */}
        <rect
          x="-192"
          y="-122"
          width="384"
          height="244"
          rx="10"
          fill="none"
          stroke="rgba(232,238,245,0.05)"
          strokeWidth="1"
        />

        {/* tornillos */}
        {[
          [-170, -100],
          [170, -100],
          [-170, 100],
          [170, 100],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="8" fill="#0E1116" stroke="rgba(34,211,238,0.35)" strokeWidth="1" />
            <circle r="8" fill="url(#screwGrad)" />
            <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#0A0D12" strokeWidth="1.3" />
          </g>
        ))}

        {/* OLED */}
        <g transform="translate(-150 -88)">
          <rect x="0" y="0" width="190" height="112" rx="4" fill="#030708" stroke="rgba(34,211,238,0.5)" strokeWidth="1" />
          <rect x="3" y="3" width="184" height="106" rx="3" fill="#041318" />
          {/* scanlines */}
          <rect x="3" y="3" width="184" height="106" rx="3" fill="url(#scan)" opacity="0.4" />
          <g fontFamily="var(--mono)" fill="#22D3EE">
            <text x="14" y="26" fontSize="14" letterSpacing="1.2">
              FP: 0.94
            </text>
            <text x="14" y="48" fontSize="14" letterSpacing="1.2">
              P : 1.25 kW
            </text>
            <text x="14" y="70" fontSize="14" letterSpacing="1.2">
              S : 1.36 kVA
            </text>
            <text x="14" y="92" fontSize="14" letterSpacing="1.2">
              Q : 0.52 kVAR
            </text>
          </g>
          {/* cursor */}
          <rect x="108" y="16" width="8" height="14" fill="#22D3EE">
            <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* LEDs */}
        <g transform="translate(70 -80)">
          {[
            ["#10B981", "ESTADO"],
            ["#F59E0B", "CORRIGIENDO"],
            ["#EF4444", "ALARMA"],
          ].map(([c, l], i) => (
            <g key={l} transform={`translate(0 ${i * 32})`}>
              <circle r="8" fill="#0A0D12" stroke="rgba(255,255,255,0.08)" />
              <circle r="5" fill={c}>
                <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
              </circle>
              <circle r="10" fill={c} opacity="0.18">
                <animate attributeName="r" values="8;14;8" dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
              </circle>
              <text x="22" y="4" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">
                {l}
              </text>
            </g>
          ))}
        </g>

        {/* prensaestopas */}
        {[-120, -70].map((x, i) => (
          <g key={i} transform={`translate(${x} 70)`}>
            <circle r="14" fill="#0A0D12" stroke="rgba(34,211,238,0.3)" />
            <circle r="9" fill="#111821" stroke="rgba(232,238,245,0.08)" />
            <circle r="3" fill="#22D3EE" opacity="0.35" />
          </g>
        ))}

        {/* etiqueta */}
        <g transform="translate(20 52)">
          <rect x="0" y="0" width="170" height="58" rx="3" fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.22)" />
          <text x="85" y="20" textAnchor="middle" fill="var(--fg-dim)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">
            CORRECTOR AUTOMÁTICO
          </text>
          <text x="85" y="34" textAnchor="middle" fill="var(--fg-dim)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">
            DE FACTOR DE POTENCIA
          </text>
          <text x="85" y="50" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="var(--mono)" letterSpacing="3">
            PFC · UNAL · v0.1
          </text>
        </g>
      </g>

      {/* Cotas */}
      <g fontFamily="var(--mono)" fontSize="9" fill="var(--fg-faint)" letterSpacing="2">
        <line x1="-200" y1="-150" x2="200" y2="-150" stroke="rgba(34,211,238,0.4)" strokeDasharray="3 4" />
        <line x1="-200" y1="-156" x2="-200" y2="-144" stroke="rgba(34,211,238,0.6)" />
        <line x1="200" y1="-156" x2="200" y2="-144" stroke="rgba(34,211,238,0.6)" />
        <rect x="-20" y="-162" width="40" height="12" fill="var(--bg)" />
        <text x="0" y="-153" textAnchor="middle" fill="#22D3EE">20 cm</text>

        <line x1="-226" y1="-130" x2="-226" y2="130" stroke="rgba(34,211,238,0.4)" strokeDasharray="3 4" />
        <line x1="-232" y1="-130" x2="-220" y2="-130" stroke="rgba(34,211,238,0.6)" />
        <line x1="-232" y1="130" x2="-220" y2="130" stroke="rgba(34,211,238,0.6)" />
        <g transform="translate(-226 0) rotate(-90)">
          <rect x="-20" y="-6" width="40" height="12" fill="var(--bg)" />
          <text x="0" y="3" textAnchor="middle" fill="#22D3EE">18 cm</text>
        </g>

        <line x1="200" y1="130" x2="234" y2="150" stroke="rgba(34,211,238,0.4)" strokeDasharray="3 4" />
        <text x="248" y="152" fill="#22D3EE">10 cm</text>
      </g>
    </g>
  );
}

function DeviceInternal() {
  // Flat top-down board layout inside opened enclosure
  const components: { x: number; y: number; w: number; h: number; fill: string; label: string; sub?: string }[] = [
    { x: -200, y: -90, w: 88, h: 56, fill: "#F59E0B", label: "AC-DC 5V", sub: "ALIM" },
    { x: -70, y: -90, w: 110, h: 60, fill: "#0a2838", label: "ESP32-WROOM", sub: "MCU" },
    { x: 80, y: -90, w: 120, h: 50, fill: "#0b2a35", label: "LCD 16x2", sub: "I²C" },
    { x: -200, y: 0, w: 68, h: 40, fill: "#0f5a43", label: "ZMPT101B", sub: "V-SENSE" },
    { x: -200, y: 52, w: 68, h: 40, fill: "#1e40af", label: "SCT-013", sub: "I-SENSE" },
  ];
  const ssrs = [0, 1, 2];
  const caps = [
    { x: -60, y: 80, l: "5 µF", k: "1 kVAR" },
    { x: 30, y: 80, l: "10 µF", k: "2 kVAR" },
    { x: 120, y: 80, l: "20 µF", k: "4 kVAR" },
  ];
  return (
    <g transform="translate(400 260)">
      <ellipse cx="0" cy="180" rx="260" ry="14" fill="#000" opacity="0.45" />

      {/* carcasa abierta (contorno + tapa abatida arriba) */}
      <g opacity="0.6">
        <rect
          x="-228"
          y="-174"
          width="456"
          height="64"
          rx="6"
          fill="none"
          stroke="rgba(34,211,238,0.25)"
          strokeDasharray="4 6"
        />
        <text
          x="0"
          y="-138"
          textAnchor="middle"
          fill="var(--fg-faint)"
          fontSize="9"
          fontFamily="var(--mono)"
          letterSpacing="2"
        >
          TAPA RETIRADA
        </text>
      </g>

      {/* carcasa body */}
      <rect
        x="-228"
        y="-128"
        width="456"
        height="286"
        rx="10"
        fill="url(#caseSide2)"
        stroke="rgba(34,211,238,0.3)"
        strokeWidth="1"
      />

      {/* PCB */}
      <rect x="-220" y="-120" width="440" height="270" rx="6" fill="url(#pcbG)" stroke="rgba(34,211,238,0.35)" />

      {/* silk grid + traces */}
      {[-70, -30, 10, 50, 90, 130].map((y) => (
        <path
          key={y}
          d={`M -210 ${y} C -120 ${y + 6}, 60 ${y - 6}, 210 ${y}`}
          fill="none"
          stroke="#22D3EE"
          strokeOpacity="0.18"
          strokeWidth="0.8"
        />
      ))}
      {[-160, -100, -40, 20, 80, 140, 200].map((x) => (
        <line key={x} x1={x} y1={-120} x2={x} y2={150} stroke="rgba(34,211,238,0.08)" strokeDasharray="1 3" />
      ))}

      {/* componentes */}
      {components.map((c) => (
        <g key={c.label} transform={`translate(${c.x} ${c.y})`}>
          <rect
            x="0"
            y="0"
            width={c.w}
            height={c.h}
            rx="3"
            fill="#0A0D12"
            stroke="rgba(34,211,238,0.5)"
            strokeWidth="1"
          />
          <rect x="4" y="4" width={c.w - 8} height={c.h - 20} rx="2" fill={c.fill} opacity="0.85" />
          <text
            x={c.w / 2}
            y={c.h - 6}
            textAnchor="middle"
            fill="#22D3EE"
            fontSize="8.5"
            fontFamily="var(--mono)"
            letterSpacing="1.5"
          >
            {c.label}
          </text>
          {c.sub && (
            <text
              x={4}
              y={-4}
              fill="var(--fg-faint)"
              fontSize="7.5"
              fontFamily="var(--mono)"
              letterSpacing="2"
            >
              {c.sub}
            </text>
          )}
        </g>
      ))}

      {/* SSRs */}
      {ssrs.map((i) => (
        <g key={i} transform={`translate(${-70 + i * 44} 0)`}>
          <rect x="0" y="0" width="36" height="54" rx="3" fill="#0A0D12" stroke="rgba(239,68,68,0.45)" />
          <rect x="3" y="3" width="30" height="40" rx="2" fill="#1a1f27" />
          <circle cx="18" cy="14" r="2.4" fill="#EF4444">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </circle>
          <text x="18" y="50" textAnchor="middle" fill="var(--fg-faint)" fontSize="7" fontFamily="var(--mono)" letterSpacing="1.5">
            SSR{i + 1}
          </text>
        </g>
      ))}

      {/* capacitores cilíndricos */}
      {caps.map((c) => (
        <g key={c.l} transform={`translate(${c.x} ${c.y})`}>
          <ellipse cx="26" cy="0" rx="26" ry="6" fill="#B8C0CB" />
          <rect x="0" y="0" width="52" height="62" fill="url(#capSide)" stroke="#565d68" />
          <ellipse cx="26" cy="62" rx="26" ry="6" fill="#2a2f37" />
          <rect x="0" y="18" width="52" height="8" fill="#1a1f27" />
          <text x="26" y="16" textAnchor="middle" fill="#22D3EE" fontSize="8.5" fontFamily="var(--mono)" letterSpacing="1.5">
            {c.l}
          </text>
          <text x="26" y="42" textAnchor="middle" fill="var(--fg-dim)" fontSize="7" fontFamily="var(--mono)" letterSpacing="2">
            450 VAC
          </text>
          <text x="26" y="54" textAnchor="middle" fill="var(--fg-faint)" fontSize="7" fontFamily="var(--mono)" letterSpacing="2">
            {c.k}
          </text>
        </g>
      ))}

      {/* callouts */}
      <g fontFamily="var(--mono)" fontSize="9" fill="var(--cyan)" letterSpacing="2">
        <g>
          <line x1="-26" y1="-60" x2="-26" y2="-180" stroke="rgba(34,211,238,0.5)" />
          <circle cx="-26" cy="-60" r="3" fill="#22D3EE" />
          <text x="-22" y="-184">MCU · ESP32</text>
        </g>
        <g>
          <line x1="200" y1="-65" x2="270" y2="-130" stroke="rgba(34,211,238,0.5)" />
          <circle cx="200" cy="-65" r="3" fill="#22D3EE" />
          <text x="274" y="-128">PANTALLA LCD</text>
        </g>
        <g>
          <line x1="-26" y1="120" x2="-26" y2="200" stroke="rgba(34,211,238,0.5)" />
          <circle cx="-26" cy="120" r="3" fill="#22D3EE" />
          <text x="-22" y="214">BANCO DE CAPACITORES</text>
        </g>
        <g>
          <line x1="-52" y1="30" x2="-260" y2="30" stroke="rgba(34,211,238,0.5)" />
          <circle cx="-52" cy="30" r="3" fill="#22D3EE" />
          <text x="-264" y="26" textAnchor="end">SENSORES V / I</text>
        </g>
      </g>
    </g>
  );
}

function PlaceholderCanvas({ view, yaw, bob }: { view: "externa" | "interna"; yaw: number; bob: number }) {
  return (
    <div className="ph-device" aria-hidden>
      <svg
        viewBox="0 0 800 520"
        width="80%"
        style={{
          maxWidth: 780,
          overflow: "visible",
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))",
          transform: `translateY(${bob}px) rotate(${yaw * 0.08}deg)`,
          transition: "transform .12s linear",
        }}
      >
        <defs>
          <linearGradient id="caseFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141A22" />
            <stop offset="100%" stopColor="#0A0E13" />
          </linearGradient>
          <linearGradient id="caseSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0E1116" />
            <stop offset="100%" stopColor="#050709" />
          </linearGradient>
          <linearGradient id="caseSide2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1116" />
            <stop offset="100%" stopColor="#050709" />
          </linearGradient>
          <radialGradient id="screwGrad" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#2a3340" />
            <stop offset="100%" stopColor="#0A0D12" />
          </radialGradient>
          <linearGradient id="pcbG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#072b1f" />
            <stop offset="100%" stopColor="#03110c" />
          </linearGradient>
          <linearGradient id="capSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8AA0B4" />
            <stop offset="50%" stopColor="#5E6D7D" />
            <stop offset="100%" stopColor="#3A434F" />
          </linearGradient>
          <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1" fill="rgba(34,211,238,0.12)" />
          </pattern>
        </defs>

        <g style={{ transition: "opacity .45s ease" }} opacity={view === "externa" ? 1 : 0}>
          <DeviceExternal />
        </g>
        <g style={{ transition: "opacity .45s ease" }} opacity={view === "interna" ? 1 : 0}>
          <DeviceInternal />
        </g>
      </svg>
    </div>
  );
}


const SPECS: [string, string][] = [
  ["DIMENSIONES", "20 × 18 × 10 cm"],
  ["CARCASA", "IP54 · ABS industrial"],
  ["MCU", "ESP32-WROOM-32"],
  ["ALIMENTACIÓN", "120 V / 60 Hz"],
  ["PANTALLA", "OLED I²C 128×64"],
  ["COMPENSACIÓN", "7 niveles · 1–7 kVAR"],
];

export default function Device() {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"externa" | "interna">("externa");
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((s) => s + dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const yaw = Math.sin(t * 0.35) * 14;
  const bob = Math.sin(t * 0.9) * 3;

  return (
    <section id="dispositivo" data-screen-label="05 Propuesta">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">05 / 10</span>
          <span className="kicker">· Prototipo físico</span>
        </div>

        <div
          className="reveal"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, alignItems: "end", marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <h2>
                Prototipo físico del sistema.
                <br />
                <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>Explóralo en 3D.</em>
              </h2>
              <p className="sec-sub" style={{ marginTop: 16 }}>
                Este es el dispositivo que construiremos. El modelo embebido abajo podrá rotarse,
                inspeccionarse desde cualquier ángulo y cambiarse entre vista externa e interna
                para revisar la distribución real de sus componentes.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>
                <span className="dot" style={{ background: "var(--amber)" }} />
                BOCETO · MODELO EN PREPARACIÓN
              </span>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>
                SEMINARIO III
              </span>
            </div>
          </div>
        </div>

        <div className="reveal viewer3d" style={{ marginTop: 32 }}>
          <div className="viewer3d-bar">
            <div className="viewer3d-tabs" role="tablist" aria-label="Vista del modelo">
              <button
                className={"viewer3d-tab " + (view === "externa" ? "active" : "")}
                onClick={() => setView("externa")}
              >
                <IconBox /> Vista externa
              </button>
              <button
                className={"viewer3d-tab " + (view === "interna" ? "active" : "")}
                onClick={() => setView("interna")}
              >
                <IconBoxOpen /> Vista interna
              </button>
            </div>
            <div className="viewer3d-chips">
              <span className="viewer3d-chip">
                <IconRotate /> ROTAR
              </span>
              <span className="viewer3d-chip">
                <IconPinch /> ZOOM
              </span>
              <span className="viewer3d-chip">
                <IconCube /> EXPLORAR
              </span>
            </div>
          </div>

          <div className="viewer3d-stage">
            <div className="viewer3d-floor" />
            <div className="viewer3d-vignette" />
            <PlaceholderCanvas view={view} yaw={yaw} bob={bob} />
            {!loaded && <SkeletonOverlay />}
            <span className="viewer3d-corner tl" />
            <span className="viewer3d-corner tr" />
            <span className="viewer3d-corner bl" />
            <span className="viewer3d-corner br" />

            <div className="viewer3d-hud">
              <div className="hud-left">
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)" }}>
                  ASSET
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>
                  /assets/prototype.glb
                </span>
              </div>
              <div className="hud-right">
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--fg-faint)" }}>
                  {view === "externa"
                    ? "CARCASA IP54 · 20×18×10 cm"
                    : "8 COMPONENTES · ESP32 + 3C + 3SSR + 2 SENS"}
                </span>
              </div>
            </div>

            <button className="viewer3d-load" onClick={() => setLoaded((v) => !v)}>
              {loaded ? "Reiniciar visor" : "Cargar modelo"}
            </button>
          </div>

          <div className="viewer3d-features">
            <FeatureCell icon={<IconPlug />} title="Plug & Play" body="Instalación directa en el tablero eléctrico del comercio." />
            <FeatureCell icon={<IconBolt />} title="Corrección automática" body="Ajuste inteligente en pasos binarios de 1 kVAR." />
            <FeatureCell icon={<IconGauge />} title="Monitoreo en vivo" body="Parámetros eléctricos visibles en pantalla OLED." />
            <FeatureCell icon={<IconShield />} title="Seguro y aislado" body="Sensores galvánicamente aislados. SSR de estado sólido." />
          </div>
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          {SPECS.map(([k, v]) => (
            <div
              key={k}
              style={{
                padding: "14px 16px",
                border: "1px solid var(--line)",
                borderRadius: 4,
                background: "var(--bg-elev)",
              }}
            >
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>
                {k}
              </div>
              <div className="mono" style={{ fontSize: 13, color: "var(--fg)", marginTop: 6 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
