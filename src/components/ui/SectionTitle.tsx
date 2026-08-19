import type { ReactNode } from "react";

export function SectionTitle({ kicker, title, body, bodyClassName = "" }: { kicker: string; title: ReactNode; body?: string; bodyClassName?: string }) {
  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_2fr]">
      <p className="eyebrow">{kicker}</p>
      <div>
        <h2 className="section-title max-w-5xl">{title}</h2>
        {body && <p className={`section-description mt-5 md:mt-7 ${bodyClassName}`}>{body}</p>}
      </div>
    </div>
  );
}
