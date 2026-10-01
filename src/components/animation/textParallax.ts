import gsap from "gsap";

export function textParallax(
  block: gsap.TweenTarget,
  trigger: Element | string,
  distance = 28,
) {
  return gsap.fromTo(
    block,
    { y: distance, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger,
        start: "top 88%",
        toggleActions: "play none none none",
        once: true,
      },
    },
  );
}
