"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    // Leave breathing room below the floating capsule; the section geometry can
    // settle by a few pixels while entrance media/fonts finish initializing.
    const headerOffset = 116;
    const target = Math.max(0, window.scrollY + section.getBoundingClientRect().top - headerOffset);
    window.history.pushState(null, "", `#${id}`);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const update = () => setScrolled(scrollY > 36);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("menu-open");
      removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-2.5 md:px-6 md:pt-3.5">
        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          className={`header-glass pointer-events-auto mx-auto overflow-hidden ${scrolled || open ? "header-glass--compact" : "header-glass--open"}`}
        >
          <div className="flex h-14 items-center justify-between px-3 md:h-16 md:px-5">
            <a href="#home" onClick={(event) => scrollToSection(event, "home")} aria-label="Gholzad Home" className="grid size-11 place-items-center transition-transform duration-300 hover:scale-105">
              <Image src="/images/logo/gholzad-logo.svg" alt="Gholzad Logo" width={36} height={36} className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] md:h-9" priority />
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              <a className="pill !min-h-10 text-xs" href="#contact" onClick={(event) => scrollToSection(event, "contact")}>Let&apos;s talk</a>
            </nav>

            <div className="flex items-center lg:hidden">
              <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" className="grid size-11 place-items-center rounded-full border border-white/20 bg-black/20" onClick={() => setOpen(!open)}>
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10"><motion.div aria-hidden className="h-full origin-left bg-cyan-300" style={{ scaleX: scrollYProgress }} /></div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-navigation" className="fixed inset-0 z-40 flex bg-[#07090a] px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-24 lg:hidden" initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <nav className="my-auto w-full" aria-label="Mobile">
              {nav.map(([label, id], index) => (
                <motion.a key={id} href={`#${id}`} onClick={(event) => { scrollToSection(event, id); setOpen(false); }} className="flex min-h-14 items-center border-t border-white/15 py-3 text-[clamp(1.9rem,9vw,3rem)] leading-none tracking-tight last:border-b" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.04 }}>
                  {label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
