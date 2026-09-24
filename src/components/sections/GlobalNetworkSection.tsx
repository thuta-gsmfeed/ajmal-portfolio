import { CoolmixShippingGlobe } from "@/components/three/CoolmixShippingGlobe";

export function GlobalNetworkSection() {
  return (
    <section id="network" className="network-section relative" data-header-theme="dark" aria-labelledby="network-title">
      <div className="network-stage relative overflow-hidden">
          <div className="network-atmosphere" aria-hidden="true" />
          <div className="container relative">
            <div className="network-copy">
              <h2 id="network-title" data-section-reveal="left">Built Across Borders</h2>
              <p className="network-copy__lead" data-section-reveal="left" data-reveal-order="1">From Dubai to the world.</p>
              <p data-section-reveal="left" data-reveal-order="2">Business today has no single address.</p>
              <p data-section-reveal="left" data-reveal-order="3">Gholzad&apos;s companies operate through international relationships, partners and markets across Europe, the Middle East, Hong Kong and other global trading hubs.</p>
              <p data-section-reveal="left" data-reveal-order="4">This international perspective allows ideas, products and technology to move between markets — creating opportunities that go beyond borders.</p>
              <p className="network-copy__closing" data-section-reveal="left" data-reveal-order="5">Global thinking. Local execution.</p>
            </div>

            <div className="network-scene">
              <CoolmixShippingGlobe />
            </div>
          </div>
      </div>

    </section>
  );
}
