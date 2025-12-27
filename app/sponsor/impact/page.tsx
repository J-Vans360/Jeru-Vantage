'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Users, CheckCircle, FileText, TrendingUp, Award } from 'lucide-react'

interface ImpactData {
  stats: {
    totalSponsored: number
    completedAssessments: number
    reportsGenerated: number
    completionRate: number
  }
  topInterests: string[]
  topStrengths: string[]
}

export default function ImpactReportPage() {
  const [data, setData] = useState<ImpactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sponsor/impact')
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
    totalSponsored: 0,
    completedAssessments: 0,
    reportsGenerated: 0,
    completionRate: 0
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Impact Report</h1>
          <p className="text-gray-600 mt-1">
            See the difference you&apos;re making
          </p>
        </div>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Students Sponsored</p>
              <p className="text-2xl font-bold">{stats.totalSponsored}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Assessments Completed</p>
              <p className="text-2xl font-bold">{stats.completedAssessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reports Generated</p>
              <p className="text-2xl font-bold">{stats.reportsGenerated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Impact</h2>
        </div>
        <p className="text-pink-100 text-lg mb-6">
          Thanks to your sponsorship, {stats.totalSponsored} students have gained access to career guidance
          that will help shape their futures. {stats.completedAssessments} have already completed their
          assessments and are on their way to discovering their Ikigai.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{stats.totalSponsored}</p>
            <p className="text-sm text-pink-100">Lives Impacted</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{stats.reportsGenerated}</p>
            <p className="text-sm text-pink-100">Career Insights</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">&infin;</p>
            <p className="text-sm text-pink-100">Future Potential</p>
          </div>
        </div>
      </div>

      {/* Top Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Aggregate Insights</h3>
        {stats.totalSponsored === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Insights will appear once students complete assessments</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Top Career Interests</h4>
              <div className="space-y-2">
                {(data?.topInterests || ['Social', 'Investigative', 'Artistic']).map((interest: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-pink-500 h-3 rounded-full"
                        style={{ width: `${80 - i * 20}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-24">{interest}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Top Strengths</h4>
              <div className="space-y-2">
                {(data?.topStrengths || ['Creativity', 'Empathy', 'Problem Solving']).map((strength: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${85 - i * 15}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-24">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
