"use client";

import { Badge } from "@presentation/primitives/Badge";
import type { Reading } from "@domain/telemetry";

import { useTelemetryStream } from "./useTelemetryStream";

interface Props {
  readonly initialReading: Reading | null;
  readonly deviceId: string;
  readonly source: "simulated" | "in-memory" | "hybrid" | "postgres";
}

const fmt = (n: number, digits = 2) =>
  Number.isFinite(n) ? n.toFixed(digits) : "—";

const fmtInt = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("es-CO") : "—";

function fpQuality(fp: number): "bad" | "warn" | "signal" | "ok" {
  if (fp < 0.8) return "bad";
  if (fp < 0.9) return "warn";
  if (fp < 0.95) return "signal";
  return "ok";
}

const FP_COLOR: Record<ReturnType<typeof fpQuality>, string> = {
  bad: "var(--red)",
  warn: "var(--amber)",
  signal: "var(--blue)",
  ok: "var(--green)",
};

export function DashboardClient({ initialReading, deviceId, source }: Props) {
  const { reading, connected } = useTelemetryStream(initialReading, deviceId);

  const isDemo = source !== "postgres";
  const variant =
    source === "postgres"
      ? "prototype"
      : source === "in-memory"
        ? "prototype"
        : source === "hybrid"
          ? "projection"
          : "concept";
  const sourceLabel = {
    simulated: "Simulación",
    "in-memory": "Hardware in-memory",
    hybrid: "Híbrido (live → simulado)",
    postgres: "Hardware (Postgres)",
  }[source];

  return (
    <div className="container" style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="sec-head reveal" style={{ marginBottom: 28 }}>
        <span className="num-tag">DASHBOARD</span>
        <span className="kicker">· Telemetría en vivo</span>
        <Badge variant={variant} label={sourceLabel} />
        <span
          className={`chip ${connected ? "live" : ""}`}
          style={{ marginLeft: "auto" }}
        >
          <span className="dot" />
          {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      {isDemo && (
        <div
          className="reveal"
          style={{
            border: "1px dashed var(--line-strong)",
            background: "rgba(245,158,11,0.04)",
            color: "var(--fg-dim)",
            padding: "14px 18px",
            borderRadius: 4,
            fontSize: 13,
            marginBottom: 32,
            fontFamily: "var(--mono)",
            letterSpacing: "0.04em",
          }}
        >
          Modo demo activo · fuente <strong style={{ color: "var(--fg)" }}>{sourceLabel}</strong>.
          Cuando un dispositivo real ingiera por <code>/api/telemetry/ingest</code>,
          este panel reflejará sus lecturas en menos de 2 segundos.
        </div>
      )}

      {/* Bloque 1 — FP en vivo */}
      <div className="demo-grid">
        <div className="demo-panel reveal">
          <h4>Bloque 1 · Factor de potencia en vivo</h4>
          <div
            className="num"
            style={{
              fontSize: "clamp(56px, 9vw, 120px)",
              color: reading ? FP_COLOR[fpQuality(reading.pf)] : "var(--fg-faint)",
              marginTop: 24,
              letterSpacing: "-0.03em",
            }}
          >
            {reading ? reading.pf.toFixed(3) : "—"}
          </div>
          <div className="eyebrow" style={{ marginTop: 8 }}>
            Objetivo CREG ≥ 0.90 · meta interna 0.95
          </div>
        </div>

        {/* Bloque 2 — Triángulo de potencias resumido */}
        <div className="demo-panel reveal">
          <h4>Bloque 2 · Potencias instantáneas</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
              marginTop: 16,
            }}
          >
            <Readout label="P · activa" value={reading ? `${fmtInt(reading.pW)} W` : "—"} />
            <Readout label="Q · reactiva" value={reading ? `${fmtInt(reading.qVar)} VAR` : "—"} />
            <Readout label="S · aparente" value={reading ? `${fmtInt(reading.sVa)} VA` : "—"} />
          </div>
        </div>
      </div>

      {/* Bloques 3, 4, 5 */}
      <div
        className="demo-grid"
        style={{ marginTop: 28, gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        <div className="demo-panel reveal">
          <h4>Bloque 3 · Tensión y corriente</h4>
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            <Readout label="V rms" value={reading ? `${fmt(reading.vRms, 1)} V` : "—"} />
            <Readout label="I rms" value={reading ? `${fmt(reading.iRms, 2)} A` : "—"} />
          </div>
        </div>

        <div className="demo-panel reveal">
          <h4>Bloque 4 · Banco activo</h4>
          <div
            className="num"
            style={{
              fontSize: 64,
              marginTop: 16,
              color: "var(--cyan)",
              letterSpacing: "-0.02em",
            }}
          >
            {reading ? reading.activeStage : "—"}
            <span
              style={{ fontSize: 18, color: "var(--fg-faint)", marginLeft: 8 }}
            >
              / 7
            </span>
          </div>
          <div className="eyebrow" style={{ marginTop: 8 }}>
            Máscara binaria 1 : 2 : 4
          </div>
        </div>

        <div className="demo-panel reveal">
          <h4>Bloque 5 · Última muestra</h4>
          <div
            className="num"
            style={{
              fontSize: 14,
              marginTop: 16,
              color: "var(--fg-dim)",
              wordBreak: "break-all",
            }}
          >
            {reading?.ts ?? "—"}
          </div>
          <div className="eyebrow" style={{ marginTop: 12 }}>
            ID: {reading?.id ?? "—"}
          </div>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            device: {deviceId}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 56,
          padding: 18,
          border: "1px solid var(--line)",
          borderRadius: 4,
          background: "rgba(14,17,22,0.5)",
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--fg-dim)",
          letterSpacing: "0.05em",
        }}
      >
        <div style={{ color: "var(--fg-faint)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 8 }}>
          Simular firmware desde tu terminal
        </div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--fg)" }}>
{`NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
curl -X POST http://localhost:3000/api/telemetry/ingest \\
  -H "x-device-key: $DEMO_DEVICE_API_KEY" \\
  -H "content-type: application/json" \\
  -d "{\\"ts\\":\\"$NOW\\",\\"pf\\":0.95,\\"p_w\\":1500,\\"q_var\\":300,\\"s_va\\":1530,\\"v_rms\\":120,\\"i_rms\\":12.75,\\"active_stage\\":3}"`}
        </pre>
      </div>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="readout">
      <div className="label">{label}</div>
      <div className="val">{value}</div>
    </div>
  );
}
