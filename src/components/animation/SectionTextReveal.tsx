"use client";

import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

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
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();

    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const root = document.getElementById(rootId);
      if (!root) return;
      const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-gradient-reveal]"))
        .filter((block) => block.getClientRects().length > 0);

      const cleanups = blocks.map((block, index) => {
        const mode = block.dataset.gradientReveal;
        let animation: gsap.core.Tween | undefined;
        const timing = {
          duration: mode === "clip" ? 1.1 : 1.55,
          delay: Math.min(index * 0.035, 0.14),
          ease: "none",
          scrollTrigger: {
            trigger: index === 0 ? root : block,
            start: index === 0 ? "top bottom" : "top 110%",
            toggleActions: "play none none none",
          },
        };

        if (mode === "clip") {
          animation = gsap.fromTo(block, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ...timing });
          return () => animation?.kill();
        }

        if (mode === "static") {
          animation = gsap.fromTo(block, { "--bg-progress": 30 }, { "--bg-progress": 100, ...timing });
          return () => animation?.kill();
        }

        const split = SplitText.create(block, {
          type: "lines",
          linesClass: "section-gradient-reveal-line",
          autoSplit: true,
          aria: "auto",
          onSplit: (result) => {
            animation?.kill();
            animation = gsap.fromTo(result.lines, { "--bg-progress": 30 }, { "--bg-progress": 100, ...timing });
            return animation;
          },
        });
        return () => { animation?.kill(); split.revert(); };
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    });

    return () => media.revert();
  }, { dependencies: [near, rootId], revertOnUpdate: true });

  return null;
}
