import { problem } from "@/content/copy";
import { Section, SectionInner, SectionHeading, StatCard } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function Problem() {
  return (
    <Section id="problema">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={problem.eyebrow}
            headline={problem.headline}
            body={problem.body}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problem.stats.map((s, i) => (
            <Reveal key={s.k} delay={i * 80}>
              <StatCard
                label={s.k}
                value={s.v}
                accent={i === 1 ? "warn" : i === 3 ? "ok" : "electric"}
              />
            </Reveal>
          ))}
        </div>
      </SectionInner>
    </Section>
  );
}
