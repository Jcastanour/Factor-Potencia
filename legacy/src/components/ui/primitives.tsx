import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  tone?: "default" | "elevated";
};

export function Section({
  className,
  children,
  tone = "default",
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={cn(
        "relative w-full overflow-hidden",
        tone === "elevated" && "bg-[var(--bg-elevated)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionInner({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[1280px] px-6 py-28 sm:px-10 lg:py-40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-electric)] pulse-dot" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  headline,
  body,
  align = "left",
  className,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--fg-primary)] sm:text-5xl lg:text-6xl">
        {headline}
      </h2>
      {body && (
        <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)] sm:text-xl">
          {body}
        </p>
      )}
    </header>
  );
}

export function TechGrid({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "fine";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "fine" ? "tech-grid-fine" : "tech-grid",
        "[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]",
        className,
      )}
    />
  );
}

export function StatCard({
  label,
  value,
  accent,
  className,
}: {
  label: string;
  value: string;
  accent?: "electric" | "warn" | "ok" | "signal";
  className?: string;
}) {
  const accentVar =
    accent === "warn"
      ? "var(--accent-warn)"
      : accent === "ok"
        ? "var(--accent-ok)"
        : accent === "signal"
          ? "var(--accent-signal)"
          : "var(--accent-electric)";

  return (
    <div
      className={cn(
        "relative rounded-md border border-[var(--hairline)] bg-[var(--bg-elevated)]/70 p-6 backdrop-blur-sm",
        className,
      )}
    >
      <div className="eyebrow">{label}</div>
      <div
        className="mt-3 font-mono text-3xl font-medium tabular-nums sm:text-4xl"
        style={{ color: accentVar }}
      >
        {value}
      </div>
    </div>
  );
}

export function HairlineDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-[var(--hairline-strong)] to-transparent",
        className,
      )}
    />
  );
}

export function Monolabel({
  children,
  className,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
