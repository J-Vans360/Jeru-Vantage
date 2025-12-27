import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      overallRating,
      accuracyRating,
      npsScore,
      mostValuableInsight,
      improvementSuggestion,
      canFeature,
      featureAnonymously,
      testimonialQuote,
    } = body;

    // Check if feedback already exists
    const existing = await prisma.reportFeedback.findUnique({
      where: { userId: studentId },
    });

    if (existing) {
      return NextResponse.json({ error: 'Feedback already submitted' }, { status: 400 });
    }

    // Get device type from user agent
    const userAgent = request.headers.get('user-agent') || '';
    const deviceType = /mobile/i.test(userAgent)
      ? 'mobile'
      : /tablet/i.test(userAgent)
        ? 'tablet'
        : 'desktop';

    // Create feedback
    const feedback = await prisma.reportFeedback.create({
      data: {
        userId: studentId,
        overallRating,
        accuracyRating,
        npsScore,
        mostValuableInsight,
        improvementSuggestion,
        canFeature,
        featureAnonymously,
        testimonialQuote,
        deviceType,
      },
    });

    // Track event (analytics)
    try {
      await prisma.analyticsEvent.create({
        data: {
          eventName: 'feedback_submitted',
          eventCategory: 'engagement',
          sessionId: request.headers.get('x-session-id') || 'unknown',
          userId: studentId,
          properties: {
            overallRating,
            accuracyRating,
            npsScore,
            canFeature,
          },
          deviceType,
        },
      });
    } catch (analyticsError) {
      // Don't fail the request if analytics fails
      console.error('Failed to track feedback event:', analyticsError);
    }

    return NextResponse.json({ success: true, feedbackId: feedback.id });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

// Get feedback stats
export async function GET() {
  try {
    const stats = await prisma.reportFeedback.aggregate({
      _avg: {
        overallRating: true,
        accuracyRating: true,
        npsScore: true,
      },
      _count: true,
    });

    // NPS calculation
    const npsBreakdown = await prisma.reportFeedback.groupBy({
      by: ['npsScore'],
      _count: true,
    });

    let promoters = 0;
    let detractors = 0;
    let total = 0;

    npsBreakdown.forEach((item) => {
      total += item._count;
      if (item.npsScore >= 9) promoters += item._count;
      if (item.npsScore <= 6) detractors += item._count;
    });

    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

    return NextResponse.json({
      totalFeedbacks: stats._count,
      avgOverallRating: stats._avg.overallRating?.toFixed(1) || 0,
      avgAccuracyRating: stats._avg.accuracyRating?.toFixed(1) || 0,
      npsScore,
    });
  } catch (error) {
    console.error('Feedback stats error:', error);
    return NextResponse.json({ error: 'Failed to get feedback stats' }, { status: 500 });
  }
}
