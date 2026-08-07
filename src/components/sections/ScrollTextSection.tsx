"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const words = "I build businesses that connect people, products, markets, and technology.".split(" ");
const accentWords = new Set(["connect", "products,", "markets,", "technology."]);

export function ScrollTextSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const wordElements = gsap.utils.toArray<HTMLElement>(".fill-word");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(wordElements, { color: "#f3f6f7", opacity: 1 });
        return;
      }

      gsap.set(wordElements, { color: "rgba(243,246,247,.13)", opacity: 0.72 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      timeline.fromTo(".manifesto-light", { xPercent: -42, opacity: 0.2 }, { xPercent: 42, opacity: 0.7, duration: 1, ease: "none" }, 0);

      wordElements.forEach((word, index) => {
        const accent = word.dataset.accent === "true";
        timeline.to(
          word,
          {
            color: accent ? "#9aeeff" : "#f3f6f7",
            opacity: 1,
            textShadow: accent ? "0 0 34px rgba(104,231,255,.2)" : "0 0 0 rgba(0,0,0,0)",
            duration: 0.14,
            ease: "power1.inOut",
          },
          0.06 + index * 0.068,
        );
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative min-h-[180vh] overflow-clip bg-[#030506]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-28">
        <div aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div aria-hidden className="manifesto-light absolute left-1/2 top-1/2 h-[70vh] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.07] blur-[110px]" />
        <div className="grain" />

        <div className="container relative z-10">
          <div className="mb-14 flex items-center justify-between border-b border-white/10 pb-5">
            <p className="eyebrow">A connected vision</p>
            <p className="hidden font-mono text-sm uppercase tracking-[.12em] text-white/35 md:block">Scroll to reveal</p>
          </div>

          <p className="section-title max-w-[1280px]" aria-label={words.join(" ")}>
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                aria-hidden
                data-accent={accentWords.has(word)}
                className="fill-word mr-[.2em] inline-block will-change-[color,opacity]"
              >
                {word}
              </span>
            ))}
          </p>

        </div>
      </div>
    </section>
  );
}
