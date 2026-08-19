"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function Loader() {
  const [done, setDone] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const timeout = window.setTimeout(
      () => setDone(true),
      reduceMotion ? 280 : mobile ? 620 : 1080,
    );

    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[250] grid place-items-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.82, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading Ajmal Gholzad portfolio"
        >
          <motion.div aria-hidden className="absolute inset-y-0 left-0 w-[50.1%] origin-left bg-[#030506]" exit={reduceMotion ? { opacity: 0 } : { x: "-102%" }} transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div aria-hidden className="absolute inset-y-0 right-0 w-[50.1%] origin-right bg-[#030506]" exit={reduceMotion ? { opacity: 0 } : { x: "102%" }} transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(104,231,255,.075),transparent_35%)]"
          />
          <div aria-hidden className="grain z-[2] opacity-35" />

          <motion.div
            className="relative z-10 w-[210px] sm:w-[260px] md:w-[300px]"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, clipPath: "inset(100% 0 0 0)" }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    clipPath: "inset(0% 0 0 0)",
                  }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 1.06 }}
            transition={{
              duration: reduceMotion ? 0.2 : 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/images/logo/logo-full.png"
              alt="Gholzad Management Group"
              width={340}
              height={260}
              className="relative h-auto w-full object-contain"
              priority
            />
            <motion.div aria-hidden className="mx-auto mt-8 h-px w-28 origin-left bg-gradient-to-r from-transparent via-cyan-200 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
