"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { motion, type PanInfo, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { timeline } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;
const stepHeight = 98;
const pathHeight = 900;
const pathTrim = 90;
const journeyPath = `M146 ${pathTrim} V326 C146 365 127 385 127 450 C127 515 146 535 146 574 V${pathHeight - pathTrim}`;
const mobileJourneyPath = "M0 119 H150 C184 119 195 92 240 92 C285 92 296 119 330 119 H480";

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
}).filter(({ y }) => y >= pathTrim && y <= pathHeight - pathTrim);

function mobileCurveYAt(x: number) {
  if (x <= 150 || x >= 330) return 119;

  const firstHalf = x < 240;
  const start = firstHalf ? { x: 150, y: 119 } : { x: 240, y: 92 };
  const controlA = firstHalf ? { x: 184, y: 119 } : { x: 285, y: 92 };
  const controlB = firstHalf ? { x: 195, y: 92 } : { x: 296, y: 119 };
  const end = firstHalf ? { x: 240, y: 92 } : { x: 330, y: 119 };
  let low = 0;
  let high = 1;

  for (let index = 0; index < 12; index += 1) {
    const time = (low + high) / 2;
    const pointX = cubicPoint(start.x, controlA.x, controlB.x, end.x, time);
    if (pointX < x) low = time;
    else high = time;
  }

  return cubicPoint(start.y, controlA.y, controlB.y, end.y, (low + high) / 2);
}

const mobileJourneyTicks = Array.from({ length: 33 }, (_, index) => {
  const x = index * 15;
  const y = mobileCurveYAt(x);
  const length = index === 16 ? 20 : index % 8 === 0 ? 14 : 8;
  return { x, y1: y - length - 7, y2: y - 7 };
});

const nextMilestone = (index: number) => (index + 1) % timeline.length;
const nextMilestoneLabel = (index: number) => index === timeline.length - 1
  ? `Restart timeline at ${timeline[0].year}`
  : `Next milestone: ${timeline[index + 1].year}`;

function revealJourneyBlocks(blocks: HTMLElement[], trigger: HTMLElement) {
  return blocks.map((block, index) => SplitText.create(block, {
    type: "lines",
    linesClass: "journey-reveal-line",
    autoSplit: true,
    aria: "auto",
    onSplit: (split) => gsap.fromTo(split.lines,
      { "--bg-progress": 30 },
      {
        "--bg-progress": 100,
        duration: 1.55,
        delay: index * 0.08,
        ease: "none",
        scrollTrigger: { trigger, start: "top 95%", toggleActions: "play none none none" },
      },
    ),
  }));
}

function JourneyDetail({ milestone, mobile = false }: { milestone: (typeof timeline)[number]; mobile?: boolean }) {
  const detail = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !detail.current) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const blocks = Array.from(detail.current.children) as HTMLElement[];
    const splits = revealJourneyBlocks(blocks, detail.current);
    return () => splits.forEach((split) => split.revert());
  }, { scope: detail });

  return (
    <div ref={detail} className={mobile ? "journey-motion__mobile-detail" : undefined} aria-live="polite">
      <p className={mobile ? undefined : "journey-motion__active-year"}>{milestone.year}</p>
      <h3>{milestone.title}</h3>
      <p>{milestone.description}</p>
    </div>
  );
}

export function JourneySection() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(2);
  const [railHeight, setRailHeight] = useState(pathHeight);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const match = gsap.matchMedia();
    const addIntro = (query: string, selector: string) => match.add(query, () => {
      const header = section.current?.querySelector<HTMLElement>(selector);
      if (!header) return;
      const blocks = Array.from(header.children) as HTMLElement[];
      const splits = revealJourneyBlocks(blocks, header);
      return () => splits.forEach((split) => split.revert());
    });

    addIntro("(min-width: 901px) and (prefers-reduced-motion: no-preference)", ".journey-motion__intro");
    addIntro("(max-width: 900px) and (prefers-reduced-motion: no-preference)", ".journey-motion__mobile > header");
    return () => match.revert();
  }, { scope: section });
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
  const handleMobileSwipe = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeIntent = info.offset.x + info.velocity.x * 0.16;
    if (Math.abs(swipeIntent) < 42) return;
    setMobileActive((previous) => Math.min(
      timeline.length - 1,
      Math.max(0, previous + (swipeIntent < 0 ? 1 : -1)),
    ));
  };
  const handleMobileKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setMobileActive((previous) => Math.min(
      timeline.length - 1,
      Math.max(0, previous + (event.key === "ArrowRight" ? 1 : -1)),
    ));
  };

  return (
    <section
      ref={section}
      id="journey"
      data-header-theme="dark"
      className="journey-motion"
      aria-label="Entrepreneurial experience: The climb was never linear."
    >
      <div className="journey-motion__desktop">
        <div className="container journey-motion__grid">
          <header className="journey-motion__intro">
            <h2>The climb was<br />never linear.</h2>
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
              <path d={journeyPath} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.25" />
              <path d={journeyPath} fill="none" stroke="url(#journey-line)" strokeWidth="1.75" filter="url(#journey-neon)" />
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
                    onClick={() => setActive(index)}
                    aria-label={`Show ${milestone.year}: ${milestone.title}`}
                    aria-current={active === index ? "step" : undefined}
                  >
                    <span>{milestone.year}</span>
                    <i aria-hidden />
                  </button>
                );
              })}
            </motion.div>

            <button
              key={active}
              type="button"
              className="journey-motion__pulse"
              aria-label={nextMilestoneLabel(active)}
              onClick={() => setActive(nextMilestone)}
            >
              <span>
                <svg viewBox="0 0 34 34" role="presentation">
                  <path d="M6 22.5 17 13l11 9.5" />
                  <path d="M6 16.5 17 7l11 9.5" />
                  <path d="M6 28.5 17 19l11 9.5" />
                </svg>
              </span>
            </button>
          </div>

          <div className="journey-motion__details">
            <JourneyDetail key={`${current.year}-${current.title}`} milestone={current} />
          </div>
        </div>
      </div>

      <div className="journey-motion__mobile container">
        <header>
          <h2><span>The climb was</span><span>never linear.</span></h2>
          <p>Every venture added a new capability. Every setback sharpened the next decision. This is the path from first business to global products and technology.</p>
        </header>
        <motion.div
          className="journey-motion__mobile-timeline"
          aria-label={`Current milestone: ${mobileCurrent.year}. Swipe left or right to explore.`}
          onPanEnd={handleMobileSwipe}
          onKeyDown={handleMobileKeyDown}
          tabIndex={0}
        >
          <div className="journey-motion__mobile-center-glow" aria-hidden />
          <svg viewBox="0 0 480 160" preserveAspectRatio="none" aria-hidden>
            <defs>
              <filter id="journey-mobile-neon" x="-20%" y="-120%" width="140%" height="340%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="journey-mobile-halo" x="-20%" y="-180%" width="140%" height="460%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <linearGradient id="journey-mobile-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#98c92e" stopOpacity=".18" />
                <stop offset=".24" stopColor="#b9ef3a" stopOpacity=".5" />
                <stop offset=".5" stopColor="#e5ff4d" />
                <stop offset=".76" stopColor="#b9ef3a" stopOpacity=".5" />
                <stop offset="1" stopColor="#98c92e" stopOpacity=".18" />
              </linearGradient>
            </defs>
            <path className="journey-motion__mobile-line-glow" d={mobileJourneyPath} stroke="url(#journey-mobile-line)" filter="url(#journey-mobile-halo)" />
            <path className="journey-motion__mobile-line-shadow" d={mobileJourneyPath} />
            <path className="journey-motion__mobile-line" d={mobileJourneyPath} stroke="url(#journey-mobile-line)" filter="url(#journey-mobile-neon)" />
            <g className="journey-motion__mobile-ticks" aria-hidden>
              {mobileJourneyTicks.map((tick) => (
                <line key={tick.x} x1={tick.x} x2={tick.x} y1={tick.y1} y2={tick.y2} />
              ))}
            </g>
          </svg>

          {timeline.map((milestone, index) => {
            const distance = Math.abs(index - mobileActive);
            return (
              <button
                key={milestone.year}
                type="button"
                className={`journey-motion__mobile-year ${index === mobileActive ? "journey-motion__mobile-year--active" : ""}`}
                style={{
                  left: `calc(50% + ${(index - mobileActive) * 85}px)`,
                  top: mobileCurveYAt(240 + (index - mobileActive) * 85) - 52,
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

          <button
            key={`mobile-pulse-${mobileActive}`}
            type="button"
            className="journey-motion__mobile-pulse"
            aria-label={nextMilestoneLabel(mobileActive)}
            onClick={() => setMobileActive(nextMilestone)}
          >
            <span>
              <svg viewBox="0 0 34 34" role="presentation">
                <path d="M6 22.5 17 13l11 9.5" />
                <path d="M6 16.5 17 7l11 9.5" />
                <path d="M6 28.5 17 19l11 9.5" />
              </svg>
            </span>
          </button>
        </motion.div>

        <JourneyDetail key={`${mobileCurrent.year}-${mobileCurrent.title}`} milestone={mobileCurrent} mobile />
      </div>
    </section>
  );
}
