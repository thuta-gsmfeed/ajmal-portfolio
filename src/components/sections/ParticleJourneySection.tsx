"use client";

import dynamic from "next/dynamic";
import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState } from "react";

const ParticleJourneyScene = dynamic(
  () => import("@/components/three/ParticleJourneyScene"),
  {
    ssr: false,
    loading: () => (
      <div className="size-full animate-pulse rounded-full bg-cyan-300/[.025]" />
    ),
  },
);

const chapterCount = 4;

export function ParticleJourneySection() {
  const section = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const inView = useInView(section, { margin: "280px 0px 280px 0px" });
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.38,
  });

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.min(
      chapterCount - 1,
      Math.max(0, Math.round(value * (chapterCount - 1))),
    );
    setActiveStep((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={section}
      id="particle-journey"
      className="relative overflow-clip bg-[#020506] lg:min-h-[320svh]"
      aria-labelledby="particle-journey-label"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(43,193,224,.09),transparent_30%),radial-gradient(circle_at_78%_52%,rgba(112,91,255,.045),transparent_28%),linear-gradient(180deg,#020506,#061013_50%,#020506)]" />
      <div className="grain" />

      <div className="particle-journey-shell container relative flex flex-col py-20 lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden lg:pb-6 lg:pt-24">
        <header className="relative z-10">
          <p id="particle-journey-label" className="eyebrow">
            From instinct to infrastructure
          </p>
        </header>

        <div
          className="particle-journey-stage relative mt-5 h-[430px] sm:h-[510px] lg:mt-0 lg:min-h-0 lg:flex-1"
          role="img"
          aria-label="Particle formation evolving from signal to connected network"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[min(48vw,300px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.06] blur-[78px]" />

          <div className="absolute inset-0" aria-hidden>
            <ParticleJourneyScene
              progress={progress}
              activeStep={activeStep}
              reducedMotion={reducedMotion}
              active={inView}
            />
          </div>

          <div className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 font-mono text-[9px] uppercase tracking-[.14em] text-white/35 backdrop-blur-md lg:flex">
            Scroll to morph
            <ArrowDown aria-hidden="true" size={12} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  );
}
