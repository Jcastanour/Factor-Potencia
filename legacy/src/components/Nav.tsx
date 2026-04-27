"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  { href: "#problema", label: "Problema" },
  { href: "#donde", label: "Dónde" },
  { href: "#electrico", label: "Eléctrico" },
  { href: "#dispositivo", label: "Dispositivo" },
  { href: "#demo", label: "Demo" },
  { href: "#valor", label: "Valor" },
  { href: "#equipo", label: "Equipo" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-[var(--hairline)] bg-[var(--bg-base)]/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-6 sm:px-10">
        <a href="#top" className="flex items-center gap-2">
          <span className="relative inline-flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-sm border border-[var(--accent-electric)]/50" />
            <span className="absolute inset-1 rounded-[2px] bg-[var(--accent-electric)]/20" />
            <span className="absolute inset-2 rounded-[1px] bg-[var(--accent-electric)] pulse-dot" />
          </span>
          <span className="font-mono text-xs tracking-[0.22em] text-[var(--fg-primary)] uppercase">
            PFC · UNAL
          </span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg-primary)]"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-dim)] lg:inline">
          v0.1 · Boceto
        </span>
      </div>
    </nav>
  );
}
