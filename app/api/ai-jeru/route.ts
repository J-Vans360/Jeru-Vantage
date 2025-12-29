import { NextResponse } from 'next/server';
import { getAIJeruRecommendations, getUserReports, getReportById } from '@/lib/ai-jeru';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/auth-utils';

// Helper function to build profile data
function buildProfileData(profile: any) {
  return {
    studentName: profile.studentName,
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
  };
}

// Generate new report
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

    // Get all assessment results (full assessment)
    const assessments = await prisma.assessmentResult.findMany({
      where: {
        userId,
        completed: true,
      },
    });

    // Get pilot assessment if no full assessments
    const pilotAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId },
    });

    // Check if profile exists
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }

    // Check if we have any assessment data (full OR pilot)
    const hasFullAssessment = assessments.length > 0;
    const hasPilotAssessment = pilotAssessment?.status === 'COMPLETED' && pilotAssessment.domainScores;

    if (!hasFullAssessment && !hasPilotAssessment) {
      return NextResponse.json(
        { error: 'No assessments found. Please complete at least one assessment.' },
        { status: 404 }
      );
    }

    // Check report generation limits
    // Pilot users: 1 report max, Paid users: 2 reports max
    const isPaidUser = hasFullAssessment;
    const maxReports = isPaidUser ? 2 : 1;

    const existingReportsCount = await prisma.jeruReport.count({
      where: { userId },
    });

    if (existingReportsCount >= maxReports) {
      return NextResponse.json(
        {
          error: 'Report limit reached',
          message: isPaidUser
            ? 'You have reached your limit of 2 reports.'
            : 'Pilot users can generate 1 report. Upgrade to the full assessment for more reports!',
          reportsGenerated: existingReportsCount,
          maxReports,
          isPaidUser,
        },
        { status: 403 }
      );
    }

    // Build student data based on available assessment type
    let studentData;

    if (hasFullAssessment) {
      // Use full assessment data
      studentData = {
        profile: buildProfileData(profile),
        assessments: assessments.reduce((acc, a) => {
          acc[a.domainName] = a.scores;
          return acc;
        }, {} as Record<string, any>),
        assessmentType: 'full',
      };
    } else {
      // Use pilot assessment data
      const domainScores = pilotAssessment!.domainScores as any[];
      const subDomainScores = pilotAssessment!.subDomainScores as any[];

      // Calculate Holland Code from subDomainScores
      const hollandSubs = subDomainScores
        ?.filter((s: any) => s.domainId === 'holland')
        ?.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
        ?.slice(0, 3) || [];

      const riasecMap: Record<string, string> = {
        realistic: 'R',
        investigative: 'I',
        artistic: 'A',
        social: 'S',
        enterprising: 'E',
        conventional: 'C',
      };

      const hollandCode = hollandSubs.map((s: any) => riasecMap[s.id] || 'X').join('');

      // Build assessments object from pilot data
      const pilotAssessmentData: Record<string, any> = {};

      // Add domain scores
      if (domainScores && Array.isArray(domainScores)) {
        domainScores.forEach((domain: any) => {
          pilotAssessmentData[domain.name || domain.id] = {
            overallScore: domain.score,
            domain: domain.name || domain.id,
          };
        });
      }

      // Add detailed sub-domain scores grouped by domain
      if (subDomainScores && Array.isArray(subDomainScores)) {
        const groupedByDomain: Record<string, any[]> = {};

        subDomainScores.forEach((sub: any) => {
          const domainId = sub.domainId || 'other';
          if (!groupedByDomain[domainId]) {
            groupedByDomain[domainId] = [];
          }
          groupedByDomain[domainId].push({
            name: sub.name,
            score: sub.score,
            id: sub.id,
          });
        });

        // Merge into pilotAssessmentData
        Object.entries(groupedByDomain).forEach(([domainId, subs]) => {
          const domainName = domainScores?.find((d: any) => d.id === domainId)?.name || domainId;
          if (!pilotAssessmentData[domainName]) {
            pilotAssessmentData[domainName] = {};
          }
          pilotAssessmentData[domainName].subDomains = subs;
        });
      }

      // Add Holland Code interpretation
      pilotAssessmentData['Holland Code'] = {
        code: hollandCode,
        breakdown: hollandSubs.map((s: any) => ({
          letter: riasecMap[s.id] || s.id,
          name: s.name,
          score: s.score,
        })),
      };

      // Calculate top strengths and growth areas
      const sortedByScore = [...(subDomainScores || [])].sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

      pilotAssessmentData['Top Strengths'] = sortedByScore.slice(0, 5).map((s: any) => ({
        name: s.name,
        score: s.score,
        domain: s.domainId,
      }));

      pilotAssessmentData['Growth Areas'] = sortedByScore.slice(-5).reverse().map((s: any) => ({
        name: s.name,
        score: s.score,
        domain: s.domainId,
      }));

      studentData = {
        profile: buildProfileData(profile),
        assessments: pilotAssessmentData,
        assessmentType: 'pilot',
        completedAt: pilotAssessment!.completedAt,
        totalTimeSeconds: pilotAssessment!.totalTimeSeconds,
      };
    }

    // Get AI Jeru recommendations (now saves to database)
    const result = await getAIJeruRecommendations(userId, studentData);

    return NextResponse.json({
      recommendations: result.report,
      reportId: result.reportId,
      generationNumber: result.generationNumber,
      createdAt: result.createdAt,
      studentName: profile.studentName,
    });
  } catch (error) {
    console.error('AI Jeru error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

// Get user's reports
export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (reportId) {
      // Get specific report
      const report = await getReportById(reportId, userId);
      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ report });
    }

    // Get all reports
    const reports = await getUserReports(userId);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}
