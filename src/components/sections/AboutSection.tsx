"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { media } from "@/data/content";

export function AboutSection() {
  return (
    <section id="about" className="overflow-hidden py-16 md:py-40">
      <div className="container md:hidden">
        <p className="eyebrow mb-5">About me</p>

        <div className="relative">
          <div className="image-wrap relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src={media.portrait.src}
              alt={media.portrait.alt}
              fill
              sizes="calc(100vw - 28px)"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div aria-hidden className="absolute -right-12 -top-12 size-40 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/45 px-2 py-3 backdrop-blur-md">
              <div className="text-center">
                <strong className="block text-base font-medium text-white">15+</strong>
                <span className="mt-0.5 block font-mono text-sm uppercase tracking-[.04em] text-white/50">Years</span>
              </div>
              <div className="text-center">
                <strong className="block text-base font-medium text-cyan-100">$100M+</strong>
                <span className="mt-0.5 block font-mono text-sm uppercase tracking-[.04em] text-white/50">Sales</span>
              </div>
              <div className="text-center">
                <strong className="block text-base font-medium text-white">Global</strong>
                <span className="mt-0.5 block font-mono text-sm uppercase tracking-[.04em] text-white/50">Network</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pt-7">
          <div aria-hidden className="absolute -left-24 top-2 size-48 rounded-full bg-cyan-300/[.06] blur-3xl" />
          <div className="relative">
            <h2 className="section-title text-white">
              Hey! I&apos;m<br />
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                Ajmal Gholzad.
              </span>
            </h2>

            <p className="mt-5 text-base font-light leading-7 text-white/80">
              I&apos;ve been an entrepreneur since 2009, successfully building multiple businesses—from a marketing agency and Apple iPhone distribution to e-commerce, affiliate marketing, and now a tech software company. Over the course of my career, my companies have generated over $100 million in sales.
            </p>

            <blockquote className="relative mt-6 border-l border-cyan-300/70 py-1 pl-5 text-base font-light leading-7 text-cyan-50/90">
              &ldquo;Through strategic thinking and innovative design, I am able to tackle complex challenges and create impactful business solutions.&rdquo;
            </blockquote>

            <details className="group mt-7 border-y border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-sm uppercase tracking-[.12em] text-white/65 transition-colors marker:content-none hover:text-cyan-100">
                Read my full story
                <span className="grid size-8 place-items-center rounded-full border border-white/15 text-cyan-200 transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown aria-hidden size={14} />
                </span>
              </summary>

              <div className="space-y-4 pb-6 text-base leading-7 text-white/65">
                <p>
                  My strength lies in transforming creativity into technology, with a focus on applying AI solutions effectively.
                </p>
                <p>
                  I&apos;ve developed a global network that stretches across the US, Europe, the Middle East, Hong Kong, and China. Through these connections, I&apos;ve built strong relationships and earned trust and recognition in these key markets.
                </p>
                <p>
                  With over 15 years of experience in entrepreneurship and online business opportunities across various markets, I thrive on collaborating with professionals and business owners, finding great satisfaction in working together to achieve success.
                </p>
                <p className="pt-1 text-white/80">
                  Feel free to reach out with any thoughts, questions, or collaboration ideas—I&apos;m always excited to connect and explore new professional opportunities.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="container hidden gap-16 md:grid lg:grid-cols-[.85fr_1.15fr]">
        {/* Sticky Image Column */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow mb-6">About me</p>
          <div className="image-wrap relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src={media.portrait.src}
              alt={media.portrait.alt}
              fill
              sizes="(max-width:1024px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:pt-16">
          <h2 className="section-title text-white">
            Hey! I&apos;m<br />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Ajmal Gholzad.
            </span>
          </h2>

          <div className="mt-7 space-y-5 text-[15px] leading-7 text-white/75 md:mt-10 md:space-y-6 md:text-lg md:leading-relaxed">
            <p className="text-lg font-light text-white/90 md:text-xl md:leading-relaxed">
              I&apos;ve been an entrepreneur since 2009, successfully building multiple businesses—from a marketing agency and Apple iPhone distribution to e-commerce, affiliate marketing, and now a tech software company. Over the course of my career, my companies have generated over $100 million in sales.
            </p>

            <blockquote className="my-6 rounded-2xl border-l-2 border-cyan-400 bg-white/[0.03] p-5 text-base italic text-cyan-100/90 backdrop-blur-sm md:my-8 md:p-8 md:text-lg">
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
