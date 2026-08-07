"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SectionTransitions() {
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = matchMedia("(max-width: 767px)").matches;
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main > section");

      sections.slice(1).forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: isMobile ? 0.72 : 0.48,
            filter: `blur(${isMobile ? 4 : 10}px)`,
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 96%",
              end: "top 68%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.fromTo(
          section,
          { "--section-edge-opacity": 0 } as gsap.TweenVars,
          {
            "--section-edge-opacity": 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "top 72%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          } as gsap.TweenVars,
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => context.revert();
  }, []);

  return null;
}
