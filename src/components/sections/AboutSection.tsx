"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";

const biography = "I've spent more than 15 years turning opportunities into operating businesses—from marketing and iPhone distribution to e-commerce and AI software.";

export function AboutSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const match = gsap.matchMedia();

    match.add("(prefers-reduced-motion: no-preference)", () => {
      const stackedLayout = window.matchMedia("(max-width: 900px)").matches;
      const textBlocks = gsap.utils.toArray<HTMLElement>(
        ".about-quote-copy, .about-bio-copy > p",
      );

      const splits = textBlocks.map((block) => SplitText.create(block, {
        type: "lines",
        autoSplit: true,
        aria: block.classList.contains("about-quote-copy") ? "hidden" : "auto",
        onSplit: (split) => gsap.fromTo(split.lines, {
          maskImage: "linear-gradient(90deg, #000 45%, transparent 55%)",
          maskSize: "250% 100%",
          maskRepeat: "no-repeat",
          maskPosition: "100% 0%",
          opacity: 0.7,
        }, {
          maskPosition: "0% 0%",
          opacity: 1,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stackedLayout
              ? block.classList.contains("about-quote-copy")
                ? ".about-dossier__lead"
                : ".about-bio-copy"
              : section.current,
            start: "top 85%",
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
            <span className="about-quote-copy" aria-hidden="true">
              “I&apos;ve spent more than 15 years turning<br className="about-quote-mobile-break" /> opportunities into operating<br className="about-quote-mobile-break" /> businesses<span className="about-quote-desktop-dash">—</span><span className="about-quote-mobile-space"> </span>from marketing and<br className="about-quote-mobile-break" /> iPhone distribution to e-commerce<br className="about-quote-mobile-break" /> and AI software.”
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
