"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 32, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 420, damping: 32, mass: 0.45 });
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const over = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      setInteractive(Boolean(target));
      setLabel(target?.dataset.cursor ?? "");
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    addEventListener("mousemove", move, { passive: true });
    addEventListener("mouseover", over, { passive: true });
    addEventListener("mousedown", down);
    addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      document.body.classList.remove("has-cursor");
      removeEventListener("mousemove", move);
      removeEventListener("mouseover", over);
      removeEventListener("mousedown", down);
      removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[300] -ml-1 -mt-1 hidden size-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(104,231,255,.75)] md:block"
        style={{ x, y }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.55 : interactive ? 0.35 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[299] -ml-[22px] -mt-[22px] hidden size-11 items-center justify-center rounded-full border border-white/55 bg-cyan-200/[.035] text-[7px] font-medium uppercase tracking-[.13em] text-white md:flex"
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : interactive ? 1.45 : 1,
          backgroundColor: interactive ? "rgba(104,231,255,.12)" : "rgba(104,231,255,.035)",
          borderColor: interactive ? "rgba(104,231,255,.8)" : "rgba(255,255,255,.55)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.div>
    </>
  );
}
