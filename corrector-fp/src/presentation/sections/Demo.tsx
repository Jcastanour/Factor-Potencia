"use client";
import dynamic from "next/dynamic";
const DemoClient = dynamic(() => import("./DemoClient"), { ssr: false });
export function Demo() {
  return <DemoClient />;
}
