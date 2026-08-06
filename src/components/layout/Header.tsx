"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";

export function Header(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const { scrollYProgress } = useScroll();
 useEffect(()=>{const fn=()=>setScrolled(scrollY>32);fn();addEventListener("scroll",fn,{passive:true});return()=>removeEventListener("scroll",fn)},[]);
 useEffect(()=>{document.body.classList.toggle("menu-open",open);return()=>document.body.classList.remove("menu-open")},[open]);
 return <><header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled?"border-b border-white/10 bg-black/65 backdrop-blur-xl":""}`}><div className="container flex h-20 items-center justify-between"><a href="#home" className="text-sm font-semibold tracking-[.18em]">AJMAL GHOLZAD</a><nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">{nav.slice(0,-1).map(([l,id])=><a className="text-xs text-white/60 transition hover:text-white" href={`#${id}`} key={id}>{l}</a>)}<a className="pill !min-h-10 text-xs" href="#contact">Let&apos;s talk</a></nav><button aria-label={open?"Close menu":"Open menu"} aria-expanded={open} className="grid size-11 place-items-center rounded-full border border-white/20 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><div className="absolute inset-x-0 bottom-0 h-px bg-white/10"><motion.div aria-hidden className="h-full origin-left bg-cyan-300" style={{scaleX:scrollYProgress}}/></div></header>
 <AnimatePresence>{open&&<motion.div className="fixed inset-0 z-40 flex bg-[#07090a] px-7 pb-12 pt-28 lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><nav className="mt-auto w-full" aria-label="Mobile">{nav.map(([l,id],i)=><motion.a key={id} href={`#${id}`} onClick={()=>setOpen(false)} className="block border-t border-white/15 py-4 text-[clamp(2rem,11vw,4rem)] leading-none tracking-tight" initial={{x:30,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:i*.05}}>{l}</motion.a>)}</nav></motion.div>}</AnimatePresence></>;
}
