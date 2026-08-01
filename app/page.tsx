import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Footer from "@/components/Footer";

// Below-the-fold sections: deferred so their JS (incl. framer-motion) doesn't
// block initial paint of the hero — this was the render-blocking bundle
// PageSpeed flagged (109 KiB unused JS on first load).
const Problem = dynamic(() => import("@/components/sections/Problem"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const Why = dynamic(() => import("@/components/sections/Why"));
const MachineSpecs = dynamic(() => import("@/components/sections/MachineSpecs"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const CtaFinal = dynamic(() => import("@/components/sections/CtaFinal"));

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <HowItWorks />
      <Why />
      <MachineSpecs />
      <Testimonials />
      <CtaFinal />
      <Footer />
    </main>
  );
}
