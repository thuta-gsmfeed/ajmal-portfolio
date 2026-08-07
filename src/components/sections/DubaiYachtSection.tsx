"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

export function DubaiYachtSection() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  const introOpacity = useTransform(scrollYProgress, [0, 0.055, 0.23, 0.31], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.22], [32, 0]);
  const occasionsOpacity = useTransform(scrollYProgress, [0.28, 0.37, 0.54, 0.63], [0, 1, 1, 0]);
  const occasionsY = useTransform(scrollYProgress, [0.28, 0.52], [38, 0]);
  const seaOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.94, 1], [0, 1, 1, 0.7]);
  const seaY = useTransform(scrollYProgress, [0.6, 0.86], [38, 0]);

  useEffect(() => {
    const element = video.current;
    const container = section.current;
    if (!element || !container || reducedMotion) return;

    let frame = 0;
    let active = false;

    const syncTarget = (progress: number) => {
      if (!Number.isFinite(element.duration)) return;
      targetTime.current = progress * Math.max(0, element.duration - 0.08);
    };

    const onMetadata = () => {
      element.pause();
      syncTarget(scrollYProgress.get());
    };

    const renderFrame = () => {
      if (!active) {
        frame = 0;
        return;
      }

      if (element.readyState >= 2 && Number.isFinite(element.duration)) {
        const difference = targetTime.current - element.currentTime;
        if (Math.abs(difference) > 0.012) {
          element.currentTime += difference * 0.115;
        }
      }

      frame = requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && !frame) frame = requestAnimationFrame(renderFrame);
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "30% 0px" },
    );

    const unsubscribe = scrollYProgress.on("change", syncTarget);
    element.addEventListener("loadedmetadata", onMetadata);
    observer.observe(container);
    if (element.readyState >= 1) onMetadata();

    return () => {
      unsubscribe();
      observer.disconnect();
      element.removeEventListener("loadedmetadata", onMetadata);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, scrollYProgress]);

  return (
    <section
      ref={section}
      className={`relative bg-[#02070a] ${reducedMotion ? "min-h-screen" : "h-[330vh]"}`}
      aria-label="Dubai Marina Yachts story"
    >
      <div className={`${reducedMotion ? "relative min-h-screen" : "sticky top-0 h-screen"} overflow-hidden`}>
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          aria-label="A silver and black luxury yacht cruising from a side view into an aerial view"
          className="absolute inset-0 size-full object-cover"
        >
          <source src="/videos/yachts.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,10,.76)_0%,rgba(2,7,10,.22)_46%,transparent_70%),linear-gradient(0deg,rgba(2,7,10,.78)_0%,transparent_36%,rgba(2,7,10,.3)_100%)]" />
        <div className="grain" />

        <div className="container pointer-events-none absolute inset-x-0 top-24 z-10 flex items-center justify-between border-b border-white/15 pb-4">
          <Image src="/images/logo/dubai-marina-yachts-logo.svg" alt="Dubai Marina Yachts" width={246} height={36} className="h-auto w-[180px] sm:w-[220px]" />
          <span className="hidden font-mono text-sm uppercase tracking-[.14em] text-white/55 sm:block">Dubai · Arabian Sea</span>
        </div>

        {reducedMotion ? (
          <div className="container relative z-10 flex min-h-screen items-end pb-24 pt-40">
            <div>
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">Dubai Marina Yachts</p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.5rem)] font-medium uppercase leading-[1.08] tracking-[-.025em]">No. 1 yacht rental<br />in Dubai.</h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">Exclusive yacht rental in Dubai with dedicated crew, tailored packages and the best service.</p>
              <a href="https://dubaimarinayachts.ae/" target="_blank" rel="noreferrer" className="pill mt-8 bg-black/25">Explore the fleet <ArrowUpRight size={15} /></a>
            </div>
          </div>
        ) : (
          <>
            <motion.div style={{ opacity: introOpacity, y: introY }} className="container pointer-events-none absolute inset-x-0 bottom-[12vh] z-10">
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">01 · Dubai Marina Yachts</p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.5rem)] font-medium uppercase leading-[1.08] tracking-[-.025em]">No. 1 yacht rental<br />in Dubai.</h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">Exclusive yacht rental in Dubai with dedicated crew, tailored packages and the best service.</p>
            </motion.div>

            <motion.div style={{ opacity: occasionsOpacity, y: occasionsY }} className="container pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 flex justify-end">
              <div className="max-w-2xl text-right">
                <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">02 · Every occasion</p>
                <h3 className="mt-5 text-[clamp(2.6rem,5vw,5.5rem)] font-medium leading-[1.08] tracking-[-.025em]">Your moment.<br />Your horizon.</h3>
                <p className="ml-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">Weddings, engagements, celebrations, parties, sea adventures, and fishing—made unforgettable on the water.</p>
              </div>
            </motion.div>

            <motion.div style={{ opacity: seaOpacity, y: seaY }} className="container absolute inset-x-0 bottom-[12vh] z-10">
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">03 · Open water</p>
              <h3 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.5rem)] font-medium leading-[1.08] tracking-[-.025em]">The Arabian Sea,<br />entirely yours.</h3>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">Exclusive yacht rental services created for freedom, privacy, and unparalleled luxury on Dubai&apos;s pristine waters.</p>
              <a href="https://dubaimarinayachts.ae/" target="_blank" rel="noreferrer" className="pill mt-8 bg-black/25 backdrop-blur-sm">Explore the fleet <ArrowUpRight size={15} /></a>
            </motion.div>

            <div className="container pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center gap-5">
              <span className="flex items-center gap-2 font-mono text-sm uppercase tracking-[.12em] text-white/50"><ArrowDown size={13} />Scroll the voyage</span>
              <div className="h-px flex-1 bg-white/15"><motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-cyan-200" /></div>
              <span className="hidden font-mono text-sm uppercase tracking-[.12em] text-white/50 sm:block">Dubai Marina Yachts</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
