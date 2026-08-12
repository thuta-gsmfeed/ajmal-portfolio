"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, X } from "lucide-react";
import { Product, products } from "@/data/content";

function ProductTitle({ product, className }: { product: Product; className: string }) {
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
      element.pause();
      return;
    }

    if (!window.matchMedia("(max-width: 767px)").matches) {
      void element.play().catch(() => undefined);
      return () => element.pause();
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void element.play().catch(() => undefined);
      else element.pause();
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#090c0e] shadow-[0_35px_90px_rgba(0,0,0,.55)]">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${product.name} product preview`}
        className={`w-full object-cover ${compact ? "aspect-[16/10]" : "aspect-video"}`}
      >
        <source src={product.video.webm} type="video/webm" />
        <source src={product.video.mov} type="video/quicktime" />
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
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(products.length - 1) * 100}vw`]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.16], [1, 1, 0.22]);

  useGSAP(
    () => {
      if (!window.matchMedia("(max-width: 767px)").matches) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: mobileStageRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="products" className="relative h-[320svh] bg-[#030506] md:h-auto lg:h-[320vh]">
      <div className="hidden h-screen overflow-hidden lg:sticky lg:top-0 lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_55%,rgba(55,207,232,.075),transparent_34%)]" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-15" />
        <div className="grain" />

        <motion.header
          style={{ opacity: headlineOpacity }}
          className="container absolute inset-x-0 top-[92px] z-20 flex items-end justify-between gap-8 border-b border-white/10 pb-4"
        >
          <div>
            <p className="eyebrow">Featured products</p>
            <h2 className="mt-3 text-[clamp(2.25rem,3.2vw,3.125rem)] font-medium leading-[1.08] tracking-[.005em]">
              Explore Our <span className="text-cyan-200">Vision in Action.</span>
            </h2>
          </div>
        </motion.header>

        <motion.div
          style={{ x: trackX, width: `${products.length * 100}vw` }}
          className="flex h-full pt-[220px]"
        >
          {products.map((product, index) => (
            <article
              key={product.name}
              className="flex h-full w-screen shrink-0 items-center px-[max(24px,calc((100vw-1380px)/2))] pb-28"
            >
              <div className="grid w-full grid-cols-[.82fr_1.18fr] items-center gap-10 xl:gap-16">
                <div className="max-w-xl">
                  <div className="flex items-center gap-4 font-mono text-sm uppercase tracking-[.14em] text-cyan-200">
                    <span>0{index + 1}</span>
                    <span className="h-px w-10 bg-cyan-200/45" />
                    <span>{product.category}</span>
                  </div>
                  <ProductTitle product={product} className="mt-5 text-[clamp(2.5rem,3.25vw,3.125rem)] font-medium leading-[1.08] tracking-[.01em]" />
                  <p className="mt-4 max-w-lg text-[clamp(1.15rem,1.45vw,1.5rem)] leading-snug tracking-[.005em] text-white/78">
                    {product.tagline}
                  </p>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/48 xl:text-base">
                    {product.description}
                  </p>
                  <button onClick={() => setSelected(product)} className="pill mt-7">
                    Read more <ArrowUpRight size={15} />
                  </button>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setSelected(product)}
                  whileHover={{ scale: 1.012 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative w-full max-w-[620px] justify-self-end text-left xl:max-w-[700px]"
                  aria-label={`Read more about ${product.name}`}
                >
                  <div className="absolute -inset-10 rounded-full bg-cyan-300/[.06] blur-[90px]" />
                  <ProductPreview product={product} />
                </motion.button>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#030506] via-[#030506]/95 to-transparent pb-5 pt-12">
          <div className="container">
            <div className="h-px bg-white/10">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-cyan-200" />
            </div>
          </div>
        </div>
      </div>

      <div ref={mobileStageRef} className="h-svh overflow-hidden md:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_62%_55%,rgba(55,207,232,.08),transparent_42%)]" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-15" />
        <div className="grain" />

        <header className="container absolute inset-x-0 top-20 z-20 border-b border-white/10 pb-4">
          <p className="eyebrow">Featured products</p>
          <h2 className="mt-3 text-[2rem] font-medium leading-[1.06] tracking-[.005em]">
            <span className="block">Explore Our</span>
            <span className="block text-cyan-200">Vision in Action.</span>
          </h2>
        </header>

        <motion.div
          style={{ x: trackX, width: `${products.length * 100}vw` }}
          className="flex h-full pt-[190px]"
        >
          {products.map((product) => (
            <article key={`mobile-horizontal-${product.name}`} className="flex h-full w-screen shrink-0 items-center px-3.5 pb-16">
              <div className="w-full">
                <ProductTitle product={product} className="text-[2.15rem] font-medium leading-[1.06] tracking-[.01em]" />
                <button
                  onClick={() => setSelected(product)}
                  className="relative mt-5 block w-full text-left"
                  aria-label={`Read more about ${product.name}`}
                >
                  <ProductPreview product={product} />
                </button>
                <button onClick={() => setSelected(product)} className="pill mt-5">
                  Read more <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="container hidden py-20 md:block lg:hidden">
        <p className="eyebrow">Featured products</p>
        <h2 className="mt-5 text-[clamp(2.25rem,11vw,3.125rem)] font-medium leading-[1.08] tracking-[.005em]">
          Explore Our<br /><span className="text-cyan-200">Vision in Action.</span>
        </h2>
        <div className="mt-12 space-y-16 sm:space-y-20">
          {products.map((product, index) => (
            <article key={product.name}>
              <p className="font-mono text-sm uppercase tracking-[.14em] text-cyan-200">
                0{index + 1} / {product.category}
              </p>
              <ProductTitle product={product} className="mt-4 text-[clamp(2.15rem,9vw,3.125rem)] font-medium leading-[1.08] tracking-[.01em] sm:text-[clamp(2.5rem,12vw,3.125rem)]" />
              <p className="mt-4 text-base leading-relaxed text-white/75 md:text-xl md:leading-snug">{product.tagline}</p>
              <button
                onClick={() => setSelected(product)}
                className="relative mt-6 block w-full text-left sm:mt-7"
                aria-label={`Read more about ${product.name}`}
              >
                <ProductPreview product={product} compact />
              </button>
              <p className="mt-5 text-sm leading-7 text-white/55 sm:leading-relaxed sm:text-white/48 md:text-base">{product.description}</p>
              <button onClick={() => setSelected(product)} className="pill mt-7">
                Read more <ArrowUpRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
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
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} overview`}
        initial={{ opacity: 0, y: 36, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[1.5rem] border border-white/15 bg-[#090c0e] shadow-2xl"
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
          <ProductTitle product={product} className="mt-4 text-[clamp(2.5rem,5vw,3.125rem)] font-medium leading-[1.08] tracking-[.01em]" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/78 md:text-2xl md:leading-snug">{product.tagline}</p>

          <div className="mt-9 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-base leading-relaxed text-white/65 md:text-lg">{product.description}</p>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-white/52 md:text-base">
                {product.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              {product.features && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h4 className="text-sm font-medium text-white/85">Our platform offers powerful tools like:</h4>
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

              <a href={product.url} target="_blank" rel="noreferrer" className="pill mt-9">
                Visit website <ArrowUpRight size={15} />
              </a>
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
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
