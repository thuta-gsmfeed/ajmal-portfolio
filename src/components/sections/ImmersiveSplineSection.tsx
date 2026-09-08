"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings, useSectionProgress, useSceneVisibility } from "@/components/animation/motion";
import { SceneBoundary } from "@/components/three/SceneBoundary";

const ImmersiveSplineCanvas = dynamic(
  () => import("@/components/three/ImmersiveSplineCanvas"),
  { ssr: false },
);

const revealEase = [0.22, 1, 0.36, 1] as const;

export function ImmersiveSplineSection() {
  const [failed, setFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const { reduced: reduceMotion, desktop } = useMotionSettings();
  const { near, active } = useSceneVisibility(section);
  useEffect(() => {
    if (!near || sceneReady || reduceMotion) return;
    const timer = window.setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(timer);
  }, [near, sceneReady, reduceMotion]);
  const progress = useSectionProgress(section, "top bottom", "bottom top");
  const scale = useTransform(progress, [0, 0.55, 1], [0.86, 1, 1.025]);
  const copyY = useTransform(progress, [0, 1], [55, -45]);
  const fallback = <div className="scene-fallback"><Image src="/images/logo/gsmfeed-full-logo.png" alt="gsmfeed" width={294} height={75} /><p>Technology. Commerce. Connected.</p></div>;

  return (
    <motion.section
      ref={section}
      id="immersive"
      aria-labelledby="immersive-title"
      className="immersive-section"
      data-no-section-transition
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: revealEase }}
    >
      <motion.div
        className="immersive-content"
        style={{ y: desktop ? copyY : 0 }}
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

      </motion.div>

      <motion.div
        className="immersive-scene-shell"
        style={{ scale: desktop ? scale : 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: reduceMotion ? 0 : 1, delay: 0.15, ease: revealEase }}
      >
        <div className="immersive-spline-layer" aria-hidden="true">
          {near && !reduceMotion && !failed ? <SceneBoundary fallback={fallback} onError={() => setFailed(true)}><ImmersiveSplineCanvas active={active} onLoad={() => setSceneReady(true)} /></SceneBoundary> : fallback}
        </div>

        {near && !reduceMotion && !sceneReady && !failed && (
          <div className="immersive-loader pointer-events-none" role="status" aria-live="polite">
            <span aria-hidden="true" className="immersive-loader-spinner" />
            <span>Loading 3D scene</span>
          </div>
        )}

      </motion.div>

    </motion.section>
  );
}
