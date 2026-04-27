import { Nav } from "@presentation/components/Nav";
import { CotizarForm } from "@presentation/cotizar/CotizarForm";
import { Badge } from "@presentation/primitives/Badge";

export const metadata = {
  title: "Cotizar · FactorPro",
  description:
    "Cuéntanos sobre tu comercio. Estimamos cuánto puedes ahorrar al corregir tu factor de potencia.",
};

export default function CotizarPage() {
  return (
    <main>
      <Nav />
      <section style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="sec-head reveal">
            <span className="num-tag">COTIZAR</span>
            <span className="kicker">· Solicitud preliminar</span>
            <Badge variant="concept" label="Lista de espera" />
          </div>
          <h2 className="reveal">
            Cuéntanos sobre tu comercio.
          </h2>
          <p className="sec-sub reveal">
            Aún no vendemos al público. Si dejas tus datos, te avisamos cuando el primer prototipo
            funcional esté listo y te enviamos una estimación específica para tu caso.
          </p>
          <CotizarForm />
        </div>
      </section>
    </main>
  );
}
