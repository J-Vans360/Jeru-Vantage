import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculatePilotScores, validateResponses } from '@/lib/pilot/pilotScoring';

// POST - Complete the pilot assessment and calculate scores
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { responses, totalTimeSeconds } = body;

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        { error: 'Invalid responses data' },
        { status: 400 }
      );
    }

    // Check if assessment exists
    const existingAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
    });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found. Please start a new assessment.' },
        { status: 404 }
      );
    }

    if (existingAssessment.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Assessment already completed' },
        { status: 400 }
      );
    }

    // Validate all questions are answered
    const validation = validateResponses(responses);

    if (!validation.isComplete) {
      return NextResponse.json(
        {
          error: 'Assessment incomplete',
          missing: validation.missingQuestions.length,
          answered: validation.answeredCount,
          total: validation.totalCount,
        },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = calculatePilotScores(responses);

    // Extract domain and sub-domain scores for separate storage
    const domainScores = scores.domains.map(d => ({
      id: d.id,
      name: d.name,
      score: d.score,
      icon: d.icon,
      color: d.color,
    }));

    const subDomainScores = scores.domains.flatMap(d =>
      d.subDomains.map(s => ({
        domainId: d.id,
        ...s,
      }))
    );

    // Update assessment with completion
    const assessment = await prisma.pilotAssessment.update({
      where: { userId: session.user.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        responses,
        domainScores,
        subDomainScores,
        totalTimeSeconds: totalTimeSeconds || null,
      },
    });

    return NextResponse.json({
      success: true,
      assessment: {
        id: assessment.id,
        status: assessment.status,
        completedAt: assessment.completedAt,
      },
      scores: {
        domains: scores.domains,
        hollandCode: scores.hollandCode,
        topStrengths: scores.topStrengths,
        developmentAreas: scores.developmentAreas,
        overallProfile: scores.overallProfile,
      },
    });
  } catch (error) {
    console.error('Error completing pilot assessment:', error);
    return NextResponse.json(
      { error: 'Failed to complete assessment' },
      { status: 500 }
    );
  }
}
