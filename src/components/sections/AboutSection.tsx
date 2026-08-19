"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const asciiPortrait = `01001101 01000001 01010010 01001011 01000101 01010100
// VISION  EXECUTION  NETWORK  TECHNOLOGY //
00110101 00110011 00110100 00110001 00110100 00111001
BUILD::CONNECT::CREATE::MOVE::LEAD::GROW
▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░
01100111 01101000 01101111 01101100 01111010 01100001 01100100`;

const principles = [
  { number: "01", title: "Build", text: "Turn an ambitious idea into a product people can trust and use." },
  { number: "02", title: "Connect", text: "Create the relationships that help ideas travel across markets." },
  { number: "03", title: "Scale", text: "Use technology and clear systems to make momentum repeatable." },
];

function PortraitDecode() {
  return (
    <div aria-hidden className="about-ascii absolute inset-0 z-[2] overflow-hidden bg-[#030708] text-cyan-100">
      <pre className="absolute inset-0 flex items-center whitespace-pre-wrap break-all p-5 font-mono text-[10px] leading-[1.9] tracking-[.18em] opacity-80 md:p-8 md:text-xs">{asciiPortrait.repeat(7)}</pre>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_48%,rgba(104,231,255,.16)_50%,transparent_52%)] bg-[length:100%_9px]" />
      <div className="absolute inset-y-0 left-0 w-px bg-cyan-100 shadow-[0_0_24px_rgba(104,231,255,.9)]" />
    </div>
  );
}

function StatStrip() {
  return (
    <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="about-stat px-3 py-4 text-center md:py-5">
        <strong className="block text-lg font-medium text-white md:text-2xl"><AnimatedCounter value={15} suffix="+" /></strong>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[.12em] text-white/42">Years</span>
      </div>
      <div className="about-stat px-3 py-4 text-center md:py-5">
        <strong className="block text-lg font-medium text-cyan-100 md:text-2xl">$<AnimatedCounter value={100} suffix="M+" /></strong>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[.12em] text-white/42">Sales</span>
      </div>
      <div className="about-stat px-3 py-4 text-center md:py-5">
        <strong className="block text-lg font-medium text-white md:text-2xl">Global</strong>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[.12em] text-white/42">Network</span>
      </div>
    </div>
  );
}

export function AboutSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(".about-ascii", { clipPath: "inset(100% 0 0 0)" });
      gsap.set([".about-reveal", ".about-principle", ".about-stat"], { opacity: 1, y: 0 });
      return;
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: "top 76%",
        end: "top 18%",
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .fromTo(".about-photo", { scale: 1.08 }, { scale: 1, duration: 1, ease: "none" }, 0)
      .fromTo(".about-ascii", { clipPath: "inset(0% 0 0 0)" }, { clipPath: "inset(100% 0 0 0)", duration: 0.78, ease: "power2.inOut" }, 0.04)
      .fromTo(".about-reveal", { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.36, ease: "power2.out" }, 0.36)
      .fromTo(".about-principle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.32, ease: "power2.out" }, 0.54)
      .fromTo(".about-stat", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.28, ease: "power2.out" }, 0.62);
  }, { scope: section });

  return (
    <section ref={section} id="about" className="overflow-hidden py-20 md:py-40">
      <div className="container">
        <div className="mb-9 flex items-center justify-between border-b border-white/10 pb-5 md:mb-16">
          <p className="eyebrow">About me</p>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/36 md:text-xs">Since 2009 · Global</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="image-wrap relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#071013] shadow-[0_32px_100px_rgba(0,0,0,.38)]">
              <Image src={media.portrait.src} alt={media.portrait.alt} fill sizes="(max-width:1023px) calc(100vw - 28px), 38vw" className="about-photo object-cover object-top" />
              <PortraitDecode />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/12" />
              <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/35 px-3 py-2 font-mono text-[9px] uppercase tracking-[.16em] text-white/65 backdrop-blur-md md:left-6 md:top-6 md:text-[10px]">Founder · Operator</div>
              <div className="absolute inset-x-0 bottom-0 z-10"><StatStrip /></div>
            </div>
          </div>

          <div className="lg:pt-8">
            <p className="about-reveal font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200 md:text-xs">Entrepreneur · Technologist · Connector</p>
            <h2 className="about-reveal mt-5 max-w-[11ch] text-[clamp(2.8rem,6.1vw,6.8rem)] font-medium leading-[.92] tracking-[-.055em] text-white">I build ideas that move across markets.</h2>

            <p className="about-reveal mt-7 max-w-3xl text-lg font-light leading-8 text-white/76 md:mt-10 md:text-2xl md:leading-[1.45]">
              Since 2009, I&apos;ve built businesses across marketing, iPhone distribution, e-commerce, affiliate marketing, and AI software—turning complex opportunities into clear, scalable ventures.
            </p>

            <div className="about-reveal relative mt-8 overflow-hidden rounded-2xl border border-cyan-200/20 bg-cyan-100/[.045] p-6 md:mt-10 md:p-8">
              <div aria-hidden className="absolute -right-12 -top-16 size-44 rounded-full bg-cyan-300/10 blur-3xl" />
              <p className="relative font-mono text-[10px] uppercase tracking-[.16em] text-cyan-200/70">Operating principle</p>
              <blockquote className="relative mt-4 max-w-2xl text-xl font-light leading-snug text-cyan-50 md:text-3xl">“Make the complex clear—then build the system that keeps it moving.”</blockquote>
            </div>

            <div className="mt-10 grid border-y border-white/10 sm:grid-cols-3 md:mt-14">
              {principles.map((principle) => (
                <article key={principle.number} className="about-principle border-b border-white/10 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
                  <span className="font-mono text-[10px] text-cyan-200/65">{principle.number}</span>
                  <h3 className="mt-4 text-xl font-medium text-white">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">{principle.text}</p>
                </article>
              ))}
            </div>

            <details className="group mt-8 border-b border-white/10 md:mt-10">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-mono text-xs uppercase tracking-[.14em] text-white/58 transition-colors marker:content-none hover:text-cyan-100">
                The longer story
                <span className="grid size-9 place-items-center rounded-full border border-white/15 text-cyan-200 transition-transform duration-300 group-open:rotate-180"><ChevronDown aria-hidden size={14} /></span>
              </summary>
              <div className="max-w-3xl space-y-5 pb-8 text-base leading-8 text-white/58 md:text-lg">
                <p>My strength lies in transforming creativity into technology, with a focus on applying AI solutions effectively.</p>
                <p>I&apos;ve developed a network across the US, Europe, the Middle East, Hong Kong, and China—building trusted relationships in each market.</p>
                <p>After more than 15 years in entrepreneurship and online business, I still find the most energy in collaborating with ambitious professionals and turning shared ideas into measurable progress.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
