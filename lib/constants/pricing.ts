// /lib/constants/pricing.ts
// Pricing configuration for Jeru Vantage Assessment
// Includes status controls for Coming Soon, Active, Not Available

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

// ========== FAMILY PACK PRICING ==========

export interface FamilyPackTier {
  id: string;
  name: string;
  childrenCount: number;
  childrenLabel: string;
  priceUSD: number;
  originalPriceUSD: number;
  pricePerChildUSD: number;
  savingsPercent: number;
  status: PricingStatus;
  statusMessage?: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  bonusFeatures?: string[];
}

export const FAMILY_PACK_TIERS: FamilyPackTier[] = [
  {
    id: 'family-2',
    name: 'Family Duo',
    childrenCount: 2,
    childrenLabel: '2 Children',
    priceUSD: 49.99,
    originalPriceUSD: 59.98,  // 2 × $29.99
    pricePerChildUSD: 24.99,
    savingsPercent: 17,
    status: 'coming_soon',
    statusMessage: 'Coming January 2025',
    features: [
      'Full Assessment for 2 children',
      'Individual Jeru Reports for each child',
      'Side-by-side comparison view',
      'Family dashboard access',
    ],
  },
  {
    id: 'family-3',
    name: 'Family Trio',
    childrenCount: 3,
    childrenLabel: '3 Children',
    priceUSD: 69.99,
    originalPriceUSD: 89.97,  // 3 × $29.99
    pricePerChildUSD: 23.33,
    savingsPercent: 22,
    status: 'coming_soon',
    statusMessage: 'Coming January 2025',
    badge: 'Most Popular',
    badgeColor: 'bg-indigo-500',
    features: [
      'Full Assessment for 3 children',
      'Individual Jeru Reports for each child',
      'Side-by-side comparison view',
      'Family dashboard access',
      'Parent summary report',
    ],
  },
  {
    id: 'family-4',
    name: 'Family Quad',
    childrenCount: 4,
    childrenLabel: '4 Children',
    priceUSD: 84.99,
    originalPriceUSD: 119.96,  // 4 × $29.99
    pricePerChildUSD: 21.25,
    savingsPercent: 29,
    status: 'coming_soon',
    statusMessage: 'Coming January 2025',
    badge: 'Best Savings',
    badgeColor: 'bg-green-500',
    features: [
      'Full Assessment for 4 children',
      'Individual Jeru Reports for each child',
      'Side-by-side comparison view',
      'Family dashboard access',
      'Parent summary report',
      'Priority email support',
    ],
  },
  {
    id: 'family-5plus',
    name: 'Family Plus',
    childrenCount: 5,
    childrenLabel: '5+ Children',
    priceUSD: 99.99,
    originalPriceUSD: 149.95,  // 5 × $29.99
    pricePerChildUSD: 19.99,
    savingsPercent: 33,
    status: 'coming_soon',
    statusMessage: 'Coming January 2025',
    badge: 'Maximum Value',
    badgeColor: 'bg-purple-500',
    features: [
      'Full Assessment for 5+ children',
      'Individual Jeru Reports for each child',
      'Side-by-side comparison view',
      'Family dashboard access',
      'Comprehensive parent summary report',
      'Priority email support',
      '30-min family consultation call',
    ],
    bonusFeatures: [
      'Add additional children for just $15 each',
    ],
  },
];

/**
 * Get all family pack tiers
 */
export const getAllFamilyPacks = (): FamilyPackTier[] => {
  return FAMILY_PACK_TIERS;
};

/**
 * Get family pack by ID
 */
export const getFamilyPackById = (id: string): FamilyPackTier | undefined => {
  return FAMILY_PACK_TIERS.find(pack => pack.id === id);
};

/**
 * Get recommended family pack based on number of children
 */
export const getRecommendedFamilyPack = (childrenCount: number): FamilyPackTier | null => {
  if (childrenCount < 2) return null;
  if (childrenCount === 2) return FAMILY_PACK_TIERS[0];
  if (childrenCount === 3) return FAMILY_PACK_TIERS[1];
  if (childrenCount === 4) return FAMILY_PACK_TIERS[2];
  return FAMILY_PACK_TIERS[3]; // 5+
};

/**
 * Calculate family pack price for custom number of children (5+)
 */
export const calculateFamilyPlusPrice = (childrenCount: number): number => {
  if (childrenCount <= 5) return FAMILY_PACK_TIERS[3].priceUSD;
  const additionalChildren = childrenCount - 5;
  const additionalCost = additionalChildren * 15; // $15 per additional child
  return FAMILY_PACK_TIERS[3].priceUSD + additionalCost;
};

/**
 * Calculate total savings for family pack
 */
export const calculateFamilySavings = (childrenCount: number): { savings: number; percent: number } => {
  const individualTotal = childrenCount * 29.99;
  const familyPrice = childrenCount <= 5
    ? (getRecommendedFamilyPack(childrenCount)?.priceUSD || individualTotal)
    : calculateFamilyPlusPrice(childrenCount);

  const savings = individualTotal - familyPrice;
  const percent = Math.round((savings / individualTotal) * 100);

  return { savings, percent };
};

// ========== SCHOOL ANNUAL SUBSCRIPTION ==========

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface SchoolSubscriptionTier {
  id: string;
  name: string;
  description: string;
  studentsMin: number;
  studentsMax: number | null;
  // Monthly pricing (base)
  monthlyPricePerStudentUSD: number;
  // Billing cycle discounts
  billingOptions: {
    cycle: BillingCycle;
    discountPercent: number;
    pricePerStudentUSD: number;
    label: string;
    badge?: string;
  }[];
  features: string[];
  supportLevel: 'email' | 'priority' | 'dedicated';
  status: PricingStatus;
  statusMessage?: string;
}

// Configurable annual discount percentages
export const SCHOOL_BILLING_DISCOUNTS = {
  monthly: 0,
  quarterly: 10,   // 10% off for quarterly
  annual: 20,      // 20% off for annual
} as const;

// Helper to calculate discounted price
const calculateDiscountedPrice = (basePrice: number, discountPercent: number): number => {
  return Math.round((basePrice * (1 - discountPercent / 100)) * 100) / 100;
};

export const SCHOOL_SUBSCRIPTION_TIERS: SchoolSubscriptionTier[] = [
  {
    id: 'school-starter',
    name: 'Starter',
    description: 'Perfect for small counseling centers and tutoring programs',
    studentsMin: 10,
    studentsMax: 50,
    monthlyPricePerStudentUSD: 4.99,
    billingOptions: [
      {
        cycle: 'monthly',
        discountPercent: 0,
        pricePerStudentUSD: 4.99,
        label: 'Monthly',
      },
      {
        cycle: 'quarterly',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.quarterly,
        pricePerStudentUSD: calculateDiscountedPrice(4.99, SCHOOL_BILLING_DISCOUNTS.quarterly),
        label: 'Quarterly',
        badge: 'Save 10%',
      },
      {
        cycle: 'annual',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.annual,
        pricePerStudentUSD: calculateDiscountedPrice(4.99, SCHOOL_BILLING_DISCOUNTS.annual),
        label: 'Annual',
        badge: 'Save 20%',
      },
    ],
    features: [
      'Full assessment for all students',
      'School admin dashboard',
      'Student progress tracking',
      'Aggregate analytics & reports',
      'Bulk invite codes',
      'Email support (48hr response)',
    ],
    supportLevel: 'email',
    status: 'coming_soon',
    statusMessage: 'Coming Q1 2025',
  },
  {
    id: 'school-growth',
    name: 'Growth',
    description: 'Ideal for schools and medium-sized institutions',
    studentsMin: 51,
    studentsMax: 200,
    monthlyPricePerStudentUSD: 3.99,
    billingOptions: [
      {
        cycle: 'monthly',
        discountPercent: 0,
        pricePerStudentUSD: 3.99,
        label: 'Monthly',
      },
      {
        cycle: 'quarterly',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.quarterly,
        pricePerStudentUSD: calculateDiscountedPrice(3.99, SCHOOL_BILLING_DISCOUNTS.quarterly),
        label: 'Quarterly',
        badge: 'Save 10%',
      },
      {
        cycle: 'annual',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.annual,
        pricePerStudentUSD: calculateDiscountedPrice(3.99, SCHOOL_BILLING_DISCOUNTS.annual),
        label: 'Annual',
        badge: 'Best Value',
      },
    ],
    features: [
      'Everything in Starter, plus:',
      'Dedicated account manager',
      'Custom school branding',
      'Parent portal access',
      'Counselor training session',
      'Priority support (24hr response)',
      'Quarterly review calls',
    ],
    supportLevel: 'priority',
    status: 'coming_soon',
    statusMessage: 'Coming Q1 2025',
  },
  {
    id: 'school-enterprise',
    name: 'Enterprise',
    description: 'For large schools, districts, and university systems',
    studentsMin: 201,
    studentsMax: null,
    monthlyPricePerStudentUSD: 2.99,
    billingOptions: [
      {
        cycle: 'monthly',
        discountPercent: 0,
        pricePerStudentUSD: 2.99,
        label: 'Monthly',
      },
      {
        cycle: 'quarterly',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.quarterly,
        pricePerStudentUSD: calculateDiscountedPrice(2.99, SCHOOL_BILLING_DISCOUNTS.quarterly),
        label: 'Quarterly',
        badge: 'Save 10%',
      },
      {
        cycle: 'annual',
        discountPercent: SCHOOL_BILLING_DISCOUNTS.annual,
        pricePerStudentUSD: calculateDiscountedPrice(2.99, SCHOOL_BILLING_DISCOUNTS.annual),
        label: 'Annual',
        badge: 'Maximum Savings',
      },
    ],
    features: [
      'Everything in Growth, plus:',
      'API access & integrations',
      'White-label option',
      'SSO / LMS integration',
      'On-site training & workshops',
      'Custom report templates',
      'Dedicated success manager',
      'SLA guarantee (4hr response)',
      'Multi-campus support',
    ],
    supportLevel: 'dedicated',
    status: 'coming_soon',
    statusMessage: 'Coming Q2 2025',
  },
];

/**
 * Get all school subscription tiers
 */
export const getAllSchoolSubscriptions = (): SchoolSubscriptionTier[] => {
  return SCHOOL_SUBSCRIPTION_TIERS;
};

/**
 * Get school subscription by ID
 */
export const getSchoolSubscriptionById = (id: string): SchoolSubscriptionTier | undefined => {
  return SCHOOL_SUBSCRIPTION_TIERS.find(tier => tier.id === id);
};

/**
 * Get recommended school tier based on student count
 */
export const getRecommendedSchoolTier = (studentCount: number): SchoolSubscriptionTier | null => {
  return SCHOOL_SUBSCRIPTION_TIERS.find(tier => {
    if (tier.studentsMax === null) {
      return studentCount >= tier.studentsMin;
    }
    return studentCount >= tier.studentsMin && studentCount <= tier.studentsMax;
  }) || null;
};

/**
 * Calculate school subscription price
 */
export const calculateSchoolSubscriptionPrice = (
  studentCount: number,
  billingCycle: BillingCycle
): {
  tier: SchoolSubscriptionTier | null;
  pricePerStudent: number;
  monthlyTotal: number;
  cycleTotal: number;
  cycleSavings: number;
  billingPeriodMonths: number;
} | null => {
  const tier = getRecommendedSchoolTier(studentCount);
  if (!tier) return null;

  const billingOption = tier.billingOptions.find(opt => opt.cycle === billingCycle);
  if (!billingOption) return null;

  const periodMonths = billingCycle === 'annual' ? 12 : billingCycle === 'quarterly' ? 3 : 1;
  const monthlyTotal = studentCount * billingOption.pricePerStudentUSD;
  const cycleTotal = monthlyTotal * periodMonths;

  // Calculate savings vs monthly
  const monthlyBasePrice = tier.monthlyPricePerStudentUSD;
  const fullPriceTotal = studentCount * monthlyBasePrice * periodMonths;
  const cycleSavings = fullPriceTotal - cycleTotal;

  return {
    tier,
    pricePerStudent: billingOption.pricePerStudentUSD,
    monthlyTotal,
    cycleTotal,
    cycleSavings,
    billingPeriodMonths: periodMonths,
  };
};

// ========== REFERRAL DISCOUNT SYSTEM ==========

export type ReferralTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface ReferralConfig {
  // Discount for the person being referred (new user)
  newUserDiscountPercent: number;
  // Reward for the referrer
  referrerRewardType: 'discount' | 'credit' | 'cash';
  referrerRewardValue: number;  // Percent or dollar amount based on type
  // Tier-based bonuses
  tierBonuses: {
    tier: ReferralTier;
    referralsRequired: number;
    bonusMultiplier: number;  // Multiplier on base reward
    badge: string;
    perks: string[];
  }[];
  // Configurable settings
  maxDiscountPercent: number;
  minPurchaseForReferral: number;  // Minimum purchase amount to qualify
  referralCodeExpireDays: number;
  stackableWithOtherDiscounts: boolean;
}

export const REFERRAL_CONFIG: ReferralConfig = {
  newUserDiscountPercent: 15,  // New users get 15% off
  referrerRewardType: 'credit',
  referrerRewardValue: 10,  // $10 credit per successful referral
  maxDiscountPercent: 50,  // Maximum total discount allowed
  minPurchaseForReferral: 29.99,  // Must purchase Full Assessment or higher
  referralCodeExpireDays: 30,
  stackableWithOtherDiscounts: false,
  tierBonuses: [
    {
      tier: 'bronze',
      referralsRequired: 1,
      bonusMultiplier: 1.0,
      badge: '🥉 Bronze Referrer',
      perks: ['$10 credit per referral'],
    },
    {
      tier: 'silver',
      referralsRequired: 5,
      bonusMultiplier: 1.25,
      badge: '🥈 Silver Referrer',
      perks: [
        '$12.50 credit per referral (1.25x)',
        'Early access to new features',
      ],
    },
    {
      tier: 'gold',
      referralsRequired: 15,
      bonusMultiplier: 1.5,
      badge: '🥇 Gold Referrer',
      perks: [
        '$15 credit per referral (1.5x)',
        'Early access to new features',
        'Free Premium upgrade (once)',
      ],
    },
    {
      tier: 'platinum',
      referralsRequired: 30,
      bonusMultiplier: 2.0,
      badge: '💎 Platinum Referrer',
      perks: [
        '$20 credit per referral (2x)',
        'Early access to new features',
        'Free Premium upgrade (annual)',
        'Featured on referrer leaderboard',
        'Exclusive counselor community access',
      ],
    },
  ],
};

// Configurable discount options for admin
export interface DiscountOption {
  id: string;
  name: string;
  percent: number;
  description: string;
  applicableTo: ('individual' | 'family' | 'school')[];
  isDefault?: boolean;
}

export const DISCOUNT_OPTIONS: DiscountOption[] = [
  {
    id: 'discount-5',
    name: '5% Off',
    percent: 5,
    description: 'Small discount for minor promotions',
    applicableTo: ['individual', 'family', 'school'],
  },
  {
    id: 'discount-10',
    name: '10% Off',
    percent: 10,
    description: 'Standard promotional discount',
    applicableTo: ['individual', 'family', 'school'],
    isDefault: true,
  },
  {
    id: 'discount-15',
    name: '15% Off',
    percent: 15,
    description: 'Referral discount for new users',
    applicableTo: ['individual', 'family'],
  },
  {
    id: 'discount-20',
    name: '20% Off',
    percent: 20,
    description: 'Early bird / loyalty discount',
    applicableTo: ['individual', 'family', 'school'],
  },
  {
    id: 'discount-25',
    name: '25% Off',
    percent: 25,
    description: 'Special event discount',
    applicableTo: ['individual', 'family'],
  },
  {
    id: 'discount-30',
    name: '30% Off',
    percent: 30,
    description: 'Major campaign discount',
    applicableTo: ['individual', 'family', 'school'],
  },
  {
    id: 'discount-50',
    name: '50% Off',
    percent: 50,
    description: 'VIP / Counselor partner discount',
    applicableTo: ['individual', 'family'],
  },
  {
    id: 'discount-100',
    name: 'Free (100% Off)',
    percent: 100,
    description: 'Complimentary access (pilot, testing)',
    applicableTo: ['individual', 'family'],
  },
];

/**
 * Get referral tier based on number of successful referrals
 */
export const getReferralTier = (referralCount: number): ReferralConfig['tierBonuses'][0] | null => {
  const tiers = REFERRAL_CONFIG.tierBonuses;
  // Find highest tier the user qualifies for
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (referralCount >= tiers[i].referralsRequired) {
      return tiers[i];
    }
  }
  return null;
};

/**
 * Calculate referrer reward based on their tier
 */
export const calculateReferrerReward = (referralCount: number): number => {
  const tier = getReferralTier(referralCount);
  const baseReward = REFERRAL_CONFIG.referrerRewardValue;
  const multiplier = tier?.bonusMultiplier || 1.0;
  return baseReward * multiplier;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
  originalPrice: number,
  discountPercent: number,
  maxDiscount?: number
): { discountedPrice: number; discountAmount: number; effectivePercent: number } => {
  const maxDiscountPercent = maxDiscount || REFERRAL_CONFIG.maxDiscountPercent;
  const effectivePercent = Math.min(discountPercent, maxDiscountPercent);
  const discountAmount = originalPrice * (effectivePercent / 100);
  const discountedPrice = originalPrice - discountAmount;

  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    effectivePercent,
  };
};

/**
 * Generate referral code
 */
export const generateReferralCode = (userId: string): string => {
  const prefix = 'JERU';
  const userPart = userId.slice(-4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${userPart}-${randomPart}`;
};

/**
 * Get all discount options
 */
export const getAllDiscountOptions = (): DiscountOption[] => {
  return DISCOUNT_OPTIONS;
};

/**
 * Get discount options for specific category
 */
export const getDiscountOptionsFor = (category: 'individual' | 'family' | 'school'): DiscountOption[] => {
  return DISCOUNT_OPTIONS.filter(opt => opt.applicableTo.includes(category));
};

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
 * Format price display
 */
export const formatTierPrice = (tier: PricingTier): string => {
  if (tier.priceUSD === 0) return 'Free';
  return `$${tier.priceUSD.toFixed(2)}`;
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

// ========== SUPER ADMIN PRICING MANAGEMENT ==========

export interface AdminAssessment {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Price in cents
  status: PricingStatus;
}

export interface AdminAddon {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  status: PricingStatus;
}

// Default assessments for super-admin pricing management
export const DEFAULT_ASSESSMENTS: AdminAssessment[] = [
  {
    id: 'pilot',
    name: 'Pilot Assessment',
    description: 'Free pilot assessment with 153 questions',
    basePrice: 0,
    status: 'active',
  },
  {
    id: 'full',
    name: 'Full Assessment',
    description: 'Complete psychometric assessment with 510 questions',
    basePrice: 2999, // $29.99 in cents
    status: 'coming_soon',
  },
  {
    id: 'premium',
    name: 'Premium + Counselor Review',
    description: 'Full assessment with 1-on-1 expert counselor session',
    basePrice: 9999, // $99.99 in cents
    status: 'coming_soon',
  },
];

// Default add-ons for super-admin pricing management
export const DEFAULT_ADDONS: AdminAddon[] = [
  {
    id: 'counselor-call',
    name: 'Additional Counselor Call',
    description: 'Extra 45-minute counselor session',
    price: 4999, // $49.99 in cents
    status: 'coming_soon',
  },
  {
    id: 'parent-consultation',
    name: 'Parent Consultation',
    description: '30-minute parent guidance session',
    price: 2999, // $29.99 in cents
    status: 'coming_soon',
  },
  {
    id: 'report-update',
    name: 'Report Update',
    description: 'Updated report after 6 months',
    price: 1499, // $14.99 in cents
    status: 'coming_soon',
  },
  {
    id: 'university-matching',
    name: 'Extended University Matching',
    description: 'Detailed matching for 25+ universities',
    price: 1999, // $19.99 in cents
    status: 'coming_soon',
  },
];

/**
 * Format price from cents to currency string
 */
export const formatPrice = (priceInCents: number, currencyCode: string = 'USD'): string => {
  const amount = priceInCents / 100;
  if (currencyCode === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  // For other currencies, use the formatCurrency helper from currencies.ts
  return `$${amount.toFixed(2)}`;
};

/**
 * Get available currencies (wrapper for admin page)
 */
export const getAvailableCurrencies = () => {
  // Import from currencies.ts for full implementation
  return [
    { code: 'USD', symbol: '$', flag: '🇺🇸' },
    { code: 'INR', symbol: '₹', flag: '🇮🇳' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧' },
    { code: 'AUD', symbol: 'A$', flag: '🇦🇺' },
    { code: 'SGD', symbol: 'S$', flag: '🇸🇬' },
  ];
};

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
