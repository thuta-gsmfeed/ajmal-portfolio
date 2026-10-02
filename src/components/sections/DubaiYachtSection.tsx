"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionSettings, useSectionProgress } from "@/components/animation/motion";
import { SectionTextReveal } from "@/components/animation/SectionTextReveal";

const features = [
  { label: "Luxury Service", icon: "/images/yachts/features/luxury-service.svg" },
  { label: "Flexible Plan", icon: "/images/yachts/features/flexible-plan.svg" },
  { label: "Professional Crew", icon: "/images/yachts/features/professional-crew.svg" },
  { label: "Experienced Captain", icon: "/images/yachts/features/experienced-captain.svg" },
] as const;

export function DubaiYachtSection() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobileVideo = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const [mobileStoryExpanded, setMobileStoryExpanded] = useState(false);
  const { reduced, lightweight } = useMotionSettings();
  const scrollYProgress = useSectionProgress(section, "top top", "bottom bottom", false);

  useEffect(() => {
    const element = video.current;
    const container = section.current;
    if (!element || !container || reduced || lightweight || matchMedia("(max-width: 767px)").matches) return;

    let frame = 0;
    let active = false;
    let lastSeek = 0;
    const frameDuration = 1 / 24;

    const requestRender = () => {
      if (active && !frame) frame = requestAnimationFrame(renderFrame);
    };

    const syncTarget = (progress: number) => {
      if (!Number.isFinite(element.duration)) return;
      targetTime.current = progress * Math.max(0, element.duration - 0.08);
      requestRender();
    };

    const onMetadata = () => {
      element.pause();
      syncTarget(scrollYProgress.get());
      const targetFrame = Math.round(targetTime.current / frameDuration) * frameDuration;
      if (Math.abs(element.currentTime - targetFrame) > frameDuration / 2) {
        element.currentTime = targetFrame;
      }
    };

    const onSeeked = () => {
      if (Math.abs(targetTime.current - element.currentTime) > frameDuration / 2) requestRender();
    };

    const renderFrame = (timestamp: number) => {
      frame = 0;
      if (!active) return;

      if (timestamp - lastSeek < 1000 / 24) {
        requestRender();
        return;
      }

      if (element.readyState >= 2 && Number.isFinite(element.duration)) {
        const targetFrame = Math.round(targetTime.current / frameDuration) * frameDuration;
        if (!element.seeking && Math.abs(targetFrame - element.currentTime) > frameDuration / 2) {
          element.currentTime = targetFrame;
        }
        lastSeek = timestamp;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && element.preload !== "auto") {
          element.preload = "auto";
          element.load();
        }
        if (active) requestRender();
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "0px" },
    );

    const unsubscribe = scrollYProgress.on("change", syncTarget);
    element.addEventListener("loadedmetadata", onMetadata);
    element.addEventListener("durationchange", onMetadata);
    element.addEventListener("seeked", onSeeked);
    observer.observe(container);
    if (element.readyState >= 1) onMetadata();

    return () => {
      unsubscribe();
      observer.disconnect();
      element.removeEventListener("loadedmetadata", onMetadata);
      element.removeEventListener("durationchange", onMetadata);
      element.removeEventListener("seeked", onSeeked);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, lightweight, scrollYProgress]);

  useEffect(() => {
    const container = section.current;
    if (!container) return;
    const query = matchMedia("(max-width: 767px) and (prefers-reduced-motion: no-preference)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      container.classList.toggle("yacht-section--reveal-ready", query.matches);
      if (!query.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      container.querySelectorAll("[data-yacht-mobile-reveal]").forEach((block) => observer?.observe(block));
    };
    setup();
    query.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      query.removeEventListener("change", setup);
      container.classList.remove("yacht-section--reveal-ready");
    };
  }, []);

  useEffect(() => {
    const clip = mobileVideo.current;
    const media = section.current?.querySelector(".yacht-stage__media");
    if (!clip || !media || reduced || lightweight) return;
    const query = matchMedia("(max-width: 767px)");
    let visible = false;
    const syncPlayback = () => {
      if (query.matches && visible && !document.hidden) {
        clip.preload = "auto";
        clip.play().catch(() => {});
      } else {
        clip.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(media);
    query.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      clip.pause();
    };
  }, [reduced, lightweight]);

  return (
    <section
      ref={section}
      id="yachts"
      className={`yacht-section relative bg-[#02070a] ${reduced ? "" : "h-[250svh]"}`}
      aria-label="Dubai Marina Yachts"
      data-header-theme="dark"
    >
      <div className={`yacht-stage relative ${reduced ? "min-h-svh" : "sticky top-0 h-svh"} overflow-hidden bg-[#02070a] text-white`}>
        <div className="yacht-stage__media" data-yacht-mobile-reveal>
          {lightweight || reduced ? (
            <Image
              src="/images/dubai-marina-yachts-poster.jpg"
              alt="Dubai Marina yacht cruising across the sea"
              fill
              sizes="100vw"
              className="yacht-stage__visual yacht-stage__desktop-visual object-cover"
            />
          ) : (
            <>
              <video
                ref={video}
                muted
                playsInline
                preload="none"
                poster="/images/dubai-marina-yachts-poster.jpg"
                aria-label="Dubai Marina yacht cruising across the sea"
                className="yacht-stage__visual yacht-stage__desktop-video absolute inset-0 size-full object-cover"
              >
                <source src="/videos/dubai-marina-yachts-scroll.mp4" type="video/mp4" />
              </video>

            </>
          )}
          <Image
            src="/images/dubai-marina-yachts-poster.jpg"
            alt="Luxury yacht cruising through the waters of Dubai"
            fill
            sizes="(max-width: 767px) 100vw, 1px"
            className="yacht-stage__mobile-poster object-cover"
          />
          {!reduced && !lightweight && (
            <video
              ref={mobileVideo}
              muted
              loop
              playsInline
              preload="none"
              poster="/images/dubai-marina-yachts-poster.jpg"
              aria-hidden="true"
              className="yacht-stage__mobile-video"
              onPlaying={(event) => event.currentTarget.classList.add("is-visible")}
              onError={(event) => event.currentTarget.classList.remove("is-visible")}
            >
              <source src="/videos/dubai-marina-yachts-scroll.mp4" type="video/mp4" />
            </video>
          )}
          <div className="yacht-stage__shade pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="yacht-stage__mobile-intro">
            <Image src="/images/logo/dubai-marina-yachts-logo.svg" alt="Dubai Marina Yachts" width={246} height={36} className="yacht-stage__logo h-auto" data-section-reveal="up" />
            <div className="yacht-stage__mobile-headline">
              <h2 className="yacht-stage__title">Experience Unmatched <em>Luxury</em> with Dubai Marina Yachts.</h2>
              <a className="yacht-stage__mobile-link" href="https://dubaimarinayachts.ae/" target="_blank" rel="noopener noreferrer">
                <Image src="/images/logo/yachts-logo.svg" alt="" aria-hidden="true" width={22} height={22} className="yacht-stage__explore-icon" />
                Explore
              </a>
            </div>
          </div>
        </div>

        <div className="yacht-stage__content relative z-10 flex h-full flex-col justify-center">
          <Image
            src="/images/logo/dubai-marina-yachts-logo.svg"
            alt="Dubai Marina Yachts"
            width={246}
            height={36}
            className="yacht-stage__logo yacht-stage__desktop-intro h-auto"
            data-section-reveal="up"
          />
          <h2 className="yacht-stage__title yacht-stage__desktop-intro" aria-label="Experience Unmatched Luxury with Dubai Marina Yachts." data-gradient-reveal>
            Experience Unmatched<br />Luxury with Dubai<br />Marina Yachts.
          </h2>
          <div className="yacht-stage__mobile-story" data-yacht-mobile-reveal>
            <p>
              Set sail into matchless luxury with Dubai Marina Yachts – Your trusted partner for the Ultimate Arabian Getaway.{" "}
              <button
                type="button"
                className="yacht-stage__story-toggle"
                aria-expanded={mobileStoryExpanded}
                aria-controls="yacht-mobile-story-more"
                onClick={() => setMobileStoryExpanded((expanded) => !expanded)}
              >
                {mobileStoryExpanded ? "See less" : "See more"}
              </button>
            </p>
            <motion.div
              id="yacht-mobile-story-more"
              className="yacht-stage__story-more"
              initial={false}
              animate={{ height: mobileStoryExpanded ? "auto" : 0, opacity: mobileStoryExpanded ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={!mobileStoryExpanded}
              onAnimationComplete={() => ScrollTrigger.refresh()}
            >
              <p>We are offering yachts for any occasion and demand. From weddings, engagements, celebrations, and parties to fun on the sea by sailing on the pristine waters of the Arabian Sea or even fishing, we promise a catch for you.</p>
            </motion.div>
          </div>
          <p className="yacht-stage__description" data-gradient-reveal>
            Set sail into matchless luxury with Dubai Marina Yachts – Your trusted partner for the Ultimate Arabian Getaway. We are offering yachts for any occasion and demand. From weddings, engagements, celebrations, and parties to fun on the sea by sailing on the pristine waters of the Arabian Sea or even fishing, we promise a catch for you.
          </p>
          <ul className="yacht-stage__features" aria-label="Yacht services">
            {features.map(({ label, icon }) => (
              <li key={label} data-mobile-reveal-group>
                <Image src={icon} alt="" width={33} height={33} className="yacht-stage__feature-icon" aria-hidden="true" />
                <span className="section-gradient-reveal-line" data-gradient-reveal="static">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SectionTextReveal rootId="yachts" />
    </section>
  );
}
