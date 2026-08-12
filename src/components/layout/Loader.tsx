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
      reduceMotion ? 350 : mobile ? 700 : 1550,
    );

    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[250] grid place-items-center overflow-hidden bg-[#030506]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading Ajmal Gholzad portfolio"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(104,231,255,.075),transparent_35%)]"
          />
          <div aria-hidden className="grain opacity-35" />

          <motion.div
            className="relative w-[210px] sm:w-[260px] md:w-[300px]"
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
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
