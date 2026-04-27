/**
 * Catálogo de comercios reales (datos ilustrativos pero coherentes con MiPymes Medellín).
 * Cada escenario describe la carga base, FP típico, eventos pulsantes y copy humano.
 *
 * Estos shapes los consume el simulador y, eventualmente, también el adapter Postgres
 * cuando se quiera asociar un device real a un perfil de comercio.
 */

export type ScenarioId =
  | "panaderia"
  | "taller"
  | "lavanderia"
  | "carniceria"
  | "salon"
  | "libre";

export interface ScenarioEvent {
  /** ID legible: "compresor", "horno", "secadora-1", … */
  readonly id: string;
  /** Descripción humana del evento. */
  readonly label: string;
  /** Periodo en segundos entre activaciones. */
  readonly periodSeconds: number;
  /** Duración del pulso en segundos. */
  readonly durationSeconds: number;
  /** Delta de carga activa al pulsar (kW). */
  readonly deltaKw: number;
  /** Delta del FP base mientras el evento está activo (negativo = empeora). */
  readonly deltaFp: number;
}

export interface Scenario {
  readonly id: ScenarioId;
  readonly name: string;
  readonly business: string;
  readonly location: string;
  readonly equipment: string;
  readonly baseLoadKw: number;
  readonly baseFp: number;
  readonly currentBillCop: number;
  readonly events: readonly ScenarioEvent[];
  /** Una frase corta del dueño del comercio. */
  readonly quote: string;
}

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  panaderia: {
    id: "panaderia",
    name: "Panadería de barrio",
    business: "Panadería La Esquina",
    location: "Barrio Manrique · Medellín",
    equipment: "3 hornos eléctricos · 2 neveras · 1 amasadora",
    baseLoadKw: 4.5,
    baseFp: 0.72,
    currentBillCop: 142_000,
    events: [
      { id: "horno", label: "Horno principal arranca", periodSeconds: 18, durationSeconds: 4, deltaKw: 1.6, deltaFp: -0.05 },
      { id: "amasadora", label: "Amasadora prende", periodSeconds: 30, durationSeconds: 3, deltaKw: 0.8, deltaFp: -0.03 },
    ],
    quote: "Pago casi 150 mil pesos solo por la cosa esa que dicen del factor.",
  },
  taller: {
    id: "taller",
    name: "Taller mecánico",
    business: "Taller Hermanos Ríos",
    location: "Belén · Medellín",
    equipment: "Compresor de aire · 3 amoladoras · soldador MIG",
    baseLoadKw: 6.0,
    baseFp: 0.65,
    currentBillCop: 380_000,
    events: [
      { id: "compresor", label: "Compresor arranca (pico)", periodSeconds: 12, durationSeconds: 2, deltaKw: 2.4, deltaFp: -0.08 },
      { id: "soldador", label: "Soldador MIG en uso", periodSeconds: 25, durationSeconds: 6, deltaKw: 1.2, deltaFp: -0.04 },
    ],
    quote: "El compresor cada vez que arranca casi me tumba la luz.",
  },
  lavanderia: {
    id: "lavanderia",
    name: "Lavandería",
    business: "Lavandería Express",
    location: "Laureles · Medellín",
    equipment: "4 lavadoras industriales · 2 secadoras a gas · centrifuga",
    baseLoadKw: 5.5,
    baseFp: 0.78,
    currentBillCop: 96_000,
    events: [
      { id: "lavadora-1", label: "Centrifugado lavadora 1", periodSeconds: 22, durationSeconds: 5, deltaKw: 1.0, deltaFp: -0.03 },
      { id: "lavadora-2", label: "Centrifugado lavadora 2", periodSeconds: 27, durationSeconds: 5, deltaKw: 1.0, deltaFp: -0.03 },
    ],
    quote: "No entiendo por qué me cobran ese recargo si yo no lo pedí.",
  },
  carniceria: {
    id: "carniceria",
    name: "Carnicería",
    business: "Carnes La 30",
    location: "Robledo · Medellín",
    equipment: "2 cuartos fríos · sierra eléctrica · embutidora",
    baseLoadKw: 3.8,
    baseFp: 0.74,
    currentBillCop: 87_000,
    events: [
      { id: "compresor-frio", label: "Cuarto frío conmuta", periodSeconds: 16, durationSeconds: 8, deltaKw: 0.9, deltaFp: -0.04 },
      { id: "sierra", label: "Sierra eléctrica en uso", periodSeconds: 35, durationSeconds: 4, deltaKw: 0.7, deltaFp: -0.05 },
    ],
    quote: "Cada mes la cuenta sube un poquito y nadie me sabe explicar.",
  },
  salon: {
    id: "salon",
    name: "Salón de belleza",
    business: "Salón Carolina",
    location: "Envigado",
    equipment: "4 secadores · 2 planchas · nevera · aire acondicionado",
    baseLoadKw: 2.2,
    baseFp: 0.85,
    currentBillCop: 42_000,
    events: [
      { id: "secador", label: "Secadores simultáneos", periodSeconds: 14, durationSeconds: 6, deltaKw: 0.9, deltaFp: -0.04 },
    ],
    quote: "El recargo no es enorme pero llevamos años pagándolo.",
  },
  libre: {
    id: "libre",
    name: "Modo libre",
    business: "Configuración manual",
    location: "—",
    equipment: "Slider de carga + FP",
    baseLoadKw: 5,
    baseFp: 0.72,
    currentBillCop: 0,
    events: [],
    quote: "",
  },
};

export const SCENARIO_ORDER: readonly ScenarioId[] = [
  "panaderia",
  "taller",
  "lavanderia",
  "carniceria",
  "salon",
  "libre",
];

export const isScenarioId = (s: string | null | undefined): s is ScenarioId =>
  !!s && (SCENARIO_ORDER as readonly string[]).includes(s);
