/**
 * Composition root. Lee env y selecciona adapters.
 * UI / app / casos de uso reciben puertos vía este módulo, nunca instancian adapters.
 *
 * Reglas de capa (mantenidas por convención hasta que se active eslint-plugin-boundaries):
 *   domain/      ← no importa nada externo
 *   application/ ← solo importa de domain
 *   infrastructure/ ← implementa puertos de domain
 *   presentation/ y app/ ← consumen casos de uso vía este container
 */

import { getEnv } from "@shared/env";
import type {
  DevicesRegistry,
  LeadRepository,
  Mailer,
  TelemetrySource,
} from "@domain/ports";

import { SimulatedTelemetrySource } from "./telemetry/simulated-source";
import { InMemoryTelemetrySource } from "./telemetry/in-memory-source";
import { HybridTelemetrySource } from "./telemetry/hybrid-source";
import { PostgresTelemetrySource } from "./telemetry/postgres-source";
import { InMemoryLeadRepository } from "./leads/in-memory-repository";
import { ConsoleMailer } from "./mail/console-mailer";
import { createInMemoryDevicesRegistry } from "./devices/in-memory-registry";

export interface Container {
  readonly telemetry: TelemetrySource;
  readonly leads: LeadRepository;
  readonly mailer: Mailer;
  readonly devices: DevicesRegistry;
  readonly demoDeviceId: string;
}

let cached: Container | null = null;

export async function getContainer(): Promise<Container> {
  if (cached) return cached;
  const env = getEnv();

  // Telemetry source selection
  let inMemorySource: InMemoryTelemetrySource | null = null;
  const ensureInMemory = (): InMemoryTelemetrySource => {
    if (!inMemorySource) inMemorySource = new InMemoryTelemetrySource();
    return inMemorySource;
  };

  let telemetry: TelemetrySource;
  switch (env.TELEMETRY_SOURCE) {
    case "simulated":
      telemetry = new SimulatedTelemetrySource({ deviceId: env.DEMO_DEVICE_ID });
      break;
    case "in-memory":
      telemetry = ensureInMemory();
      break;
    case "hybrid":
      telemetry = new HybridTelemetrySource({
        live: ensureInMemory(),
        fallback: new SimulatedTelemetrySource({ deviceId: env.DEMO_DEVICE_ID }),
        freshnessMs: 60_000,
      });
      break;
    case "postgres":
      telemetry = new PostgresTelemetrySource();
      break;
  }

  // Mailer selection (Resend stub no instanciado en v1)
  const mailer: Mailer = new ConsoleMailer();

  // Lead repo
  const leads: LeadRepository = new InMemoryLeadRepository({ jsonlPath: env.LEADS_JSONL_PATH });

  // Devices
  const devices = await createInMemoryDevicesRegistry({
    demoDeviceId: env.DEMO_DEVICE_ID,
    demoApiKey: env.DEMO_DEVICE_API_KEY,
  });

  cached = { telemetry, leads, mailer, devices, demoDeviceId: env.DEMO_DEVICE_ID };
  return cached;
}
