'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Save,
  AlertTriangle,
  Heart,
  Building
} from 'lucide-react'

interface SponsorDetail {
  id: string
  name: string
  code: string
  type: string
  status: 'pending' | 'verified' | 'suspended'

  contactName: string
  contactEmail: string
  contactPhone: string | null
  contactDesignation: string | null
  contactLinkedIn: string | null

  website: string | null
  address: string | null
  country: string | null
  registrationNumber: string | null
  purpose: string | null
  beneficiaries: string | null
  estimatedStudents: string | null

  sponsoredSeats: number
  usedSeats: number

  studentCount: number
  assessmentCount: number
  reportCount: number

  createdAt: string
  verifiedAt: string | null

  adminNotes: Array<{
    id: string
    note: string
    createdBy: string
    createdAt: string
  }>
}

export default function SponsorDetailPage() {
  const params = useParams()
  const [sponsor, setSponsor] = useState<SponsorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [seats, setSeats] = useState(100)

  useEffect(() => {
    fetchSponsor()
  }, [params.id])

  const fetchSponsor = async () => {
    try {
      const res = await fetch(`/api/super-admin/sponsors/${params.id}`)
      const data = await res.json()
      setSponsor(data.sponsor)
      if (data.sponsor) {
        setSeats(data.sponsor.sponsoredSeats)
      }
    } catch (error) {
      console.error('Failed to fetch sponsor:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'verified' ? 'verify' : newStatus} this sponsor?`)) {
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/super-admin/sponsors/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        fetchSponsor()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveSeats = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/super-admin/sponsors/${params.id}/seats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsoredSeats: seats })
      })

      if (res.ok) {
        fetchSponsor()
      }
    } catch (error) {
      console.error('Failed to save seats:', error)
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const res = await fetch(`/api/super-admin/sponsors/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote })
      })

      if (res.ok) {
        setNewNote('')
        fetchSponsor()
      }
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!sponsor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Sponsor not found</h2>
        <Link href="/super-admin/sponsors" className="text-amber-500 hover:underline mt-2 inline-block">
          Back to Sponsors
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Verified
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending Verification
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Suspended
          </span>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    const typeLabels: Record<string, string> = {
      ngo: 'NGO / Non-Profit',
      foundation: 'Foundation',
      csr: 'Corporate CSR',
      government: 'Government Program',
      trust: 'Charitable Trust',
      religious: 'Religious Organization',
      international: 'International NGO',
      corporate: 'Corporate',
      community: 'Community Organization'
    }
    return typeLabels[type] || type
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/super-admin/sponsors"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{sponsor.name}</h1>
            {getStatusBadge(sponsor.status)}
            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
              {getTypeBadge(sponsor.type)}
            </span>
          </div>
          <p className="text-gray-500">Code: {sponsor.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">

          {/* Verification Actions */}
          {sponsor.status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Verification Required
              </h2>
              <p className="text-amber-700 mb-4">
                Review the organization details before approving. Check the website, registration number, and contact information.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus('verified')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve & Verify
                </button>
                <button
                  onClick={() => updateStatus('suspended')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Person</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{sponsor.contactName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{sponsor.contactDesignation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${sponsor.contactEmail}`} className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {sponsor.contactEmail}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                {sponsor.contactPhone ? (
                  <a href={`tel:${sponsor.contactPhone}`} className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {sponsor.contactPhone}
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">LinkedIn</p>
                {sponsor.contactLinkedIn ? (
                  <a href={sponsor.contactLinkedIn} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    View Profile
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Website</p>
                {sponsor.website ? (
                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {sponsor.website}
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{sponsor.country || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="font-medium flex items-center gap-1">
                  <Building className="w-4 h-4 text-gray-400" />
                  {sponsor.registrationNumber || 'Not provided'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {sponsor.address || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Program Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sponsorship Program</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="font-medium">{sponsor.purpose || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Students</p>
                <p className="font-medium">{sponsor.estimatedStudents || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Target Beneficiaries</p>
                <p className="font-medium">{sponsor.beneficiaries || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Seats & Limits */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sponsored Seats</h2>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Seat Usage</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: {sponsor.usedSeats}</span>
                    <span>Limit: {seats}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: `${Math.min((sponsor.usedSeats / seats) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Seats */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Edit Seat Limit</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(parseInt(e.target.value) || 0)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Quick:</span>
                  <button
                    onClick={() => setSeats(prev => prev + 50)}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200"
                  >
                    +50
                  </button>
                  <button
                    onClick={() => setSeats(prev => prev + 100)}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200"
                  >
                    +100
                  </button>
                </div>
                <button
                  onClick={saveSeats}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Notes */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Sponsored Students
                </span>
                <span className="font-semibold">{sponsor.studentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Assessments
                </span>
                <span className="font-semibold">{sponsor.assessmentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Available Seats
                </span>
                <span className="font-semibold">{sponsor.sponsoredSeats - sponsor.usedSeats}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="text-gray-900">Registered</p>
                  <p className="text-gray-500">{new Date(sponsor.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {sponsor.verifiedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-900">Verified</p>
                    <p className="text-gray-500">{new Date(sponsor.verifiedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h2>

            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                rows={3}
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
              >
                Add Note
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sponsor.adminNotes?.length === 0 ? (
                <p className="text-gray-400 text-sm">No notes yet</p>
              ) : (
                sponsor.adminNotes?.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-900">{note.note}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Danger Zone */}
          {sponsor.status !== 'suspended' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
              <button
                onClick={() => updateStatus('suspended')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full justify-center"
              >
                <XCircle className="w-4 h-4" />
                Suspend Sponsor
              </button>
            </div>
          )}

          {sponsor.status === 'suspended' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Reactivate</h2>
              <button
                onClick={() => updateStatus('verified')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full justify-center"
              >
                <CheckCircle className="w-4 h-4" />
                Reactivate Sponsor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
