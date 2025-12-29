'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Users,
  ClipboardList,
  Copy,
  Check,
  LogOut,
  RefreshCw,
  GraduationCap,
  BarChart3,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  email: string
  registeredAt: string
  assessmentStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  assessmentCompletedAt?: string
}

interface CounselorData {
  code: string
  name: string
  totalStudents: number
  completedAssessments: number
  students: Student[]
}

export default function CounselorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<CounselorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchCounselorData()
    }
  }, [status, router])

  const fetchCounselorData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/counselor/dashboard')
      if (!res.ok) {
        if (res.status === 403) {
          setError('You do not have counselor access')
          return
        }
        throw new Error('Failed to fetch data')
      }
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching counselor data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (data?.code) {
      navigator.clipboard.writeText(data.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-indigo-600 hover:underline"
          >
            Sign out and try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Jeru Vantage</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Counselor Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session?.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {data?.name || session?.user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your students and track their assessment progress
          </p>
        </div>

        {/* Join Code Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-90">Your Join Code</h2>
              <p className="text-sm opacity-75 mt-1">
                Share this code with your students to link them to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <span className="text-2xl font-mono font-bold tracking-wider">
                  {data?.code || '---'}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{data?.totalStudents || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{data?.completedAssessments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.totalStudents ? Math.round((data.completedAssessments / data.totalStudents) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Students</h2>
            <button
              onClick={fetchCounselorData}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {data?.students && data.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(student.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.assessmentStatus === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : student.assessmentStatus === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {student.assessmentStatus === 'COMPLETED' && <Check className="w-3 h-3" />}
                          {student.assessmentStatus === 'IN_PROGRESS' && <Clock className="w-3 h-3" />}
                          {student.assessmentStatus === 'COMPLETED'
                            ? 'Completed'
                            : student.assessmentStatus === 'IN_PROGRESS'
                            ? 'In Progress'
                            : 'Not Started'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.assessmentCompletedAt
                          ? new Date(student.assessmentCompletedAt).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
              <p className="text-gray-500 mb-4">
                Share your join code with students to get started
              </p>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Join Code
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
