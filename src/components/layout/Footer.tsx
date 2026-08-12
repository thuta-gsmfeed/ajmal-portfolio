import Image from "next/image";
import { ArrowUp, ArrowUpRight, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { nav, site } from "@/data/content";

const contactLinks = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail, external: false },
  { label: "LinkedIn", value: "Connect professionally", href: site.linkedin, icon: Linkedin, external: true },
] as const;

export function Footer() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.phone}?text=${encodeURIComponent(site.whatsapp.message)}`;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030506]">
      <div aria-hidden className="absolute -right-40 top-0 size-[520px] rounded-full bg-cyan-300/[.045] blur-[110px]" />
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-10" />

      <div className="container relative z-10">
        <div className="grid gap-8 border-b border-white/10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16 lg:py-20">
          <div>
            <p className="eyebrow">Start a conversation</p>
            <h2 className="section-title mt-5 max-w-4xl md:mt-7">
              Let&apos;s build what&apos;s
              <span className="block bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                coming next.
              </span>
            </h2>
          </div>

          <a href="#contact" className="pill group w-fit bg-white text-[#030506] hover:bg-cyan-100">
            Let&apos;s talk
            <ArrowUpRight aria-hidden size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 md:gap-x-12 md:py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-5">
            <a
              href="#home"
              aria-label="Gholzad Management Group — back to home"
              className="inline-flex items-center gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[.035] md:size-16">
                <Image src="/images/logo/gholzad-logo.svg" alt="" width={40} height={40} className="size-9 md:size-10" />
              </span>
              <span>
                <strong className="block text-lg font-medium tracking-[.08em] text-white md:text-xl">GHOLZAD</strong>
                <span className="mt-1 block font-mono text-sm uppercase tracking-[.1em] text-white/40">Management Group</span>
              </span>
            </a>

            <p className="mt-6 max-w-md text-base leading-7 text-white/55">
              Building trusted businesses, technology platforms, and global partnerships across markets.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-white/40">
              <MapPin aria-hidden size={15} className="text-cyan-200/70" />
              {site.location}
            </div>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-3">
            <p className="font-mono text-sm uppercase tracking-[.14em] text-white/35">Explore</p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 sm:grid-cols-1">
              {nav.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="group flex min-h-11 items-center border-b border-white/[.07] text-base text-white/60 transition-colors duration-300 hover:text-white lg:max-w-[210px]"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="lg:col-span-4 lg:pl-5">
            <p className="font-mono text-sm uppercase tracking-[.14em] text-white/35">Connect</p>
            <div className="mt-4">
              {contactLinks.map(({ label, value, href, icon: Icon, ...link }) => (
                <a
                  key={label}
                  href={href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="group grid min-h-[68px] grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-white/[.07] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-white/10 text-cyan-200/70 transition-colors group-hover:border-cyan-200/35 group-hover:text-cyan-100">
                    <Icon aria-hidden size={15} />
                  </span>
                  <span>
                    <span className="block font-mono text-sm uppercase tracking-[.08em] text-white/30">{label}</span>
                    <span className="mt-0.5 block text-base">{value}</span>
                  </span>
                  <ArrowUpRight aria-hidden size={15} className="text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
                </a>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group grid min-h-[68px] grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-white/[.07] text-white/60 transition-colors duration-300 hover:text-white"
              >
                <span className="grid size-9 place-items-center rounded-full border border-white/10 text-cyan-200/70 transition-colors group-hover:border-cyan-200/35 group-hover:text-cyan-100">
                  <MessageCircle aria-hidden size={15} />
                </span>
                <span>
                  <span className="block font-mono text-sm uppercase tracking-[.08em] text-white/30">WhatsApp</span>
                  <span className="mt-0.5 block text-base">Start a conversation</span>
                </span>
                <ArrowUpRight aria-hidden size={15} className="text-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between md:py-7">
          <p>© {new Date().getFullYear()} Ajmal Gholzad. All rights reserved.</p>
          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <p className="font-mono uppercase tracking-[.08em]">Entrepreneur · Technology Founder</p>
            <a
              href="#home"
              aria-label="Back to top"
              className="group grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-white/55 transition-[border-color,color,transform] duration-300 hover:-translate-y-1 hover:border-cyan-200/45 hover:text-cyan-100"
            >
              <ArrowUp aria-hidden size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
