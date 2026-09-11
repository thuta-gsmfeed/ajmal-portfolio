"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";

const biography = "I've spent more than 15 years turning opportunities into operating businesses—from marketing and iPhone distribution to e-commerce and AI software.";

export function AboutSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const match = gsap.matchMedia();
    match.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .fromTo(".about-kicker", { opacity: 0, x: -22 }, { opacity: 1, x: 0, duration: 0.55 }, 0)
        .fromTo(".about-frame", { clipPath: "inset(0% 0% 0% 100%)", xPercent: 7 }, { clipPath: "inset(0% 0% 0% 0%)", xPercent: 0, duration: 1.05, ease: "power3.inOut" }, 0.04)
        .fromTo(".about-quote-mark", { opacity: 0, scale: 0.55, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: "back.out(1.8)" })
        .fromTo(".about-caption", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, 0.72);

      gsap.fromTo(".about-word", {
        opacity: 0.08,
        y: "0.7em",
        filter: "blur(8px)",
      }, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-dossier__story",
          start: "top 92%",
          end: "center 38%",
          scrub: 0.65,
        },
      });

      gsap.fromTo(".about-photo", { scale: 1.1, yPercent: -2 }, {
        scale: 1.02,
        yPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });
    return () => match.revert();
  }, { scope: section });

  return (
    <section ref={section} id="about" data-header-theme="light" className="about-section section-light overflow-hidden">
      <div className="about-split">
        <div className="about-dossier__story">
          <p className="about-kicker eyebrow">About me</p>
          <blockquote className="about-dossier__lead" aria-label={biography}>
            <span className="about-quote-mark about-quote-mark--open" aria-hidden="true">“</span>
            <span className="about-quote-copy" aria-hidden="true">
              {biography.split(" ").map((word, index, words) => (
                <Fragment key={`${word}-${index}`}>
                  <span className="about-word">{word}</span>{index < words.length - 1 ? " " : ""}
                </Fragment>
              ))}
              <span className="about-quote-mark about-quote-mark--close">”</span>
            </span>
          </blockquote>
        </div>

        <figure className="about-frame about-dossier__portrait">
          <Image
            src={media.portrait.src}
            alt={media.portrait.alt}
            fill
            sizes="(max-width:767px) calc(100vw - 48px), 40vw"
            className="about-photo object-cover object-top"
          />
          <div className="about-dossier__portrait-shade" />
          <figcaption className="about-caption about-dossier__caption">
            <div>
              <p>Ajmal Gholzad</p>
              <span>Founder · Entrepreneur · Technologist</span>
            </div>
            <span className="about-dossier__since">Since 2009</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
