import Image from "next/image";
import { partners } from "@/data/content";

function Row({ reverse = false }: { reverse?: boolean }) {
  const repeated = [...partners, ...partners];
  return (
    <div className="marquee overflow-hidden border-t border-white/10 py-6 [perspective:1000px]">
      <div className="marquee-track flex" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {repeated.map((partner, index) => {
          const position = index % partners.length;
          const center = (partners.length - 1) / 2;
          const distance = Math.abs(position - center) / Math.max(1, center);
          return <div
            key={`${partner.name}-${index}`}
            style={{ transform: `translateY(${Math.round(distance * 18)}px) rotateZ(${(position - center) * 0.45}deg)` }}
            className="partner-tile group flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[.018] px-6 transition duration-500 hover:bg-white/[.06] md:h-32 md:w-64 md:px-8"
          >
            <div className="relative h-10 w-full opacity-70 grayscale transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0 md:h-12 md:opacity-55">
              <Image
                src={partner.logo}
                alt={index < partners.length ? `${partner.name} logo` : ""}
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <section className="overflow-hidden py-20 md:py-40">
      <div className="container mb-10 grid gap-6 md:mb-16 md:gap-8 lg:grid-cols-[1fr_2fr]">
        <p className="eyebrow">Partnerships</p>
        <div>
          <h2 className="section-title max-w-5xl">Global connections,<br />trusted partnerships.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50 md:mt-7 md:text-lg md:text-white/45">A network spanning global logistics, international finance, mobile-device distribution, and lifecycle services.</p>
        </div>
      </div>
      <div className="relative mx-auto max-w-[1600px] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-12 before:bg-gradient-to-r before:from-[#050607] md:before:w-16 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-12 after:bg-gradient-to-l after:from-[#050607] md:after:w-16">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
