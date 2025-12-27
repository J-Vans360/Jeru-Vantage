import { prisma } from '@/lib/prisma';
import {
  StudentProfile,
  UniversityProfile,
  MatchResult,
  ComponentScores,
  ProgramProfile,
} from './matchingTypes';
import {
  calculateHollandFit,
  calculateAcademicFit,
  calculateFinancialFit,
  calculateGeographicFit,
  calculatePersonalityFit,
  calculateProgramFit,
  generateMatchReasons,
} from './scoreCalculators';
import { resolvePriorities, passesVetoFilter } from './priorityResolver';
import { MATCH_WEIGHTS } from './constants';

/**
 * Main matching function - orchestrates the entire matching process
 */
export async function findUniversityMatches(
  userId: string
): Promise<MatchResult[]> {
  // 1. Load student profile with assessment results
  const student = await loadStudentProfile(userId);
  if (!student) {
    throw new Error('Student not found or assessment incomplete');
  }

  // 2. Load all active partner universities
  // For now, use mock data until University model is added to schema
  const universities = await loadActiveUniversities();
  if (universities.length === 0) {
    return [];
  }

  // 3. Calculate matches for each university
  const allMatches: MatchResult[] = [];

  for (const university of universities) {
    for (const program of university.programs) {
      // Skip if degree level doesn't match
      if (program.degree !== student.degreeLevel) continue;

      // Apply veto filter first
      const veto = passesVetoFilter(
        student.gpa,
        student.budgetMax,
        university.criteria,
        program.tuitionAnnual
      );

      if (!veto.passes) continue; // University not shown to this student

      // Calculate component scores
      const componentScores = calculateComponentScores(
        student,
        university,
        program
      );

      // Calculate weighted total
      const matchScore = calculateWeightedScore(componentScores);

      // Skip if below university's threshold
      if (matchScore < university.criteria.minMatchScore) continue;

      // Generate match reasons
      const matchReasons = generateMatchReasons(
        student,
        university,
        program,
        componentScores
      );

      allMatches.push({
        universityId: university.id,
        university,
        programId: program.id,
        program,
        matchScore,
        componentScores,
        matchReasons,
        displayPriority: 0,
        isHeroMatch: false,
        isRunnerUp: false,
      });
    }
  }

  // 4. Resolve priorities and return top matches
  return resolvePriorities(allMatches);
}

/**
 * Calculate all component scores
 */
function calculateComponentScores(
  student: StudentProfile,
  university: UniversityProfile,
  program: ProgramProfile
): ComponentScores {
  return {
    hollandFit: calculateHollandFit(student, program.hollandCodes),
    academicFit: calculateAcademicFit(student, university.criteria),
    financialFit: calculateFinancialFit(student, program, university.criteria),
    geographicFit: calculateGeographicFit(student, university),
    personalityFit: calculatePersonalityFit(student, university.criteria),
    programFit: calculateProgramFit(student, program),
  };
}

/**
 * Calculate weighted total score
 */
function calculateWeightedScore(scores: ComponentScores): number {
  const weighted =
    scores.hollandFit * MATCH_WEIGHTS.hollandFit +
    scores.academicFit * MATCH_WEIGHTS.academicFit +
    scores.financialFit * MATCH_WEIGHTS.financialFit +
    scores.geographicFit * MATCH_WEIGHTS.geographicFit +
    scores.personalityFit * MATCH_WEIGHTS.personalityFit +
    scores.programFit * MATCH_WEIGHTS.programFit;

  return Math.round(weighted / 100);
}

/**
 * Parse budget range string to min/max values
 */
function parseBudgetRange(budgetRange: string): {
  min?: number;
  max?: number;
} {
  const ranges: Record<string, { min: number; max: number }> = {
    'under-20k': { min: 0, max: 20000 },
    '20k-40k': { min: 20000, max: 40000 },
    '40k-60k': { min: 40000, max: 60000 },
    '60k-80k': { min: 60000, max: 80000 },
    '80k-plus': { min: 80000, max: 150000 },
  };
  return ranges[budgetRange] || {};
}

/**
 * Load and transform student data into matching profile
 */
async function loadStudentProfile(
  userId: string
): Promise<StudentProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      assessmentResults: {
        where: { completed: true },
      },
    },
  });

  if (!user || !user.assessmentResults.length) return null;

  const profile = user.studentProfile;

  // Find relevant assessment results
  const hollandResult = user.assessmentResults.find(
    (r) =>
      r.domainName.includes('Holland') || r.domainName.includes('Career Interest')
  );
  const personalityResult = user.assessmentResults.find(
    (r) =>
      r.domainName.includes('Personality') ||
      r.domainName.includes('Big Five') ||
      r.domainName.includes('Big 5')
  );
  const valuesResult = user.assessmentResults.find(
    (r) => r.domainName.includes('Values') || r.domainName.includes('Interest')
  );
  const intelligencesResult = user.assessmentResults.find((r) =>
    r.domainName.includes('Intelligence')
  );
  const skillsResult = user.assessmentResults.find((r) =>
    r.domainName.includes('Skills')
  );
  const executionResult = user.assessmentResults.find(
    (r) => r.domainName.includes('Execution') || r.domainName.includes('Grit')
  );

  // Parse scores from JSON
  const hollandScores = (hollandResult?.scores as any)?.domains || [];
  const personalityScores = (personalityResult?.scores as any)?.domains || [];
  const topValues =
    (valuesResult?.scores as any)?.topValues?.slice(0, 3).map((v: any) => v.name) ||
    [];
  const intelligences = (intelligencesResult?.scores as any)?.domains || [];
  const skillsAvg = (skillsResult?.scores as any)?.overallAverage || 0;
  const executionScore = (executionResult?.scores as any)?.executionScore || 0;

  // Parse budget range
  const budget = profile?.annualBudgetRange
    ? parseBudgetRange(profile.annualBudgetRange)
    : {};

  // Build preferred countries list
  const preferredCountries: string[] = [];
  if (profile?.destinationCountry1)
    preferredCountries.push(profile.destinationCountry1);
  if (profile?.destinationCountry2)
    preferredCountries.push(profile.destinationCountry2);
  if (profile?.destinationCountry3)
    preferredCountries.push(profile.destinationCountry3);

  // Build interested fields from career interests
  const interestedFields: string[] = [];
  if (profile?.careerInterest1) interestedFields.push(profile.careerInterest1);
  if (profile?.careerInterest2) interestedFields.push(profile.careerInterest2);
  if (profile?.careerInterest3) interestedFields.push(profile.careerInterest3);

  return {
    id: userId,
    hollandCode:
      (hollandResult?.scores as any)?.hollandCode ||
      hollandScores
        .slice(0, 3)
        .map((h: any) => h.code)
        .join(''),
    hollandScores,
    personalityScores,
    valuesTop3: topValues,
    multipleIntelligences: intelligences,
    skillsAverage: skillsAvg,
    executionScore,
    gpa: undefined, // Not directly stored - would need grade conversion
    budgetMin: budget.min,
    budgetMax: budget.max,
    country: profile?.countryResidence || '',
    preferredCountries,
    degreeLevel: 'BACHELORS', // Default for now
    interestedFields,
    satScore: profile?.satTotal || undefined,
    ieltsScore: profile?.ieltsScore || undefined,
    toeflScore: profile?.toeflScore || undefined,
  };
}

/**
 * Load all active partner universities with criteria and programs
 * TODO: Replace with actual database query when University model is added
 */
async function loadActiveUniversities(): Promise<UniversityProfile[]> {
  // Mock data for development/testing
  // In production, this would query the University table
  const mockUniversities: UniversityProfile[] = [
    {
      id: 'univ-1',
      name: 'University of Melbourne',
      country: 'Australia',
      state: 'Victoria',
      logo: '/universities/melbourne.png',
      partnerTier: 'GOLD',
      criteria: {
        minGPA: 3.0,
        minIELTS: 6.5,
        targetCountries: ['India', 'China', 'Vietnam', 'Indonesia'],
        targetHollandCodes: ['I', 'A', 'S'],
        minMatchScore: 85,
      },
      programs: [
        {
          id: 'prog-1-1',
          name: 'Bachelor of Science',
          faculty: 'Science',
          degree: 'BACHELORS',
          tuitionAnnual: 45000,
          hollandCodes: ['I', 'R'],
          keywords: ['science', 'research', 'physics', 'chemistry', 'biology'],
        },
        {
          id: 'prog-1-2',
          name: 'Bachelor of Arts',
          faculty: 'Arts',
          degree: 'BACHELORS',
          tuitionAnnual: 38000,
          hollandCodes: ['A', 'S'],
          keywords: ['arts', 'humanities', 'literature', 'history', 'philosophy'],
        },
      ],
    },
    {
      id: 'univ-2',
      name: 'University of Toronto',
      country: 'Canada',
      state: 'Ontario',
      logo: '/universities/toronto.png',
      partnerTier: 'PLATINUM',
      criteria: {
        minGPA: 3.2,
        minIELTS: 6.5,
        minSATScore: 1300,
        targetCountries: ['India', 'USA', 'UK'],
        targetHollandCodes: ['I', 'E', 'C'],
        minMatchScore: 85,
      },
      programs: [
        {
          id: 'prog-2-1',
          name: 'Bachelor of Commerce',
          faculty: 'Business',
          degree: 'BACHELORS',
          tuitionAnnual: 55000,
          hollandCodes: ['E', 'C'],
          keywords: ['business', 'commerce', 'finance', 'accounting', 'management'],
        },
        {
          id: 'prog-2-2',
          name: 'Bachelor of Engineering',
          faculty: 'Engineering',
          degree: 'BACHELORS',
          tuitionAnnual: 58000,
          hollandCodes: ['R', 'I'],
          keywords: ['engineering', 'technology', 'computer', 'mechanical', 'electrical'],
        },
      ],
    },
    {
      id: 'univ-3',
      name: 'National University of Singapore',
      country: 'Singapore',
      logo: '/universities/nus.png',
      partnerTier: 'SILVER',
      criteria: {
        minGPA: 3.5,
        minIELTS: 7.0,
        targetCountries: ['India', 'Malaysia', 'Indonesia', 'Vietnam'],
        targetHollandCodes: ['I', 'E'],
        minMatchScore: 85,
      },
      programs: [
        {
          id: 'prog-3-1',
          name: 'Bachelor of Computing',
          faculty: 'Computing',
          degree: 'BACHELORS',
          tuitionAnnual: 35000,
          hollandCodes: ['I', 'R', 'C'],
          keywords: ['computing', 'software', 'data science', 'AI', 'programming'],
        },
      ],
    },
  ];

  return mockUniversities;
}

/**
 * Save match results to database
 * TODO: Implement when StudentMatch model is added to schema
 */
export async function saveMatchResults(
  userId: string,
  matches: MatchResult[]
): Promise<void> {
  // For now, we can store matches in a JSON field or create a new model
  // This is a placeholder for future implementation
  console.log(`Saving ${matches.length} matches for user ${userId}`);

  // When StudentMatch model exists:
  // await prisma.studentMatch.deleteMany({ where: { userId } });
  // await prisma.studentMatch.createMany({
  //   data: matches.map(m => ({
  //     userId,
  //     universityId: m.universityId,
  //     programId: m.programId,
  //     matchScore: m.matchScore,
  //     componentScores: m.componentScores,
  //     matchReasons: m.matchReasons,
  //     displayPriority: m.displayPriority,
  //     status: 'GENERATED',
  //   })),
  // });
}

/**
 * Get cached matches for a student (if available)
 * TODO: Implement when StudentMatch model is added
 */
export async function getCachedMatches(
  userId: string
): Promise<MatchResult[] | null> {
  // Placeholder - return null to force recalculation
  return null;
}
