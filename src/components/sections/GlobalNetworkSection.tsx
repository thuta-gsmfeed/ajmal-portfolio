"use client";

import { useSceneVisibility } from "@/components/animation/motion";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import Globe from "@/components/three/GlobeScene";
import { useRef } from "react";
import { globalLocations } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function GlobalNetworkSection() {
  const chapter = useRef<HTMLDivElement>(null);
  const { active } = useSceneVisibility(chapter);
  const fallback = <div className="scene-fallback"><p className="text-4xl text-cyan-100">Connected across markets.</p><p>A connected view of the global network.</p></div>;

  return (
    <section id="network" className="network-section relative py-20 lg:py-0">
      <div ref={chapter} className="network-stage relative overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-[62%] size-[min(85vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.035] blur-[100px]" />
          <div className="container relative">
            <div className="network-copy">
              <SectionTitle
                kicker="International distribution network"
                title={<><span className="block">A Global Network.</span><span className="block">Built to Move.</span></>}
                body="Connecting trusted mobile phone and consumer electronics partners across Belgium, Poland, Italy, Spain, Ukraine, the Middle East, Hong Kong, and the wider European market."
                bodyClassName="!max-w-4xl"
              />
            </div>

            <div className="network-scene relative mt-8 grid min-h-[480px] place-items-center py-4 md:mt-10 md:min-h-[780px] md:py-12">
              <div data-cursor="DRAG" className="network-globe absolute left-1/2 top-1/2 h-[min(92vw,470px)] w-[min(96vw,470px)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y active:cursor-grabbing md:h-[min(80vw,680px)] md:w-[min(88vw,680px)]">
                <SceneBoundary fallback={fallback}><Globe active={active} /></SceneBoundary>
              </div>

              <div className="network-controls absolute inset-x-0 bottom-4 z-20 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:left-auto md:right-0 md:max-w-lg md:flex-wrap md:justify-end md:overflow-visible">
                {globalLocations.map((location) => (
                  <span key={location.name} className="group flex min-h-9 cursor-default items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 font-mono text-xs uppercase tracking-[.13em] text-white/40 shadow-none transition-[transform,border-color,background-color,color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-orange-300/45 hover:bg-orange-300/[.08] hover:text-white hover:shadow-[0_10px_30px_rgba(251,146,60,.12)] motion-reduce:transform-none">
                    <i className="size-1 rounded-full bg-orange-300 shadow-[0_0_9px_rgba(251,146,60,.8)] transition-[transform,box-shadow] duration-300 group-hover:scale-150 group-hover:shadow-[0_0_14px_rgba(251,146,60,1)] motion-reduce:transform-none" />
                    {location.name}
                  </span>
                ))}
              </div>

            </div>
          </div>
      </div>

    </section>
  );
}
