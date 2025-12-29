// /app/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Clock,
  Star,
  Sparkles,
  ChevronDown,
  Globe,
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  Shield,
  Zap,
  Award,
  BarChart3,
  FileText,
  Heart,
  Gift,
  Share2,
  Trophy,
  CreditCard,
  Calculator,
} from 'lucide-react';
import {
  getAllPricingTiers,
  getDiscountPercentage,
  getAllFamilyPacks,
  calculateFamilySavings,
  getAllSchoolSubscriptions,
  calculateSchoolSubscriptionPrice,
  REFERRAL_CONFIG,
  getReferralTier,
  type PricingTier,
  type FamilyPackTier,
  type SchoolSubscriptionTier,
  type BillingCycle,
} from '@/lib/constants/pricing';
import {
  getAllCurrencies,
  getCurrencyByCode,
  formatPriceWithConversion,
  getPopularCurrencies,
  type CurrencyOption,
} from '@/lib/constants/currencies';

export default function PricingPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'individual' | 'family' | 'school'>('individual');
  const [schoolBillingCycle, setSchoolBillingCycle] = useState<BillingCycle>('annual');
  const [studentCount, setStudentCount] = useState<number>(50);

  const pricingTiers = getAllPricingTiers();
  const familyPacks = getAllFamilyPacks();
  const schoolSubscriptions = getAllSchoolSubscriptions();
  const currencies = getAllCurrencies();
  const popularCurrencies = getPopularCurrencies();
  const currentCurrency = getCurrencyByCode(selectedCurrency);

  // Detect user's currency based on timezone/locale
  useEffect(() => {
    // Simple detection - in production, use a proper geo-IP service
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;

    // Map common timezones/locales to currencies
    if (timezone.includes('Asia/Kolkata') || locale.includes('IN')) {
      setSelectedCurrency('INR');
    } else if (timezone.includes('Asia/Phnom_Penh') || locale.includes('KH')) {
      setSelectedCurrency('KHR');
    } else if (timezone.includes('Asia/Bangkok') || locale.includes('TH')) {
      setSelectedCurrency('THB');
    } else if (timezone.includes('Asia/Singapore') || locale.includes('SG')) {
      setSelectedCurrency('SGD');
    } else if (timezone.includes('Asia/Kuala_Lumpur') || locale.includes('MY')) {
      setSelectedCurrency('MYR');
    }
    // Default remains USD
  }, []);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.status !== 'active') return;

    if (tier.id === 'pilot') {
      router.push('/auth/register?type=pilot');
    } else {
      router.push(`/checkout?plan=${tier.id}&currency=${selectedCurrency}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Jeru Vantage</span>
            </Link>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg
                           hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{currentCurrency?.flag}</span>
                <span className="text-sm font-medium">{selectedCurrency}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCurrencyDropdown && (
                <CurrencyDropdown
                  currencies={currencies}
                  popularCurrencies={popularCurrencies}
                  selectedCurrency={selectedCurrency}
                  onSelect={(code) => {
                    setSelectedCurrency(code);
                    setShowCurrencyDropdown(false);
                  }}
                  onClose={() => setShowCurrencyDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30
                          rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Find Your Ikigai
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {' '}Career Path
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-powered psychometric assessment to help you find the university and career that truly fits who you are.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <button
              onClick={() => setBillingCycle('individual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                         ${billingCycle === 'individual'
                           ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                         }`}
            >
              <GraduationCap className="w-4 h-4" />
              Individual
            </button>
            <button
              onClick={() => setBillingCycle('family')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                         ${billingCycle === 'family'
                           ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                         }`}
            >
              <Users className="w-4 h-4" />
              Family
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Save 33%</span>
            </button>
            <button
              onClick={() => setBillingCycle('school')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                         ${billingCycle === 'school'
                           ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                         }`}
            >
              <Building2 className="w-4 h-4" />
              Schools
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Soon</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      {billingCycle === 'individual' ? (
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  currencyCode={selectedCurrency}
                  onSelect={() => handleSelectPlan(tier)}
                  isCenter={index === 1}
                />
              ))}
            </div>
          </div>
        </section>
      ) : billingCycle === 'family' ? (
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Family Pack Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30
                              rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Save up to 33% with Family Packs
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Have multiple children? Get the Full Assessment for your entire family at a discounted rate.
                Each child gets their own personalized Jeru Report.
              </p>
            </div>

            {/* Family Pack Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {familyPacks.map((pack) => (
                <FamilyPackCard
                  key={pack.id}
                  pack={pack}
                  currencyCode={selectedCurrency}
                />
              ))}
            </div>

            {/* Family Benefits */}
            <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20
                            rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Family Pack Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Family Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage all children's assessments from one parent account
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Comparison View</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See how your children's strengths and interests differ
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Parent Summary</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get a consolidated report highlighting key insights for each child
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* School Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30
                              rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                Volume Pricing for Institutions
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Empower your students with career guidance at scale.
                Get dedicated support, custom branding, and powerful analytics.
              </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {(['monthly', 'quarterly', 'annual'] as BillingCycle[]).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setSchoolBillingCycle(cycle)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors
                               ${schoolBillingCycle === cycle
                                 ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                               }`}
                  >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                    {cycle === 'annual' && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        -20%
                      </span>
                    )}
                    {cycle === 'quarterly' && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                        -10%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Count Calculator */}
            <div className="max-w-md mx-auto mb-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-indigo-500" />
                <span className="font-semibold text-gray-900 dark:text-white">Calculate Your Price</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900
                               border border-gray-200 dark:border-gray-700
                               text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                {(() => {
                  const calc = calculateSchoolSubscriptionPrice(studentCount, schoolBillingCycle);
                  if (!calc) return null;
                  const priceDisplay = formatPriceWithConversion(calc.cycleTotal, selectedCurrency);
                  const savingsDisplay = formatPriceWithConversion(calc.cycleSavings, selectedCurrency);
                  const perStudentDisplay = formatPriceWithConversion(calc.pricePerStudent, selectedCurrency);

                  return (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tier:</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{calc.tier?.name}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Per student/month:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{perStudentDisplay.local}</span>
                      </div>
                      <div className="border-t border-indigo-200 dark:border-indigo-800 my-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {schoolBillingCycle === 'annual' ? 'Annual' : schoolBillingCycle === 'quarterly' ? 'Quarterly' : 'Monthly'} Total:
                          </span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">{priceDisplay.local}</span>
                        </div>
                        {calc.cycleSavings > 0 && (
                          <div className="flex justify-end mt-1">
                            <span className="text-sm text-green-600 dark:text-green-400">
                              You save {savingsDisplay.local}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* School Tier Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {schoolSubscriptions.map((tier, index) => (
                <SchoolSubscriptionCard
                  key={tier.id}
                  tier={tier}
                  billingCycle={schoolBillingCycle}
                  currencyCode={selectedCurrency}
                  isCenter={index === 1}
                />
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
              <Clock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">School Subscriptions Coming Q1 2025</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-lg mx-auto">
                Be among the first schools to offer AI-powered career guidance to your students.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors">
                <Building2 className="w-5 h-5" />
                Join School Waitlist
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Referral Program Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50
                            rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              Referral Program
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Share & Earn Rewards
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Know students or schools who could benefit from Jeru Vantage?
              Share your referral code and earn credits for every successful signup.
            </p>
          </div>

          {/* Referral Stats */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* For New Users */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">For New Users</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When you use a referral code</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {REFERRAL_CONFIG.newUserDiscountPercent}% OFF
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Get an instant discount on your first Full Assessment or Family Pack purchase.
              </p>
            </div>

            {/* For Referrers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">For Referrers</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When someone uses your code</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                ${REFERRAL_CONFIG.referrerRewardValue} Credit
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Earn credits for each successful referral. Use them for future assessments or Premium upgrades.
              </p>
            </div>
          </div>

          {/* Referral Tiers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Referral Tiers</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The more you refer, the more you earn. Unlock higher reward tiers and exclusive perks!
            </p>

            <div className="grid md:grid-cols-4 gap-4">
              {REFERRAL_CONFIG.tierBonuses.map((tier) => (
                <div
                  key={tier.tier}
                  className={`p-4 rounded-xl border-2 transition-all
                             ${tier.tier === 'platinum'
                               ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                               : tier.tier === 'gold'
                               ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                               : tier.tier === 'silver'
                               ? 'border-gray-400 bg-gray-50 dark:bg-gray-700/50'
                               : 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                             }`}
                >
                  <div className="text-2xl mb-2">{tier.badge.split(' ')[0]}</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tier.tier.charAt(0).toUpperCase() + tier.tier.slice(1)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {tier.referralsRequired}+ referrals
                  </div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ${REFERRAL_CONFIG.referrerRewardValue * tier.bonusMultiplier}/referral
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ({tier.bonusMultiplier}x multiplier)
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                <Share2 className="w-5 h-5" />
                Get Your Referral Code
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your data is encrypted and never shared. We take privacy seriously.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Advanced algorithms analyze your responses for accurate matching.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert-Designed</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Based on proven frameworks: Big 5, Holland Code, Multiple Intelligences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="What is the Pilot Assessment?"
              answer="The Pilot Assessment is a free, shorter version of our full assessment with 153 questions. It gives you a taste of the Jeru Vantage experience and basic career recommendations. Perfect for trying before you commit to the full assessment."
            />
            <FAQItem
              question="How long does the assessment take?"
              answer="The Pilot Assessment takes about 25-35 minutes. The Full Assessment takes 60-90 minutes. We recommend finding a quiet time to complete it in one sitting for the most accurate results."
            />
            <FAQItem
              question="Can I pause and resume later?"
              answer="Yes! Your progress is automatically saved. You can close the browser and return later to continue exactly where you left off."
            />
            <FAQItem
              question="What's included in the Jeru Report?"
              answer="Your Jeru Report includes your personality profile, core values, interest mapping, cognitive style analysis, and personalized career recommendations based on the Ikigai framework."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Absolutely. We use industry-standard encryption and never share your personal data with third parties. Your assessment results are yours alone."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Your Path?
          </h2>
          <p className="text-indigo-100 mb-8">
            Start with our free Pilot Assessment and see what Jeru Vantage can reveal about your future.
          </p>
          <Link
            href="/auth/register?type=pilot"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl
                       font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 Jeru Vantage. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ========== PRICING CARD COMPONENT ==========

interface PricingCardProps {
  tier: PricingTier;
  currencyCode: string;
  onSelect: () => void;
  isCenter?: boolean;
}

function PricingCard({ tier, currencyCode, onSelect, isCenter = false }: PricingCardProps) {
  const discount = getDiscountPercentage(tier);
  const priceDisplay = tier.priceUSD === 0
    ? { local: 'Free', usd: 'Free', converted: 0 }
    : formatPriceWithConversion(tier.priceUSD, currencyCode);

  const originalPriceDisplay = tier.originalPriceUSD
    ? formatPriceWithConversion(tier.originalPriceUSD, currencyCode)
    : null;

  const isAvailable = tier.status === 'active';
  const isComingSoon = tier.status === 'coming_soon';

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all
                  ${isCenter
                    ? 'border-indigo-500 dark:border-indigo-400 shadow-xl shadow-indigo-500/10 scale-105 z-10'
                    : 'border-gray-200 dark:border-gray-700'
                  }
                  ${!isAvailable ? 'opacity-75' : ''}
                  bg-white dark:bg-gray-800`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-sm font-medium
                        ${tier.badgeColor || 'bg-indigo-500'}`}>
          {tier.badge}
        </div>
      )}

      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30
                        text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
          <Clock className="w-3 h-3" />
          {tier.statusMessage || 'Coming Soon'}
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {priceDisplay.local}
            </span>
            {tier.priceUSD > 0 && currencyCode !== 'USD' && (
              <span className="text-sm text-gray-500">≈ {priceDisplay.usd}</span>
            )}
          </div>
          {originalPriceDisplay && discount && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-400 line-through">{originalPriceDisplay.local}</span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                Save {discount}%
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onSelect}
          disabled={!isAvailable}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors mb-6
                     ${tier.ctaVariant === 'primary'
                       ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700'
                       : tier.ctaVariant === 'secondary'
                       ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                       : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                     }
                     ${!isAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {isComingSoon ? 'Notify Me' : tier.ctaText}
        </button>

        {/* Features List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            What's included
          </div>
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              {feature.included ? (
                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-indigo-500' : 'text-green-500'}`} />
              ) : (
                <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
              )}
              <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} ${feature.highlight ? 'font-medium' : ''}`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{tier.questionsCount} questions</span>
            <span>{tier.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== CURRENCY DROPDOWN ==========

interface CurrencyDropdownProps {
  currencies: CurrencyOption[];
  popularCurrencies: CurrencyOption[];
  selectedCurrency: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

function CurrencyDropdown({
  currencies,
  popularCurrencies,
  selectedCurrency,
  onSelect,
  onClose,
}: CurrencyDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                      rounded-xl shadow-xl z-50 overflow-hidden">
        {/* Popular Currencies */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">Popular</div>
          {popularCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => onSelect(currency.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                         ${selectedCurrency === currency.code
                           ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                           : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                         }`}
            >
              <span className="text-lg">{currency.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{currency.code}</div>
                <div className="text-xs text-gray-500">{currency.name}</div>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          ))}
        </div>

        {/* All Currencies (scrollable) */}
        <div className="p-2 max-h-48 overflow-y-auto">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">All Currencies</div>
          {currencies
            .filter((c) => !popularCurrencies.find((p) => p.code === c.code))
            .map((currency) => (
              <button
                key={currency.code}
                onClick={() => onSelect(currency.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                           ${selectedCurrency === currency.code
                             ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                             : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                           }`}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{currency.code}</div>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

// ========== FAQ ITEM ==========

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
}

// ========== FAMILY PACK CARD COMPONENT ==========

interface FamilyPackCardProps {
  pack: FamilyPackTier;
  currencyCode: string;
}

function FamilyPackCard({ pack, currencyCode }: FamilyPackCardProps) {
  const priceDisplay = formatPriceWithConversion(pack.priceUSD, currencyCode);
  const originalPriceDisplay = formatPriceWithConversion(pack.originalPriceUSD, currencyCode);
  const perChildDisplay = formatPriceWithConversion(pack.pricePerChildUSD, currencyCode);

  const isComingSoon = pack.status === 'coming_soon';

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all
                    ${pack.badge
                      ? 'border-indigo-500 dark:border-indigo-400 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}>
      {/* Badge */}
      {pack.badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-medium
                        ${pack.badgeColor || 'bg-indigo-500'}`}>
          {pack.badge}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {pack.childrenLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{pack.name}</h3>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {priceDisplay.local}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-sm text-gray-400 line-through">{originalPriceDisplay.local}</span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              Save {pack.savingsPercent}%
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {perChildDisplay.local} per child
          </div>
        </div>

        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div className="flex items-center justify-center gap-1.5 mb-4 text-amber-600 dark:text-amber-400 text-sm">
            <Clock className="w-4 h-4" />
            {pack.statusMessage || 'Coming Soon'}
          </div>
        )}

        {/* CTA Button */}
        <button
          disabled={isComingSoon}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors mb-4
                     ${isComingSoon
                       ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                       : 'bg-indigo-600 text-white hover:bg-indigo-700'
                     }`}
        >
          {isComingSoon ? 'Notify Me' : 'Get Family Pack'}
        </button>

        {/* Features */}
        <div className="space-y-2">
          {pack.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
          {pack.bonusFeatures?.map((feature, index) => (
            <div key={`bonus-${index}`} className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== SCHOOL SUBSCRIPTION CARD COMPONENT ==========

interface SchoolSubscriptionCardProps {
  tier: SchoolSubscriptionTier;
  billingCycle: BillingCycle;
  currencyCode: string;
  isCenter?: boolean;
}

function SchoolSubscriptionCard({ tier, billingCycle, currencyCode, isCenter = false }: SchoolSubscriptionCardProps) {
  const billingOption = tier.billingOptions.find(opt => opt.cycle === billingCycle);
  if (!billingOption) return null;

  const priceDisplay = formatPriceWithConversion(billingOption.pricePerStudentUSD, currencyCode);
  const monthlyPriceDisplay = formatPriceWithConversion(tier.monthlyPricePerStudentUSD, currencyCode);

  const isComingSoon = tier.status === 'coming_soon';
  const hasDiscount = billingOption.discountPercent > 0;

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all
                    ${isCenter
                      ? 'border-indigo-500 dark:border-indigo-400 shadow-xl scale-105 z-10'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}>
      {/* Badge */}
      {billingOption.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
          {billingOption.badge}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
        </div>

        {/* Student Range */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Users className="w-4 h-4" />
          {tier.studentsMax
            ? `${tier.studentsMin}-${tier.studentsMax} students`
            : `${tier.studentsMin}+ students`
          }
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {priceDisplay.local}
            </span>
            <span className="text-gray-500 dark:text-gray-400">/student/mo</span>
          </div>
          {hasDiscount && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-400 line-through">{monthlyPriceDisplay.local}</span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                Save {billingOption.discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Coming Soon Notice */}
        {isComingSoon && (
          <div className="flex items-center justify-center gap-1.5 mb-4 py-2 px-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400 text-sm">
            <Clock className="w-4 h-4" />
            {tier.statusMessage || 'Coming Soon'}
          </div>
        )}

        {/* CTA Button */}
        <button
          disabled={isComingSoon}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors mb-6
                     ${isComingSoon
                       ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                       : 'bg-indigo-600 text-white hover:bg-indigo-700'
                     }`}
        >
          {isComingSoon ? 'Join Waitlist' : 'Contact Sales'}
        </button>

        {/* Features */}
        <div className="space-y-2">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
        </div>

        {/* Support Level */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Support:</span>
            <span className={`font-medium ${
              tier.supportLevel === 'dedicated'
                ? 'text-purple-600 dark:text-purple-400'
                : tier.supportLevel === 'priority'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {tier.supportLevel.charAt(0).toUpperCase() + tier.supportLevel.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
