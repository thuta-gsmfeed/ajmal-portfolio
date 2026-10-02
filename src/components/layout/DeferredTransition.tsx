"use client";

import { useEffect, useRef } from "react";

/** Delay offscreen mobile background downloads without changing their layout. */
export function DeferredTransition({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-media-ready");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("is-media-ready");
      observer.disconnect();
    }, { rootMargin: "1200px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`deferred-transition ${className}`} aria-hidden="true" />;
}
