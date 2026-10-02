"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textParallax } from "@/components/animation/textParallax";
import { timeline } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;
const stepHeight = 98;
const mobileYearGap = 85;
const pathHeight = 900;
const pathTrim = 90;
const ticksPerYear = 14;
const yearTickLength = 22;
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

function getJourneyTicks(railHeight: number) {
  // Fourteen equal tick intervals between year rows keep every connector aligned.
  const tickStep = (stepHeight / ticksPerYear) * pathHeight / railHeight;
  const halfCount = Math.ceil((pathHeight / 2 - pathTrim) / tickStep);
  return Array.from({ length: halfCount * 2 + 1 }, (_, index) => {
    const offset = index - halfCount;
    const y = pathHeight / 2 + offset * tickStep;
    const x = curveXAt(y);
    const length = offset % (ticksPerYear / 2) === 0 ? yearTickLength : 10;
    return { x1: x - length, x2: x, y };
  }).filter(({ y }) => y >= pathTrim && y <= pathHeight - pathTrim);
}

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

function parallaxJourneyBlocks(blocks: HTMLElement[]) {
  return blocks.map((block) => textParallax(block, block));
}

function JourneyDetail({ milestone, mobile = false, animateOnScroll = false }: { milestone: (typeof timeline)[number]; mobile?: boolean; animateOnScroll?: boolean }) {
  const detail = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!animateOnScroll || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !detail.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const match = gsap.matchMedia();
    match.add(mobile ? "(max-width: 900px)" : "(min-width: 901px)", () => {
      if (!detail.current) return;
      const blocks = Array.from(detail.current.children) as HTMLElement[];
      const animations = parallaxJourneyBlocks(blocks);
      return () => animations.forEach((animation) => animation.kill());
    });
    return () => match.revert();
  }, { scope: detail, dependencies: [animateOnScroll], revertOnUpdate: true });

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
  const mobileRail = useRef<HTMLDivElement>(null);
  const mobileSelected = useRef(2);
  const mobileScrollAnimationPending = useRef(false);
  const mobileStopMomentum = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(0);
  const [desktopInteracted, setDesktopInteracted] = useState(false);
  const [desktopPulseRun, setDesktopPulseRun] = useState(0);
  const [mobileActive, setMobileActive] = useState(2);
  const [mobileInteracted, setMobileInteracted] = useState(false);
  const [mobilePulseRun, setMobilePulseRun] = useState(0);
  const [railHeight, setRailHeight] = useState(pathHeight);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const match = gsap.matchMedia();
    const addIntro = (query: string, selector: string) => match.add(query, () => {
      const header = section.current?.querySelector<HTMLElement>(selector);
      if (!header) return;
      const blocks = Array.from(header.children) as HTMLElement[];
      const animations = parallaxJourneyBlocks(blocks);
      return () => animations.forEach((animation) => animation.kill());
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

  useEffect(() => {
    const scroller = mobileRail.current;
    if (!scroller) return;
    const years = Array.from(scroller.querySelectorAll<HTMLButtonElement>(".journey-motion__mobile-year"));
    let frame = 0;
    let settleTimer = 0;
    let initialized = false;
    let lastOffset = mobileSelected.current * mobileYearGap;
    let mouseDrag: { x: number; offset: number } | null = null;
    let touching = false;
    let dragged = false;
    const dragSpeed = 0.5;
    let momentumFrame = 0;
    let touchDrag: { x: number; y: number; offset: number; axis: "x" | "y" | null; time: number; velocity: number } | null = null;
    const stopMomentum = () => {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    };
    mobileStopMomentum.current = stopMomentum;

    const paintYears = () => {
      frame = 0;
      const position = scroller.scrollLeft / mobileYearGap;
      years.forEach((year, index) => {
        const distance = index - position;
        const y = mobileCurveYAt(240 + distance * mobileYearGap) - 52;
        year.style.transform = `translateY(${y}px)`;
        year.style.opacity = `${Math.max(0.18, 1 - Math.abs(distance) * 0.2)}`;
      });
    };
    const settle = () => {
      if (mouseDrag || touching || momentumFrame) return;
      const index = Math.min(timeline.length - 1, Math.max(0, Math.round(scroller.scrollLeft / mobileYearGap)));
      mobileSelected.current = index;
      setMobileActive(index);
      const target = index * mobileYearGap;
      if (Math.abs(scroller.scrollLeft - target) > 0.5) {
        scroller.scrollTo({
          left: target,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
        return;
      }
      if (mobileScrollAnimationPending.current) {
        mobileScrollAnimationPending.current = false;
        setMobilePulseRun((previous) => previous + 1);
      }
    };
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 160);
    };
    const onScroll = () => {
      if (!initialized) return;
      if (Math.abs(scroller.scrollLeft - lastOffset) > 0.5) {
        setMobileInteracted(true);
        if (touching) mobileScrollAnimationPending.current = true;
      }
      lastOffset = scroller.scrollLeft;
      if (!frame) frame = requestAnimationFrame(paintYears);
      scheduleSettle();
    };
    const resize = () => {
      if (!scroller.clientWidth) return;
      scroller.style.setProperty("--journey-mobile-width", `${scroller.clientWidth}px`);
      scroller.scrollLeft = lastOffset;
      initialized = true;
      paintYears();
    };
    // Scale horizontal gestures while keeping vertical page scrolling native.
    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      stopMomentum();
      dragged = false;
      window.clearTimeout(settleTimer);
      mouseDrag = { x: event.clientX, offset: scroller.scrollLeft };
      scroller.scrollTo({ left: scroller.scrollLeft, behavior: "instant" });
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!mouseDrag) return;
      const distance = event.clientX - mouseDrag.x;
      if (!dragged && Math.abs(distance) < 4) return;
      if (!dragged) {
        dragged = true;
        mobileScrollAnimationPending.current = true;
        setMobileInteracted(true);
        setMobilePulseRun(0);
      }
      event.preventDefault();
      scroller.scrollLeft = mouseDrag.offset - distance * dragSpeed;
    };
    const onMouseUp = () => {
      if (!mouseDrag) return;
      mouseDrag = null;
      scheduleSettle();
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      stopMomentum();
      dragged = false;
      const touch = event.touches[0];
      touchDrag = { x: touch.clientX, y: touch.clientY, offset: scroller.scrollLeft, axis: null, time: event.timeStamp, velocity: 0 };
      touching = true;
      setMobileInteracted(true);
      setMobilePulseRun(0);
      window.clearTimeout(settleTimer);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touchDrag || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - touchDrag.x;
      const dy = touch.clientY - touchDrag.y;
      if (!touchDrag.axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        touchDrag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (touchDrag.axis !== "x") return;
      if (event.cancelable) event.preventDefault();
      dragged = true;
      mobileScrollAnimationPending.current = true;
      const previous = scroller.scrollLeft;
      scroller.scrollLeft = touchDrag.offset - dx * dragSpeed;
      const elapsed = Math.max(1, event.timeStamp - touchDrag.time);
      touchDrag.velocity = Math.max(-0.35, Math.min(0.35, (scroller.scrollLeft - previous) / elapsed));
      touchDrag.time = event.timeStamp;
    };
    const onTouchEnd = (event: TouchEvent) => {
      touching = false;
      let speed = touchDrag?.axis === "x" && event.timeStamp - touchDrag.time < 80 ? touchDrag.velocity : 0;
      touchDrag = null;
      if (event.type === "touchcancel" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(speed) < 0.012) {
        scheduleSettle();
        return;
      }
      let previousTime = performance.now();
      const coast = (time: number) => {
        const elapsed = Math.min(32, time - previousTime);
        previousTime = time;
        const previousOffset = scroller.scrollLeft;
        scroller.scrollLeft += speed * elapsed;
        speed *= Math.exp(-elapsed / 140);
        if (Math.abs(speed) < 0.012 || Math.abs(scroller.scrollLeft - previousOffset) < 0.1) {
          momentumFrame = 0;
          scheduleSettle();
          return;
        }
        momentumFrame = requestAnimationFrame(coast);
      };
      momentumFrame = requestAnimationFrame(coast);
    };
    const onWheel = (event: WheelEvent) => {
      if (!event.deltaX && !event.shiftKey) return;
      if (!event.cancelable) return;
      event.preventDefault();
      stopMomentum();
      const pixels = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      scroller.scrollLeft += (event.deltaX || event.deltaY) * pixels * dragSpeed;
      mobileScrollAnimationPending.current = true;
      setMobileInteracted(true);
      setMobilePulseRun(0);
      scheduleSettle();
    };
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(scroller);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("mousedown", onMouseDown);
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("touchcancel", onTouchEnd, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    scroller.addEventListener("click", onClick, true);
    resize();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("mousedown", onMouseDown);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      scroller.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      scroller.removeEventListener("click", onClick, true);
      cancelAnimationFrame(frame);
      stopMomentum();
      mobileStopMomentum.current = null;
      window.clearTimeout(settleTimer);
    };
  }, []);

  const current = timeline[active];
  const mobileCurrent = timeline[mobileActive];
  const journeyTicks = getJourneyTicks(railHeight);
  const showDesktopMilestone = (index: number) => {
    setDesktopInteracted(true);
    setDesktopPulseRun((previous) => previous + 1);
    setActive(index);
  };
  const showMobileMilestone = (index: number) => {
    mobileStopMomentum.current?.();
    mobileScrollAnimationPending.current = false;
    setMobileInteracted(true);
    setMobilePulseRun((previous) => previous + 1);
    setMobileActive(index);
    mobileSelected.current = index;
    mobileRail.current?.scrollTo({ left: index * mobileYearGap, behavior: reducedMotion ? "instant" : "smooth" });
  };
  const handleMobileKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    showMobileMilestone(Math.min(timeline.length - 1, Math.max(0, mobileSelected.current + (event.key === "ArrowRight" ? 1 : -1))));
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
              {timeline.map((milestone, visualIndex) => {
                const offset = visualIndex - active;
                const isVisible = offset >= -1 && offset <= 2;
                const rowY = pathHeight / 2 + offset * stepHeight * pathHeight / railHeight;
                const rowX = curveXAt(rowY);
                return (
                  <button
                    key={`${milestone.year}-${visualIndex}`}
                    type="button"
                    className={`journey-motion__year ${offset === 0 ? "journey-motion__year--active" : ""}`}
                    style={{
                      opacity: isVisible ? 1 - Math.abs(offset) * 0.24 : 0,
                      visibility: isVisible ? "visible" : "hidden",
                      pointerEvents: isVisible ? "auto" : "none",
                      width: `${(rowX - yearTickLength) / 2.2}%`,
                    }}
                    onClick={() => showDesktopMilestone(visualIndex)}
                    aria-label={`Show ${milestone.year}: ${milestone.title}`}
                    aria-current={offset === 0 ? "step" : undefined}
                    aria-hidden={!isVisible}
                    tabIndex={isVisible ? 0 : -1}
                  >
                    <span>{milestone.year}</span>
                    <i aria-hidden />
                  </button>
                );
              })}
            </motion.div>

            <button
              key={`desktop-pulse-${desktopPulseRun}`}
              type="button"
              className={`journey-motion__pulse ${desktopPulseRun > 0 && !reducedMotion ? "journey-motion__pulse--activated" : ""}`}
              aria-label={nextMilestoneLabel(active)}
              onClick={() => showDesktopMilestone(nextMilestone(active))}
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
            <JourneyDetail key={`${current.year}-${current.title}`} milestone={current} animateOnScroll={!desktopInteracted} />
          </div>
        </div>
      </div>

      <div className="journey-motion__mobile container">
        <header>
          <h2><span>The climb was</span><span>never linear.</span></h2>
          <p>Every venture added a new capability. Every setback sharpened the next decision. This is the path from first business to global products and technology.</p>
        </header>
        <div
          className="journey-motion__mobile-timeline"
          aria-label={`Current milestone: ${mobileCurrent.year}. Swipe left or right to explore.`}
          onKeyDown={handleMobileKeyDown}
          tabIndex={0}
        >
          <div className="journey-motion__mobile-center-glow" aria-hidden />
          <svg viewBox="0 0 480 160" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="journey-mobile-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#98c92e" stopOpacity=".18" />
                <stop offset=".24" stopColor="#b9ef3a" stopOpacity=".5" />
                <stop offset=".5" stopColor="#e5ff4d" />
                <stop offset=".76" stopColor="#b9ef3a" stopOpacity=".5" />
                <stop offset="1" stopColor="#98c92e" stopOpacity=".18" />
              </linearGradient>
            </defs>
            <path className="journey-motion__mobile-line-glow" d={mobileJourneyPath} stroke="url(#journey-mobile-line)" />
            <path className="journey-motion__mobile-line-shadow" d={mobileJourneyPath} />
            <path className="journey-motion__mobile-line" d={mobileJourneyPath} stroke="url(#journey-mobile-line)" />
            <g className="journey-motion__mobile-ticks" aria-hidden>
              {mobileJourneyTicks.map((tick) => (
                <line key={tick.x} x1={tick.x} x2={tick.x} y1={tick.y1} y2={tick.y2} />
              ))}
            </g>
          </svg>

          <div
            ref={mobileRail}
            className="journey-motion__mobile-years"
          >
            <div className="journey-motion__mobile-year-track">
              {timeline.map((milestone, index) => (
                <button
                  key={milestone.year}
                  type="button"
                  className={`journey-motion__mobile-year ${index === mobileActive ? "journey-motion__mobile-year--active" : ""}`}
                  onClick={() => showMobileMilestone(index)}
                  aria-label={`Show ${milestone.year}: ${milestone.title}`}
                  aria-current={index === mobileActive ? "step" : undefined}
                >
                  {milestone.year}
                </button>
              ))}
            </div>
          </div>

          <button
            key={`mobile-pulse-${mobilePulseRun}`}
            type="button"
            className={`journey-motion__mobile-pulse ${mobilePulseRun > 0 && !reducedMotion ? "journey-motion__mobile-pulse--activated" : ""}`}
            aria-label={nextMilestoneLabel(mobileActive)}
            onClick={() => showMobileMilestone(nextMilestone(mobileActive))}
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

        <JourneyDetail key={`${mobileCurrent.year}-${mobileCurrent.title}`} milestone={mobileCurrent} mobile animateOnScroll={!mobileInteracted} />
      </div>
    </section>
  );
}
