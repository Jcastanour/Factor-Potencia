"use client";

import { readingFromActiveAndFp } from "@domain/power-factor";

type Props = {
  activeKw: number;
  fp: number;
  size?: number;
  className?: string;
};

export function PowerTriangle({ activeKw, fp, size = 320, className }: Props) {
  const reading = readingFromActiveAndFp(activeKw, fp);
  const { reactiveKvar, apparentKva } = reading;
  const maxMag = Math.max(activeKw, reactiveKvar, apparentKva, 1);
  const scale = (size - 80) / maxMag;

  const ox = 40;
  const oy = size - 40;
  const px = ox + activeKw * scale;
  const qy = oy - reactiveKvar * scale;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} role="img" aria-label="Triángulo de potencias">
      <line x1={ox} y1={oy} x2={px} y2={qy} stroke="var(--accent-electric)" strokeWidth="2" />
      <line x1={ox} y1={oy} x2={px} y2={oy} stroke="var(--fg-primary)" strokeWidth="2" />
      <line x1={px} y1={oy} x2={px} y2={qy} stroke="var(--accent-warn)" strokeWidth="2" />
      <circle cx={ox} cy={oy} r="4" fill="var(--fg-primary)" />

      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--fg-muted)">
        <text x={(ox + px) / 2} y={oy + 18} textAnchor="middle">
          P = {activeKw.toFixed(2)} kW
        </text>
        <text x={px + 10} y={(oy + qy) / 2} fill="var(--accent-warn)">
          Q = {reactiveKvar.toFixed(2)} kVAR
        </text>
        <text x={(ox + px) / 2 - 14} y={(oy + qy) / 2 - 8} fill="var(--accent-electric)">
          S = {apparentKva.toFixed(2)} kVA
        </text>
        <text x={ox + 12} y={oy - 4} fontSize="9" fill="var(--fg-dim)">
          φ = {((Math.acos(Math.max(0, Math.min(1, fp))) * 180) / Math.PI).toFixed(1)}°
        </text>
      </g>
    </svg>
  );
}
