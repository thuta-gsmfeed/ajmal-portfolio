"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, X } from "lucide-react";
import { Product, products } from "@/data/content";

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Product | null>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [80, -100]);
  const product = products[active];

  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - y) * 5);
    rotateY.set((x - 0.5) * 7);
    glowX.set(x * 100);
    glowY.set(y * 100);
  };

  const change = (next: number) => setActive((next + products.length) % products.length);

  return (
    <section ref={sectionRef} id="products" className="relative overflow-hidden bg-[#030506] py-28 md:py-40">
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 size-[780px] -translate-x-1/2 rounded-full bg-cyan-400/[.065] blur-[150px]" />
        <div className="hero-grid absolute inset-0 opacity-25" />
      </motion.div>

      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eyebrow">Vision in action</motion.p>
            <div className="mt-7 overflow-hidden">
              <motion.h2 initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }} className="section-title">Ideas become<br /><span className="text-white/35">working systems.</span></motion.h2>
            </div>
          </div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .15 }} className="max-w-xl text-lg leading-relaxed text-white/55 lg:ml-auto">
            Digital products designed to simplify complex operations, connect international markets, and create practical leverage for growing businesses.
          </motion.p>
        </div>

        <div className="mt-16 border-y border-white/10">
          <div className="flex overflow-x-auto">
            {products.map((item, index) => (
              <button key={item.name} onClick={() => setActive(index)} aria-pressed={active === index} className={`relative min-w-52 flex-1 border-r border-white/10 px-5 py-5 text-left transition last:border-r-0 ${active === index ? "bg-white/[.055] text-white" : "text-white/35 hover:text-white/70"}`}>
                <span className="font-mono text-[9px] uppercase tracking-[.2em]">0{index + 1}</span>
                <span className="mt-2 block text-sm">{item.name}</span>
                {active === index && <motion.span layoutId="product-tab" className="absolute inset-x-0 bottom-0 h-px bg-cyan-200" />}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[740px] py-16 md:py-20">
          <AnimatePresence mode="wait">
            <motion.div key={product.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .42 }} className="grid items-center gap-14 lg:grid-cols-[.72fr_1.28fr]">
              <div className="relative z-10">
                <motion.p initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 }} className="font-mono text-xs uppercase tracking-[.2em] text-cyan-200">0{active + 1} / {product.year}</motion.p>
                <motion.h3 initial={{ opacity: 0, y: 32, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }} className="mt-7 text-[clamp(3.5rem,6vw,7rem)] font-medium leading-[.88] tracking-[-.065em]">{product.name}</motion.h3>
                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="mt-5 text-xs uppercase tracking-[.18em] text-white/40">{product.category}</motion.p>
                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }} className="mt-8 max-w-lg text-lg leading-relaxed text-white/55">{product.description}</motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} className="mt-8 flex flex-wrap gap-2">{product.technology.map((tech) => <span key={tech} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/50">{tech}</span>)}</motion.div>
                <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .36 }} onClick={() => setSelected(product)} className="pill mt-10">Explore the product <ArrowUpRight size={16} /></motion.button>
              </div>

              <motion.div
                data-cursor="View"
                onMouseMove={move}
                onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
                onClick={() => setSelected(product)}
                initial={{ opacity: 0, x: 60, scale: .94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}
                className="relative cursor-pointer [perspective:1400px]"
              >
                <motion.div aria-hidden className="pointer-events-none absolute size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-[100px]" style={{ left: useTransform(glowX, value => `${value}%`), top: useTransform(glowY, value => `${value}%`) }} />
                <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative rounded-[1.75rem] border border-white/20 bg-[#101416] p-2 shadow-[0_40px_100px_rgba(0,0,0,.65)]">
                  <div className="flex h-10 items-center gap-2 border-b border-white/10 px-3"><i className="size-2 rounded-full bg-white/25" /><i className="size-2 rounded-full bg-white/15" /><i className="size-2 rounded-full bg-white/10" /><span className="ml-3 h-4 flex-1 rounded-full bg-white/[.035]" /><span className="font-mono text-[8px] uppercase tracking-[.14em] text-white/25">Live preview</span></div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-b-[1.25rem]"><Image src={product.image.src} alt={product.image.alt} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-cyan-200/10" /></div>
                  <div className="absolute -bottom-5 -right-5 grid size-24 place-items-center rounded-full border border-white/20 bg-black/70 font-mono text-[9px] uppercase tracking-[.16em] text-cyan-100 backdrop-blur-xl">Open<br />system</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div key={`number-${active}`} initial={{ opacity: 0, y: 50 }} animate={{ opacity: .035, y: 0 }} className="pointer-events-none absolute -bottom-12 right-0 -z-10 text-[clamp(14rem,35vw,34rem)] font-semibold leading-none tracking-[-.1em]">0{active + 1}</motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/30">Select a product · Drag your attention</p>
          <div className="flex gap-2"><button onClick={() => change(active - 1)} aria-label="Previous product" className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:bg-white hover:text-black"><ArrowLeft size={16} /></button><button onClick={() => change(active + 1)} aria-label="Next product" className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:bg-white hover:text-black"><ArrowRight size={16} /></button></div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[350] grid place-items-center bg-black/80 p-4 backdrop-blur-xl md:p-8"><motion.div role="dialog" aria-modal="true" aria-label={`${selected.name} overview`} initial={{ opacity: 0, y: 40, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} onClick={event => event.stopPropagation()} className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/20 bg-[#090c0e] p-6 shadow-2xl md:p-10"><button onClick={() => setSelected(null)} aria-label="Close product overview" className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 bg-black/50 transition hover:bg-white hover:text-black"><X size={17} /></button><div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200"><Layers size={14} />Product overview</div><h3 className="mt-6 text-5xl tracking-[-.06em] md:text-7xl">{selected.name}</h3><p className="mt-6 text-lg leading-relaxed text-white/55">{selected.description}</p><div className="mt-7 flex flex-wrap gap-2">{selected.technology.map(tech => <span key={tech} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/50">{tech}</span>)}</div><a href={selected.url} className="pill mt-9">Visit website <ArrowUpRight size={16} /></a></div><div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15"><Image src={selected.image.src} alt={selected.image.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" /></div></div></motion.div></motion.div>}
      </AnimatePresence>
    </section>
  );
}
