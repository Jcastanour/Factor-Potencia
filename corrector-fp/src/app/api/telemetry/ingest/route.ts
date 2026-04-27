import { NextResponse } from "next/server";
import { z } from "zod";

import { makeIngestReading } from "@application/telemetry/ingest-reading";
import { getContainer } from "@infrastructure/container";
import { createLogger } from "@shared/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = createLogger("api/telemetry/ingest");

const bodySchema = z.object({
  ts: z.string().min(1),
  pf: z.number().min(0).max(1),
  p_w: z.number().nonnegative(),
  q_var: z.number(),
  s_va: z.number().nonnegative(),
  v_rms: z.number().nonnegative(),
  i_rms: z.number().nonnegative(),
  active_stage: z.number().int().min(0).max(7),
  raw: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-device-key") ?? "";
  if (!apiKey) {
    return NextResponse.json(
      { error: "missing x-device-key header" },
      { status: 401 },
    );
  }

  const container = await getContainer();
  const device = await container.devices.authenticate(apiKey);
  if (!device) {
    return NextResponse.json({ error: "invalid device key" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const ingest = makeIngestReading({ telemetry: container.telemetry });

  try {
    const reading = await ingest({
      deviceId: device.id,
      draft: {
        ts: parsed.data.ts,
        pf: parsed.data.pf,
        pW: parsed.data.p_w,
        qVar: parsed.data.q_var,
        sVa: parsed.data.s_va,
        vRms: parsed.data.v_rms,
        iRms: parsed.data.i_rms,
        activeStage: parsed.data.active_stage,
        raw: parsed.data.raw,
      },
    });
    log.info("reading ingested", { id: reading.id, deviceId: reading.deviceId });
    return NextResponse.json({ id: reading.id }, { status: 202 });
  } catch (err) {
    const code = (err as Error & { code?: string }).code;
    if (code === "DUPLICATE_READING") {
      return NextResponse.json(
        { error: "duplicate reading for this (deviceId, ts)" },
        { status: 409 },
      );
    }
    log.error("ingest failed", { err: String(err) });
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
