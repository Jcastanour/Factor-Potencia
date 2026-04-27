import { howItWorks } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function HowItWorks() {
  return (
    <Section id="funcionamiento">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={howItWorks.eyebrow}
            headline={howItWorks.headline}
          />
        </Reveal>

        <ol className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.modes.map((m, i) => (
            <Reveal key={m.key} delay={i * 90}>
              <li className="relative h-full overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6">
                <div className="flex items-center justify-between">
                  <Monolabel>{`Modo ${String(i + 1).padStart(2, "0")}`}</Monolabel>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--accent-electric)]">
                    {m.key}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--fg-primary)]">
                  {m.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {m.body}
                </p>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-electric)]/50 to-transparent" />
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200} className="mt-10 overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/60 p-6 font-mono text-[13px] leading-7 text-[var(--fg-muted)]">
          <div className="text-[var(--accent-electric)]">// lazo de control activo</div>
          <div>if (FP &lt; 0.88) conecta_escalon();</div>
          <div>if (FP &gt; 0.97) desconecta_escalon();</div>
          <div>retardo_min = 30 s · objetivo = 0.95</div>
        </Reveal>
      </SectionInner>
    </Section>
  );
}
