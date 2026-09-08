"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Refresh measurements after media settles. Section roots stay untransformed. */
export function SectionTransitions() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let frame = 0;
    let refreshTimer = 0;
    let disposed = false;
    const refresh = () => {
      if (disposed) return;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 120);
    };
    const onLoad = (event: Event) => { if (event.target instanceof HTMLImageElement && event.target.closest("main")) refresh(); };
    document.fonts.ready.then(refresh);
    document.addEventListener("load", onLoad, true);
    window.addEventListener("pageshow", refresh);
    return () => { disposed = true; window.clearTimeout(refreshTimer); cancelAnimationFrame(frame); document.removeEventListener("load", onLoad, true); window.removeEventListener("pageshow", refresh); };
  }, []);
  return null;
}
