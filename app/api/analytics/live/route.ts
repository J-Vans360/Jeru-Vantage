import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Get active sessions
    const activeSessions = await prisma.activeSession.findMany({
      where: {
        lastActiveAt: { gte: fiveMinutesAgo },
      },
    });

    // Group by activity
    const activityBreakdown: Record<string, number> = {
      browsing: 0,
      assessment: 0,
      results: 0,
      matching: 0,
    };

    activeSessions.forEach((session) => {
      const activity = session.currentActivity || 'browsing';
      activityBreakdown[activity] = (activityBreakdown[activity] || 0) + 1;
    });

    // Get today's summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEvents = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where: {
        timestamp: { gte: today },
      },
      _count: true,
    });

    const todayStats: Record<string, number> = {};
    todayEvents.forEach((event) => {
      todayStats[event.eventName] = event._count;
    });

    // Clean up stale sessions
    await prisma.activeSession.deleteMany({
      where: {
        lastActiveAt: { lt: fiveMinutesAgo },
      },
    });

    return NextResponse.json({
      liveNow: {
        total: activeSessions.length,
        ...activityBreakdown,
      },
      today: {
        pageViews: todayStats['page_view'] || 0,
        registrations: todayStats['registration_completed'] || 0,
        assessmentsStarted: todayStats['assessment_started'] || 0,
        assessmentsCompleted: todayStats['assessment_completed'] || 0,
        universityConnections: todayStats['university_connected'] || 0,
        feedbackSubmitted: todayStats['feedback_submitted'] || 0,
      },
    });
  } catch (error) {
    console.error('Live stats error:', error);
    return NextResponse.json({ error: 'Failed to get live stats' }, { status: 500 });
  }
}
