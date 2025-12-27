import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Retrieve pilot survey for current user
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const survey = await prisma.pilotSurvey.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      exists: !!survey,
      survey,
    });
  } catch (error) {
    console.error('Error fetching pilot survey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey' },
      { status: 500 }
    );
  }
}

// POST - Save pilot survey responses
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
    const {
      referralSource,
      referralOther,
      biggestChallenge,
      challengeDetails,
      willingToPay,
      priceRange,
      desiredFeatures,
      otherFeatures,
      generalFeedback,
    } = body;

    // Validate required fields
    if (!referralSource || !biggestChallenge || !willingToPay || !desiredFeatures) {
      return NextResponse.json(
        { error: 'Missing required survey fields' },
        { status: 400 }
      );
    }

    // Upsert survey (create or update)
    const survey = await prisma.pilotSurvey.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        referralSource,
        referralOther: referralOther || null,
        biggestChallenge,
        challengeDetails: challengeDetails || null,
        willingToPay,
        priceRange: priceRange || null,
        desiredFeatures,
        otherFeatures: otherFeatures || null,
        generalFeedback: generalFeedback || null,
      },
      update: {
        referralSource,
        referralOther: referralOther || null,
        biggestChallenge,
        challengeDetails: challengeDetails || null,
        willingToPay,
        priceRange: priceRange || null,
        desiredFeatures,
        otherFeatures: otherFeatures || null,
        generalFeedback: generalFeedback || null,
      },
    });

    return NextResponse.json({
      success: true,
      survey,
    });
  } catch (error) {
    console.error('Error saving pilot survey:', error);
    return NextResponse.json(
      { error: 'Failed to save survey' },
      { status: 500 }
    );
  }
}
