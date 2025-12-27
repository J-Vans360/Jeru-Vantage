'use client';

import { useRouter } from 'next/navigation';
import InviteCodeGate from './InviteCodeGate';

interface InviteCodeGateWrapperProps {
  isLoggedIn?: boolean;
}

export default function InviteCodeGateWrapper({
  isLoggedIn = false,
}: InviteCodeGateWrapperProps) {
  const router = useRouter();

  const handleValidCode = async (code: string) => {
    if (isLoggedIn) {
      // Use the code directly
      try {
        const res = await fetch('/api/pilot/use-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (res.ok) {
          // Refresh to continue to assessment
          router.refresh();
        } else {
          console.error('Failed to use code');
        }
      } catch (error) {
        console.error('Failed to use code:', error);
      }
    } else {
      // Store code in session storage and redirect to register
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pilotInviteCode', code);
      }
      router.push('/register?redirect=/pilot-assessment&code=' + code);
    }
  };

  return <InviteCodeGate onValidCode={handleValidCode} />;
}
