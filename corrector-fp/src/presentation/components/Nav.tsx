"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveSection } from "@shared/hooks/useReveal";
import { useTheme } from "@shared/hooks/useTheme";

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
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(
    isLanding
      ? ["hero", "problema", "donde", "electrico", "dispositivo", "demo", "valor", "equipo"]
      : [],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={"nav " + (scrolled || !isLanding ? "scrolled" : "")}>
      <div className="container nav-inner">
        <Link
          href="/"
          className="brand"
          style={{ textDecoration: "none", color: "var(--fg)" }}
        >
          <span className="brand-mark" />
          <span>FactorPro</span>
        </Link>
        <div className="nav-links">
          {isLanding &&
            LINKS.map(([id, label]) => (
              <a key={id} href={"#" + id} className={active === id ? "active" : ""}>
                {label}
              </a>
            ))}
          <Link
            href="/dashboard"
            className={pathname?.startsWith("/dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            href="/cotizar"
            className={pathname?.startsWith("/cotizar") ? "active" : ""}
          >
            Cotizar
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle />
          <span className="version">v0.1 · Boceto</span>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--fg-dim)",
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderRadius: 999,
        cursor: "pointer",
        fontWeight: 500,
        transition: "all .15s ease",
      }}
    >
      <span aria-hidden style={{ fontSize: 13 }}>{theme === "dark" ? "☾" : "☀"}</span>
      <span>{theme === "dark" ? "Oscuro" : "Claro"}</span>
    </button>
  );
}
