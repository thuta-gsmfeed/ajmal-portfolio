"use client";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION } from "./motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(DESKTOP_MOTION, () => {
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      const update = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);
      const navigateToSection = (event: Event) => {
        const request = event as CustomEvent<{ top: number }>;
        if (!Number.isFinite(request.detail?.top)) return;
        event.preventDefault();
        const distance = Math.abs(request.detail.top - lenis.scroll);
        lenis.scrollTo(request.detail.top, {
          duration: Math.min(1.6, 0.7 + distance / 7000),
          lock: true,
        });
      };
      gsap.ticker.lagSmoothing(0);
      const syncVisibility = () => {
        if (document.hidden) {
          lenis.stop();
          gsap.ticker.remove(tick);
        } else {
          lenis.start();
          gsap.ticker.add(tick);
        }
      };
      lenis.on("scroll", update);
      window.addEventListener("portfolio:scroll-to-section", navigateToSection);
      gsap.ticker.add(tick);
      lenis.start();
      document.addEventListener("visibilitychange", syncVisibility);
      return () => { document.removeEventListener("visibilitychange", syncVisibility); window.removeEventListener("portfolio:scroll-to-section", navigateToSection); lenis.off("scroll", update); gsap.ticker.remove(tick); lenis.destroy(); };
    });
    let timer = 0;
    const settleHash = () => {
      let hash = "";
      try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      if (!hash) return;
      const target = document.getElementById(hash);
      if (target) window.scrollTo({ top: Math.max(0, scrollY + target.getBoundingClientRect().top - 82), behavior: "instant" });
    };
    timer = window.setTimeout(settleHash, 350);
    window.addEventListener("hashchange", settleHash);
    return () => { clearTimeout(timer); window.removeEventListener("hashchange", settleHash); media.revert(); };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
