"use client";

import { motion } from "framer-motion";
import { type MouseEvent, useEffect, useState } from "react";

const chapters = [
  ["home", "Opening"],
  ["about", "Founder"],
  ["network", "Network"],
  ["journey", "Journey"],
  ["products", "Products"],
  ["gsmfeed-app", "Mobile"],
  ["yachts", "Yachts"],
  ["contact", "Contact"],
] as const;

export function ChapterNavigator() {
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);

  const scrollToChapter = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    const target = Math.max(0, window.scrollY + section.getBoundingClientRect().top - 116);
    window.history.pushState(null, "", `#${id}`);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const elements = chapters.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -48% 0px", threshold: [0, 0.15, 0.35, 0.65] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.round((window.scrollY / maximum) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <aside aria-label="Page chapters" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col items-end gap-3 py-3 before:absolute before:bottom-4 before:right-[5px] before:top-4 before:w-px before:bg-white/12">
        {chapters.map(([id, label], index) => {
          const selected = active === id;
          return (
            <a key={id} href={`#${id}`} onClick={(event) => scrollToChapter(event, id)} aria-label={`Go to ${label}`} aria-current={selected ? "location" : undefined} className="group relative flex h-5 items-center gap-3">
              <span className={`pointer-events-none translate-x-2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] backdrop-blur-md transition-all duration-300 ${selected ? "translate-x-0 text-cyan-100 opacity-100" : "text-white/55 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>{String(index + 1).padStart(2, "0")} · {label}</span>
              <motion.span animate={{ scale: selected ? 1.45 : 1, backgroundColor: selected ? "#68e7ff" : "rgba(255,255,255,.35)" }} className="relative z-10 block size-[11px] rounded-full border-[3px] border-[#050607] shadow-[0_0_0_1px_rgba(255,255,255,.12)]" />
            </a>
          );
        })}
      </div>
      <p className="mt-2 pr-0.5 text-right font-mono text-[9px] tracking-[.12em] text-white/35">{String(progress).padStart(2, "0")}%</p>
    </aside>
  );
}
