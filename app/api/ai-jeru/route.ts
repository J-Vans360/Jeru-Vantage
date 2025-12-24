import { NextResponse } from 'next/server';
import { getAIJeruRecommendations } from '@/lib/ai-jeru';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-utils';

export async function POST() {
  try {
    const userId = await getCurrentUserId();

    // Get student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjects: true,
      },
    });

    // Get all assessment results
    const assessments = await prisma.assessmentResult.findMany({
      where: {
        userId,
        completed: true,
      },
    });

    // Check if profile and assessments exist
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }

    if (assessments.length === 0) {
      return NextResponse.json(
        { error: 'No assessments found. Please complete at least one assessment.' },
        { status: 404 }
      );
    }

    // Combine all data
    const studentData = {
      profile: {
        name: profile.studentName,
        grade: profile.currentGrade,
        targetYear: profile.targetEntryYear,
        citizenship: profile.citizenshipPrimary,
        countryResidence: profile.countryResidence,
        budget: profile.annualBudgetRange,
        needAid: profile.needBasedAid,
        curriculum: profile.primaryCurriculum,
        subjects: profile.subjects,
        testing: {
          satTotal: profile.satTotal,
          actComposite: profile.actComposite,
          ielts: profile.ieltsScore,
          toefl: profile.toeflScore,
        },
        careerInterests: [
          profile.careerInterest1,
          profile.careerInterest2,
          profile.careerInterest3,
        ].filter(Boolean),
        destinations: [
          profile.destinationCountry1,
          profile.destinationCountry2,
          profile.destinationCountry3,
        ].filter(Boolean),
      },
      assessments: assessments.reduce((acc, a) => {
        acc[a.domainName] = a.scores;
        return acc;
      }, {} as Record<string, any>),
    };

    // Get AI Jeru recommendations
    const recommendations = await getAIJeruRecommendations(studentData);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('AI Jeru error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
