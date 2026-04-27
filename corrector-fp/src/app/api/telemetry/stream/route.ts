import { makeGetLatestTelemetry } from "@application/telemetry/get-latest-telemetry";
import { makeStreamTelemetry } from "@application/telemetry/stream-telemetry";
import { getContainer } from "@infrastructure/container";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const container = await getContainer();
  const deviceId = url.searchParams.get("deviceId") ?? container.demoDeviceId;

  const stream = makeStreamTelemetry({ telemetry: container.telemetry });
  const getLatest = makeGetLatestTelemetry({ telemetry: container.telemetry });

  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          /* stream closed */
        }
      };

      const initial = await getLatest(deviceId);
      if (initial) send("reading", initial);

      const unsubscribe = stream(deviceId, (reading) => send("reading", reading));

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          /* closed */
        }
      }, 15_000);

      const onAbort = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      req.signal.addEventListener("abort", onAbort);
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
