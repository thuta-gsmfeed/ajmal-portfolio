"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

const nowFocus = [
  "Scaling verified global trading networks",
  "Building software that simplifies complex operations",
  "Connecting distribution experience with product intelligence",
];

const nextDirection = [
  "Intelligent infrastructure for global trade",
  "Technology products shaped by real operating experience",
  "New ventures at the intersection of AI and international commerce",
];

export function NowNextSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const animate = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches;

      if (!animate) {
        gsap.set([".now-content", ".next-layer", ".next-content", ".future-item"], { clearProps: "all", opacity: 1 });
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(".now-content", { opacity: 1, x: -18 }, { opacity: 1, x: 0, duration: 0.18, ease: "power3.out" }, 0)
        .fromTo(".next-layer", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 48%)", duration: 0.3, ease: "power3.inOut" }, 0.12)
        .fromTo(".next-content", { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 0.2, ease: "power3.out" }, 0.3)
        .to(".now-content", { opacity: 0.14, x: -70, duration: 0.22, ease: "power2.inOut" }, 0.58)
        .to(".next-layer", { clipPath: "inset(0 0 0 0%)", duration: 0.28, ease: "power3.inOut" }, 0.56)
        .fromTo(".future-item", { opacity: 0.35, y: 24 }, { opacity: 1, y: 0, stagger: 0.055, duration: 0.18, ease: "power3.out" }, 0.68);
    },
    { scope: section },
  );

  return (
    <section ref={section} id="next" className="relative overflow-x-clip bg-[#030506] lg:min-h-[155vh]">
      <div className="relative lg:sticky lg:top-0 lg:min-h-screen lg:overflow-hidden">
        <div className="now-content relative min-h-svh bg-[#030506] py-20 lg:flex lg:items-start lg:pb-8 lg:pt-28 2xl:items-center 2xl:py-24">
          <div aria-hidden className="hero-grid absolute inset-0 opacity-20" />
          <div aria-hidden className="absolute right-[8%] top-1/2 text-[clamp(9rem,24vw,24rem)] font-semibold leading-none tracking-[-.1em] text-white/[.025]">NOW</div>
          <div className="grain" />
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <p className="eyebrow">Building now</p>
              <h2 className="section-title mt-6">Turning operating experience into intelligent systems.</h2>
              <p className="section-description mt-6">The current focus is simple: connect stronger markets, remove operational friction, and build technology that compounds real-world advantage.</p>
              <ul className="mt-10 border-t border-white/10">
                {nowFocus.map((item, index) => <li key={item} className="grid grid-cols-[42px_1fr] gap-4 border-b border-white/10 py-5 text-base text-white/68 md:text-lg"><span className="font-mono text-sm text-cyan-200">0{index + 1}</span><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="next-layer relative min-h-svh bg-[#dfe9eb] py-20 text-[#071013] lg:absolute lg:inset-0 lg:flex lg:items-start lg:pb-8 lg:pt-28 2xl:items-center 2xl:py-24">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(0,143,171,.16),transparent_30%),linear-gradient(rgba(7,16,19,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(7,16,19,.045)_1px,transparent_1px)] [background-size:auto,80px_80px,80px_80px]" />
          <div aria-hidden className="absolute right-[3%] top-1/2 -translate-y-1/2 text-[clamp(9rem,24vw,24rem)] font-semibold leading-none tracking-[-.1em] text-black/[.035]">NEXT</div>
          <div className="next-content container relative z-10">
            <div className="ml-auto max-w-3xl lg:max-w-[580px] 2xl:max-w-3xl">
              <p className="eyebrow !text-black/50">The next direction</p>
              <h2 className="section-title mt-6">Building what comes after today&apos;s advantage.</h2>
              <p className="section-description section-description--dark mt-6">The next chapter extends the same foundation—trusted relationships, connected markets, and technology designed around how business actually moves.</p>
              <ul className="mt-10 border-t border-black/15">
                {nextDirection.map((item, index) => <li key={item} className="future-item grid grid-cols-[42px_1fr] gap-4 border-b border-black/15 py-5 text-base text-black/68 md:text-lg"><span className="font-mono text-sm text-cyan-800">0{index + 1}</span><span>{item}</span></li>)}
              </ul>
              <a href="#contact" className="pill mt-8 !border-black/25 bg-[#071013] text-white hover:!bg-cyan-700 hover:!text-white">Build the next chapter <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
