"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({children}:{children:React.ReactNode}) {
  useEffect(()=>{
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration:1.15, smoothWheel:true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time:number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { lenis.off("scroll",onScroll); lenis.destroy(); gsap.ticker.remove(tick); };
  },[]);
  return children;
}
