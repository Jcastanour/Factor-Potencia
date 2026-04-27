import type { Reading, ReadingDraft } from "../telemetry";
import type { DomainEvent, DomainEventDraft } from "../events";

export interface TelemetryWindow {
  readonly deviceId: string;
  readonly fromTs?: string;
  readonly toTs?: string;
  readonly limit?: number;
}

export type Unsubscribe = () => void;

export interface TelemetrySource {
  /** Persiste una lectura nueva. Lanza error si (deviceId, ts) ya existe. */
  writeReading(draft: ReadingDraft): Promise<Reading>;

  /** Última lectura conocida del device. null si nunca se ingestó. */
  latestReading(deviceId: string): Promise<Reading | null>;

  /** Lecturas en una ventana, más recientes primero. */
  listReadings(window: TelemetryWindow): Promise<readonly Reading[]>;

  /** Subscripción push para SSE/dashboard. */
  subscribeReadings(deviceId: string, listener: (r: Reading) => void): Unsubscribe;

  /** Persiste un evento del dominio (boot, anomaly, stage-engaged, …). */
  writeEvent(draft: DomainEventDraft): Promise<DomainEvent>;

  /** Eventos en una ventana, más recientes primero. */
  listEvents(window: TelemetryWindow): Promise<readonly DomainEvent[]>;
}
