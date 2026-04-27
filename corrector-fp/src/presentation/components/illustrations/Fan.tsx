"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@shared/utils/cn";
import { fpQuality } from "@domain/power-factor";

type Props = {
  size?: number;
  className?: string;
  initialFp?: number;
};

const FP_MIN = 0.6;
const FP_MAX = 1;
/** rad/s a FP_MIN (lento, motor "pesado") y FP_MAX (rápido, "corregido"). */
const OMEGA_AT_MIN = 0.55;
const OMEGA_AT_MAX = 4.5;

const QUALITY_COLOR: Record<ReturnType<typeof fpQuality>, string> = {
  bad: "var(--accent-bad)",
  warn: "var(--accent-warn)",
  signal: "var(--accent-signal)",
  ok: "var(--accent-ok)",
};

/**
 * Ventilador industrial — interactivo.
 * Arrastra horizontalmente para cambiar el FP: bajo = motor pesado y lento;
 * alto = motor corregido, girando libre.
 */
export function Fan({ size = 320, className, initialFp = 0.72 }: Props) {
  const [fp, setFp] = useState(initialFp);
  const [dragging, setDragging] = useState(false);
  const rotationRef = useRef(0);
  const bladesRef = useRef<SVGGElement>(null);
  const fpRef = useRef(fp);
  fpRef.current = fp;

  // rAF loop — integramos la velocidad angular para no depender de SMIL
  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (fpRef.current - FP_MIN) / (FP_MAX - FP_MIN);
      const omega = OMEGA_AT_MIN + Math.max(0, Math.min(1, t)) * (OMEGA_AT_MAX - OMEGA_AT_MIN);
      rotationRef.current = (rotationRef.current + omega * dt * 57.2957795) % 360;
      if (bladesRef.current) {
        bladesRef.current.setAttribute("transform", `rotate(${rotationRef.current.toFixed(2)})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Drag: 1 px = 0.0015 FP
  const startRef = useRef<{ x: number; fp: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, fp };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const next = startRef.current.fp + dx * 0.0015;
    setFp(Math.min(FP_MAX, Math.max(FP_MIN, next)));
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    startRef.current = null;
    setDragging(false);
  };

  const phiDeg = ((Math.acos(Math.max(0, Math.min(1, fp))) * 180) / Math.PI).toFixed(1);
  const bladeColor = QUALITY_COLOR[fpQuality(fp)];
  const state = fp >= 0.95 ? "CORREGIDO" : fp >= 0.9 ? "LÍMITE" : fp >= 0.8 ? "INDUCTIVO" : "PESADO";

  return (
    <svg
      viewBox="-160 -160 320 320"
      width={size}
      height={size}
      className={cn(
        "select-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label={`Ventilador · FP ${fp.toFixed(2)} · arrastra para ajustar`}
      style={{ touchAction: "pan-y" }}
    >
      <defs>
        <radialGradient id="fan-hub" cx="0" cy="0" r="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1b222b" />
          <stop offset="100%" stopColor="#07090b" />
        </radialGradient>
      </defs>

      {/* Aro exterior + ticks */}
      <circle cx="0" cy="0" r="150" fill="none" stroke="var(--hairline-strong)" strokeWidth="1" />
      <circle cx="0" cy="0" r="140" fill="none" stroke="var(--hairline)" strokeWidth="1" />
      <g stroke="var(--hairline-strong)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          const cos = +Math.cos(a).toFixed(3);
          const sin = +Math.sin(a).toFixed(3);
          return <line key={i} x1={cos * 150} y1={sin * 150} x2={cos * 156} y2={sin * 156} />;
        })}
      </g>

      {/* Marcas cardinales sutiles */}
      <g stroke="var(--hairline)" strokeWidth="0.75">
        <line x1="-148" y1="0" x2="-138" y2="0" />
        <line x1="138" y1="0" x2="148" y2="0" />
        <line x1="0" y1="-148" x2="0" y2="-138" />
        <line x1="0" y1="138" x2="0" y2="148" />
      </g>

      {/* Indicador de FP objetivo (0.95) en arco */}
      <path
        d="M 148 0 A 148 148 0 0 1 45.7 140.75"
        fill="none"
        stroke="var(--accent-ok)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* Aspas (grupo rotatorio — JS rAF) */}
      <g ref={bladesRef} transform="rotate(0)">
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path
              d="
                M 30 -10
                C 70 -22, 105 -18, 128 -8
                A 8 8 0 0 1 128 8
                C 105 18, 70 22, 30 10
                Z
              "
              fill={bladeColor}
              fillOpacity="0.1"
              stroke={bladeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              style={{ transition: "fill 400ms, stroke 400ms" }}
            />
            <line
              x1="36"
              y1="0"
              x2="124"
              y2="0"
              stroke={bladeColor}
              strokeWidth="0.8"
              strokeOpacity="0.5"
              style={{ transition: "stroke 400ms" }}
            />
          </g>
        ))}
      </g>

      {/* Hub (encima de las aspas) */}
      <circle cx="0" cy="0" r="28" fill="url(#fan-hub)" stroke="var(--hairline-strong)" strokeWidth="1" />
      <circle cx="0" cy="0" r="8" fill={bladeColor} opacity="0.7" style={{ transition: "fill 400ms" }} />
      <circle cx="0" cy="0" r="3" fill="var(--fg-primary)" />

      {/* Callouts técnicos — reaccionan al FP */}
      <g fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.2em">
        <text x="-154" y="-142" textAnchor="start" fill="var(--fg-dim)">
          MOTOR · {state}
        </text>
        <text x="154" y="-142" textAnchor="end" fill="var(--fg-dim)">
          φ = {phiDeg}°
        </text>
        <text x="0" y="150" textAnchor="middle" fill="var(--fg-muted)">
          FP = {fp.toFixed(2)} · cosφ
        </text>
      </g>

      {/* Hint de interacción (desaparece al arrastrar) */}
      {!dragging && (
        <g
          fontFamily="var(--font-mono)"
          fontSize="8"
          letterSpacing="0.22em"
          fill="var(--accent-electric)"
          opacity="0.55"
          style={{ transition: "opacity 300ms" }}
        >
          <text x="0" y="-156" textAnchor="middle">← ARRASTRA →</text>
        </g>
      )}
    </svg>
  );
}
