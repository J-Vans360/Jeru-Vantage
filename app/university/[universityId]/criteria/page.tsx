'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Info } from 'lucide-react';

interface CriteriaPageProps {
  params: { universityId: string };
}

export default function CriteriaPage({ params }: CriteriaPageProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [criteria, setCriteria] = useState({
    // Academic
    minGPA: '',
    minSATScore: '',
    minIELTS: '',

    // Financial
    minBudget: '',
    maxBudget: '',

    // Geographic
    targetCountries: [] as string[],

    // Holland Codes
    targetHollandCodes: [] as string[],

    // Threshold
    minMatchScore: 85,
  });

  const hollandOptions = [
    { code: 'R', name: 'Realistic', description: 'Hands-on, practical' },
    { code: 'I', name: 'Investigative', description: 'Analytical, intellectual' },
    { code: 'A', name: 'Artistic', description: 'Creative, expressive' },
    { code: 'S', name: 'Social', description: 'Helping, teaching' },
    { code: 'E', name: 'Enterprising', description: 'Leading, persuading' },
    { code: 'C', name: 'Conventional', description: 'Organizing, detail-oriented' },
  ];

  const countryOptions = [
    'India',
    'China',
    'Vietnam',
    'Indonesia',
    'Malaysia',
    'Thailand',
    'Philippines',
    'South Korea',
    'Japan',
    'Singapore',
    'Cambodia',
    'Myanmar',
    'Bangladesh',
    'Pakistan',
    'Sri Lanka',
  ];

  const handleHollandToggle = (code: string) => {
    setCriteria((prev) => ({
      ...prev,
      targetHollandCodes: prev.targetHollandCodes.includes(code)
        ? prev.targetHollandCodes.filter((c) => c !== code)
        : [...prev.targetHollandCodes, code],
    }));
  };

  const handleCountryToggle = (country: string) => {
    setCriteria((prev) => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(country)
        ? prev.targetCountries.filter((c) => c !== country)
        : [...prev.targetCountries, country],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/university/${params.universityId}/criteria`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to save criteria:', error);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ideal Student Profile</h1>
        <p className="text-gray-600 mt-1">
          Define your target student criteria. We&apos;ll only show your university
          to students who match.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>How it works:</strong> Students who don&apos;t meet your minimum
          criteria won&apos;t see your university. This protects your brand and
          ensures you only receive qualified leads.
        </div>
      </div>

      {/* Academic Requirements */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📚 Academic Requirements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum GPA
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={criteria.minGPA}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, minGPA: e.target.value }))
              }
              placeholder="e.g., 3.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum SAT Score
            </label>
            <input
              type="number"
              min="400"
              max="1600"
              value={criteria.minSATScore}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, minSATScore: e.target.value }))
              }
              placeholder="e.g., 1200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum IELTS Score
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={criteria.minIELTS}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, minIELTS: e.target.value }))
              }
              placeholder="e.g., 6.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Financial Capacity */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Financial Capacity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Annual Budget (USD)
            </label>
            <input
              type="number"
              min="0"
              value={criteria.minBudget}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, minBudget: e.target.value }))
              }
              placeholder="e.g., 20000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Annual Budget (USD)
            </label>
            <input
              type="number"
              min="0"
              value={criteria.maxBudget}
              onChange={(e) =>
                setCriteria((prev) => ({ ...prev, maxBudget: e.target.value }))
              }
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Students with budgets below your minimum won&apos;t see your university.
        </p>
      </section>

      {/* Target Countries */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🌏 Target Countries
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the countries you want to recruit from. Leave empty to target all
          regions.
        </p>
        <div className="flex flex-wrap gap-2">
          {countryOptions.map((country) => (
            <button
              key={country}
              onClick={() => handleCountryToggle(country)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                criteria.targetCountries.includes(country)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </section>

      {/* Holland Code Preferences */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Career Interest Match (Holland Codes)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the personality types that best fit your programs. Students with
          matching interests will rank higher.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {hollandOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => handleHollandToggle(option.code)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                criteria.targetHollandCodes.includes(option.code)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">
                {option.code} - {option.name}
              </div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Match Threshold */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ⚙️ Match Threshold
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Match Score: {criteria.minMatchScore}%
          </label>
          <input
            type="range"
            min="70"
            max="95"
            value={criteria.minMatchScore}
            onChange={(e) =>
              setCriteria((prev) => ({
                ...prev,
                minMatchScore: Number(e.target.value),
              }))
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>70% (More leads)</span>
            <span>95% (Higher quality)</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Students below this match score won&apos;t see your university. Higher
          threshold = fewer but better-fit leads.
        </p>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Criteria'}
        </button>
      </div>
    </div>
  );
}
