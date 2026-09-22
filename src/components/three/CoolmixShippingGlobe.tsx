"use client";

import Script from "next/script";
import { useState } from "react";

export function CoolmixShippingGlobe() {
  const [threeReady, setThreeReady] = useState(false);

  return (
    <>
      <Script
        id="coolmix-three-runtime"
        src="/vendor/three-r128.min.js"
        strategy="afterInteractive"
        onLoad={() => setThreeReady(true)}
        onReady={() => setThreeReady(true)}
      />
      {threeReady && (
        <Script
          id="coolmix-shipping-globe-runtime"
          src="/vendor/coolmix-events-globe.js"
          strategy="afterInteractive"
        />
      )}

      <div className="network-globe" data-events-globe data-globe-mode="shipping">
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
