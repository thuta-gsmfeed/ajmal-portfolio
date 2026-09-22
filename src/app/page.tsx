import { Header } from "@/components/layout/Header";
import { SectionRail } from "@/components/navigation/SectionRail";
import { Loader } from "@/components/layout/Loader";
// Temporarily hidden. Uncomment together with the render below to restore the original footer.
// import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { GlobalNetworkSection } from "@/components/sections/GlobalNetworkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { BusinessesSection } from "@/components/sections/BusinessesSection";
// Temporarily hidden. Uncomment together with the render below to restore the immersive section.
// import { ImmersiveSplineSection } from "@/components/sections/ImmersiveSplineSection";
import { JourneySection } from "@/components/sections/JourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the particle journey.
// import { ParticleJourneySection } from "@/components/sections/ParticleJourneySection";
// Temporarily hidden. Uncomment together with the render below to restore the magnifier reveal.
// import { MagnifierRevealSection } from "@/components/sections/MagnifierRevealSection";
import { VenturesSection } from "@/components/sections/VenturesSection";
// Temporarily hidden. Uncomment together with the render below to restore the Coolmix delivery section.
// import { CoolmixDeliverySection } from "@/components/sections/CoolmixDeliverySection";
import { TrustedPartnershipsSection } from "@/components/sections/TrustedPartnershipsSection";
// Temporarily hidden. Uncomment together with the render below to restore the How I build section.
// import { PhilosophySection } from "@/components/sections/PhilosophySection";
// Temporarily hidden. Uncomment together with the render below to restore the Next section.
// import { NowNextSection } from "@/components/sections/NowNextSection";
// Temporarily hidden. Uncomment together with the render below to restore the original contact form.
// import { ContactSection } from "@/components/sections/ContactSection";
import { FutureTogetherSection } from "@/components/sections/FutureTogetherSection";

export default function Home(){return <><a className="skip-link" href="#main">Skip to content</a><Loader/><Header/><SectionRail/><main id="main" className="site-content"><HeroSection/><AboutSection/><BusinessesSection/> {/* <ImmersiveSplineSection/> */} {/* <CoolmixDeliverySection/> */} <JourneySection/>{/* <ParticleJourneySection/> */}{/* <MagnifierRevealSection/> */}<VenturesSection/><GlobalNetworkSection/>{/*<ProductsSection/> */} {/*<DubaiYachtSection/> */} {/* <PhilosophySection/> */}{/* <NowNextSection/> */}<TrustedPartnershipsSection/>{/* <ContactSection/> */}<FutureTogetherSection/></main>{/* <Footer/> */}</>}
