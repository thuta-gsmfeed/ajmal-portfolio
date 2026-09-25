"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Chapter = { id: string; label: string };

const labelFromId = (id: string) =>
  id
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function SectionRail() {
  const rail = useRef<HTMLElement>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [lightSurface, setLightSurface] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main");
    const nextChapters = main
      ? Array.from(main.children)
          .filter((element): element is HTMLElement => element instanceof HTMLElement && element.matches("section[id]"))
          .map((section) => ({ id: section.id, label: labelFromId(section.id) }))
      : [];

    setChapters(nextChapters);
    setActive((previous) =>
      nextChapters.some((chapter) => chapter.id === previous)
        ? previous
        : (nextChapters[0]?.id ?? ""),
    );

    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const marker = window.innerHeight * 0.52;
        let current = nextChapters[0]?.id ?? "";

        for (const chapter of nextChapters) {
          const section = document.getElementById(chapter.id);
          if (section && section.getBoundingClientRect().top <= marker) current = chapter.id;
        }

        setActive((previous) => (previous === current ? previous : current));

        const bounds = rail.current?.getBoundingClientRect();
        const sampleX = bounds ? bounds.left + bounds.width * 0.75 : window.innerWidth - 32;
        const sampleY = bounds ? bounds.top + bounds.height / 2 : window.innerHeight / 2;
        let nextLightSurface = false;

        for (const element of document.elementsFromPoint(sampleX, sampleY)) {
          const surface = (element as HTMLElement).closest<HTMLElement>("[data-header-theme]");
          if (!surface) continue;
          nextLightSurface = surface.dataset.headerTheme === "light";
          break;
        }

        setLightSurface((previous) => previous === nextLightSurface ? previous : nextLightSurface);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const goTo = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    const centeringOffset = Math.max(0, (window.innerHeight - bounds.height) / 2);
    const target = id === "home" ? 0 : Math.max(0, window.scrollY + bounds.top - centeringOffset);
    window.history.pushState(null, "", `#${id}`);
    const request = new CustomEvent("portfolio:scroll-to-section", { detail: { top: target }, cancelable: true });
    if (window.dispatchEvent(request)) {
      window.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  return (
    <nav ref={rail} className={`section-rail ${lightSurface ? "section-rail--light" : ""}`} aria-label="Page sections" onMouseLeave={() => setHovered(null)}>
      {chapters.map((chapter, index) => {
        const selected = active === chapter.id;
        const hoverDistance = hovered === null ? Infinity : Math.abs(index - hovered);
        const width = hoverDistance === 0 ? 46 : hoverDistance === 1 ? 30 : hoverDistance === 2 ? 22 : selected ? 32 : 18;
        return (
          <button
            key={chapter.id}
            type="button"
            className="section-rail__button"
            aria-label={`Go to ${chapter.label}`}
            aria-current={selected ? "location" : undefined}
            onMouseEnter={() => setHovered(index)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            onClick={() => goTo(chapter.id)}
          >
            <motion.span
              className="section-rail__line"
              animate={{ width, opacity: hoverDistance === 0 || selected ? 1 : hoverDistance === 1 ? 0.72 : 0.42 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        );
      })}
    </nav>
  );
}
