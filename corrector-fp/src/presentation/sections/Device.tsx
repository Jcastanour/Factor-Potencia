"use client";
import dynamic from "next/dynamic";
const DeviceClient = dynamic(() => import("./DeviceClient"), { ssr: false });
export function Device() {
  return <DeviceClient />;
}
