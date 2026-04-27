"use client";

import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useDemoSimulation } from "@application/demo/useDemoSimulation";
import {
  COMPONENTS,
  GROUP_ORDER,
  GROUPS,
  type DeviceComponent,
  type FunctionalGroup,
} from "@presentation/components/device/components-data";
import { HotspotPanel } from "@presentation/components/device/HotspotPanel";

/* ───────────────────────── Iconos (mismo lenguaje del repo) ───────────────────────── */

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
const IconReset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 4v6h6" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L3 8" />
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

/* ───────────────────────── Defs SVG compartidos ───────────────────────── */

function SvgDefs() {
  return (
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
  );
}

/* ───────────────────────── Vista externa ───────────────────────── */

interface ExternalProps {
  readonly oled: { fp: number; pKw: number; sKva: number; qKvar: number };
}

function DeviceExternal({ oled }: ExternalProps) {
  return (
    <g transform="translate(400 260)">
      <ellipse cx="0" cy="190" rx="260" ry="16" fill="#000" opacity="0.5" />

      <g transform="skewY(-8)">
        <path d="M 200 -130 L 234 -112 L 234 150 L 200 130 Z" fill="url(#caseSide)" stroke="rgba(34,211,238,0.18)" strokeWidth="0.8" />
        <path d="M -200 130 L -166 148 L 234 150 L 200 130 Z" fill="url(#caseSide2)" stroke="rgba(34,211,238,0.12)" strokeWidth="0.8" />
        <rect x="-200" y="-130" width="400" height="260" rx="14" fill="url(#caseFront)" stroke="rgba(34,211,238,0.45)" strokeWidth="1.2" />
        <rect x="-192" y="-122" width="384" height="244" rx="10" fill="none" stroke="rgba(232,238,245,0.05)" strokeWidth="1" />

        {[[-170, -100], [170, -100], [-170, 100], [170, 100]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="8" fill="#0E1116" stroke="rgba(34,211,238,0.35)" strokeWidth="1" />
            <circle r="8" fill="url(#screwGrad)" />
            <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#0A0D12" strokeWidth="1.3" />
          </g>
        ))}

        {/* OLED — datos en vivo desde useDemoSimulation */}
        <g transform="translate(-150 -88)">
          <rect x="0" y="0" width="190" height="112" rx="4" fill="#030708" stroke="rgba(34,211,238,0.5)" strokeWidth="1" />
          <rect x="3" y="3" width="184" height="106" rx="3" fill="#041318" />
          <rect x="3" y="3" width="184" height="106" rx="3" fill="url(#scan)" opacity="0.4" />
          <g fontFamily="var(--mono)" fill="#22D3EE">
            <text x="14" y="26" fontSize="14" letterSpacing="1.2">FP: {oled.fp.toFixed(2)}</text>
            <text x="14" y="48" fontSize="14" letterSpacing="1.2">P : {oled.pKw.toFixed(2)} kW</text>
            <text x="14" y="70" fontSize="14" letterSpacing="1.2">S : {oled.sKva.toFixed(2)} kVA</text>
            <text x="14" y="92" fontSize="14" letterSpacing="1.2">Q : {oled.qKvar.toFixed(2)} kVAR</text>
          </g>
          <rect x="158" y="16" width="8" height="14" fill="#22D3EE">
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
              <text x="22" y="4" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">{l}</text>
            </g>
          ))}
        </g>

        {/* Prensaestopas */}
        {[-120, -70].map((x, i) => (
          <g key={i} transform={`translate(${x} 70)`}>
            <circle r="14" fill="#0A0D12" stroke="rgba(34,211,238,0.3)" />
            <circle r="9" fill="#111821" stroke="rgba(232,238,245,0.08)" />
            <circle r="3" fill="#22D3EE" opacity="0.35" />
          </g>
        ))}

        {/* Etiqueta */}
        <g transform="translate(20 52)">
          <rect x="0" y="0" width="170" height="58" rx="3" fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.22)" />
          <text x="85" y="20" textAnchor="middle" fill="var(--fg-dim)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">CORRECTOR AUTOMÁTICO</text>
          <text x="85" y="34" textAnchor="middle" fill="var(--fg-dim)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">DE FACTOR DE POTENCIA</text>
          <text x="85" y="50" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="var(--mono)" letterSpacing="3">PFC · UNAL · v0.1</text>
        </g>
      </g>

      {/* Cotas — solo 2, simplificadas */}
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
      </g>
    </g>
  );
}

/* ───────────────────────── Vista interna ───────────────────────── */

interface InternalProps {
  readonly mask: number;
  readonly exploring: boolean;
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  /** Offset Y de la "tapa retirada" para el reveal animado. */
  readonly lidLift: number;
}

const GROUP_REGIONS: Record<FunctionalGroup, { x: number; y: number; w: number; h: number; label: string }> = {
  alimentacion: { x: -218, y: -120, w: 134, h: 86, label: "ALIMENTACIÓN" },
  control: { x: -82, y: -120, w: 220, h: 86, label: "CONTROL" },
  sensado: { x: -218, y: -32, w: 134, h: 100, label: "SENSADO" },
  actuacion: { x: -82, y: -2, w: 134, h: 56, label: "ACTUACIÓN" },
  compensacion: { x: -82, y: 60, w: 220, h: 90, label: "COMPENSACIÓN" },
};

function DeviceInternal({ mask, exploring, selectedId, onSelect, lidLift }: InternalProps) {
  return (
    <g transform="translate(400 260)">
      <ellipse cx="0" cy="180" rx="260" ry="14" fill="#000" opacity="0.45" />

      {/* Carcasa */}
      <rect x="-228" y="-128" width="456" height="286" rx="10" fill="url(#caseSide2)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />

      {/* Tapa retirada — translada con lidLift */}
      <g style={{ transform: `translateY(${lidLift}px)`, transition: "transform .6s cubic-bezier(0.2,0.7,0.2,1)" }} opacity={Math.max(0, 1 - Math.abs(lidLift) / 80)}>
        <rect x="-228" y="-174" width="456" height="56" rx="6" fill="none" stroke="rgba(34,211,238,0.35)" strokeDasharray="4 6" />
        <text x="0" y="-142" textAnchor="middle" fill="var(--fg-faint)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">
          TAPA RETIRADA
        </text>
      </g>

      {/* PCB */}
      <rect x="-220" y="-120" width="440" height="270" rx="6" fill="url(#pcbG)" stroke="rgba(34,211,238,0.35)" />

      {/* Trazas */}
      {[-70, -30, 10, 50, 90, 130].map((y) => (
        <path key={y} d={`M -210 ${y} C -120 ${y + 6}, 60 ${y - 6}, 210 ${y}`} fill="none" stroke="#22D3EE" strokeOpacity="0.16" strokeWidth="0.8" />
      ))}
      {[-160, -100, -40, 20, 80, 140, 200].map((x) => (
        <line key={x} x1={x} y1={-120} x2={x} y2={150} stroke="rgba(34,211,238,0.07)" strokeDasharray="1 3" />
      ))}

      {/* Regiones funcionales — backgrounds sutiles */}
      {GROUP_ORDER.map((g) => {
        const r = GROUP_REGIONS[g];
        return (
          <g key={g}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx="4"
              fill="rgba(34,211,238,0.025)"
              stroke="rgba(34,211,238,0.18)"
              strokeWidth="0.6"
              strokeDasharray="2 4"
            />
            <text
              x={r.x + 6}
              y={r.y + 12}
              fill="var(--fg-faint)"
              fontSize="7.5"
              fontFamily="var(--mono)"
              letterSpacing="2.5"
            >
              {r.label}
            </text>
          </g>
        );
      })}

      {/* Componentes físicos (visualización simbólica, no clickeable directo — se accede por hotspot) */}
      {/* AC-DC */}
      <g transform="translate(-210 -88)">
        <rect width="80" height="46" rx="3" fill="#0A0D12" stroke="rgba(245,158,11,0.45)" />
        <rect x="4" y="4" width="72" height="28" rx="2" fill="#F59E0B" opacity="0.7" />
        <text x="40" y="42" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="var(--mono)" letterSpacing="1.5">AC-DC 5V</text>
      </g>

      {/* Fusible */}
      <g transform="translate(-210 -76)">
        <circle cx="-6" cy="-6" r="6" fill="#0A0D12" stroke="rgba(34,211,238,0.5)" />
        <circle cx="-6" cy="-6" r="3" fill="#1a2028" />
      </g>

      {/* ESP32 */}
      <g transform="translate(-72 -88)">
        <rect width="100" height="46" rx="3" fill="#0A0D12" stroke="rgba(34,211,238,0.5)" />
        <rect x="4" y="4" width="92" height="28" rx="2" fill="#0a2838" opacity="0.85" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={6 + i * 11} y={2} width={2} height={3} fill="#22D3EE" opacity="0.4" />
        ))}
        <text x="50" y="42" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="var(--mono)" letterSpacing="1.5">ESP32-WROOM</text>
      </g>

      {/* LCD */}
      <g transform="translate(80 -88)">
        <rect width="110" height="46" rx="3" fill="#0A0D12" stroke="rgba(34,211,238,0.5)" />
        <rect x="4" y="4" width="102" height="28" rx="2" fill="#0b2a35" opacity="0.85" />
        <text x="55" y="42" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="var(--mono)" letterSpacing="1.5">LCD 16×2 I²C</text>
      </g>

      {/* Sensores */}
      <g transform="translate(-210 0)">
        <rect width="68" height="36" rx="3" fill="#0A0D12" stroke="rgba(16,185,129,0.45)" />
        <rect x="4" y="4" width="60" height="20" rx="2" fill="#0f5a43" opacity="0.85" />
        <text x="34" y="32" textAnchor="middle" fill="#22D3EE" fontSize="7.5" fontFamily="var(--mono)" letterSpacing="1.4">ZMPT101B</text>
      </g>
      <g transform="translate(-210 52)">
        <rect width="68" height="36" rx="3" fill="#0A0D12" stroke="rgba(59,130,246,0.45)" />
        <rect x="4" y="4" width="60" height="20" rx="2" fill="#1e40af" opacity="0.85" />
        <text x="34" y="32" textAnchor="middle" fill="#22D3EE" fontSize="7.5" fontFamily="var(--mono)" letterSpacing="1.4">SCT-013-030</text>
      </g>

      {/* SSRs (3) — encendidos según mask */}
      {[0, 1, 2].map((i) => {
        const on = (mask >> i) & 1;
        return (
          <g key={i} transform={`translate(${-72 + i * 44} 4)`}>
            <rect x="0" y="0" width="36" height="48" rx="3" fill="#0A0D12" stroke={on ? "rgba(239,68,68,0.85)" : "rgba(239,68,68,0.35)"} />
            <rect x="3" y="3" width="30" height="32" rx="2" fill="#1a1f27" />
            <circle cx="18" cy="14" r="2.6" fill="#EF4444" opacity={on ? 1 : 0.35}>
              {on ? <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" /> : null}
            </circle>
            <text x="18" y="44" textAnchor="middle" fill="var(--fg-faint)" fontSize="7" fontFamily="var(--mono)" letterSpacing="1.5">SSR{i + 1}</text>
          </g>
        );
      })}

      {/* Capacitores */}
      {[
        { x: -76, y: 70, l: "5 µF" },
        { x: 14, y: 70, l: "10 µF" },
        { x: 104, y: 70, l: "20 µF" },
      ].map((c, i) => {
        const on = (mask >> i) & 1;
        return (
          <g key={c.l} transform={`translate(${c.x} ${c.y})`}>
            <ellipse cx="26" cy="0" rx="26" ry="6" fill={on ? "#22D3EE" : "#B8C0CB"} opacity={on ? 0.9 : 1} />
            <rect x="0" y="0" width="52" height="56" fill="url(#capSide)" stroke={on ? "rgba(34,211,238,0.6)" : "#565d68"} />
            <ellipse cx="26" cy="56" rx="26" ry="6" fill="#2a2f37" />
            <rect x="0" y="16" width="52" height="6" fill="#1a1f27" />
            <text x="26" y="14" textAnchor="middle" fill={on ? "#22D3EE" : "var(--fg-dim)"} fontSize="8" fontFamily="var(--mono)" letterSpacing="1.5">
              {c.l}
            </text>
            <text x="26" y="40" textAnchor="middle" fill="var(--fg-faint)" fontSize="6.5" fontFamily="var(--mono)" letterSpacing="2">450 VAC</text>
          </g>
        );
      })}

      {/* Hotspots — solo cuando exploring está activo */}
      {exploring &&
        COMPONENTS.map((comp) => {
          const isSelected = selectedId === comp.id;
          return (
            <g
              key={comp.id}
              transform={`translate(${comp.hotspot.x} ${comp.hotspot.y})`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(comp.id);
              }}
            >
              <circle r="14" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.4)" strokeWidth="0.6">
                <animate attributeName="r" values="12;18;12" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle r={isSelected ? 6 : 4} fill="#22D3EE" />
              <circle r="2" fill="#0A0D12" />
            </g>
          );
        })}
    </g>
  );
}

/* ───────────────────────── Wireframe idle ───────────────────────── */

function DeviceWireframe() {
  return (
    <g transform="translate(400 260)" stroke="rgba(34,211,238,0.45)" fill="none" strokeWidth="0.9">
      <g transform="skewY(-8)">
        <rect x="-200" y="-130" width="400" height="260" rx="14" />
        <rect x="-150" y="-88" width="190" height="112" rx="4" />
        <line x1="-200" y1="130" x2="234" y2="150" />
        <line x1="200" y1="-130" x2="234" y2="-112" />
        <line x1="234" y1="-112" x2="234" y2="150" />
      </g>
      <g stroke="rgba(34,211,238,0.25)" strokeDasharray="2 4">
        <line x1="-220" y1="-150" x2="220" y2="-150" />
        <line x1="-240" y1="-130" x2="-240" y2="130" />
      </g>
      <text x="0" y="180" textAnchor="middle" fill="var(--fg-faint)" stroke="none" fontSize="9" fontFamily="var(--mono)" letterSpacing="3">
        WIREFRAME · MODELO 3D EN PREPARACIÓN
      </text>
    </g>
  );
}

/* ───────────────────────── Componente principal ───────────────────────── */

function FeatureCell({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
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

const SPECS: [string, string][] = [
  ["DIMENSIONES", "20 × 18 × 10 cm"],
  ["CARCASA", "ABS · IP54 (proyectada)"],
  ["MCU", "ESP32-WROOM-32"],
  ["ALIMENTACIÓN", "120 V / 60 Hz"],
  ["PANTALLA", "OLED I²C 128×64"],
  ["COMPENSACIÓN", "7 niveles · 1–7 kVAR"],
];

export default function DeviceClient() {
  const sim = useDemoSimulation();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"externa" | "interna">("externa");
  const [exploring, setExploring] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Yaw automático + drag manual
  const [yaw, setYaw] = useState(0);
  const yawTargetRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; yaw: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [bob, setBob] = useState(0);

  // Animación auto del yaw cuando no se está dragging — bobbing siempre
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setBob((b) => Math.sin(now / 1000 * 0.9) * 3);
      if (!draggingRef.current) {
        const auto = Math.sin(now / 1000 * 0.35) * 14;
        // Vuelve hacia el "auto-yaw" o el target manual
        setYaw((prev) => {
          const target = yawTargetRef.current === 0 ? auto : yawTargetRef.current;
          const k = 1 - Math.exp(-dt * 4);
          return prev + (target - prev) * k;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stageRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      if (!loaded) return;
      draggingRef.current = true;
      dragStartRef.current = { x: e.clientX, yaw };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const next = dragStartRef.current.yaw + dx * 0.4;
      yawTargetRef.current = next;
      setYaw(next);
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      dragStartRef.current = null;
      try { el.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [loaded, yaw]);

  // Wheel zoom
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!loaded) return;
      e.preventDefault();
      setZoom((z) => Math.min(1.6, Math.max(0.7, z + (e.deltaY > 0 ? -0.05 : 0.05))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [loaded]);

  // GSAP transición externa↔interna
  const lidLiftRef = useRef(-60); // empieza fuera de pantalla
  const [lidLift, setLidLift] = useState(-60);
  useEffect(() => {
    if (view === "interna") {
      gsap.to(lidLiftRef, {
        current: -60,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => setLidLift(lidLiftRef.current),
      });
    } else {
      gsap.to(lidLiftRef, {
        current: 0,
        duration: 0.7,
        ease: "power2.in",
        onUpdate: () => setLidLift(lidLiftRef.current),
      });
    }
  }, [view]);

  // Reset
  const reset = useCallback(() => {
    setView("externa");
    setExploring(false);
    setSelectedId(null);
    yawTargetRef.current = 0;
    setYaw(0);
    setZoom(1);
  }, []);

  // OLED data desde simulación
  const oled = useMemo(() => ({
    fp: sim.state.compensatedReading.powerFactor,
    pKw: sim.state.compensatedReading.activeKw,
    sKva: sim.state.compensatedReading.apparentKva,
    qKvar: Math.max(0, sim.state.compensatedReading.reactiveKvar),
  }), [sim.state.compensatedReading]);

  const selected = useMemo(
    () => COMPONENTS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  // Cuando entras a "explorar" y estás en externa, llévalo a interna
  const toggleExplore = useCallback(() => {
    setExploring((e) => {
      const next = !e;
      if (next) setView("interna");
      else setSelectedId(null);
      return next;
    });
  }, []);

  const fadeStyle = (active: boolean): CSSProperties => ({
    transition: "opacity .55s ease",
    opacity: active ? 1 : 0,
    pointerEvents: active ? "auto" : "none",
  });

  const showWireframe = !loaded;

  return (
    <section id="dispositivo" data-screen-label="05 Propuesta">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">05 / 10</span>
          <span className="kicker">· Prototipo físico</span>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, alignItems: "end", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 720 }}>
              <h2>
                Prototipo físico del sistema.
                <br />
                <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>Explóralo en 3D.</em>
              </h2>
              <p className="sec-sub" style={{ marginTop: 16 }}>
                Inspecciona el dispositivo desde fuera, abre la carcasa y revisa el armado interno
                agrupado por función. Activa <span style={{ color: "var(--cyan)" }}>explorar componentes</span> para ver el rol de cada pieza.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>
                <span className="dot" style={{ background: "var(--amber)" }} />
                BOCETO · MODELO EN PREPARACIÓN
              </span>
              <span className="chip" style={{ height: 30, fontSize: 11 }}>SEMINARIO III</span>
            </div>
          </div>
        </div>

        <div className="reveal viewer3d" style={{ marginTop: 32 }}>
          <div className="viewer3d-bar">
            <div className="viewer3d-tabs" role="tablist" aria-label="Vista del modelo">
              <button
                className={"viewer3d-tab " + (view === "externa" ? "active" : "")}
                onClick={() => { setView("externa"); setExploring(false); setSelectedId(null); }}
              >
                <IconBox /> Vista externa
              </button>
              <button
                className={"viewer3d-tab " + (view === "interna" ? "active" : "")}
                onClick={() => setView("interna")}
              >
                <IconBoxOpen /> Vista interna
              </button>
              <button
                className={"viewer3d-tab " + (exploring ? "active" : "")}
                onClick={toggleExplore}
                title="Activa hotspots sobre la vista interna"
              >
                <IconCube /> Explorar
              </button>
            </div>
            <div className="viewer3d-chips">
              <span className="viewer3d-chip"><IconRotate /> ARRASTRA</span>
              <span className="viewer3d-chip"><IconPinch /> SCROLL</span>
              <button
                className="viewer3d-chip"
                onClick={reset}
                style={{ cursor: "pointer", background: "transparent", color: "var(--fg-faint)" }}
              >
                <IconReset /> RESET
              </button>
            </div>
          </div>

          <div
            className="viewer3d-stage"
            ref={stageRef}
            style={{ touchAction: "none", cursor: loaded ? "grab" : "default" }}
          >
            <div className="viewer3d-floor" />
            <div className="viewer3d-vignette" />

            <div className="ph-device" aria-hidden ref={svgWrapRef}>
              <svg
                viewBox="0 0 800 520"
                width="80%"
                style={{
                  maxWidth: 780,
                  overflow: "visible",
                  filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))",
                  transform: `translateY(${bob}px) rotate(${yaw * 0.08}deg) scale(${zoom})`,
                  transition: draggingRef.current ? "none" : "transform .12s linear",
                }}
              >
                <SvgDefs />

                {/* Wireframe idle */}
                <g style={fadeStyle(showWireframe)}>
                  <DeviceWireframe />
                </g>

                {/* Externa */}
                <g style={fadeStyle(loaded && view === "externa")}>
                  <DeviceExternal oled={{ fp: oled.fp, pKw: oled.pKw, sKva: oled.sKva, qKvar: oled.qKvar }} />
                </g>

                {/* Interna */}
                <g style={fadeStyle(loaded && view === "interna")}>
                  <DeviceInternal
                    mask={sim.state.mask}
                    exploring={exploring}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    lidLift={lidLift}
                  />
                </g>
              </svg>
            </div>

            <span className="viewer3d-corner tl" />
            <span className="viewer3d-corner tr" />
            <span className="viewer3d-corner bl" />
            <span className="viewer3d-corner br" />

            {/* HUD */}
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
                  {!loaded
                    ? "WIREFRAME · IP54 · 20×18×10 cm"
                    : view === "externa"
                      ? "VISTA EXTERNA · OLED EN VIVO"
                      : `VISTA INTERNA · ${COMPONENTS.length} COMPONENTES · 5 GRUPOS`}
                </span>
              </div>
            </div>

            {/* CTA Cargar / Reiniciar (solo cuando idle, integrado en HUD) */}
            {!loaded && (
              <button
                className="viewer3d-load"
                onClick={() => setLoaded(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <IconCube /> Cargar modelo
              </button>
            )}
            {loaded && (
              <button
                className="viewer3d-load"
                onClick={() => { setLoaded(false); reset(); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "var(--fg-faint)", borderColor: "var(--line)" }}
              >
                <IconReset /> Reiniciar visor
              </button>
            )}
          </div>

          <div className="viewer3d-features">
            <FeatureCell icon={<IconPlug />} title="Plug & Play" body="Instalación directa en el tablero eléctrico del comercio." />
            <FeatureCell icon={<IconBolt />} title="Corrección automática" body="Ajuste inteligente en pasos binarios de 1 kVAR." />
            <FeatureCell icon={<IconGauge />} title="Monitoreo en vivo" body="Parámetros eléctricos visibles en pantalla OLED." />
            <FeatureCell icon={<IconShield />} title="Seguro y aislado" body="Sensores galvánicamente aislados. SSR de estado sólido." />
          </div>
        </div>

        {/* Panel de hotspot — debajo del stage, no encima */}
        <div className="reveal">
          <HotspotPanel component={selected} onClose={() => setSelectedId(null)} />
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
            <div key={k} style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 4, background: "var(--bg-elev)" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-faint)" }}>{k}</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--fg)", marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
