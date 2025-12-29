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

    // Get AI report
    const report = await prisma.aiReport.findUnique({
      where: { userId: session.user.id },
    });

    if (!report || !report.isGenerated) {
      return NextResponse.json({
        error: 'Report not generated yet'
      }, { status: 404 });
    }

    // Check if survey 2 completed (download unlocked)
    if (!report.downloadUnlocked) {
      return NextResponse.json({
        error: 'Complete the feedback survey to unlock download',
        surveyRequired: true,
      }, { status: 403 });
    }

    // Get student profile for name
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      select: { studentName: true },
    });

    // Return report data for client-side PDF generation
    return NextResponse.json({
      success: true,
      report: report.reportContent,
      hollandCode: report.hollandCode,
      studentName: profile?.studentName || 'Student',
      generatedAt: report.generatedAt,
    });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json({ error: 'Failed to prepare download' }, { status: 500 });
  }
}
