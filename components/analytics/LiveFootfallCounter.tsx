'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, BookOpen, BarChart3, Handshake, Eye } from 'lucide-react';

interface LiveStats {
  liveNow: {
    total: number;
    browsing: number;
    assessment: number;
    results: number;
    matching: number;
  };
  today: {
    pageViews: number;
    registrations: number;
    assessmentsStarted: number;
    assessmentsCompleted: number;
    universityConnections: number;
    feedbackSubmitted: number;
  };
}

interface LiveFootfallCounterProps {
  variant?: 'compact' | 'detailed' | 'minimal';
  showTodayStats?: boolean;
  className?: string;
}

export default function LiveFootfallCounter({
  variant = 'compact',
  showTodayStats = false,
  className = '',
}: LiveFootfallCounterProps) {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics/live');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  // Minimal variant - just a number with indicator
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{stats.liveNow.total}</span> online
        </span>
      </div>
    );
  }

  // Compact variant - small card
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.liveNow.total}</div>
              <div className="text-sm text-white/70">users online</div>
            </div>
          </div>

          <div className="flex gap-3">
            {stats.liveNow.assessment > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold">{stats.liveNow.assessment}</div>
                <div className="text-xs text-white/70">assessing</div>
              </div>
            )}
            {stats.liveNow.results > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold">{stats.liveNow.results}</div>
                <div className="text-xs text-white/70">results</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant - full breakdown
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Activity className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <span className="font-medium">Live Activity</span>
        </div>
        <div className="text-4xl font-bold">{stats.liveNow.total}</div>
        <div className="text-white/70">users currently online</div>
      </div>

      {/* Activity Breakdown */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Current Activities</h4>
        <div className="grid grid-cols-2 gap-4">
          <ActivityItem
            icon={<Eye className="w-4 h-4" />}
            label="Browsing"
            count={stats.liveNow.browsing}
            color="blue"
          />
          <ActivityItem
            icon={<BookOpen className="w-4 h-4" />}
            label="Taking Assessment"
            count={stats.liveNow.assessment}
            color="purple"
          />
          <ActivityItem
            icon={<BarChart3 className="w-4 h-4" />}
            label="Viewing Results"
            count={stats.liveNow.results}
            color="green"
          />
          <ActivityItem
            icon={<Handshake className="w-4 h-4" />}
            label="Matching"
            count={stats.liveNow.matching}
            color="orange"
          />
        </div>
      </div>

      {/* Today's Stats */}
      {showTodayStats && (
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Today&apos;s Activity</h4>
          <div className="space-y-3">
            <StatRow label="Page Views" value={stats.today.pageViews} />
            <StatRow label="Registrations" value={stats.today.registrations} />
            <StatRow label="Assessments Started" value={stats.today.assessmentsStarted} />
            <StatRow label="Assessments Completed" value={stats.today.assessmentsCompleted} />
            <StatRow label="University Connections" value={stats.today.universityConnections} />
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityItem({
  icon,
  label,
  count,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div>
        <div className="text-lg font-semibold text-gray-900">{count}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-sm font-semibold text-gray-900"
        >
          {value.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Small inline badge for headers/navs
export function LiveUsersBadge({ className = '' }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/analytics/live');
        const data = await res.json();
        setCount(data.liveNow.total);
      } catch {
        // Silent fail
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      {count} live
    </div>
  );
}
