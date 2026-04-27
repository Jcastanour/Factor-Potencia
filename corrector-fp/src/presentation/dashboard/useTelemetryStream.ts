"use client";

import { useEffect, useState } from "react";

import type { Reading } from "@domain/telemetry";

export function useTelemetryStream(initial: Reading | null, deviceId: string) {
  const [reading, setReading] = useState<Reading | null>(initial);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = `/api/telemetry/stream?deviceId=${encodeURIComponent(deviceId)}`;
    const es = new EventSource(url);

    es.addEventListener("open", () => setConnected(true));
    es.addEventListener("reading", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data) as Reading;
        setReading(data);
      } catch {
        /* ignore */
      }
    });
    es.addEventListener("error", () => setConnected(false));

    return () => es.close();
  }, [deviceId]);

  return { reading, connected };
}
