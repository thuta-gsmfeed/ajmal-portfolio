"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";

export function Header(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const { scrollYProgress } = useScroll();
 useEffect(()=>{const fn=()=>setScrolled(scrollY>32);fn();addEventListener("scroll",fn,{passive:true});return()=>removeEventListener("scroll",fn)},[]);
 useEffect(()=>{document.body.classList.toggle("menu-open",open);const close=(event:KeyboardEvent)=>event.key==="Escape"&&setOpen(false);addEventListener("keydown",close);return()=>{document.body.classList.remove("menu-open");removeEventListener("keydown",close)}},[open]);
  return <><header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled||open?"border-b border-white/10 bg-black/65 backdrop-blur-xl":""}`}><div className="container flex h-16 items-center justify-between md:h-20"><a href="#home" aria-label="Gholzad Home" className="grid size-11 place-items-center transition-transform duration-300 hover:scale-105"><Image src="/images/logo/gholzad-logo.svg" alt="Gholzad Logo" width={36} height={36} className="h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" priority /></a><nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">{nav.slice(0,-1).map(([l,id])=><a className="text-xs text-white/60 transition hover:text-white" href={`#${id}`} key={id}>{l}</a>)}<a className="pill !min-h-10 text-xs" href="#contact">Let&apos;s talk</a></nav><button aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="mobile-navigation" className="grid size-11 place-items-center rounded-full border border-white/20 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><div className="absolute inset-x-0 bottom-0 h-px bg-white/10"><motion.div aria-hidden className="h-full origin-left bg-cyan-300" style={{scaleX:scrollYProgress}}/></div></header>
 <AnimatePresence>{open&&<motion.div id="mobile-navigation" className="fixed inset-0 z-40 flex bg-[#07090a] px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-24 lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><nav className="my-auto w-full" aria-label="Mobile">{nav.map(([l,id],i)=><motion.a key={id} href={`#${id}`} onClick={()=>setOpen(false)} className="flex min-h-14 items-center border-t border-white/15 py-3 text-[clamp(1.9rem,9vw,3rem)] leading-none tracking-tight last:border-b" initial={{x:24,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*.04}}>{l}</motion.a>)}</nav></motion.div>}</AnimatePresence></>;
}
