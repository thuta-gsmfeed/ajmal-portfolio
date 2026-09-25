"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";

export function Header() {
  const logo = useRef<HTMLSpanElement>(null);
  const hiddenRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
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
    let lastScrolled = window.scrollY > 0;
    let lastLightSurface = false;
    let lastY = window.scrollY;
    let lastDirection = 0;
    let directionTravel = 0;
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
        const currentY = Math.max(0, window.scrollY);
        const nextScrolled = currentY > 0;
        const movement = currentY - lastY;
        if (Math.abs(movement) > 0.5) {
          const direction = Math.sign(movement);
          directionTravel = direction === lastDirection ? directionTravel + Math.abs(movement) : Math.abs(movement);
          lastDirection = direction;
          lastY = currentY;
          if (directionTravel >= 12 && currentY > 32) {
            const nextHidden = direction > 0;
            if (nextHidden !== hiddenRef.current) {
              hiddenRef.current = nextHidden;
              setHidden(nextHidden);
            }
          }
        }
        if (currentY <= 32 && hiddenRef.current) {
          hiddenRef.current = false;
          setHidden(false);
        }

        const nextLightSurface = !nextScrolled && themeAt(window.innerWidth - 40, 48) === "light";
        const logoBounds = !nextScrolled ? logo.current?.getBoundingClientRect() : null;

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

  return (
    <header
      className={`site-header pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-2.5 md:px-6 md:pt-3.5 ${hidden ? "site-header--hidden" : ""}`}
      onFocusCapture={() => { hiddenRef.current = false; setHidden(false); }}
    >
        <div
          className={`header-glass pointer-events-auto mx-auto overflow-hidden ${scrolled ? "header-glass--compact" : "header-glass--open"} ${lightSurface ? "header-glass--light" : ""}`}
        >
          <div className="flex h-14 items-center justify-between px-3 md:h-16 md:px-5">
            <a href="#home" onClick={(event) => scrollToSection(event, "home")} aria-label="Gholzad Home" className="grid size-11 place-items-center transition-transform duration-300 hover:scale-105">
              <span ref={logo} className="header-logo relative block h-8 w-8 md:h-9 md:w-9">
                <Image src="/images/logo/gholzad-logo.svg" alt="Gholzad Logo" fill sizes="36px" className="object-contain" priority />
                <Image aria-hidden src="/images/logo/gholzad-logo.svg" alt="" fill sizes="36px" className="header-logo__dark object-contain" priority />
              </span>
            </a>

            <a
              href="#contact"
              onClick={(event) => scrollToSection(event, "contact")}
              className="header-talk-button inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-black/20 px-5 text-sm font-medium text-white backdrop-blur-md"
            >
              Let&apos;s talk
            </a>
          </div>

        </div>
    </header>
  );
}
