import { Metadata } from 'next';
import PilotLandingPage from '@/components/pilot/PilotLandingPage';

export const metadata: Metadata = {
  title: 'Free Career Assessment | Jeru Vantage Pilot Program',
  description: 'Discover your ideal career path with our free 25-minute assessment. Get your personalized Jeru Report with insights on personality, values, interests, and more.',
  openGraph: {
    title: 'Free Career Assessment | Jeru Vantage Pilot Program',
    description: 'Discover your ideal career path with our free 25-minute assessment.',
    images: ['/images/pilot-og.png'],
  },
};

export default function PilotMarketingPage() {
  return <PilotLandingPage />;
}
