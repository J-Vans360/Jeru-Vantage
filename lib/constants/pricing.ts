// /lib/constants/pricing.ts
// Pricing configuration for Jeru Vantage Assessment
// Includes status controls for Coming Soon, Active, Not Available

import {
  CURRENCIES,
  getCurrencyByCode,
  convertFromUSD,
  formatCurrency as formatCurrencyBase,
  getAllCurrencies,
} from './currencies';
import type { CurrencyOption } from './currencies';

export type PricingStatus = 'active' | 'coming_soon' | 'not_available';

export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  shortName: string;
  description: string;
  priceUSD: number;
  originalPriceUSD?: number;  // For showing discounts
  status: PricingStatus;
  statusMessage?: string;     // Custom message for coming_soon or not_available
  badge?: string;             // e.g., "Most Popular", "Best Value"
  badgeColor?: string;        // Tailwind color class
  features: PricingFeature[];
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  questionsCount: number;
  estimatedTime: string;
  reportType: string;
  includes: string[];
}

// ========== PRICING TIERS CONFIGURATION ==========

export const PRICING_TIERS: PricingTier[] = [
  // PILOT ASSESSMENT - FREE (Active during pilot phase)
  {
    id: 'pilot',
    name: 'Pilot Assessment',
    shortName: 'Pilot',
    description: 'Try our assessment for free during the pilot phase',
    priceUSD: 0,
    status: 'active',
    badge: 'Limited Time',
    badgeColor: 'bg-green-500',
    features: [
      { text: '153 psychometric questions', included: true },
      { text: 'Basic Jeru Report', included: true },
      { text: 'Personality & values analysis', included: true },
      { text: 'Top 3 career recommendations', included: true },
      { text: 'Holland Code assessment', included: true },
      { text: 'Detailed university matching', included: false },
      { text: 'Comprehensive SWOT analysis', included: false },
      { text: 'Action plan & roadmap', included: false },
    ],
    ctaText: 'Start Free Assessment',
    ctaVariant: 'secondary',
    questionsCount: 153,
    estimatedTime: '25-35 minutes',
    reportType: 'Basic Jeru Report',
    includes: [
      'Personality profile (Big 5)',
      'Core values assessment',
      'Interest mapping (Holland Code)',
      'Multiple intelligences',
      'Cognitive style analysis',
    ],
  },

  // FULL ASSESSMENT - Main product
  {
    id: 'full',
    name: 'Full Assessment',
    shortName: 'Full',
    description: 'Complete psychometric assessment with detailed Jeru Report',
    priceUSD: 29.99,
    originalPriceUSD: 49.99,
    status: 'coming_soon',
    statusMessage: 'Available January 2025',
    badge: 'Most Popular',
    badgeColor: 'bg-indigo-500',
    features: [
      { text: '510 psychometric questions', included: true, highlight: true },
      { text: 'Comprehensive Jeru Report', included: true, highlight: true },
      { text: 'Personality & values deep-dive', included: true },
      { text: 'Top 10 career recommendations', included: true },
      { text: 'All 8 multiple intelligences', included: true },
      { text: 'University matching algorithm', included: true, highlight: true },
      { text: 'Detailed SWOT analysis', included: true },
      { text: '12-month action roadmap', included: true },
    ],
    ctaText: 'Get Full Assessment',
    ctaVariant: 'primary',
    questionsCount: 510,
    estimatedTime: '60-90 minutes',
    reportType: 'Comprehensive Jeru Report',
    includes: [
      'Everything in Pilot, plus:',
      'Stress response analysis',
      '21st Century skills audit',
      'Execution & grit assessment',
      'Ivy League spike detector',
      'Environment & money reality check',
      'University shortlist (10+ matches)',
      'Detailed career pathways',
    ],
  },

  // PREMIUM / COUNSELOR REVIEW
  {
    id: 'premium',
    name: 'Premium + Counselor Review',
    shortName: 'Premium',
    description: 'Full assessment with 1-on-1 expert counselor session',
    priceUSD: 99.99,
    originalPriceUSD: 149.99,
    status: 'coming_soon',
    statusMessage: 'Coming Q1 2025',
    badge: 'Best Value',
    badgeColor: 'bg-purple-500',
    features: [
      { text: 'Everything in Full Assessment', included: true },
      { text: '45-min counselor video call', included: true, highlight: true },
      { text: 'Personalized action plan', included: true, highlight: true },
      { text: 'University application strategy', included: true },
      { text: 'Essay brainstorming session', included: true },
      { text: 'Parent consultation (optional)', included: true },
      { text: '30-day email follow-up support', included: true },
      { text: 'Priority response time', included: true },
    ],
    ctaText: 'Get Premium Package',
    ctaVariant: 'primary',
    questionsCount: 510,
    estimatedTime: '60-90 min + 45 min call',
    reportType: 'Premium Jeru Report + Counselor Notes',
    includes: [
      'Everything in Full Assessment, plus:',
      '1-on-1 video consultation',
      'Counselor-annotated report',
      'Custom university shortlist',
      'Application timeline planning',
      'Scholarship opportunity alerts',
    ],
  },
];

// ========== HELPER FUNCTIONS ==========

/**
 * Get all pricing tiers
 */
export const getAllPricingTiers = (): PricingTier[] => {
  return PRICING_TIERS;
};

/**
 * Get active pricing tiers only
 */
export const getActivePricingTiers = (): PricingTier[] => {
  return PRICING_TIERS.filter(tier => tier.status === 'active');
};

/**
 * Get pricing tier by ID
 */
export const getPricingTierById = (id: string): PricingTier | undefined => {
  return PRICING_TIERS.find(tier => tier.id === id);
};

/**
 * Check if a tier is available for purchase
 */
export const isTierAvailable = (tierId: string): boolean => {
  const tier = getPricingTierById(tierId);
  return tier?.status === 'active';
};

/**
 * Get the default/recommended tier
 */
export const getDefaultTier = (): PricingTier => {
  return PRICING_TIERS.find(tier => tier.badge === 'Most Popular') || PRICING_TIERS[0];
};

/**
 * Calculate discount percentage
 */
export const getDiscountPercentage = (tier: PricingTier): number | null => {
  if (!tier.originalPriceUSD || tier.originalPriceUSD <= tier.priceUSD) return null;
  return Math.round((1 - tier.priceUSD / tier.originalPriceUSD) * 100);
};

/**
 * Format price display (USD only)
 */
export const formatTierPrice = (tier: PricingTier): string => {
  if (tier.priceUSD === 0) return 'Free';
  return `$${tier.priceUSD.toFixed(2)}`;
};

/**
 * Format price in any currency
 */
export const formatTierPriceInCurrency = (tier: PricingTier, currencyCode: string): string => {
  if (tier.priceUSD === 0) return 'Free';
  const convertedAmount = convertFromUSD(tier.priceUSD, currencyCode);
  return formatCurrencyBase(convertedAmount, currencyCode);
};

// ========== PROMO CODE CONFIGURATION ==========

export interface PromoCodeConfig {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  validFrom?: Date;
  validUntil?: Date;
  applicableTiers: string[];  // tier IDs
  description: string;
}

// Default promo codes (actual codes should be in database)
export const DEFAULT_PROMO_CODES: PromoCodeConfig[] = [
  {
    code: 'EARLYBIRD',
    discountType: 'percentage',
    discountValue: 20,
    applicableTiers: ['full', 'premium'],
    description: '20% off for early adopters',
  },
  {
    code: 'COUNSELOR50',
    discountType: 'percentage',
    discountValue: 50,
    applicableTiers: ['full', 'premium'],
    description: '50% off for counselor referrals',
  },
];

// ========== B2B / SCHOOL PRICING ==========

export interface SchoolPricingTier {
  id: string;
  name: string;
  studentsMin: number;
  studentsMax: number | null;
  pricePerStudentUSD: number;
  features: string[];
  status: PricingStatus;
}

export const SCHOOL_PRICING_TIERS: SchoolPricingTier[] = [
  {
    id: 'school-starter',
    name: 'Starter',
    studentsMin: 10,
    studentsMax: 50,
    pricePerStudentUSD: 19.99,
    features: [
      'Full assessment for all students',
      'School admin dashboard',
      'Aggregate analytics',
      'Email support',
    ],
    status: 'coming_soon',
  },
  {
    id: 'school-growth',
    name: 'Growth',
    studentsMin: 51,
    studentsMax: 200,
    pricePerStudentUSD: 14.99,
    features: [
      'Everything in Starter',
      'Dedicated account manager',
      'Custom branding option',
      'Priority support',
    ],
    status: 'coming_soon',
  },
  {
    id: 'school-enterprise',
    name: 'Enterprise',
    studentsMin: 201,
    studentsMax: null,
    pricePerStudentUSD: 9.99,
    features: [
      'Everything in Growth',
      'API access',
      'White-label option',
      'On-site training',
      'Custom integrations',
    ],
    status: 'coming_soon',
  },
];

/**
 * Get school pricing based on student count
 */
export const getSchoolPricing = (studentCount: number): SchoolPricingTier | null => {
  return SCHOOL_PRICING_TIERS.find(tier => {
    if (tier.studentsMax === null) {
      return studentCount >= tier.studentsMin;
    }
    return studentCount >= tier.studentsMin && studentCount <= tier.studentsMax;
  }) || null;
};

/**
 * Calculate total school price
 */
export const calculateSchoolPrice = (studentCount: number): number | null => {
  const tier = getSchoolPricing(studentCount);
  if (!tier) return null;
  return studentCount * tier.pricePerStudentUSD;
};

/**
 * Calculate school price in any currency
 */
export const calculateSchoolPriceInCurrency = (studentCount: number, currencyCode: string): string | null => {
  const priceUSD = calculateSchoolPrice(studentCount);
  if (priceUSD === null) return null;
  const convertedAmount = convertFromUSD(priceUSD, currencyCode);
  return formatCurrencyBase(convertedAmount, currencyCode);
};

// ========== CURRENCY EXPORTS (from currencies module) ==========

// Re-export currency utilities for convenience
export { CURRENCIES, getCurrencyByCode, getAllCurrencies, type CurrencyOption };

// Legacy compatibility - build CURRENCY_RATES, CURRENCY_SYMBOLS, CURRENCY_NAMES from CURRENCIES
export const CURRENCY_RATES: Record<string, number> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.exchangeRate])
);

export const CURRENCY_SYMBOLS: Record<string, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.symbol])
);

export const CURRENCY_NAMES: Record<string, string> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c.name])
);

/**
 * Convert USD to target currency amount
 */
export function convertPrice(usdAmount: number, currencyCode: string): number {
  return convertFromUSD(usdAmount, currencyCode);
}

/**
 * Format amount as a currency string
 */
export function formatPrice(amount: number, currencyCode: string = 'USD'): string {
  const convertedAmount = convertFromUSD(amount, currencyCode);
  return formatCurrencyBase(convertedAmount, currencyCode);
}

/**
 * Get all available currencies for dropdown (with flags)
 */
export function getAvailableCurrencies(): CurrencyOption[] {
  return getAllCurrencies();
}

// ========== LEGACY COMPATIBILITY ==========
// These types and exports maintain backward compatibility with existing code

export interface PricingItem {
  id: string;
  name: string;
  description: string;
  basePrice: number; // in USD cents (e.g., 2999 = $29.99)
  status: PricingStatus;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number; // in USD cents
  status: PricingStatus;
}

// Legacy default assessments (for backward compatibility)
export const DEFAULT_ASSESSMENTS: PricingItem[] = [
  {
    id: 'pilot',
    name: 'Pilot Assessment',
    description: 'Limited time free access with invite code',
    basePrice: 0,
    status: 'active',
    features: [
      '153 carefully designed questions',
      'Basic Jeru Report',
      'SWOT Analysis',
      'Career recommendations',
    ],
    badge: 'FREE (Invite Code Required)',
  },
  {
    id: 'full',
    name: 'Full Assessment',
    description: 'Complete 510-question assessment',
    basePrice: 2999, // $29.99
    status: 'coming_soon',
    isPopular: true,
    features: [
      '510 comprehensive questions',
      'Complete Jeru Report',
      'Detailed SWOT Analysis',
      'Personalized career roadmap',
      'University major recommendations',
      'PDF download',
    ],
  },
  {
    id: 'premium',
    name: 'Premium + Counselor',
    description: 'Full assessment with 1-on-1 counselor session',
    basePrice: 9999, // $99.99
    status: 'coming_soon',
    features: [
      'Everything in Full Assessment',
      '45-min video call with counselor',
      'Personalized action plan',
      'University application strategy',
      '30-day follow-up support',
    ],
  },
];

export const DEFAULT_ADDONS: AddOnItem[] = [
  {
    id: 'counseling',
    name: '1-on-1 Counseling Session',
    description: '30-minute session with a career counselor',
    price: 4999, // $49.99
    status: 'coming_soon',
  },
  {
    id: 'university_matching',
    name: 'University Matching Report',
    description: 'AI-powered university recommendations',
    price: 1999, // $19.99
    status: 'coming_soon',
  },
];
