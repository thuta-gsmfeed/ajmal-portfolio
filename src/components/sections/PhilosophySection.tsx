"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const steps = [
  { principle: "Vision", action: "Find the signal", description: "Look beyond the obvious, understand where the market is moving, and choose the opportunity that can compound." },
  { principle: "Trust", action: "Build the network", description: "Create durable relationships with partners, customers, and teams before asking the system to scale." },
  { principle: "Consistency", action: "Create the system", description: "Turn repeated decisions into reliable processes, connected tools, and operating rhythm." },
  { principle: "Execution", action: "Scale the outcome", description: "Move with clarity, measure what matters, and transform a strong idea into a business that performs." },
] as const;

export function PhilosophySection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const cards = gsap.utils.toArray<HTMLElement>(".build-card");
      const indexes = gsap.utils.toArray<HTMLElement>(".build-index");
      const animate = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches;

      if (!animate) {
        gsap.set([cards, indexes, ".build-heading", ".build-progress"], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set(cards, { opacity: 0, yPercent: 120, scale: 0.9 });
      gsap.set(cards[0], { opacity: 1, yPercent: 0, scale: 1, rotation: -1.5 });
      gsap.set(indexes, { opacity: 0.28, x: 0 });
      gsap.set(indexes[0], { opacity: 1, x: 8 });

      const timeline = gsap.timeline({
        defaults: { force3D: true },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(".build-heading", { opacity: 1, y: 18 }, { opacity: 1, y: 0, duration: 0.12, ease: "power3.out" }, 0)
        .fromTo(".build-progress", { scaleY: 0 }, { scaleY: 1, duration: 0.88, ease: "none" }, 0.08);

      for (let index = 1; index < cards.length; index += 1) {
        const position = 0.16 + (index - 1) * 0.235;
        timeline
          .to(cards[index - 1], { opacity: 0.13, y: -52, scale: 0.94, rotation: index % 2 === 0 ? -3 : 3, duration: 0.16, ease: "power2.inOut" }, position)
          .fromTo(cards[index], { opacity: 0, yPercent: 118, scale: 0.9, rotation: index % 2 === 0 ? -7 : 7 }, { opacity: 1, yPercent: 0, scale: 1, rotation: index % 2 === 0 ? -1.25 : 1.25, duration: 0.22, ease: "power3.out" }, position + 0.03)
          .to(indexes[index - 1], { opacity: 0.28, x: 0, duration: 0.08 }, position)
          .to(indexes[index], { opacity: 1, x: 8, duration: 0.12, ease: "power2.out" }, position + 0.05);
      }
    },
    { scope: section },
  );

  return (
    <section ref={section} id="process" className="relative overflow-x-clip bg-[#030506] py-20 lg:min-h-[185vh] lg:py-0">
      <div className="relative lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-start lg:overflow-hidden lg:pb-8 lg:pt-28 2xl:items-center 2xl:py-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(104,231,255,.075),transparent_34%)]" />
        <div aria-hidden className="absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/[.08] to-transparent lg:block" />
        <div className="grain" />

        <div className="container relative z-10">
          <div className="build-heading border-b border-white/10 pb-5 lg:hidden">
            <p className="eyebrow">How I build</p>
            <h2 className="section-title mt-6">Principles into<br />progress.</h2>
            <p className="section-description mt-5">A repeatable way to move from an opportunity to a durable, connected business.</p>
          </div>

          <div className="mt-8 grid gap-4 lg:hidden">
            {steps.map((step, index) => (
              <article key={step.principle} className="rounded-2xl border border-white/10 bg-white/[.035] p-6">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.15em] text-cyan-200"><span>0{index + 1}</span><span>{step.principle}</span></div>
                <h3 className="mt-8 text-[clamp(2rem,9vw,3rem)] font-medium leading-[1.05] tracking-[-.04em]">{step.action}</h3>
                <p className="mt-4 text-base leading-7 text-white/55">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="hidden min-h-[560px] grid-cols-[.72fr_1.28fr] items-center gap-16 lg:grid 2xl:min-h-[650px] 2xl:gap-24">
            <div className="build-heading">
              <p className="eyebrow">How I build</p>
              <h2 className="section-title mt-7">Principles into<br />progress.</h2>
              <p className="section-description mt-6">A repeatable way to move from an opportunity to a durable, connected business.</p>

              <div className="relative mt-10 pl-7">
                <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-white/10"><div className="build-progress h-full origin-top bg-cyan-200" /></div>
                <ol className="space-y-5">
                  {steps.map((step, index) => (
                    <li key={step.principle} className="build-index flex items-center gap-4 font-mono text-sm uppercase tracking-[.12em] text-white/55">
                      <span className="text-cyan-200">0{index + 1}</span>
                      <span>{step.principle}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="relative h-[500px] [perspective:1400px] [transform-style:preserve-3d] 2xl:h-[560px]">
              {steps.map((step, index) => (
                <article key={step.principle} className="build-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a0f11] p-8 shadow-[0_45px_120px_rgba(0,0,0,.5)] will-change-[transform,opacity] [backface-visibility:hidden] 2xl:p-14">
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(104,231,255,.12),transparent_30%)]" />
                  <div aria-hidden className="absolute -right-20 -top-28 text-[18rem] font-semibold leading-none tracking-[-.1em] text-white/[.025]">0{index + 1}</div>
                  <div className="relative flex items-center justify-between border-b border-white/10 pb-5 font-mono text-sm uppercase tracking-[.14em]">
                    <span className="text-cyan-200">0{index + 1} / 04</span>
                    <span className="text-white/40">{step.principle}</span>
                  </div>
                  <div className="relative">
                    <p className="font-mono text-sm uppercase tracking-[.15em] text-cyan-200/65">Operating principle</p>
                    <h3 className="mt-5 text-[clamp(3.2rem,5vw,5.5rem)] font-medium leading-[.95] tracking-[-.055em] 2xl:text-[clamp(3.4rem,6vw,6.5rem)]">{step.action}</h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-white/58">{step.description}</p>
                  </div>
                  <div className="relative flex items-center gap-4 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[.14em] text-white/32">
                    <span className="size-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(104,231,255,.7)]" />
                    From principle to progress
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
