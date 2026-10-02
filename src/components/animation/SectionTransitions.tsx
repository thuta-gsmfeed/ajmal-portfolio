"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Refresh measurements after media settles. Section roots stay untransformed. */
export function SectionTransitions() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browser chrome changes viewport height while the page is scrolling.
    ScrollTrigger.config({ ignoreMobileResize: true });
    let frame = 0;
    let refreshTimer = 0;
    let disposed = false;
    let refreshPending = false;
    const flushRefresh = () => {
      if (disposed || !refreshPending || ScrollTrigger.isScrolling()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || ScrollTrigger.isScrolling()) return;
        refreshPending = false;
        ScrollTrigger.refresh();
      });
    };
    const refresh = () => {
      if (disposed) return;
      refreshPending = true;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(flushRefresh, 120);
    };
    const onLoad = (event: Event) => { if (event.target instanceof HTMLImageElement && event.target.closest("main")) refresh(); };
    document.fonts.ready.then(refresh);
    document.addEventListener("load", onLoad, true);
    window.addEventListener("pageshow", refresh);
    ScrollTrigger.addEventListener("scrollEnd", flushRefresh);
    return () => { disposed = true; window.clearTimeout(refreshTimer); cancelAnimationFrame(frame); document.removeEventListener("load", onLoad, true); window.removeEventListener("pageshow", refresh); ScrollTrigger.removeEventListener("scrollEnd", flushRefresh); };
  }, []);
  return null;
}
