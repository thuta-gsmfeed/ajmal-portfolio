"use client";

import { useEffect, useRef } from "react";

const targets = [
  { word: "Vision.", x: 0, y: 0, radius: 88 },
  { word: "Trust.", x: 60, y: -17, radius: 82 },
  { word: "Consistency.", x: 122, y: 18, radius: 96 },
  { word: "Execution.", x: 184, y: -19, radius: 92 },
  { word: "Progress.", x: 246, y: 0, radius: 96, final: true },
] as const;

const distractors = [
  { word: "Doubt", x: 16, y: -47 },
  { word: "Noise", x: 30, y: 37 },
  { word: "Fear", x: 44, y: 13 },
  { word: "Delay", x: 57, y: -53 },
  { word: "Pressure", x: 71, y: 48 },
  { word: "Risk", x: 84, y: -7 },
  { word: "Friction", x: 97, y: 41 },
  { word: "Hesitation", x: 109, y: 25 },
  { word: "Setback", x: 122, y: -49 },
  { word: "Rush", x: 135, y: 51 },
  { word: "Uncertainty", x: 148, y: -39 },
  { word: "Distraction", x: 160, y: 2 },
  { word: "Worry", x: 172, y: -50 },
  { word: "Regret", x: 184, y: 43 },
  { word: "Stress", x: 196, y: 28 },
  { word: "Shame", x: 207, y: -49 },
  { word: "Panic", x: 218, y: 42 },
  { word: "Anger", x: 227, y: -4 },
  { word: "Grief", x: 237, y: -46 },
  { word: "Drift", x: 247, y: 46 },
  { word: "Hate", x: 257, y: -39 },
  { word: "Maybe", x: 268, y: 35 },
] as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const magnifierStyles = String.raw`
  .magnifier-reveal {
    --found: oklch(0.86 0.2 155);
    position: relative;
    height: 750svh;
    background: oklch(0.08 0 0);
    color: white;
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
  }
  .magnifier-reveal::after { display: none; }
  .magnifier-stage {
    position: sticky;
    top: 0;
    height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 50% 50%, rgba(255,255,255,.018), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(54,255,151,.028), transparent 38%),
      oklch(0.08 0 0);
  }
  .magnifier-stage::before {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 8vmin 8vmin;
    mask-image: radial-gradient(circle at center, black, transparent 74%);
  }
  .magnifier-sentence {
    position: absolute;
    z-index: 7;
    top: clamp(82px, 10vh, 112px);
    left: 50%;
    width: min(1080px, calc(100% - 48px));
    margin: 0;
    translate: -50% 0;
    color: rgba(255,255,255,.18);
    font-size: clamp(1.7rem, 3.25vw, 3.9rem);
    font-weight: 500;
    letter-spacing: -.045em;
    line-height: 1.04;
    text-align: center;
    text-wrap: balance;
    pointer-events: none;
  }
  .magnifier-sentence-word {
    display: inline-block;
    margin-right: .22em;
    opacity: .18;
    transform: translate3d(0, 8px, 0);
    color: rgba(255,255,255,.62);
    transition: none;
    will-change: transform, opacity, color, text-shadow;
  }
  .magnifier-sentence-word[data-final="true"] { margin-right: 0; }
  .magnifier-kicker {
    position: absolute;
    z-index: 7;
    top: clamp(35px, 4.5vh, 50px);
    left: 50%;
    display: flex;
    align-items: center;
    gap: 10px;
    translate: -50% 0;
    color: rgba(255,255,255,.44);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .17em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .magnifier-kicker::before {
    content: "";
    width: 26px;
    height: 1px;
    background: var(--found);
    box-shadow: 0 0 12px color-mix(in oklch, var(--found), transparent 30%);
  }
  .magnifier-world {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    transform-origin: 0 0;
    pointer-events: none;
    will-change: transform;
  }
  .magnifier-bubble {
    position: absolute;
    display: grid;
    place-items: center;
    translate: -50% -50%;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 999px;
    background: rgba(255,255,255,.018);
    box-shadow: inset 0 0 28px rgba(255,255,255,.012);
    color: rgba(255,255,255,.23);
    font-size: clamp(11px, 1.2vmin, 15px);
    font-weight: 450;
    letter-spacing: -.015em;
    white-space: nowrap;
    will-change: transform, color, border-color, background-color, box-shadow;
  }
  .magnifier-bubble[data-kind="target"] {
    color: rgba(255,255,255,.3);
    font-size: clamp(13px, 1.5vmin, 18px);
    font-weight: 540;
  }
  .magnifier-halo {
    position: absolute;
    z-index: -1;
    inset: -36%;
    border-radius: 50%;
    opacity: 0;
    background: radial-gradient(circle, rgba(255,255,255,.18), rgba(255,255,255,.055) 35%, transparent 72%);
    filter: blur(12px);
    will-change: opacity;
  }
  .magnifier-bubble[data-final="true"] .magnifier-halo {
    background: radial-gradient(circle, color-mix(in oklch, var(--found), transparent 58%), color-mix(in oklch, var(--found), transparent 86%) 42%, transparent 72%);
  }
  .magnifier-lens {
    position: absolute;
    z-index: 5;
    top: 50%;
    left: 50%;
    width: clamp(310px, 27vw, 380px);
    height: clamp(310px, 27vw, 380px);
    translate: -50% -50%;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 18px 24px rgba(0,0,0,.55));
  }
  .magnifier-lens-glass {
    fill: rgba(255,255,255,.025);
    stroke: rgba(255,255,255,.92);
    stroke-width: 2.5;
  }
  .magnifier-lens-ring {
    fill: none;
    stroke: rgba(255,255,255,.16);
    stroke-width: 1;
  }
  .magnifier-lens-handle-shadow {
    stroke: rgba(0,0,0,.55);
    stroke-width: 17;
    stroke-linecap: round;
  }
  .magnifier-lens-handle {
    stroke: rgba(235,240,239,.9);
    stroke-width: 11;
    stroke-linecap: round;
  }
  .magnifier-lens-handle-core {
    stroke: rgba(255,255,255,.18);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .magnifier-scroll-hint {
    position: absolute;
    z-index: 7;
    bottom: clamp(25px, 4vh, 42px);
    left: 50%;
    display: flex;
    align-items: center;
    gap: 10px;
    translate: -50% 0;
    color: rgba(255,255,255,.36);
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 9px;
    letter-spacing: .16em;
    text-transform: uppercase;
    pointer-events: none;
    will-change: opacity, transform;
  }
  .magnifier-scroll-hint::after {
    content: "↓";
    color: var(--found);
    font-size: 12px;
  }
  .magnifier-progress {
    position: absolute;
    z-index: 7;
    right: clamp(18px, 2.5vw, 38px);
    bottom: clamp(25px, 4vh, 42px);
    width: clamp(72px, 8vw, 112px);
    height: 1px;
    overflow: hidden;
    background: rgba(255,255,255,.1);
  }
  .magnifier-progress > span {
    display: block;
    width: 100%;
    height: 100%;
    transform: scaleX(0);
    transform-origin: left;
    background: var(--found);
    box-shadow: 0 0 10px color-mix(in oklch, var(--found), transparent 25%);
    will-change: transform;
  }
  body.magnifier-card-mode {
    overflow: hidden !important;
    background: oklch(0.08 0 0);
  }
  body.magnifier-card-mode header,
  body.magnifier-card-mode footer,
  body.magnifier-card-mode .skip-link,
  body.magnifier-card-mode main > section:not(.magnifier-reveal) {
    display: none !important;
  }
  body.magnifier-card-mode .magnifier-reveal { height: 100svh; }
  @media (max-width: 767px) {
    .magnifier-sentence {
      top: 95px;
      width: calc(100% - 32px);
      font-size: clamp(1.65rem, 7vw, 2.35rem);
      line-height: 1.08;
    }
    .magnifier-kicker { top: 48px; font-size: 8px; letter-spacing: .14em; }
    .magnifier-lens { width: 270px; height: 270px; }
    .magnifier-bubble { font-size: 11px; }
    .magnifier-bubble[data-kind="target"] { font-size: 13px; }
    .magnifier-progress { right: 16px; bottom: 28px; width: 58px; }
    .magnifier-scroll-hint { bottom: 27px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .magnifier-reveal { height: 100svh; }
    .magnifier-sentence-word { will-change: auto; }
    .magnifier-world, .magnifier-bubble, .magnifier-scroll-hint { will-change: auto; }
    .magnifier-scroll-hint, .magnifier-progress { display: none; }
  }
`;

export function MagnifierRevealSection() {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const world = wrapper.querySelector<HTMLElement>("[data-magnifier-world]");
    const hint = wrapper.querySelector<HTMLElement>("[data-magnifier-hint]");
    const progressBar = wrapper.querySelector<HTMLElement>("[data-magnifier-progress]");
    const targetNodes = Array.from(
      wrapper.querySelectorAll<HTMLElement>('[data-kind="target"]'),
    );
    const distractorNodes = Array.from(
      wrapper.querySelectorAll<HTMLElement>('[data-kind="distractor"]'),
    );
    const sentenceWords = Array.from(
      wrapper.querySelectorAll<HTMLElement>("[data-sentence-word]"),
    );

    if (!world || !hint || !progressBar) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cardMode = new URLSearchParams(window.location.search).has("card");
    const dwell = 0.55 / targets.length;
    const startTime = performance.now() + (cardMode ? 2000 : 0);
    let frame = 0;

    [...targetNodes, ...distractorNodes].forEach((node) => {
      const x = Number(node.dataset.x ?? 0);
      const y = Number(node.dataset.y ?? 0);
      const radius = Number(node.dataset.radius ?? 76);
      node.style.left = `${x}vmin`;
      node.style.top = `${y}vmin`;
      node.style.width = `${radius * 2}px`;
      node.style.height = `${radius * 2}px`;
    });

    if (cardMode) {
      document.body.classList.add("magnifier-card-mode");
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    }

    const render = (progress: number, now: number) => {
      const p = clamp(progress);
      const f = p * (targets.length - 1);
      const index = Math.min(targets.length - 2, Math.floor(f));
      const t = smoothstep(f - index);
      const from = targets[index];
      const to = targets[index + 1];
      const cameraX = from.x + (to.x - from.x) * t;
      const cameraY = from.y + (to.y - from.y) * t;

      world.style.transform = `translate3d(calc(50vw - ${cameraX}vmin), calc(50vh - ${cameraY}vmin), 0)`;
      progressBar.style.transform = `scaleX(${p})`;

      const hintFade = 1 - smoothstep(p / 0.04);
      hint.style.opacity = `${hintFade}`;
      hint.style.transform = `translate3d(0, ${8 * (1 - hintFade)}px, 0)`;

      targetNodes.forEach((node, targetIndex) => {
        const center = (targetIndex + 0.5) / targets.length;
        const proximity = 1 - Math.abs(p - center) / dwell;
        const isFinal = targetIndex === targets.length - 1;
        const glow = isFinal && p >= center ? 1 : smoothstep(proximity);
        const phase = targetIndex * 0.73;
        const driftX = reducedMotion ? 0 : Math.sin(now / 2400 + phase) * (2.5 + (targetIndex % 4) * 1.1);
        const driftY = reducedMotion ? 0 : Math.cos(now / 2800 + phase) * (2 + (targetIndex % 3) * 0.9);
        const green = isFinal;

        node.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) scale(${1 + glow * 0.055})`;
        node.style.color = green
          ? `color-mix(in oklch, var(--found) ${30 + glow * 70}%, rgba(255,255,255,.28))`
          : `rgba(255,255,255,${0.3 + glow * 0.7})`;
        node.style.borderColor = green
          ? `color-mix(in oklch, var(--found) ${12 + glow * 43}%, transparent)`
          : `rgba(255,255,255,${0.09 + glow * 0.3})`;
        node.style.backgroundColor = green
          ? `color-mix(in oklch, var(--found) ${glow * 9}%, rgba(255,255,255,.018))`
          : `rgba(255,255,255,${0.018 + glow * 0.045})`;
        node.style.boxShadow = green
          ? `inset 0 0 28px rgba(255,255,255,.025), 0 0 ${34 * glow}px color-mix(in oklch, var(--found), transparent 72%)`
          : `inset 0 0 28px rgba(255,255,255,.018), 0 0 ${28 * glow}px rgba(255,255,255,${0.1 * glow})`;
        node.style.textShadow = green
          ? `0 0 ${20 * glow}px color-mix(in oklch, var(--found), transparent 8%)`
          : `0 0 ${16 * glow}px rgba(255,255,255,${0.82 * glow})`;

        const halo = node.querySelector<HTMLElement>("[data-halo]");
        if (halo) halo.style.opacity = `${glow}`;
      });

      distractorNodes.forEach((node, distractorIndex) => {
        const phase = distractorIndex * 0.61 + 0.4;
        const driftX = reducedMotion ? 0 : Math.sin(now / 2400 + phase) * (2.2 + (distractorIndex % 5) * 0.85);
        const driftY = reducedMotion ? 0 : Math.cos(now / 2800 + phase) * (1.8 + (distractorIndex % 4) * 0.7);
        node.style.transform = `translate3d(${driftX}px, ${driftY}px, 0)`;
      });

      sentenceWords.forEach((word, wordIndex) => {
        const beat = (wordIndex + 0.5) / targets.length;
        const reveal = smoothstep((p - (beat - 0.02)) / 0.06);
        const final = wordIndex === targets.length - 1;
        word.style.opacity = `${0.18 + reveal * 0.82}`;
        word.style.transform = `translate3d(0, ${8 * (1 - reveal)}px, 0)`;
        word.style.color = final
          ? `color-mix(in oklch, var(--found) ${35 + reveal * 65}%, rgba(255,255,255,.42))`
          : `rgba(255,255,255,${0.62 + reveal * 0.38})`;
        word.style.textShadow = final
          ? `0 0 ${22 * reveal}px color-mix(in oklch, var(--found), transparent 24%)`
          : "none";
      });
    };

    const tick = (now: number) => {
      if (reducedMotion) {
        render(0, startTime);
        return;
      }

      let p: number;
      if (cardMode) {
        p = clamp((now - startTime) / 8200);
      } else {
        const bounds = wrapper.getBoundingClientRect();
        p = clamp(-bounds.top / Math.max(1, bounds.height - window.innerHeight));
      }

      render(p, now);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove("magnifier-card-mode");
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      id="focus"
      className="magnifier-reveal"
      data-card-loop-ms="9600"
      data-no-section-transition
      aria-labelledby="magnifier-sentence"
    >
      <style>{magnifierStyles}</style>
      <div className="magnifier-stage">
        <p className="magnifier-kicker">Focus shapes the outcome</p>

        <h2 id="magnifier-sentence" className="magnifier-sentence">
          {targets.map((target, index) => (
            <span
              key={target.word}
              data-sentence-word
              data-final={index === targets.length - 1 ? "true" : undefined}
              className="magnifier-sentence-word"
            >
              {target.word}
            </span>
          ))}
        </h2>

        <div className="magnifier-world" data-magnifier-world aria-hidden="true">
          {distractors.map((item, index) => (
            <span
              key={`${item.word}-${index}`}
              className="magnifier-bubble"
              data-kind="distractor"
              data-x={item.x}
              data-y={item.y}
              data-radius={58 + (index % 5) * 5}
            >
              {item.word}
            </span>
          ))}

          {targets.map((target, index) => (
            <span
              key={target.word}
              className="magnifier-bubble"
              data-kind="target"
              data-x={target.x}
              data-y={target.y}
              data-radius={target.radius}
              data-final={index === targets.length - 1 ? "true" : undefined}
            >
              <span className="magnifier-halo" data-halo />
              {target.word}
            </span>
          ))}
        </div>

        <svg
          className="magnifier-lens"
          viewBox="-150 -150 300 300"
          aria-hidden="true"
        >
          <line className="magnifier-lens-handle-shadow" x1="68" y1="68" x2="132" y2="132" />
          <line className="magnifier-lens-handle" x1="68" y1="68" x2="132" y2="132" />
          <line className="magnifier-lens-handle-core" x1="74" y1="74" x2="126" y2="126" />
          <circle className="magnifier-lens-glass" cx="0" cy="0" r="96" />
          <circle className="magnifier-lens-ring" cx="0" cy="0" r="88" />
        </svg>

        <span className="magnifier-scroll-hint" data-magnifier-hint>
          Scroll to find what matters
        </span>
        <span className="magnifier-progress" aria-hidden="true">
          <span data-magnifier-progress />
        </span>
      </div>
    </section>
  );
}
