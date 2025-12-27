import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import AnalyticsDashboard from '@/components/university/AnalyticsDashboard';

interface AnalyticsPageProps {
  params: Promise<{ universityId: string }>;
  searchParams: Promise<{ period?: string }>;
}

// Mock data for development - replace with actual DB queries when models exist
async function getAnalyticsData(universityId: string, daysBack: number) {
  const startDate = startOfDay(subDays(new Date(), daysBack));

  // Generate mock trend data
  const trendData = [];
  for (let i = daysBack; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    trendData.push({
      date,
      impressions: Math.floor(Math.random() * 100) + 50,
      clicks: Math.floor(Math.random() * 30) + 10,
      leads: Math.floor(Math.random() * 10) + 2,
    });
  }

  // Mock geographic data
  const geoData = [
    { country: 'India', count: 87 },
    { country: 'China', count: 54 },
    { country: 'Vietnam', count: 32 },
    { country: 'Indonesia', count: 28 },
    { country: 'Malaysia', count: 19 },
    { country: 'Bangladesh', count: 15 },
    { country: 'Thailand', count: 12 },
    { country: 'Philippines', count: 9 },
  ];

  // Mock funnel data
  const funnelData = {
    impressions: 2450,
    clicks: 367,
    leads: 89,
    enrolled: 12,
  };

  // Mock score distribution
  const scoreDistribution = [
    { range: '85-89%', min: 85, max: 89, count: 34 },
    { range: '90-94%', min: 90, max: 94, count: 41 },
    { range: '95-100%', min: 95, max: 100, count: 14 },
  ];

  // Calculate rates
  const clickRate = funnelData.impressions > 0
    ? (funnelData.clicks / funnelData.impressions * 100)
    : 0;
  const conversionRate = funnelData.clicks > 0
    ? (funnelData.leads / funnelData.clicks * 100)
    : 0;
  const enrollmentRate = funnelData.leads > 0
    ? (funnelData.enrolled / funnelData.leads * 100)
    : 0;

  // Mock university info
  const university = {
    name: 'Demo University',
    partnerTier: 'GOLD',
    subscriptionType: 'CPL',
    cplRate: 25,
  };

  // Calculate spend for CPL model
  const totalSpend = university.subscriptionType === 'CPL'
    ? funnelData.leads * university.cplRate
    : 0;
  const costPerEnrollment = funnelData.enrolled > 0
    ? totalSpend / funnelData.enrolled
    : 0;

  return {
    universityName: university.name,
    summary: {
      impressions: funnelData.impressions,
      clicks: funnelData.clicks,
      leads: funnelData.leads,
      enrolled: funnelData.enrolled,
      clickRate,
      conversionRate,
      enrollmentRate,
      totalSpend,
      costPerEnrollment,
    },
    trendData,
    geoData,
    funnelData,
    scoreDistribution,
  };
}

export default async function AnalyticsPage({ params, searchParams }: AnalyticsPageProps) {
  const { universityId } = await params;
  const resolvedSearchParams = await searchParams;
  const period = resolvedSearchParams.period || '30';
  const daysBack = parseInt(period);

  const data = await getAnalyticsData(universityId, daysBack);

  // TODO: Replace mock data with actual Prisma queries when models exist:
  // const university = await prisma.university.findUnique({
  //   where: { id: universityId },
  //   select: { name: true, partnerTier: true, subscriptionType: true, cplRate: true },
  // });
  //
  // const dailyMatches = await prisma.studentMatch.groupBy({
  //   by: ['status'],
  //   where: { universityId, createdAt: { gte: startDate, lte: endDate } },
  //   _count: true,
  // });
  //
  // const matchesOverTime = await prisma.studentMatch.findMany({
  //   where: { universityId, createdAt: { gte: startDate, lte: endDate } },
  //   select: { createdAt: true, status: true, matchScore: true, displayedAt: true, clickedAt: true },
  //   orderBy: { createdAt: 'asc' },
  // });
  //
  // const leadsWithGeo = await prisma.studentLead.findMany({
  //   where: { universityId, createdAt: { gte: startDate, lte: endDate } },
  //   include: { student: { include: { profile: { select: { country: true } } } } },
  // });

  return (
    <AnalyticsDashboard
      universityName={data.universityName}
      period={daysBack}
      summary={data.summary}
      trendData={data.trendData}
      geoData={data.geoData}
      funnelData={data.funnelData}
      scoreDistribution={data.scoreDistribution}
    />
  );
}
