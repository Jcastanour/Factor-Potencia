import Link from "next/link";

import { Nav } from "@presentation/components/Nav";

export const metadata = {
  title: "Gracias · FactorPro",
};

export default function GraciasPage() {
  return (
    <main>
      <Nav />
      <section style={{ paddingTop: 140, paddingBottom: 120 }}>
        <div
          className="container"
          style={{ maxWidth: 640, textAlign: "center" }}
        >
          <div className="eyebrow cyan">Solicitud recibida</div>
          <h2 style={{ marginTop: 24 }}>
            Gracias. Te escribiremos cuando el prototipo esté listo.
          </h2>
          <p className="sec-sub" style={{ margin: "24px auto 0" }}>
            Tu solicitud quedó registrada. El equipo del PFC UNAL revisará el caso y se pondrá en
            contacto vía email cuando tengamos hardware funcional.
          </p>
          <div style={{ marginTop: 40 }}>
            <Link href="/" className="btn ghost">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
