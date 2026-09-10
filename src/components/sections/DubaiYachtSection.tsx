"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useMotionSettings, useSectionProgress } from "@/components/animation/motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

export function DubaiYachtSection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const { desktop, reduced } = useMotionSettings();
  const reducedMotion = reduced;
  const scrollYProgress = useSectionProgress(section, "top top", "bottom bottom", false);

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
    let lastSeek = 0;
    const frameDuration = 1 / 24;

    const requestRender = () => {
      if (active && !frame) frame = requestAnimationFrame(renderFrame);
    };

    const syncTarget = (progress: number) => {
      if (!Number.isFinite(element.duration)) return;
      targetTime.current = progress * Math.max(0, element.duration - 0.08);
      requestRender();
    };

    const onMetadata = () => {
      element.pause();
      syncTarget(scrollYProgress.get());
      const targetFrame = Math.round(targetTime.current / frameDuration) * frameDuration;
      if (Math.abs(element.currentTime - targetFrame) > frameDuration / 2) {
        element.currentTime = targetFrame;
      }
    };

    const onSeeked = () => {
      if (Math.abs(targetTime.current - element.currentTime) > frameDuration / 2) requestRender();
    };

    const renderFrame = (timestamp: number) => {
      frame = 0;
      if (!active) return;

      if (timestamp - lastSeek < 1000 / 24) {
        requestRender();
        return;
      }

      if (element.readyState >= 2 && Number.isFinite(element.duration)) {
        const targetFrame = Math.round(targetTime.current / frameDuration) * frameDuration;
        if (!element.seeking && Math.abs(targetFrame - element.currentTime) > frameDuration / 2) {
          element.currentTime = targetFrame;
        }
        lastSeek = timestamp;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && element.preload !== "auto") { element.preload = "auto"; element.load(); }
        if (active) requestRender();
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "0px" },
    );

    const unsubscribe = scrollYProgress.on("change", syncTarget);
    element.addEventListener("loadedmetadata", onMetadata);
    element.addEventListener("durationchange", onMetadata);
    element.addEventListener("seeked", onSeeked);
    observer.observe(container);
    if (element.readyState >= 1) onMetadata();

  return () => {
      unsubscribe();
      observer.disconnect();
      element.removeEventListener("loadedmetadata", onMetadata);
      element.removeEventListener("durationchange", onMetadata);
      element.removeEventListener("seeked", onSeeked);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, scrollYProgress]);

  useEffect(() => {
    const element = video.current;
    if (!element || desktop) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) element.pause(); });
    observer.observe(element);
    return () => { observer.disconnect(); element.pause(); };
  }, [desktop]);

  return (
    <section
      ref={section}
      id="yachts"
      className={`yacht-section relative bg-[#02070a] ${reducedMotion ? "" : "h-[300svh] md:h-[250svh]"}`}
      aria-label="Dubai Marina Yachts story"
    >
      <div ref={stage} className={`yacht-stage ${reducedMotion ? "relative min-h-svh" : "sticky top-0 h-svh"} overflow-hidden bg-[#02070a] text-white`}>
        <video
          ref={video}
          muted
          playsInline
          preload="none"
          poster="/images/yacht-poster.jpg"
          controls={reducedMotion}
          aria-label="A silver and black luxury yacht cruising from a side view into an aerial view"
          className={reducedMotion ? "relative aspect-video w-full object-cover" : "absolute inset-0 size-full object-cover"}
        >
          <source src="/videos/yachts-scroll.scrub.mp4" type="video/mp4" />
        </video>

        <div hidden={reducedMotion} className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,10,.76)_0%,rgba(2,7,10,.22)_46%,transparent_70%),linear-gradient(0deg,rgba(2,7,10,.82)_0%,rgba(2,7,10,.4)_48%,transparent_78%,rgba(2,7,10,.3)_100%)]" />
        <div className="grain" />

        <div className={`container pointer-events-none ${reducedMotion ? "relative pt-8" : "absolute inset-x-0 top-[82px] md:top-[clamp(28px,4.5vh,52px)]"} z-10 flex items-center justify-center border-b border-white/15 pb-4`}>
          <Image src="/images/logo/dubai-marina-yachts-logo.svg" alt="Dubai Marina Yachts" width={246} height={36} className="h-auto w-[180px] sm:w-[220px]" />
        </div>

        {reducedMotion ? (
          <div className="container relative z-10 pb-16 pt-8">
            <div>
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">Dubai Marina Yachts</p>
              <h2 className="section-title mt-5 max-w-4xl uppercase">No. 1 yacht rental<br />in Dubai.</h2>
              <p className="section-description mt-6">Exclusive yacht rental in Dubai with dedicated crew, tailored packages and the best service.</p>
              <h3 className="mt-8 text-2xl">Your moment. Your horizon.</h3>
              <p className="section-description mt-4">Weddings, engagements, celebrations, parties, sea adventures, and fishing—made unforgettable on the water.</p>
              <h3 className="mt-8 text-2xl">The Arabian Sea, entirely yours.</h3>
              <p className="section-description mt-4">Exclusive yacht rental services created for freedom, privacy, and unparalleled luxury on Dubai&apos;s pristine waters.</p>
              <a href="https://dubaimarinayachts.ae/" target="_blank" rel="noreferrer" className="pill mt-8 bg-black/25">Explore the fleet <ArrowUpRight size={15} /></a>
            </div>
          </div>
        ) : (
          <>
            <motion.div style={{ opacity: introOpacity, y: introY }} className="container pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 block">
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">01 · Dubai Marina Yachts</p>
              <h2 className="section-title mt-5 max-w-4xl uppercase">No. 1 yacht rental<br />in Dubai.</h2>
              <p className="section-description mt-6">Exclusive yacht rental in Dubai with dedicated crew, tailored packages and the best service.</p>
            </motion.div>

            <motion.div style={{ opacity: occasionsOpacity, y: occasionsY }} className="container pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 flex lg:justify-end">
              <div className="max-w-2xl text-left lg:text-right">
                <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">02 · Every occasion</p>
                <h3 className="section-title mt-5">Your moment.<br />Your horizon.</h3>
                <p className="section-description ml-auto mt-6">Weddings, engagements, celebrations, parties, sea adventures, and fishing—made unforgettable on the water.</p>
              </div>
            </motion.div>

            <motion.div style={{ opacity: seaOpacity, y: seaY }} className="container absolute inset-x-0 bottom-[12vh] z-10 block">
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">03 · Open water</p>
              <h3 className="section-title mt-5 max-w-4xl">The Arabian Sea,<br />entirely yours.</h3>
              <p className="section-description mt-6">Exclusive yacht rental services created for freedom, privacy, and unparalleled luxury on Dubai&apos;s pristine waters.</p>
              <a href="https://dubaimarinayachts.ae/" target="_blank" rel="noreferrer" className="pill mt-8 bg-black/25 backdrop-blur-sm">Explore the fleet <ArrowUpRight size={15} /></a>
            </motion.div>

            <div className="container pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-center gap-3 sm:gap-5">
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
