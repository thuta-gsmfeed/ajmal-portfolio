"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { icon: "/images/coolmix-delivery/experience.svg", value: "12+", label: "Years of experience", detail: "(since 2014)" },
  { icon: "/images/coolmix-delivery/satisfaction.svg", value: "100%", label: "Customer satisfaction", detail: "guaranteed" },
  { icon: "/images/coolmix-delivery/devices.svg", value: "2.300.000+", label: "Devices Sold", detail: "Worldwide" },
  { icon: "/images/coolmix-delivery/clients.svg", value: "700+", label: "Active wholesale", detail: "clients globally" },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function CoolmixServiceContent() {
  return (
    <div className="coolmix-delivery__service-track">
      <div className="coolmix-delivery__headline">
        <h2 data-section-reveal="up"><span>Europe’s trusted</span><br />Apple Distributor<br />since 2014</h2>
        <a href="https://coolmix.eu/" target="_blank" rel="noopener noreferrer">
          Visit website <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="coolmix-delivery__overview">
        <h3 data-section-reveal="up">Global Mobile Distribution</h3>
        <p data-section-reveal="up" data-reveal-order="1">Coolmix is a global mobile trading and distribution company specializing in Apple devices, serving professional buyers across international markets.</p>
      </div>
      {stats.map((stat, index) => (
        <div className="coolmix-delivery__stat" key={stat.value} data-section-reveal="up" data-reveal-order={index % 3}>
          <Image src={stat.icon} alt="" width={48} height={48} aria-hidden="true" />
          <strong>{stat.value}</strong>
          <p>{stat.label}<br />{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function CoolmixDeliverySection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
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
    let vanLoaded = false;
    let active = false;
    let disposed = false;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let wheelFaces: HTMLCanvasElement[] = [];

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

      if (vanLoaded) {
        const vehicleWidth = Math.min(width < 700 ? width * 0.72 : width * 0.41, 650);
        const vehicleHeight = vehicleWidth * (van.naturalHeight / van.naturalWidth);
        const vehicleScale = vehicleWidth / van.naturalWidth;
        const travel = Math.sin(currentProgress * Math.PI * 2) * Math.min(14, width * 0.012);
        const vehicleX = width * 0.5 - vehicleWidth * 0.5 + travel;
        const vehicleY = roadY - vehicleHeight;
        const bob = Math.sin(currentProgress * Math.PI * 34) * currentSpeed * 1.6;

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
        drawWheelFace(785, 1535, wheelFaces[0]);
        drawWheelFace(1315, 1535, wheelFaces[1]);
        drawWheelFace(3820, 1535, wheelFaces[2]);

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
      const wheelFaceSize = 230;
      wheelFaces = [[785, 1535], [1315, 1535], [3820, 1535]].map(([centerX, centerY]) => {
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
    van.src = "/images/coolmix-delivery/coolmix-truck.webp";
    resize();

    return () => {
      disposed = true;
      active = false;
      cancelAnimationFrame(frame.current);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      draw.current = null;
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
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
          draw.current?.();
        },
        onRefresh: (self) => { progress.current = self.progress; draw.current?.(); },
      });
      return () => { trigger.kill(); progress.current = 0; lastProgress.current = 0; velocity.current = 0; };
    });

    const addTrackMotion = (query: string, xPercent: number, hold = 0) => media.add(query, () => {
      const track = section.current?.querySelector<HTMLElement>(".coolmix-delivery__stage .coolmix-delivery__service-track");
      if (!track) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.35 },
      });
      if (hold > 0) timeline.to(track, { xPercent: 0, duration: hold, ease: "none" });
      timeline.to(track, { xPercent, duration: 1 - hold, ease: "none" });
      return () => timeline.kill();
    });
    addTrackMotion("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", -24.2424, 0.3);
    addTrackMotion("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", -66.6667);
    addTrackMotion("(max-width: 767px) and (prefers-reduced-motion: no-preference)", -75);
    return () => media.revert();
  }, { scope: section });

  return (
    <section ref={section} id="coolmix-delivery" data-header-theme="light" className="coolmix-delivery coolmix-delivery--rail" aria-label="Coolmix delivery journey" data-no-section-transition>
      <div ref={stage} className="coolmix-delivery__stage">
        <canvas ref={canvas} className={`coolmix-delivery__canvas ${canvasReady ? "is-ready" : ""}`} aria-hidden="true" />
        {(!canvasReady || canvasFailed) && (
          <div className="coolmix-delivery__visual-fallback" aria-hidden="true">
            <Image src="/images/coolmix-delivery/coolmix-truck.webp" alt="" width={4627} height={1762} />
          </div>
        )}
        <div data-header-theme="dark" className="coolmix-delivery__service-panel">
          <CoolmixServiceContent />
        </div>
      </div>

      <div className="coolmix-delivery__reduced">
        <div className="coolmix-delivery__reduced-brand">
          <Image src="/images/logo/coolmix-logo.svg" alt="" width={44} height={49} />
          <span>coolmix</span>
        </div>
        <div className="coolmix-delivery__reduced-van-wrap">
          <Image className="coolmix-delivery__reduced-van" src="/images/coolmix-delivery/coolmix-truck.webp" alt="Blue Coolmix delivery truck" width={4627} height={1762} />
        </div>
        <div className="coolmix-delivery__service-panel coolmix-delivery__service-panel--reduced">
          <CoolmixServiceContent />
        </div>
      </div>
    </section>
  );
}
