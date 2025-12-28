'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Eye,
  Clock,
  Lock,
  Save,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  DEFAULT_ASSESSMENTS,
  DEFAULT_ADDONS,
  formatPrice,
  getAvailableCurrencies,
  type PricingStatus,
} from '@/lib/constants/pricing';

type EditableAssessment = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  status: PricingStatus;
};

type EditableAddon = {
  id: string;
  name: string;
  description: string;
  price: number;
  status: PricingStatus;
};

export default function PricingManagementPage() {
  const [assessments, setAssessments] = useState<EditableAssessment[]>(
    DEFAULT_ASSESSMENTS.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      basePrice: a.basePrice,
      status: a.status,
    }))
  );

  const [addons, setAddons] = useState<EditableAddon[]>(
    DEFAULT_ADDONS.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      price: a.price,
      status: a.status,
    }))
  );

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const statusOptions: { value: PricingStatus; label: string; icon: React.ElementType }[] = [
    { value: 'active', label: 'Active', icon: Eye },
    { value: 'coming_soon', label: 'Coming Soon', icon: Clock },
    { value: 'not_available', label: 'Not Available', icon: Lock },
  ];

  const handleAssessmentChange = (id: string, field: keyof EditableAssessment, value: string | number) => {
    setAssessments(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleAddonChange = (id: string, field: keyof EditableAddon, value: string | number) => {
    setAddons(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, this would save to the database
    // For now, we'll just simulate a save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setSaving(false);
  };

  const handleReset = () => {
    setAssessments(
      DEFAULT_ASSESSMENTS.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        basePrice: a.basePrice,
        status: a.status,
      }))
    );
    setAddons(
      DEFAULT_ADDONS.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        price: a.price,
        status: a.status,
      }))
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600 mt-1">Manage assessment pricing and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </Link>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {lastSaved && (
        <div className="mb-6 text-sm text-green-600">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      {/* Assessments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Assessments</h2>
        </div>

        <div className="space-y-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Name & ID */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Assessment
                  </label>
                  <input
                    type="text"
                    value={assessment.name}
                    onChange={(e) => handleAssessmentChange(assessment.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  />
                  <span className="text-xs text-gray-400 mt-1">ID: {assessment.id}</span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={assessment.description}
                    onChange={(e) => handleAssessmentChange(assessment.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Price (USD cents)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={assessment.basePrice}
                      onChange={(e) => handleAssessmentChange(assessment.id, 'basePrice', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                      min="0"
                      step="100"
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    = {formatPrice(assessment.basePrice, 'USD')}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={assessment.status}
                    onChange={(e) => handleAssessmentChange(assessment.id, 'status', e.target.value as PricingStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Preview in Different Currencies */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Price in other currencies:</p>
                <div className="flex flex-wrap gap-2">
                  {getAvailableCurrencies().slice(0, 6).map((curr) => (
                    <span
                      key={curr.code}
                      className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                    >
                      {curr.flag} {curr.code}: {formatPrice(assessment.basePrice, curr.code)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Add-ons</h2>
        </div>

        <div className="space-y-4">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Name & ID */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Add-on
                  </label>
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => handleAddonChange(addon.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  />
                  <span className="text-xs text-gray-400 mt-1">ID: {addon.id}</span>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={addon.description}
                    onChange={(e) => handleAddonChange(addon.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Price (USD cents)
                  </label>
                  <input
                    type="number"
                    value={addon.price}
                    onChange={(e) => handleAddonChange(addon.id, 'price', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                    min="0"
                    step="100"
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    = {formatPrice(addon.price, 'USD')}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={addon.status}
                    onChange={(e) => handleAddonChange(addon.id, 'status', e.target.value as PricingStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-1">Note</h3>
        <p className="text-sm text-blue-700">
          Changes to pricing will be reflected immediately on the public pricing page.
          Currency conversion rates are updated periodically and may not reflect real-time exchange rates.
        </p>
      </div>
    </div>
  );
}
