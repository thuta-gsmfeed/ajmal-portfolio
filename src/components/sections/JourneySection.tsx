"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { timeline } from "@/data/content";

const route = "M 55 430 C 125 402, 158 360, 220 348 S 315 382, 350 330 S 420 260, 485 286 S 575 240, 615 194 S 690 170, 730 118 S 805 92, 862 48";
const points = [
  [55, 430], [220, 348], [350, 330], [485, 286], [615, 194], [730, 118], [862, 48],
];

const mobileTitleLines: Record<string, [string, string]> = {
  "Premium mobile products": ["Premium", "mobile products"],
  "Resilience under pressure": ["Resilience", "under pressure"],
  "A new chapter in Dubai": ["A new chapter", "in Dubai"],
  "Building what comes next": ["Building what", "comes next"],
};

function MobileMilestoneTitle({ title }: { title: string }) {
  const lines = mobileTitleLines[title];

  if (!lines) return title;

  return lines.map((line) => <span key={line} className="block">{line}</span>);
}

export function JourneySection() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const steps = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 85%", "end 35%"] });
  const journeyProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      }),
      { rootMargin: "-36% 0px -42% 0px", threshold: 0 },
    );
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const progress = active / (timeline.length - 1);

  return (
    <section ref={section} id="journey" className="relative border-y border-black/10 bg-[#edf0ef] text-[#091012]" aria-label="Entrepreneurial experience: The climb was never linear.">
      <div className="container py-16 md:hidden">
        <div className="border-b border-black/15 pb-7">
          <p className="eyebrow !text-black/45">Entrepreneurial experience</p>
          <h2 className="section-title mt-6">
            The climb was<br />never linear.
          </h2>
          <div className="mt-6 flex items-center justify-between font-mono text-sm uppercase tracking-[.1em] text-black/45">
            <span>2009 — Today</span>
            <span>{timeline.length} chapters</span>
          </div>
        </div>

        <div className="relative mt-4">
          <div aria-hidden className="absolute bottom-10 left-[7px] top-5 w-px bg-black/15" />
          <motion.div
            aria-hidden
            className="absolute bottom-10 left-[7px] top-5 w-px origin-top bg-cyan-700"
            style={{ scaleY: reducedMotion ? 1 : journeyProgress }}
          />

          {timeline.map((milestone, index) => (
            <motion.article
              key={`mobile-${milestone.year}-${milestone.title}`}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.32 }}
              transition={{ duration: 0.65, delay: index === 0 ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-b border-black/10 py-8 pl-9 last:border-b-0 last:pb-2"
            >
              <motion.span
                aria-hidden
                initial={reducedMotion ? false : { scale: 0.55, backgroundColor: "#edf0ef" }}
                whileInView={{ scale: 1, backgroundColor: "#008fab" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-[2.3rem] size-[15px] rounded-full border-[3px] border-[#edf0ef] ring-1 ring-cyan-800/30"
              />
              <p className="font-mono text-sm tracking-[.12em] text-cyan-800">
                0{index + 1} · {milestone.year}
              </p>
              <h3 className="mt-3 text-[clamp(2rem,9vw,2.75rem)] font-medium leading-[1.08] tracking-[-.03em]">
                <MobileMilestoneTitle title={milestone.title} />
              </h3>
              <p className="mt-4 text-base leading-7 text-black/60">
                {milestone.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="container hidden md:grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="self-start py-20 lg:sticky lg:top-20 lg:flex lg:min-h-[calc(100svh-5rem)] lg:flex-col lg:py-10">
          <div>
            <p className="eyebrow !text-black/45">Entrepreneurial experience</p>
            <h2 className="section-title mt-7 max-w-3xl">
              <span className="block">The climb was</span>
              <span className="block">never linear.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-black/55 md:text-lg">Every venture added a new capability. Every setback sharpened the next decision. This is the path from first business to global products and technology.</p>
          </div>

          <div className="relative mt-3 hidden h-[clamp(300px,39vh,430px)] max-w-4xl overflow-hidden lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_55%,rgba(0,158,188,.11),transparent_36%)]" />
            <motion.div key={timeline[active].year} initial={{ opacity: 0, y: 14 }} animate={{ opacity: .055, y: 0 }} className="absolute right-5 top-2 text-[clamp(6rem,10vw,10rem)] font-semibold leading-none tracking-[-.09em]">{timeline[active].year}</motion.div>
            <svg viewBox="0 0 920 480" className="relative h-full w-full" role="img" aria-label={`Journey progress: ${timeline[active].year}, ${timeline[active].title}`}>
              <path d="M0 465 L110 408 L198 424 L292 354 L372 390 L470 298 L550 330 L650 218 L720 246 L820 98 L920 160 L920 480 L0 480 Z" fill="rgba(0,0,0,.045)" />
              <path d={route} fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="2" strokeDasharray="7 9" />
              <motion.path d={route} fill="none" stroke="#008fab" strokeWidth="3" strokeLinecap="round" initial={false} animate={{ pathLength: progress }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} />
              {points.map(([x, y], index) => (
                <motion.g key={timeline[index].year} onClick={() => steps.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })} className="cursor-pointer">
                  <motion.circle cx={x} cy={y} r="15" fill="rgba(0,143,171,.12)" animate={{ scale: index === active ? 1 : 0 }} style={{ transformOrigin: `${x}px ${y}px` }} />
                  <circle cx={x} cy={y} r={index === active ? 7 : 4} fill={index <= active ? "#008fab" : "#aab2b4"} stroke="#edf0ef" strokeWidth="3" />
                </motion.g>
              ))}
              <motion.g initial={false} animate={{ x: points[active][0] - 862, y: points[active][1] - 48 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
                <path d="M862 22 V48" stroke="#091012" strokeWidth="3" />
                <path d="M864 22 L890 31 L864 40 Z" fill="#008fab" />
              </motion.g>
            </svg>
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-black/15 pt-4 lg:mt-auto">
            <div><p className="font-mono text-sm uppercase tracking-[.14em] text-black/45">Current chapter</p><p className="mt-1 text-base md:text-lg">{timeline[active].year} · {timeline[active].title}</p></div>
            <p className="font-mono text-sm text-cyan-700">0{active + 1} / 0{timeline.length}</p>
          </div>
        </div>

        <div className="border-t border-black/10 lg:border-l lg:border-t-0 lg:pl-10">
          {timeline.map((milestone, index) => (
            <article
              key={`${milestone.year}-${milestone.title}`}
              ref={(node) => { steps.current[index] = node; }}
              data-index={index}
              data-cursor="CHAPTER"
              className="group flex items-center border-b border-black/10 py-8 last:border-b-0 sm:min-h-[38vh] sm:py-12 lg:min-h-[62vh] lg:py-16"
            >
              <motion.div
                animate={{
                  opacity: active === index ? 1 : 0.5,
                  x: active === index ? 0 : 16,
                  rotate: active === index ? 0 : index % 2 === 0 ? -1.15 : 1.15,
                  scale: active === index ? 1 : 0.965,
                }}
                transition={{ duration: .52, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-[1.75rem] border border-black/10 bg-white/55 p-6 shadow-[0_24px_70px_rgba(9,16,18,.08)] backdrop-blur-sm md:p-8"
              >
                <span aria-hidden className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-[#edf0ef] bg-cyan-700 shadow-[0_5px_12px_rgba(0,80,96,.22)]" />
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-cyan-700 transition-[letter-spacing,color] duration-500 group-hover:tracking-[.08em] group-hover:text-cyan-600">{milestone.year}</p>
                  <span className={`grid size-11 place-items-center rounded-full border transition-colors ${active === index ? "border-[#091012] bg-[#091012] text-white" : "border-black/15 text-black/35"}`}><ArrowUpRight size={16} /></span>
                </div>
                <h3 className="mt-5 text-[clamp(2rem,9vw,5.1rem)] leading-[1.12] tracking-[-.025em] transition-[color,transform] duration-500 ease-out group-hover:translate-x-2 group-hover:text-cyan-800 md:mt-8">{milestone.title}</h3>
                <p className="mt-4 line-clamp-2 max-w-xl text-base leading-7 text-black/60 transition-[color,transform] duration-500 ease-out group-hover:translate-x-2 group-hover:text-black/75 sm:line-clamp-none md:mt-7 md:text-lg md:leading-relaxed">{milestone.description}</p>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
