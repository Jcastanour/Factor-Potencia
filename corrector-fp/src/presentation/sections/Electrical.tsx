"use client";
import dynamic from "next/dynamic";
const ElectricalClient = dynamic(() => import("./ElectricalClient"), { ssr: false });
export function Electrical() {
  return <ElectricalClient />;
}
