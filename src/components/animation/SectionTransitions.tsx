"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SectionTransitions() {
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main > section");

      sections.slice(1).forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0.7,
            y: 34,
          },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 96%",
              end: "top 72%",
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
