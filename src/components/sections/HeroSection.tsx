"use client";

import { useMotionSettings, useSectionProgress } from "@/components/animation/motion";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { media } from "@/data/content";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { desktop, reduced } = useMotionSettings();
  const scrollYProgress = useSectionProgress(ref, "top top", "bottom top");
  const contentY = useTransform(scrollYProgress, [0, 1], ["0vh", "-46vh"]);

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".hero-portrait__text-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lines, { "--bg-progress": 100 });
      return;
    }

    gsap.fromTo(lines,
      { "--bg-progress": 0 },
      { "--bg-progress": 100, duration: 2.2, delay: 0.3, ease: "none" },
    );
  }, { scope: ref });

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
              <span className="hero-portrait__title-line hero-portrait__text-reveal inline-block">Ajmal</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-portrait__title-line hero-portrait__text-reveal inline-block">Gholzad</span>
            </span>
          </h1>

          <div className="overflow-hidden">
            <p className="hero-portrait__role">
              <span className="hero-portrait__text-reveal inline-block">
                Entrepreneur <span aria-hidden>·</span> Business Builder <span aria-hidden>·</span> Founder
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
