'use client'

import { useEffect, useState } from 'react'
import { Users, Gift, CheckCircle, TrendingUp, Clock, AlertCircle, XCircle } from 'lucide-react'

interface DashboardData {
  sponsor: {
    id: string
    name: string
    code: string
    type: string
    status: string
    verifiedAt: string | null
  }
  stats: {
    sponsoredSeats: number
    usedSeats: number
    completedAssessments: number
    reportsGenerated: number
  }
  students: Array<{
    id: string
    userId: string
    name: string | null
    email: string | null
    enrolledAt: string
  }>
}

export default function SponsorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sponsor/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const stats = data?.stats || {
    sponsoredSeats: 100,
    usedSeats: 0,
    completedAssessments: 0,
    reportsGenerated: 0
  }

  const sponsorStatus = data?.sponsor?.status || 'pending'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sponsor Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your impact and manage sponsored students
        </p>
      </div>

      {/* Verification Status Banner */}
      {sponsorStatus === 'pending' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800">Verification Pending</h3>
            <p className="text-amber-700 text-sm mt-1">
              Your organization is pending verification. This usually takes 24-48 hours.
              Students cannot use your sponsor code until verification is complete.
            </p>
          </div>
        </div>
      )}

      {sponsorStatus === 'suspended' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Account Suspended</h3>
            <p className="text-red-700 text-sm mt-1">
              Your organization has been suspended. Please contact support for more information.
            </p>
          </div>
        </div>
      )}

      {sponsorStatus === 'verified' && data?.sponsor?.verifiedAt && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-800">Verified Organization</h3>
            <p className="text-green-700 text-sm mt-1">
              Your organization was verified on {new Date(data.sponsor.verifiedAt).toLocaleDateString()}.
              Students can now use your sponsor code.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sponsored Students</p>
              <p className="text-3xl font-bold mt-1">
                {stats.usedSeats}
                <span className="text-sm font-normal text-gray-400">/{stats.sponsoredSeats}</span>
              </p>
            </div>
            <div className="bg-pink-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Seats</p>
              <p className="text-3xl font-bold mt-1">{stats.sponsoredSeats - stats.usedSeats}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assessments Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completedAssessments}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reports Generated</p>
              <p className="text-3xl font-bold mt-1">{stats.reportsGenerated}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Code Card */}
      <div className={`rounded-xl shadow-sm p-6 text-white mb-8 ${
        sponsorStatus === 'verified'
          ? 'bg-gradient-to-r from-pink-500 to-rose-500'
          : 'bg-gradient-to-r from-gray-400 to-gray-500'
      }`}>
        <h2 className="text-lg font-semibold mb-2">Your Sponsor Code</h2>
        <p className={`text-sm mb-4 ${sponsorStatus === 'verified' ? 'text-pink-100' : 'text-gray-200'}`}>
          {sponsorStatus === 'verified'
            ? 'Share this code with students to sponsor their assessments'
            : 'This code will be active after your organization is verified'}
        </p>
        <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-3 inline-flex items-center gap-3">
          <span className={`text-2xl font-mono font-bold tracking-wider ${sponsorStatus !== 'verified' ? 'opacity-50' : ''}`}>
            {data?.sponsor?.code || 'SPXXXX'}
          </span>
          <button
            onClick={() => {
              if (data?.sponsor?.code) {
                navigator.clipboard.writeText(data.sponsor.code)
              }
            }}
            disabled={sponsorStatus !== 'verified'}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              sponsorStatus === 'verified'
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-white/10 cursor-not-allowed'
            }`}
          >
            Copy
          </button>
        </div>
        {sponsorStatus === 'pending' && (
          <p className="text-xs text-gray-200 mt-3">
            Students cannot register with this code until verification is complete
          </p>
        )}
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sponsored Students</h2>
        {data?.students && data.students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student) => (
                  <tr key={student.id} className="border-b last:border-0">
                    <td className="py-3">{student.name || 'N/A'}</td>
                    <td className="py-3 text-gray-600">{student.email || 'N/A'}</td>
                    <td className="py-3 text-gray-500 text-sm">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No sponsored students yet</p>
            <p className="text-sm mt-1">Share your sponsor code to start sponsoring students</p>
          </div>
        )}
      </div>
    </div>
  )
}
