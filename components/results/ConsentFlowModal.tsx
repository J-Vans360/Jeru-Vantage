'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Shield,
  Eye,
  EyeOff,
  Check,
  Lock,
  GraduationCap,
  User,
  Mail,
  Globe,
  Target,
  Brain,
  Briefcase,
  Heart,
  DollarSign,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Download,
} from 'lucide-react';

interface StudentData {
  name: string;
  email: string;
  country: string;
  degreeLevel: string;
  hollandCode?: string;
  topValues?: string[];
  budgetRange?: string;
  topIntelligences?: string[];
  skillsProficiency?: string;
  executionGrit?: string;
}

interface UniversityMatch {
  id: string;
  universityId: string;
  universityName: string;
  universityLogo?: string;
  universityCountry: string;
  programId?: string;
  programName?: string;
  matchScore: number;
}

interface ConsentFlowModalProps {
  university: UniversityMatch;
  studentData: StudentData;
  onClose: () => void;
  onConsent: (consentLevel: string, selectedItems: string[]) => Promise<void>;
}

type ConsentLevel = 'BASIC' | 'ENHANCED' | 'FULL';
type Step = 'level' | 'preview' | 'confirm';

interface DataItem {
  id: string;
  label: string;
  value: string;
  category: 'identity' | 'academic' | 'interests' | 'financial' | 'assessment';
  level: ConsentLevel;
  required: boolean;
  icon: React.ElementType;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  identity: { label: 'Identity', color: 'bg-blue-100 text-blue-700' },
  academic: { label: 'Academic', color: 'bg-purple-100 text-purple-700' },
  interests: { label: 'Interests', color: 'bg-amber-100 text-amber-700' },
  financial: { label: 'Financial', color: 'bg-green-100 text-green-700' },
  assessment: { label: 'Assessment', color: 'bg-pink-100 text-pink-700' },
};

const consentLevelConfig: Record<
  ConsentLevel,
  { label: string; description: string; color: string; bgColor: string; items: string[] }
> = {
  BASIC: {
    label: 'Basic Profile',
    description: 'Essential info for initial contact',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    items: ['name', 'email', 'country', 'degreeLevel', 'matchScore'],
  },
  ENHANCED: {
    label: 'Enhanced Profile',
    description: 'Better matching & personalized outreach',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    items: ['name', 'email', 'country', 'degreeLevel', 'matchScore', 'hollandCode', 'topValues', 'budgetRange', 'academicStatus'],
  },
  FULL: {
    label: 'Full Profile',
    description: 'Comprehensive data for tailored opportunities',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    items: ['name', 'email', 'country', 'degreeLevel', 'matchScore', 'hollandCode', 'topValues', 'budgetRange', 'academicStatus', 'topIntelligences', 'skillsProficiency', 'executionGrit'],
  },
};

export default function ConsentFlowModal({
  university,
  studentData,
  onClose,
  onConsent,
}: ConsentFlowModalProps) {
  const [step, setStep] = useState<Step>('level');
  const [consentLevel, setConsentLevel] = useState<ConsentLevel>('ENHANCED');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Build data items based on student data
  const allDataItems: DataItem[] = useMemo(() => {
    const items: DataItem[] = [
      // Basic items (always required)
      { id: 'name', label: 'Full Name', value: studentData.name, category: 'identity', level: 'BASIC', required: true, icon: User },
      { id: 'email', label: 'Email Address', value: studentData.email, category: 'identity', level: 'BASIC', required: true, icon: Mail },
      { id: 'country', label: 'Country', value: studentData.country, category: 'identity', level: 'BASIC', required: true, icon: Globe },
      { id: 'degreeLevel', label: 'Degree Level', value: studentData.degreeLevel, category: 'academic', level: 'BASIC', required: true, icon: GraduationCap },
      { id: 'matchScore', label: 'Match Score', value: `${university.matchScore}%`, category: 'assessment', level: 'BASIC', required: true, icon: Target },

      // Enhanced items
      { id: 'hollandCode', label: 'Career Interests (Holland Code)', value: studentData.hollandCode || 'Not assessed', category: 'interests', level: 'ENHANCED', required: false, icon: Briefcase },
      { id: 'topValues', label: 'Top 3 Values', value: studentData.topValues?.join(', ') || 'Not assessed', category: 'interests', level: 'ENHANCED', required: false, icon: Heart },
      { id: 'budgetRange', label: 'Budget Range', value: studentData.budgetRange || 'Not specified', category: 'financial', level: 'ENHANCED', required: false, icon: DollarSign },
      { id: 'academicStatus', label: 'Academic Status', value: 'Qualified', category: 'academic', level: 'ENHANCED', required: false, icon: GraduationCap },

      // Full items
      { id: 'topIntelligences', label: 'Top Intelligences', value: studentData.topIntelligences?.join(', ') || 'Not assessed', category: 'assessment', level: 'FULL', required: false, icon: Brain },
      { id: 'skillsProficiency', label: '21st Century Skills', value: studentData.skillsProficiency || 'Not assessed', category: 'assessment', level: 'FULL', required: false, icon: Sparkles },
      { id: 'executionGrit', label: 'Execution & Grit', value: studentData.executionGrit || 'Not assessed', category: 'assessment', level: 'FULL', required: false, icon: Target },
    ];
    return items;
  }, [studentData, university.matchScore]);

  // Get items for current consent level
  const levelItems = useMemo(() => {
    const config = consentLevelConfig[consentLevel];
    return allDataItems.filter((item) => config.items.includes(item.id));
  }, [consentLevel, allDataItems]);

  // Initialize selected items when consent level changes
  const initializeSelection = (level: ConsentLevel) => {
    const config = consentLevelConfig[level];
    const newSelection = new Set(config.items);
    setSelectedItems(newSelection);
    setConsentLevel(level);
  };

  // Toggle item selection (only non-required items)
  const toggleItem = (itemId: string) => {
    const item = allDataItems.find((i) => i.id === itemId);
    if (item?.required) return; // Can't toggle required items

    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Protected data (never shared)
  const protectedData = [
    'Raw assessment responses',
    'Stress response details',
    'Detailed personality scores',
    'Cognitive style analysis',
    'Areas for development',
    'Negative feedback or concerns',
  ];

  // Handle final consent
  const handleConsent = async () => {
    setSubmitting(true);
    try {
      await onConsent(consentLevel, Array.from(selectedItems));
    } catch (error) {
      console.error('Consent error:', error);
    }
    setSubmitting(false);
  };

  // Download data summary
  const downloadDataSummary = () => {
    const selectedDataItems = levelItems.filter((item) => selectedItems.has(item.id));
    const summary = {
      university: university.universityName,
      consentLevel,
      dataToShare: selectedDataItems.map((item) => ({
        field: item.label,
        value: item.value,
        category: item.category,
      })),
      protectedData,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent-preview-${university.universityName.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Privacy-First Connection</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {university.universityLogo ? (
              <img
                src={university.universityLogo}
                alt={university.universityName}
                className="w-14 h-14 rounded-xl object-cover bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                {university.universityName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold">{university.universityName}</h2>
              <p className="text-blue-100 text-sm">
                {university.universityCountry}
                {university.programName && ` • ${university.programName}`}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 px-4">
            {(['level', 'preview', 'confirm'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step === s
                      ? 'bg-white text-blue-600'
                      : idx < ['level', 'preview', 'confirm'].indexOf(step)
                        ? 'bg-green-400 text-white'
                        : 'bg-white/30 text-white'
                  }`}
                >
                  {idx < ['level', 'preview', 'confirm'].indexOf(step) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                {idx < 2 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      idx < ['level', 'preview', 'confirm'].indexOf(step) ? 'bg-green-400' : 'bg-white/30'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-blue-100">
            <span>Choose Level</span>
            <span>Review Data</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {/* Step 1: Choose Consent Level */}
            {step === 'level' && (
              <motion.div
                key="level"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    How much would you like to share?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    More data helps universities personalize their outreach to you.
                  </p>
                </div>

                {(Object.entries(consentLevelConfig) as [ConsentLevel, typeof consentLevelConfig.BASIC][]).map(
                  ([level, config]) => (
                    <button
                      key={level}
                      onClick={() => initializeSelection(level)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        consentLevel === level
                          ? `${config.bgColor} border-current ${config.color}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-semibold ${consentLevel === level ? config.color : 'text-gray-900'}`}>
                            {config.label}
                          </div>
                          <div className="text-sm text-gray-600">{config.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {config.items.length} data points
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            consentLevel === level ? 'border-current bg-current' : 'border-gray-300'
                          }`}
                        >
                          {consentLevel === level && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  )
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Recommended:</strong> Enhanced Profile gives universities enough context to
                    personalize their communication while keeping sensitive assessment details private.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preview Data */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Review Your Data</h3>
                    <p className="text-gray-600 text-sm">Toggle off any items you prefer not to share</p>
                  </div>
                  <button
                    onClick={downloadDataSummary}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {/* Data Items */}
                <div className="space-y-2">
                  {levelItems.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    const Icon = item.icon;
                    const catConfig = categoryLabels[item.category];

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        } ${item.required ? 'opacity-100' : 'cursor-pointer hover:border-gray-300'}`}
                        onClick={() => !item.required && toggleItem(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{item.label}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.color}`}>
                                  {catConfig.label}
                                </span>
                                {item.required && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{item.value}</div>
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Protected Data Section */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <EyeOff className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Protected Information (NEVER shared)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {protectedData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-700">
                        <Lock className="w-3 h-3" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Connect</h3>
                  <p className="text-gray-600 text-sm">
                    Review the summary below before confirming.
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">University</span>
                    <span className="font-semibold text-gray-900">{university.universityName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Consent Level</span>
                    <span className={`font-semibold ${consentLevelConfig[consentLevel].color}`}>
                      {consentLevelConfig[consentLevel].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Data Points</span>
                    <span className="font-semibold text-gray-900">{selectedItems.size} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Match Score</span>
                    <span className="font-semibold text-green-600">{university.matchScore}%</span>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-semibold text-blue-800 mb-2">What happens next:</div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {university.universityName} will receive your profile</li>
                    <li>• Their admissions team will reach out within 5-7 days</li>
                    <li>• You'll receive a copy in your Privacy & Data dashboard</li>
                    <li>• You can withdraw consent anytime</li>
                  </ul>
                </div>

                {/* Legal Agreement */}
                <div className="text-xs text-gray-500 text-center">
                  By clicking "Share & Connect", you agree to share the selected information with{' '}
                  {university.universityName} and consent to being contacted about admission opportunities.
                  View our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-3">
            {step !== 'level' && (
              <button
                onClick={() => setStep(step === 'confirm' ? 'preview' : 'level')}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {step === 'level' && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              onClick={() => {
                if (step === 'level') {
                  initializeSelection(consentLevel);
                  setStep('preview');
                } else if (step === 'preview') {
                  setStep('confirm');
                } else {
                  handleConsent();
                }
              }}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {step === 'confirm' ? (
                submitting ? (
                  'Connecting...'
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Share & Connect
                  </>
                )
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
