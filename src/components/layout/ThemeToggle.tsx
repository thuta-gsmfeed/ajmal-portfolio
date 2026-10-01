"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Storage can be unavailable. */ }
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f6f7f6" : "#030506");
    setTheme(next);
    window.dispatchEvent(new Event("portfolio:theme-change"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "light"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <motion.span
          className="theme-toggle__thumb"
          initial={false}
          animate={{ x: theme === "light" ? 26 : 0 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 32 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              className="theme-toggle__icon"
              initial={reducedMotion ? false : { opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
            >
              {theme === "dark" ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    </button>
  );
}
