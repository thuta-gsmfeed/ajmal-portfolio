"use client";

import { useEffect } from "react";

export function SectionMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-section-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 5% 0px", threshold: 0.01 },
    );

    elements.forEach((element) => observer.observe(element));
    document.documentElement.classList.add("section-motion-ready");

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("section-motion-ready");
    };
  }, []);

  return null;
}
