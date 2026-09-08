"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function useMotionSettings() {
  const [settings, setSettings] = useState({ desktop: false, reduced: true });
  useEffect(() => {
    const desktop = matchMedia(DESKTOP_MOTION);
    const reduced = matchMedia(REDUCED_MOTION);
    const update = () => setSettings({ desktop: desktop.matches, reduced: reduced.matches });
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => { desktop.removeEventListener("change", update); reduced.removeEventListener("change", update); };
  }, []);
  return settings;
}

/** GSAP owns scroll progress; MotionValues deliver updates without React renders. */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, start = "top top", end = "bottom bottom", desktopOnly = true) {
  const progress = useMotionValue(0);
  const settings = useMotionSettings();
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(desktopOnly ? DESKTOP_MOTION : "(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: ref.current, start, end,
        onUpdate: (self) => progress.set(self.progress),
        onRefresh: (self) => progress.set(self.progress),
      });
      return () => progress.set(0);
    });
    return () => media.revert();
  }, { scope: ref, dependencies: [start, end, desktopOnly, settings.desktop, settings.reduced], revertOnUpdate: true });
  return progress;
}

export function useSceneVisibility(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const visible = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Heavy WebGL/Spline scenes mount shortly before entry and release once they
    // move well outside the viewport instead of staying resident for the page lifetime.
    const nearby = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "500px 0px" });
    const update = () => setActive(visible.current && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; update(); });
    nearby.observe(node); observer.observe(node);
    document.addEventListener("visibilitychange", update);
    return () => { nearby.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [ref]);
  return { near, active };
}
