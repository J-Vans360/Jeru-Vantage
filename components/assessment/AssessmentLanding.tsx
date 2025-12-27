'use client'

import { useState } from 'react'
import { Sparkles, Clock, Brain, Target, CheckCircle, ArrowRight, Shield } from 'lucide-react'

interface AssessmentLandingProps {
  studentName: string
  onStart: () => void
  partName: string
  partTitle: string
  estimatedTime: string
  questionCount: number
  partDescription: string
}

export default function AssessmentLanding({
  studentName,
  onStart,
  partName,
  partTitle,
  estimatedTime,
  questionCount,
  partDescription
}: AssessmentLandingProps) {
  const [agreed, setAgreed] = useState(false)

  const tips = [
    {
      icon: Brain,
      title: 'Be Honest',
      description: 'Answer based on how you truly feel, not what you think is the "right" answer.'
    },
    {
      icon: Clock,
      title: 'Take Your Time',
      description: 'There are no time limits. Read each question carefully before responding.'
    },
    {
      icon: Target,
      title: 'Trust Your Instincts',
      description: 'Your first response is usually the most accurate. Don\'t overthink it.'
    },
    {
      icon: Sparkles,
      title: 'No Wrong Answers',
      description: 'This assessment is about discovering your unique strengths and preferences.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome, {studentName}!
            </h1>
            <p className="text-lg text-indigo-100 max-w-xl mx-auto">
              You&apos;re about to begin your journey of self-discovery
            </p>
          </div>

          {/* Assessment Info */}
          <div className="px-8 py-6 bg-indigo-50 border-b border-indigo-100">
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Section</p>
                  <p className="font-semibold text-gray-900">{partName}: {partTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="font-semibold text-gray-900">{estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Questions</p>
                  <p className="font-semibold text-gray-900">{questionCount} questions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-8 py-6">
            <p className="text-gray-600 text-center text-lg">
              {partDescription}
            </p>
          </div>

          {/* Tips Section */}
          <div className="px-8 py-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Tips for Best Results
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-8 py-6 border-t border-gray-100">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
                  <p className="text-sm text-amber-800">
                    This assessment is designed to help you understand your preferences, strengths, and interests.
                    It is not a diagnostic tool and should not be used for clinical purposes.
                    Results are meant to guide self-reflection and career exploration, not to label or limit you.
                    Your responses are confidential and will only be used to generate your personalized report.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement & Start */}
          <div className="px-8 py-8 bg-gradient-to-b from-white to-gray-50">
            <label className="flex items-start gap-3 cursor-pointer mb-6 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700">
                I understand that this is a self-discovery tool and I will answer honestly to get the most accurate insights about myself.
              </span>
            </label>

            <button
              onClick={onStart}
              disabled={!agreed}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                agreed
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {agreed ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                'Please agree to continue'
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-white/70 mt-6 text-sm">
          Your progress will be saved automatically. You can pause and resume at any time.
        </p>
      </div>
    </div>
  )
}
