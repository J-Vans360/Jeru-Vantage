import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateResponses } from '@/lib/pilot/pilotScoring';

// GET - Retrieve pilot assessment for current user
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const assessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({
        exists: false,
        assessment: null,
      });
    }

    return NextResponse.json({
      exists: true,
      assessment: {
        id: assessment.id,
        status: assessment.status,
        startedAt: assessment.startedAt,
        completedAt: assessment.completedAt,
        responses: assessment.responses,
        domainScores: assessment.domainScores,
        subDomainScores: assessment.subDomainScores,
        totalTimeSeconds: assessment.totalTimeSeconds,
        user: assessment.user,
      },
    });
  } catch (error) {
    console.error('Error fetching pilot assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

// POST - Create or start a new pilot assessment
export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if assessment already exists
    const existingAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
    });

    if (existingAssessment) {
      // If already completed, don't allow restart
      if (existingAssessment.status === 'COMPLETED') {
        return NextResponse.json(
          { error: 'Assessment already completed' },
          { status: 400 }
        );
      }

      // Return existing in-progress assessment
      return NextResponse.json({
        success: true,
        assessment: existingAssessment,
        isNew: false,
      });
    }

    // Create new assessment
    const assessment = await prisma.pilotAssessment.create({
      data: {
        userId: session.user.id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        responses: {},
      },
    });

    return NextResponse.json({
      success: true,
      assessment,
      isNew: true,
    });
  } catch (error) {
    console.error('Error creating pilot assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}

// PUT - Save progress on pilot assessment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { responses } = body;

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

    // Merge with existing responses
    const existingResponses = (existingAssessment.responses as Record<string, number>) || {};
    const mergedResponses = { ...existingResponses, ...responses };

    // Update assessment
    await prisma.pilotAssessment.update({
      where: { userId: session.user.id },
      data: {
        responses: mergedResponses,
        updatedAt: new Date(),
      },
    });

    // Get progress info
    const validation = validateResponses(mergedResponses);

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
      progress: {
        answered: validation.answeredCount,
        total: validation.totalCount,
        percentage: Math.round((validation.answeredCount / validation.totalCount) * 100),
      },
    });
  } catch (error) {
    console.error('Error saving pilot assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}
