import { team } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function Team() {
  return (
    <Section id="equipo" tone="elevated">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow={team.eyebrow}
            headline={team.headline}
            body={team.context}
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
          <Reveal className="space-y-4 rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] p-6">
            <div>
              <Monolabel>Curso</Monolabel>
              <p className="mt-1 text-sm text-[var(--fg-primary)]">
                Proyecto Integrado de Ingeniería
              </p>
            </div>
            <div>
              <Monolabel>{team.advisor.split(" · ")[0]}</Monolabel>
              <p className="mt-1 text-sm text-[var(--fg-primary)]">
                {team.advisor.split(" · ")[1] ?? team.advisor}
              </p>
            </div>
            <div>
              <Monolabel>{team.deadline.split(" · ")[0]}</Monolabel>
              <p className="mt-1 text-sm text-[var(--fg-primary)]">
                {team.deadline.split(" · ")[1] ?? team.deadline}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] p-6">
            <Monolabel>Integrantes</Monolabel>
            <ul className="mt-6 grid grid-cols-1 gap-y-3 sm:grid-cols-2">
              {team.integrantes.map((name, i) => (
                <li
                  key={name}
                  className="flex items-baseline gap-3 border-b border-[var(--hairline)] pb-2"
                >
                  <span className="font-mono text-[10px] text-[var(--fg-dim)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[var(--fg-primary)]">{name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={300} className="mt-16 border-t border-[var(--hairline)] pt-10">
          <div className="flex flex-col items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-dim)] md:flex-row">
            <span>© 2026 · UNAL Facultad de Minas</span>
            <span>Boceto v0.1 · Abril 2026</span>
          </div>
        </Reveal>
      </SectionInner>
    </Section>
  );
}
