"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, X } from "lucide-react";
import { Product, products } from "@/data/content";
import { CinematicLink } from "@/components/navigation/CinematicLink";

const GSMFEED_APP_STORE_URL = "https://apps.apple.com/us/app/gsmfeed/id6759554515";
const GSMFEED_APP_ASSET_ROOT = "/images/content/everything-u-need";
const gsmfeedAppScreens = [
  { name: "Trading Feed", image: "Tradingfeed.png" },
  { name: "Marketplace", image: "marketplace.png" },
  { name: "Trade Alerts", image: "Alert.png" },
] as const;

const productHeadingLines = [
  { words: ["Building", "the", "systems"], outline: false },
  { words: ["that", "move", "markets."], outline: true },
] as const;

function AnimatedProductsHeading() {
  return (
    <h2 aria-label="Building the systems that move markets.">
      {productHeadingLines.map((line) => (
        <span key={line.words.join("-")} className={`featured-products__heading-line ${line.outline ? "featured-products__heading-line--outline" : ""}`} aria-hidden="true">
          {line.words.map((word) => (
            <span key={word} className="featured-products__heading-clip">
              <span className="featured-products__heading-word">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

function ProductTitle({ product, className }: { product: Product; className: string }) {
  if (product.slug === "gsmfeed") {
    return (
      <h3 className={`${className} featured-product__gsmfeed-lockup`}>
        <Image className="featured-product__gsmfeed-symbol" src="/images/logo/gsmfeed-logo.svg" alt="" width={40} height={19} />
        <Image className="featured-product__gsmfeed-wordmark" src="/images/logo/gsmfeed-full-logo.png" alt="gsmfeed logo" width={294} height={75} />
      </h3>
    );
  }

  const fullLogo = product.slug === "coolmix"
    ? { src: "/images/logo/logo-white.svg", width: 411, height: 88 }
    : product.slug === "projectmix"
      ? { src: "/images/logo/projectfulllogo.svg", width: 523, height: 106 }
      : null;

  if (fullLogo) {
    return (
      <h3 className={className}>
        <Image
          src={fullLogo.src}
          alt={`${product.name} logo`}
          width={fullLogo.width}
          height={fullLogo.height}
          className={`featured-product__full-logo featured-product__full-logo--${product.slug}`}
        />
      </h3>
    );
  }

  return (
    <h3 className={`flex items-center gap-4 ${className}`}>
      <span className="grid h-11 min-w-10 shrink-0 place-items-center md:h-12 md:min-w-11">
        <Image src={product.logo} alt="" width={116} height={106} className="h-9 w-auto max-w-[76px] object-contain md:h-10 md:max-w-[86px]" />
      </span>
      <span>{product.name}</span>
    </h3>
  );
}

function ProductPreview({ product, compact = false }: { product: Product; compact?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (reducedMotion) {
      element.preload = "metadata";
      element.load();
      element.pause();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (element.preload === "none") { element.preload = "metadata"; element.load(); }
        void element.play().catch(() => undefined);
      }
      else element.pause();
    }, { threshold: 0.2, rootMargin: "180px 0px" });
    observer.observe(element);
    return () => { observer.disconnect(); element.pause(); };
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#090c0e] shadow-[0_35px_90px_rgba(0,0,0,.55)]">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${product.name} product preview`}
        className={`w-full object-cover ${compact ? "aspect-[16/10]" : "aspect-video"}`}
      >
        <source src={product.video.webm} type="video/webm" />
        <source src={product.video.mp4} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-cyan-200/[.08]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 font-mono text-sm uppercase tracking-[.12em] text-white/55">
        <span>{product.name}</span>
        <span>Live product</span>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".featured-products__heading-word", {
        yPercent: 115,
        opacity: 0,
        rotate: 3,
      }, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        stagger: 0.085,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".featured-products__intro",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="products" data-header-theme="dark" className="featured-products">
      <div className="featured-products__glow" aria-hidden="true" />
      <header className="featured-products__intro">
        <p className="eyebrow">Featured products <span className="featured-products__count">/ 03</span></p>
        <AnimatedProductsHeading />
      </header>

      <div className="featured-products__stack">
        {products.map((product, index) => (
          <motion.article
            key={product.name}
            className={`featured-product featured-product--${product.slug}`}
            style={{ top: `calc(72px + ${index * 14}px)` }}
            initial={{ opacity: 0.5, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="featured-product__number" aria-hidden="true">0{index + 1}</span>
            <div className="featured-product__copy">
              <p className="featured-product__meta"><span>0{index + 1}</span><span>{product.category}</span></p>
              <ProductTitle product={product} className="featured-product__title" />
              <p className="featured-product__tagline">{product.tagline}</p>
              <p className="featured-product__description">{product.description}</p>
              <button onClick={() => setSelected(product)} className="featured-product__cta">
                <span>Explore venture</span><ArrowUpRight size={17} />
              </button>
            </div>

            <motion.button
              type="button"
              data-cursor="VIEW"
              onClick={() => setSelected(product)}
              whileHover={{ rotate: -1.2, scale: 1.018 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="featured-product__media"
              aria-label={`Explore ${product.name}`}
            >
              <ProductPreview product={product} compact />
              <span className="featured-product__view">View project</span>
            </motion.button>

            <div className="featured-product__footer" aria-hidden="true">
              <span>Ajmal Gholzad / Ventures</span>
              <span>0{index + 1} — 0{products.length}</span>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, iframe, [tabindex="0"]') ?? []).filter((node) => node.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const frame = requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      opener?.focus({ preventScroll: true });
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[350] grid place-items-center bg-black/90 p-3 md:p-7"
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} overview`}
        data-lenis-prevent
        initial={{ opacity: 0, y: 36, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-6xl touch-pan-y overflow-y-auto overscroll-contain rounded-[1.5rem] border border-white/15 bg-[#090c0e] shadow-2xl [scrollbar-gutter:stable]"
      >
        <button
          onClick={onClose}
          aria-label="Close product overview"
          className="sticky right-4 top-4 z-20 ml-auto mr-4 mt-4 grid size-11 place-items-center rounded-full border border-white/20 bg-black/70 transition hover:bg-white hover:text-black"
        >
          <X size={17} />
        </button>

        <div className="px-6 pb-10 md:px-10 md:pb-12 lg:px-14">
          <div className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">{product.category}</div>
          <ProductTitle product={product} className="mt-4 text-[clamp(2.5rem,5vw,3.125rem)] font-medium leading-[1.08] tracking-[-.025em]" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78 md:text-2xl md:leading-snug">{product.tagline}</p>

          <div className="mt-9 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-base leading-relaxed text-white/65 md:text-lg">{product.description}</p>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-white/52 md:text-base">
                {product.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              {product.features && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h4 className="text-base font-medium tracking-[-.015em] text-white/85">Our platform offers powerful tools like:</h4>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {product.features.map((feature) => (
                      <div key={feature.title} className="border-l border-cyan-200/35 pl-4">
                        <dt className="text-sm font-medium text-cyan-100">{feature.title}</dt>
                        <dd className="mt-1 text-sm leading-relaxed text-white/52">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="mt-9 flex flex-wrap gap-3">
                <CinematicLink href={`/work/${product.slug}`} className="pill bg-white text-black hover:!bg-cyan-100">
                  Explore case study <ArrowUpRight size={15} />
                </CinematicLink>
                <a href={product.url} target="_blank" rel="noreferrer" className="pill">
                  Visit website <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:h-fit">
              {product.youtubeId ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
                  <iframe
                    className="size-full"
                    src={`https://www.youtube.com/embed/${product.youtubeId}`}
                    title={`${product.name} video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <ProductPreview product={product} />
              )}
            </div>
          </div>

          {product.slug === "gsmfeed" && (
            <section className="mt-12 border-t border-white/10 pt-9 md:mt-14 md:pt-11" aria-labelledby="gsmfeed-app-title">
              <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
                <div className="max-w-lg">
                  <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">gsmfeed for iPhone</p>
                  <h3 id="gsmfeed-app-title" className="mt-4 text-[clamp(2rem,4vw,3.125rem)] font-medium leading-[1.04] tracking-[-.04em]">
                    The global market,<br />in your pocket.
                  </h3>
                  <p className="mt-5 text-base leading-relaxed text-white/58 md:text-lg">
                    Follow live opportunities, verified contacts, marketplace activity, and trade alerts from one mobile workspace.
                  </p>
                  <a href={GSMFEED_APP_STORE_URL} target="_blank" rel="noreferrer" className="pill mt-7 bg-white text-black hover:!bg-cyan-100">
                    View on the App Store <ArrowUpRight size={15} />
                  </a>
                </div>

                <div className="-mx-6 overflow-x-auto px-6 pb-3 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10 lg:mx-0 lg:px-0">
                  <div className="flex w-max gap-4 lg:w-full lg:justify-end">
                    {gsmfeedAppScreens.map((screen, index) => (
                      <figure key={screen.name} className={`w-[158px] shrink-0 ${index === 1 ? "lg:-translate-y-5" : ""} md:w-[190px]`}>
                        <div className="relative aspect-[.49/1] overflow-hidden rounded-[2rem] border-[6px] border-black bg-black shadow-[0_26px_65px_rgba(0,0,0,.42)]">
                          <span className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
                          <Image src={`${GSMFEED_APP_ASSET_ROOT}/${screen.image}`} alt={`gsmfeed ${screen.name} mobile screen`} fill sizes="190px" className="object-cover" />
                          <span className="pointer-events-none absolute inset-0 rounded-[1.65rem] ring-1 ring-inset ring-white/15" />
                        </div>
                        <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-[.13em] text-white/45">{screen.name}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
