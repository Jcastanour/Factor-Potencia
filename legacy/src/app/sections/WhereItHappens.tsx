import { wherePerfiles } from "@/content/copy";
import { Section, SectionInner, SectionHeading, Monolabel } from "@/components/ui/primitives";
import { Reveal } from "@/components/Reveal";

export function WhereItHappens() {
  return (
    <Section id="donde" tone="elevated">
      <SectionInner>
        <Reveal>
          <SectionHeading
            eyebrow="Dónde aparece"
            headline="No es un comercio genérico. Es el tuyo."
            body="Perfiles reales del mercado direccionable en Medellín. El factor de potencia típico — sin compensar — cae en estos rangos."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wherePerfiles.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--bg-base)] p-6 transition-colors hover:border-[var(--accent-electric)]/40">
                <header>
                  <Monolabel>{p.equipos}</Monolabel>
                  <h3 className="mt-4 text-2xl font-semibold text-[var(--fg-primary)]">
                    {p.titulo}
                  </h3>
                </header>
                <div className="mt-6">
                  <div className="eyebrow text-[var(--accent-warn)]">Factor de Potencia</div>
                  <div className="mt-2 font-mono text-4xl font-semibold tabular-nums text-[var(--accent-warn)]">
                    {p.fp}
                  </div>
                </div>
                <p className="mt-6 text-sm italic leading-relaxed text-[var(--fg-muted)]">
                  {p.dolor}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionInner>
    </Section>
  );
}
