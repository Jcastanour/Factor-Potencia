import type { ReadingDraft } from "@domain/telemetry";
import type { TelemetrySource } from "@domain/ports";

export interface IngestReadingDeps {
  readonly telemetry: TelemetrySource;
}

export interface IngestReadingInput {
  readonly deviceId: string;
  readonly draft: Omit<ReadingDraft, "deviceId">;
}

export function makeIngestReading({ telemetry }: IngestReadingDeps) {
  return async function ingestReading(input: IngestReadingInput) {
    return telemetry.writeReading({ ...input.draft, deviceId: input.deviceId });
  };
}
