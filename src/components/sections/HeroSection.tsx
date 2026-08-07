"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { currentVentures, media } from "@/data/content";

const reveal = {
  hidden: { y: "115%", opacity: 0 },
  visible: (delay: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const imageX = useSpring(pointerX, { stiffness: 45, damping: 20 });
  const imageY = useSpring(pointerY, { stiffness: 45, damping: 20 });
  const glowX = useSpring(useMotionValue(50), { stiffness: 55, damping: 24 });
  const glowY = useSpring(useMotionValue(40), { stiffness: 55, damping: 24 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  const move = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointerX.set((x - 0.5) * -22);
    pointerY.set((y - 0.5) * -14);
    glowX.set(x * 100);
    glowY.set(y * 100);
  };

  return (
    <section ref={ref} id="home" onPointerMove={move} className="relative min-h-[108svh] overflow-hidden bg-[#030506]">
      <motion.div className="absolute -inset-8" style={{ y: scrollY }}>
        <motion.div className="absolute inset-0" style={{ x: imageX, y: imageY }} initial={{ scale: 1.12, filter: "blur(6px)" }} animate={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 2.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <Image src={media.hero.src} alt={media.hero.alt} fill priority sizes="100vw" className="object-cover opacity-65" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,6,.88)_0%,rgba(3,5,6,.44)_48%,rgba(3,5,6,.22)_100%),linear-gradient(0deg,#050607_0%,transparent_48%,rgba(2,3,4,.35)_100%)]" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[52vw] min-h-96 min-w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.075] blur-[110px]"
        style={{ left: useTransform(glowX, (value) => `${value}%`), top: useTransform(glowY, (value) => `${value}%`) }}
      />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="grain" />

      <motion.div style={{ opacity, y: contentY }} className="container relative z-10 flex min-h-[100svh] flex-col justify-end pb-10 pt-32 md:pb-12">
        <div className="mb-8 flex items-end justify-between">
          <div className="overflow-hidden">
            <motion.p variants={reveal} initial="hidden" animate="visible" custom={1.02} className="eyebrow">Entrepreneur · Business Builder · Founder</motion.p>
          </div>
        </div>

        <h1 className="section-title max-w-[1320px]">
          <span className="block"><motion.span className="block text-white/95" variants={reveal} initial="hidden" animate="visible" custom={1.08}>An innovative entrepreneur,</motion.span></span>
          <span className="block"><motion.span className="block bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent" variants={reveal} initial="hidden" animate="visible" custom={1.2}>turning challenges into</motion.span></span>
          <span className="block"><motion.span className="block text-white/95" variants={reveal} initial="hidden" animate="visible" custom={1.32}>impactful solutions.</motion.span></span>
        </h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.55, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mt-7 h-px origin-left bg-gradient-to-r from-cyan-200/80 via-white/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.95, duration: .9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 border-y border-white/10 bg-black/10 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-[170px_1fr]">
            <div className="flex items-center border-b border-white/10 px-4 py-3 md:border-b-0 md:border-r md:px-5">
              <span className="font-mono text-sm uppercase tracking-[.14em] text-white/50">Current ventures</span>
            </div>
            <div className="grid grid-cols-3">
              {currentVentures.map((venture, index) => (
                <motion.a
                  key={venture.name}
                  href={venture.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit ${venture.name} website (opens in a new tab)`}
                  data-cursor="Visit"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.08 + index * .1, duration: .65, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex min-h-16 items-center gap-3 overflow-hidden border-r border-white/10 px-3 py-3 transition-colors duration-500 last:border-r-0 hover:bg-white/[.06] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300 md:min-h-[74px] md:px-5"
                >
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan-300 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  <span className="grid size-8 shrink-0 place-items-center md:size-9">
                    <Image src={venture.logo} alt="" width={116} height={106} className="max-h-7 w-auto max-w-8 object-contain opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-100 md:max-h-8 md:max-w-9" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm font-medium tracking-wide text-white/75 transition-colors group-hover:text-white md:text-base">{venture.name}</strong>
                    <span className="mt-1 hidden truncate text-sm uppercase tracking-[.1em] text-white/40 lg:block">{venture.descriptor}</span>
                  </span>
                  <ArrowUpRight aria-hidden size={13} className="ml-auto hidden shrink-0 text-white/30 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200 sm:block" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.a href="#about" aria-label="Scroll to About" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="absolute bottom-8 left-5 z-20 hidden items-center gap-3 font-mono text-sm uppercase tracking-[.14em] text-white/45 xl:flex">
        <span className="grid size-10 place-items-center rounded-full border border-white/20"><motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ArrowDown size={13} /></motion.span></span>Scroll to explore
      </motion.a>
    </section>
  );
}
