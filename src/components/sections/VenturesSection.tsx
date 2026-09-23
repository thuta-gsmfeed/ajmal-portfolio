"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const ventures = [
  {
    name: "Coolmix",
    logo: "/images/logo/coolmix-logo.svg",
    image: "/images/ventures/coolmix.webp",
    imageAlt: "A premium Coolmix inventory of boxed Apple devices",
    title: "Global Mobile Distribution",
    description: "Coolmix is a global mobile trading and distribution company specializing in Apple devices, serving professional buyers across international markets.",
    detail: "From sourcing to quality control and delivery, Coolmix makes global device trading faster and more reliable.",
    url: "https://coolmix.eu/",
  },
  {
    name: "gsmfeed",
    logo: "/images/logo/gsmfeed-logo.svg",
    image: "/images/ventures/gsmfeed.webp",
    imageAlt: "gsmfeed digital trading tools",
    title: "AI-Powered Global Marketplace",
    description: "A global electronics marketplace connecting verified traders, distributors, and retailers through intelligent tools and trusted market data.",
    detail: "Discover products, manage pricing, receive trade alerts, and build valuable international relationships in one platform.",
    url: "https://gsmfeed.com/",
  },
  {
    name: "Projectmix",
    logo: "/images/logo/projectmix-logo.svg",
    image: "/images/ventures/projectmix.webp",
    imageAlt: "Projectmix technology and automation",
    title: "Trading ERP & Automation",
    description: "Projectmix brings customer management, orders, quality control, returns, repairs, and shipping into one streamlined trading workflow.",
    detail: "Automation and machine learning help international trading teams operate with greater speed, visibility, and control.",
    url: "https://projectmix.ai/",
  },
  {
    name: "Dubai Marina Yachts",
    logo: "/images/logo/yachts-logo.svg",
    image: "/images/ventures/yachts.webp",
    imageAlt: "A luxury yacht in Dubai Marina",
    title: "Luxury Yacht Experiences",
    description: "Exclusive yacht rental in Dubai with dedicated crew, tailored packages, and memorable experiences on the Arabian Sea.",
    detail: "Private celebrations, sea adventures, and bespoke hospitality come together in a premium on-water experience.",
    url: "https://dubaimarinayachts.ae/",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function VenturesSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const venture = ventures[active];

  useEffect(() => {
    ventures.forEach(({ image }) => {
      const preload = new window.Image();
      preload.src = image;
    });
  }, []);

  const select = useCallback((next: number) => {
    const normalized = (next + ventures.length) % ventures.length;
    if (normalized === active) return;
    setDirection(normalized === (active + ventures.length - 1) % ventures.length ? -1 : 1);
    setActive(normalized);
  }, [active]);

  return (
    <section
      id="ventures"
      data-header-theme="light"
      className="ventures-showcase"
      aria-labelledby="ventures-title"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") select(active - 1);
        if (event.key === "ArrowRight") select(active + 1);
      }}
    >
      <div className="container ventures-showcase__inner">
        <header className="ventures-showcase__header">
          <h2 id="ventures-title">Our Ventures</h2>
          <p><strong>Businesses built from experience.</strong></p>
          <p>What started with entrepreneurship and commerce has grown into a portfolio of companies serving different markets.</p>
          <p>Today, Gholzad&apos;s ventures bring together global electronics distribution, AI-powered trading, business automation, and luxury experiences.</p>
        </header>

        <div className="ventures-carousel" role="region" aria-roledescription="carousel" aria-label="Gholzad ventures">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`previous-${active}`}
              className="ventures-carousel__ghost ventures-carousel__ghost--left"
              initial={reducedMotion ? false : { opacity: 0, x: direction * 18, scale: 0.985 }}
              animate={{ opacity: 0.22, x: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -14, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease }}
              aria-hidden
            >
              <Image src={ventures[(active + ventures.length - 1) % ventures.length].image} alt="" fill sizes="28vw" className="object-cover" />
            </motion.div>
            <motion.div
              key={`next-${active}`}
              className="ventures-carousel__ghost ventures-carousel__ghost--right"
              initial={reducedMotion ? false : { opacity: 0, x: direction * 18, scale: 0.985 }}
              animate={{ opacity: 0.22, x: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -14, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.58, ease }}
              aria-hidden
            >
              <Image src={ventures[(active + 1) % ventures.length].image} alt="" fill sizes="28vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>

          <button className="ventures-carousel__arrow ventures-carousel__arrow--left" type="button" onClick={() => select(active - 1)} aria-label="Previous venture">
            <ChevronLeft aria-hidden />
          </button>
          <button className="ventures-carousel__arrow ventures-carousel__arrow--right" type="button" onClick={() => select(active + 1)} aria-label="Next venture">
            <ChevronRight aria-hidden />
          </button>

          <AnimatePresence initial={false} mode="sync" custom={direction}>
            <motion.article
              key={venture.name}
              custom={direction}
              variants={{
                enter: (value: number) => ({ opacity: 0, x: reducedMotion ? 0 : value * 38, scale: reducedMotion ? 1 : 0.985, filter: reducedMotion ? "none" : "blur(8px)" }),
                center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
                exit: (value: number) => ({ opacity: 0, x: reducedMotion ? 0 : value * -30, scale: reducedMotion ? 1 : 0.992, filter: reducedMotion ? "none" : "blur(6px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reducedMotion ? 0 : 0.68, ease }}
              className="ventures-carousel__card"
              aria-roledescription="slide"
              aria-label={`${active + 1} of ${ventures.length}: ${venture.name}`}
            >
              <div className="ventures-carousel__image">
                <Image src={venture.image} alt={venture.imageAlt} fill sizes="(max-width: 900px) 92vw, 42vw" className="object-cover" priority={active === 0} />
              </div>
              <div className="ventures-carousel__content">
                <div className="ventures-carousel__brand">
                  <Image src={venture.logo} alt="" width={54} height={54} />
                  <span>{venture.name}</span>
                </div>
                <h3>{venture.title}</h3>
                <p>{venture.description}</p>
                <p>{venture.detail}</p>
                <a href={venture.url} target="_blank" rel="noreferrer">
                  <span>Visit website</span>
                  <ArrowUpRight aria-hidden />
                </a>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="ventures-carousel__pagination" aria-label="Choose a venture">
          {ventures.map((item, index) => (
            <button key={item.name} type="button" onClick={() => select(index)} aria-label={`Show ${item.name}`} aria-current={active === index ? "true" : undefined}>
              <span />
            </button>
          ))}
        </div>
      </div>

      <div className="network-transition ventures-transition--exit" aria-hidden="true" />
    </section>
  );
}
