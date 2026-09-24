"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 160);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      data-visible={visible}
      aria-label="Back to top"
      aria-hidden={!visible}
      disabled={!visible}
      onClick={scrollToTop}
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={1.8} />
    </button>
  );
}
