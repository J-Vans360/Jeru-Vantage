'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, sendHeartbeat } from '@/lib/analytics/client';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Track page views
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Send heartbeat every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      let activity = 'browsing';
      if (pathname.includes('/assessment')) activity = 'assessment';
      else if (pathname.includes('/results')) activity = 'results';
      else if (pathname.includes('/matches')) activity = 'matching';

      sendHeartbeat(activity);
    }, 30000);

    // Send initial heartbeat
    let activity = 'browsing';
    if (pathname.includes('/assessment')) activity = 'assessment';
    else if (pathname.includes('/results')) activity = 'results';
    else if (pathname.includes('/matches')) activity = 'matching';
    sendHeartbeat(activity);

    return () => clearInterval(interval);
  }, [pathname]);

  return <>{children}</>;
}
