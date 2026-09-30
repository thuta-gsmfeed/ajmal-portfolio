import { Header } from "@/components/layout/Header";
import { SectionRail } from "@/components/navigation/SectionRail";
import { BackToTop } from "@/components/navigation/BackToTop";
import { Loader } from "@/components/layout/Loader";
import { SectionMotion } from "@/components/animation/SectionMotion";
// Temporarily hidden. Uncomment together with the render below to restore the original footer.
// import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { GlobalNetworkSection } from "@/components/sections/GlobalNetworkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { BusinessesSection } from "@/components/sections/BusinessesSection";
import { ImmersiveSplineSection } from "@/components/sections/ImmersiveSplineSection";
import { DubaiYachtSection } from "@/components/sections/DubaiYachtSection";
import { ProjectmixSection } from "@/components/sections/ProjectmixSection";
import { JourneySection } from "@/components/sections/JourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the particle journey.
// import { ParticleJourneySection } from "@/components/sections/ParticleJourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the magnifier reveal.
// import { MagnifierRevealSection } from "@/components/sections/MagnifierRevealSection";
import { VenturesSection } from "@/components/sections/VenturesSection";
import { CoolmixDeliverySection } from "@/components/sections/CoolmixDeliverySection";
import { TrustedPartnershipsSection } from "@/components/sections/TrustedPartnershipsSection";
// Temporarily hidden. Uncomment together with the render below to restore the How I build section.
// import { PhilosophySection } from "@/components/sections/PhilosophySection";
// Temporarily hidden. Uncomment together with the render below to restore the Next section.
// import { NowNextSection } from "@/components/sections/NowNextSection";
// Temporarily hidden. Uncomment together with the render below to restore the original contact form.
// import { ContactSection } from "@/components/sections/ContactSection";
import { FutureTogetherSection } from "@/components/sections/FutureTogetherSection";

export default function Home(){return <><a className="skip-link" href="#main">Skip to content</a><Loader/><Header/><SectionRail/><BackToTop/><SectionMotion/><main id="main" className="site-content"><HeroSection/><AboutSection/><BusinessesSection/><JourneySection/>{/* <ParticleJourneySection/> */}{/* <MagnifierRevealSection/> */}<div className="journey-ventures-transition" aria-hidden="true" /><VenturesSection/><CoolmixDeliverySection/><ImmersiveSplineSection/><DubaiYachtSection/><ProjectmixSection/><div className="network-transition ventures-transition--exit" aria-hidden="true" /><GlobalNetworkSection/>{/*<ProductsSection/> */} {/* <PhilosophySection/> */}{/* <NowNextSection/> */}<TrustedPartnershipsSection/>{/* <ContactSection/> */}<FutureTogetherSection/></main>{/* <Footer/> */}</>}
