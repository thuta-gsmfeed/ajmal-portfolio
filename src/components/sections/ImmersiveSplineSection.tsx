"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, type PointerEvent } from "react";

const ImmersiveSplineCanvas = dynamic(
  () => import("@/components/three/ImmersiveSplineCanvas"),
  { ssr: false },
);

const revealEase = [0.22, 1, 0.36, 1] as const;

export function ImmersiveSplineSection() {
  const [sceneReady, setSceneReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-600);
  const pointerY = useMotionValue(-600);
  const glowX = useSpring(pointerX, { stiffness: 130, damping: 25, mass: 0.25 });
  const glowY = useSpring(pointerY, { stiffness: 130, damping: 25, mass: 0.25 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left - 250);
    pointerY.set(event.clientY - bounds.top - 250);
  };

  const handlePointerLeave = () => {
    pointerX.set(-600);
    pointerY.set(-600);
  };

  return (
    <motion.section
      id="immersive"
      aria-labelledby="immersive-title"
      className="immersive-section"
      data-no-section-transition
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: revealEase }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="immersive-content"
        initial={reduceMotion ? false : { opacity: 0, x: -35 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.15, ease: revealEase }}
      >
        <h2 id="immersive-title" className="immersive-title section-title">
          <span>Innovation</span>
          <span className="immersive-title-accent">In motion.</span>
        </h2>

        <p className="immersive-description">
          Explore a living expression of how entrepreneurship, technology, and global market insight move together to turn bold ideas into scalable ventures.
        </p>

        <div className="immersive-actions">
          <a className="immersive-button immersive-button-primary" href="#products">
            <span>Explore ventures</span>
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
          <a className="immersive-button immersive-button-secondary" href="#journey">
            View journey
          </a>
        </div>

        <div className="immersive-features" aria-label="Experience features">
          <div className="immersive-feature">
            <span>Realtime</span>
            <small>3D environment</small>
          </div>
          <span aria-hidden="true" className="immersive-feature-separator" />
          <div className="immersive-feature">
            <span>Interactive</span>
            <small>Mouse controls</small>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="immersive-scene-shell"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: reduceMotion ? 0 : 1, delay: 0.15, ease: revealEase }}
      >
        <div className="immersive-spline-layer" aria-hidden="true">
          <ImmersiveSplineCanvas onLoad={() => setSceneReady(true)} />
        </div>

        <motion.div
          aria-hidden="true"
          className="immersive-robot-logo"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
          animate={
            sceneReady
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.86 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: reduceMotion ? 0 : 0.3,
            ease: revealEase,
          }}
        >
          <Image
            src="/images/logo/gsmfeed-logo.svg"
            alt=""
            width={40}
            height={19}
            className="immersive-robot-logo-symbol"
          />
          <Image
            src="/images/logo/gsmfeed-full-logo.png"
            alt=""
            width={294}
            height={75}
            className="immersive-robot-logo-wordmark"
          />
        </motion.div>

        {!sceneReady && (
          <div className="immersive-loader" role="status" aria-live="polite">
            <span aria-hidden="true" className="immersive-loader-spinner" />
            <span>Loading 3D scene</span>
          </div>
        )}

        <motion.div
          className="immersive-live-status"
          animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span aria-hidden="true" className="immersive-live-icon">
            <span />
          </span>
          <span className="immersive-live-copy">
            <strong>Live environment</strong>
            <small>Move your cursor to interact</small>
          </span>
        </motion.div>
      </motion.div>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="immersive-cursor-light"
          style={{ x: glowX, y: glowY }}
        />
      )}
    </motion.section>
  );
}
