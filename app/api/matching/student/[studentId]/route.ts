import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUniversityMatches } from '@/lib/matching/universityMatcher';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId } = await params;

    // For now, studentId is actually the userId
    // Verify the user is requesting their own matches
    if (studentId !== session.user.id) {
      return NextResponse.json(
        { error: 'Can only view your own matches' },
        { status: 403 }
      );
    }

    try {
      // Use the existing matching algorithm
      const allMatches = await findUniversityMatches(studentId);

      // Transform to the format expected by UniversityMatches component
      const matches = allMatches.slice(0, 3).map((match, index) => ({
        id: `match-${match.universityId}-${match.programId || 'default'}`,
        universityId: match.universityId,
        universityName: match.university.name,
        universityLogo: match.university.logo,
        universityCountry: match.university.country,
        programId: match.programId,
        programName: match.program?.name,
        programFaculty: match.program?.faculty,
        tuitionAnnual: match.program?.tuitionAnnual || 0,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
        isHeroMatch: index === 0,
        isRunnerUp: index > 0,
      }));

      return NextResponse.json({ matches });
    } catch (matchError) {
      // If matching fails (e.g., no assessment completed), return empty matches
      console.log('Matching not available:', matchError);
      return NextResponse.json({ matches: [] });
    }
  } catch (error) {
    console.error('Fetch matches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
