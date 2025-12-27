import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import UniversitySidebar from '@/components/university/UniversitySidebar';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ universityId: string }>;
}

// Mock function to get university data - replace with actual DB query
async function getUniversity(universityId: string) {
  // TODO: Replace with actual prisma query when University model exists
  // const university = await prisma.university.findFirst({
  //   where: { id: universityId },
  // });

  // Mock data for development
  const mockUniversities: Record<
    string,
    { id: string; name: string; logo: string | null; partnerTier: string }
  > = {
    'univ-1': {
      id: 'univ-1',
      name: 'University of Melbourne',
      logo: null,
      partnerTier: 'GOLD',
    },
    'univ-2': {
      id: 'univ-2',
      name: 'University of Toronto',
      logo: null,
      partnerTier: 'PLATINUM',
    },
    'univ-3': {
      id: 'univ-3',
      name: 'National University of Singapore',
      logo: null,
      partnerTier: 'SILVER',
    },
  };

  return mockUniversities[universityId] || null;
}

export default async function UniversityLayout({
  children,
  params,
}: LayoutProps) {
  const { universityId } = await params;

  // TODO: Add authentication check
  // const session = await getServerSession();
  // if (!session?.user) {
  //   redirect('/login');
  // }

  const university = await getUniversity(universityId);

  if (!university) {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UniversitySidebar
        universityId={universityId}
        universityName={university.name}
        universityLogo={university.logo}
        partnerTier={university.partnerTier}
      />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  );
}
