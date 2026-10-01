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
  const mobileContentY = useTransform(scrollYProgress, [0, 1], ["0vh", "-12vh"]);

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".hero-portrait__text-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(lines,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.05, stagger: 0.12, delay: 0.3, ease: "power3.out" },
    );
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="home"
      data-header-theme="dark"
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
        style={{ y: reduced ? 0 : desktop ? contentY : mobileContentY }}
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
