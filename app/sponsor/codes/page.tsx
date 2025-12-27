'use client'

import { useEffect, useState } from 'react'
import { Gift, Copy, CheckCircle, Share2 } from 'lucide-react'

export default function SponsorCodesPage() {
  const [sponsor, setSponsor] = useState<{ code: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/sponsor/dashboard')
      .then(res => res.json())
      .then(data => {
        setSponsor(data.sponsor)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const copyCode = () => {
    if (sponsor?.code) {
      navigator.clipboard.writeText(sponsor.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyLink = () => {
    const link = `${window.location.origin}/signup?sponsorCode=${sponsor?.code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sponsor Codes</h1>
        <p className="text-gray-600 mt-1">
          Share your code to sponsor students
        </p>
      </div>

      {/* Main Code Card */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-pink-100 mb-2">Your Sponsor Code</h2>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-mono font-bold tracking-widest">
                {sponsor?.code || 'SPXXXX'}
              </span>
              <button
                onClick={copyCode}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <Gift className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* How to Share */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Direct Code */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Share Code Directly</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Students can enter this code during registration to be sponsored by your organization.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <code className="text-lg font-mono font-bold text-pink-600">{sponsor?.code}</code>
            <button
              onClick={copyCode}
              className="text-pink-500 hover:text-pink-600 text-sm font-medium"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Registration Link</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Share this link directly - the sponsor code will be pre-filled for students.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <code className="text-sm text-gray-600 break-all block mb-2">
              {typeof window !== 'undefined' ? `${window.location.origin}/signup?sponsorCode=${sponsor?.code}` : ''}
            </code>
            <button
              onClick={copyLink}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">How Students Join</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Visit Sign Up</h4>
            <p className="text-sm text-gray-500">Student goes to the registration page</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Enter Code</h4>
            <p className="text-sm text-gray-500">Selects &quot;Student with Sponsor Code&quot; option</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-pink-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Start Assessment</h4>
            <p className="text-sm text-gray-500">They&apos;re automatically linked to your organization</p>
          </div>
        </div>
      </div>
    </div>
  )
}
