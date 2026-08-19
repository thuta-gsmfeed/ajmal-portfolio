"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ContextCursor() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { stiffness: 520, damping: 38, mass: 0.18 });
  const y = useSpring(pointerY, { stiffness: 520, damping: 38, mass: 0.18 });
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? "");
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [pointerX, pointerY, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="context-cursor"
      style={{ x, y }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: pressed ? 0.82 : label ? 1.7 : 1,
      }}
      transition={{ opacity: { duration: 0.18 }, scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
    >
      <motion.span animate={{ opacity: label ? 1 : 0 }} className="context-cursor__label">
        {label}
      </motion.span>
    </motion.div>
  );
}
