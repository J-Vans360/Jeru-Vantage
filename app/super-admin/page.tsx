'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Building2,
  Heart,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalSchools: number
  pendingSchools: number
  verifiedSchools: number
  totalSponsors: number
  pendingSponsors: number
  totalAssessments: number
  completedAssessments: number
  totalReports: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/super-admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform overview and management</p>
      </div>

      {/* Action Required */}
      {(stats?.pendingSchools || stats?.pendingSponsors) ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
            <AlertTriangle className="w-5 h-5" />
            Action Required
          </div>
          <div className="space-y-2">
            {stats?.pendingSchools > 0 && (
              <Link
                href="/super-admin/schools?status=pending"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors"
              >
                <span className="text-gray-700">
                  {stats.pendingSchools} school(s) pending verification
                </span>
                <span className="text-amber-600 font-medium">Review →</span>
              </Link>
            )}
            {stats?.pendingSponsors > 0 && (
              <Link
                href="/super-admin/sponsors?status=pending"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors"
              >
                <span className="text-gray-700">
                  {stats.pendingSponsors} sponsor(s) pending verification
                </span>
                <span className="text-amber-600 font-medium">Review →</span>
              </Link>
            )}
          </div>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Schools</p>
              <p className="text-3xl font-bold mt-1">
                {stats?.verifiedSchools || 0}
                {stats?.pendingSchools ? (
                  <span className="text-sm font-normal text-amber-500 ml-2">
                    +{stats.pendingSchools} pending
                  </span>
                ) : null}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sponsors</p>
              <p className="text-3xl font-bold mt-1">{stats?.totalSponsors || 0}</p>
            </div>
            <div className="bg-pink-500 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reports Generated</p>
              <p className="text-3xl font-bold mt-1">{stats?.totalReports || 0}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Started</span>
                <span className="font-medium">{stats?.totalAssessments || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium">{stats?.completedAssessments || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: stats?.totalAssessments
                      ? `${(stats.completedAssessments / stats.totalAssessments) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/super-admin/schools?status=pending"
              className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">Verify Schools</span>
            </Link>
            <Link
              href="/super-admin/promo-codes"
              className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Promo Codes</span>
            </Link>
            <Link
              href="/super-admin/analytics"
              className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>
            <Link
              href="/super-admin/settings"
              className="flex items-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
