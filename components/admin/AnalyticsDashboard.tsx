'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Eye,
  UserPlus,
  ClipboardCheck,
  Handshake,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Activity,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  liveUsers: number;
  trendData: Array<{
    date: string;
    visits: number;
    registrations: number;
    assessments: number;
    connections: number;
  }>;
  funnel: {
    visits: number;
    registrations: number;
    profilesCompleted: number;
    assessmentsStarted: number;
    assessmentsCompleted: number;
    resultsViewed: number;
    universityClicks: number;
    universityConnections: number;
  };
  feedback: {
    count: number;
    avgRating: number;
    npsScore: number;
  };
  topCountries: Array<{ country: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboard({
  liveUsers: initialLiveUsers,
  trendData,
  funnel,
  feedback,
  topCountries,
  deviceBreakdown,
}: AnalyticsDashboardProps) {
  const [liveUsers, setLiveUsers] = useState(initialLiveUsers);
  const [liveStats, setLiveStats] = useState<{
    liveNow: {
      total: number;
      browsing: number;
      assessment: number;
      results: number;
      matching: number;
    };
    today: Record<string, number>;
  } | null>(null);

  // Refresh live stats every 30 seconds
  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch('/api/analytics/live');
        const data = await res.json();
        setLiveUsers(data.liveNow.total);
        setLiveStats(data);
      } catch (error) {
        console.error('Failed to fetch live stats:', error);
      }
    };

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate conversion rates
  const conversionRates = {
    visitToRegister: funnel.visits > 0 ? ((funnel.registrations / funnel.visits) * 100).toFixed(1) : 0,
    registerToAssessment:
      funnel.registrations > 0
        ? ((funnel.assessmentsCompleted / funnel.registrations) * 100).toFixed(1)
        : 0,
    assessmentToConnection:
      funnel.assessmentsCompleted > 0
        ? ((funnel.universityConnections / funnel.assessmentsCompleted) * 100).toFixed(1)
        : 0,
  };

  // Calculate NPS category
  const npsCategory =
    feedback.npsScore >= 50
      ? 'Excellent'
      : feedback.npsScore >= 30
        ? 'Good'
        : feedback.npsScore >= 0
          ? 'Okay'
          : 'Needs Work';

  // Format device breakdown for pie chart
  const deviceData = deviceBreakdown.map((d, idx) => ({
    name: d.device.charAt(0).toUpperCase() + d.device.slice(1),
    value: d.count,
    color: COLORS[idx % COLORS.length],
  }));

  // Funnel data for bar chart
  const funnelData = [
    { name: 'Visits', value: funnel.visits },
    { name: 'Registrations', value: funnel.registrations },
    { name: 'Profiles', value: funnel.profilesCompleted },
    { name: 'Assessments Started', value: funnel.assessmentsStarted },
    { name: 'Assessments Done', value: funnel.assessmentsCompleted },
    { name: 'Results Viewed', value: funnel.resultsViewed },
    { name: 'Uni Clicks', value: funnel.universityClicks },
    { name: 'Connections', value: funnel.universityConnections },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Real-time platform metrics and insights</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Live Counter */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Live Right Now</span>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <div className="text-5xl font-bold">{liveUsers}</div>
            <div className="text-white/70 mt-1">active users</div>
          </div>
          {liveStats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{liveStats.liveNow.assessment || 0}</div>
                <div className="text-sm text-white/70">Taking Assessment</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{liveStats.liveNow.results || 0}</div>
                <div className="text-sm text-white/70">Viewing Results</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visits"
          value={funnel.visits.toLocaleString()}
          subtitle="Last 30 days"
          icon={<Eye className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Registrations"
          value={funnel.registrations.toLocaleString()}
          subtitle={`${conversionRates.visitToRegister}% of visits`}
          icon={<UserPlus className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Assessments Completed"
          value={funnel.assessmentsCompleted.toLocaleString()}
          subtitle={`${conversionRates.registerToAssessment}% of registrations`}
          icon={<ClipboardCheck className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="University Connections"
          value={funnel.universityConnections.toLocaleString()}
          subtitle={`${conversionRates.assessmentToConnection}% of assessments`}
          icon={<Handshake className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Feedback Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="text-2xl font-bold text-gray-900">
                {feedback.avgRating.toFixed(1)} / 5
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(feedback.avgRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">NPS Score</div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(feedback.npsScore)}</div>
            </div>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              feedback.npsScore >= 50
                ? 'bg-green-100 text-green-700'
                : feedback.npsScore >= 30
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {npsCategory}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Feedbacks</div>
              <div className="text-2xl font-bold text-gray-900">{feedback.count}</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">Responses collected</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visits" stroke="#3b82f6" name="Visits" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#8b5cf6"
                name="Registrations"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="assessments"
                stroke="#10b981"
                name="Assessments"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          {deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No device data available
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <Tablet className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Tablet</span>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Top Countries
          </h3>
          {topCountries.length > 0 ? (
            <div className="space-y-3">
              {topCountries.map((country, idx) => {
                const maxCount = topCountries[0]?.count || 1;
                const percentage = (country.count / maxCount) * 100;
                return (
                  <div key={country.country} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-6">{idx + 1}</span>
                    <span className="text-sm text-gray-900 w-24">{country.country}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {country.count.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No country data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{subtitle}</div>
    </div>
  );
}
