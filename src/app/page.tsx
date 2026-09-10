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
import { CoolmixDeliverySection } from "@/components/sections/CoolmixDeliverySection";
import { TrustedPartnershipsSection } from "@/components/sections/TrustedPartnershipsSection";
// Temporarily hidden. Uncomment together with the render below to restore the How I build section.
// import { PhilosophySection } from "@/components/sections/PhilosophySection";
// Temporarily hidden. Uncomment together with the render below to restore the Next section.
// import { NowNextSection } from "@/components/sections/NowNextSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home(){return <><a className="skip-link" href="#main">Skip to content</a><Loader/><Header/><main id="main" className="site-content"><HeroSection/><AboutSection/><ImmersiveSplineSection/><CoolmixDeliverySection/><JourneySection/>{/* <ParticleJourneySection/> */}{/* <MagnifierRevealSection/> */}{/* <VenturesSection/> */}<ProductsSection/><GlobalNetworkSection/><DubaiYachtSection/>{/* <PhilosophySection/> */}{/* <NowNextSection/> */}<TrustedPartnershipsSection/><ContactSection/></main><Footer/></>}
