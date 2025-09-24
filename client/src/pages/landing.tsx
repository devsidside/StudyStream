import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero/HeroSection";
import TryItYourselfSection from "@/components/landing/TryItYourselfSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CTASection from "@/components/landing/CTASection";

export default function Landing() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TryItYourselfSection />
      <ProblemSection />
      <SolutionSection />
      <CTASection />
      <Footer />
    </div>
  );
}
