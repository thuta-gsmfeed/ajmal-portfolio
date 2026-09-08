"use client";

import { useEffect, useRef } from "react";

export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = `${value}${suffix}`;
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const update = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 1100);
        node.textContent = `${Math.round(value * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(update);
      };
      frame = requestAnimationFrame(update);
      observer.disconnect();
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [suffix, value]);

  return <span ref={ref}>0{suffix}</span>;
}
