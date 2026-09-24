"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Apple, BadgeCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings, useSceneVisibility } from "@/components/animation/motion";
import { SceneBoundary } from "@/components/three/SceneBoundary";

const ImmersiveSplineCanvas = dynamic(
  () => import("@/components/three/ImmersiveSplineCanvas"),
  { ssr: false },
);

const revealEase = [0.22, 1, 0.36, 1] as const;
const APP_STORE_URL = "https://apps.apple.com/us/app/gsmfeed/id6759554515";

export function ImmersiveSplineSection() {
  const [failed, setFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const { reduced: reduceMotion } = useMotionSettings();
  const { near, active } = useSceneVisibility(section);
  useEffect(() => {
    if (!near || sceneReady || reduceMotion) return;
    const timer = window.setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(timer);
  }, [near, sceneReady, reduceMotion]);
  const fallback = <div className="scene-fallback"><Image src="/images/logo/gsmfeed-full-logo.png" alt="gsmfeed" width={294} height={75} /><p>Connect. Trade. Grow.</p></div>;

  return (
    <motion.section
      ref={section}
      id="immersive"
      aria-labelledby="immersive-title"
      className="immersive-section immersive-section--gsmfeed"
      data-no-section-transition
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: revealEase }}
    >
      <div className="immersive-card">
        <div className="immersive-scene-shell">
          <div className="immersive-spline-layer" aria-hidden="true">
            {near && !reduceMotion && !failed ? <SceneBoundary fallback={fallback} onError={() => setFailed(true)}><ImmersiveSplineCanvas active={active} onLoad={() => setSceneReady(true)} /></SceneBoundary> : fallback}
          </div>
          {near && !reduceMotion && !sceneReady && !failed && (
            <div className="immersive-loader pointer-events-none" role="status" aria-live="polite">
              <span aria-hidden="true" className="immersive-loader-spinner" />
              <span>Loading 3D scene</span>
            </div>
          )}
        </div>

        <div className="immersive-content">
          <Image className="immersive-gsmfeed-logo" src="/images/logo/gsmfeed-full-logo.png" alt="gsmfeed" width={294} height={75} />
          <p className="immersive-gsmfeed-eyebrow">Connect. Trade. Grow.</p>
          <h2 id="immersive-title" className="immersive-title">
            AI-powered platform<br />with verified <span className="immersive-title-final">traders <BadgeCheck aria-hidden="true" /></span>
          </h2>
          <p className="immersive-description">Download the gsmfeed app today and join the global trading community.</p>
          <a className="immersive-app-store" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download gsmfeed on the App Store">
            <Apple aria-hidden="true" size={24} fill="currentColor" strokeWidth={1.5} />
            <span><small>Download on the</small><strong>App Store</strong></span>
          </a>
        </div>
      </div>

    </motion.section>
  );
}
