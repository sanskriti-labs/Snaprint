import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Why from "@/components/sections/Why";
import MachineSpecs from "@/components/sections/MachineSpecs";
import Testimonials from "@/components/sections/Testimonials";
import CtaFinal from "@/components/sections/CtaFinal";
import Footer from "@/components/Footer";

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
