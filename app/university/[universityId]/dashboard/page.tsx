import StatsCard from '@/components/university/StatsCard';
import LeadTable from '@/components/university/LeadTable';
import MatchFunnel from '@/components/university/MatchFunnel';
import { Eye, MousePointer, UserCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface DashboardProps {
  params: Promise<{ universityId: string }>;
}

// Mock data - replace with actual DB queries when models exist
async function getDashboardData(universityId: string) {
  // Mock stats
  const stats = {
    impressions: 12450,
    clicks: 1867,
    leads: 234,
    enrolled: 18,
  };

  // Mock recent leads
  const recentLeads = [
    {
      id: 'lead-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      matchScore: 94,
      status: 'NEW',
      student: {
        name: 'Priya Sharma',
        country: 'India',
        email: 'priya.s@email.com',
      },
    },
    {
      id: 'lead-2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      matchScore: 91,
      status: 'CONTACTED',
      student: {
        name: 'Wei Chen',
        country: 'China',
        email: 'wei.chen@email.com',
      },
    },
    {
      id: 'lead-3',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      matchScore: 88,
      status: 'APPLIED',
      student: {
        name: 'Nguyen Van Minh',
        country: 'Vietnam',
        email: 'minh.n@email.com',
      },
    },
    {
      id: 'lead-4',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      matchScore: 92,
      status: 'ENROLLED',
      student: {
        name: 'Ananya Patel',
        country: 'India',
        email: 'ananya.p@email.com',
      },
    },
    {
      id: 'lead-5',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      matchScore: 86,
      status: 'NEW',
      student: {
        name: 'Muhammad Rahman',
        country: 'Bangladesh',
        email: 'm.rahman@email.com',
      },
    },
  ];

  return { stats, recentLeads };
}

export default async function UniversityDashboard({ params }: DashboardProps) {
  const { universityId } = await params;
  const { stats, recentLeads } = await getDashboardData(universityId);

  const { impressions, clicks, leads, enrolled } = stats;

  const clickRate =
    impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0';
  const conversionRate =
    clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s how your recruitment is performing.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Impressions"
          value={impressions.toLocaleString()}
          subtitle="Students saw your university"
          icon={<Eye className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Clicks"
          value={clicks.toLocaleString()}
          subtitle={`${clickRate}% click rate`}
          icon={<MousePointer className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Qualified Leads"
          value={leads.toLocaleString()}
          subtitle={`${conversionRate}% conversion`}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Enrolled"
          value={enrolled.toLocaleString()}
          subtitle="Confirmed students"
          icon={<GraduationCap className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Funnel & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Funnel
          </h2>
          <MatchFunnel
            impressions={impressions}
            clicks={clicks}
            leads={leads}
            enrolled={enrolled}
          />
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Leads
            </h2>
            <Link
              href={`/university/${universityId}/leads`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <LeadTable leads={recentLeads} compact />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <p className="opacity-90 mb-4">Optimize your student recruitment</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/university/${universityId}/criteria`}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🎯 Update Ideal Student Profile
          </Link>
          <Link
            href={`/university/${universityId}/programs`}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            📚 Add New Program
          </Link>
          <Link
            href={`/university/${universityId}/analytics`}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            📊 View Full Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
