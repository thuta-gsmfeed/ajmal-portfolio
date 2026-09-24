"use client";

import Image from "next/image";
import { Gem, ShipWheel, SlidersHorizontal, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings, useSectionProgress } from "@/components/animation/motion";

const features = [
  { label: "Luxury Service", icon: Gem },
  { label: "Flexible Plan", icon: SlidersHorizontal },
  { label: "Professional Crew", icon: UsersRound },
  { label: "Experienced Captain", icon: ShipWheel },
] as const;

export function DubaiYachtSection() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobileVideos = useRef<(HTMLVideoElement | null)[]>([]);
  const [visibleMobileVideo, setVisibleMobileVideo] = useState(0);
  const targetTime = useRef(0);
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
    const clips = mobileVideos.current;
    if (!container || reduced || lightweight || !matchMedia("(max-width: 767px)").matches || clips.some((clip) => !clip)) return;

    let active = 0;
    let transitioning = false;
    let fadeTimer = 0;
    const fadeDuration = 550;
    const start = () => clips[active]?.play().catch(() => {});
    const crossfade = () => {
      if (transitioning) return;
      const next = 1 - active;
      const incoming = clips[next];
      const outgoing = clips[active];
      if (!incoming || !outgoing) return;
      transitioning = true;
      incoming.currentTime = 0;
      incoming.play().then(() => {
        setVisibleMobileVideo(next);
        fadeTimer = window.setTimeout(() => {
          outgoing.pause();
          outgoing.currentTime = 0;
          active = next;
          transitioning = false;
        }, fadeDuration);
      }).catch(() => { transitioning = false; });
    };
    const onTimeUpdate = (index: number) => {
      const clip = clips[index];
      if (index === active && clip && Number.isFinite(clip.duration) && clip.duration - clip.currentTime <= .7) crossfade();
    };
    const onEnded = (index: number) => { if (index === active) crossfade(); };
    const timeHandlers = clips.map((clip, index) => {
      const time = () => onTimeUpdate(index);
      const ended = () => onEnded(index);
      clip?.addEventListener("timeupdate", time);
      clip?.addEventListener("ended", ended);
      return { clip, time, ended };
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clips.forEach((clip) => { if (clip) clip.preload = "auto"; });
        start();
      } else {
        clips.forEach((clip) => clip?.pause());
      }
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.clearTimeout(fadeTimer);
      timeHandlers.forEach(({ clip, time, ended }) => {
        clip?.removeEventListener("timeupdate", time);
        clip?.removeEventListener("ended", ended);
        clip?.pause();
      });
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
        <div className="yacht-stage__media">
          {lightweight || reduced ? (
            <Image
              src="/images/dubai-marina-yachts-poster.jpg"
              alt="Dubai Marina yacht cruising across the sea"
              fill
              sizes="100vw"
              className="yacht-stage__visual object-cover"
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
              {[0, 1].map((index) => (
                <video
                  key={index}
                  ref={(element) => { mobileVideos.current[index] = element; }}
                  muted
                  playsInline
                  preload="none"
                  poster="/images/dubai-marina-yachts-poster.jpg"
                  aria-hidden="true"
                  className={`yacht-stage__visual yacht-stage__mobile-video ${visibleMobileVideo === index ? "is-visible" : ""}`}
                >
                  <source src="/videos/dubai-marina-yachts-scroll.mp4" type="video/mp4" />
                </video>
              ))}
            </>
          )}
          <div className="yacht-stage__shade pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="yacht-stage__mobile-intro">
            <Image src="/images/logo/dubai-marina-yachts-logo.svg" alt="Dubai Marina Yachts" width={246} height={36} className="yacht-stage__logo h-auto" />
            <h2 className="yacht-stage__title">Experience Unmatched Luxury with Dubai Marina Yachts.</h2>
          </div>
        </div>

        <div className="yacht-stage__content relative z-10 flex h-full flex-col justify-center">
          <Image
            src="/images/logo/dubai-marina-yachts-logo.svg"
            alt="Dubai Marina Yachts"
            width={246}
            height={36}
            className="yacht-stage__logo yacht-stage__desktop-intro h-auto"
          />
          <h2 className="yacht-stage__title yacht-stage__desktop-intro">
            Experience Unmatched<br />Luxury with Dubai<br />Marina Yachts.
          </h2>
          <p className="yacht-stage__description">
            Set sail into matchless luxury with Dubai Marina Yachts — your trusted partner for the ultimate Arabian getaway. From weddings and celebrations to sea adventures and fishing, discover the pristine waters of the Arabian Sea with a dedicated crew by your side.
          </p>
          <ul className="yacht-stage__features" aria-label="Yacht services">
            {features.map(({ label, icon: Icon }) => (
              <li key={label}>
                <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
