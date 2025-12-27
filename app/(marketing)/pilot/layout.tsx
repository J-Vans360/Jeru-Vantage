import { ReactNode } from 'react';

// Pilot landing page has its own nav and footer built-in
export default function PilotLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
