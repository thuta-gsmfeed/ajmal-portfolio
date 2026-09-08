import Image from "next/image";
import { partners } from "@/data/content";

export function TrustedPartnershipsSection() {
  return (
    <section id="trusted-partnerships" className="network-partners-chapter" aria-label="Trusted global partners">
      <div className="container">
        <div className="network-partners">
          <div className="network-partners__intro">
            <p className="eyebrow">Trusted partnerships</p>
            <h3>Built through relationships.</h3>
            <p>Selected partnerships supporting international trade, payments, logistics, and operations.</p>
          </div>
          <ul className="network-partners__grid">
            {partners.map((partner) => (
              <li key={partner.name} className="network-partner">
                <div className="relative h-9 w-full">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="(max-width: 767px) 42vw, (max-width: 1023px) 28vw, 150px"
                    className="object-contain"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
