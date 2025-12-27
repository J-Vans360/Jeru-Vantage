'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, CheckCircle, Loader2, Clock } from 'lucide-react'

interface SchoolData {
  schoolName: string
  country: string
  phone: string
  designation: string
  linkedIn: string
  schoolWebsite: string
  schoolAddress: string
  schoolType: string
  affiliation: string
  studentStrength: string
}

function SetupAdminContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [schoolName, setSchoolName] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoCreating, setAutoCreating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; code?: string; pending?: boolean } | null>(null)
  const [hasAttemptedAutoCreate, setHasAttemptedAutoCreate] = useState(false)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)

  const handleAutoCreateSchool = useCallback(async (data: SchoolData) => {
    if (!session?.user?.email) return

    setAutoCreating(true)

    try {
      const res = await fetch('/api/schools/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.schoolName,
          contactEmail: session.user.email,
          contactPhone: data.phone,
          country: data.country,
          designation: data.designation,
          linkedIn: data.linkedIn,
          schoolWebsite: data.schoolWebsite,
          schoolAddress: data.schoolAddress,
          schoolType: data.schoolType,
          affiliation: data.affiliation,
          studentStrength: data.studentStrength
        })
      })

      const responseData = await res.json()

      if (res.ok) {
        setResult({
          success: true,
          message: responseData.message || `School "${responseData.school.name}" created successfully!`,
          code: responseData.school.code,
          pending: responseData.school.status === 'pending'
        })
      } else {
        setResult({
          success: false,
          message: responseData.error || 'Failed to create school'
        })
      }
    } catch {
      setResult({
        success: false,
        message: 'Failed to create school. Please try again.'
      })
    } finally {
      setAutoCreating(false)
    }
  }, [session?.user?.email])

  // Get school data from URL
  useEffect(() => {
    const schoolDataParam = searchParams.get('schoolData')
    const autoCreate = searchParams.get('autoCreate')

    if (schoolDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(schoolDataParam)) as SchoolData
        setSchoolData(parsedData)
        setSchoolName(parsedData.schoolName)

        // Auto-create school if flag is set and user is authenticated
        if (autoCreate === 'true' && status === 'authenticated' && session && !hasAttemptedAutoCreate) {
          setHasAttemptedAutoCreate(true)
          handleAutoCreateSchool(parsedData)
        }
      } catch {
        // Invalid JSON, fallback to simple flow
        console.error('Failed to parse school data')
      }
    }
  }, [searchParams, status, session, hasAttemptedAutoCreate, handleAutoCreateSchool])

  // Redirect to login if not authenticated (but only if not in auto-create flow)
  useEffect(() => {
    const autoCreate = searchParams.get('autoCreate')
    if (status === 'unauthenticated' && autoCreate !== 'true') {
      router.push('/login')
    }
  }, [status, router, searchParams])

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!schoolName.trim()) {
      setResult({ success: false, message: 'Please enter a school name' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/schools/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schoolName,
          contactEmail: session?.user?.email || 'admin@school.com',
          ...(schoolData || {})
        })
      })

      const data = await res.json()

      if (res.ok) {
        setResult({
          success: true,
          message: data.message || `School "${data.school.name}" created successfully!`,
          code: data.school.code,
          pending: data.school.status === 'pending'
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to create school'
        })
      }
    } catch {
      setResult({
        success: false,
        message: 'Failed to create school. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking session or auto-creating
  if (status === 'loading' || autoCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            {autoCreating ? 'Creating your school...' : 'Loading...'}
          </h2>
          {autoCreating && schoolName && (
            <p className="text-gray-600 mt-2">Setting up &quot;{schoolName}&quot;</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Setup School Admin</h1>
          <p className="text-gray-600 mt-2">Create a school and become its admin</p>
        </div>

        {/* Current User Info */}
        {session && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
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
            <p className="text-amber-800 font-medium mb-2">School Registered - Verification Pending</p>
            <p className="text-sm text-amber-700 mb-3">
              Your school has been registered and is pending verification.
              This usually takes 24-48 hours.
            </p>
            {result.code && (
              <div className="bg-white rounded-lg p-3 mt-3">
                <p className="text-sm text-gray-600">Your School Code (available after verification):</p>
                <p className="text-2xl font-mono font-bold text-gray-400">{result.code}</p>
                <p className="text-xs text-gray-500 mt-2">Students can use this code after your school is verified</p>
              </div>
            )}
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 w-full font-medium"
            >
              Go to Admin Dashboard
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
                <p className="text-sm text-gray-600">Your School Code:</p>
                <p className="text-2xl font-mono font-bold text-orange-600">{result.code}</p>
                <p className="text-xs text-gray-500 mt-2">Share this code with students to join your school</p>
              </div>
            )}
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 w-full font-medium"
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}

        {/* Error State */}
        {result && !result.success && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{result.message}</p>
          </div>
        )}

        {/* Form - Only show if not successful yet */}
        {!result?.success && (
          <form onSubmit={handleCreateSchool}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your school name"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating School...' : 'Create School & Make Me Admin'}
            </button>
          </form>
        )}

        {/* Links */}
        <div className="mt-6 pt-6 border-t text-center space-y-2">
          <a href="/admin" className="text-orange-500 hover:underline block text-sm">
            Go to Admin Dashboard
          </a>
          <a href="/" className="text-gray-500 hover:underline block text-sm">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SetupAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <SetupAdminContent />
    </Suspense>
  )
}
