"use client";

import dynamic from "next/dynamic";
import { SectionTitle } from "@/components/ui/SectionTitle";

const Globe = dynamic(() => import("@/components/three/GlobeScene"), { ssr: false, loading: () => <div className="size-[70vw] max-h-[680px] max-w-[680px] rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(104,231,255,.12),transparent_65%)]" /> });

export function GlobalNetworkSection() {
  return <section id="network" className="relative overflow-hidden py-28 md:py-40"><div className="container"><SectionTitle kicker="Global network" title="Global connections. Trusted partnerships." body="Building long-term relationships across markets, industries, and borders." /><div className="relative mt-10 grid min-h-[680px] place-items-center"><div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" /><div className="h-[min(80vw,680px)] w-[min(90vw,680px)]"><Globe /></div><div className="absolute bottom-6 left-0 max-w-xs text-sm leading-relaxed text-white/45">From product distribution to software, every route is built on trust, consistency, and execution.</div></div></div></section>;
}
