"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useSectionProgress } from "@/components/animation/motion";
import { timeline } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;
const stepHeight = 98;
const pathHeight = 900;

function cubicPoint(start: number, controlA: number, controlB: number, end: number, time: number) {
  const inverse = 1 - time;
  return inverse ** 3 * start
    + 3 * inverse ** 2 * time * controlA
    + 3 * inverse * time ** 2 * controlB
    + time ** 3 * end;
}

function curveXAt(y: number) {
  if (y <= 326 || y >= 574) return 146;

  const firstHalf = y < 450;
  const start = firstHalf ? { x: 146, y: 326 } : { x: 127, y: 450 };
  const controlA = firstHalf ? { x: 146, y: 365 } : { x: 127, y: 515 };
  const controlB = firstHalf ? { x: 127, y: 385 } : { x: 146, y: 535 };
  const end = firstHalf ? { x: 127, y: 450 } : { x: 146, y: 574 };
  let low = 0;
  let high = 1;

  for (let index = 0; index < 12; index += 1) {
    const time = (low + high) / 2;
    const pointY = cubicPoint(start.y, controlA.y, controlB.y, end.y, time);
    if (pointY < y) low = time;
    else high = time;
  }

  return cubicPoint(start.x, controlA.x, controlB.x, end.x, (low + high) / 2);
}

const journeyTicks = Array.from({ length: 55 }, (_, index) => {
  const y = 18 + index * 16;
  const x = curveXAt(y);
  const length = index % 6 === 0 ? 22 : 10;
  return { x1: x - length - 4, x2: x - 4, y };
});

export function JourneySection() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(2);
  const [railHeight, setRailHeight] = useState(pathHeight);
  const reducedMotion = useReducedMotion();
  const progress = useSectionProgress(section, "top top", "bottom bottom", false);

  useMotionValueEvent(progress, "change", (latest) => {
    const next = Math.min(timeline.length - 1, Math.max(0, Math.round(latest * (timeline.length - 1))));
    setActive((previous) => previous === next ? previous : next);
    const scrollTime = reducedMotion ? 0 : latest * (timeline.length - 1) * 1.45;
    pulse.current?.style.setProperty("--journey-pulse-time", `${-scrollTime}s`);
  });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;

    const updateHeight = () => setRailHeight(element.getBoundingClientRect().height || pathHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const current = timeline[active];
  const mobileCurrent = timeline[mobileActive];

  return (
    <section
      ref={section}
      id="journey"
      data-header-theme="dark"
      className="journey-motion"
      aria-label="Entrepreneurial experience: The climb was never linear."
    >
      <div className="journey-motion__desktop">
        <div className="journey-motion__ambient" aria-hidden />
        <div className="container journey-motion__grid">
          <header className="journey-motion__intro">
            <h2>The climb was never linear.</h2>
            <p>Every venture added a new capability. Every setback sharpened the next decision. This is the path from first business to global products and technology.</p>
          </header>

          <div ref={rail} className="journey-motion__rail" aria-label={`Current milestone: ${current.year}`}>
            <svg className="journey-motion__path" viewBox="0 0 220 900" preserveAspectRatio="none" aria-hidden>
              <defs>
                <filter id="journey-neon" x="-80%" y="-20%" width="260%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="journey-line" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c8ff38" stopOpacity="0" />
                  <stop offset=".28" stopColor="#c8ff38" stopOpacity=".14" />
                  <stop offset=".4" stopColor="#c8ff38" stopOpacity=".46" />
                  <stop offset=".5" stopColor="#d9ff42" />
                  <stop offset=".6" stopColor="#c8ff38" stopOpacity=".46" />
                  <stop offset=".72" stopColor="#c8ff38" stopOpacity=".14" />
                  <stop offset="1" stopColor="#c8ff38" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="journey-motion__ticks">
                {journeyTicks.map((tick) => (
                  <line key={tick.y} x1={tick.x1} x2={tick.x2} y1={tick.y} y2={tick.y} />
                ))}
              </g>
              <path d="M146 0 V326 C146 365 127 385 127 450 C127 515 146 535 146 574 V900" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.25" />
              <path d="M146 0 V326 C146 365 127 385 127 450 C127 515 146 535 146 574 V900" fill="none" stroke="url(#journey-line)" strokeWidth="1.75" filter="url(#journey-neon)" />
            </svg>

            <motion.div
              className="journey-motion__years"
              initial={false}
              animate={{ y: -(active * stepHeight) - stepHeight / 2 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease }}
            >
              {timeline.map((milestone, index) => {
                const distance = Math.abs(active - index);
                const rowY = pathHeight / 2 + (index - active) * stepHeight * pathHeight / railHeight;
                const rowX = curveXAt(rowY);
                return (
                  <button
                    key={milestone.year}
                    type="button"
                    className={`journey-motion__year ${active === index ? "journey-motion__year--active" : ""}`}
                    style={{
                      opacity: Math.max(0.12, 1 - distance * 0.24),
                      width: `calc(${rowX / 2.2}% - 18px)`,
                    }}
                    onClick={() => {
                      const bounds = section.current?.getBoundingClientRect();
                      if (!bounds) return;
                      const sectionTop = window.scrollY + bounds.top;
                      const travel = Math.max(0, bounds.height - window.innerHeight);
                      window.scrollTo({ top: sectionTop + travel * (index / (timeline.length - 1)), behavior: reducedMotion ? "auto" : "smooth" });
                    }}
                    aria-label={`Show ${milestone.year}: ${milestone.title}`}
                    aria-current={active === index ? "step" : undefined}
                  >
                    <span>{milestone.year}</span>
                    <i aria-hidden />
                  </button>
                );
              })}
            </motion.div>

            <div ref={pulse} className="journey-motion__pulse" aria-hidden>
              <span>
                <svg viewBox="0 0 34 34" role="presentation">
                  <path d="M6 22.5 17 13l11 9.5" />
                  <path d="M6 16.5 17 7l11 9.5" />
                  <path d="M6 28.5 17 19l11 9.5" />
                </svg>
              </span>
            </div>
          </div>

          <div className="journey-motion__details" aria-live="polite">
            <motion.div
              key={`${current.year}-${current.title}`}
              initial={reducedMotion ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reducedMotion ? 0 : 0.55, ease }}
            >
              <p className="journey-motion__active-year">{current.year}</p>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="journey-motion__mobile container">
        <div className="journey-motion__ambient journey-motion__ambient--mobile" aria-hidden />
        <header>
          <h2><span>The climb was</span><span>never linear.</span></h2>
          <p>Every venture added a new capability. Every setback sharpened the next decision. This is the path from first business to global products and technology.</p>
        </header>
        <div className="journey-motion__mobile-timeline" aria-label={`Current milestone: ${mobileCurrent.year}`}>
          <svg viewBox="0 0 480 160" preserveAspectRatio="none" aria-hidden>
            <defs>
              <filter id="journey-mobile-neon" x="-20%" y="-120%" width="140%" height="340%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path className="journey-motion__mobile-line-shadow" d="M0 119 H145 C178 119 185 88 240 88 C295 88 302 119 335 119 H480" />
            <path className="journey-motion__mobile-line" d="M0 119 H145 C178 119 185 88 240 88 C295 88 302 119 335 119 H480" filter="url(#journey-mobile-neon)" />
          </svg>

          <div className="journey-motion__mobile-ticks" aria-hidden />
          {timeline.map((milestone, index) => {
            const distance = Math.abs(index - mobileActive);
            return (
              <button
                key={milestone.year}
                type="button"
                className={`journey-motion__mobile-year ${index === mobileActive ? "journey-motion__mobile-year--active" : ""}`}
                style={{
                  left: `calc(50% + ${(index - mobileActive) * 85}px)`,
                  top: distance % 2 === 0 ? 37 : 67,
                  opacity: Math.max(0.18, 1 - distance * 0.2),
                }}
                onClick={() => setMobileActive(index)}
                aria-label={`Show ${milestone.year}: ${milestone.title}`}
                aria-current={index === mobileActive ? "step" : undefined}
              >
                {milestone.year}
              </button>
            );
          })}

          <div className="journey-motion__mobile-pulse" aria-hidden>
            <span>
              <svg viewBox="0 0 34 34" role="presentation">
                <path d="M6 22.5 17 13l11 9.5" />
                <path d="M6 16.5 17 7l11 9.5" />
                <path d="M6 28.5 17 19l11 9.5" />
              </svg>
            </span>
          </div>
        </div>

        <motion.div
          key={`${mobileCurrent.year}-${mobileCurrent.title}`}
          className="journey-motion__mobile-detail"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45, ease }}
          aria-live="polite"
        >
          <p>{mobileCurrent.year}</p>
          <h3>{mobileCurrent.title}</h3>
          <p>{mobileCurrent.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
