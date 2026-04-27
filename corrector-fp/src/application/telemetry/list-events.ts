import type { TelemetrySource, TelemetryWindow } from "@domain/ports";

export interface ListEventsDeps {
  readonly telemetry: TelemetrySource;
}

export function makeListEvents({ telemetry }: ListEventsDeps) {
  return async function listEvents(window: TelemetryWindow) {
    return telemetry.listEvents(window);
  };
}
