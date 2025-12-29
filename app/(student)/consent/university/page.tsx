'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Star,
  Target,
  Shield,
  Plus,
  X,
  Globe,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle,
  Loader2,
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  DollarSign,
  Brain,
  Sparkles,
  Lock,
  EyeOff,
  Check,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

interface UniversityPreference {
  id: string;
  universityName: string;
  country: string;
  category: 'DREAM' | 'GOOD_FIT' | 'BACKUP';
}

interface StudentData {
  name: string;
  email: string;
  country: string;
  degreeLevel: string;
  hollandCode?: string;
  topValues?: string[];
  budgetRange?: string;
  topStrengths?: string[];
  careerMatches?: string[];
  multipleIntelligences?: string[];
}

interface DataItem {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  level: 'BASIC' | 'ENHANCED' | 'FULL';
}

const POPULAR_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Netherlands',
  'Singapore',
  'Hong Kong',
  'Japan',
  'South Korea',
  'France',
  'Switzerland',
  'Ireland',
  'New Zealand',
  'Sweden',
];

const CATEGORY_INFO = {
  DREAM: {
    icon: Star,
    label: 'Dream Schools',
    description: 'Reach schools - highly selective, aspirational',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  GOOD_FIT: {
    icon: Target,
    label: 'Good Fit',
    description: 'Match schools - align with your profile',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  BACKUP: {
    icon: Shield,
    label: 'Safety Schools',
    description: 'Backup options - likely admission',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
};

const CONSENT_LEVELS = [
  {
    id: 'BASIC',
    label: 'Basic Profile',
    description: 'Name, email, country, and degree level only',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'ENHANCED',
    label: 'Enhanced Profile',
    description: 'Basic info + Holland Code, values, and budget range',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    recommended: true,
  },
  {
    id: 'FULL',
    label: 'Full Profile',
    description: 'All assessment data including strengths and career matches',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'NONE',
    label: "I don't wish to share my details",
    description: 'Your profile will not be shared with any universities',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    noShare: true,
  },
];

const PROTECTED_DATA = [
  'Raw assessment responses',
  'Stress patterns',
  'Areas for development',
  'Detailed personality scores',
  'Cognitive style analysis',
  'Negative feedback',
];

type Step = 'preferences' | 'consent' | 'preview' | 'complete';

export default function UniversityConsentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('preferences');
  const [preferences, setPreferences] = useState<UniversityPreference[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPreference, setNewPreference] = useState({
    universityName: '',
    country: '',
    category: 'GOOD_FIT' as 'DREAM' | 'GOOD_FIT' | 'BACKUP',
  });
  const [consentLevel, setConsentLevel] = useState<'BASIC' | 'ENHANCED' | 'FULL' | 'NONE'>('ENHANCED');
  const [globalConsent, setGlobalConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [excludedUniversities, setExcludedUniversities] = useState<Set<string>>(new Set());

  // Fetch student data on mount
  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await fetch('/api/student/profile-preview');
        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudentData();
  }, []);

  // Get data items based on consent level
  const getDataItems = (): DataItem[] => {
    if (!studentData) return [];

    const basicItems: DataItem[] = [
      { id: 'name', label: 'Name', value: studentData.name || 'Not provided', icon: User, level: 'BASIC' },
      { id: 'email', label: 'Email', value: studentData.email || 'Not provided', icon: Mail, level: 'BASIC' },
      { id: 'country', label: 'Country', value: studentData.country || 'Not provided', icon: MapPin, level: 'BASIC' },
      { id: 'degreeLevel', label: 'Degree Level', value: studentData.degreeLevel || 'Undergraduate', icon: GraduationCap, level: 'BASIC' },
    ];

    const enhancedItems: DataItem[] = [
      { id: 'hollandCode', label: 'Holland Code', value: studentData.hollandCode || 'Not assessed', icon: Briefcase, level: 'ENHANCED' },
      { id: 'topValues', label: 'Top Values', value: studentData.topValues?.join(', ') || 'Not assessed', icon: Heart, level: 'ENHANCED' },
      { id: 'budgetRange', label: 'Budget Range', value: studentData.budgetRange || 'Not specified', icon: DollarSign, level: 'ENHANCED' },
    ];

    const fullItems: DataItem[] = [
      { id: 'topStrengths', label: 'Top Strengths', value: studentData.topStrengths?.join(', ') || 'Not assessed', icon: Sparkles, level: 'FULL' },
      { id: 'careerMatches', label: 'Career Matches', value: studentData.careerMatches?.join(', ') || 'Not assessed', icon: Target, level: 'FULL' },
      { id: 'multipleIntelligences', label: 'Multiple Intelligences', value: studentData.multipleIntelligences?.join(', ') || 'Not assessed', icon: Brain, level: 'FULL' },
    ];

    if (consentLevel === 'BASIC') return basicItems;
    if (consentLevel === 'ENHANCED') return [...basicItems, ...enhancedItems];
    return [...basicItems, ...enhancedItems, ...fullItems];
  };

  const addPreference = () => {
    if (newPreference.universityName && newPreference.country) {
      setPreferences([
        ...preferences,
        {
          id: Date.now().toString(),
          ...newPreference,
        },
      ]);
      setNewPreference({
        universityName: '',
        country: '',
        category: 'GOOD_FIT',
      });
      setShowAddForm(false);
    }
  };

  const removePreference = (id: string) => {
    setPreferences(preferences.filter((p) => p.id !== id));
  };

  const toggleUniversityExclusion = (id: string) => {
    setExcludedUniversities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // For NONE consent level, submit with empty preferences
      const includedPreferences = consentLevel === 'NONE'
        ? []
        : preferences.filter((p) => !excludedUniversities.has(p.id));

      const response = await fetch('/api/consent/university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: includedPreferences.map((p) => ({
            universityName: p.universityName,
            country: p.country,
            category: p.category,
            consentToConnect: consentLevel !== 'NONE' && globalConsent,
          })),
          consentLevel,
          globalConsent: consentLevel !== 'NONE' && globalConsent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Consent API error:', errorData);
        alert('Something went wrong. Please try again.');
        return;
      }

      // Check user type and redirect accordingly
      const statusRes = await fetch('/api/student/status');
      const status = await statusRes.json();

      if (consentLevel === 'NONE') {
        // NONE consent - redirect based on user type
        if (status.isPaidUser) {
          router.push('/ai-jeru');
        } else if (!status.survey2Completed) {
          router.push('/survey/ai-report');
        } else {
          setStep('complete');
        }
      } else {
        // Non-NONE consent (BASIC, ENHANCED, FULL)
        // Pilot users need to complete Survey 2 if not done
        if (status.isPaidUser) {
          // Paid user - go directly to success/report
          setStep('complete');
        } else if (!status.survey2Completed) {
          // Pilot user who hasn't done Survey 2 - redirect to survey
          router.push('/survey/ai-report');
        } else {
          // Pilot user who completed Survey 2 - show complete
          setStep('complete');
        }
      }
    } catch (error) {
      console.error('Consent submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedPreferences = {
    DREAM: preferences.filter((p) => p.category === 'DREAM'),
    GOOD_FIT: preferences.filter((p) => p.category === 'GOOD_FIT'),
    BACKUP: preferences.filter((p) => p.category === 'BACKUP'),
  };

  const getStepNumber = () => {
    const steps: Step[] = ['preferences', 'consent', 'preview', 'complete'];
    return steps.indexOf(step);
  };

  // Complete screen
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re All Set!</h1>
          <p className="text-gray-600 mb-6">
            Your preferences have been saved and your report download is now unlocked.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6">
            <p className="text-indigo-900 font-medium mb-2">Download Unlocked!</p>
            <p className="text-sm text-indigo-700">
              You can now print or save your AI career report as a PDF.
            </p>
          </div>

          <button
            onClick={() => router.push('/ai-jeru')}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2"
          >
            Go to My Report <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const stepTitles: Record<Step, string> = {
    preferences: 'Your University Preferences',
    consent: 'Choose Your Privacy Level',
    preview: 'Review Information to Share',
    complete: 'Complete',
  };

  const stepDescriptions: Record<Step, string> = {
    preferences: "Tell us about universities you're interested in. This helps us connect you with institutions that match your goals.",
    consent: "Choose how much information you'd like to share with universities when they reach out.",
    preview: 'Review exactly what information will be shared based on your selected privacy level.',
    complete: '',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/ai-jeru"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{stepTitles[step]}</h1>
          <p className="text-gray-600 max-w-lg mx-auto">{stepDescriptions[step]}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  getStepNumber() > idx
                    ? 'bg-green-500 text-white'
                    : getStepNumber() === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {getStepNumber() > idx ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    getStepNumber() > idx ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-8 px-4">
          <span>Universities</span>
          <span>Privacy Level</span>
          <span>Review & Confirm</span>
        </div>

        {/* Step 1: Preferences */}
        {step === 'preferences' && (
          <>
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Why share this?</strong> When we partner with universities you&apos;re
                    interested in, we can help facilitate connections. You control whether they can
                    reach out to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Sections */}
            <div className="space-y-6 mb-8">
              {(['DREAM', 'GOOD_FIT', 'BACKUP'] as const).map((category) => {
                const info = CATEGORY_INFO[category];
                const Icon = info.icon;
                const categoryPrefs = groupedPreferences[category];

                return (
                  <div key={category} className={`border rounded-xl overflow-hidden ${info.borderColor}`}>
                    <div className={`px-4 py-3 ${info.bgColor} border-b ${info.borderColor}`}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${info.color}`} />
                        <span className={`font-semibold ${info.color}`}>{info.label}</span>
                        <span className="text-sm text-gray-500">({categoryPrefs.length})</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                    </div>

                    <div className="p-4">
                      {categoryPrefs.length > 0 ? (
                        <div className="space-y-2">
                          {categoryPrefs.map((pref) => (
                            <div
                              key={pref.id}
                              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">{pref.universityName}</p>
                                  <p className="text-sm text-gray-500">{pref.country}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removePreference(pref.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No universities added yet</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add University Form */}
            {showAddForm ? (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add University</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                    <input
                      type="text"
                      value={newPreference.universityName}
                      onChange={(e) => setNewPreference({ ...newPreference, universityName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Harvard University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={newPreference.country}
                      onChange={(e) => setNewPreference({ ...newPreference, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select country</option>
                      {POPULAR_COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['DREAM', 'GOOD_FIT', 'BACKUP'] as const).map((cat) => {
                        const info = CATEGORY_INFO[cat];
                        const CatIcon = info.icon;
                        return (
                          <button
                            key={cat}
                            onClick={() => setNewPreference({ ...newPreference, category: cat })}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                              newPreference.category === cat
                                ? `${info.borderColor} ${info.bgColor}`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <CatIcon className={`w-5 h-5 ${info.color}`} />
                            <span className="text-xs font-medium text-gray-700">{info.label.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPreference}
                      disabled={!newPreference.universityName || !newPreference.country}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add University
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="w-5 h-5" />
                Add University
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('consent')}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep('consent')}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Consent Level */}
        {step === 'consent' && (
          <>
            {/* Consent Level Selection */}
            <div className="space-y-4 mb-8">
              {CONSENT_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setConsentLevel(level.id as 'BASIC' | 'ENHANCED' | 'FULL' | 'NONE')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    consentLevel === level.id
                      ? `${level.bgColor} ${level.borderColor} ${level.color}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {level.noShare && <Lock className="w-4 h-4 text-gray-500" />}
                        <span className={`font-semibold ${consentLevel === level.id ? level.color : 'text-gray-900'}`}>
                          {level.label}
                        </span>
                        {level.recommended && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        consentLevel === level.id ? 'border-current bg-current' : 'border-gray-300'
                      }`}
                    >
                      {consentLevel === level.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Global Consent Toggle */}
            {preferences.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalConsent}
                    onChange={(e) => setGlobalConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Allow universities to contact me</span>
                    <p className="text-sm text-gray-500 mt-1">
                      When these universities partner with Jeru Vantage, we can share your assessment results
                      and contact information to facilitate a connection.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Privacy Note */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800">
                    <strong>Your data is protected.</strong> We will never share your raw assessment
                    responses, stress patterns, or areas for development. You can update or withdraw consent
                    at any time from your Privacy dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('preferences')}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {consentLevel === 'NONE' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Skip Sharing & Unlock Download
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setStep('preview')}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
                >
                  Review What You&apos;ll Share
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Selected Privacy Level Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Privacy Level:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        CONSENT_LEVELS.find((l) => l.id === consentLevel)?.bgColor
                      } ${CONSENT_LEVELS.find((l) => l.id === consentLevel)?.color}`}
                    >
                      {CONSENT_LEVELS.find((l) => l.id === consentLevel)?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep('consent')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Change Level
                  </button>
                </div>

                {/* Information to be shared */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Information to be shared
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {getDataItems().map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                          <span className="font-medium text-gray-900">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Protected Information */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <EyeOff className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Protected Information (NEVER shared)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PROTECTED_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-700">
                        <Lock className="w-3 h-3" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Universities to receive profile */}
                {preferences.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                        Universities that will receive your profile
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Uncheck any you want to exclude</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {preferences.map((pref) => {
                        const isExcluded = excludedUniversities.has(pref.id);
                        const catInfo = CATEGORY_INFO[pref.category];
                        return (
                          <label
                            key={pref.id}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                              isExcluded ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={!isExcluded}
                                onChange={() => toggleUniversityExclusion(pref.id)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <p className={`font-medium ${isExcluded ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                  {pref.universityName}
                                </p>
                                <p className="text-sm text-gray-500">{pref.country}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${catInfo.bgColor} ${catInfo.color}`}>
                              {catInfo.label.split(' ')[0]}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Legal text */}
                <p className="text-xs text-gray-500 text-center mb-6">
                  By clicking &quot;Confirm & Unlock Download&quot;, you agree to share the selected information
                  with the universities listed above (if any) and consent to being contacted about admission
                  opportunities. View our{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('consent')}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm & Unlock Download
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Your data is protected under our Privacy Policy. You can update preferences anytime.
        </p>
      </div>
    </div>
  );
}
