"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (kind?: "hover" | "click" | "confirm") => void;
};

const SoundContext = createContext<SoundContextValue>({ enabled: false, toggle: () => undefined, play: () => undefined });

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const ambienceRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const hoveredRef = useRef<Element | null>(null);

  const getContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    contextRef.current = new AudioContextConstructor();
    return contextRef.current;
  }, []);

  const play = useCallback((kind: "hover" | "click" | "confirm" = "click") => {
    if (!enabled) return;
    const context = getContext();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const settings = kind === "hover"
      ? { frequency: 560, end: 680, volume: 0.008, duration: 0.035 }
      : kind === "confirm"
        ? { frequency: 360, end: 760, volume: 0.018, duration: 0.14 }
        : { frequency: 260, end: 420, volume: 0.012, duration: 0.07 };

    oscillator.type = kind === "confirm" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(settings.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(settings.volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.duration + 0.02);
  }, [enabled, getContext]);

  const stopAmbience = useCallback(() => {
    const ambience = ambienceRef.current;
    if (!ambience) return;
    const context = contextRef.current;
    const now = context?.currentTime ?? 0;
    ambience.gain.gain.cancelScheduledValues(now);
    ambience.gain.gain.setTargetAtTime(0.0001, now, 0.35);
    window.setTimeout(() => {
      try { ambience.source.stop(); } catch { /* already stopped */ }
    }, 1200);
    ambienceRef.current = null;
  }, []);

  const startAmbience = useCallback((mode: string) => {
    if (!enabled || ambienceRef.current) return;
    const context = getContext();
    const frameCount = Math.floor(context.sampleRate * 2);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 1779033703;
    for (let index = 0; index < data.length; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[index] = ((seed / 4294967296) * 2 - 1) * 0.42;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = mode === "technology" ? 920 : 460;
    filter.Q.value = mode === "technology" ? 2.1 : 0.6;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.setTargetAtTime(mode === "technology" ? 0.006 : 0.012, context.currentTime, 0.8);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    ambienceRef.current = { source, gain };
  }, [enabled, getContext]);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      if (next) {
        const context = getContext();
        void context.resume();
        window.setTimeout(() => {
          const now = context.currentTime;
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(360, now);
          oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.16);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.02, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
          oscillator.connect(gain).connect(context.destination);
          oscillator.start(now);
          oscillator.stop(now + 0.18);
        }, 0);
      } else {
        stopAmbience();
      }
      return next;
    });
  }, [getContext, stopAmbience]);

  useEffect(() => {
    if (!enabled) return;
    const pointerOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest("a,button,[data-sound]") ?? null;
      if (!target || hoveredRef.current === target) return;
      hoveredRef.current = target;
      play("hover");
    };
    const pointerOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest("a,button,[data-sound]") ?? null;
      if (target === hoveredRef.current) hoveredRef.current = null;
    };
    const click = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("a,button,[data-sound]")) play("click");
    };
    window.addEventListener("pointerover", pointerOver, { passive: true });
    window.addEventListener("pointerout", pointerOut, { passive: true });
    window.addEventListener("click", click, { passive: true });
    return () => {
      window.removeEventListener("pointerover", pointerOver);
      window.removeEventListener("pointerout", pointerOut);
      window.removeEventListener("click", click);
    };
  }, [enabled, play]);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-soundscape]");
    if (!section || !enabled) return;
    const mode = section.dataset.soundscape ?? "ocean";
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? startAmbience(mode) : stopAmbience(), { threshold: 0.35 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      stopAmbience();
    };
  }, [enabled, startAmbience, stopAmbience]);

  useEffect(() => () => {
    stopAmbience();
    void contextRef.current?.close();
  }, [stopAmbience]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
