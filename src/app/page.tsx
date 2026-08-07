import { SmoothScroll } from "@/components/animation/SmoothScroll";
import { CustomCursor } from "@/components/animation/CustomCursor";
import { SectionTransitions } from "@/components/animation/SectionTransitions";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { GlobalNetworkSection } from "@/components/sections/GlobalNetworkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ScrollTextSection } from "@/components/sections/ScrollTextSection";
import { JourneySection } from "@/components/sections/JourneySection";
// Temporarily hidden. Uncomment together with the render below when the Ventures section is ready.
// import { VenturesSection } from "@/components/sections/VenturesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home(){return <SmoothScroll><a className="skip-link" href="#main">Skip to content</a><Loader/><Header/><CustomCursor/><SectionTransitions/><main id="main"><HeroSection/><AboutSection/><GlobalNetworkSection/><ScrollTextSection/><JourneySection/>{/* <VenturesSection/> */}<ProductsSection/><PartnersSection/><PhilosophySection/><ContactSection/></main><Footer/></SmoothScroll>}
