import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { nav, site } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <a
              href="#home"
              aria-label="Gholzad Management Group — back to home"
              className="inline-block rounded-sm transition-opacity duration-300 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <Image
                src="/images/logo/logo-full.png"
                alt="Gholzad Management Group"
                width={344}
                height={272}
                className="h-auto w-[150px] md:w-[172px]"
              />
            </a>
            <p className="mt-5 text-sm text-white/40">{site.role}</p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-2 text-sm text-white/50"
          >
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="md:text-right">
            <a href={`mailto:${site.email}`} className="text-sm">
              {site.email}
            </a>
            <br />
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-white/45"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between border-t border-white/10 pt-7 text-xs text-white/35">
          <p>© {new Date().getFullYear()} Ajmal Gholzad. All rights reserved.</p>
          <a
            href="#home"
            aria-label="Back to top"
            className="grid size-11 place-items-center rounded-full border border-white/15"
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
