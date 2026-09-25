"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function VenturesSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const match = gsap.matchMedia();
    match.add("(min-width: 601px) and (prefers-reduced-motion: no-preference)", () => {
      const header = section.current?.querySelector<HTMLElement>(".ventures-showcase__header");
      if (!header) return;

      const blocks = Array.from(header.children) as HTMLElement[];
      const splits = blocks.map((block, index) => SplitText.create(block, {
        type: "lines",
        linesClass: "ventures-reveal-line",
        autoSplit: true,
        aria: "auto",
        onSplit: (split) => gsap.fromTo(split.lines,
          { "--bg-progress": 30 },
          {
            "--bg-progress": 100,
            duration: 1.55,
            delay: index * 0.08,
            ease: "none",
            scrollTrigger: { trigger: header, start: "top 95%", toggleActions: "play none none none" },
          },
        ),
      }));

      return () => splits.forEach((split) => split.revert());
    });
    return () => match.revert();
  }, { scope: section });

  return (
    <section
      ref={section}
      id="ventures"
      data-header-theme="light"
      className="ventures-showcase ventures-showcase--intro"
      aria-labelledby="ventures-title"
    >
      <div className="container ventures-showcase__inner">
        <header className="ventures-showcase__header">
          <h2 id="ventures-title">Our Ventures</h2>
          <p><strong>Businesses built from experience.</strong></p>
          <p>What started with entrepreneurship and commerce has grown into a portfolio of companies serving different markets.</p>
          <p>Today, Gholzad&apos;s ventures bring together global electronics distribution, AI-powered trading, business automation, and luxury experiences.</p>
        </header>
      </div>
    </section>
  );
}
