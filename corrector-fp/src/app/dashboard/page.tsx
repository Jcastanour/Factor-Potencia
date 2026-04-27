import { Suspense } from "react";

import { makeGetLatestTelemetry } from "@application/telemetry/get-latest-telemetry";
import { getContainer } from "@infrastructure/container";
import { DashboardFriendly } from "@presentation/dashboard-friendly/DashboardFriendly";
import { getEnv } from "@shared/env";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard · FactorPro",
  description:
    "Resumen amigable del estado de tu energía y de cuánto te ahorra el corrector de factor de potencia.",
};

export default async function DashboardPage() {
  const env = getEnv();
  const container = await getContainer();
  const getLatest = makeGetLatestTelemetry({ telemetry: container.telemetry });
  const initial = await getLatest(container.demoDeviceId);

  return (
    <Suspense fallback={null}>
      <DashboardFriendly
        initialReading={initial}
        deviceId={container.demoDeviceId}
        source={env.TELEMETRY_SOURCE}
      />
    </Suspense>
  );
}
