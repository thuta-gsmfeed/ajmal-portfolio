"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { products, Product } from "@/data/content";
import { Sparkles, Layers, Cpu, Globe2, ShieldCheck, X, ChevronRight } from "lucide-react";

export function ProductsSection() {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [selectedModal, setSelectedModal] = useState<Product | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} id="products" className="relative overflow-hidden py-28 md:py-40 bg-[#030506]">
      {/* Background Ambient Glow & Grid Pattern */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 size-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="hero-grid absolute inset-0 opacity-40" />
      </motion.div>

      <div className="container relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            <Sparkles className="size-3.5 text-cyan-300" />
            <span>VISION IN ACTION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title text-white tracking-[0.03em]"
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Vision in Action
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-lg leading-relaxed text-white/70 md:text-xl md:leading-relaxed max-w-3xl"
          >
            Our projects are designed to simplify complex processes, foster connections, and empower businesses with tools for sustainable growth. Explore our vision in action.
          </motion.p>
        </div>

        {/* Project Selector Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center gap-3 border-b border-white/10 pb-6"
        >
          {products.map((project, idx) => {
            const isActive = activeProject === idx;
            return (
              <button
                key={project.name}
                onClick={() => setActiveProject(idx)}
                className={`relative px-5 py-2.5 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 rounded-full border ${
                  isActive
                    ? "border-cyan-300/80 bg-cyan-300/10 text-cyan-200 shadow-[0_0_20px_rgba(104,231,255,0.2)]"
                    : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                }`}
              >
                <span>0{idx + 1} / {project.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full border border-cyan-300/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Main 4 Projects Grid Showcase */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {products.map((project, idx) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={idx}
              isFocused={activeProject === idx}
              onSelect={() => {
                setActiveProject(idx);
                setSelectedModal(project);
              }}
            />
          ))}
        </div>
      </div>

      {/* Project Detail Modal Drawer */}
      <AnimatePresence>
        {selectedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModal(null)}
            className="fixed inset-0 z-[350] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-[#090c0e] p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.9)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedModal(null)}
                className="absolute top-6 right-6 grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:bg-white hover:text-black"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-3 font-mono text-xs text-cyan-300 uppercase tracking-[0.25em]">
                <Layers className="size-4" />
                <span>Project Vision 0{products.indexOf(selectedModal) + 1}</span>
              </div>

              <h3 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-white">
                {selectedModal.name}
              </h3>
              <p className="mt-2 text-sm text-white/50 uppercase tracking-widest font-mono">
                {selectedModal.category} · {selectedModal.year}
              </p>

              <div className="mt-6 relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15">
                <Image
                  src={selectedModal.image.src}
                  alt={selectedModal.image.alt}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="mt-6 text-base leading-relaxed text-white/80">
                {selectedModal.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedModal.technology.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 font-mono text-xs text-cyan-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-6">
                <span className="font-mono text-xs text-white/40">Status: Active Development</span>
                <button
                  onClick={() => setSelectedModal(null)}
                  className="pill text-xs !min-h-10 border-white/30 text-white hover:bg-white hover:text-black"
                >
                  Close Vision Overview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

{/* Individual Project Card Component with 3D Tilt & Mouse Spotlight */}
function ProjectCard({
  project,
  index,
  isFocused,
  onSelect,
}: {
  project: Product;
  index: number;
  isFocused: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu className="size-5 text-cyan-300" />;
      case 1:
        return <Globe2 className="size-5 text-cyan-300" />;
      case 2:
        return <Layers className="size-5 text-cyan-300" />;
      default:
        return <ShieldCheck className="size-5 text-cyan-300" />;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer ${
        isFocused
          ? "border-cyan-300/70 bg-[#0d1013] shadow-[0_0_50px_rgba(104,231,255,0.15)]"
          : "border-white/15 bg-[#090b0d] hover:border-white/40 hover:bg-[#0c0f12]"
      }`}
    >
      {/* Mouse Follow Spotlight Background Layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(104, 231, 255, 0.12), transparent 70%)`,
        }}
      />

      <div className="p-8 md:p-10 flex flex-col justify-between h-full">
        <div>
          {/* Card Top Metadata Bar */}
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5">
                {getIcon(index)}
              </div>
              <span className="text-cyan-300 font-medium">0{index + 1}</span>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/40">
              {project.year}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="mt-8 text-3xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100 md:text-4xl">
            {project.name}
          </h3>

          <p className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-cyan-200/70">
            {project.category}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-white/60 line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Project Image Mockup Frame */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-[#050708] p-2 transition-transform duration-500 group-hover:scale-[1.02]">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/10" />
            <span className="ml-auto font-mono text-[9px] text-white/30 tracking-widest">VISION SYSTEM</span>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </div>
        </div>

        {/* Bottom Tech Pills & CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {project.technology.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-white/60"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
            <span>Explore Vision</span>
            <ChevronRight className="size-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
