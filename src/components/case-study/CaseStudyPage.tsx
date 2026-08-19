"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Share2 } from "lucide-react";
import { Product, products } from "@/data/content";
import { CinematicLink } from "@/components/navigation/CinematicLink";
import { ContextCursor } from "@/components/ui/ContextCursor";

export function CaseStudyPage({ product }: { product: Product }) {
  const [shared, setShared] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const mediaScale = useTransform(scrollYProgress, [0, 0.35], [1, reducedMotion ? 1 : 1.08]);
  const mediaY = useTransform(scrollYProgress, [0, 0.35], [0, reducedMotion ? 0 : 90]);
  const next = products[(products.findIndex((item) => item.slug === product.slug) + 1) % products.length];

  const share = async () => {
    const data = { title: `${product.name} Case Study`, text: product.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch { /* share sheet dismissed */ }
  };

  return (
    <main data-soundscape="technology" className="min-h-screen overflow-hidden bg-[#030506] text-white">
      <ContextCursor />
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-7">
        <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between rounded-full border border-white/12 bg-black/55 px-3 backdrop-blur-xl md:h-16 md:px-5">
          <CinematicLink href="/#products" ariaLabel="Back to products" className="group inline-flex items-center gap-3 text-sm text-white/65 transition-colors hover:text-white">
            <span className="grid size-9 place-items-center rounded-full border border-white/15 transition-transform group-hover:-translate-x-1"><ArrowLeft size={15} /></span>
            <span className="hidden font-mono uppercase tracking-[.1em] sm:block">Back to portfolio</span>
          </CinematicLink>
          <Image src={product.logo} alt={`${product.name} logo`} width={120} height={44} className="h-8 w-auto max-w-[108px] object-contain" />
          <button type="button" onClick={share} aria-label={`Share ${product.name} case study`} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/12 px-3 font-mono text-[10px] uppercase tracking-[.1em] text-white/55 transition-colors hover:border-cyan-200/35 hover:text-cyan-100">
            {shared ? <Check size={13} /> : <Share2 size={13} />}<span className="hidden sm:inline">{shared ? "Copied" : "Share"}</span>
          </button>
        </div>
        <div className="mx-auto mt-2 h-px max-w-[1340px] overflow-hidden bg-white/8"><motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-cyan-200" /></div>
      </div>

      <section className="relative min-h-[110svh] overflow-hidden">
        <motion.div style={{ scale: mediaScale, y: mediaY }} className="absolute inset-0">
          <video autoPlay={!reducedMotion} muted loop playsInline preload="metadata" className="size-full object-cover opacity-55">
            <source src={product.video.webm} type="video/webm" />
            <source src={product.video.mp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,6,.94)_0%,rgba(3,5,6,.66)_48%,rgba(3,5,6,.22)_100%),linear-gradient(0deg,#030506_0%,transparent_50%,rgba(3,5,6,.3)_100%)]" />
        </motion.div>
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="grain" />

        <div className="container relative z-10 flex min-h-[110svh] items-end pb-20 pt-32 md:pb-24">
          <div className="max-w-5xl">
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="eyebrow">{product.category}</motion.p>
            <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="mt-7 text-[clamp(3.6rem,10vw,9.5rem)] font-medium leading-[.85] tracking-[-.065em]">{product.name}</motion.h1>
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.75 }} className="mt-8 max-w-3xl text-[clamp(1.35rem,2.4vw,2.4rem)] leading-tight text-white/80">{product.tagline}</motion.p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#070a0b] py-16 md:py-24">
        <div className="container grid gap-8 md:grid-cols-3">
          {product.metrics.map((metric, index) => (
            <motion.div key={metric.label} initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ delay: index * 0.08, duration: 0.65 }} className="border-l border-cyan-200/35 pl-5">
              <strong className="block text-[clamp(2.5rem,5vw,5.5rem)] font-medium leading-none tracking-[-.05em] text-cyan-100">{metric.value}</strong>
              <span className="mt-3 block font-mono text-sm uppercase tracking-[.12em] text-white/40">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-40">
        <div className="container grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="eyebrow">The platform</p>
            <h2 className="section-title mt-7">Built to turn complexity into momentum.</h2>
            <a data-cursor="VISIT" href={product.url} target="_blank" rel="noreferrer" className="pill mt-9">Visit {product.name}<ArrowUpRight size={16} /></a>
          </div>
          <div>
            <p className="text-[clamp(1.35rem,2.5vw,2.3rem)] font-light leading-snug text-white/86">{product.description}</p>
            <div className="mt-10 space-y-7 border-t border-white/10 pt-9 text-base leading-8 text-white/58 md:text-lg">
              {product.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {product.features && (
              <div className="mt-14 grid gap-4 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <motion.article key={feature.title} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
                    <span className="font-mono text-sm text-cyan-200">0{index + 1}</span>
                    <h3 className="mt-5 text-xl font-medium">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/48">{feature.description}</p>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#dfe9eb] py-20 text-[#071013] md:py-28">
        <div className="container">
          <p className="font-mono text-sm uppercase tracking-[.13em] text-black/45">Next case study</p>
          <CinematicLink href={`/work/${next.slug}`} className="group mt-5 flex items-end justify-between gap-7 border-b border-black/20 pb-8">
            <span className="text-[clamp(3rem,9vw,9rem)] font-medium leading-none tracking-[-.06em]">{next.name}</span>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-black/25 transition-transform duration-500 group-hover:rotate-45 group-hover:bg-black group-hover:text-white md:size-20"><ArrowUpRight /></span>
          </CinematicLink>
        </div>
      </section>
    </main>
  );
}
