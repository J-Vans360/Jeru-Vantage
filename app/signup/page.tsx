'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  User,
  Ticket,
  Building2,
  Heart,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  HelpCircle,
  MessageCircle
} from 'lucide-react'

type UserType = 'student' | 'student-with-code' | 'school-admin' | 'sponsor' | null

interface CodeValidation {
  valid: boolean
  type: 'school' | 'sponsor' | null
  name: string | null
  checking: boolean
}

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'select' | 'form'>('select')
  const [userType, setUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [codeValidation, setCodeValidation] = useState<CodeValidation>({
    valid: false,
    type: null,
    name: null,
    checking: false
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    grade: '',
    section: '',
    schoolNameInput: '',
    contactPhone: '',
    country: '',
    organizationName: '',
    organizationType: 'ngo',
    website: '',
    // School verification fields
    designation: '',
    linkedIn: '',
    schoolWebsite: '',
    schoolAddress: '',
    schoolType: '',
    affiliation: '',
    studentStrength: '',
    // Sponsor verification fields
    sponsorDesignation: '',
    sponsorPhone: '',
    sponsorLinkedIn: '',
    sponsorOrgName: '',
    sponsorOrgType: '',
    sponsorCountry: '',
    sponsorWebsite: '',
    sponsorRegNumber: '',
    sponsorAddress: '',
    sponsorPurpose: '',
    sponsorBeneficiaries: '',
    sponsorEstimatedStudents: ''
  })

  // Check for code in URL (for direct links)
  useEffect(() => {
    const codeFromUrl = searchParams.get('code') || searchParams.get('schoolCode') || searchParams.get('sponsorCode')
    if (codeFromUrl) {
      setFormData(prev => ({ ...prev, code: codeFromUrl.toUpperCase() }))
      setUserType('student-with-code')
      setStep('form')
      validateCode(codeFromUrl.toUpperCase())
    }
  }, [searchParams])

  // Clear form on mount
  useEffect(() => {
    if (!searchParams.get('code') && !searchParams.get('schoolCode') && !searchParams.get('sponsorCode')) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: '',
        grade: '',
        section: '',
        schoolNameInput: '',
        contactPhone: '',
        country: '',
        organizationName: '',
        organizationType: 'ngo',
        website: '',
        designation: '',
        linkedIn: '',
        schoolWebsite: '',
        schoolAddress: '',
        schoolType: '',
        affiliation: '',
        studentStrength: '',
        sponsorDesignation: '',
        sponsorPhone: '',
        sponsorLinkedIn: '',
        sponsorOrgName: '',
        sponsorOrgType: '',
        sponsorCountry: '',
        sponsorWebsite: '',
        sponsorRegNumber: '',
        sponsorAddress: '',
        sponsorPurpose: '',
        sponsorBeneficiaries: '',
        sponsorEstimatedStudents: ''
      })
    }
  }, [searchParams])

  // Validate code - checks both school and sponsor tables
  const validateCode = async (code: string) => {
    if (code.length < 4) {
      setCodeValidation({ valid: false, type: null, name: null, checking: false })
      return
    }

    setCodeValidation(prev => ({ ...prev, checking: true }))

    try {
      const res = await fetch(`/api/codes/validate?code=${code}`)
      const data = await res.json()

      if (data.valid) {
        setCodeValidation({
          valid: true,
          type: data.type,
          name: data.name,
          checking: false
        })
      } else {
        setCodeValidation({
          valid: false,
          type: null,
          name: null,
          checking: false
        })
      }
    } catch {
      setCodeValidation({
        valid: false,
        type: null,
        name: null,
        checking: false
      })
    }
  }

  const handleCodeChange = (code: string) => {
    const upperCode = code.toUpperCase()
    setFormData(prev => ({ ...prev, code: upperCode }))
    validateCode(upperCode)
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setStep('form')
    setError('')
  }

  const handleBack = () => {
    setStep('select')
    setUserType(null)
    setError('')
    setCodeValidation({ valid: false, type: null, name: null, checking: false })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (userType === 'student-with-code' && !codeValidation.valid) {
      setError('Please enter a valid school or sponsor code')
      return
    }

    setLoading(true)

    try {
      const payload: Record<string, string | undefined> = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }

      if (userType === 'student-with-code' && codeValidation.valid) {
        if (codeValidation.type === 'school') {
          payload.schoolCode = formData.code
          payload.grade = formData.grade || undefined
          payload.section = formData.section || undefined
        } else if (codeValidation.type === 'sponsor') {
          payload.sponsorCode = formData.code
        }
      }

      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        setError(registerData.error || 'Failed to create account')
        setLoading(false)
        return
      }

      if (userType === 'school-admin') {
        // Encode all verification data to pass to login
        const schoolData = {
          schoolName: formData.schoolNameInput,
          country: formData.country,
          phone: formData.contactPhone,
          designation: formData.designation,
          linkedIn: formData.linkedIn,
          schoolWebsite: formData.schoolWebsite,
          schoolAddress: formData.schoolAddress,
          schoolType: formData.schoolType,
          affiliation: formData.affiliation,
          studentStrength: formData.studentStrength
        }
        router.push(`/login?registered=true&createSchool=true&schoolData=${encodeURIComponent(JSON.stringify(schoolData))}`)
      } else if (userType === 'sponsor') {
        // Encode all sponsor verification data to pass to login
        const sponsorData = {
          contactName: formData.name,
          contactDesignation: formData.sponsorDesignation,
          contactPhone: formData.sponsorPhone,
          contactLinkedIn: formData.sponsorLinkedIn,
          orgName: formData.sponsorOrgName,
          orgType: formData.sponsorOrgType,
          country: formData.sponsorCountry,
          website: formData.sponsorWebsite,
          registrationNumber: formData.sponsorRegNumber,
          address: formData.sponsorAddress,
          purpose: formData.sponsorPurpose,
          beneficiaries: formData.sponsorBeneficiaries,
          estimatedStudents: formData.sponsorEstimatedStudents
        }
        router.push(`/login?registered=true&createSponsor=true&sponsorData=${encodeURIComponent(JSON.stringify(sponsorData))}`)
      } else {
        router.push('/login?registered=true')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const userTypeOptions = [
    {
      type: 'student' as UserType,
      icon: User,
      title: 'Student',
      subtitle: 'Individual learner',
      description: 'Take the assessment independently - no code needed',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200 hover:border-blue-500'
    },
    {
      type: 'student-with-code' as UserType,
      icon: Ticket,
      title: 'Student with Join Code',
      subtitle: 'School or sponsor program',
      description: 'Have a join code from your school or sponsor? Enter it here',
      color: 'from-green-500 to-teal-600',
      borderColor: 'border-green-200 hover:border-green-500'
    },
    {
      type: 'school-admin' as UserType,
      icon: Building2,
      title: 'School / Institution',
      subtitle: 'For schools & counselors',
      description: 'Register your school and manage student assessments',
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-200 hover:border-purple-500'
    },
    {
      type: 'sponsor' as UserType,
      icon: Heart,
      title: 'NGO / Sponsor',
      subtitle: 'Community programs',
      description: 'Sponsor students or run programs for communities',
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-200 hover:border-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Jeru Vantage</span>
          </Link>
        </div>

        {/* Step 1: Select User Type */}
        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
              <p className="text-gray-600 mt-2">Choose how you want to use Jeru Vantage</p>
            </div>

            <div className="space-y-4">
              {userTypeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.type}
                    onClick={() => handleUserTypeSelect(option.type)}
                    className={`w-full p-5 rounded-xl border-2 ${option.borderColor} text-left transition-all hover:shadow-md group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{option.title}</h3>
                            <p className="text-sm text-gray-500">{option.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Header based on user type */}
            <div className="text-center mb-8">
              {userType === 'student' && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Student Registration</h1>
                  <p className="text-gray-600 mt-2">Create your account to start the assessment</p>
                </>
              )}
              {userType === 'student-with-code' && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Join with Code</h1>
                  <p className="text-gray-600 mt-2">Enter your school or sponsor code</p>
                </>
              )}
              {userType === 'school-admin' && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Register Your School</h1>
                  <p className="text-gray-600 mt-2">Set up your school&apos;s admin account</p>
                </>
              )}
              {userType === 'sponsor' && (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Sponsor Program</h1>
                  <p className="text-gray-600 mt-2">Help students discover their potential</p>
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

              {/* CODE FIELD - Show first for student-with-code */}
              {userType === 'student-with-code' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Code *
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={formData.code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase font-mono text-lg tracking-widest"
                      placeholder="ENTER JOIN CODE"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {codeValidation.checking && (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      )}
                      {!codeValidation.checking && codeValidation.valid && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {!codeValidation.checking && formData.code.length >= 4 && !codeValidation.valid && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Code validation result */}
                  {codeValidation.valid && codeValidation.name && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {codeValidation.type === 'school' ? (
                          <Building2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Heart className="w-5 h-5 text-green-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-green-800">{codeValidation.name}</p>
                          <p className="text-xs text-green-600">
                            {codeValidation.type === 'school' ? 'School Program' : 'Sponsor Program'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.code.length >= 4 && !codeValidation.valid && !codeValidation.checking && (
                    <p className="mt-2 text-sm text-red-500">
                      Invalid code. Please check and try again.
                    </p>
                  )}
                </div>
              )}

              {/* Grade/Section for school students */}
              {userType === 'student-with-code' && codeValidation.valid && codeValidation.type === 'school' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select</option>
                      {[9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="A"
                    />
                  </div>
                </div>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={userType === 'sponsor' ? 'Contact Person Name' : 'Your full name'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    autoComplete="new-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* School Admin Fields */}
              {userType === 'school-admin' && (
                <div className="border-t pt-4 mt-4 space-y-4">
                  {/* Personal Verification */}
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-purple-900 mb-1">Verification Required</h3>
                    <p className="text-sm text-purple-700">
                      To protect students, we verify all school accounts. Please provide accurate information.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Designation *
                      </label>
                      <select
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Role</option>
                        <option value="principal">Principal</option>
                        <option value="vice_principal">Vice Principal</option>
                        <option value="director">Director</option>
                        <option value="head_counselor">Head Counselor</option>
                        <option value="counselor">Counselor</option>
                        <option value="coordinator">Academic Coordinator</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">School Administrator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <p className="text-xs text-gray-500 mt-1">Helps us verify your professional identity</p>
                  </div>

                  <hr className="my-4" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolNameInput}
                      onChange={(e) => setFormData({ ...formData, schoolNameInput: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Lincoln High School"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Official School Website *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.schoolWebsite}
                      onChange={(e) => setFormData({ ...formData, schoolWebsite: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://www.lincolnhigh.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Address *
                    </label>
                    <textarea
                      required
                      value={formData.schoolAddress}
                      onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Full school address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <select
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Country</option>
                        {['USA', 'Canada', 'UK', 'Australia', 'India', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Other'].map(c =>
                          <option key={c} value={c}>{c}</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Type *</label>
                      <select
                        required
                        value={formData.schoolType}
                        onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Type</option>
                        <option value="private">Private School</option>
                        <option value="public">Public/Government School</option>
                        <option value="international">International School</option>
                        <option value="boarding">Boarding School</option>
                        <option value="charter">Charter School</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Board/Affiliation</label>
                      <select
                        value={formData.affiliation}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="Cambridge">Cambridge (IGCSE/A-Level)</option>
                        <option value="State">State Board</option>
                        <option value="American">American Curriculum</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Strength</label>
                      <select
                        value={formData.studentStrength}
                        onChange={(e) => setFormData({ ...formData, studentStrength: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Range</option>
                        <option value="small">Under 500</option>
                        <option value="medium">500 - 1,000</option>
                        <option value="large">1,000 - 2,500</option>
                        <option value="xlarge">2,500 - 5,000</option>
                        <option value="xxlarge">Over 5,000</option>
                      </select>
                    </div>
                  </div>

                  {/* What schools get */}
                  <div className="bg-green-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-green-900 mb-2">What You Get (Free Tier)</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>&#10003; 50 free student assessments</li>
                      <li>&#10003; Student management dashboard</li>
                      <li>&#10003; Basic progress tracking</li>
                      <li>&#8987; AI Jeru Reports (available with paid plan)</li>
                    </ul>
                    <p className="text-xs text-green-600 mt-2">
                      Verification typically takes 24-48 hours
                    </p>
                  </div>

                  {/* Help/Contact Section */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Having trouble signing up or have questions about our school program?
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href="mailto:support@jeruvantage.com"
                            className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                          >
                            <Mail className="w-4 h-4" />
                            support@jeruvantage.com
                          </a>
                          <a
                            href="https://wa.me/14155551234"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900 font-medium"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp Us
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsor/NGO Fields */}
              {userType === 'sponsor' && (
                <div className="border-t pt-4 mt-4 space-y-4">
                  {/* Verification Notice */}
                  <div className="bg-pink-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-pink-900 mb-1">Verification Required</h3>
                    <p className="text-sm text-pink-700">
                      To protect students, we verify all sponsor organizations. Please provide accurate information.
                    </p>
                  </div>

                  {/* Contact Person Section */}
                  <h4 className="font-medium text-gray-900">Contact Person Details</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Designation *
                      </label>
                      <select
                        required
                        value={formData.sponsorDesignation}
                        onChange={(e) => setFormData({ ...formData, sponsorDesignation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Role</option>
                        <option value="director">Director</option>
                        <option value="ceo">CEO / Executive Director</option>
                        <option value="founder">Founder</option>
                        <option value="program_manager">Program Manager</option>
                        <option value="csr_head">CSR Head</option>
                        <option value="coordinator">Program Coordinator</option>
                        <option value="trustee">Trustee</option>
                        <option value="board_member">Board Member</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.sponsorPhone}
                        onChange={(e) => setFormData({ ...formData, sponsorPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={formData.sponsorLinkedIn}
                      onChange={(e) => setFormData({ ...formData, sponsorLinkedIn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <p className="text-xs text-gray-500 mt-1">Helps us verify your professional identity</p>
                  </div>

                  <hr className="my-4" />

                  {/* Organization Section */}
                  <h4 className="font-medium text-gray-900">Organization Details</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sponsorOrgName}
                      onChange={(e) => setFormData({ ...formData, sponsorOrgName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="e.g., United Way of America"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Type *
                      </label>
                      <select
                        required
                        value={formData.sponsorOrgType}
                        onChange={(e) => setFormData({ ...formData, sponsorOrgType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Type</option>
                        <option value="ngo">NGO / Non-Profit</option>
                        <option value="foundation">Foundation</option>
                        <option value="csr">Corporate CSR</option>
                        <option value="government">Government Program</option>
                        <option value="trust">Charitable Trust</option>
                        <option value="religious">Religious Organization</option>
                        <option value="international">International NGO</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        required
                        value={formData.sponsorCountry}
                        onChange={(e) => setFormData({ ...formData, sponsorCountry: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select Country</option>
                        {['USA', 'Canada', 'UK', 'Australia', 'India', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'UAE', 'Saudi Arabia', 'Other'].map(c =>
                          <option key={c} value={c}>{c}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Website *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.sponsorWebsite}
                      onChange={(e) => setFormData({ ...formData, sponsorWebsite: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="https://www.organization.org"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.sponsorRegNumber}
                      onChange={(e) => setFormData({ ...formData, sponsorRegNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="e.g., EIN, 501(c)(3) number, etc."
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional but helps speed up verification</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Address *
                    </label>
                    <textarea
                      required
                      value={formData.sponsorAddress}
                      onChange={(e) => setFormData({ ...formData, sponsorAddress: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Full organization address"
                      rows={2}
                    />
                  </div>

                  <hr className="my-4" />

                  {/* Program Section */}
                  <h4 className="font-medium text-gray-900">Sponsorship Program</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Sponsorship *
                    </label>
                    <select
                      required
                      value={formData.sponsorPurpose}
                      onChange={(e) => setFormData({ ...formData, sponsorPurpose: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select Purpose</option>
                      <option value="underprivileged">Support Underprivileged Students</option>
                      <option value="rural">Rural Education Initiative</option>
                      <option value="girls_education">Girls Education Program</option>
                      <option value="career_guidance">Career Guidance Program</option>
                      <option value="skill_development">Skill Development</option>
                      <option value="scholarship">Scholarship Program</option>
                      <option value="community">Community Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Beneficiaries
                    </label>
                    <textarea
                      value={formData.sponsorBeneficiaries}
                      onChange={(e) => setFormData({ ...formData, sponsorBeneficiaries: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Describe who will benefit (e.g., 'Grade 9-12 students from Title I schools in Chicago')"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Students to Sponsor
                    </label>
                    <select
                      value={formData.sponsorEstimatedStudents}
                      onChange={(e) => setFormData({ ...formData, sponsorEstimatedStudents: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select Range</option>
                      <option value="1-50">1 - 50 students</option>
                      <option value="51-100">51 - 100 students</option>
                      <option value="101-250">101 - 250 students</option>
                      <option value="251-500">251 - 500 students</option>
                      <option value="500+">More than 500 students</option>
                    </select>
                  </div>

                  {/* What sponsors get */}
                  <div className="bg-green-50 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-green-900 mb-2">What You Get (Starter)</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>&#10003; 100 sponsored student seats</li>
                      <li>&#10003; Sponsor dashboard</li>
                      <li>&#10003; Student progress tracking</li>
                      <li>&#10003; Impact reports</li>
                      <li>&#10003; AI Jeru Reports for all students</li>
                    </ul>
                    <p className="text-xs text-green-600 mt-2">
                      Verification typically takes 24-48 hours
                    </p>
                  </div>

                  {/* Help/Contact Section */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Have questions about our sponsor program or need assistance?
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href="mailto:support@jeruvantage.com"
                            className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                          >
                            <Mail className="w-4 h-4" />
                            support@jeruvantage.com
                          </a>
                          <a
                            href="https://wa.me/14155551234"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900 font-medium"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp Us
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (userType === 'student-with-code' && !codeValidation.valid)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-6 ${
                  userType === 'student' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                  userType === 'student-with-code' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  userType === 'school-admin' ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                  'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}
