import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#030506] px-6 text-center text-white">
      <div aria-hidden className="hero-grid absolute inset-0 opacity-20" />
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.07] blur-[90px]" />
      <div className="relative">
        <Image src="/images/logo/gholzad-logo.svg" alt="" width={56} height={56} className="mx-auto size-12 opacity-80" />
        <p className="mt-8 font-mono text-xs uppercase tracking-[.24em] text-cyan-200/70">Lost between chapters</p>
        <h1 className="mt-4 text-[clamp(6rem,22vw,14rem)] font-medium leading-none tracking-[-.08em] text-white">404</h1>
        <p className="mt-3 text-base text-white/55 md:text-xl">This page is outside the current journey.</p>
        <Link
          href="/"
          className="pill mt-8 bg-white text-[#030506] hover:bg-cyan-100"
        >
          Return to portfolio
        </Link>
      </div>
    </main>
  );
}
