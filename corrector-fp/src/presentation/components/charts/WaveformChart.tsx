"use client";

import { useId } from "react";
import { fpQuality } from "@domain/power-factor";

type Props = {
  fp: number;
  width?: number;
  height?: number;
  className?: string;
};

const QUALITY_COLOR: Record<ReturnType<typeof fpQuality>, string> = {
  bad: "var(--accent-bad)",
  warn: "var(--accent-warn)",
  signal: "var(--accent-signal)",
  ok: "var(--accent-ok)",
};

/**
 * Onda sinusoidal de voltaje (claro) y corriente (coloreada por calidad de FP).
 * φ = arccos(FP) se ve en la onda de corriente desfasada.
 */
export function WaveformChart({ fp, width = 640, height = 200, className }: Props) {
  const gradId = useId();
  const phi = Math.acos(Math.max(0, Math.min(1, fp)));
  const mid = height / 2;
  const amp = height * 0.38;

  const cycles = 2;
  const samples = 200;
  const buildPath = (phase: number, ampMul = 1) => {
    const step = width / samples;
    let d = "";
    for (let i = 0; i <= samples; i++) {
      const x = i * step;
      const t = (i / samples) * cycles * Math.PI * 2;
      const y = mid - Math.sin(t + phase) * amp * ampMul;
      d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return d;
  };

  const vPath = buildPath(0, 1);
  const iPath = buildPath(-phi, 0.75);
  const iColor = QUALITY_COLOR[fpQuality(fp)];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Voltaje y corriente con FP ${fp.toFixed(2)}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={iColor} stopOpacity="0" />
          <stop offset="20%" stopColor={iColor} stopOpacity="1" />
          <stop offset="80%" stopColor={iColor} stopOpacity="1" />
          <stop offset="100%" stopColor={iColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      <line x1="0" y1={mid} x2={width} y2={mid} stroke="var(--hairline)" strokeDasharray="2 4" />
      <path d={vPath} fill="none" stroke="var(--fg-primary)" strokeWidth="1.5" strokeOpacity="0.7" />
      <path
        d={iPath}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        style={{ transition: "stroke 600ms" }}
      />

      <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--fg-muted)" letterSpacing="0.2em">
        <text x="8" y="16" textAnchor="start">V (t)</text>
        <text x={width - 8} y="16" textAnchor="end" fill={iColor}>
          I (t) · φ = {((phi * 180) / Math.PI).toFixed(1)}°
        </text>
      </g>
    </svg>
  );
}
