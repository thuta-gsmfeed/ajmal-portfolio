"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Layers, X } from "lucide-react";
import { Product, products } from "@/data/content";

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);
  const headlineScale = useTransform(scrollYProgress, [0, .15], [1, .82]);
  const headlineOpacity = useTransform(scrollYProgress, [0, .18], [1, .38]);

  return (
    <section ref={sectionRef} id="products" className="relative bg-[#030506] lg:h-[430vh]">
      <div className="hidden h-screen overflow-hidden lg:sticky lg:top-0 lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_55%,rgba(55,207,232,.09),transparent_32%)]" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="grain" />

        <motion.div style={{ scale: headlineScale, opacity: headlineOpacity, transformOrigin: "left top" }} className="products-sticky-head container absolute inset-x-0 top-20 z-20">
          <p className="eyebrow">Featured products</p>
          <h2 className="products-sticky-title mt-4 text-[clamp(3.2rem,5.4vw,5.8rem)] font-medium leading-[.86] tracking-[-.065em]">
            Explore Our<br /><span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">Vision in Action.</span>
          </h2>
        </motion.div>

        <motion.div style={{ x: trackX }} className="products-horizontal-track flex h-full w-[400vw] pt-[300px]">
          {products.map((product, index) => (
            <article key={product.name} className="products-horizontal-slide flex h-full w-screen shrink-0 items-start px-[max(24px,calc((100vw-1380px)/2))] pb-24">
              <div className="grid w-full grid-cols-[.72fr_1.28fr] items-center gap-12">
                <div>
                  <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[.2em] text-cyan-200"><span>0{index + 1}</span><span className="h-px w-12 bg-cyan-200/50" /><span>{product.year}</span></div>
                  <h3 className="product-stage-title mt-5 text-[clamp(3.2rem,4.8vw,5.5rem)] font-medium leading-[.84] tracking-[-.065em]">{product.name}</h3>
                  <p className="mt-5 text-xs uppercase tracking-[.18em] text-white/35">{product.category}</p>
                  <p className="product-stage-copy mt-6 max-w-lg text-base leading-relaxed text-white/55 xl:text-lg">{product.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">{product.technology.map(tech => <span key={tech} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/45">{tech}</span>)}</div>
                  <button onClick={() => setSelected(product)} className="pill mt-9">Explore product <ArrowUpRight size={16} /></button>
                </div>

                <motion.button
                  type="button"
                  data-cursor="Open"
                  onClick={() => setSelected(product)}
                  whileHover={{ scale: 1.018, rotateY: -1.2, rotateX: .8 }}
                  transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}
                  className="product-preview group relative w-full max-w-[820px] justify-self-end text-left [perspective:1400px]"
                >
                  <div className="absolute -inset-12 rounded-full bg-cyan-300/[.075] blur-[100px]" />
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#101416] p-2 shadow-[0_45px_110px_rgba(0,0,0,.72)]">
                    <div className="flex h-10 items-center gap-2 border-b border-white/10 px-3"><i className="size-2 rounded-full bg-white/25" /><i className="size-2 rounded-full bg-white/15" /><i className="size-2 rounded-full bg-white/10" /><span className="ml-3 h-4 flex-1 rounded-full bg-white/[.035]" /><span className="font-mono text-[8px] uppercase tracking-[.15em] text-white/25">Live preview</span></div>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-b-[1.25rem]"><Image src={product.image.src} alt={product.image.alt} fill sizes="62vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-cyan-200/10" /></div>
                  </div>
                  <div className="absolute -bottom-5 -right-5 grid size-24 place-items-center rounded-full border border-white/20 bg-black/75 text-center font-mono text-[8px] uppercase tracking-[.16em] text-cyan-100 backdrop-blur-xl">View<br />case study</div>
                </motion.button>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#030506] via-[#030506]/90 to-transparent pb-6 pt-16">
          <div className="container">
            <div className="mb-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[.18em] text-white/30"><span className="flex items-center gap-2"><ArrowDown size={12} />Scroll to move horizontally</span><span>04 projects · One vision</span></div>
            <div className="h-px bg-white/10"><motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-cyan-200" /></div>
            <div className="mt-3 grid grid-cols-4">{products.map((product, index) => <div key={product.name} className="font-mono text-[8px] uppercase tracking-[.14em] text-white/25">0{index + 1} · {product.name}</div>)}</div>
          </div>
        </div>
      </div>

      <div className="container py-28 lg:hidden">
        <p className="eyebrow">Featured products</p>
        <h2 className="mt-7 text-[clamp(3.4rem,15vw,6rem)] font-medium leading-[.86] tracking-[-.065em]">Explore Our<br /><span className="text-cyan-200">Vision in Action.</span></h2>
        <p className="mt-7 max-w-xl leading-relaxed text-white/55">Digital products designed to simplify complex operations, connect international markets, and create practical leverage.</p>
        <div className="mt-20 space-y-24">{products.map((product, index) => <article key={product.name}><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">0{index + 1} / {product.year}</p><h3 className="mt-5 text-5xl leading-[.9] tracking-[-.06em]">{product.name}</h3><p className="mt-5 leading-relaxed text-white/50">{product.description}</p><button data-cursor="Open" onClick={() => setSelected(product)} className="relative mt-8 block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/15"><Image src={product.image.src} alt={product.image.alt} fill sizes="100vw" className="object-cover" /></button><button onClick={() => setSelected(product)} className="pill mt-7">Explore product <ArrowUpRight size={15} /></button></article>)}</div>
      </div>

      <AnimatePresence>{selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[350] grid place-items-center bg-black/80 p-4 backdrop-blur-xl md:p-8"><motion.div role="dialog" aria-modal="true" aria-label={`${product.name} overview`} initial={{ opacity: 0, y: 40, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .97 }} onClick={event => event.stopPropagation()} className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/20 bg-[#090c0e] p-6 shadow-2xl md:p-10"><button onClick={onClose} aria-label="Close product overview" className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border border-white/20 bg-black/50 transition hover:bg-white hover:text-black"><X size={17} /></button><div className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200"><Layers size={14} />Product overview</div><h3 className="mt-6 text-5xl tracking-[-.06em] md:text-7xl">{product.name}</h3><p className="mt-6 text-lg leading-relaxed text-white/55">{product.description}</p><div className="mt-7 flex flex-wrap gap-2">{product.technology.map(tech => <span key={tech} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/50">{tech}</span>)}</div><a href={product.url} className="pill mt-9">Visit website <ArrowUpRight size={16} /></a></div><div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15"><Image src={product.image.src} alt={product.image.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" /></div></div></motion.div></motion.div>;
}
