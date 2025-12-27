'use client'

import Link from 'next/link'
import {
  User,
  Target,
  BookOpen,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react'

export default function ProfileRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Let&apos;s Build Your Profile First!
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Before you begin the assessment, we need to know a little about you.
            This helps us personalize your career guidance and university recommendations.
          </p>
        </div>

        {/* Why We Need This */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Why Your Profile Matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Personalized Recommendations</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your academic background helps us suggest careers and universities that match your profile
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg shrink-0">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Academic Context</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Understanding your grades and subjects helps calibrate your opportunities accurately
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg shrink-0">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Global Opportunities</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your country preferences help us identify relevant scholarships and programs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg shrink-0">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Better AI Analysis</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Combined with your assessment, your profile enables powerful AI-driven insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Fill */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            What You&apos;ll Fill (5-10 minutes)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Basic Info</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Academic Data</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Test Scores</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Preferences</span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <Lock className="w-4 h-4" />
            <p>
              Your information is kept strictly confidential and is only used to personalize your experience.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/profile"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Build My Profile
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-gray-400 text-sm mt-4">
            Takes only 5-10 minutes to complete
          </p>
        </div>
      </div>
    </div>
  )
}
