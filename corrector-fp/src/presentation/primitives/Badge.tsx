import { cn } from "@shared/utils/cn";

export type BadgeVariant =
  | "prototype"
  | "projection"
  | "concept"
  | "estimation"
  | "regulation";

interface Props {
  readonly variant: BadgeVariant;
  readonly className?: string;
  /** Label override; default es la etiqueta canónica de la variante. */
  readonly label?: string;
}

const META: Record<BadgeVariant, { label: string; color: string; dot: string }> = {
  prototype: {
    label: "Prototipo construido",
    color: "var(--green)",
    dot: "var(--green)",
  },
  projection: {
    label: "Proyección",
    color: "var(--cyan)",
    dot: "var(--cyan)",
  },
  concept: {
    label: "Concepto",
    color: "var(--blue)",
    dot: "var(--blue)",
  },
  estimation: {
    label: "Estimación",
    color: "var(--amber)",
    dot: "var(--amber)",
  },
  regulation: {
    label: "Regulación CREG",
    color: "var(--fg-dim)",
    dot: "var(--fg-faint)",
  },
};

export function Badge({ variant, label, className }: Props) {
  const meta = META[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[3px] border px-2 py-[3px] font-mono text-[9.5px] uppercase",
        className,
      )}
      style={{
        color: meta.color,
        borderColor: "var(--line)",
        background: "rgba(14,17,22,0.55)",
        letterSpacing: "0.18em",
      }}
      title={label ?? meta.label}
    >
      <span
        aria-hidden
        className="inline-block h-[5px] w-[5px] rounded-full"
        style={{ background: meta.dot }}
      />
      {label ?? meta.label}
    </span>
  );
}
