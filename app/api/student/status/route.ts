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

    // Check for survey responses
    const surveys = await prisma.surveyResponse.findMany({
      where: { userId: session.user.id },
      select: { surveyType: true },
    });

    const survey1Completed = surveys.some(s => s.surveyType === 'assessment_feedback');
    const survey2Completed = surveys.some(s => s.surveyType === 'ai_report_feedback');

    // Get AI Report status
    const aiReport = await prisma.aiReport.findUnique({
      where: { userId: session.user.id },
      select: {
        isGenerated: true,
        downloadUnlocked: true,
        survey2Completed: true,
        universityConsentCompleted: true,
        universityConsentLevel: true,
      },
    });

    // Get Jeru Report status and count
    const jeruReport = await prisma.jeruReport.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });

    const jeruReportCount = await prisma.jeruReport.count({
      where: { userId: session.user.id },
    });

    // Get pilot assessment status
    const pilotAssessment = await prisma.pilotAssessment.findUnique({
      where: { userId: session.user.id },
      select: { status: true, completedAt: true },
    });

    // Get full assessment status (to determine user type)
    const fullAssessment = await prisma.assessmentResult.findFirst({
      where: { userId: session.user.id, completed: true },
      select: { id: true },
    });

    // Determine user type: pilot users have pilotAssessment, paid users have fullAssessment
    const isPilotUser = !!pilotAssessment && !fullAssessment;
    const isPaidUser = !!fullAssessment;

    // Download requirements differ by user type:
    // - Pilot users: survey1 + survey2 + consent required
    // - Paid users: only consent required (surveys optional)
    const survey1Done = survey1Completed;
    const survey2Done = survey2Completed || aiReport?.survey2Completed || false;
    const consentDone = aiReport?.universityConsentCompleted || false;

    let canDownload = false;
    if (isPaidUser) {
      // Paid users: only consent required
      canDownload = consentDone;
    } else {
      // Pilot users: all steps required
      canDownload = survey1Done && survey2Done && consentDone;
    }

    // Report generation limits
    const maxReports = isPaidUser ? 2 : 1;
    const canGenerateReport = jeruReportCount < maxReports;

    return NextResponse.json({
      // User type
      isPilotUser,
      isPaidUser,

      // Assessment status
      pilotAssessmentCompleted: pilotAssessment?.status === 'COMPLETED',
      fullAssessmentCompleted: !!fullAssessment,

      // Survey status
      survey1Completed,
      survey2Completed: survey2Done,

      // Consent status
      universityConsentCompleted: consentDone,
      universityConsentLevel: aiReport?.universityConsentLevel || null,

      // Report status
      hasJeruReport: !!jeruReport,
      jeruReportId: jeruReport?.id || null,
      reportsGenerated: jeruReportCount,
      maxReports,
      canGenerateReport,

      // Download status
      canDownload,
      downloadUnlocked: aiReport?.downloadUnlocked || false,
    });
  } catch (error) {
    console.error('Student status error:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
