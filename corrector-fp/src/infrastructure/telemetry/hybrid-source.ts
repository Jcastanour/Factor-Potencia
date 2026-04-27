import type { DomainEvent, DomainEventDraft } from "@domain/events";
import type {
  TelemetrySource,
  TelemetryWindow,
  Unsubscribe,
} from "@domain/ports";
import type { Reading, ReadingDraft } from "@domain/telemetry";

import type { InMemoryTelemetrySource } from "./in-memory-source";

interface Deps {
  readonly live: InMemoryTelemetrySource;
  readonly fallback: TelemetrySource;
  readonly freshnessMs: number;
}

/**
 * Si la fuente "live" tiene una lectura reciente (< freshnessMs), la usa.
 * Si no, delega al fallback (típicamente simulado).
 * Writes siempre van a "live".
 */
export class HybridTelemetrySource implements TelemetrySource {
  constructor(private readonly deps: Deps) {}

  private isFresh(deviceId: string): boolean {
    return this.deps.live.freshnessMs(deviceId) < this.deps.freshnessMs;
  }

  writeReading(draft: ReadingDraft): Promise<Reading> {
    return this.deps.live.writeReading(draft);
  }

  async latestReading(deviceId: string): Promise<Reading | null> {
    if (this.isFresh(deviceId)) return this.deps.live.latestReading(deviceId);
    return this.deps.fallback.latestReading(deviceId);
  }

  async listReadings(window: TelemetryWindow): Promise<readonly Reading[]> {
    if (this.isFresh(window.deviceId)) return this.deps.live.listReadings(window);
    return this.deps.fallback.listReadings(window);
  }

  subscribeReadings(deviceId: string, listener: (r: Reading) => void): Unsubscribe {
    const offLive = this.deps.live.subscribeReadings(deviceId, listener);
    const offFallback = this.deps.fallback.subscribeReadings(deviceId, (r) => {
      if (!this.isFresh(deviceId)) listener(r);
    });
    return () => {
      offLive();
      offFallback();
    };
  }

  writeEvent(draft: DomainEventDraft): Promise<DomainEvent> {
    return this.deps.live.writeEvent(draft);
  }

  async listEvents(window: TelemetryWindow): Promise<readonly DomainEvent[]> {
    if (this.isFresh(window.deviceId)) return this.deps.live.listEvents(window);
    return this.deps.fallback.listEvents(window);
  }
}
