import type { Device } from "../telemetry";

export interface DevicesRegistry {
  /** Devuelve el device si la api key matchea (bcrypt compare); si no, null. */
  authenticate(apiKey: string): Promise<Device | null>;
  findById(deviceId: string): Promise<Device | null>;
  list(): Promise<readonly Device[]>;
}
