"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const APP_STORE_URL = "https://apps.apple.com/us/app/gsmfeed/id6759554515";
const ASSET_ROOT = "/images/content/everything-u-need";

const features = [
  { name: "Trading Feed", image: "Tradingfeed.png", icon: "tradingfeed.svg", description: "Share stock updates, buying requests, offers, and business opportunities in real time." },
  { name: "Newsfeed", image: "Newsfeed.png", icon: "newsfeed.svg", description: "Follow the latest GSM news, announcements, and market movements from one simple feed." },
  { name: "Marketplace", image: "marketplace.png", icon: "marketplace.svg", description: "Discover verified buying and selling opportunities from trusted companies across the global market." },
  { name: "Communities", image: "Communuities.png", icon: "communities.svg", description: "Join focused business communities, build relationships, and keep conversations organized by interest." },
  { name: "Trade Alerts", image: "Alert.png", icon: "tradealerts.svg", description: "Receive timely alerts for relevant stock, pricing, and trade opportunities before they move past you." },
  { name: "Contact", image: "Contacts.png", icon: "contacts.svg", description: "Keep your verified business contacts close and reach the right buyer or supplier when it matters." },
];

function AppleMark() {
  return <svg aria-hidden viewBox="0 0 24 24" className="size-8 fill-current"><path d="M17.05 12.54c-.02-2.15 1.76-3.2 1.84-3.25a3.94 3.94 0 0 0-3.1-1.68c-1.3-.14-2.57.78-3.23.78-.67 0-1.68-.77-2.77-.75a4.1 4.1 0 0 0-3.45 2.1c-1.49 2.58-.38 6.37 1.05 8.45.72 1.02 1.56 2.17 2.65 2.13 1.07-.04 1.47-.68 2.77-.68 1.28 0 1.66.68 2.78.66 1.15-.02 1.88-1.03 2.57-2.06a8.45 8.45 0 0 0 1.18-2.4 3.7 3.7 0 0 1-2.29-3.3ZM14.94 6.23a3.75 3.75 0 0 0 .86-2.69 3.82 3.82 0 0 0-2.49 1.28 3.58 3.58 0 0 0-.89 2.59 3.16 3.16 0 0 0 2.52-1.18Z" /></svg>;
}

function AppStoreButton() {
  return (
    <a href={APP_STORE_URL} target="_blank" rel="noreferrer" aria-label="Download gsmfeed on the App Store" className="group inline-flex min-h-[64px] items-center gap-3 rounded-xl bg-[#090d10] px-5 text-white shadow-[0_16px_40px_rgba(7,13,16,.18)] transition duration-500 hover:-translate-y-1 hover:bg-[#151b20]">
      <AppleMark />
      <span><span className="block text-sm leading-none tracking-wide text-white/65">Available on the</span><strong className="mt-1 block text-base font-medium leading-none tracking-[-.02em] md:text-xl">App Store</strong></span>
      <ArrowUpRight size={17} className="ml-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export function GsmfeedMobileSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reducedMotion || window.matchMedia("(max-width: 767px)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % features.length), 4600);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const selected = features[active];

  return (
    <section id="gsmfeed-app" className="relative overflow-hidden bg-[#f1f2f7] py-16 text-[#090d10] md:py-40" aria-labelledby="gsmfeed-mobile-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_76%_45%,rgba(55,96,255,.085),transparent_30%)]" />
      <div aria-hidden className="absolute -right-[12vw] -top-32 hidden h-80 w-[62vw] rotate-[13deg] bg-white/65 md:block" />

      <div className="container relative z-10 md:hidden">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.13em] text-[#3d68ff]">Features</p>
          <h2 id="gsmfeed-mobile-title" className="section-title mt-4">
            <span className="block">Everything You Need</span>
            <span className="block text-[#3d68ff]">in One App</span>
          </h2>
        </div>

        <div className="relative mt-8 grid place-items-center py-4">
          <motion.div
            animate={reducedMotion ? undefined : { rotate: active % 2 === 0 ? -1 : 1, y: active % 2 === 0 ? -3 : 3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] w-[195px] overflow-hidden rounded-[2.25rem] border-[7px] border-[#090c0e] bg-black shadow-[0_32px_75px_rgba(20,31,71,.22)]"
          >
            <div className="absolute left-1/2 top-1.5 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`mobile-${selected.image}`}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.035, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={`${ASSET_ROOT}/${selected.image}`} alt={`gsmfeed — ${selected.name}`} fill sizes="195px" className="object-cover" priority={active === 0} />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[2rem] ring-1 ring-inset ring-white/15" />
          </motion.div>
        </div>

        <div className="-mx-3.5 mt-6 overflow-x-auto px-3.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {features.map((feature, index) => {
              const isActive = index === active;
              return (
                <button
                  key={`mobile-${feature.name}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`flex min-h-12 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[border-color,background-color,color,box-shadow] duration-300 ${isActive ? "border-[#3d68ff] bg-[#3d68ff] text-white shadow-[0_10px_28px_rgba(61,104,255,.2)]" : "border-black/10 bg-white/70 text-black/50"}`}
                >
                  <Image src={`${ASSET_ROOT}/${feature.icon}`} alt="" width={20} height={20} className={`size-5 ${isActive ? "brightness-0 invert" : "opacity-55"}`} />
                  {feature.name}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.name}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 rounded-2xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_50px_rgba(30,45,90,.07)] backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <strong className="text-base font-semibold">{selected.name}</strong>
              <span className="font-mono text-sm text-[#3d68ff]">0{active + 1} / 06</span>
            </div>
            <p className="mt-3 text-base leading-7 text-black/60">{selected.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex justify-center"><AppStoreButton /></div>
      </div>

      <div className="container relative z-10 hidden md:block">
        <div className="mb-10 flex items-end justify-between gap-8 border-b border-black/10 pb-4 md:mb-16 md:pb-5">
          <p className="eyebrow !normal-case !text-black/50">gsmfeed for iPhone</p>
          <div className="hidden items-center gap-3 md:flex"><span className="size-2 rounded-full bg-[#3d68ff]" /><span className="font-mono text-sm uppercase tracking-[.12em] text-black/40">Available on the App Store</span></div>
        </div>

        <div className="grid items-center gap-12 md:gap-16 lg:grid-cols-[.92fr_1.08fr] xl:gap-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.13em] text-[#3d68ff]">Features</p>
            <h2 className="section-title mt-5 max-w-xl md:mt-6">Everything You<br />Need in One App</h2>

            <div className="relative mt-8 pl-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-black/8 md:mt-11 md:pl-7" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <motion.span aria-hidden className="absolute left-0 top-0 w-1 rounded-full bg-[#3d68ff]" animate={{ y: `${active * 100}%` }} style={{ height: `${100 / features.length}%` }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />

              <div className="space-y-3">
                {features.map((feature, index) => {
                  const isActive = index === active;
                  return (
                    <button key={feature.name} type="button" onClick={() => setActive(index)} aria-pressed={isActive} className={`group block min-h-11 text-left transition-all duration-500 md:min-h-0 ${isActive ? "w-full" : "w-fit"}`}>
                      <span className={`block rounded-xl border bg-white transition-[border-color,box-shadow,padding,color] duration-500 ${isActive ? "border-[#3d68ff] px-5 py-4 text-black shadow-[0_16px_45px_rgba(56,86,180,.09)]" : "border-black/10 px-4 py-2.5 text-black/40 hover:border-black/25 hover:text-black/70"}`}>
                        <span className="flex items-center gap-3">
                          <Image src={`${ASSET_ROOT}/${feature.icon}`} alt="" width={24} height={24} className={`size-6 transition-opacity ${isActive ? "opacity-90" : "opacity-40 group-hover:opacity-65"}`} />
                          <strong className="text-base font-semibold">{feature.name}</strong>
                        </span>
                        <span className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ${isActive ? "mt-3 grid-rows-[1fr] opacity-100 md:mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                          <span className="overflow-hidden text-base leading-7 text-black/65 md:leading-relaxed">{feature.description}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10"><AppStoreButton /></div>
          </div>

          <div data-cursor="SWIPE" className="relative flex min-h-[540px] items-center justify-center [perspective:1200px] md:min-h-[680px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div aria-hidden className="absolute size-[390px] rounded-full border border-black/[.07] md:size-[540px]" />
            <div aria-hidden className="absolute size-[320px] rounded-full border border-[#3d68ff]/15 md:size-[410px]" />
            <div aria-hidden className="absolute bottom-12 left-1/2 h-16 w-72 -translate-x-1/2 rounded-[50%] bg-[#13204e]/20 blur-2xl" />

            <div className="relative h-[510px] w-[249px] md:h-[610px] md:w-[298px]">
              {features.map((feature, index) => {
                const rawDelta = (index - active + features.length) % features.length;
                const delta = rawDelta > features.length / 2 ? rawDelta - features.length : rawDelta;
                const nearby = Math.abs(delta) <= 1;
                const isActive = delta === 0;

                return (
                  <motion.button
                    type="button"
                    key={feature.name}
                    aria-label={isActive ? `${feature.name} selected` : `Show ${feature.name}`}
                    aria-pressed={isActive}
                    onClick={() => setActive(index)}
                    initial={false}
                    animate={reducedMotion ? { opacity: isActive ? 1 : 0 } : {
                      x: delta * 176,
                      y: isActive ? 0 : 34,
                      rotateY: delta * -17,
                      rotateZ: delta * 3.5,
                      scale: isActive ? 1 : 0.78,
                      opacity: nearby ? (isActive ? 1 : 0.46) : 0,
                    }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: isActive ? 20 : nearby ? 10 : 0, pointerEvents: nearby ? "auto" : "none" }}
                    className="absolute inset-0 overflow-hidden rounded-[2.75rem] border-[8px] border-[#090c0e] bg-black text-left shadow-[0_45px_100px_rgba(20,31,71,.24)] md:rounded-[3.25rem] md:border-[9px]"
                  >
                    <span className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
                    <Image src={`${ASSET_ROOT}/${feature.image}`} alt={`gsmfeed — ${feature.name}`} fill sizes="298px" className="object-cover" priority={index === 0} />
                    <span aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[2.7rem] ring-1 ring-inset ring-white/15" />
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={selected.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="absolute bottom-4 right-0 hidden border-l border-black/15 pl-4 xl:block">
                <span className="font-mono text-sm text-[#3d68ff]">0{active + 1} / 06</span>
                <strong className="mt-1 block max-w-[190px] text-base font-medium">{selected.name}</strong>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
