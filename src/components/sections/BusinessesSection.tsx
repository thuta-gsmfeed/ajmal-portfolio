"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const businesses = [
  { name: "Coolmix", logo: "/images/logo/coolmix-logo.svg", className: "h-9 w-9", url: "https://coolmix.eu/" },
  { name: "Gsmfeed", logo: "/images/logo/gsmfeed-logo.svg", className: "h-7 w-12", url: "https://gsmfeed.com/" },
  { name: "Projectmix", logo: "/images/logo/projectmix-logo.svg", className: "h-10 w-10", url: "https://projectmix.ai/" },
  { name: "Dubai Marina Yachts", logo: "/images/logo/yachts-logo.svg", className: "h-10 w-10", url: "https://dubaimarinayachts.ae/" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function BusinessesSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="businesses" data-header-theme="dark" className="businesses-section" aria-labelledby="businesses-title">
      <div className="container businesses-section__inner">
        <motion.header
          className="text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 id="businesses-title" className="businesses-section__title">
            One Vision.
            <span>Multiple Businesses.</span>
          </h2>
          <p className="businesses-section__kicker">Different industries. One entrepreneurial mindset.</p>
        </motion.header>

        <nav className="businesses-section__logos" aria-label="Gholzad businesses">
          {businesses.map((business, index) => (
            <motion.a
              key={business.name}
              href={business.url}
              target="_blank"
              rel="noreferrer"
              className="businesses-section__business"
              aria-label={`Visit ${business.name} website`}
              initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.75 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease }}
            >
              <div className="businesses-section__logo">
                <Image src={business.logo} alt="" width={64} height={64} className={`object-contain ${business.className}`} />
              </div>
              <h3>{business.name}</h3>
            </motion.a>
          ))}
        </nav>

        <motion.div
          className="businesses-section__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, delay: 0.22, ease }}
        >
          <p>Gholzad is a growing group of businesses built around a simple idea: create useful businesses that solve real problems.</p>
          <p>Each company operates in a different space, but they share the same foundation — practical experience, technology, international relationships and a strong focus on long-term growth.</p>
          <p>From moving products across borders to building technology for global traders, every venture is part of a bigger journey.</p>
        </motion.div>
      </div>
    </section>
  );
}
