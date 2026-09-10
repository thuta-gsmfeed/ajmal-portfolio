"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";

export function Header() {
  const logo = useRef<HTMLSpanElement>(null);
  const talkButton = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightSurface, setLightSurface] = useState(false);

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
    let frame = 0;
    let lastScrolled = scrollY > 36;
    let lastLightSurface = false;
    const themeAt = (x: number, y: number) => {
      for (const element of document.elementsFromPoint(x, y)) {
        const surface = (element as HTMLElement).closest<HTMLElement>("[data-header-theme]");
        if (surface) return surface.dataset.headerTheme;
      }
      return "dark";
    };
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = scrollY > 36;
        const buttonBounds = talkButton.current?.getBoundingClientRect();
        const nextLightSurface = buttonBounds && buttonBounds.width > 0
          ? themeAt(buttonBounds.left + buttonBounds.width / 2, buttonBounds.top + buttonBounds.height / 2) === "light"
          : themeAt(window.innerWidth - 40, 48) === "light";
        const logoBounds = logo.current?.getBoundingClientRect();

        if (logo.current && logoBounds) {
          const centerX = logoBounds.left + logoBounds.width / 2;
          let firstLightRow = -1;
          let lastLightRow = -1;
          const rowCount = Math.max(1, Math.round(logoBounds.height));
          for (let row = 0; row < rowCount; row += 1) {
            if (themeAt(centerX, logoBounds.top + row + 0.5) !== "light") continue;
            if (firstLightRow < 0) firstLightRow = row;
            lastLightRow = row;
          }
          const lightTop = firstLightRow < 0 ? 100 : (firstLightRow / rowCount) * 100;
          const lightBottom = lastLightRow < 0 ? 0 : ((rowCount - lastLightRow - 1) / rowCount) * 100;
          logo.current.style.setProperty("--logo-light-top", `${lightTop}%`);
          logo.current.style.setProperty("--logo-light-bottom", `${lightBottom}%`);
        }

        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }
        if (nextLightSurface !== lastLightSurface) {
          lastLightSurface = nextLightSurface;
          setLightSurface(nextLightSurface);
        }
      });
    };
    setScrolled(lastScrolled);
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); };
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
          className={`header-glass pointer-events-auto mx-auto overflow-hidden ${scrolled || open ? "header-glass--compact" : "header-glass--open"} ${lightSurface && !open ? "header-glass--light" : ""}`}
        >
          <div className="flex h-14 items-center justify-between px-3 md:h-16 md:px-5">
            <a href="#home" onClick={(event) => scrollToSection(event, "home")} aria-label="Gholzad Home" className="grid size-11 place-items-center transition-transform duration-300 hover:scale-105">
              <span ref={logo} className="header-logo relative block h-8 w-8 md:h-9 md:w-9">
                <Image src="/images/logo/gholzad-logo.svg" alt="Gholzad Logo" fill sizes="36px" className="object-contain" priority />
                <Image aria-hidden src="/images/logo/gholzad-logo.svg" alt="" fill sizes="36px" className="header-logo__dark object-contain" priority />
              </span>
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              <a ref={talkButton} className="header-talk-button pill !min-h-10 text-xs" href="#contact" onClick={(event) => scrollToSection(event, "contact")}>Let&apos;s talk</a>
            </nav>

            <div className="flex items-center lg:hidden">
              <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" className="header-menu-button grid size-11 place-items-center rounded-full border border-white/20 bg-black/20" onClick={() => setOpen(!open)}>
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>

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
