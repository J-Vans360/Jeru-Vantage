'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Search, Users, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Sponsor {
  id: string
  name: string
  code: string
  type: string
  status: string
  contactName: string
  contactEmail: string
  contactPhone: string | null
  country: string | null
  website: string | null
  contactDesignation: string | null
  contactLinkedIn: string | null
  registrationNumber: string | null
  address: string | null
  purpose: string | null
  beneficiaries: string | null
  estimatedStudents: string | null
  sponsoredSeats: number
  usedSeats: number
  createdAt: string
  verifiedAt: string | null
}

type StatusFilter = 'all' | 'pending' | 'verified' | 'suspended'

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    fetch('/api/super-admin/sponsors')
      .then(res => res.json())
      .then(data => {
        setSponsors(data.sponsors || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Count sponsors by status
  const pendingCount = sponsors.filter(s => s.status === 'pending').length
  const verifiedCount = sponsors.filter(s => s.status === 'verified').length
  const suspendedCount = sponsors.filter(s => s.status === 'suspended').length

  const filteredSponsors = sponsors
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    )
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    // Sort pending first, then by creation date
    .sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1
      if (a.status !== 'pending' && b.status === 'pending') return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Suspended
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsors Management</h1>
          <p className="text-gray-600 mt-1">Manage NGOs and sponsor organizations</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{pendingCount} pending verification</span>
          </div>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({sponsors.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white'
              : 'bg-white text-amber-600 hover:bg-amber-50'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('verified')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'verified'
              ? 'bg-green-500 text-white'
              : 'bg-white text-green-600 hover:bg-green-50'
          }`}
        >
          Verified ({verifiedCount})
        </button>
        <button
          onClick={() => setStatusFilter('suspended')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'suspended'
              ? 'bg-red-500 text-white'
              : 'bg-white text-red-600 hover:bg-red-50'
          }`}
        >
          Suspended ({suspendedCount})
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sponsors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Sponsors List */}
      {filteredSponsors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sponsors Yet</h3>
          <p className="text-gray-500">Sponsors will appear here when they register.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSponsors.map((sponsor) => (
            <div key={sponsor.id} className={`bg-white rounded-xl shadow-sm p-6 ${
              sponsor.status === 'pending' ? 'border-l-4 border-amber-500' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{sponsor.name}</h3>
                    {getStatusBadge(sponsor.status)}
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                      {sponsor.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Code</p>
                      <p className={`font-mono font-medium ${sponsor.status !== 'verified' ? 'text-gray-400' : ''}`}>
                        {sponsor.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{sponsor.contactName}</p>
                      {sponsor.contactEmail && (
                        <p className="text-xs text-gray-400">{sponsor.contactEmail}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Seats</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <p className="font-medium">{sponsor.usedSeats} / {sponsor.sponsoredSeats}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">{new Date(sponsor.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/super-admin/sponsors/${sponsor.id}`}
                  className={`px-4 py-2 rounded-lg ${
                    sponsor.status === 'pending'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sponsor.status === 'pending' ? 'Review' : 'View Details'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
