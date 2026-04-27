"use client";

import dynamic from "next/dynamic";
import { device } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

const DeviceScene = dynamic(
  () => import("@/components/three/DeviceScene").then((m) => m.DeviceScene),
  { ssr: false, loading: () => <div className="h-[520px]" /> },
);

export function Device() {
  return (
    <Section id="dispositivo" tone="elevated">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={device.eyebrow}
            headline={device.headline}
            body={device.body}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="relative h-[520px] overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] tech-grid-fine">
            <DeviceScene height={520} className="h-full w-full" />
            <div className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.22em] text-[var(--fg-dim)]">
              VISTA · ISO · 420 × 280 × 120 mm
            </div>
          </Reveal>

          <Reveal delay={140}>
            <Monolabel>Bill of materials · conceptual</Monolabel>
            <dl className="mt-6 divide-y divide-[var(--hairline)] rounded-md border border-[var(--hairline)] bg-[var(--bg-base)]">
              {device.specs.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between gap-6 px-5 py-4"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                    {s.k}
                  </dt>
                  <dd className="text-right text-sm font-medium text-[var(--fg-primary)]">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-[var(--fg-muted)]">
              Costo de materiales: <span className="text-[var(--fg-primary)]">≈ 193.000 COP</span> · precio
              sugerido: <span className="text-[var(--fg-primary)]">350 – 450 k</span>.
            </p>
          </Reveal>
        </div>
      </SectionInner>
    </Section>
  );
}
