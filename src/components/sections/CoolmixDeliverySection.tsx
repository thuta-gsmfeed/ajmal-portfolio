"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const chapters = [
  { label: "Trusted sourcing", title: "Premium devices", body: "Reliable access to quality used Apple devices through established European supply relationships.", word: "SOURCED" },
  { label: "Quality control", title: "Every device checked", body: "A disciplined quality process at every handoff, built around consistency and trust.", word: "CHECKED" },
  { label: "International logistics", title: "Across borders", body: "Inventory moves through a connected distribution network with speed and operational clarity.", word: "MOVING" },
  { label: "Reliable delivery", title: "Delivered with confidence", body: "From warehouse to destination, every shipment closes the loop with dependable execution.", word: "DELIVERED" },
  { label: "Device grading", title: "Consistent standards", body: "Clear grading makes every device easier to evaluate, compare, and move with confidence.", word: "GRADED" },
  { label: "Secure packaging", title: "Ready for transit", body: "Protective handling and careful preparation keep every shipment secure from pickup to arrival.", word: "PACKED" },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function CoolmixDeliverySection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const transitionWipe = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const speedLabel = useRef<HTMLSpanElement>(null);
  const cardTrack = useRef<HTMLDivElement>(null);
  const cardElements = useRef<Array<HTMLElement | null>>([]);
  const progress = useRef(0);
  const velocity = useRef(0);
  const lastProgress = useRef(0);
  const frame = useRef<number>(0);
  const draw = useRef<(() => void) | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);

  useEffect(() => {
    const canvasElement = canvas.current;
    if (!canvasElement) return;
    const context = canvasElement.getContext("2d");
    if (!context) {
      setCanvasFailed(true);
      return;
    }

    const van = new window.Image();
    const logo = new window.Image();
    let vanLoaded = false;
    let logoLoaded = false;
    let active = false;
    let disposed = false;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let wheelFaces: HTMLCanvasElement[] = [];
    let speedResetTimer = 0;
    const fontSans = window.getComputedStyle(document.body).fontFamily || 'Inter, "Helvetica Neue", Arial, sans-serif';

    const resize = () => {
      const bounds = canvasElement.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 1.25);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      draw.current?.();
    };

    const render = () => {
      if (disposed) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const roadY = height * 0.875;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, roadY);

      const currentProgress = clamp(progress.current);
      const currentSpeed = clamp(velocity.current * 42);
      const wordSize = Math.min(width * (width < 700 ? 0.23 : 0.205), height * 0.42);
      const wordSpacing = width * (width < 700 ? 1.12 : 0.94);
      const wordX = width * 0.1 - currentProgress * wordSpacing * (chapters.length - 1);
      context.save();
      context.fillStyle = "#eef0f2";
      context.font = `600 ${wordSize}px ${fontSans}`;
      context.textBaseline = "middle";
      chapters.forEach((chapter, index) => context.fillText(chapter.word, wordX + index * wordSpacing, height * 0.49));
      context.restore();

      if (vanLoaded) {
        const vehicleWidth = Math.min(width < 700 ? width * 0.72 : width * 0.41, 650);
        const vehicleHeight = vehicleWidth * (van.naturalHeight / van.naturalWidth);
        const vehicleScale = vehicleWidth / van.naturalWidth;
        const travel = Math.sin(currentProgress * Math.PI * 2) * Math.min(14, width * 0.012);
        const vehicleX = width * 0.5 - vehicleWidth * 0.5 + travel;
        const vehicleY = roadY - vehicleHeight * 0.895;
        const bob = Math.sin(currentProgress * Math.PI * 34) * currentSpeed * 1.6;

        context.save();
        context.globalAlpha = 0.08 + currentSpeed * 0.16;
        context.strokeStyle = "#0071e3";
        context.lineWidth = 1.15;
        for (let trail = 0; trail < 4; trail += 1) {
          const trailY = vehicleY + vehicleHeight * (0.42 + trail * 0.1);
          context.beginPath();
          context.moveTo(vehicleX - 18, trailY);
          context.lineTo(vehicleX - vehicleWidth * (0.1 + currentSpeed * (0.12 + trail * 0.025)), trailY);
          context.stroke();
        }
        context.restore();

        context.save();
        context.fillStyle = `rgba(8,15,20,${0.08 + currentSpeed * 0.03})`;
        context.beginPath();
        context.ellipse(vehicleX + vehicleWidth * 0.52, roadY - 3, vehicleWidth * 0.4, vehicleHeight * 0.035, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.drawImage(van, vehicleX, vehicleY + bob, vehicleWidth, vehicleHeight);

        // Rotate a softly masked copy of each rim. The tyre and wheel arch stay in the
        // base image, which prevents square crop edges and keeps the road contact solid.
        const wheelRotation = currentProgress * Math.PI * 28;
        const drawWheelFace = (sourceX: number, sourceY: number, face: HTMLCanvasElement | undefined) => {
          if (!face) return;
          const wheelX = vehicleX + sourceX * vehicleScale;
          const wheelY = vehicleY + bob + sourceY * vehicleScale;
          const wheelFaceRadius = (face.width / 2) * vehicleScale;

          context.save();
          context.translate(wheelX, wheelY);
          context.rotate(wheelRotation);
          context.drawImage(face, -wheelFaceRadius, -wheelFaceRadius, wheelFaceRadius * 2, wheelFaceRadius * 2);
          context.restore();
        };

        // Keep the rotated faces mounted after scrolling stops. Removing this layer at
        // zero velocity makes the wheels visibly snap back to the source-image angle.
        drawWheelFace(356, 746, wheelFaces[0]);
        drawWheelFace(1310, 746, wheelFaces[1]);

        if (logoLoaded) {
          const decalWidth = vehicleWidth * 0.3;
          const decalHeight = decalWidth * (logo.naturalHeight / logo.naturalWidth);
          const decalX = vehicleX + vehicleWidth * 0.21;
          const decalY = vehicleY + bob + vehicleHeight * 0.345;
          context.save();
          context.filter = "brightness(0) invert(1)";
          context.drawImage(logo, decalX, decalY, decalWidth, decalHeight);
          context.restore();
        }

        if (speedLabel.current) {
          const displayedSpeed = Math.round(currentSpeed * 80);
          speedLabel.current.textContent = `${String(displayedSpeed).padStart(2, "0")} KM/H`;
          window.clearTimeout(speedResetTimer);
          if (displayedSpeed > 0) {
            speedResetTimer = window.setTimeout(() => {
              if (speedLabel.current) speedLabel.current.textContent = "00 KM/H";
              velocity.current = 0;
              draw.current?.();
            }, 140);
          }
        }
        velocity.current = 0;
      }
    };

    const requestDraw = () => {
      if (disposed || !active || frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        render();
      });
    };

    draw.current = requestDraw;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      if (active) requestDraw();
    });
    const resizeObserver = new ResizeObserver(resize);
    intersectionObserver.observe(section.current ?? canvasElement);
    resizeObserver.observe(canvasElement);

    van.onload = () => {
      const wheelFaceSize = 176;
      wheelFaces = [[356, 746], [1310, 746]].map(([centerX, centerY]) => {
        const face = document.createElement("canvas");
        face.width = wheelFaceSize;
        face.height = wheelFaceSize;
        const faceContext = face.getContext("2d");
        faceContext?.drawImage(
          van,
          centerX - wheelFaceSize / 2,
          centerY - wheelFaceSize / 2,
          wheelFaceSize,
          wheelFaceSize,
          0,
          0,
          wheelFaceSize,
          wheelFaceSize,
        );
        if (faceContext) {
          const radius = wheelFaceSize / 2;
          const mask = faceContext.createRadialGradient(radius, radius, 0, radius, radius, radius);
          mask.addColorStop(0, "rgba(0,0,0,1)");
          mask.addColorStop(0.72, "rgba(0,0,0,1)");
          mask.addColorStop(0.9, "rgba(0,0,0,.94)");
          mask.addColorStop(1, "rgba(0,0,0,0)");
          faceContext.globalCompositeOperation = "destination-in";
          faceContext.fillStyle = mask;
          faceContext.fillRect(0, 0, wheelFaceSize, wheelFaceSize);
          faceContext.globalCompositeOperation = "source-over";
        }
        return face;
      });
      vanLoaded = true;
      setCanvasReady(true);
      draw.current?.();
    };
    van.onerror = () => setCanvasFailed(true);
    logo.onload = () => { logoLoaded = true; draw.current?.(); };
    van.src = "/images/coolmix-delivery/step-van-v2.webp";
    logo.src = "/images/logo/logo-white.svg";
    resize();

    return () => {
      disposed = true;
      active = false;
      cancelAnimationFrame(frame.current);
      window.clearTimeout(speedResetTimer);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      draw.current = null;
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = gsap.fromTo(
        transitionWipe.current,
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 100%)",
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 92%",
            end: "top 18%",
            scrub: 0.5,
          },
        },
      );
      const cards = cardElements.current.filter(Boolean);
      let activeCard = -1;
      const updateCards = (value: number) => {
        const nextActiveCard = Math.round(value * (chapters.length - 1));
        if (nextActiveCard === activeCard) return;
        activeCard = nextActiveCard;
        cards.forEach((card, index) => gsap.to(card, { opacity: index === activeCard ? 1 : 0.32, y: index === activeCard ? -10 : 0, duration: 0.35, ease: "power2.out", overwrite: true }));
      };
      const trigger = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = self.progress;
          velocity.current = Math.max(velocity.current, Math.abs(next - lastProgress.current));
          lastProgress.current = next;
          progress.current = next;
          updateCards(next);
          draw.current?.();
        },
        onRefresh: (self) => { progress.current = self.progress; updateCards(self.progress); draw.current?.(); },
      });
      updateCards(0);
      return () => { reveal.kill(); trigger.kill(); progress.current = 0; lastProgress.current = 0; velocity.current = 0; };
    });

    const addTrackMotion = (query: string, xPercent: number) => media.add(query, () => {
      if (!cardTrack.current) return;
      const tween = gsap.to(cardTrack.current, {
        xPercent,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.35 },
      });
      return () => tween.kill();
    });
    addTrackMotion("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", -33.3333);
    addTrackMotion("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", -66.6667);
    addTrackMotion("(max-width: 767px) and (prefers-reduced-motion: no-preference)", -83.3333);
    return () => media.revert();
  }, { scope: section });

  return (
    <section ref={section} id="coolmix-delivery" data-header-theme="light" className="coolmix-delivery coolmix-delivery--rail" aria-label="Coolmix delivery journey" data-no-section-transition>
      <div ref={stage} className="coolmix-delivery__stage">
        <div ref={transitionWipe} data-header-theme="dark" className="coolmix-delivery__transition-wipe" aria-hidden="true" />
        <canvas ref={canvas} className={`coolmix-delivery__canvas ${canvasReady ? "is-ready" : ""}`} aria-hidden="true" />
        {(!canvasReady || canvasFailed) && (
          <div className="coolmix-delivery__visual-fallback" aria-hidden="true">
            <Image src="/images/coolmix-delivery/step-van-v2.webp" alt="" width={1636} height={961} />
            <Image className="coolmix-delivery__fallback-decal" src="/images/logo/logo-white.svg" alt="" width={411} height={88} />
          </div>
        )}
        <div className="coolmix-delivery__topbar">
          <div className="coolmix-delivery__brand" aria-label="Coolmix">
            <Image src="/images/logo/logo-white.svg" alt="" width={411} height={88} />
          </div>
        </div>
        <span ref={speedLabel} className="coolmix-delivery__speed" aria-hidden="true">00 KM/H</span>
        <div data-header-theme="dark" className="coolmix-delivery__service-panel">
          <div ref={cardTrack} className="coolmix-delivery__service-track">
            {chapters.map((chapter, index) => (
              <article key={chapter.label} ref={(node) => { cardElements.current[index] = node; }} className="coolmix-delivery__service-card">
                <p>{chapter.label}</p>
                <h2>{chapter.title}</h2>
                <span>{chapter.body}</span>
              </article>
            ))}
          </div>
          <a
            className="coolmix-delivery__website-link"
            href="https://coolmix.eu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Coolmix website (opens in a new tab)"
          >
            <span>Visit Coolmix</span>
          </a>
        </div>
        <p className="sr-only">A Coolmix delivery journey from trusted sourcing and quality control through international logistics to reliable delivery.</p>
      </div>

      <div className="coolmix-delivery__reduced">
        <div className="coolmix-delivery__reduced-brand">
          <Image src="/images/logo/coolmix-logo.svg" alt="" width={44} height={49} />
          <span>coolmix</span>
        </div>
        <div className="coolmix-delivery__reduced-van-wrap">
          <Image className="coolmix-delivery__reduced-van" src="/images/coolmix-delivery/step-van-v2.webp" alt="Coolmix delivery van" width={1636} height={961} />
          <Image className="coolmix-delivery__reduced-decal" src="/images/logo/logo-white.svg" alt="" width={411} height={88} />
        </div>
        <div className="coolmix-delivery__reduced-list">
          {chapters.map((chapter) => (
            <article key={`reduced-${chapter.label}`}>
              <span>{chapter.label}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.body}</p>
            </article>
          ))}
        </div>
        <a
          className="coolmix-delivery__website-link coolmix-delivery__website-link--reduced"
          href="https://coolmix.eu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Visit Coolmix</span>
        </a>
      </div>
    </section>
  );
}
