/**
 * Texto de la landing en un único lugar. Español (PROJECT_CONTEXT §9).
 */

export const copy = {
  site: {
    title: "Corrector Automático de Factor de Potencia",
    subtitle:
      "Un boceto técnico-visual del proyecto para pequeños comercios de Medellín.",
    description:
      "Proyecto Integrado de Ingeniería · Facultad de Minas · Universidad Nacional de Colombia. Corrector de FP plug-and-play basado en ESP32.",
  },

  hero: {
    eyebrow: "Prototipo en construcción · UNAL Facultad de Minas",
    headline: "Cada mes pagas por electricidad\nque no usaste.",
    sub: "Los motores, compresores y neveras de tu negocio mueven corriente que no hace trabajo. La red te cobra por ella. La ley te penaliza si no la corriges. Este proyecto la devuelve al sistema — solo.",
    cta: "Ver cómo funciona",
    meta: [
      { label: "FP mínimo · CREG 101-035 / 2024", value: "0.90" },
      { label: "Penalización mensual", value: "25k – 1.5M COP" },
      { label: "ROI estimado", value: "2 – 7 meses" },
    ],
  },

  problem: {
    eyebrow: "El problema",
    headline: "Lo que no se ve, se paga.",
    body: "En las panaderías, talleres y lavanderías de Medellín los motores y compresores crean un tipo de consumo invisible — energía reactiva — que inflama la factura cada mes. El dueño del negocio rara vez sabe por qué.",
    stats: [
      { k: "Penalización mínima mensual", v: "25.000 COP" },
      { k: "Penalización máxima mensual", v: "1.500.000 COP" },
      { k: "Factor multiplicador M", v: "Escala 1 – 12" },
      { k: "FP mínimo legal", v: "0.90" },
    ],
  },

  where: {
    eyebrow: "Dónde aparece",
    headline: "Comercios donde la corriente se desalinea.",
    body: "Cargas inductivas típicas de MiPymes: FP habitual 0.60 – 0.85. Sin compensar, cada kilovatio reactivo se traduce en tarifa.",
    perfiles: [
      {
        id: "panaderia",
        titulo: "Panadería",
        fp: "0.65 – 0.80",
        equipos: "Amasadoras · hornos · neveras de exhibición",
        dolor:
          "«La factura sube cada mes. Nos cobran un ítem aparte que llaman reactiva y nadie nos explica».",
      },
      {
        id: "taller",
        titulo: "Taller mecánico",
        fp: "0.60 – 0.75",
        equipos: "Compresores · tornos · soldadoras",
        dolor: "«El compresor prende y baja la luz. La factura del mes es una lotería».",
      },
      {
        id: "carpinteria",
        titulo: "Carpintería",
        fp: "0.65 – 0.80",
        equipos: "Sierras · cepilladoras · aspiradores",
        dolor:
          "«Tengo que apagar una máquina antes de prender la otra o se dispara el breaker».",
      },
      {
        id: "lavanderia",
        titulo: "Lavandería",
        fp: "0.65 – 0.78",
        equipos: "Lavadoras · secadoras · centrifugadoras",
        dolor: "«Trabajo por kilos. Si me suben la luz 200 mil al mes, quedo en rojo».",
      },
    ],
  },

  electrical: {
    eyebrow: "Qué pasa eléctricamente",
    headline: "Trabajo, onda y pérdida.",
    body: "La corriente que entra al negocio tiene dos componentes. Una hace trabajo — mueve el motor, enfría la nevera, calienta el horno. La otra solo sostiene el campo magnético de esos equipos y regresa sin producir nada. Se llama energía reactiva. Tú la pagas igual.",
  },

  device: {
    eyebrow: "La propuesta",
    headline: "Un dispositivo que detecta y compensa — solo.",
    body: "Se instala entre tu medidor y tu tablero. Mide voltaje y corriente en tiempo real, calcula cuánta reactiva estás moviendo, y conecta condensadores para compensarla. Todo sin intervención.",
    specs: [
      { k: "Microcontrolador", v: "ESP32 · doble núcleo · WiFi" },
      { k: "Sensor de voltaje", v: "ZMPT101B (aislado)" },
      { k: "Sensor de corriente", v: "SCT-013-030 (pinza 30 A)" },
      { k: "Banco escalonado", v: "3 condensadores · 5 / 10 / 20 µF" },
      { k: "Niveles de compensación", v: "7 (1 – 7 kVAR)" },
      { k: "Conmutación", v: "SSR · cruce por cero" },
      { k: "Display", v: "OLED" },
      { k: "Instalación", v: "Plug-and-play · 20 – 30 min" },
    ],
  },

  how: {
    eyebrow: "Cómo funciona",
    headline: "Cuatro modos, un lazo cerrado.",
    modes: [
      { key: "INIT", title: "Inicialización", body: "Autoverificación de sensores, relés y memoria al arrancar." },
      { key: "AUTOCAL", title: "Autocalibración", body: "Ajuste de ganancias de ZMPT101B y SCT-013-030 contra referencia conocida." },
      { key: "DIAG", title: "Diagnóstico 24 h", body: "Perfil de carga del comercio por ventanas horarias." },
      { key: "ACTIVE", title: "Control activo", body: "Histéresis 0.88 / 0.97 · objetivo 0.95 · retardo 30 s entre conmutaciones." },
    ],
  },

  demo: {
    eyebrow: "Demo · simulación",
    headline: "Mueve los parámetros. Observa la onda alinearse.",
    body: "Modelo simplificado con los umbrales reales del firmware. El tiempo entre conmutaciones se aceleró para que lo notes.",
  },

  value: {
    eyebrow: "Por qué importa",
    headline: "Orden de magnitud más barato. Un décimo del tiempo en volver la inversión.",
    bullets: [
      { k: "193.000 COP", v: "costo de materiales del prototipo" },
      { k: "350 – 450 k", v: "precio de venta sugerido (COP)" },
      { k: "2 – 7 meses", v: "retorno de inversión" },
      { k: "47 – 71 mil", v: "comercios direccionables en Medellín" },
      { k: "< 500 k COP", v: "sin competidores directos en este rango" },
    ],
  },

  state: {
    eyebrow: "Estado actual",
    headline: "Esto es un boceto. El prototipo aún se está construyendo.",
    body: "La página presenta la visión técnica y narrativa del proyecto antes del armado físico final. Los valores, umbrales y cálculos son los del firmware real que alimentará el ESP32.",
  },

  team: {
    eyebrow: "Equipo",
    headline: "Proyecto Integrado de Ingeniería.",
    context: "Instituto de Educación en Ingeniería · Facultad de Minas · UNAL Medellín",
    deadline: "Entrega · 23 / 03 / 2026",
    advisor: "Asesor · Diego Alexander Herrera Uribe",
    integrantes: [
      "Maria Fernanda Rodríguez Morales",
      "Maria Camila Chica Quintero",
      "Juan Pablo Castaño Uribe",
      "Cristian David Montoya Gómez",
      "Argenis David Marín Adames",
      "Cristobal Henao Rueda",
      "José Simón Higuita Lopera",
      "Luis David Mendoza Orozco",
    ],
  },

  nav: {
    brand: "PFC · UNAL",
    version: "v0.1 · Boceto",
    items: [
      { href: "#problema", label: "Problema" },
      { href: "#donde", label: "Dónde" },
      { href: "#electrico", label: "Eléctrico" },
      { href: "#dispositivo", label: "Dispositivo" },
      { href: "#demo", label: "Demo" },
      { href: "#valor", label: "Valor" },
      { href: "#equipo", label: "Equipo" },
    ],
  },
} as const;
