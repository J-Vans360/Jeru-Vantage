'use client'

import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Platform usage and performance metrics</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Detailed analytics and reporting will be available here. Track student
          registrations, assessment completions, revenue, and more.
        </p>
      </div>
    </div>
  )
}
