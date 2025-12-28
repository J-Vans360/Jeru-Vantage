'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Clock,
  Lock,
  Sparkles,
  ArrowRight,
  Globe,
  ChevronDown,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import {
  DEFAULT_ASSESSMENTS,
  DEFAULT_ADDONS,
  formatPrice,
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  type PricingItem,
  type PricingStatus,
} from '@/lib/constants/pricing';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currency, setCurrency] = useState('USD');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const getStatusBadge = (status: PricingStatus) => {
    switch (status) {
      case 'active':
        return null;
      case 'coming_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        );
      case 'not_available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            <Lock className="w-3 h-3" />
            Not Available
          </span>
        );
    }
  };

  const handleSelectAssessment = (item: PricingItem) => {
    if (item.status !== 'active') return;

    if (item.id === 'pilot') {
      // Redirect to signup with code flow
      router.push('/signup?type=student-with-code');
    } else {
      // For paid assessments
      if (session) {
        // Already logged in, go to checkout
        router.push(`/checkout?assessment=${item.id}&addons=${selectedAddons.join(',')}`);
      } else {
        // Not logged in, go to signup first
        router.push(`/signup?assessment=${item.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Jeru Vantage</span>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your ideal career path with our science-backed assessments
          </p>

          {/* Currency Selector */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
              >
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{CURRENCY_SYMBOLS[currency]} {currency}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCurrencyDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCurrencyDropdown(false)}
                  />
                  <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                          currency === curr ? 'bg-orange-50 text-orange-600' : ''
                        }`}
                      >
                        <span>{CURRENCY_SYMBOLS[curr]} {curr}</span>
                        <span className="text-xs text-gray-500">{CURRENCY_NAMES[curr]}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {DEFAULT_ASSESSMENTS.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                item.isPopular
                  ? 'border-orange-500 shadow-lg'
                  : 'border-gray-200'
              } ${item.status !== 'active' ? 'opacity-75' : ''}`}
            >
              {item.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4 min-h-[24px]">
                {getStatusBadge(item.status)}
                {item.badge && item.status === 'active' && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="mb-6">
                {item.basePrice === 0 ? (
                  <span className="text-3xl font-bold text-green-600">FREE</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(item.basePrice, currency)}
                    </span>
                    {currency !== 'USD' && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({formatPrice(item.basePrice, 'USD')} USD)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectAssessment(item)}
                disabled={item.status !== 'active'}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  item.status === 'active'
                    ? item.isPopular
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.status === 'active' ? (
                  <>
                    {item.basePrice === 0 ? 'Enter Invite Code' : 'Get Started'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : item.status === 'coming_soon' ? (
                  'Coming Soon'
                ) : (
                  'Not Available'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add-ons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {DEFAULT_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                  addon.status === 'active'
                    ? 'border-gray-200 hover:border-orange-300 cursor-pointer'
                    : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    disabled={addon.status !== 'active'}
                    checked={selectedAddons.includes(addon.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAddons([...selectedAddons, addon.id]);
                      } else {
                        setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{addon.name}</h3>
                    <p className="text-sm text-gray-500">{addon.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(addon.status)}
                  {addon.status === 'active' && (
                    <span className="font-semibold text-gray-900">
                      +{formatPrice(addon.price, currency)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-orange-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Not sure which assessment to choose?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have an invite code from your school or sponsor, start with the Pilot Assessment.
              Otherwise, the Full Assessment provides the most comprehensive career guidance.
            </p>
            <Link
              href="/signup?type=student-with-code"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
            >
              I have an invite code
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
