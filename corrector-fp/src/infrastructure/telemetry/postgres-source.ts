/**
 * Stub de Postgres. La firma cumple TelemetrySource pero todos los métodos lanzan.
 *
 * Para activar:
 *   1. pnpm add drizzle-orm drizzle-kit postgres
 *   2. Crear src/infrastructure/db/{schema.ts,client.ts,migrate.ts}
 *   3. Implementar los métodos abajo usando drizzle
 *   4. TELEMETRY_SOURCE=postgres + DATABASE_URL=...
 *
 * No requiere cambiar UI / casos de uso / firmware.
 */

import type { DomainEvent, DomainEventDraft } from "@domain/events";
import type {
  TelemetrySource,
  TelemetryWindow,
  Unsubscribe,
} from "@domain/ports";
import type { Reading, ReadingDraft } from "@domain/telemetry";

const NOT_WIRED = (method: string) =>
  new Error(
    `PostgresTelemetrySource.${method} not wired in v1 — set TELEMETRY_SOURCE to simulated|in-memory|hybrid`,
  );

export class PostgresTelemetrySource implements TelemetrySource {
  async writeReading(_draft: ReadingDraft): Promise<Reading> {
    throw NOT_WIRED("writeReading");
  }
  async latestReading(_deviceId: string): Promise<Reading | null> {
    throw NOT_WIRED("latestReading");
  }
  async listReadings(_window: TelemetryWindow): Promise<readonly Reading[]> {
    throw NOT_WIRED("listReadings");
  }
  subscribeReadings(_deviceId: string, _l: (r: Reading) => void): Unsubscribe {
    throw NOT_WIRED("subscribeReadings");
  }
  async writeEvent(_draft: DomainEventDraft): Promise<DomainEvent> {
    throw NOT_WIRED("writeEvent");
  }
  async listEvents(_window: TelemetryWindow): Promise<readonly DomainEvent[]> {
    throw NOT_WIRED("listEvents");
  }
}
