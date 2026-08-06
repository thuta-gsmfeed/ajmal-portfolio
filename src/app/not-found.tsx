import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#030506] px-6 text-center text-white">
      <div>
        <h1 className="text-6xl font-light text-cyan-400">404</h1>
        <p className="mt-4 text-xl text-white/70">Page Not Found</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full border border-white/20 px-6 py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-white hover:text-black"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
