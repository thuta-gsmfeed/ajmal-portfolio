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
    window.history.pushState(null, "", `#${id}`);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav ref={rail} className={`section-rail ${lightSurface ? "section-rail--light" : ""}`} aria-label="Page sections">
      {chapters.map((chapter) => {
        const selected = active === chapter.id;
        return (
          <button
            key={chapter.id}
            type="button"
            className="section-rail__button"
            aria-label={`Go to ${chapter.label}`}
            aria-current={selected ? "location" : undefined}
            onClick={() => goTo(chapter.id)}
          >
            <motion.span
              className="section-rail__line"
              animate={{ width: selected ? 48 : 32, opacity: selected ? 1 : 0.42 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        );
      })}
    </nav>
  );
}
