import { SmoothScroll } from "@/components/animation/SmoothScroll";
import { SectionTransitions } from "@/components/animation/SectionTransitions";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { GlobalNetworkSection } from "@/components/sections/GlobalNetworkSection";
import { DubaiYachtSection } from "@/components/sections/DubaiYachtSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ImmersiveSplineSection } from "@/components/sections/ImmersiveSplineSection";
import { JourneySection } from "@/components/sections/JourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the particle journey.
// import { ParticleJourneySection } from "@/components/sections/ParticleJourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the magnifier reveal.
// import { MagnifierRevealSection } from "@/components/sections/MagnifierRevealSection";
// Temporarily hidden. Uncomment together with the render below when the Ventures section is ready.
// import { VenturesSection } from "@/components/sections/VenturesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
// Temporarily hidden. Uncomment together with the render below to restore the Next section.
// import { NowNextSection } from "@/components/sections/NowNextSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home(){return <SmoothScroll><a className="skip-link" href="#main">Skip to content</a><Loader/><Header/><SectionTransitions/><main id="main"><HeroSection/><AboutSection/><ImmersiveSplineSection/><JourneySection/>{/* <ParticleJourneySection/> */}{/* <MagnifierRevealSection/> */}{/* <VenturesSection/> */}<ProductsSection/><GlobalNetworkSection/><DubaiYachtSection/><PhilosophySection/>{/* <NowNextSection/> */}<ContactSection/></main><Footer/></SmoothScroll>}
