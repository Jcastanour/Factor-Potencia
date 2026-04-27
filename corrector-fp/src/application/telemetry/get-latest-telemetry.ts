import type { TelemetrySource } from "@domain/ports";

export interface GetLatestTelemetryDeps {
  readonly telemetry: TelemetrySource;
}

export function makeGetLatestTelemetry({ telemetry }: GetLatestTelemetryDeps) {
  return async function getLatestTelemetry(deviceId: string) {
    return telemetry.latestReading(deviceId);
  };
}
