'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertTriangle, Users, FileText, Settings, Copy, Check } from 'lucide-react'

interface DashboardData {
  school: {
    id: string
    name: string
    code: string
    plan: string
    studentLimit: number
    status: 'pending' | 'verified' | 'suspended'
  }
  role: string
  stats: {
    totalStudents: number
    completedStudents: number
    reportsGenerated: number
    pendingStudents: number
    completionRate: number
  }
  recentActivity: {
    reports: Array<{
      id: string
      generationNumber: number
      createdAt: string
      user?: { name: string | null; email: string | null }
    }>
    assessments: Array<{
      id: string
      domainName: string
      updatedAt: string
      user?: { name: string | null; email: string | null }
    }>
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const copyCode = () => {
    if (data?.school.code) {
      navigator.clipboard.writeText(data.school.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-8 text-gray-500">Error loading dashboard</div>
  }

  const school = data.school

  return (
    <div>
      {/* Pending Verification Banner */}
      {school.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-800">Verification Pending</h2>
              <p className="text-amber-700 mt-1">
                Your school account is being reviewed by our team. This usually takes 24-48 hours.
              </p>
              <p className="text-amber-600 text-sm mt-2">
                While pending, you can explore the dashboard but cannot add students or access all features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suspended Banner */}
      {school.status === 'suspended' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-800">Account Suspended</h2>
              <p className="text-red-700 mt-1">
                Your school account has been suspended. Please contact support for assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
          {school.status === 'verified' && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 mt-1">Welcome back! Here is what is happening with your students.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold mt-1">
                {data.stats.totalStudents}
                <span className="text-sm font-normal text-gray-400 ml-1">/ {school.studentLimit} limit</span>
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Assessment</p>
              <p className="text-3xl font-bold mt-1">{data.stats.completedStudents}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reports Generated</p>
              <p className="text-3xl font-bold mt-1">{data.stats.reportsGenerated}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-2xl font-bold mt-1 capitalize">{school.plan}</p>
              <p className="text-xs text-gray-400">{school.studentLimit} assessments included</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Assessment Completion Rate</h2>
          <span className="text-2xl font-bold text-purple-500">{data.stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${data.stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Share Code Section - Only show if verified */}
      {school.status === 'verified' && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-lg font-semibold mb-2">Share Your Join Code</h2>
          <p className="text-purple-100 text-sm mb-4">
            Students can use this code to register and link to your school
          </p>
          <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 inline-flex items-center gap-4">
            <span className="text-3xl font-mono font-bold tracking-widest">{school.code}</span>
            <button
              onClick={copyCode}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Pending - Show what they're waiting for */}
      {school.status === 'pending' && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-600 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">We Review Your Information</p>
                <p className="text-sm text-gray-500">Our team verifies your school details and credentials</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gray-500 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Account Activated</p>
                <p className="text-sm text-gray-500">You will receive an email when your account is verified</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gray-500 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Start Adding Students</p>
                <p className="text-sm text-gray-500">Share your join code and begin assessments</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Jeru Reports</h2>
          {data.recentActivity.reports.length === 0 ? (
            <p className="text-gray-500 text-sm">No reports generated yet</p>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.reports.map((report) => (
                <li key={report.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.user?.name || 'Student'}</p>
                    <p className="text-gray-500 text-xs">
                      Report #{report.generationNumber} - {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {data.recentActivity.assessments.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activity</p>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.assessments.map((assessment) => (
                <li key={assessment.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{assessment.user?.name || 'Student'}</p>
                    <p className="text-gray-500 text-xs">
                      Completed {assessment.domainName} - {new Date(assessment.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
