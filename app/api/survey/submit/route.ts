import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { surveyType, responses } = await request.json();

    if (!surveyType || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save survey response
    await prisma.surveyResponse.create({
      data: {
        userId: session.user.id,
        surveyType,
        responses,
      },
    });

    // Update related records based on survey type
    if (surveyType === 'ai_report_feedback') {
      // Mark survey2 as completed (download still requires university consent)
      await prisma.aiReport.upsert({
        where: { userId: session.user.id },
        update: { survey2Completed: true },
        create: {
          userId: session.user.id,
          reportContent: {},
          survey2Completed: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey submit error:', error);
    return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 });
  }
}
