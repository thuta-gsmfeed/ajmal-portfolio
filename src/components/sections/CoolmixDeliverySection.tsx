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
  { label: "Inventory scale", title: "Stock when needed", body: "A substantial product range helps partners respond quickly to changing market demand.", word: "READY" },
  { label: "Partner support", title: "Built for long-term trade", body: "Responsive service and trusted relationships support every order beyond the delivery itself.", word: "CONNECTED" },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function CoolmixDeliverySection() {
  const section = useRef<HTMLElement>(null);
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
        const vehicleY = roadY - vehicleHeight * 0.831;
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

        // The wheel-face centres are measured from the source image. Rotate only the
        // inner alloy area so the tyre, lighting and wheel arch remain visually fixed.
        const wheelRotation = currentProgress * Math.PI * 28;
        const drawWheelFace = (sourceX: number, sourceY: number, face: HTMLCanvasElement | undefined) => {
          if (!face) return;
          const wheelX = vehicleX + sourceX * vehicleScale;
          const wheelY = vehicleY + bob + sourceY * vehicleScale;
          const wheelFaceRadius = 76 * vehicleScale;

          context.save();
          context.beginPath();
          context.arc(wheelX, wheelY, wheelFaceRadius, 0, Math.PI * 2);
          context.clip();
          context.translate(wheelX, wheelY);
          context.rotate(wheelRotation);
          context.globalAlpha = 0.94;
          context.drawImage(face, -wheelFaceRadius, -wheelFaceRadius, wheelFaceRadius * 2, wheelFaceRadius * 2);
          context.restore();
        };

        if (currentSpeed > 0.015) {
          drawWheelFace(401, 679, wheelFaces[0]);
          drawWheelFace(1484, 679, wheelFaces[1]);
        }

        const decalX = vehicleX + vehicleWidth * 0.36;
        const decalY = vehicleY + bob + vehicleHeight * 0.35;
        const symbolSize = vehicleWidth * 0.047;
        context.save();
        if (logoLoaded) context.drawImage(logo, decalX, decalY, symbolSize, symbolSize * 1.1);
        context.fillStyle = "#0071e3";
        context.font = `600 ${Math.max(13, vehicleWidth * 0.043)}px ${fontSans}`;
        context.textBaseline = "middle";
        context.fillText("coolmix", decalX + symbolSize * 1.18, decalY + symbolSize * 0.55);
        context.restore();

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
      const wheelFaceSize = 152;
      wheelFaces = [[401, 679], [1484, 679]].map(([centerX, centerY]) => {
        const face = document.createElement("canvas");
        face.width = wheelFaceSize;
        face.height = wheelFaceSize;
        face.getContext("2d")?.drawImage(
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
        return face;
      });
      vanLoaded = true;
      setCanvasReady(true);
      draw.current?.();
    };
    van.onerror = () => setCanvasFailed(true);
    logo.onload = () => { logoLoaded = true; draw.current?.(); };
    van.src = "/images/coolmix-delivery/van-side.png";
    logo.src = "/images/logo/coolmix-logo.svg";
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
      const cards = cardElements.current.filter(Boolean);
      let activeCard = -1;
      const updateCards = (value: number) => {
        const nextActiveCard = Math.min(chapters.length - 1, Math.floor(value * chapters.length));
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
      return () => { trigger.kill(); progress.current = 0; lastProgress.current = 0; velocity.current = 0; };
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
    addTrackMotion("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", -50);
    addTrackMotion("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", -75);
    addTrackMotion("(max-width: 767px) and (prefers-reduced-motion: no-preference)", -87.5);
    return () => media.revert();
  }, { scope: section });

  return (
    <section ref={section} id="coolmix-delivery" className="coolmix-delivery coolmix-delivery--rail" aria-label="Coolmix delivery journey" data-no-section-transition>
      <div className="coolmix-delivery__stage">
        <canvas ref={canvas} className={`coolmix-delivery__canvas ${canvasReady ? "is-ready" : ""}`} aria-hidden="true" />
        {(!canvasReady || canvasFailed) && (
          <div className="coolmix-delivery__visual-fallback" aria-hidden="true">
            <Image src="/images/coolmix-delivery/van-side.png" alt="" width={1774} height={887} />
          </div>
        )}
        <div className="coolmix-delivery__topbar">
          <div className="coolmix-delivery__brand" aria-label="Coolmix">
            <Image src="/images/logo/coolmix-logo.svg" alt="" width={40} height={44} />
            <span>coolmix</span>
          </div>
          <p>Devices in motion</p>
        </div>
        <span ref={speedLabel} className="coolmix-delivery__speed" aria-hidden="true">00 KM/H</span>
        <div className="coolmix-delivery__service-panel">
          <div ref={cardTrack} className="coolmix-delivery__service-track">
            {chapters.map((chapter, index) => (
              <article key={chapter.label} ref={(node) => { cardElements.current[index] = node; }} className="coolmix-delivery__service-card">
                <p>{chapter.label}</p>
                <h2>{chapter.title}</h2>
                <span>{chapter.body}</span>
              </article>
            ))}
          </div>
        </div>
        <p className="sr-only">A Coolmix delivery journey from trusted sourcing and quality control through international logistics to reliable delivery.</p>
      </div>

      <div className="coolmix-delivery__reduced">
        <div className="coolmix-delivery__reduced-brand">
          <Image src="/images/logo/coolmix-logo.svg" alt="" width={44} height={49} />
          <span>coolmix</span>
        </div>
        <Image className="coolmix-delivery__reduced-van" src="/images/coolmix-delivery/van-side.png" alt="Coolmix delivery van" width={1774} height={887} />
        <div className="coolmix-delivery__reduced-list">
          {chapters.map((chapter) => (
            <article key={`reduced-${chapter.label}`}>
              <span>{chapter.label}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
