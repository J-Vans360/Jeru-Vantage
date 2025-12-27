import { NextRequest, NextResponse } from 'next/server';
import {
  findUniversityMatches,
  saveMatchResults,
} from '@/lib/matching/universityMatcher';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optional: allow admins to calculate for specific students
    const body = await request.json().catch(() => ({}));
    const targetUserId = body.userId || userId;

    // For now, only allow users to calculate their own matches
    // TODO: Add admin check for calculating other students' matches
    if (targetUserId !== userId) {
      return NextResponse.json(
        { error: 'Can only calculate matches for yourself' },
        { status: 403 }
      );
    }

    // Calculate matches
    const matches = await findUniversityMatches(targetUserId);

    // Save to database (when model exists)
    await saveMatchResults(targetUserId, matches);

    return NextResponse.json({
      success: true,
      matchCount: matches.length,
      matches: matches.map((m) => ({
        universityId: m.universityId,
        universityName: m.university.name,
        universityCountry: m.university.country,
        universityLogo: m.university.logo,
        partnerTier: m.university.partnerTier,
        programId: m.programId,
        programName: m.program?.name,
        programFaculty: m.program?.faculty,
        tuitionAnnual: m.program?.tuitionAnnual,
        matchScore: m.matchScore,
        componentScores: m.componentScores,
        isHeroMatch: m.isHeroMatch,
        isRunnerUp: m.isRunnerUp,
        displayPriority: m.displayPriority,
        reasons: m.matchReasons,
      })),
    });
  } catch (error) {
    console.error('Matching error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Student profile or assessment not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to calculate matches' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate fresh matches (or get cached in future)
    const matches = await findUniversityMatches(userId);

    return NextResponse.json({
      success: true,
      matchCount: matches.length,
      matches: matches.map((m) => ({
        universityId: m.universityId,
        universityName: m.university.name,
        universityCountry: m.university.country,
        universityLogo: m.university.logo,
        partnerTier: m.university.partnerTier,
        programId: m.programId,
        programName: m.program?.name,
        programFaculty: m.program?.faculty,
        tuitionAnnual: m.program?.tuitionAnnual,
        matchScore: m.matchScore,
        componentScores: m.componentScores,
        isHeroMatch: m.isHeroMatch,
        isRunnerUp: m.isRunnerUp,
        displayPriority: m.displayPriority,
        reasons: m.matchReasons,
      })),
    });
  } catch (error) {
    console.error('Matching error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Complete your assessment first to see university matches' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to get matches' },
      { status: 500 }
    );
  }
}
