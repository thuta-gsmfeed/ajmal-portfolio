"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const duration = 1400; // 1.4s smooth load

    const tick = (time: number) => {
      const elapsed = Math.min(1, (time - startedAt) / duration);
      // Smooth cubic ease out
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 250);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[250] flex flex-col justify-between overflow-hidden bg-[#030506] px-6 py-8 md:px-12 md:py-10"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          {/* Subtle ambient lighting */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(104,231,255,0.06),transparent_60%)]" />
          <div aria-hidden className="grain opacity-40" />

          {/* Top Info Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 md:text-xs">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white/85">GHOLZAD</span>
              <span className="ml-2 text-white/40">· Management Group</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-right"
            >
              <span className="text-cyan-200/70">GLOBAL PORTFOLIO</span>
            </motion.div>
          </div>

          {/* Center Logo Section - Full Logo (Image 2) */}
          <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center justify-center py-12">
            {/* Animated Logo Container */}
            <motion.div
              className="relative flex w-full max-w-[280px] sm:max-w-[340px] items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Subtle aura ring around logo */}
              <div 
                aria-hidden
                className="absolute inset-0 -m-8 rounded-full bg-cyan-400/5 blur-3xl" 
              />

              {/* Full Logo (logo-full.png) */}
              <Image
                src="/images/logo/logo-full.png"
                alt="Gholzad Management Group"
                width={340}
                height={260}
                className="h-auto w-full max-w-[320px] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                priority
              />

              {/* Sleek metallic shimmer highlight across logo */}
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
              />
            </motion.div>

            {/* Subtle animated subtitle indicator */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50"
            >
              Initializing Experience
            </motion.p>
          </div>

          {/* Bottom Progress Section */}
          <div className="relative z-10 w-full max-w-5xl mx-auto">
            <div className="mb-3 flex items-end justify-between font-mono text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="uppercase tracking-[0.2em] text-[10px] text-white/50">System Loading</span>
              </div>
              <motion.div 
                className="font-mono text-3xl font-light tracking-tight text-white sm:text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {String(progress).padStart(3, "0")}
                <span className="ml-1 text-sm text-cyan-200/70">%</span>
              </motion.div>
            </div>

            {/* Progress Bar Track */}
            <div className="h-[2px] w-full overflow-hidden bg-white/10 rounded-full">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-cyan-400 via-white to-cyan-200 shadow-[0_0_12px_rgba(104,231,255,0.8)]"
                style={{ scaleX: progress / 100 }}
              />
            </div>

            <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
              <span>Dubai · UAE</span>
              <span>Global Ventures</span>
              <span>2026</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
