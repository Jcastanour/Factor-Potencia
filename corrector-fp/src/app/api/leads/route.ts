import { NextResponse } from "next/server";

import { makeCreateLead } from "@application/leads/create-lead";
import { getContainer } from "@infrastructure/container";
import { getEnv } from "@shared/env";
import { leadFormSchema } from "@shared/leads-schema";
import { createLogger } from "@shared/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = createLogger("api/leads");

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const env = getEnv();
  const container = await getContainer();
  const createLead = makeCreateLead({
    leads: container.leads,
    mailer: container.mailer,
    notifyTo: env.LEAD_NOTIFY_EMAIL,
    notifyFrom: env.LEAD_FROM_EMAIL,
  });

  try {
    const lead = await createLead(parsed.data);
    log.info("lead created", { id: lead.id });
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (err) {
    log.error("create lead failed", { err: String(err) });
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
