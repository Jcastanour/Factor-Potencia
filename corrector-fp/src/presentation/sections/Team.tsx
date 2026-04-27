const TEAM = [
  "Maria Fernanda Rodríguez Morales",
  "Maria Camila Chica Quintero",
  "Juan Pablo Castaño Uribe",
  "Cristian David Montoya Gómez",
  "Argenis David Marín Adames",
  "Cristobal Henao Rueda",
  "José Simón Higuita Lopera",
  "Luis David Mendoza Orozco",
];

export function Team() {
  return (
    <section id="equipo" data-screen-label="10 Equipo" style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">10 / 10</span>
          <span className="kicker">· Equipo · Cierre</span>
        </div>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 14,
            }}
          >
            <div className="team-card">
              <div className="role">Institución</div>
              <div className="name">UNAL · Facultad de Minas</div>
            </div>
            <div className="team-card">
              <div className="role">Curso</div>
              <div className="name">Proyecto Integrado de Ingeniería</div>
            </div>
            <div className="team-card">
              <div className="role">Entrega</div>
              <div className="name mono" style={{ fontFamily: "var(--mono)" }}>
                23 / 03 / 2026
              </div>
            </div>
            <div className="team-card">
              <div className="role">Director</div>
              <div className="name">Diego Alexander Herrera Uribe</div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              EQUIPO · 8 ESTUDIANTES
            </div>
            <div className="team-grid">
              {TEAM.map((n, i) => (
                <div key={n} className="team-card reveal" data-reveal-delay={i * 60}>
                  <div className="role">0{i + 1}</div>
                  <div className="name">{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 96 }}>
        <div className="footer">
          <span>© 2026 · Proyecto Integrado de Ingeniería</span>
          <span>PFC · v0.1 · Boceto · Medellín</span>
        </div>
      </div>
    </section>
  );
}
