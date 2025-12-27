import ProgramsManager from '@/components/university/ProgramsManager';

interface ProgramsPageProps {
  params: { universityId: string };
}

// Mock data for development - replace with actual DB queries when Program model exists
async function getProgramsData(universityId: string) {
  // Mock programs
  const programs = [
    {
      id: 'prog-1',
      name: 'Bachelor of Computer Science',
      faculty: 'Faculty of Engineering',
      degree: 'BACHELORS',
      duration: 4,
      tuitionAnnual: 45000,
      hollandCodes: ['I', 'R', 'C'],
      keywords: ['Software Engineering', 'AI', 'Data Science', 'Programming'],
      isActive: true,
      matchCount: 156,
    },
    {
      id: 'prog-2',
      name: 'Bachelor of Business Administration',
      faculty: 'Faculty of Business',
      degree: 'BACHELORS',
      duration: 3,
      tuitionAnnual: 38000,
      hollandCodes: ['E', 'C', 'S'],
      keywords: ['Business', 'Management', 'Finance', 'Marketing'],
      isActive: true,
      matchCount: 89,
    },
    {
      id: 'prog-3',
      name: 'Master of Data Science',
      faculty: 'Faculty of Engineering',
      degree: 'MASTERS',
      duration: 2,
      tuitionAnnual: 52000,
      hollandCodes: ['I', 'C'],
      keywords: ['Data Science', 'Machine Learning', 'Statistics', 'Big Data'],
      isActive: true,
      matchCount: 67,
    },
    {
      id: 'prog-4',
      name: 'Bachelor of Arts in Psychology',
      faculty: 'Faculty of Arts & Sciences',
      degree: 'BACHELORS',
      duration: 4,
      tuitionAnnual: 35000,
      hollandCodes: ['S', 'I', 'A'],
      keywords: ['Psychology', 'Mental Health', 'Research', 'Counseling'],
      isActive: true,
      matchCount: 45,
    },
    {
      id: 'prog-5',
      name: 'Bachelor of Fine Arts',
      faculty: 'Faculty of Arts & Sciences',
      degree: 'BACHELORS',
      duration: 4,
      tuitionAnnual: 32000,
      hollandCodes: ['A', 'S'],
      keywords: ['Art', 'Design', 'Creative', 'Visual Arts'],
      isActive: false,
      matchCount: 12,
    },
    {
      id: 'prog-6',
      name: 'Bachelor of Mechanical Engineering',
      faculty: 'Faculty of Engineering',
      degree: 'BACHELORS',
      duration: 4,
      tuitionAnnual: 48000,
      hollandCodes: ['R', 'I'],
      keywords: ['Engineering', 'Mechanical', 'Manufacturing', 'Design'],
      isActive: true,
      matchCount: 78,
    },
  ];

  // Get unique faculties
  const faculties = [...new Set(programs.map((p) => p.faculty))].sort();

  return { programs, faculties };
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { universityId } = params;
  const { programs, faculties } = await getProgramsData(universityId);

  // TODO: Replace mock data with actual Prisma queries when models exist:
  // const programs = await prisma.program.findMany({
  //   where: { universityId },
  //   orderBy: [{ faculty: 'asc' }, { name: 'asc' }],
  // });
  //
  // const programStats = await prisma.studentMatch.groupBy({
  //   by: ['programId'],
  //   where: { universityId, programId: { not: null } },
  //   _count: true,
  // });
  //
  // const programsWithStats = programs.map(program => ({
  //   ...program,
  //   matchCount: programStats.find(s => s.programId === program.id)?._count || 0,
  // }));

  return (
    <ProgramsManager universityId={universityId} programs={programs} faculties={faculties} />
  );
}
