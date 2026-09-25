"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const businesses = [
  { name: "Coolmix", logo: "/images/logo/coolmix-logo.svg", className: "h-9 w-9", url: "https://coolmix.eu/" },
  { name: "Gsmfeed", logo: "/images/logo/gsmfeed-logo.svg", className: "h-7 w-12", url: "https://gsmfeed.com/" },
  { name: "Projectmix", logo: "/images/logo/projectmix-logo.svg", className: "h-10 w-10", url: "https://projectmix.ai/" },
  { name: "Dubai Marina Yachts", logo: "/images/logo/yachts-logo.svg", className: "h-10 w-10", url: "https://dubaimarinayachts.ae/" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function BusinessesSection() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const match = gsap.matchMedia();

    match.add("(prefers-reduced-motion: no-preference)", () => {
      const titleLines = gsap.utils.toArray<HTMLElement>(".businesses-section__title .businesses-reveal-line");
      const titleTween = gsap.fromTo(titleLines,
        { "--bg-progress": 30 },
        {
          "--bg-progress": 100,
          duration: 1.55,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".businesses-section__inner > header", start: "top 95%", toggleActions: "play none none none" },
        },
      );

      const textBlocks = gsap.utils.toArray<HTMLElement>(".businesses-section__kicker, .businesses-section__copy > p");
      const splits = textBlocks.map((block, index) => SplitText.create(block, {
        type: "lines",
        linesClass: "businesses-reveal-line",
        autoSplit: true,
        aria: "auto",
        onSplit: (split) => gsap.fromTo(split.lines,
          { "--bg-progress": 30 },
          {
            "--bg-progress": 100,
            duration: 1.55,
            delay: index === 0 ? 0.16 : (index - 1) * 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: index === 0 ? ".businesses-section__inner > header" : ".businesses-section__copy",
              start: "top 95%",
              toggleActions: "play none none none",
            },
          },
        ),
      }));

      return () => {
        titleTween.kill();
        splits.forEach((split) => split.revert());
      };
    });

    return () => match.revert();
  }, { scope: section });

  return (
    <section ref={section} id="businesses" data-header-theme="dark" className="businesses-section" aria-labelledby="businesses-title">
      <div className="container businesses-section__inner">
        <header className="text-center">
          <h2 id="businesses-title" className="businesses-section__title">
            <span><span className="businesses-reveal-line">One Vision.</span></span>
            <span><span className="businesses-reveal-line">Multiple Businesses.</span></span>
          </h2>
          <p className="businesses-section__kicker">Different industries. One entrepreneurial mindset.</p>
        </header>

        <nav className="businesses-section__logos" aria-label="Gholzad businesses">
          {businesses.map((business, index) => (
            <motion.a
              key={business.name}
              href={business.url}
              target="_blank"
              rel="noreferrer"
              className="businesses-section__business"
              aria-label={`Visit ${business.name} website`}
              initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.75 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease }}
            >
              <div className="businesses-section__logo">
                <Image src={business.logo} alt="" width={64} height={64} className={`object-contain ${business.className}`} />
              </div>
              <h3>{business.name}</h3>
            </motion.a>
          ))}
        </nav>

        <div className="businesses-section__copy">
          <p>Gholzad is a growing group of businesses built around a simple idea: create useful businesses that solve real problems.</p>
          <p>Each company operates in a different space, but they share the same foundation — practical experience, technology, international relationships and a strong focus on long-term growth.</p>
          <p>From moving products across borders to building technology for global traders, every venture is part of a bigger journey.</p>
        </div>
      </div>
    </section>
  );
}
