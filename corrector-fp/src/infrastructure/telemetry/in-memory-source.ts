import type { DomainEvent, DomainEventDraft } from "@domain/events";
import type {
  TelemetrySource,
  TelemetryWindow,
  Unsubscribe,
} from "@domain/ports";
import type { Reading, ReadingDraft } from "@domain/telemetry";

let counter = 0;
const nextId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

/**
 * Persistencia en memoria del proceso. Reinicio = pérdida de datos (aceptable v1).
 * Cumple el mismo contrato que el futuro PostgresTelemetrySource.
 */
export class InMemoryTelemetrySource implements TelemetrySource {
  private readings = new Map<string, Reading[]>(); // deviceId → readings sorted desc
  private events = new Map<string, DomainEvent[]>();
  private subscribers = new Map<string, Set<(r: Reading) => void>>();

  async writeReading(draft: ReadingDraft): Promise<Reading> {
    const list = this.readings.get(draft.deviceId) ?? [];
    if (list.some((r) => r.ts === draft.ts)) {
      const err = new Error(
        `Duplicate reading for ${draft.deviceId} at ${draft.ts}`,
      );
      (err as Error & { code?: string }).code = "DUPLICATE_READING";
      throw err;
    }
    const reading: Reading = { id: nextId("rd"), ...draft };
    const updated = [reading, ...list].sort((a, b) => b.ts.localeCompare(a.ts));
    this.readings.set(draft.deviceId, updated);
    this.subscribers.get(draft.deviceId)?.forEach((fn) => {
      try {
        fn(reading);
      } catch {
        /* swallow listener errors */
      }
    });
    return reading;
  }

  async latestReading(deviceId: string): Promise<Reading | null> {
    return this.readings.get(deviceId)?.[0] ?? null;
  }

  async listReadings(window: TelemetryWindow): Promise<readonly Reading[]> {
    const list = this.readings.get(window.deviceId) ?? [];
    const filtered = list.filter((r) => {
      if (window.fromTs && r.ts < window.fromTs) return false;
      if (window.toTs && r.ts > window.toTs) return false;
      return true;
    });
    return window.limit ? filtered.slice(0, window.limit) : filtered;
  }

  subscribeReadings(deviceId: string, listener: (r: Reading) => void): Unsubscribe {
    const set = this.subscribers.get(deviceId) ?? new Set();
    set.add(listener);
    this.subscribers.set(deviceId, set);
    return () => {
      set.delete(listener);
    };
  }

  async writeEvent(draft: DomainEventDraft): Promise<DomainEvent> {
    const list = this.events.get(draft.deviceId) ?? [];
    const event: DomainEvent = { id: nextId("ev"), ...draft };
    this.events.set(draft.deviceId, [event, ...list]);
    return event;
  }

  async listEvents(window: TelemetryWindow): Promise<readonly DomainEvent[]> {
    const list = this.events.get(window.deviceId) ?? [];
    const filtered = list.filter((e) => {
      if (window.fromTs && e.ts < window.fromTs) return false;
      if (window.toTs && e.ts > window.toTs) return false;
      return true;
    });
    return window.limit ? filtered.slice(0, window.limit) : filtered;
  }

  /** Edad en ms de la última lectura del device, o Infinity si no hay. */
  freshnessMs(deviceId: string): number {
    const latest = this.readings.get(deviceId)?.[0];
    if (!latest) return Number.POSITIVE_INFINITY;
    return Date.now() - new Date(latest.ts).getTime();
  }
}
