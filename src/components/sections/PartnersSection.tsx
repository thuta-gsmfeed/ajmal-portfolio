import Image from "next/image";
import { partners } from "@/data/content";

function Row({ reverse = false }: { reverse?: boolean }) {
  const repeated = [...partners, ...partners];
  return (
    <div className="marquee overflow-hidden border-t border-white/10">
      <div className="marquee-track flex" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {repeated.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="group flex h-40 w-80 shrink-0 items-center justify-center border-r border-white/10 bg-white/[.012] px-10 transition duration-500 hover:bg-white/[.055]"
          >
            <div className="relative h-16 w-full opacity-55 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0">
              <Image
                src={partner.logo}
                alt={index < partners.length ? `${partner.name} logo` : ""}
                fill
                sizes="320px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <section className="overflow-hidden py-28 md:py-40">
      <div className="container mb-16 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <p className="eyebrow">Partnerships</p>
        <div>
          <h2 className="section-title max-w-5xl">Global connections,<br />trusted partnerships.</h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/45">A network spanning global logistics, international finance, mobile-device distribution, and lifecycle services.</p>
        </div>
      </div>
      <div className="relative before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-28 before:bg-gradient-to-r before:from-[#050607] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-28 after:bg-gradient-to-l after:from-[#050607]">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
