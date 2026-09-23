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
          start: "top 76%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .fromTo(".about-word", { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.025, duration: 0.62 }, 0)
        .fromTo(".about-bio-copy > p", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.13, duration: 0.65 }, 0.28)
        .fromTo(".about-frame", { opacity: 0, x: 54 }, { opacity: 1, x: 0, duration: 1.05, ease: "power3.inOut" }, 0.08)
        .fromTo(".about-signature", { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.7 }, 0.78);
    });

    return () => match.revert();
  }, { scope: section });

  return (
    <section ref={section} id="about" data-header-theme="dark" className="about-section">
      <div className="about-split container">
        <div className="about-dossier__story">
          <blockquote className="about-dossier__lead" aria-label={biography}>
            <span className="about-quote-copy" aria-hidden="true">
              {biography.split(" ").map((word, index, words) => (
                <Fragment key={`${word}-${index}`}>
                  <span className="about-word">
                    {index === 0 ? "“" : ""}{word}{index === words.length - 1 ? "”" : ""}
                  </span>
                  {index < words.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </span>
          </blockquote>

          <div className="about-bio-copy">
            <p><strong>Ajmal Gholzad</strong> is an entrepreneur and business builder who started his journey in 2009. Over the years, he has built businesses across mobile distribution, global trading, e-commerce, technology and AI.</p>
            <p>What began with identifying opportunities has grown into a group of businesses connecting people, products and markets across different industries and countries.</p>
            <p>Today, his focus is on building practical businesses, using technology to solve real problems and creating new opportunities for the future.</p>
          </div>
        </div>

        <figure className="about-frame about-dossier__portrait">
          <div className="about-portrait__visual">
            <Image
              src={media.portrait.src}
              alt={media.portrait.alt}
              fill
              sizes="(max-width:900px) 100vw, 760px"
              className="about-photo object-cover object-bottom"
            />
            <Image
              src="/images/about/ajmal-gholzad-signature.webp"
              alt=""
              width={515}
              height={390}
              className="about-signature"
              aria-hidden="true"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
