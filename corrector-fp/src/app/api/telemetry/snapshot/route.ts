import { NextResponse } from "next/server";

import { makeGetLatestTelemetry } from "@application/telemetry/get-latest-telemetry";
import { getContainer } from "@infrastructure/container";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const container = await getContainer();
  const deviceId = url.searchParams.get("deviceId") ?? container.demoDeviceId;

  const get = makeGetLatestTelemetry({ telemetry: container.telemetry });
  const reading = await get(deviceId);

  return NextResponse.json({ deviceId, reading });
}
