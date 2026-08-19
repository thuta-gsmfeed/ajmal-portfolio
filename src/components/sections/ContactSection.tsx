"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/content";

type State = { status: "idle" | "sending" | "success" | "error"; message?: string };

export function ContactSection() {
  const [state, setState] = useState<State>({ status: "idle" });
  const startedAt = useRef(Date.now());
  const whatsappUrl = `https://wa.me/${site.whatsapp.phone}?text=${encodeURIComponent(site.whatsapp.message)}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "sending" });
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, startedAt: startedAt.current }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Please check your details.");
      setState({ status: "success", message: json.message });
      form.reset();
      startedAt.current = Date.now();
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-[#dfe9eb] py-20 text-[#071013] md:py-40">
      <div className="absolute -right-32 top-16 size-[560px] rounded-full bg-cyan-400/20 blur-[100px]" />
      <div className="container relative">
        <p className="eyebrow !text-black/50">Start a conversation</p>
        <h2 className="section-title mt-6 max-w-6xl md:mt-8">Let&apos;s build the future together.</h2>
        <div className="mt-12 grid gap-12 md:mt-20 md:gap-20 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="max-w-md text-base leading-7 text-black/65 md:text-xl md:leading-relaxed md:text-black/60">Whether you&apos;re building a business, launching a product, entering a new market, or exploring a technology partnership, let&apos;s create something meaningful.</p>
            <dl className="mt-8 space-y-1 border-t border-black/20 pt-4 text-sm md:mt-12 md:space-y-5 md:pt-7">
              <div><dt className="text-black/40">Email</dt><dd className="md:mt-1"><a data-cursor="EMAIL" className="inline-flex min-h-11 items-center md:min-h-0" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              <div><dt className="text-black/40">WhatsApp</dt><dd className="md:mt-1"><a data-cursor="CHAT" className="inline-flex min-h-11 items-center md:min-h-0" href={whatsappUrl} target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight className="ml-1" size={13} /></a></dd></div>
              <div><dt className="text-black/40">Base</dt><dd className="flex min-h-11 items-center md:mt-1 md:min-h-0">{site.location}</dd></div>
              <div><dt className="text-black/40">Availability</dt><dd className="flex min-h-11 items-center gap-2 md:mt-1 md:min-h-0"><i className="size-2 rounded-full bg-emerald-500" />{site.availability}</dd></div>
            </dl>
          </div>
          <form onSubmit={submit} className="grid gap-x-5 gap-y-6 md:grid-cols-2 md:gap-y-7">
            <label className="absolute -left-[9999px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            {[["name", "Name", "text"], ["email", "Email", "email"], ["company", "Company", "text"]].map(([name, label, type]) => (
              <label key={name} className="contact-field relative border-b border-black/25 pb-2 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">{label}</span><input name={name} type={type} required={name !== "company"} className="mt-1 min-h-12 w-full bg-transparent text-base outline-none md:mt-3 md:min-h-0 md:text-lg" /><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
            ))}
            <label className="contact-field relative border-b border-black/25 pb-2 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">Project type</span><select name="projectType" className="mt-1 min-h-12 w-full bg-transparent text-base outline-none md:mt-3 md:min-h-0 md:text-lg"><option>Business collaboration</option><option>Technology partnership</option><option>Investment opportunity</option><option>Other</option></select><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
            <label className="contact-field relative border-b border-black/25 pb-2 md:col-span-2 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">Message</span><textarea name="message" required minLength={20} maxLength={2000} rows={4} className="mt-2 w-full resize-none bg-transparent text-base outline-none md:mt-3 md:text-lg" /><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2 md:gap-5">
              <motion.button data-cursor="SEND" disabled={state.status === "sending"} className={`send-button pill !border-black/30 !text-white disabled:opacity-50 ${state.status === "success" ? "send-button--success" : "bg-black"}`} type="submit" whileTap={{ scale: 0.96 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={state.status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="relative z-10 inline-flex items-center gap-2">
                    {state.status === "sending" ? "Sending…" : state.status === "success" ? <>Sent <CheckCircle2 size={16} /></> : <>Send inquiry <ArrowUpRight size={16} /></>}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <p role="status" aria-live="polite" className={`text-sm ${state.status === "error" ? "text-red-700" : "text-black/55"}`}>{state.message}</p>
            </div>
            <p className="text-xs leading-5 text-black/45 md:col-span-2">Your details are used only to respond to this inquiry. Prefer email? Write directly to <a className="underline underline-offset-2" href={`mailto:${site.email}`}>{site.email}</a>.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
