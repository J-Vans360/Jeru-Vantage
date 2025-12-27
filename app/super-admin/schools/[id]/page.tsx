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
  CreditCard,
  Save,
  AlertTriangle
} from 'lucide-react'

interface SchoolDetail {
  id: string
  name: string
  code: string
  status: 'pending' | 'verified' | 'suspended'
  contactEmail: string
  country: string | null

  adminName: string | null
  adminDesignation: string | null
  adminLinkedIn: string | null
  adminPhone: string | null
  staffIdCard: string | null

  schoolWebsite: string | null
  schoolAddress: string | null
  schoolType: string | null
  affiliation: string | null
  studentStrength: number | null

  assessmentLimit: number
  reportLimit: number
  usedAssessments: number
  usedReports: number

  override: {
    customAssessmentLimit: number | null
    customReportLimit: number | null
    customMonthlyPrice: number | null
    discountPercent: number | null
    discountReason: string | null
    notes: string | null
  } | null

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

export default function SchoolDetailPage() {
  const params = useParams()
  const [school, setSchool] = useState<SchoolDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newNote, setNewNote] = useState('')

  const [limits, setLimits] = useState({
    assessmentLimit: 50,
    reportLimit: 50
  })
  const [customPricing, setCustomPricing] = useState({
    enabled: false,
    price: 0,
    discountPercent: 0,
    discountReason: ''
  })

  useEffect(() => {
    fetchSchool()
  }, [params.id])

  const fetchSchool = async () => {
    try {
      const res = await fetch(`/api/super-admin/schools/${params.id}`)
      const data = await res.json()
      setSchool(data.school)

      if (data.school) {
        setLimits({
          assessmentLimit: data.school.override?.customAssessmentLimit || data.school.assessmentLimit,
          reportLimit: data.school.override?.customReportLimit || data.school.reportLimit
        })
        if (data.school.override?.customMonthlyPrice) {
          setCustomPricing({
            enabled: true,
            price: data.school.override.customMonthlyPrice,
            discountPercent: data.school.override.discountPercent || 0,
            discountReason: data.school.override.discountReason || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch school:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'verified' ? 'verify' : newStatus} this school?`)) {
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/super-admin/schools/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        fetchSchool()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveLimits = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/super-admin/schools/${params.id}/limits`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentLimit: limits.assessmentLimit,
          reportLimit: limits.reportLimit,
          customPricing: customPricing.enabled ? {
            price: customPricing.price,
            discountPercent: customPricing.discountPercent,
            discountReason: customPricing.discountReason
          } : null
        })
      })

      if (res.ok) {
        fetchSchool()
      }
    } catch (error) {
      console.error('Failed to save limits:', error)
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const res = await fetch(`/api/super-admin/schools/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote })
      })

      if (res.ok) {
        setNewNote('')
        fetchSchool()
      }
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  const addFreeAssessments = (amount: number) => {
    setLimits(prev => ({
      ...prev,
      assessmentLimit: prev.assessmentLimit + amount
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">School not found</h2>
        <Link href="/super-admin/schools" className="text-amber-500 hover:underline mt-2 inline-block">
          Back to Schools
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/super-admin/schools"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
            {getStatusBadge(school.status)}
          </div>
          <p className="text-gray-500">Code: {school.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">

          {/* Verification Actions */}
          {school.status === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Verification Required
              </h2>
              <p className="text-amber-700 mb-4">
                Review the school details and documents before approving.
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

          {/* Admin Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{school.adminName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{school.adminDesignation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${school.contactEmail}`} className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {school.contactEmail}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                {school.adminPhone ? (
                  <a href={`tel:${school.adminPhone}`} className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {school.adminPhone}
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                {school.adminLinkedIn ? (
                  <a href={school.adminLinkedIn} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    View Profile
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Staff ID Card</p>
                {school.staffIdCard ? (
                  <a href={school.staffIdCard} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    View Document
                  </a>
                ) : (
                  <p className="text-gray-400">Not uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">School Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Website</p>
                {school.schoolWebsite ? (
                  <a href={school.schoolWebsite} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {school.schoolWebsite}
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{school.schoolType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Affiliation</p>
                <p className="font-medium">{school.affiliation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Strength</p>
                <p className="font-medium">{school.studentStrength || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {school.schoolAddress || 'Not provided'}
                  {school.country && `, ${school.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* Usage & Limits */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage & Limits</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Assessment Quota</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Used: {school.usedAssessments}</span>
                      <span>Limit: {limits.assessmentLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${Math.min((school.usedAssessments / limits.assessmentLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Report Quota</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Used: {school.usedReports}</span>
                      <span>Limit: {limits.reportLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min((school.usedReports / limits.reportLimit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Limits */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Edit Limits</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Assessment Limit</label>
                  <input
                    type="number"
                    value={limits.assessmentLimit}
                    onChange={(e) => setLimits(prev => ({ ...prev, assessmentLimit: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Report Limit</label>
                  <input
                    type="number"
                    value={limits.reportLimit}
                    onChange={(e) => setLimits(prev => ({ ...prev, reportLimit: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Quick Add:</span>
                <button
                  onClick={() => addFreeAssessments(10)}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200"
                >
                  +10 Free
                </button>
                <button
                  onClick={() => addFreeAssessments(25)}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200"
                >
                  +25 Free
                </button>
                <button
                  onClick={() => addFreeAssessments(50)}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200"
                >
                  +50 Free
                </button>
              </div>

              <button
                onClick={saveLimits}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Custom Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Pricing</h2>

            <div className="flex items-center gap-3 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={customPricing.enabled}
                  onChange={(e) => setCustomPricing(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
              <span className="text-sm text-gray-700">Enable custom pricing for this school</span>
            </div>

            {customPricing.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Custom Price ($/month)</label>
                  <input
                    type="number"
                    value={customPricing.price}
                    onChange={(e) => setCustomPricing(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={customPricing.discountPercent}
                    onChange={(e) => setCustomPricing(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Reason</label>
                  <input
                    type="text"
                    value={customPricing.discountReason}
                    onChange={(e) => setCustomPricing(prev => ({ ...prev, discountReason: e.target.value }))}
                    placeholder="e.g., Pilot school"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
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
                  Students
                </span>
                <span className="font-semibold">{school.studentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Assessments
                </span>
                <span className="font-semibold">{school.assessmentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reports
                </span>
                <span className="font-semibold">{school.reportCount}</span>
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
                  <p className="text-gray-500">{new Date(school.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {school.verifiedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-900">Verified</p>
                    <p className="text-gray-500">{new Date(school.verifiedAt).toLocaleDateString()}</p>
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
              {school.adminNotes?.length === 0 ? (
                <p className="text-gray-400 text-sm">No notes yet</p>
              ) : (
                school.adminNotes?.map((note) => (
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
          {school.status !== 'suspended' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
              <button
                onClick={() => updateStatus('suspended')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full justify-center"
              >
                <XCircle className="w-4 h-4" />
                Suspend School
              </button>
            </div>
          )}

          {school.status === 'suspended' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Reactivate</h2>
              <button
                onClick={() => updateStatus('verified')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full justify-center"
              >
                <CheckCircle className="w-4 h-4" />
                Reactivate School
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
