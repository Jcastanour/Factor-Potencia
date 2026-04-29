const MODES = [
  {
    k: "INIT",
    step: "M1",
    title: "Inicialización",
    body:
      "Self-test de sensores, verificación de comunicación I²C con el OLED y carga de constantes de calibración desde EEPROM.",
    dur: "≈ 0.4 s",
  },
  {
    k: "AUTOCAL",
    step: "M2",
    title: "Auto-calibración",
    body:
      "Mide tensión y corriente sin carga conocida para ajustar offsets del ADC. Determina el sentido de la pinza de corriente.",
    dur: "≈ 5 s",
  },
  {
    k: "DIAG",
    step: "M3",
    title: "Diagnóstico 24 h",
    body:
      "Registra FP, P, Q y eventos cada segundo durante un día completo para perfilar el ciclo operativo del comercio antes de compensar.",
    dur: "24 h",
  },
  {
    k: "ACTIVE",
    step: "M4",
    title: "Control activo",
    body:
      "Histéresis 0.88 / 0.97 · objetivo 0.95 · retardo 30 s. Engancha y desengancha capacitores en pasos binarios sin oscilar.",
    dur: "CONTINUO",
  },
];

export function HowItWorks() {
  return (
    <section id="como" data-screen-label="07 Como Funciona">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">07 / 10</span>
          <span className="kicker">· Cómo funciona</span>
        </div>
        <div className="reveal">
          <h2>
            Cuatro modos.
            <br />
            Una máquina de estados.
          </h2>
          <p className="sec-sub">
            El firmware avanza linealmente entre modos y solo retrocede si detecta condiciones
            anómalas (sobre-tensión, saturación de corriente, falla de SSR).
          </p>
        </div>
        <div className="modes reveal" style={{ marginTop: 56 }}>
          {MODES.map((m, i) => (
            <div key={m.k} className="mode reveal" data-reveal-delay={i * 100}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="step">{m.step}</span>
                {i < MODES.length - 1 && (
                  <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 14 }}>
                    →
                  </span>
                )}
                {i === MODES.length - 1 && (
                  <span className="chip live" style={{ height: 22, padding: "0 8px", fontSize: 9 }}>
                    <span className="dot" />
                    LOOP
                  </span>
                )}
              </div>
              <span className="k">{m.k}</span>
              <h4>{m.title}</h4>
              <p>{m.body}</p>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                <span
                  className="mono"
                  style={{ fontSize: 9.5, color: "var(--fg-faint)", letterSpacing: "0.2em" }}
                >
                  {m.dur}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
