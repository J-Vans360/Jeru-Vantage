import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    // Get student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Get pilot assessment for Holland Code and other data
    const pilotAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
    });

    // Get Jeru report if exists (for additional insights)
    const jeruReport = await prisma.jeruReport.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate Holland Code from sub-domain scores
    let hollandCode = '';
    let topStrengths: string[] = [];
    let topValues: string[] = [];
    let multipleIntelligences: string[] = [];
    let careerMatches: string[] = [];

    if (pilotAssessment?.status === 'COMPLETED' && pilotAssessment.subDomainScores) {
      const subDomainScores = pilotAssessment.subDomainScores as Array<{
        id?: string;
        name?: string;
        domainId?: string;
        score?: number;
      }>;

      // Extract Holland Code (top 3 RIASEC types)
      const hollandTypes = subDomainScores
        .filter((s) => s.domainId === 'holland')
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);

      const riasecMap: Record<string, string> = {
        realistic: 'R',
        investigative: 'I',
        artistic: 'A',
        social: 'S',
        enterprising: 'E',
        conventional: 'C',
      };

      hollandCode = hollandTypes.map((h) => riasecMap[h.id || ''] || '').join('');

      // Extract top strengths (top 5 sub-domains by score)
      topStrengths = subDomainScores
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5)
        .map((s) => s.name || 'Unknown');

      // Extract values (from values domain if exists)
      const valueScores = subDomainScores
        .filter((s) => s.domainId === 'values')
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);
      topValues = valueScores.map((v) => v.name || 'Unknown');

      // Extract multiple intelligences (from MI domain if exists)
      const miScores = subDomainScores
        .filter((s) => s.domainId === 'mi' || s.domainId === 'multiple_intelligences')
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3);
      multipleIntelligences = miScores.map((m) => m.name || 'Unknown');
    }

    // Try to extract career matches from Jeru report
    if (jeruReport?.reportContent) {
      try {
        const reportContent = jeruReport.reportContent as { careerMatches?: string[] };
        if (reportContent.careerMatches) {
          careerMatches = reportContent.careerMatches.slice(0, 3);
        }
      } catch {
        // Ignore parsing errors
      }
    }

    // Get career interests from profile as fallback
    if (careerMatches.length === 0 && profile) {
      const interests = [
        profile.careerInterest1,
        profile.careerInterest2,
        profile.careerInterest3,
      ].filter(Boolean) as string[];
      careerMatches = interests;
    }

    return NextResponse.json({
      name: user?.name || profile?.studentName || 'Student',
      email: user?.email || 'Not provided',
      country: profile?.countryResidence || profile?.citizenshipPrimary || 'Not specified',
      degreeLevel: 'Undergraduate', // Default for high school students
      hollandCode: hollandCode || undefined,
      topValues: topValues.length > 0 ? topValues : undefined,
      budgetRange: profile?.annualBudgetRange || undefined,
      topStrengths: topStrengths.length > 0 ? topStrengths : undefined,
      careerMatches: careerMatches.length > 0 ? careerMatches : undefined,
      multipleIntelligences: multipleIntelligences.length > 0 ? multipleIntelligences : undefined,
    });
  } catch (error) {
    console.error('Profile preview error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
