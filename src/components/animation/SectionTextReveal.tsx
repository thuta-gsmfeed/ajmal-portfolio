"use client";

import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textParallax } from "@/components/animation/textParallax";

export function SectionTextReveal({ rootId }: { rootId: string }) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      observer.disconnect();
    }, { rootMargin: "600px 0px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootId]);

  useGSAP(() => {
    if (!near) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const root = document.getElementById(rootId);
      if (!root) return;
      const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-gradient-reveal]"))
        .filter((block) => block.getClientRects().length > 0);

      const targets = [...new Set(blocks.map((block) => context.conditions?.mobile
        ? block.closest<HTMLElement>("[data-mobile-reveal-group]") ?? block
        : block))];
      const animations = targets.map((block) => textParallax(block, block));
      return () => animations.forEach((animation) => animation.kill());
    });

    return () => media.revert();
  }, { dependencies: [near, rootId], revertOnUpdate: true });

  return null;
}
