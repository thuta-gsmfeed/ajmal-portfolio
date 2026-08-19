"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({children}:{children:React.ReactNode}) {
  useEffect(()=>{
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const reducedOrMobile = matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches;

    const settleNativeHash = () => {
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - 82), behavior: "auto" });
    };

    if (reducedOrMobile) {
      const timers = [300, 1200].map((delay) => window.setTimeout(settleNativeHash, delay));
      return () => timers.forEach(window.clearTimeout);
    }
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration:1.15, smoothWheel:true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time:number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const timers = hash ? [300, 1200].map((delay) => window.setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) lenis.scrollTo(target, { offset: -82, immediate: true });
    }, delay)) : [];
    return () => { timers.forEach(window.clearTimeout); lenis.off("scroll",onScroll); lenis.destroy(); gsap.ticker.remove(tick); };
  },[]);
  return children;
}
