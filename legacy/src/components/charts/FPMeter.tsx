"use client";

import { fpColor } from "@/lib/power-factor";

type Props = {
  fp: number;
  size?: number;
  className?: string;
};

/**
 * Medidor semi-circular de FP (0 → 1).
 */
export function FPMeter({ fp, size = 220, className }: Props) {
  const clamped = Math.max(0, Math.min(1, fp));
  const R = size * 0.42;
  const cx = size / 2;
  const cy = size * 0.72;

  const toXY = (t: number) => {
    const angle = Math.PI + t * Math.PI;
    return [cx + Math.cos(angle) * R, cy + Math.sin(angle) * R] as const;
  };

  const [sx, sy] = toXY(0);
  const [ex, ey] = toXY(clamped);
  const [efx, efy] = toXY(1);

  const arcTrack = `M ${sx} ${sy} A ${R} ${R} 0 ${clamped > 0.5 ? 1 : 0} 1 ${efx} ${efy}`;
  const arcValue = `M ${sx} ${sy} A ${R} ${R} 0 ${clamped > 0.5 ? 1 : 0} 1 ${ex} ${ey}`;

  const needleAngle = Math.PI + clamped * Math.PI;
  const nx = cx + Math.cos(needleAngle) * (R - 6);
  const ny = cy + Math.sin(needleAngle) * (R - 6);

  return (
    <svg
      viewBox={`0 0 ${size} ${size * 0.85}`}
      className={className}
      role="img"
      aria-label={`Medidor de factor de potencia · ${fp.toFixed(2)}`}
    >
      <path d={arcTrack} fill="none" stroke="var(--hairline)" strokeWidth="8" strokeLinecap="round" />
      <path
        d={arcValue}
        fill="none"
        stroke={fpColor(fp)}
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transition: "stroke 500ms, d 400ms" }}
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="var(--fg-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="4" fill="var(--fg-primary)" />

      {/* Ticks 0.88 y 0.97 (umbrales) */}
      {[0.88, 0.97].map((t) => {
        const [tx1, ty1] = toXY(t);
        const a = Math.PI + t * Math.PI;
        const tx2 = cx + Math.cos(a) * (R - 14);
        const ty2 = cy + Math.sin(a) * (R - 14);
        return (
          <line
            key={t}
            x1={tx1} y1={ty1} x2={tx2} y2={ty2}
            stroke="var(--fg-dim)" strokeWidth="1.5"
          />
        );
      })}

      <g fontFamily="var(--font-mono), monospace" textAnchor="middle">
        <text x={cx} y={cy + 10} fontSize="28" fill="var(--fg-primary)" fontWeight="600">
          {fp.toFixed(2)}
        </text>
        <text x={cx} y={cy + 28} fontSize="10" letterSpacing="0.2em" fill="var(--fg-muted)">
          FACTOR DE POTENCIA
        </text>
      </g>
    </svg>
  );
}
