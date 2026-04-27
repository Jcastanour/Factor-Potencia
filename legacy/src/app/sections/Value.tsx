import { value } from "@/content/copy";
import { Section, SectionInner, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function Value() {
  return (
    <Section id="valor" tone="elevated">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={value.eyebrow}
            headline={value.headline}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {value.bullets.map((b, i) => (
            <Reveal key={b.k} delay={i * 80}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] p-6">
                <div
                  className="font-mono text-3xl font-semibold tabular-nums text-[var(--accent-electric)] sm:text-4xl"
                >
                  {b.k}
                </div>
                <div className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {b.v}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-electric)]/50 to-transparent" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-12">
          <div className="rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] p-8">
            <p className="max-w-3xl text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
              Las soluciones industriales — <span className="text-[var(--fg-primary)]">Schneider VarPlus Can</span>, <span className="text-[var(--fg-primary)]">ABB CLMD</span>, <span className="text-[var(--fg-primary)]">EPCOS PhiCap</span>, <span className="text-[var(--fg-primary)]">Siemens PhaseCap</span>, <span className="text-[var(--fg-primary)]">WEG UCW</span> — cuestan entre 2 y 15 millones y están diseñadas para planta industrial. En la franja de precios accesibles para MiPymes, nadie construye.
            </p>
          </div>
        </Reveal>
      </SectionInner>
    </Section>
  );
}
