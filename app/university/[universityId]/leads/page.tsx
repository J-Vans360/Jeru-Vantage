import { subDays } from 'date-fns';
import LeadsManager from '@/components/university/LeadsManager';

interface LeadsPageProps {
  params: { universityId: string };
  searchParams: {
    status?: string;
    country?: string;
    program?: string;
    search?: string;
    sort?: string;
  };
}

// Mock data for development - replace with actual DB queries when models exist
async function getLeadsData(universityId: string, filters: LeadsPageProps['searchParams']) {
  // Mock leads
  const allLeads = [
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

  // Apply filters
  let filteredLeads = [...allLeads];

  if (filters.status && filters.status !== 'all') {
    filteredLeads = filteredLeads.filter((l) => l.status === filters.status);
  }

  if (filters.country && filters.country !== 'all') {
    filteredLeads = filteredLeads.filter((l) => l.country === filters.country);
  }

  // Get unique countries
  const countries = [...new Set(allLeads.map((l) => l.country))].sort();

  // Mock programs
  const programs = [
    { id: 'prog-1', name: 'Bachelor of Computer Science' },
    { id: 'prog-2', name: 'Master of Data Science' },
    { id: 'prog-3', name: 'Bachelor of Business Administration' },
    { id: 'prog-4', name: 'PhD in Machine Learning' },
  ];

  // Calculate stats from all leads (before filtering)
  const stats = {
    total: allLeads.length,
    new: allLeads.filter((l) => l.status === 'NEW').length,
    contacted: allLeads.filter((l) => l.status === 'CONTACTED').length,
    applied: allLeads.filter((l) => l.status === 'APPLIED').length,
    enrolled: allLeads.filter((l) => l.status === 'ENROLLED').length,
  };

  return {
    leads: filteredLeads,
    countries,
    programs,
    stats,
  };
}

export default async function LeadsPage({ params, searchParams }: LeadsPageProps) {
  const { universityId } = params;
  const data = await getLeadsData(universityId, searchParams);

  // TODO: Replace mock data with actual Prisma queries when models exist:
  // const where: any = { universityId };
  // if (searchParams.status && searchParams.status !== 'all') {
  //   where.status = searchParams.status;
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
  //   },
  //   orderBy: { createdAt: 'desc' },
  // });

  return (
    <LeadsManager
      universityId={universityId}
      leads={data.leads}
      countries={data.countries}
      programs={data.programs}
      stats={data.stats}
      filters={searchParams}
    />
  );
}
