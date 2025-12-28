export type PricingStatus = 'active' | 'coming_soon' | 'not_available';

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

// Default pricing - admin can override in database
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
    status: 'active',
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
    id: 'esl',
    name: 'ESL Assessment',
    description: 'English as Second Language proficiency',
    basePrice: 1499, // $14.99
    status: 'coming_soon',
    features: [
      'ESL level proficiency questions',
      'Language skill assessment',
      'Study recommendations',
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

// Currency conversion rates (updated periodically)
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1,
  KHR: 4100, // Cambodian Riel
  SGD: 1.35,
  INR: 83,
  MYR: 4.7,
  THB: 35,
  PHP: 56,
  VND: 24500,
  IDR: 15700,
  EUR: 0.92,
  GBP: 0.79,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  KHR: '៛',
  SGD: 'S$',
  INR: '₹',
  MYR: 'RM',
  THB: '฿',
  PHP: '₱',
  VND: '₫',
  IDR: 'Rp',
  EUR: '€',
  GBP: '£',
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  KHR: 'Cambodian Riel',
  SGD: 'Singapore Dollar',
  INR: 'Indian Rupee',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
  PHP: 'Philippine Peso',
  VND: 'Vietnamese Dong',
  IDR: 'Indonesian Rupiah',
  EUR: 'Euro',
  GBP: 'British Pound',
};

export function convertPrice(usdCents: number, currency: string): number {
  const rate = CURRENCY_RATES[currency] || 1;
  return Math.round((usdCents / 100) * rate * 100) / 100;
}

export function formatPrice(usdCents: number, currency: string = 'USD'): string {
  const converted = convertPrice(usdCents, currency);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  // For currencies with large numbers, don't show decimals
  if (currency === 'KHR' || currency === 'VND' || currency === 'IDR') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${symbol}${converted.toFixed(2)}`;
}

// Get all available currencies for dropdown
export function getAvailableCurrencies(): { code: string; symbol: string; name: string }[] {
  return Object.keys(CURRENCY_RATES).map(code => ({
    code,
    symbol: CURRENCY_SYMBOLS[code],
    name: CURRENCY_NAMES[code],
  }));
}
