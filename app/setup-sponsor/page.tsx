'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, CheckCircle, Loader2, Clock } from 'lucide-react'

interface SponsorData {
  contactName: string
  contactDesignation: string
  contactPhone: string
  contactLinkedIn: string
  orgName: string
  orgType: string
  country: string
  website: string
  registrationNumber: string
  address: string
  purpose: string
  beneficiaries: string
  estimatedStudents: string
}

function SetupSponsorContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [orgName, setOrgName] = useState('')
  const [orgType, setOrgType] = useState('ngo')
  const [loading, setLoading] = useState(false)
  const [autoCreating, setAutoCreating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; code?: string; pending?: boolean } | null>(null)
  const [hasAttemptedAutoCreate, setHasAttemptedAutoCreate] = useState(false)
  const [sponsorData, setSponsorData] = useState<SponsorData | null>(null)

  const handleAutoCreateSponsor = useCallback(async (data: SponsorData) => {
    if (!session?.user?.email) return

    setAutoCreating(true)

    try {
      const res = await fetch('/api/sponsors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.orgName,
          type: data.orgType,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          website: data.website,
          country: data.country,
          contactDesignation: data.contactDesignation,
          contactLinkedIn: data.contactLinkedIn,
          registrationNumber: data.registrationNumber,
          address: data.address,
          purpose: data.purpose,
          beneficiaries: data.beneficiaries,
          estimatedStudents: data.estimatedStudents
        })
      })

      const responseData = await res.json()

      if (res.ok) {
        setResult({
          success: true,
          message: responseData.message || `"${responseData.sponsor.name}" registered successfully!`,
          code: responseData.sponsor.code,
          pending: responseData.sponsor.status === 'pending'
        })
      } else {
        setResult({
          success: false,
          message: responseData.error || 'Failed to register organization'
        })
      }
    } catch {
      setResult({
        success: false,
        message: 'Failed to register organization. Please try again.'
      })
    } finally {
      setAutoCreating(false)
    }
  }, [session?.user?.email])

  // Get sponsor data from URL
  useEffect(() => {
    const sponsorDataParam = searchParams.get('sponsorData')
    const autoCreate = searchParams.get('autoCreate')

    if (sponsorDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(sponsorDataParam)) as SponsorData
        setSponsorData(parsedData)
        setOrgName(parsedData.orgName)
        setOrgType(parsedData.orgType || 'ngo')

        // Auto-create sponsor if flag is set and user is authenticated
        if (autoCreate === 'true' && status === 'authenticated' && session && !hasAttemptedAutoCreate) {
          setHasAttemptedAutoCreate(true)
          handleAutoCreateSponsor(parsedData)
        }
      } catch {
        // Invalid JSON, fallback to simple flow with legacy params
        const nameFromUrl = searchParams.get('orgName')
        const typeFromUrl = searchParams.get('orgType')
        if (nameFromUrl) setOrgName(decodeURIComponent(nameFromUrl))
        if (typeFromUrl) setOrgType(decodeURIComponent(typeFromUrl))
      }
    } else {
      // Legacy support for simple orgName/orgType params
      const nameFromUrl = searchParams.get('orgName')
      const typeFromUrl = searchParams.get('orgType')
      if (nameFromUrl) setOrgName(decodeURIComponent(nameFromUrl))
      if (typeFromUrl) setOrgType(decodeURIComponent(typeFromUrl))
    }
  }, [searchParams, status, session, hasAttemptedAutoCreate, handleAutoCreateSponsor])

  // Redirect to login if not authenticated
  useEffect(() => {
    const autoCreate = searchParams.get('autoCreate')
    if (status === 'unauthenticated' && autoCreate !== 'true') {
      router.push('/login?callbackUrl=/setup-sponsor')
    }
  }, [status, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orgName.trim()) {
      setResult({ success: false, message: 'Please enter organization name' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/sponsors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          type: orgType,
          // Include sponsorData fields if available from signup flow
          ...(sponsorData || {})
        })
      })

      const data = await res.json()

      if (res.ok) {
        setResult({
          success: true,
          message: data.message || `"${data.sponsor.name}" registered successfully!`,
          code: data.sponsor.code,
          pending: data.sponsor.status === 'pending'
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to register organization'
        })
      }
    } catch {
      setResult({
        success: false,
        message: 'Failed to register. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (status === 'loading' || autoCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            {autoCreating ? 'Setting up your organization...' : 'Loading...'}
          </h2>
          {autoCreating && orgName && (
            <p className="text-gray-600 mt-2">Creating &quot;{orgName}&quot;</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Sponsor Account</h1>
          <p className="text-gray-600 mt-2">Register your organization to sponsor students</p>
        </div>

        {/* User Info */}
        {session && (
          <div className="mb-6 p-4 bg-pink-50 rounded-lg">
            <p className="text-sm text-pink-800">
              <strong>Logged in as:</strong><br />
              {session.user?.name}<br />
              {session.user?.email}
            </p>
          </div>
        )}

        {/* Success State with Pending Verification */}
        {result?.success && result?.pending && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg text-center">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <p className="text-amber-800 font-medium mb-2">Organization Registered - Verification Pending</p>
            <p className="text-sm text-amber-700 mb-3">
              Your organization has been registered and is pending verification.
              This usually takes 24-48 hours.
            </p>
            {result.code && (
              <div className="bg-white rounded-lg p-3 mt-3">
                <p className="text-sm text-gray-600">Your Sponsor Code (available after verification):</p>
                <p className="text-2xl font-mono font-bold text-gray-400">{result.code}</p>
                <p className="text-xs text-gray-500 mt-2">Students can use this code after your organization is verified</p>
              </div>
            )}
            <button
              onClick={() => router.push('/sponsor')}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 w-full font-medium"
            >
              Go to Sponsor Dashboard
            </button>
          </div>
        )}

        {/* Success State - Verified (legacy) */}
        {result?.success && !result?.pending && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-800 font-medium mb-2">{result.message}</p>
            {result.code && (
              <div className="bg-white rounded-lg p-3 mt-3">
                <p className="text-sm text-gray-600">Your Sponsor Code:</p>
                <p className="text-2xl font-mono font-bold text-pink-600">{result.code}</p>
                <p className="text-xs text-gray-500 mt-2">Share this code with students to sponsor them</p>
              </div>
            )}
            <button
              onClick={() => router.push('/sponsor')}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 w-full font-medium"
            >
              Go to Sponsor Dashboard
            </button>
          </div>
        )}

        {/* Error State */}
        {result && !result.success && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{result.message}</p>
          </div>
        )}

        {/* Form */}
        {!result?.success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="UNICEF, Rotary Club, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type
              </label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="ngo">NGO / Non-Profit</option>
                <option value="foundation">Foundation</option>
                <option value="corporate">Corporate CSR</option>
                <option value="government">Government Agency</option>
                <option value="community">Community Organization</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Sponsor Account'}
            </button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 pt-6 border-t text-center space-y-2">
          <a href="/sponsor" className="text-pink-500 hover:underline block text-sm">
            Go to Sponsor Dashboard
          </a>
          <a href="/" className="text-gray-500 hover:underline block text-sm">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SetupSponsorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <SetupSponsorContent />
    </Suspense>
  )
}
