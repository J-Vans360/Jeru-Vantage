import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { subDays } from 'date-fns';

// Mock leads data for development - same as page.tsx
const getMockLeads = () => [
  {
    id: 'lead-1',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@email.com',
    country: 'India',
    degreeLevel: 'BACHELORS',
    hollandCode: 'ISA',
    matchScore: 94,
    status: 'NEW',
    createdAt: subDays(new Date(), 0.5),
    consentDate: subDays(new Date(), 0.5),
    programId: 'prog-1',
  },
  {
    id: 'lead-2',
    studentName: 'Wei Chen',
    studentEmail: 'wei.chen@email.com',
    country: 'China',
    degreeLevel: 'MASTERS',
    hollandCode: 'IRC',
    matchScore: 91,
    status: 'CONTACTED',
    createdAt: subDays(new Date(), 2),
    consentDate: subDays(new Date(), 2),
    programId: 'prog-2',
  },
  {
    id: 'lead-3',
    studentName: 'Nguyen Van Minh',
    studentEmail: 'minh.nguyen@email.com',
    country: 'Vietnam',
    degreeLevel: 'BACHELORS',
    hollandCode: 'ECS',
    matchScore: 88,
    status: 'APPLIED',
    createdAt: subDays(new Date(), 5),
    consentDate: subDays(new Date(), 5),
    programId: 'prog-1',
  },
  {
    id: 'lead-4',
    studentName: 'Ananya Patel',
    studentEmail: 'ananya.p@email.com',
    country: 'India',
    degreeLevel: 'BACHELORS',
    hollandCode: 'ASE',
    matchScore: 92,
    status: 'ENROLLED',
    createdAt: subDays(new Date(), 14),
    consentDate: subDays(new Date(), 14),
    programId: 'prog-3',
  },
  {
    id: 'lead-5',
    studentName: 'Muhammad Rahman',
    studentEmail: 'm.rahman@email.com',
    country: 'Bangladesh',
    degreeLevel: 'BACHELORS',
    hollandCode: 'RIC',
    matchScore: 86,
    status: 'NEW',
    createdAt: subDays(new Date(), 1),
    consentDate: subDays(new Date(), 1),
    programId: null,
  },
  {
    id: 'lead-6',
    studentName: 'Sakura Tanaka',
    studentEmail: 'sakura.t@email.com',
    country: 'Japan',
    degreeLevel: 'MASTERS',
    hollandCode: 'IAR',
    matchScore: 89,
    status: 'CONTACTED',
    createdAt: subDays(new Date(), 3),
    consentDate: subDays(new Date(), 3),
    programId: 'prog-2',
  },
  {
    id: 'lead-7',
    studentName: 'Ahmad Hassan',
    studentEmail: 'ahmad.h@email.com',
    country: 'Malaysia',
    degreeLevel: 'BACHELORS',
    hollandCode: 'ESC',
    matchScore: 85,
    status: 'NEW',
    createdAt: subDays(new Date(), 0.2),
    consentDate: subDays(new Date(), 0.2),
    programId: 'prog-1',
  },
  {
    id: 'lead-8',
    studentName: 'Li Wei',
    studentEmail: 'li.wei@email.com',
    country: 'China',
    degreeLevel: 'PHD',
    hollandCode: 'IRA',
    matchScore: 96,
    status: 'APPLIED',
    createdAt: subDays(new Date(), 7),
    consentDate: subDays(new Date(), 7),
    programId: 'prog-4',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { universityId } = await params;
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    // TODO: Replace with actual Prisma query when StudentLead model exists
    // const where: any = { universityId };
    // if (status && status !== 'all') where.status = status;
    // if (country && country !== 'all') {
    //   where.student = { profile: { country } };
    // }
    //
    // const leads = await prisma.studentLead.findMany({
    //   where,
    //   include: {
    //     student: {
    //       include: {
    //         user: { select: { name: true, email: true } },
    //         profile: { select: { country: true, degreeLevel: true } },
    //         assessmentResults: {
    //           where: { domainName: 'Career Interests (Holland Code)' },
    //           select: { scores: true },
    //         },
    //       },
    //     },
    //     program: { select: { id: true, name: true } },
    //   },
    //   orderBy: { createdAt: 'desc' },
    // });

    let leads = getMockLeads();

    // Apply filters
    if (status && status !== 'all') {
      leads = leads.filter((l) => l.status === status);
    }

    if (country && country !== 'all') {
      leads = leads.filter((l) => l.country === country);
    }

    if (search) {
      const term = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.studentName.toLowerCase().includes(term) ||
          l.studentEmail.toLowerCase().includes(term) ||
          l.country.toLowerCase().includes(term)
      );
    }

    // Get stats from all leads (before filtering)
    const allLeads = getMockLeads();
    const stats = {
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === 'NEW').length,
      contacted: allLeads.filter((l) => l.status === 'CONTACTED').length,
      applied: allLeads.filter((l) => l.status === 'APPLIED').length,
      enrolled: allLeads.filter((l) => l.status === 'ENROLLED').length,
    };

    return NextResponse.json({
      leads,
      stats,
      countries: [...new Set(allLeads.map((l) => l.country))].sort(),
    });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json({ error: 'Failed to get leads' }, { status: 500 });
  }
}
