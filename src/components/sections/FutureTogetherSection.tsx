import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { site } from "@/data/content";

export function FutureTogetherSection() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.phone}?text=${encodeURIComponent(site.whatsapp.message)}`;

  return (
    <section id="contact" className="future-together" aria-labelledby="future-together-title">
      <div className="future-together__glow" aria-hidden />
      <div className="future-together__content">
        <a className="future-together__brand" href="#home" aria-label="Gholzad — back to home">
          <Image src="/images/logo/gholzad-logo.svg" alt="" width={44} height={44} priority={false} />
          <span>GHOLZAD</span>
          <small>Management Group</small>
        </a>

        <h2 id="future-together-title">Let&apos;s Build the Future Together</h2>
        <p>
          Whether you&apos;re looking to grow your business,
          <br className="future-together__desktop-break" /> embrace automation, or explore new opportunities,
          <br className="future-together__desktop-break" /> Gholzad.com is here to help.
        </p>

        <div className="future-together__links" aria-label="Contact options">
          <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} data-cursor="EMAIL">
            <Mail aria-hidden size={20} strokeWidth={1.9} />
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Start a WhatsApp conversation" data-cursor="CHAT">
            <MessageCircle aria-hidden size={20} strokeWidth={1.9} />
          </a>
        </div>

        <small className="future-together__copyright">© {new Date().getFullYear()} All rights reserved Gholzad</small>
      </div>

      <div className="future-together__wordmark" aria-hidden>GHOLZAD</div>
    </section>
  );
}
