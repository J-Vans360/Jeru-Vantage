import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { subDays } from 'date-fns';

// Mock data for development - replace with actual Prisma queries when models exist
function getMockSharedDataRecords() {
  return [
    {
      id: 'lead-1',
      universityId: 'univ-1',
      universityName: 'University of Melbourne',
      universityLogo: undefined,
      universityCountry: 'Australia',
      programName: 'Bachelor of Computer Science',
      consentLevel: 'ENHANCED' as const,
      consentDate: subDays(new Date(), 5),
      status: 'NEW',
      matchScore: 94,
      sharedData: {
        basic: [
          { label: 'Name', value: 'John Doe', category: 'identity' as const },
          { label: 'Email', value: 'john.doe@email.com', category: 'identity' as const },
          { label: 'Country', value: 'Singapore', category: 'identity' as const },
          { label: 'Degree Level', value: "Bachelor's", category: 'academic' as const },
          { label: 'Match Score', value: '94%', category: 'assessment' as const },
        ],
        enhanced: [
          { label: 'Career Interests (Holland Code)', value: 'IRC', category: 'interests' as const },
          { label: 'Top 3 Values', value: 'Achievement, Independence, Recognition', category: 'interests' as const },
          { label: 'Budget Range', value: '$30,000 - $50,000', category: 'financial' as const },
          { label: 'Academic Status', value: 'Qualified', category: 'academic' as const },
        ],
      },
      canWithdraw: true,
    },
    {
      id: 'lead-2',
      universityId: 'univ-2',
      universityName: 'University of Toronto',
      universityLogo: undefined,
      universityCountry: 'Canada',
      programName: 'Master of Data Science',
      consentLevel: 'FULL' as const,
      consentDate: subDays(new Date(), 12),
      status: 'CONTACTED',
      matchScore: 91,
      sharedData: {
        basic: [
          { label: 'Name', value: 'John Doe', category: 'identity' as const },
          { label: 'Email', value: 'john.doe@email.com', category: 'identity' as const },
          { label: 'Country', value: 'Singapore', category: 'identity' as const },
          { label: 'Degree Level', value: "Master's", category: 'academic' as const },
          { label: 'Match Score', value: '91%', category: 'assessment' as const },
        ],
        enhanced: [
          { label: 'Career Interests (Holland Code)', value: 'IRC', category: 'interests' as const },
          { label: 'Top 3 Values', value: 'Achievement, Independence, Recognition', category: 'interests' as const },
          { label: 'Budget Range', value: '$30,000 - $50,000', category: 'financial' as const },
          { label: 'Academic Status', value: 'Qualified', category: 'academic' as const },
        ],
        full: [
          { label: 'Top Intelligences', value: 'Logical-Mathematical, Linguistic, Intrapersonal', category: 'assessment' as const },
          { label: '21st Century Skills', value: '85% proficiency', category: 'assessment' as const },
          { label: 'Execution & Grit', value: '78%', category: 'assessment' as const },
        ],
      },
      canWithdraw: true,
    },
    {
      id: 'lead-3',
      universityId: 'univ-3',
      universityName: 'National University of Singapore',
      universityLogo: undefined,
      universityCountry: 'Singapore',
      programName: 'Bachelor of Business Administration',
      consentLevel: 'BASIC' as const,
      consentDate: subDays(new Date(), 30),
      status: 'ENROLLED',
      matchScore: 88,
      sharedData: {
        basic: [
          { label: 'Name', value: 'John Doe', category: 'identity' as const },
          { label: 'Email', value: 'john.doe@email.com', category: 'identity' as const },
          { label: 'Country', value: 'Singapore', category: 'identity' as const },
          { label: 'Degree Level', value: "Bachelor's", category: 'academic' as const },
          { label: 'Match Score', value: '88%', category: 'assessment' as const },
        ],
      },
      canWithdraw: false, // Already enrolled, cannot withdraw
    },
  ];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Replace with actual Prisma queries when models exist
    // const student = await prisma.student.findFirst({
    //   where: { userId: session.user.id },
    //   include: {
    //     user: { select: { name: true, email: true } },
    //     profile: true,
    //     assessmentResults: true,
    //   },
    // });

    // if (!student) {
    //   return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    // }

    // const leads = await prisma.studentLead.findMany({
    //   where: {
    //     studentId: student.id,
    //     consentGiven: true,
    //   },
    //   include: {
    //     university: {
    //       select: {
    //         id: true,
    //         name: true,
    //         country: true,
    //         logo: true,
    //       },
    //     },
    //   },
    //   orderBy: { createdAt: 'desc' },
    // });

    // const matches = await prisma.studentMatch.findMany({
    //   where: { studentId: student.id },
    // });

    // const records = leads.map(lead => {
    //   const match = matches.find(m => m.universityId === lead.universityId);
    //   const sharedData = buildSharedDataDisplay(
    //     student,
    //     lead.consentLevel,
    //     match?.matchScore || 0
    //   );
    //
    //   return {
    //     id: lead.id,
    //     universityId: lead.universityId,
    //     universityName: lead.university.name,
    //     universityLogo: lead.university.logo,
    //     universityCountry: lead.university.country,
    //     programId: lead.programId,
    //     consentLevel: lead.consentLevel,
    //     consentDate: lead.consentDate,
    //     status: lead.status || 'PENDING',
    //     matchScore: match?.matchScore || 0,
    //     sharedData,
    //     canWithdraw: !lead.consentWithdrawnAt && lead.status !== 'ENROLLED',
    //   };
    // });

    // Return mock data for development
    const records = getMockSharedDataRecords();

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Get shared data error:', error);
    return NextResponse.json({ error: 'Failed to fetch shared data' }, { status: 500 });
  }
}

// Helper function to build shared data display
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildSharedDataDisplay(student: any, consentLevel: string, matchScore: number) {
  const basic = [
    { label: 'Name', value: student.user.name, category: 'identity' as const },
    { label: 'Email', value: student.user.email, category: 'identity' as const },
    {
      label: 'Country',
      value: student.profile?.country || 'Not specified',
      category: 'identity' as const,
    },
    {
      label: 'Degree Level',
      value: student.profile?.degreeLevel || 'Not specified',
      category: 'academic' as const,
    },
    { label: 'Match Score', value: `${matchScore}%`, category: 'assessment' as const },
  ];

  if (consentLevel === 'BASIC') {
    return { basic };
  }

  // Enhanced level
  const hollandResult = student.assessmentResults?.find(
    (r: any) => r.domainName === 'Career Interests (Holland Code)'
  );
  const valuesResult = student.assessmentResults?.find(
    (r: any) => r.domainName === 'Values & Interests'
  );

  const enhanced = [
    {
      label: 'Career Interests (Holland Code)',
      value: hollandResult?.scores?.code || 'Not assessed',
      category: 'interests' as const,
    },
    {
      label: 'Top 3 Values',
      value:
        valuesResult?.scores?.topValues
          ?.slice(0, 3)
          .map((v: any) => v.name)
          .join(', ') || 'Not assessed',
      category: 'interests' as const,
    },
    {
      label: 'Budget Range',
      value: student.profile?.budgetMax
        ? `$${student.profile.budgetMin?.toLocaleString() || 0} - $${student.profile.budgetMax.toLocaleString()}`
        : 'Not specified',
      category: 'financial' as const,
    },
    {
      label: 'Academic Status',
      value:
        student.profile?.gpa >= 3.0
          ? 'Qualified'
          : student.profile?.gpa >= 2.5
            ? 'Conditional'
            : 'Review Required',
      category: 'academic' as const,
    },
  ];

  if (consentLevel === 'ENHANCED') {
    return { basic, enhanced };
  }

  // Full level
  const intelligencesResult = student.assessmentResults?.find(
    (r: any) => r.domainName === 'Multiple Intelligences'
  );
  const skillsResult = student.assessmentResults?.find(
    (r: any) => r.domainName === '21st Century Skills'
  );
  const executionResult = student.assessmentResults?.find(
    (r: any) => r.domainName === 'Execution & Grit'
  );

  const full = [
    {
      label: 'Top Intelligences',
      value:
        intelligencesResult?.scores?.domains
          ?.sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3)
          .map((d: any) => d.name)
          .join(', ') || 'Not assessed',
      category: 'assessment' as const,
    },
    {
      label: '21st Century Skills',
      value: skillsResult?.scores?.overallAvg
        ? `${Math.round((skillsResult.scores.overallAvg / 25) * 100)}% proficiency`
        : 'Not assessed',
      category: 'assessment' as const,
    },
    {
      label: 'Execution & Grit',
      value: executionResult?.scores?.overallPercentage
        ? `${executionResult.scores.overallPercentage}%`
        : 'Not assessed',
      category: 'assessment' as const,
    },
  ];

  return { basic, enhanced, full };
}
