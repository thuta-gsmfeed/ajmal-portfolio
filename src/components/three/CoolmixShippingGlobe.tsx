"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export function CoolmixShippingGlobe() {
  const [threeReady, setThreeReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const globe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = globe.current;
    if (!element || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "900px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {shouldLoad && <Script
        id="coolmix-three-runtime"
        src="/vendor/three-r128.min.js"
        strategy="afterInteractive"
        onLoad={() => setThreeReady(true)}
        onReady={() => setThreeReady(true)}
      />}
      {threeReady && (
        <Script
          id="coolmix-shipping-globe-runtime"
          src="/vendor/coolmix-events-globe.js"
          strategy="afterInteractive"
        />
      )}

      <div ref={globe} className="network-globe" data-events-globe data-globe-mode="shipping">
        <div className="network-globe__shadow network-globe__shadow--orange" aria-hidden="true" />
        <div className="network-globe__shadow network-globe__shadow--blue" aria-hidden="true" />
        <div className="network-globe__shadow network-globe__shadow--blue-plus" aria-hidden="true" />
        <div className="network-globe__shadow network-globe__shadow--orange-plus" aria-hidden="true" />
        <canvas
          className="network-globe__canvas"
          data-events-globe-canvas
          aria-label="Interactive globe showing worldwide business connections"
        />
        <div className="network-globe__labels" data-events-globe-labels aria-hidden="true" />
        <div className="network-globe__loading" data-events-globe-loading>Loading worldwide routes…</div>
      </div>
    </>
  );
}
