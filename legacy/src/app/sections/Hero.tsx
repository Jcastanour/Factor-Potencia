"use client";

import dynamic from "next/dynamic";
import { hero } from "@/content/copy";
import { Eyebrow, Monolabel, TechGrid } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

const DeviceScene = dynamic(
  () => import("@/components/three/DeviceScene").then((m) => m.DeviceScene),
  { ssr: false, loading: () => <div className="h-[520px]" /> },
);

export function Hero() {
  return (
    <header id="top" className="relative isolate min-h-[100vh] overflow-hidden pt-14">
      <TechGrid />
      <div className="pointer-events-none absolute -left-1/4 top-1/3 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-1/4 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-14 px-6 py-28 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:py-32">
        <Reveal>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="mt-6 whitespace-pre-line text-5xl font-semibold tracking-tight text-[var(--fg-primary)] sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)] sm:text-xl">
            {hero.sub}
          </p>

          <a
            href="#demo"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--accent-electric)]/40 bg-[var(--accent-electric)]/5 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent-electric)] transition-colors hover:bg-[var(--accent-electric)]/10"
          >
            {hero.cta}
            <span aria-hidden>→</span>
          </a>

          <dl className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {hero.meta.map((m) => (
              <div
                key={m.label}
                className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/60 p-4 backdrop-blur-sm"
              >
                <Monolabel>{m.label}</Monolabel>
                <div className="mt-2 font-mono text-xl font-semibold tabular-nums text-[var(--fg-primary)]">
                  {m.value}
                </div>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={180} className="relative">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--hairline)] bg-[var(--bg-elevated)]/40 tech-grid-fine">
            <div className="absolute inset-0">
              <DeviceScene className="h-full w-full" />
            </div>
            {/* crosshair overlay */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.22em] text-[var(--fg-dim)]">
                PROTOTIPO · ESP32 · v0.1
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-[var(--accent-electric)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-electric)] pulse-dot" />
                LIVE
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
