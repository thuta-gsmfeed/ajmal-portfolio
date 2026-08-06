"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const duration = 1150;

    const tick = (time: number) => {
      const elapsed = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setDone(true), 140);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[250] overflow-hidden bg-[#030506]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.72 }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#050708]"
            exit={{ y: "-101%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050708]"
            exit={{ y: "101%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(104,231,255,.09),transparent_32%)]" />
          <div className="grain" />

          <div className="container relative z-10 flex h-full flex-col justify-between py-7 md:py-10">
            <div className="flex items-start justify-between font-mono text-[9px] uppercase tracking-[.22em] text-white/40 md:text-[10px]">
              <div>
                <p className="text-white/85">Ajmal Gholzad</p>
                <p className="mt-1">Entrepreneur · Founder</p>
              </div>
              <div className="text-right">
                <p>Global portfolio</p>
                <p className="mt-1 text-cyan-200/70">Est. 2009</p>
              </div>
            </div>

            <div className="relative mx-auto grid size-[min(68vw,430px)] place-items-center">
              <div className="loader-orbit absolute inset-[6%] rounded-full border border-white/10" />
              <div className="loader-orbit-reverse absolute inset-[17%] rounded-full border border-cyan-200/15" />
              <div className="absolute left-1/2 top-[6%] size-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(104,231,255,.9)]" />
              <motion.p
                aria-hidden
                className="select-none text-[clamp(8rem,24vw,19rem)] font-medium leading-none tracking-[-.12em] text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,.18)" }}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                AG
              </motion.p>
              <div className="absolute grid size-20 place-items-center rounded-full border border-white/20 bg-black/50 text-lg tracking-[.28em] text-white shadow-[0_0_60px_rgba(104,231,255,.08)] backdrop-blur-md md:size-24">
                AG
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/35">Loading experience</p>
                  <p className="mt-1 text-xs text-white/65">Connecting markets and ideas</p>
                </div>
                <p className="font-mono text-4xl font-light tracking-[-.06em] text-white md:text-6xl">
                  {String(progress).padStart(3, "0")}<span className="ml-1 text-sm text-cyan-200/70">%</span>
                </p>
              </div>
              <div className="h-px overflow-hidden bg-white/12">
                <motion.div className="h-full origin-left bg-gradient-to-r from-cyan-400 via-cyan-100 to-white" style={{ scaleX: progress / 100 }} />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-[.18em] text-white/25">
                <span>Dubai</span><span>Global network</span><span>Future</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
