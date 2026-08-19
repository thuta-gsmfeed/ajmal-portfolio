"use client";

import { useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode, useEffect } from "react";

export function CinematicLink({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const settleHashTarget = () => {
    const hash = href.split("#")[1];
    if (!hash) return;

    // Next restores the hash before the long-form home sections finish their
    // first layout pass. Correct it once early and once after media has settled.
    [160, 900].forEach((delay) => window.setTimeout(() => {
      const target = document.getElementById(hash);
      if (!target) return;
      window.scrollTo({
        top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - 82),
        behavior: "auto",
      });
    }, delay));
  };

  const navigate = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      settleHashTarget();
      return;
    }

    const root = document.documentElement;
    root.classList.remove("route-entering");
    root.classList.add("route-leaving");
    await new Promise<void>((resolve) => window.setTimeout(resolve, 420));

    const destinationPath = new URL(href, window.location.href).pathname;
    router.push(href);
    const startedAt = performance.now();
    while (window.location.pathname !== destinationPath && performance.now() - startedAt < 5000) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    settleHashTarget();

    root.classList.remove("route-leaving");
    root.classList.add("route-entering");
    window.setTimeout(() => root.classList.remove("route-entering"), 680);
  };

  return <a href={href} aria-label={ariaLabel} onClick={navigate} className={className}>{children}</a>;
}
