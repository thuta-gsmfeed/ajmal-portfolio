"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionTitle } from "@/components/ui/SectionTitle";

const profile = [
  ["Based in", "Dubai · Europe"],
  ["Markets", "US · Europe · Middle East · Asia"],
  ["Focus", "Technology · Commerce · Distribution"],
];

export function AboutSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [".about-frame", ".about-copy", ".about-detail", ".about-stat"];

    if (reduceMotion) {
      gsap.set(targets, { clearProps: "all", opacity: 1, x: 0, y: 0, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(".about-rule", { scaleX: 1 });
      gsap.set(".about-scan", { opacity: 0 });
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section.current,
        start: "top 68%",
        toggleActions: "play none none reverse",
      },
    });

    timeline
      .fromTo(".about-frame", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power3.inOut" }, 0)
      .fromTo(".about-photo", { scale: 1.08 }, { scale: 1, duration: 1.35, ease: "power2.out" }, 0.08)
      .fromTo(".about-scan", { xPercent: -115, opacity: 0 }, { xPercent: 115, opacity: 0.7, duration: 1.05, ease: "power2.inOut" }, 0.1)
      .to(".about-scan", { opacity: 0, duration: 0.2 }, 1.02)
      .fromTo(".about-copy", { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.09, duration: 0.62 }, 0.28)
      .fromTo(".about-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 0.4)
      .fromTo(".about-detail", { opacity: 0, x: 18 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.48 }, 0.55)
      .fromTo(".about-stat", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.45 }, 0.72);
  }, { scope: section });

  return (
    <section ref={section} id="about" className="overflow-hidden py-20 md:py-40">
      <div className="container">
        <SectionTitle
          kicker="About me"
          title="Ideas into enduring businesses."
          body="An entrepreneur and technology founder building products, partnerships, and distribution networks across international markets."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#080b0c] md:mt-20">
          <div className="grid lg:grid-cols-12">
            <div className="about-frame relative min-h-[430px] overflow-hidden border-b border-white/10 sm:min-h-[560px] lg:col-span-5 lg:min-h-[650px] lg:border-b-0 lg:border-r">
              <Image
                src={media.portrait.src}
                alt={media.portrait.alt}
                fill
                sizes="(max-width:1023px) calc(100vw - 28px), 42vw"
                className="about-photo object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
              <div aria-hidden className="about-scan absolute inset-y-0 left-1/2 w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/25 to-transparent blur-xl" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 md:inset-x-7 md:bottom-7">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-100/75">Ajmal Gholzad</p>
                  <p className="mt-1 text-sm text-white/58">Founder · Entrepreneur · Technologist</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/20 bg-black/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[.13em] text-white/55 backdrop-blur-md">Since 2009</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-9 lg:col-span-7 lg:p-12 xl:p-16">
              <div>
                <div className="about-copy flex items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[.16em] text-white/35">
                  <span>Profile / 01</span>
                  <span>Build · Connect · Scale</span>
                </div>

                <p className="about-copy mt-8 max-w-2xl text-[clamp(1.45rem,2.2vw,2.25rem)] font-light leading-[1.35] tracking-[-.02em] text-white/88 md:mt-12">
                  I&apos;ve spent more than 15 years turning opportunities into operating businesses—from marketing and iPhone distribution to e-commerce and AI software.
                </p>

                <blockquote className="about-copy mt-8 border-l border-cyan-200/55 pl-5 text-base leading-7 text-cyan-50/70 md:mt-10 md:max-w-xl md:text-lg md:leading-8">
                  Clear thinking, trusted relationships, and consistent execution turn complexity into progress.
                </blockquote>

                <div className="mt-10 md:mt-14">
                  <div className="about-rule h-px origin-left bg-white/12" />
                  {profile.map(([label, value]) => (
                    <div key={label} className="about-detail grid gap-2 border-b border-white/10 py-4 sm:grid-cols-[120px_1fr] sm:items-center md:py-5">
                      <span className="font-mono text-[10px] uppercase tracking-[.14em] text-white/32">{label}</span>
                      <span className="text-sm leading-6 text-white/68 md:text-base">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 bg-black/25">
            <div className="about-stat border-r border-white/10 px-3 py-5 text-center md:py-7">
              <strong className="block text-xl font-medium text-white md:text-3xl"><AnimatedCounter value={15} suffix="+" /></strong>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[.13em] text-white/35 md:text-[10px]">Years</span>
            </div>
            <div className="about-stat border-r border-white/10 px-3 py-5 text-center md:py-7">
              <strong className="block text-xl font-medium text-cyan-100 md:text-3xl">$<AnimatedCounter value={100} suffix="M+" /></strong>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[.13em] text-white/35 md:text-[10px]">Sales</span>
            </div>
            <div className="about-stat px-3 py-5 text-center md:py-7">
              <strong className="block text-xl font-medium text-white md:text-3xl">Global</strong>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[.13em] text-white/35 md:text-[10px]">Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
