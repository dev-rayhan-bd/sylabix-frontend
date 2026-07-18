import { Navbar } from "@/src/components/shared/Navbar";
import { Footer } from "@/src/components/shared/Footer";
import { Hero } from "@/src/components/landing/Hero";
import { Features } from "@/src/components/landing/Features";
import { HowItWorks } from "@/src/components/landing/HowItWorks";
import { CtaSection } from "@/src/components/landing/CtaSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
