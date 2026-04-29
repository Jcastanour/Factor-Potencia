export type ComponentStatus = "prototype" | "projection";

export type FunctionalGroup =
  | "alimentacion"
  | "control"
  | "sensado"
  | "actuacion"
  | "compensacion";

export interface DeviceComponent {
  readonly id: string;
  readonly group: FunctionalGroup;
  readonly label: string;
  readonly part?: string;
  readonly role: string;
  readonly spec: string;
  readonly status: ComponentStatus;
  /** @deprecated Coordenadas SVG legacy (viewBox 800×520). Conservadas por compatibilidad. */
  readonly hotspot: { x: number; y: number };
  /** Posición en el sistema de la escena 3D (PCB centrado en origen, eje Y vertical). */
  readonly position3D: readonly [number, number, number];
}

export const GROUPS: Record<FunctionalGroup, { label: string; order: number }> = {
  alimentacion: { label: "Alimentación", order: 0 },
  control: { label: "Control", order: 1 },
  sensado: { label: "Sensado", order: 2 },
  actuacion: { label: "Actuación", order: 3 },
  compensacion: { label: "Compensación", order: 4 },
};

export const COMPONENTS: readonly DeviceComponent[] = [
  {
    id: "fuse",
    group: "alimentacion",
    label: "Fusible",
    role: "Protección de sobrecorriente en la entrada AC.",
    spec: "5 A · 250 VAC",
    status: "projection",
    hotspot: { x: -180, y: -78 },
    position3D: [-2.0, 0.55, 0.55],
  },
  {
    id: "psu",
    group: "alimentacion",
    label: "AC-DC 5V",
    role: "Convierte 120 VAC a 5 VDC para la electrónica.",
    spec: "Mean Well IRM-03 · 5 V / 600 mA",
    status: "prototype",
    hotspot: { x: -156, y: -62 },
    position3D: [-2.0, 0.6, -0.6],
  },
  {
    id: "esp32",
    group: "control",
    label: "ESP32-WROOM-32",
    role: "MCU principal: control de histéresis, lectura de sensores, UI OLED.",
    spec: "240 MHz · Wi-Fi · 2× ADC",
    status: "prototype",
    hotspot: { x: -15, y: -60 },
    position3D: [-0.7, 0.4, -0.5],
  },
  {
    id: "lcd",
    group: "control",
    label: "Display OLED",
    role: "Muestra FP, P, Q, S y estado del banco en tiempo real desde el frente.",
    spec: "OLED 128×64 · I²C · 3.3 V",
    status: "prototype",
    hotspot: { x: 140, y: -65 },
    position3D: [-1.25, 0.85, 1.205],
  },
  {
    id: "zmpt",
    group: "sensado",
    label: "Sensor V · ZMPT101B",
    role: "Mide tensión RMS de la red con aislamiento galvánico.",
    spec: "0–250 VAC · escala ajustable",
    status: "prototype",
    hotspot: { x: -166, y: 20 },
    position3D: [0.9, 0.5, -0.55],
  },
  {
    id: "sct",
    group: "sensado",
    label: "Sensor I · SCT-013-030",
    role: "Pinza de corriente no invasiva sobre la fase activa.",
    spec: "0–30 A · salida 1 V max",
    status: "prototype",
    hotspot: { x: -166, y: 72 },
    position3D: [2.0, 0.5, -0.55],
  },
  {
    id: "ssr1",
    group: "actuacion",
    label: "SSR 1 (1 kVAR)",
    role: "Conmuta el escalón de 5 µF del banco.",
    spec: "Solid State Relay · 25 A · 250 VAC",
    status: "prototype",
    hotspot: { x: -52, y: 22 },
    position3D: [-0.7, 0.65, 0.0],
  },
  {
    id: "ssr2",
    group: "actuacion",
    label: "SSR 2 (2 kVAR)",
    role: "Conmuta el escalón de 10 µF.",
    spec: "Solid State Relay · 25 A · 250 VAC",
    status: "prototype",
    hotspot: { x: -8, y: 22 },
    position3D: [-0.1, 0.65, 0.0],
  },
  {
    id: "ssr3",
    group: "actuacion",
    label: "SSR 3 (4 kVAR)",
    role: "Conmuta el escalón de 20 µF.",
    spec: "Solid State Relay · 25 A · 250 VAC",
    status: "prototype",
    hotspot: { x: 36, y: 22 },
    position3D: [0.5, 0.65, 0.0],
  },
  {
    id: "cap1",
    group: "compensacion",
    label: "Capacitor 5 µF",
    role: "Aporta 1 kVAR cuando el SSR1 cierra.",
    spec: "5 µF · 450 VAC",
    status: "prototype",
    hotspot: { x: -34, y: 110 },
    position3D: [1.4, 1.0, 0.6],
  },
  {
    id: "cap2",
    group: "compensacion",
    label: "Capacitor 10 µF",
    role: "Aporta 2 kVAR cuando el SSR2 cierra.",
    spec: "10 µF · 450 VAC",
    status: "prototype",
    hotspot: { x: 56, y: 110 },
    position3D: [1.85, 1.1, 0.6],
  },
  {
    id: "cap3",
    group: "compensacion",
    label: "Capacitor 20 µF",
    role: "Aporta 4 kVAR cuando el SSR3 cierra.",
    spec: "20 µF · 450 VAC",
    status: "prototype",
    hotspot: { x: 146, y: 110 },
    position3D: [2.3, 1.1, 0.6],
  },
];

export const GROUP_ORDER: readonly FunctionalGroup[] = (
  Object.keys(GROUPS) as FunctionalGroup[]
).sort((a, b) => GROUPS[a].order - GROUPS[b].order);
