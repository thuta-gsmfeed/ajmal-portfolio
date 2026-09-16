"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/content";

type State = { status: "idle" | "sending" | "success" | "error"; message?: string };

export function ContactSection() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>({ status: "idle" });
  const [formOpen, setFormOpen] = useState(false);
  const startedAt = useRef(Date.now());
  const whatsappUrl = `https://wa.me/${site.whatsapp.phone}?text=${encodeURIComponent(site.whatsapp.message)}`;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const syncFormVisibility = () => setFormOpen(desktop.matches);
    syncFormVisibility();
    desktop.addEventListener("change", syncFormVisibility);
    return () => desktop.removeEventListener("change", syncFormVisibility);
  }, []);

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
    <section id="contact" data-header-theme="light" className="contact-section relative overflow-hidden bg-[#dfe9eb] py-14 text-[#071013] md:py-40">
      <div className="absolute -right-32 top-16 size-[360px] rounded-full bg-cyan-400/20 blur-[100px] md:size-[560px]" />
      <div className="container relative">
        <p className="eyebrow !text-black/50">Start a conversation</p>
        <motion.h2 initial={reduced ? false : { y: 16 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="section-title mt-4 max-w-6xl text-[clamp(2.15rem,10vw,3rem)] md:mt-8 md:text-[clamp(2.4rem,4.4vw,5rem)]">Let&apos;s build the future together.</motion.h2>
        <div className="mt-7 grid gap-7 md:mt-20 md:gap-20 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="section-description section-description--dark max-w-md !text-[.9375rem] !leading-6 md:!text-base md:!leading-7">Whether you&apos;re building a business, launching a product, entering a new market, or exploring a technology partnership, let&apos;s create something meaningful.</p>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-black/65 md:hidden">
              <i className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(34,197,94,.12)]" />
              {site.availability}
            </div>
            <div className="mt-6 grid gap-2.5 md:hidden">
              <a data-cursor="CHAT" className="contact-mobile-cta contact-mobile-cta--primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                <span><MessageCircle size={18} />Chat on WhatsApp</span><ArrowUpRight size={17} />
              </a>
              <a data-cursor="EMAIL" className="contact-mobile-cta contact-mobile-cta--secondary" href={`mailto:${site.email}`}>
                <span><Mail size={18} />Send an email</span><ArrowUpRight size={17} />
              </a>
            </div>
            <div className="mt-5 flex items-center justify-between border-y border-black/15 py-3 text-xs text-black/50 md:hidden">
              <span>Based in {site.location}</span><span>Global partnerships</span>
            </div>
            <dl className="mt-12 hidden border-t border-black/20 pt-7 text-sm md:block md:space-y-5">
              <div className="min-w-0"><dt className="text-black/40">Email</dt><dd className="min-w-0 md:mt-1"><a data-cursor="EMAIL" className="inline-flex min-h-10 max-w-full items-center break-all md:min-h-0" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              <div><dt className="text-black/40">WhatsApp</dt><dd className="md:mt-1"><a data-cursor="CHAT" className="inline-flex min-h-10 items-center md:min-h-0" href={whatsappUrl} target="_blank" rel="noreferrer">Start a chat <ArrowUpRight className="ml-1 shrink-0" size={13} /></a></dd></div>
              <div><dt className="text-black/40">Base</dt><dd className="flex min-h-8 items-center md:mt-1 md:min-h-0">{site.location}</dd></div>
              <div><dt className="text-black/40">Availability</dt><dd className="flex min-h-8 items-center gap-2 md:mt-1 md:min-h-0"><i className="size-2 shrink-0 rounded-full bg-emerald-500" />{site.availability}</dd></div>
            </dl>
          </div>
          <div>
            <button
              type="button"
              className="contact-form-toggle flex w-full items-center justify-between border-b border-black/20 py-4 text-left md:hidden"
              aria-expanded={formOpen}
              aria-controls="contact-project-form"
              onClick={() => setFormOpen((open) => !open)}
            >
              <span><small>Prefer a detailed inquiry?</small>Send a project brief</span>
              <ChevronDown className={formOpen ? "rotate-180" : ""} size={20} />
            </button>
            <div className={`contact-form-panel ${formOpen ? "contact-form-panel--open" : ""}`} aria-hidden={!formOpen} inert={!formOpen ? true : undefined}>
              <form id="contact-project-form" onSubmit={submit} className="grid min-h-0 gap-x-5 gap-y-4 overflow-hidden pt-6 md:grid-cols-2 md:gap-y-7 md:overflow-visible md:pt-0">
                <label className="absolute -left-[9999px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                {[["name", "Name", "text"], ["email", "Email", "email"], ["company", "Company", "text"]].map(([name, label, type]) => (
                  <label key={name} className="contact-field relative border-b border-black/25 pb-1 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">{label}</span><input name={name} type={type} required={name !== "company"} className="min-h-11 w-full bg-transparent text-base outline-none md:mt-3 md:min-h-0 md:text-lg" /><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
                ))}
                <label className="contact-field relative border-b border-black/25 pb-1 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">Project type</span><select name="projectType" className="min-h-11 w-full bg-transparent text-base outline-none md:mt-3 md:min-h-0 md:text-lg"><option>Business collaboration</option><option>Technology partnership</option><option>Investment opportunity</option><option>Other</option></select><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
                <label className="contact-field relative border-b border-black/25 pb-1 md:col-span-2 md:pb-3"><span className="contact-field-label block text-xs uppercase tracking-widest text-black/45">Message</span><textarea name="message" required minLength={20} maxLength={2000} rows={3} className="mt-1 w-full resize-none bg-transparent text-base outline-none md:mt-3 md:text-lg" /><i aria-hidden className="contact-field-line absolute inset-x-0 bottom-[-1px] h-px origin-left bg-cyan-700" /></label>
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
        </div>
      </div>
    </section>
  );
}
