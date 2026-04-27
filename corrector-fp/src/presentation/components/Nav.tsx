"use client";
import { useEffect, useState } from "react";
import { useActiveSection } from "@shared/hooks/useReveal";

const LINKS: [string, string][] = [
  ["problema", "Problema"],
  ["donde", "Dónde"],
  ["electrico", "Eléctrico"],
  ["dispositivo", "Dispositivo"],
  ["demo", "Demo"],
  ["valor", "Valor"],
  ["equipo", "Equipo"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection([
    "hero",
    "problema",
    "donde",
    "electrico",
    "dispositivo",
    "demo",
    "valor",
    "equipo",
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={"nav " + (scrolled ? "scrolled" : "")}>
      <div className="container nav-inner">
        <a href="#hero" className="brand" style={{ textDecoration: "none", color: "var(--fg)" }}>
          <span className="brand-mark" />
          <span>PFC · UNAL</span>
        </a>
        <div className="nav-links">
          {LINKS.map(([id, label]) => (
            <a key={id} href={"#" + id} className={active === id ? "active" : ""}>
              {label}
            </a>
          ))}
        </div>
        <span className="version">v0.1 · Boceto</span>
      </div>
    </nav>
  );
}
