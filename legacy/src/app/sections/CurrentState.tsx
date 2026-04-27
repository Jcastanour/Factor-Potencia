import { state } from "@/content/copy";
import { Section, SectionInner, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function CurrentState() {
  return (
    <Section id="estado">
      <SectionInner className="py-24 lg:py-28">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow={state.eyebrow}
              headline={state.headline}
              body={state.body}
              align="center"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-warn)]/40 bg-[var(--accent-warn)]/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent-warn)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-warn)] pulse-dot" />
            Prototipo · no producto comercial
          </span>
        </Reveal>
      </SectionInner>
    </Section>
  );
}
