export function CurrentState() {
  return (
    <section id="estado" data-screen-label="09 Estado" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">09 / 10</span>
          <span className="kicker">· Estado actual</span>
        </div>
        <div className="reveal" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontWeight: 300 }}>
            Esto es un boceto.
            <br />
            <span style={{ color: "var(--fg-faint)" }}>El prototipo aún se está construyendo.</span>
          </h2>
          <p className="sec-sub" style={{ margin: "24px auto 0" }}>
            La página que estás viendo precede al primer prototipo funcional. Los comportamientos
            simulados reflejan el firmware diseñado pero no validado en hardware. Entrega: 23 de
            marzo de 2026.
          </p>
        </div>
        <div className="hairline-gradient" />
      </div>
    </section>
  );
}
