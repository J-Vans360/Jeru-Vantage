import {
  CURRENCIES,
  getCurrencyByCode,
  convertFromUSD,
  formatCurrency as formatCurrencyBase,
  getAllCurrencies,
} from './currencies';
import type { CurrencyOption } from './currencies';

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

// Re-export currency utilities from currencies module
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
 * Convert USD cents to target currency amount
 */
export function convertPrice(usdCents: number, currencyCode: string): number {
  const usdAmount = usdCents / 100;
  return convertFromUSD(usdAmount, currencyCode);
}

/**
 * Format USD cents as a currency string
 */
export function formatPrice(usdCents: number, currencyCode: string = 'USD'): string {
  const usdAmount = usdCents / 100;
  const convertedAmount = convertFromUSD(usdAmount, currencyCode);
  return formatCurrencyBase(convertedAmount, currencyCode);
}

/**
 * Get all available currencies for dropdown (with flags)
 */
export function getAvailableCurrencies(): CurrencyOption[] {
  return getAllCurrencies();
}
