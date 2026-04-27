const STATS = [
  { label: "Penalización mínima", val: "25.000", unit: "COP / mes", accent: "amber" },
  { label: "Penalización máxima", val: "1.500.000", unit: "COP / mes", accent: "red" },
  { label: "Factor multiplicador M", val: "1 – 12", unit: "escala regulatoria", accent: "" },
  { label: "FP mínimo legal", val: "0.90", unit: "CREG 101-035 / 2024", accent: "cyan" },
];

export function Problem() {
  return (
    <section id="problema" data-screen-label="02 Problema">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">02 / 10</span>
          <span className="kicker">· El problema</span>
        </div>
        <div className="reveal">
          <h2>
            Lo que no se ve, <em style={{ fontStyle: "normal", color: "var(--cyan)" }}>se paga.</em>
          </h2>
          <p className="sec-sub">
            El factor de potencia mide qué tan eficientemente un comercio convierte la corriente de
            la red en trabajo real. Por debajo de 0.90, la normativa colombiana cobra un recargo
            mensual proporcional al déficit.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
            marginTop: 56,
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={"stat-big reveal " + (s.accent ? "accent-" + s.accent : "")}
              data-reveal-delay={i * 80}
            >
              <div className="label">{s.label}</div>
              <div className="val">{s.val}</div>
              <div className="unit">{s.unit}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
