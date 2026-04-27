"use client";

import { powerTriangle } from "@/lib/power-factor";

type Props = {
  P: number;
  fp: number;
  size?: number;
  className?: string;
};

/**
 * Triángulo de potencias P (horizontal), Q (vertical), S (hipotenusa).
 */
export function PowerTriangle({ P, fp, size = 320, className }: Props) {
  const { Q, S } = powerTriangle(P, fp);
  // Escala máxima razonable
  const maxMag = Math.max(P, Q, S, 1);
  const scale = (size - 80) / maxMag;

  const ox = 40;
  const oy = size - 40;
  const px = ox + P * scale;
  const qy = oy - Q * scale;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Triángulo de potencias"
    >
      {/* Hipotenusa S */}
      <line
        x1={ox} y1={oy} x2={px} y2={qy}
        stroke="var(--accent-electric)" strokeWidth="2"
      />
      {/* P horizontal */}
      <line
        x1={ox} y1={oy} x2={px} y2={oy}
        stroke="var(--fg-primary)" strokeWidth="2"
      />
      {/* Q vertical */}
      <line
        x1={px} y1={oy} x2={px} y2={qy}
        stroke="var(--accent-warn)" strokeWidth="2"
      />
      {/* Punto vértice */}
      <circle cx={ox} cy={oy} r="4" fill="var(--fg-primary)" />

      <g fontFamily="var(--font-mono), monospace" fontSize="11" fill="var(--fg-muted)">
        <text x={(ox + px) / 2} y={oy + 18} textAnchor="middle">
          P = {(P / 1000).toFixed(2)} kW
        </text>
        <text x={px + 10} y={(oy + qy) / 2} fill="var(--accent-warn)">
          Q = {(Q / 1000).toFixed(2)} kVAR
        </text>
        <text
          x={(ox + px) / 2 - 14}
          y={(oy + qy) / 2 - 8}
          fill="var(--accent-electric)"
        >
          S = {(S / 1000).toFixed(2)} kVA
        </text>
        <text x={ox + 12} y={oy - 4} fontSize="9" fill="var(--fg-dim)">
          φ = {(Math.acos(fp) * 180 / Math.PI).toFixed(1)}°
        </text>
      </g>
    </svg>
  );
}
