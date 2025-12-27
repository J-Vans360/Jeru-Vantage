'use client'

import { useEffect, useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'

interface SystemSettings {
  allowIndividualRegistration: boolean
  allowSchoolRegistration: boolean
  allowSponsorRegistration: boolean
  requireSchoolVerification: boolean
  requireSponsorVerification: boolean
  enablePayments: boolean
  enableIndividualPayments: boolean
  enableSchoolPayments: boolean
  enableSponsorPayments: boolean
  enablePromoCodes: boolean
  enableAIReports: boolean
  enableReportReleaseControl: boolean
  enableBulkImport: boolean
  emailOnNewSchool: boolean
  emailOnNewSponsor: boolean
  emailOnDocumentUpload: boolean
  dailySummaryEmail: boolean
}

const defaultSettings: SystemSettings = {
  allowIndividualRegistration: true,
  allowSchoolRegistration: true,
  allowSponsorRegistration: true,
  requireSchoolVerification: true,
  requireSponsorVerification: true,
  enablePayments: false,
  enableIndividualPayments: false,
  enableSchoolPayments: false,
  enableSponsorPayments: false,
  enablePromoCodes: true,
  enableAIReports: true,
  enableReportReleaseControl: true,
  enableBulkImport: true,
  emailOnNewSchool: true,
  emailOnNewSponsor: true,
  emailOnDocumentUpload: true,
  dailySummaryEmail: false
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/super-admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleToggle = (key: keyof SystemSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch('/api/super-admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-amber-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

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
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform behavior</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Registration Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Individual Student Registration</p>
                <p className="text-sm text-gray-500">Allow students to sign up without a school or sponsor</p>
              </div>
              <Toggle enabled={settings.allowIndividualRegistration} onChange={() => handleToggle('allowIndividualRegistration')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">School Registration</p>
                <p className="text-sm text-gray-500">Allow new schools to register on the platform</p>
              </div>
              <Toggle enabled={settings.allowSchoolRegistration} onChange={() => handleToggle('allowSchoolRegistration')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Sponsor/NGO Registration</p>
                <p className="text-sm text-gray-500">Allow new sponsors to register on the platform</p>
              </div>
              <Toggle enabled={settings.allowSponsorRegistration} onChange={() => handleToggle('allowSponsorRegistration')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Require School Verification</p>
                <p className="text-sm text-gray-500">Schools must be verified before they can add students</p>
              </div>
              <Toggle enabled={settings.requireSchoolVerification} onChange={() => handleToggle('requireSchoolVerification')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Require Sponsor Verification</p>
                <p className="text-sm text-gray-500">Sponsors must be verified before they can add students</p>
              </div>
              <Toggle enabled={settings.requireSponsorVerification} onChange={() => handleToggle('requireSponsorVerification')} />
            </div>
          </div>
        </div>

        {/* Payment Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Enable Payments</p>
                <p className="text-sm text-gray-500">Master switch for all payment features</p>
              </div>
              <Toggle enabled={settings.enablePayments} onChange={() => handleToggle('enablePayments')} />
            </div>
            <div className="flex items-center justify-between py-2 pl-6 border-l-2 border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Individual Student Payments</p>
                <p className="text-sm text-gray-500">Students can pay for assessments/reports</p>
              </div>
              <Toggle enabled={settings.enableIndividualPayments} onChange={() => handleToggle('enableIndividualPayments')} />
            </div>
            <div className="flex items-center justify-between py-2 pl-6 border-l-2 border-gray-200">
              <div>
                <p className="font-medium text-gray-900">School Subscription Payments</p>
                <p className="text-sm text-gray-500">Schools can subscribe to paid plans</p>
              </div>
              <Toggle enabled={settings.enableSchoolPayments} onChange={() => handleToggle('enableSchoolPayments')} />
            </div>
            <div className="flex items-center justify-between py-2 pl-6 border-l-2 border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Sponsor Subscription Payments</p>
                <p className="text-sm text-gray-500">Sponsors can subscribe to paid plans</p>
              </div>
              <Toggle enabled={settings.enableSponsorPayments} onChange={() => handleToggle('enableSponsorPayments')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Promo Codes</p>
                <p className="text-sm text-gray-500">Allow promo codes at checkout</p>
              </div>
              <Toggle enabled={settings.enablePromoCodes} onChange={() => handleToggle('enablePromoCodes')} />
            </div>
          </div>
        </div>

        {/* Feature Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">AI Jeru Reports</p>
                <p className="text-sm text-gray-500">Generate AI-powered career reports</p>
              </div>
              <Toggle enabled={settings.enableAIReports} onChange={() => handleToggle('enableAIReports')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Report Release Control</p>
                <p className="text-sm text-gray-500">Let schools control when reports are released</p>
              </div>
              <Toggle enabled={settings.enableReportReleaseControl} onChange={() => handleToggle('enableReportReleaseControl')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Bulk Student Import</p>
                <p className="text-sm text-gray-500">Allow schools to upload CSV of students</p>
              </div>
              <Toggle enabled={settings.enableBulkImport} onChange={() => handleToggle('enableBulkImport')} />
            </div>
          </div>
        </div>

        {/* Notification Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">New School Registration</p>
                <p className="text-sm text-gray-500">Email when a new school registers</p>
              </div>
              <Toggle enabled={settings.emailOnNewSchool} onChange={() => handleToggle('emailOnNewSchool')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">New Sponsor Registration</p>
                <p className="text-sm text-gray-500">Email when a new sponsor registers</p>
              </div>
              <Toggle enabled={settings.emailOnNewSponsor} onChange={() => handleToggle('emailOnNewSponsor')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Document Upload</p>
                <p className="text-sm text-gray-500">Email when verification documents are uploaded</p>
              </div>
              <Toggle enabled={settings.emailOnDocumentUpload} onChange={() => handleToggle('emailOnDocumentUpload')} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Daily Summary</p>
                <p className="text-sm text-gray-500">Receive daily platform summary email</p>
              </div>
              <Toggle enabled={settings.dailySummaryEmail} onChange={() => handleToggle('dailySummaryEmail')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
