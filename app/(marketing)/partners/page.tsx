import HeroSection from '@/components/marketing/HeroSection';
import ProblemSection from '@/components/marketing/ProblemSection';
import SolutionSection from '@/components/marketing/SolutionSection';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import FeaturesGrid from '@/components/marketing/FeaturesGrid';
import StatsSection from '@/components/marketing/StatsSection';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import FAQSection from '@/components/marketing/FAQSection';
import CTASection from '@/components/marketing/CTASection';

export const metadata = {
  title: 'University Partners | Jeru Vantage - The Algorithmic Matchmaker for Higher Ed',
  description:
    'Stop buying cold leads. Start acquiring qualified students with AI-powered matching. Only pay for students who fit your programs.',
};

export default function PartnersPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <StatsSection />
      <FeaturesGrid />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
