import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Platform Analytics | Admin',
  description: 'Real-time platform metrics and insights',
};

export default async function PlatformAnalyticsPage() {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // Get daily summaries
  const dailySummaries = await prisma.dailyAnalyticsSummary.findMany({
    where: {
      date: { gte: thirtyDaysAgo },
    },
    orderBy: { date: 'asc' },
  });

  // Build trend data from summaries
  let trendData = dailySummaries.map((day) => ({
    date: format(new Date(day.date), 'MMM dd'),
    visits: day.totalVisits,
    registrations: day.registrations,
    assessments: day.assessmentsCompleted,
    connections: day.universityConnections,
  }));

  // If no summaries, calculate from events (fallback for development)
  if (trendData.length === 0) {
    // Get page views grouped by day
    const pageViews = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: { gte: thirtyDaysAgo },
        eventName: 'page_view',
      },
      select: {
        timestamp: true,
      },
    });

    // Group by date
    const dateMap = new Map<string, number>();
    pageViews.forEach((event) => {
      const dateKey = format(new Date(event.timestamp), 'MMM dd');
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    });

    trendData = Array.from(dateMap.entries())
      .map(([date, visits]) => ({
        date,
        visits,
        registrations: 0,
        assessments: 0,
        connections: 0,
      }))
      .slice(-30);
  }

  // Get live stats
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeSessions = await prisma.activeSession.count({
    where: { lastActiveAt: { gte: fiveMinutesAgo } },
  });

  // Get funnel for last 30 days
  const funnelEvents = await prisma.analyticsEvent.groupBy({
    by: ['eventName'],
    where: {
      timestamp: { gte: thirtyDaysAgo },
      eventName: {
        in: [
          'page_view',
          'registration_completed',
          'profile_completed',
          'assessment_started',
          'assessment_completed',
          'results_viewed',
          'university_match_clicked',
          'university_connected',
        ],
      },
    },
    _count: true,
  });

  const funnel: Record<string, number> = {};
  funnelEvents.forEach((event) => {
    funnel[event.eventName] = event._count;
  });

  // Get feedback stats
  const feedbackStats = await prisma.reportFeedback.aggregate({
    _avg: {
      overallRating: true,
      npsScore: true,
    },
    _count: true,
  });

  // Get top countries
  const topCountries = await prisma.analyticsEvent.groupBy({
    by: ['country'],
    where: {
      timestamp: { gte: thirtyDaysAgo },
      country: { not: null },
    },
    _count: true,
    orderBy: { _count: { country: 'desc' } },
    take: 10,
  });

  // Get device breakdown
  const deviceBreakdown = await prisma.analyticsEvent.groupBy({
    by: ['deviceType'],
    where: {
      timestamp: { gte: thirtyDaysAgo },
      deviceType: { not: null },
    },
    _count: true,
  });

  return (
    <AnalyticsDashboard
      liveUsers={activeSessions}
      trendData={trendData}
      funnel={{
        visits: funnel['page_view'] || 0,
        registrations: funnel['registration_completed'] || 0,
        profilesCompleted: funnel['profile_completed'] || 0,
        assessmentsStarted: funnel['assessment_started'] || 0,
        assessmentsCompleted: funnel['assessment_completed'] || 0,
        resultsViewed: funnel['results_viewed'] || 0,
        universityClicks: funnel['university_match_clicked'] || 0,
        universityConnections: funnel['university_connected'] || 0,
      }}
      feedback={{
        count: feedbackStats._count,
        avgRating: feedbackStats._avg.overallRating || 0,
        npsScore: feedbackStats._avg.npsScore || 0,
      }}
      topCountries={topCountries.map((c) => ({
        country: c.country || 'Unknown',
        count: c._count,
      }))}
      deviceBreakdown={deviceBreakdown.map((d) => ({
        device: d.deviceType || 'unknown',
        count: d._count,
      }))}
    />
  );
}
