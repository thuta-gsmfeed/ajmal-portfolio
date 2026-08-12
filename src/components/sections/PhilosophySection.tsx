"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const principles = ["Vision", "Trust", "Consistency", "Execution"];

export function PhilosophySection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) {
        gsap.set(".principle-row", { opacity: 1, x: 0 });
        gsap.set(".philosophy-progress", { scaleX: 1 });
        return;
      }

      const rows = gsap.utils.toArray<HTMLElement>(".principle-row");
      const timeline = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          ".philosophy-intro",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.14 },
        )
        .fromTo(
          ".philosophy-progress",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.82 },
          0.1,
        );

      rows.forEach((row, index) => {
        timeline.fromTo(
          row,
          {
            opacity: 0.12,
            x: index % 2 === 0 ? -70 : 70,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.22,
          },
          0.12 + index * 0.17,
        );
      });

      timeline.fromTo(
        ".philosophy-signoff",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.16 },
        0.78,
      );
    },
    { scope: section },
  );

  return (
    <section ref={section} className="relative min-h-[120svh] bg-[#030506] md:min-h-[170vh]">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-16 md:min-h-screen md:py-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(104,231,255,.07),transparent_46%)]" />
        <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[.07] to-transparent" />
        <div className="grain" />

        <div className="container relative z-10">
          <div className="philosophy-intro mb-8 border-b border-white/10 pb-5 md:mb-10">
            <p className="eyebrow">Philosophy</p>
          </div>

          <blockquote aria-label="Great businesses are built through vision, trust, consistency, and execution.">
            <span className="sr-only">Great businesses are built through vision, trust, consistency, and execution.</span>
            <span aria-hidden className="principles-list block">
              {principles.map((principle, index) => (
                <span
                  key={principle}
                  className="principle-row block will-change-[transform,opacity]"
                >
                  <span className="group relative grid cursor-default grid-cols-[36px_1fr_auto] items-center overflow-hidden border-b border-white/10 py-3 transition-transform duration-500 ease-out before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-cyan-300/[.12] before:via-cyan-200/[.035] before:to-transparent before:transition-transform before:duration-700 before:ease-out hover:translate-x-2 hover:before:scale-x-100 md:grid-cols-[72px_1fr_auto]">
                    <span className="relative z-10 font-mono text-sm tracking-[.14em] text-cyan-200/65 transition-colors duration-500 group-hover:text-cyan-100">0{index + 1}</span>
                    <span className="section-title relative z-10 block text-left uppercase transition-[color,transform,text-shadow] duration-500 ease-out group-hover:translate-x-3 group-hover:text-cyan-100 group-hover:[text-shadow:0_0_32px_rgba(104,231,255,.18)]">{principle}</span>
                    <span className="relative z-10 hidden font-mono text-sm uppercase tracking-[.12em] text-white/40 transition-[color,transform] duration-500 group-hover:-translate-x-2 group-hover:text-white/75 sm:block">
                      {index === 0 && "See beyond"}
                      {index === 1 && "Build together"}
                      {index === 2 && "Keep moving"}
                      {index === 3 && "Make it real"}
                    </span>
                  </span>
                </span>
              ))}
            </span>
          </blockquote>

          <div className="philosophy-signoff mt-7 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div className="h-px overflow-hidden bg-white/10">
              <div className="philosophy-progress h-full origin-left bg-gradient-to-r from-cyan-300 via-cyan-100 to-transparent" />
            </div>
            <p className="font-mono text-sm uppercase tracking-[.14em] text-white/40">Principles into progress</p>
          </div>
        </div>
      </div>
    </section>
  );
}
