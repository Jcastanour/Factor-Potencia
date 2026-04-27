import { Badge } from "@presentation/primitives/Badge";

const CARDS = [
  { label: "Costo materiales", val: "193.000", unit: "COP · BOM estimado", accent: "cyan" },
  { label: "Precio sugerido", val: "350–450", unit: "mil COP · venta al comercio", accent: "" },
  { label: "ROI", val: "2 – 7", unit: "meses según consumo", accent: "green" },
  { label: "Mercado direccionable", val: "47 – 71", unit: "mil comercios · Medellín", accent: "" },
  { label: "Competencia directa", val: "<500k", unit: "COP · sin producto equivalente", accent: "amber" },
];

export function Value() {
  return (
    <section id="valor" data-screen-label="08 Valor">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">08 / 10</span>
          <span className="kicker">· Por qué importa</span>
          <Badge variant="projection" label="Proyección de mercado" />
        </div>
        <div className="reveal">
          <h2>
            Cinco números.
            <br />
            Una hipótesis defendible.
          </h2>
          <p className="sec-sub">
            Los costos provienen de una BOM estimada a precios Amazon/Mercado Libre. El mercado
            direccionable sale del registro cruzado DANE × EPM 2024.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 14,
            marginTop: 56,
          }}
        >
          {CARDS.map((c, i) => (
            <div
              key={c.label}
              className={"stat-big reveal " + (c.accent ? "accent-" + c.accent : "")}
              data-reveal-delay={i * 80}
            >
              <div className="label">{c.label}</div>
              <div className="val">{c.val}</div>
              <div className="unit">{c.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
