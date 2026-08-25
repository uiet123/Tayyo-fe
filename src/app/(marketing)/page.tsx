import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { InterviewTypes } from "@/components/landing/interview-types";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { CallToAction } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <InterviewTypes />
      <PricingSection />
      <Testimonials />
      <Faq />
      <CallToAction />
    </>
  );
}
