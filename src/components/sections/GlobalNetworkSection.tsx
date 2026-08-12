"use client";

import dynamic from "next/dynamic";
import { globalLocations } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

const Globe = dynamic(() => import("@/components/three/GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="size-full rounded-full border border-cyan-300/15 bg-[radial-gradient(circle,rgba(104,231,255,.12),rgba(4,17,22,.7)_50%,transparent_72%)]" />
  ),
});

export function GlobalNetworkSection() {
  return (
    <section id="network" className="relative overflow-hidden py-20 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-[62%] size-[min(85vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.035] blur-[100px]" />
      <div className="container relative">
        <SectionTitle
          kicker="International distribution network"
          title="Connecting Mobile Markets Worldwide."
          body="Connecting trusted mobile phone and consumer electronics partners across Belgium, Poland, Italy, Spain, Ukraine, the Middle East, Hong Kong, and the wider European market."
        />

        <div className="relative mt-8 grid min-h-[480px] place-items-center py-4 md:mt-10 md:min-h-[780px] md:py-12">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[min(92vw,470px)] w-[min(96vw,470px)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing md:h-[min(80vw,680px)] md:w-[min(88vw,680px)]">
            <Globe />
          </div>

          <div className="absolute bottom-5 right-0 hidden max-w-md flex-wrap justify-end gap-x-4 gap-y-2 md:flex">
            {globalLocations.map((location) => (
              <span key={location.name} className="flex items-center gap-2 font-mono text-sm uppercase tracking-[.12em] text-white/45">
                <i className="size-1 rounded-full bg-[#d4c997] shadow-[0_0_8px_rgba(212,201,151,.7)]" />
                {location.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
