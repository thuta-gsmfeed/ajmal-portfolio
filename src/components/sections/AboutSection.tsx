"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";

const biography = "I've spent more than 15 years turning opportunities into operating businesses — from marketing and iPhone distribution to e-commerce and AI software.";

export function AboutSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const match = gsap.matchMedia();

    match.add("(prefers-reduced-motion: no-preference)", () => {
      const mobileQuote = window.matchMedia("(max-width: 600px)").matches;
      const textBlocks = gsap.utils.toArray<HTMLElement>(
        `${mobileQuote ? ".about-quote-copy--mobile" : ".about-quote-copy--desktop"}, .about-bio-copy > p`,
      );

      const splits = textBlocks.map((block, index) => SplitText.create(block, {
        type: "lines",
        linesClass: "about-reveal-line",
        autoSplit: true,
        aria: block.classList.contains("about-quote-copy") ? "hidden" : "auto",
        onSplit: (split) => gsap.fromTo(split.lines, {
          "--bg-progress": 30,
        }, {
          "--bg-progress": 100,
          duration: 1.55,
          delay: Math.max(0, index - 1) * 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: block.classList.contains("about-quote-copy") ? ".about-dossier__lead" : ".about-bio-copy",
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }),
      }));

      const portrait = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-frame",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      portrait
        .fromTo(".about-frame", { opacity: 0, x: 54 }, { opacity: 1, x: 0, duration: 1.05, ease: "power3.inOut" }, 0)
        .fromTo(".about-signature", { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 0.7);

      return () => splits.forEach((split) => split.revert());
    });

    return () => match.revert();
  }, { scope: section });

  return (
    <section ref={section} id="about" data-header-theme="dark" className="about-section">
      <div className="about-split container">
        <div className="about-dossier__story">
          <blockquote className="about-dossier__lead" aria-label={biography}>
            <span className="about-quote-copy about-quote-copy--desktop" aria-hidden="true">
              “I&apos;ve spent more than 15 years<br />turning opportunities into<br />operating businesses — from<br />marketing and iPhone distribution<br />to e-commerce and AI software.”
            </span>
            <span className="about-quote-copy about-quote-copy--mobile" aria-hidden="true">
              “I&apos;ve spent more than 15 years turning<br />opportunities into operating<br />businesses from marketing and<br />iPhone distribution to e-commerce<br />and AI software.”
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
