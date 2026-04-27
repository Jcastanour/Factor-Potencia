import { NextResponse } from "next/server";

import { getEnv } from "@shared/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = getEnv();
  return NextResponse.json({
    status: "ok",
    telemetrySource: env.TELEMETRY_SOURCE,
    mailer: env.MAILER,
    ts: new Date().toISOString(),
  });
}
