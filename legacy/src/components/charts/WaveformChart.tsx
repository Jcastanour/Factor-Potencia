"use client";

import { useId } from "react";

type Props = {
  fp: number;
  width?: number;
  height?: number;
  showCurrentAligned?: boolean;
  className?: string;
};

/**
 * Onda sinusoidal de voltaje (blanco) y corriente (ámbar/verde según FP).
 * El desfase φ = arccos(FP) se visualiza en la onda de corriente.
 */
export function WaveformChart({
  fp,
  width = 640,
  height = 200,
  className,
}: Props) {
  const gradId = useId();
  const phi = Math.acos(Math.max(0, Math.min(1, fp)));
  const mid = height / 2;
  const amp = height * 0.38;

  // 2 ciclos completos
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

  const iColor = fp >= 0.95 ? "var(--accent-ok)" : fp >= 0.88 ? "var(--accent-signal)" : fp >= 0.8 ? "var(--accent-warn)" : "var(--accent-bad)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Formas de onda de voltaje y corriente con factor de potencia ${fp.toFixed(2)}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={iColor} stopOpacity="0" />
          <stop offset="20%" stopColor={iColor} stopOpacity="1" />
          <stop offset="80%" stopColor={iColor} stopOpacity="1" />
          <stop offset="100%" stopColor={iColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid horizontal */}
      <line
        x1="0" y1={mid} x2={width} y2={mid}
        stroke="var(--hairline)" strokeDasharray="2 4"
      />

      {/* V */}
      <path
        d={vPath}
        fill="none"
        stroke="var(--fg-primary)"
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />

      {/* I */}
      <path
        d={iPath}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        style={{ transition: "stroke 600ms" }}
      />

      {/* Etiquetas */}
      <g fontFamily="var(--font-mono), monospace" fontSize="10" fill="var(--fg-muted)" letterSpacing="0.2em">
        <text x="8" y="16" textAnchor="start">V (t)</text>
        <text x={width - 8} y="16" textAnchor="end" fill={iColor}>
          I (t) · φ = {((phi * 180) / Math.PI).toFixed(1)}°
        </text>
      </g>
    </svg>
  );
}
