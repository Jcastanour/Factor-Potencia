"use client";

import { Badge } from "@presentation/primitives/Badge";

import { GROUPS, type DeviceComponent } from "./components-data";

interface Props {
  readonly component: DeviceComponent | null;
  readonly onClose: () => void;
}

export function HotspotPanel({ component, onClose }: Props) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 24,
        border: "1px solid var(--line)",
        borderRadius: 6,
        background: "linear-gradient(180deg, rgba(34,211,238,0.025), rgba(0,0,0,0)) , var(--bg-elev)",
        minHeight: 140,
        display: "grid",
        gridTemplateColumns: component ? "1fr auto" : "1fr",
        gap: 24,
        alignItems: "start",
        transition: "border-color .2s ease",
      }}
    >
      {component ? (
        <>
          <div>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--cyan)",
                }}
              >
                {GROUPS[component.group].label}
              </span>
              <Badge variant={component.status} />
            </div>
            <h4
              style={{
                margin: 0,
                fontFamily: "var(--mono)",
                fontSize: 18,
                letterSpacing: "0.02em",
                color: "var(--fg)",
                fontWeight: 500,
              }}
            >
              {component.label}
            </h4>
            <p
              style={{
                marginTop: 10,
                color: "var(--fg-dim)",
                fontSize: 14,
                lineHeight: 1.55,
                maxWidth: 640,
              }}
            >
              {component.role}
            </p>
            <div
              className="mono"
              style={{
                marginTop: 14,
                fontSize: 11.5,
                letterSpacing: "0.12em",
                color: "var(--fg-faint)",
                textTransform: "uppercase",
              }}
            >
              SPEC · <span style={{ color: "var(--fg)" }}>{component.spec}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-faint)",
              background: "transparent",
              border: "1px solid var(--line)",
              padding: "8px 12px",
              borderRadius: 3,
              cursor: "pointer",
              alignSelf: "start",
            }}
          >
            Cerrar
          </button>
        </>
      ) : (
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--fg-faint)",
          }}
        >
          Activa <span style={{ color: "var(--cyan)" }}>Explorar componentes</span> y toca un hotspot
          en la vista interna para ver el detalle de cada pieza.
        </div>
      )}
    </div>
  );
}
