"use client";
import dynamic from "next/dynamic";
const HeroClient = dynamic(() => import("./HeroClient"), { ssr: false });
export function Hero() {
  return <HeroClient />;
}
