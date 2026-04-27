const PROFILES = [
  {
    title: "Panadería",
    fp: "FP 0.65 – 0.80",
    equip: "AMASADORAS · HORNOS · REFRIGERACIÓN",
    quote:
      "\"La amasadora arranca a las 4 a.m. y el recibo llega con un recargo que no entiendo. Nadie me explica qué es eso de potencia reactiva.\"",
  },
  {
    title: "Taller mecánico",
    fp: "FP 0.60 – 0.75",
    equip: "COMPRESORES · TORNOS · SOLDADORAS",
    quote:
      "\"Cuando prendo el torno el medidor se vuelve loco. El operador dice que pagué multa pero el taller solo lleva dos años.\"",
  },
  {
    title: "Carpintería",
    fp: "FP 0.65 – 0.80",
    equip: "SIERRAS · CEPILLADORAS · ASPIRADORES",
    quote:
      "\"Me recomendaron poner un condensador grande. Terminé pagando igual porque a veces sobra compensación y también penaliza.\"",
  },
  {
    title: "Lavandería",
    fp: "FP 0.65 – 0.78",
    equip: "LAVADORAS · SECADORAS · BOMBAS",
    quote:
      "\"La factura subió 140k de un mes a otro sin cambiar nada. Tengo que revisar esto pero no sé por dónde empezar.\"",
  },
];

export function WhereItHappens() {
  return (
    <section id="donde" data-screen-label="03 Donde Aparece">
      <div className="container">
        <div className="sec-head reveal">
          <span className="num-tag">03 / 10</span>
          <span className="kicker">· Dónde aparece</span>
        </div>
        <div className="reveal">
          <h2>
            Cuatro comercios típicos
            <br />
            de Medellín en la mira.
          </h2>
          <p className="sec-sub">
            Motores de inducción, compresores y resistencias inductivas son los principales
            responsables. Ninguno de estos comercios tiene ingeniería eléctrica en casa.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 16,
            marginTop: 56,
          }}
        >
          {PROFILES.map((p, i) => (
            <div key={p.title} className="profile reveal" data-reveal-delay={i * 90}>
              <div className="title">
                <h3>{p.title}</h3>
                <div className="fp">{p.fp}</div>
              </div>
              <div className="equip">{p.equip}</div>
              <div className="quote">{p.quote}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
