"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { media } from "@/data/content";
const words="I build businesses that connect people, products, markets, and technology.".split(" ");
export function ScrollTextSection(){const ref=useRef<HTMLElement>(null);useGSAP(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;gsap.registerPlugin(ScrollTrigger);gsap.to(".fill-word",{color:"#f3f6f7",stagger:.08,ease:"none",scrollTrigger:{trigger:ref.current,start:"top 65%",end:"bottom 55%",scrub:true}})},{scope:ref});return <section ref={ref} className="relative flex min-h-[120vh] items-center overflow-hidden py-32"><Image src={media.manifesto.src} alt="" fill sizes="100vw" className="object-cover opacity-10"/><div className="absolute inset-0 bg-black/60"/><p className="container relative z-10 max-w-[1300px] text-[clamp(3rem,8vw,8.5rem)] font-medium leading-[.94] tracking-[-.06em]">{words.map((w,i)=><span key={i} className="fill-word mr-[.18em] inline-block text-white/15">{w}</span>)}</p></section>}
