"use client";

import dynamic from "next/dynamic";
import { cn } from "@shared/utils/cn";

const DeviceScene = dynamic(
  () => import("@infrastructure/three/DeviceScene").then((m) => m.DeviceScene),
  { ssr: false, loading: () => <div className="h-full w-full" /> },
);

export function DeviceSceneLoader({ className }: { className?: string }) {
  return <DeviceScene className={cn("h-full w-full", className)} />;
}
