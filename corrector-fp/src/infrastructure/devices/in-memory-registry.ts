import bcrypt from "bcryptjs";

import type { DevicesRegistry } from "@domain/ports";
import type { Device } from "@domain/telemetry";

interface Init {
  readonly demoDeviceId: string;
  readonly demoApiKey: string;
}

class InMemoryDevicesRegistry implements DevicesRegistry {
  private readonly devices: Device[] = [];

  add(device: Device) {
    this.devices.push(device);
  }

  async authenticate(apiKey: string): Promise<Device | null> {
    if (!apiKey) return null;
    for (const d of this.devices) {
      if (await bcrypt.compare(apiKey, d.apiKeyHash)) return d;
    }
    return null;
  }

  async findById(deviceId: string): Promise<Device | null> {
    return this.devices.find((d) => d.id === deviceId) ?? null;
  }

  async list(): Promise<readonly Device[]> {
    return this.devices.slice();
  }
}

export async function createInMemoryDevicesRegistry(init: Init): Promise<DevicesRegistry> {
  const reg = new InMemoryDevicesRegistry();
  const hash = await bcrypt.hash(init.demoApiKey, 8);
  reg.add({
    id: init.demoDeviceId,
    name: "Prototipo demo",
    apiKeyHash: hash,
    location: "Medellín",
    createdAt: new Date().toISOString(),
  });
  return reg;
}
