'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  UserCheck,
  GraduationCap,
  DollarSign,
  Globe,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  universityName: string;
  period: number;
  summary: {
    impressions: number;
    clicks: number;
    leads: number;
    enrolled: number;
    clickRate: number;
    conversionRate: number;
    enrollmentRate: number;
    totalSpend: number;
    costPerEnrollment: number;
  };
  trendData: Array<{ date: string; impressions: number; clicks: number; leads: number }>;
  geoData: Array<{ country: string; count: number }>;
  funnelData: { impressions: number; clicks: number; leads: number; enrolled: number };
  scoreDistribution: Array<{ range: string; count: number }>;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboard({
  universityName,
  period,
  summary,
  trendData,
  geoData,
  funnelData,
  scoreDistribution,
}: AnalyticsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePeriodChange = (days: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', days);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your recruitment performance</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {[
            { label: '7 Days', value: '7' },
            { label: '30 Days', value: '30' },
            { label: '90 Days', value: '90' },
            { label: 'All Time', value: '365' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period.toString() === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Impressions"
          value={summary.impressions.toLocaleString()}
          icon={<Eye className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Click Rate"
          value={`${summary.clickRate.toFixed(1)}%`}
          subtitle={`${summary.clicks.toLocaleString()} clicks`}
          icon={<MousePointer className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${summary.conversionRate.toFixed(1)}%`}
          subtitle={`${summary.leads.toLocaleString()} leads`}
          icon={<UserCheck className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Enrolled"
          value={summary.enrolled.toLocaleString()}
          subtitle={`${summary.enrollmentRate.toFixed(1)}% of leads`}
          icon={<GraduationCap className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Spend Metrics (if CPL) */}
      {summary.totalSpend > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Total Spend</span>
            </div>
            <div className="text-3xl font-bold">${summary.totalSpend.toLocaleString()}</div>
            <div className="text-sm opacity-80 mt-1">{summary.leads} leads x CPL rate</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Cost per Enrollment</span>
            </div>
            <div className="text-3xl font-bold">
              {summary.costPerEnrollment > 0
                ? `$${summary.costPerEnrollment.toLocaleString()}`
                : 'N/A'}
            </div>
            <div className="text-sm opacity-80 mt-1">
              Based on {summary.enrolled} enrollments
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Impressions"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  name="Clicks"
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { stage: 'Impressions', value: funnelData.impressions, fill: '#3b82f6' },
                  { stage: 'Clicks', value: funnelData.clicks, fill: '#8b5cf6' },
                  { stage: 'Leads', value: funnelData.leads, fill: '#10b981' },
                  { stage: 'Enrolled', value: funnelData.enrolled, fill: '#f59e0b' },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {[
                    { stage: 'Impressions', fill: '#3b82f6' },
                    { stage: 'Clicks', fill: '#8b5cf6' },
                    { stage: 'Leads', fill: '#10b981' },
                    { stage: 'Enrolled', fill: '#f59e0b' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            Leads by Country
          </h3>
          {geoData.length > 0 ? (
            <div className="space-y-3">
              {geoData.map((item, idx) => {
                const maxCount = geoData[0]?.count || 1;
                const percentage = (item.count / maxCount) * 100;

                return (
                  <div key={item.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.country}</span>
                      <span className="text-gray-500">{item.count} leads</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No geographic data available yet
            </div>
          )}
        </div>

        {/* Match Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Score Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''}: ${value ?? 0}`}
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Higher match scores typically lead to better conversion rates
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.clickRate < 5 && (
            <InsightCard
              type="warning"
              title="Low Click Rate"
              description="Your click rate is below average. Consider updating your university profile and program descriptions to be more compelling."
            />
          )}
          {summary.conversionRate > 20 && (
            <InsightCard
              type="success"
              title="Great Conversion Rate"
              description="Your conversion rate is excellent! Students who see your university are highly engaged."
            />
          )}
          {geoData.length > 0 && geoData[0] && (
            <InsightCard
              type="info"
              title={`Top Source: ${geoData[0].country}`}
              description={`${geoData[0].count} leads came from ${geoData[0].country}. Consider allocating more resources to this market.`}
            />
          )}
          {summary.impressions > 0 && summary.leads === 0 && (
            <InsightCard
              type="warning"
              title="No Conversions Yet"
              description="You have impressions but no leads. Review your matching criteria - it might be too restrictive."
            />
          )}
          {summary.enrollmentRate > 10 && (
            <InsightCard
              type="success"
              title="Strong Enrollment Rate"
              description={`${summary.enrollmentRate.toFixed(1)}% of your leads are enrolling. Your targeting is working well!`}
            />
          )}
          {summary.clickRate >= 5 && summary.clickRate < 15 && (
            <InsightCard
              type="info"
              title="Average Click Rate"
              description="Your click rate is on par with industry averages. Focus on improving your program descriptions for better engagement."
            />
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
  trend,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
  trend?: { value: number; positive: boolean };
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.positive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
        {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({
  type,
  title,
  description,
}: {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    warning: '!',
    info: 'i',
  };

  const iconStyles = {
    success: 'bg-green-200 text-green-700',
    warning: 'bg-amber-200 text-amber-700',
    info: 'bg-blue-200 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${iconStyles[type]}`}
        >
          {icons[type]}
        </span>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm opacity-80 mt-1">{description}</div>
        </div>
      </div>
    </div>
  );
}
