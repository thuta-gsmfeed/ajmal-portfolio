import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const widgets = [
  { name: "Performance rating", file: "perf-rating-dark.png", left: "18.85%", top: "7.04%", width: "18.23%", height: "52.17%" },
  { name: "Performance overview", file: "perf-dark.png", left: "38.95%", top: "38.1%", width: "11.12%", height: "48.86%" },
  { name: "Profit", file: "profit-dark.png", left: "45.44%", top: "20.08%", width: "11.74%", height: "13.04%" },
  { name: "Products sold", file: "pSold-dark.png", left: "48%", top: "0%", width: "11.88%", height: "12.84%" },
  { name: "Sales target", file: "stargetc-dark.png", left: "22.1%", top: "69.57%", width: "11.74%", height: "13.04%" },
  { name: "Performance comparison", file: "pc-dark.png", left: "53.45%", top: "59.21%", width: "26.73%", height: "26.71%" },
  { name: "Ecommerce conversion", file: "ecommi-dark.png", left: "60.83%", top: "6.21%", width: "17.43%", height: "47.41%" },
  { name: "Sales target gauge", file: "starget-dark.png", left: "0.07%", top: "40.37%", width: "15.88%", height: "47.41%", wideOnly: true },
  { name: "Revenue growth", file: "growth-dark.png", left: "82.66%", top: "29.81%", width: "17.43%", height: "47.41%", wideOnly: true },
] as const;

export function ProjectmixSection() {
  return (
    <section id="projectmix" className="projectmix-section" aria-labelledby="projectmix-title" data-header-theme="light">
      <div className="projectmix-section__inner">
        <div className="projectmix-section__brand" aria-label="projectmix">
          <Image src="/images/logo/projectmix-logo.svg" alt="" width={37} height={34} />
          <span>projectmix<sup>®</sup></span>
        </div>

        <p className="projectmix-section__eyebrow">CRM SYSTEM</p>
        <h2 id="projectmix-title" className="projectmix-section__title">Say hello to<br />projectmix Ai</h2>

        <div className="projectmix-section__visual" role="img" aria-label="Projectmix dashboard widgets around a laptop">
          <Image className="projectmix-section__laptop" src="/images/projectmix-laptop.svg" alt="" width={776} height={450} aria-hidden="true" />
          {widgets.map(({ name, file, left, top, width, height, ...widget }) => (
            <div
              key={file}
              className={`projectmix-section__widget ${"wideOnly" in widget ? "projectmix-section__widget--wide" : ""}`}
              style={{ left, top, width, height }}
              aria-hidden="true"
            >
              <Image src={`/images/projectmix-widgets/${file}`} alt={name} fill sizes="(max-width: 768px) 180px, 270px" />
            </div>
          ))}
        </div>

        <p className="projectmix-section__description">
          Automating your trading business with the world&apos;s first advanced ERP solution. An easy-to-use software, without a manual.
        </p>
        <a className="projectmix-section__link" href="https://projectmix.ai/" target="_blank" rel="noopener noreferrer">
          Visit website <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </div>
    </section>
  );
}
