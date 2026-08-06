"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { timeline } from "@/data/content";

const route = "M 55 430 C 125 402, 158 360, 220 348 S 315 382, 350 330 S 420 260, 485 286 S 575 240, 615 194 S 690 170, 730 118 S 805 92, 862 48";
const points = [
  [55, 430], [220, 348], [350, 330], [485, 286], [615, 194], [730, 118], [862, 48],
];

export function JourneySection() {
  const [active, setActive] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);

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
    <section className="relative border-y border-black/10 bg-[#edf0ef] text-[#091012]" aria-labelledby="journey-title">
      <div className="container grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="self-start py-24 lg:sticky lg:top-20 lg:flex lg:min-h-[calc(100svh-5rem)] lg:flex-col lg:py-10">
          <div>
            <p className="eyebrow !text-black/45">Entrepreneurial experience</p>
            <h2 id="journey-title" className="mt-7 max-w-3xl text-[clamp(3rem,5.7vw,6.2rem)] font-medium leading-[.88] tracking-[-.065em]">The climb was never linear.</h2>
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
            <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-black/35">Current chapter</p><p className="mt-1 text-lg">{timeline[active].year} · {timeline[active].title}</p></div>
            <p className="font-mono text-sm text-cyan-700">0{active + 1} / 0{timeline.length}</p>
          </div>
        </div>

        <div className="border-l border-black/10 lg:pl-10">
          {timeline.map((milestone, index) => (
            <article
              key={`${milestone.year}-${milestone.title}`}
              ref={(node) => { steps.current[index] = node; }}
              data-index={index}
              className="flex min-h-[52vh] items-center border-b border-black/10 py-16 last:border-b-0 lg:min-h-[62vh]"
            >
              <motion.div animate={{ opacity: active === index ? 1 : .48, x: active === index ? 0 : 16 }} transition={{ duration: .45 }} className="w-full">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-cyan-700">{milestone.year}</p>
                  <span className={`grid size-11 place-items-center rounded-full border transition-colors ${active === index ? "border-[#091012] bg-[#091012] text-white" : "border-black/15 text-black/35"}`}><ArrowUpRight size={16} /></span>
                </div>
                <h3 className="mt-8 text-[clamp(2.5rem,5vw,5.5rem)] leading-[.93] tracking-[-.055em]">{milestone.title}</h3>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-black/55 md:text-lg">{milestone.description}</p>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
