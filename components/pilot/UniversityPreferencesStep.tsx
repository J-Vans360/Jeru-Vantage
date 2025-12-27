'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Star,
  Target,
  Shield,
  Plus,
  X,
  Globe,
  ChevronRight,
  Info,
} from 'lucide-react';

interface UniversityPreference {
  id: string;
  universityName: string;
  country: string;
  category: 'DREAM' | 'GOOD_FIT' | 'BACKUP';
  consentToConnect: boolean;
}

interface UniversityPreferencesStepProps {
  onComplete: (preferences: UniversityPreference[]) => void;
  onSkip: () => void;
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

export default function UniversityPreferencesStep({
  onComplete,
  onSkip,
}: UniversityPreferencesStepProps) {
  const [preferences, setPreferences] = useState<UniversityPreference[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPreference, setNewPreference] = useState({
    universityName: '',
    country: '',
    category: 'GOOD_FIT' as 'DREAM' | 'GOOD_FIT' | 'BACKUP',
  });
  const [globalConsent, setGlobalConsent] = useState(true);

  const addPreference = () => {
    if (newPreference.universityName && newPreference.country) {
      setPreferences([
        ...preferences,
        {
          id: Date.now().toString(),
          ...newPreference,
          consentToConnect: globalConsent,
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

  const handleComplete = () => {
    // Update consent for all preferences
    const updatedPreferences = preferences.map((p) => ({
      ...p,
      consentToConnect: globalConsent,
    }));
    onComplete(updatedPreferences);
  };

  const groupedPreferences = {
    DREAM: preferences.filter((p) => p.category === 'DREAM'),
    GOOD_FIT: preferences.filter((p) => p.category === 'GOOD_FIT'),
    BACKUP: preferences.filter((p) => p.category === 'BACKUP'),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your University Preferences
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Tell us about universities you&apos;re interested in. This helps us connect you
          with institutions that match your goals.
        </p>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Why share this?</strong> When we partner with universities you&apos;re
              interested in, we can help facilitate connections. You control whether they
              can reach out to you.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Sections */}
      <div className="space-y-6 mb-8">
        {(['DREAM', 'GOOD_FIT', 'BACKUP'] as const).map((category) => {
          const info = CATEGORY_INFO[category];
          const Icon = info.icon;
          const categoryPrefs = groupedPreferences[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl overflow-hidden ${info.borderColor}`}
            >
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
                  <p className="text-sm text-gray-400 text-center py-4">
                    No universities added yet
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add University Form */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Add University</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  value={newPreference.universityName}
                  onChange={(e) =>
                    setNewPreference({ ...newPreference, universityName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Harvard University"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={newPreference.country}
                  onChange={(e) =>
                    setNewPreference({ ...newPreference, country: e.target.value })
                  }
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['DREAM', 'GOOD_FIT', 'BACKUP'] as const).map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const Icon = info.icon;
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
                        <Icon className={`w-5 h-5 ${info.color}`} />
                        <span className="text-xs font-medium text-gray-700">
                          {info.label.split(' ')[0]}
                        </span>
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
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <Plus className="w-5 h-5" />
            Add University
          </motion.button>
        )}
      </AnimatePresence>

      {/* Consent Section */}
      {preferences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6"
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={globalConsent}
              onChange={(e) => setGlobalConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-900">
                Allow universities to contact me
              </span>
              <p className="text-sm text-gray-500 mt-1">
                When these universities partner with Jeru Vantage, we can share your
                assessment results and contact information to facilitate a connection.
              </p>
            </div>
          </label>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
        >
          Skip for now
        </button>
        <button
          onClick={handleComplete}
          disabled={preferences.length === 0}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Optional disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Your data is protected under our Privacy Policy. You can update preferences anytime.
      </p>
    </div>
  );
}
