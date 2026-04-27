"use client";

import { electrical } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { WaveformChart } from "@/components/charts/WaveformChart";
import { PowerTriangle } from "@/components/charts/PowerTriangle";
import { Reveal } from "@/components/Reveal";

export function Electrical() {
  // FP animable en una sección estática — usamos un valor fijo para mostrar el desfase inductivo
  const FP_BAD = 0.72;
  const P = 5000;

  return (
    <Section id="electrico">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={electrical.eyebrow}
            headline={electrical.headline}
            body={electrical.body}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
            <div className="flex items-center justify-between">
              <Monolabel>Onda V / I · 60 Hz · carga inductiva típica</Monolabel>
              <span className="font-mono text-[11px] text-[var(--accent-warn)]">
                FP = {FP_BAD.toFixed(2)}
              </span>
            </div>
            <div className="mt-6 overflow-hidden rounded-sm">
              <WaveformChart fp={FP_BAD} width={720} height={220} className="w-full" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
              La corriente <span className="text-[var(--accent-warn)]">I</span> atrasa al voltaje <span className="text-[var(--fg-primary)]">V</span>. Ese ángulo de desfase (φ) es lo que te cobran.
            </p>
          </Reveal>

          <Reveal delay={120} className="rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
            <Monolabel>Triángulo de potencias</Monolabel>
            <div className="mt-6 flex justify-center">
              <PowerTriangle P={P} fp={FP_BAD} size={320} />
            </div>
            <ul className="mt-6 space-y-2 text-sm text-[var(--fg-muted)]">
              <li><span className="text-[var(--fg-primary)]">P</span> — lo que mueve el motor.</li>
              <li><span className="text-[var(--accent-warn)]">Q</span> — energía que va y vuelve sin trabajar.</li>
              <li><span className="text-[var(--accent-electric)]">S</span> — lo que sale de tu medidor.</li>
            </ul>
          </Reveal>
        </div>
      </SectionInner>
    </Section>
  );
}
