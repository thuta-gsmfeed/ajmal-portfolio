"use client";

import Image from "next/image";
import { media } from "@/data/content";

export function AboutSection() {
  return (
    <section id="about" className="py-28 md:py-40">
      <div className="container grid gap-16 lg:grid-cols-[.85fr_1.15fr]">
        {/* Sticky Image Column */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow mb-6">About me</p>
          <div className="image-wrap relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={media.portrait.src}
              alt={media.portrait.alt}
              fill
              sizes="(max-width:1024px) 100vw, 42vw"
              className="object-cover grayscale transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <p className="mt-3 text-xs text-white/35">
            Portrait placeholder · Ajmal Gholzad
          </p>
        </div>

        {/* Content Column */}
        <div className="lg:pt-16">
          <h2 className="section-title text-white">
            Hey! I&apos;m<br />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Ajmal Gholzad.
            </span>
          </h2>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-white/75 md:text-lg md:leading-relaxed">
            <p className="text-lg font-light text-white/90 md:text-xl md:leading-relaxed">
              I&apos;ve been an entrepreneur since 2009, successfully building multiple businesses—from a marketing agency and Apple iPhone distribution to e-commerce, affiliate marketing, and now a tech software company. Over the course of my career, my companies have generated over $100 million in sales.
            </p>

            <blockquote className="my-8 rounded-2xl border-l-2 border-cyan-400 bg-white/[0.03] p-6 text-base italic text-cyan-100/90 md:p-8 md:text-lg backdrop-blur-sm">
              &ldquo;Through strategic thinking and innovative design, I am able to tackle complex challenges and create impactful business solutions.&rdquo;
            </blockquote>

            <p>
              My strength lies in transforming creativity into technology, with a focus on applying AI solutions effectively.
            </p>

            <p>
              I&apos;ve developed a global network that stretches across the US, Europe, the Middle East, Hong Kong, and China. Through these connections, I&apos;ve built strong relationships and earned trust and recognition in these key markets.
            </p>

            <p>
              With over 15 years of experience in entrepreneurship and online business opportunities across various markets, I thrive on collaborating with professionals and business owners, finding great satisfaction in working together to achieve success.
            </p>

            <p className="pt-2 text-white/90">
              Feel free to reach out with any thoughts, questions, or collaboration ideas—I&apos;m always excited to connect and explore new professional opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
