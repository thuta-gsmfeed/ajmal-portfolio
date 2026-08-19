"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { globalLocations, partners, routes } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

const Globe = dynamic(() => import("@/components/three/GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="size-full rounded-full border border-cyan-300/15 bg-[radial-gradient(circle,rgba(104,231,255,.12),rgba(4,17,22,.7)_50%,transparent_72%)]" />
  ),
});

export function GlobalNetworkSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedLocation = globalLocations.find((location) => location.name === selected) ?? null;
  const relatedRoutes = selectedLocation ? routes.filter((route) => route.label.includes(selectedLocation.name)).length : 0;

  useEffect(() => {
    const market = new URLSearchParams(window.location.search).get("market");
    if (market && globalLocations.some((location) => location.name === market)) setSelected(market);
  }, []);

  const selectMarket = (name: string | null) => {
    setSelected(name);
    const url = new URL(window.location.href);
    if (name) url.searchParams.set("market", name); else url.searchParams.delete("market");
    window.history.replaceState(null, "", `${url.pathname}${url.search}#network`);
  };

  return (
    <section id="network" className="relative overflow-hidden py-20 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-[62%] size-[min(85vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.035] blur-[100px]" />
      <div className="container relative">
        <SectionTitle
          kicker="International distribution network"
          title={<><span className="block">Connecting Mobile</span><span className="block">Markets Worldwide.</span></>}
          body="Connecting trusted mobile phone and consumer electronics partners across Belgium, Poland, Italy, Spain, Ukraine, the Middle East, Hong Kong, and the wider European market."
          bodyClassName="!max-w-4xl"
        />

        <div className="relative mt-8 grid min-h-[480px] place-items-center py-4 md:mt-10 md:min-h-[780px] md:py-12">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
          <div data-cursor="DRAG" className="absolute left-1/2 top-1/2 h-[min(92vw,470px)] w-[min(96vw,470px)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing md:h-[min(80vw,680px)] md:w-[min(88vw,680px)]">
            <Globe selectedName={selected} onSelect={selectMarket} />
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:left-auto md:right-0 md:max-w-lg md:flex-wrap md:justify-end md:overflow-visible">
            {globalLocations.map((location) => (
              <button key={location.name} type="button" onClick={() => selectMarket(location.name)} aria-pressed={selected === location.name} className={`flex min-h-9 items-center gap-2 rounded-full border px-3 font-mono text-[11px] uppercase tracking-[.1em] transition-colors ${selected === location.name ? "border-cyan-200/40 bg-cyan-200/10 text-cyan-100" : "border-white/10 bg-black/25 text-white/45 hover:text-white"}`}>
                <i className="size-1 rounded-full bg-[#d4c997] shadow-[0_0_8px_rgba(212,201,151,.7)]" />
                {location.name}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedLocation && (
              <motion.aside initial={{ opacity: 0, x: -24, y: 12 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-x-0 bottom-2 z-30 mx-auto max-w-[calc(100%-8px)] rounded-2xl border border-white/15 bg-[#061014]/92 p-5 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl md:bottom-5 md:left-0 md:right-auto md:mx-0 md:max-w-sm md:p-6">
                <button type="button" onClick={() => selectMarket(null)} aria-label="Close market story" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/12 text-white/45 transition-colors hover:text-white"><X size={14} /></button>
                <p className="font-mono text-[11px] uppercase tracking-[.13em] text-cyan-200">{selectedLocation.focus}</p>
                <h3 className="mt-3 text-3xl font-medium tracking-[-.035em]">{selectedLocation.name}</h3>
                <p className="mt-4 text-sm leading-6 text-white/58">{selectedLocation.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[.1em] text-white/35">
                  <span>{selectedLocation.coordinates[0].toFixed(2)}° · {selectedLocation.coordinates[1].toFixed(2)}°</span>
                  <span>{relatedRoutes} active routes</span>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 border-y border-white/10 py-5 md:mt-14 md:py-7" aria-label="Trusted global partners">
          <div className="mb-5 flex items-center justify-between gap-4 md:mb-7">
            <p className="eyebrow">Trusted partnerships</p>
            <p className="hidden font-mono text-sm uppercase tracking-[.12em] text-white/35 sm:block">Built across markets</p>
          </div>
          <div className="marquee -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
            <div className="marquee-track flex w-max">
              {[...partners, ...partners].map((partner, index) => (
                <div key={`${partner.name}-${index}`} className="group flex h-20 w-44 shrink-0 items-center justify-center border-r border-white/10 px-7 md:h-24 md:w-56 md:px-9">
                  <div className="relative h-9 w-full opacity-55 grayscale transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0 md:h-11">
                    <Image src={partner.logo} alt={index < partners.length ? `${partner.name} logo` : ""} fill sizes="224px" className="object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
