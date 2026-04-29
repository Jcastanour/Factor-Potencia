"use client";

import dynamic from "next/dynamic";
import { cn } from "@shared/utils/cn";
import type { DeviceSceneProps } from "@infrastructure/three/DeviceScene";

const DeviceScene = dynamic(
  () => import("@infrastructure/three/DeviceScene").then((m) => m.DeviceScene),
  { ssr: false, loading: () => <div className="h-full w-full" /> },
);

export type { DeviceSceneApi } from "@infrastructure/three/DeviceScene";

export function DeviceSceneLoader(props: DeviceSceneProps) {
  return <DeviceScene {...props} className={cn("h-full w-full", props.className)} />;
}
