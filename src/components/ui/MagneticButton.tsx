"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
export function MagneticButton({href,children}:{href:string;children:React.ReactNode}){const r=useRef<HTMLAnchorElement>(null);const x=useSpring(useMotionValue(0),{stiffness:180,damping:18});const y=useSpring(useMotionValue(0),{stiffness:180,damping:18});return <motion.a ref={r} href={href} className="pill" style={{x,y}} onMouseMove={e=>{const b=r.current!.getBoundingClientRect();x.set((e.clientX-b.left-b.width/2)*.18);y.set((e.clientY-b.top-b.height/2)*.18)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}<ArrowUpRight size={16}/></motion.a>}
