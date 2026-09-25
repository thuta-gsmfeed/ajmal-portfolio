"use client";

import { useMotionSettings, useSectionProgress } from "@/components/animation/motion";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "@/data/content";

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
  const { desktop, reduced } = useMotionSettings();
  const scrollYProgress = useSectionProgress(ref, "top top", "bottom top");
  const contentY = useTransform(scrollYProgress, [0, 1], ["0vh", "-46vh"]);

  return (
    <section
      ref={ref}
      id="home"
      className="hero-portrait relative min-h-[100svh] overflow-hidden bg-[#04060a]"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <motion.div
          className="hero-portrait__media absolute inset-0"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-portrait__photo-frame absolute inset-0">
            <Image
              src={media.hero.src}
              alt={media.hero.alt}
              fill
              priority
              sizes="100vw"
              className="hero-portrait__image object-cover"
            />
          </div>
        </motion.div>
        <div className="hero-portrait__shade absolute inset-0" />
      </div>

      <div className="grain" />

      <motion.div
        style={{ y: desktop && !reduced ? contentY : 0 }}
        className="hero-portrait__inner container relative z-10 flex min-h-[100svh] items-end pt-32"
      >
        <div className="hero-portrait__copy">
          <h1 id="hero-title" className="hero-portrait__title" aria-label="Ajmal Gholzad">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                variants={reveal}
                initial={reduced ? false : "hidden"}
                animate="visible"
                custom={0.72}
              >
                Ajmal
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                variants={reveal}
                initial={reduced ? false : "hidden"}
                animate="visible"
                custom={0.84}
              >
                Gholzad
              </motion.span>
            </span>
          </h1>

          <div className="overflow-hidden">
            <motion.p
              variants={reveal}
              initial={reduced ? false : "hidden"}
              animate="visible"
              custom={1.02}
              className="hero-portrait__role"
            >
              Entrepreneur <span aria-hidden>·</span> Business Builder <span aria-hidden>·</span> Founder
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
