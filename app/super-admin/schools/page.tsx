'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Users,
  FileText,
  Eye
} from 'lucide-react'

interface School {
  id: string
  name: string
  code: string
  status: 'pending' | 'verified' | 'suspended'
  country: string | null
  contactEmail: string
  adminName: string | null
  adminDesignation: string | null
  adminLinkedIn: string | null
  schoolWebsite: string | null
  studentCount: number
  assessmentCount: number
  createdAt: string
}

function SchoolsContent() {
  const searchParams = useSearchParams()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('status') || 'all'
  )

  useEffect(() => {
    fetchSchools()
  }, [statusFilter])

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/super-admin/schools?${params}`)
      const data = await res.json()
      setSchools(data.schools || [])
    } catch (error) {
      console.error('Failed to fetch schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.code.toLowerCase().includes(search.toLowerCase()) ||
    school.contactEmail.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = schools.filter(s => s.status === 'pending').length
  const verifiedCount = schools.filter(s => s.status === 'verified').length
  const suspendedCount = schools.filter(s => s.status === 'suspended').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Suspended
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-gray-600 mt-1">
            Verify and manage school accounts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl text-left transition-colors ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${statusFilter === 'all' ? 'text-slate-300' : 'text-gray-500'}`}>
            All Schools
          </p>
          <p className="text-2xl font-bold mt-1">{schools.length}</p>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl text-left transition-colors ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white'
              : 'bg-white hover:bg-amber-50'
          }`}
        >
          <p className={`text-sm ${statusFilter === 'pending' ? 'text-amber-100' : 'text-gray-500'}`}>
            Pending
          </p>
          <p className="text-2xl font-bold mt-1">{pendingCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter('verified')}
          className={`p-4 rounded-xl text-left transition-colors ${
            statusFilter === 'verified'
              ? 'bg-green-500 text-white'
              : 'bg-white hover:bg-green-50'
          }`}
        >
          <p className={`text-sm ${statusFilter === 'verified' ? 'text-green-100' : 'text-gray-500'}`}>
            Verified
          </p>
          <p className="text-2xl font-bold mt-1">{verifiedCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter('suspended')}
          className={`p-4 rounded-xl text-left transition-colors ${
            statusFilter === 'suspended'
              ? 'bg-red-500 text-white'
              : 'bg-white hover:bg-red-50'
          }`}
        >
          <p className={`text-sm ${statusFilter === 'suspended' ? 'text-red-100' : 'text-gray-500'}`}>
            Suspended
          </p>
          <p className="text-2xl font-bold mt-1">{suspendedCount}</p>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, code, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Schools List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Schools Found</h3>
          <p className="text-gray-500">
            {search ? 'Try a different search term' : 'No schools match the selected filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                school.status === 'pending' ? 'border-amber-500' :
                school.status === 'verified' ? 'border-green-500' :
                'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                    {getStatusBadge(school.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Code</p>
                      <p className="font-mono font-medium">{school.code}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Admin</p>
                      <p className="font-medium">{school.adminName || 'N/A'}</p>
                      {school.adminDesignation && (
                        <p className="text-xs text-gray-400">{school.adminDesignation}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium truncate">{school.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Country</p>
                      <p className="font-medium">{school.country || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      {school.studentCount} students
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <FileText className="w-4 h-4" />
                      {school.assessmentCount} assessments
                    </div>
                    {school.schoolWebsite && (
                      <a
                        href={school.schoolWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {school.adminLinkedIn && (
                      <a
                        href={school.adminLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                <Link
                  href={`/super-admin/schools/${school.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SchoolsManagementPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    }>
      <SchoolsContent />
    </Suspense>
  )
}
