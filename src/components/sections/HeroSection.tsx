"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { media } from "@/data/content";
import { MagneticButton } from "@/components/ui/MagneticButton";

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.75, duration: .8 }} className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[.2em] text-white/35 md:flex">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-50" /><span className="relative inline-flex size-2 rounded-full bg-cyan-300" /></span>
            Global · Active
          </motion.div>
        </div>

        <h1 className="max-w-[1420px] text-[clamp(2.6rem,6.2vw,6.8rem)] font-medium leading-[.92] tracking-[-.05em]">
          <span className="block overflow-hidden pb-[.08em]"><motion.span className="block text-white/95" variants={reveal} initial="hidden" animate="visible" custom={1.08}>An innovative entrepreneur,</motion.span></span>
          <span className="block overflow-hidden pb-[.08em]"><motion.span className="block bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent" variants={reveal} initial="hidden" animate="visible" custom={1.2}>turning challenges into</motion.span></span>
          <span className="block overflow-hidden pb-[.08em]"><motion.span className="block text-white/95" variants={reveal} initial="hidden" animate="visible" custom={1.32}>impactful solutions.</motion.span></span>
        </h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.55, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mt-7 h-px origin-left bg-gradient-to-r from-cyan-200/80 via-white/20 to-transparent" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.72, duration: .85, ease: [0.22, 1, 0.36, 1] }} className="mt-5 grid gap-8 md:grid-cols-[1.3fr_1fr_auto] md:items-end">
          <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">Ajmal Gholzad has spent more than fifteen years turning opportunity into global businesses, trusted partnerships, and technology products.</p>
          <div className="grid grid-cols-3 gap-5 border-l border-white/15 pl-5">
            <div><strong className="block text-xl font-medium md:text-2xl">2009</strong><span className="mt-1 block text-[9px] uppercase tracking-[.16em] text-white/35">Started</span></div>
            <div><strong className="block text-xl font-medium md:text-2xl">$100M+</strong><span className="mt-1 block text-[9px] uppercase tracking-[.16em] text-white/35">Generated</span></div>
            <div><strong className="block text-xl font-medium md:text-2xl">Global</strong><span className="mt-1 block text-[9px] uppercase tracking-[.16em] text-white/35">Network</span></div>
          </div>
          <MagneticButton href="#about">Discover the story</MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a href="#about" aria-label="Scroll to About" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="absolute bottom-8 left-5 z-20 hidden items-center gap-3 font-mono text-[8px] uppercase tracking-[.2em] text-white/35 xl:flex">
        <span className="grid size-10 place-items-center rounded-full border border-white/20"><motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ArrowDown size={13} /></motion.span></span>Scroll to explore
      </motion.a>
    </section>
  );
}
