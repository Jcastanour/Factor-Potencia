import type { Reading } from "@domain/telemetry";
import type { TelemetrySource } from "@domain/ports";

export interface StreamTelemetryDeps {
  readonly telemetry: TelemetrySource;
}

export function makeStreamTelemetry({ telemetry }: StreamTelemetryDeps) {
  return function streamTelemetry(
    deviceId: string,
    onReading: (reading: Reading) => void,
  ) {
    return telemetry.subscribeReadings(deviceId, onReading);
  };
}
