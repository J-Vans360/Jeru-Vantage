// Currency configuration for Jeru Vantage Pricing
// Currencies are sorted alphabetically by code

export interface CurrencyOption {
  code: string; // ISO 4217 code
  symbol: string; // Currency symbol
  name: string; // Full name
  flag: string; // Country flag emoji
  exchangeRate: number; // Rate relative to USD (1 USD = X local currency)
  decimalPlaces: number; // Number of decimal places to display
  position: 'before' | 'after'; // Symbol position relative to amount
}

// Base currency is USD
export const BASE_CURRENCY = 'USD';

// All supported currencies - sorted alphabetically by code
export const CURRENCIES: CurrencyOption[] = [
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    exchangeRate: 1.57,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    flag: '🇧🇩',
    exchangeRate: 110.0,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    exchangeRate: 1.36,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    flag: '🇨🇳',
    exchangeRate: 7.24,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    exchangeRate: 0.92,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    exchangeRate: 0.79,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    exchangeRate: 15800,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    exchangeRate: 83.5,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    exchangeRate: 157.0,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'KHR',
    symbol: '៛',
    name: 'Cambodian Riel',
    flag: '🇰🇭',
    exchangeRate: 4100,
    decimalPlaces: 0,
    position: 'after',
  },
  {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    flag: '🇰🇷',
    exchangeRate: 1450,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'LKR',
    symbol: 'Rs',
    name: 'Sri Lankan Rupee',
    flag: '🇱🇰',
    exchangeRate: 325,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'MMK',
    symbol: 'K',
    name: 'Myanmar Kyat',
    flag: '🇲🇲',
    exchangeRate: 2100,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    flag: '🇲🇾',
    exchangeRate: 4.72,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'NPR',
    symbol: 'रू',
    name: 'Nepalese Rupee',
    flag: '🇳🇵',
    exchangeRate: 133.5,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    flag: '🇵🇭',
    exchangeRate: 56.5,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    exchangeRate: 1.35,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    flag: '🇹🇭',
    exchangeRate: 35.5,
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    exchangeRate: 1.0,
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    flag: '🇻🇳',
    exchangeRate: 24500,
    decimalPlaces: 0,
    position: 'after',
  },
];

// ========== HELPER FUNCTIONS ==========

/**
 * Get all currencies sorted alphabetically by code
 */
export const getAllCurrencies = (): CurrencyOption[] => {
  return [...CURRENCIES].sort((a, b) => a.code.localeCompare(b.code));
};

/**
 * Get currency by code
 */
export const getCurrencyByCode = (code: string): CurrencyOption | undefined => {
  return CURRENCIES.find((c) => c.code === code);
};

/**
 * Get default currency (USD)
 */
export const getDefaultCurrency = (): CurrencyOption => {
  return CURRENCIES.find((c) => c.code === 'USD')!;
};

/**
 * Convert amount from USD to target currency
 */
export const convertFromUSD = (amountUSD: number, targetCurrencyCode: string): number => {
  const currency = getCurrencyByCode(targetCurrencyCode);
  if (!currency) return amountUSD;
  return amountUSD * currency.exchangeRate;
};

/**
 * Convert amount to USD from source currency
 */
export const convertToUSD = (amount: number, sourceCurrencyCode: string): number => {
  const currency = getCurrencyByCode(sourceCurrencyCode);
  if (!currency) return amount;
  return amount / currency.exchangeRate;
};

/**
 * Format amount with currency symbol
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;

  const formattedAmount = amount.toFixed(currency.decimalPlaces);

  // Add thousand separators
  const parts = formattedAmount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const finalAmount = parts.join('.');

  if (currency.position === 'before') {
    return `${currency.symbol}${finalAmount}`;
  } else {
    return `${finalAmount}${currency.symbol}`;
  }
};

/**
 * Format price in target currency with USD equivalent
 */
export const formatPriceWithConversion = (
  priceUSD: number,
  targetCurrencyCode: string
): { local: string; usd: string; converted: number } => {
  const convertedAmount = convertFromUSD(priceUSD, targetCurrencyCode);
  const currency = getCurrencyByCode(targetCurrencyCode);

  return {
    local: formatCurrency(convertedAmount, targetCurrencyCode),
    usd: formatCurrency(priceUSD, 'USD'),
    converted: parseFloat(convertedAmount.toFixed(currency?.decimalPlaces || 2)),
  };
};

/**
 * Get popular currencies (for quick selection)
 */
export const getPopularCurrencies = (): CurrencyOption[] => {
  const popularCodes = ['USD', 'INR', 'KHR', 'THB', 'MYR', 'SGD', 'IDR', 'PHP', 'VND'];
  return popularCodes
    .map((code) => getCurrencyByCode(code))
    .filter((c): c is CurrencyOption => c !== undefined);
};

/**
 * Detect currency based on country code (ISO 3166-1 alpha-2)
 */
export const getCurrencyForCountry = (countryCode: string): CurrencyOption => {
  const countryToCurrency: Record<string, string> = {
    US: 'USD',
    IN: 'INR',
    KH: 'KHR',
    TH: 'THB',
    MY: 'MYR',
    SG: 'SGD',
    ID: 'IDR',
    PH: 'PHP',
    VN: 'VND',
    BD: 'BDT',
    LK: 'LKR',
    NP: 'NPR',
    MM: 'MMK',
    JP: 'JPY',
    KR: 'KRW',
    CN: 'CNY',
    GB: 'GBP',
    AU: 'AUD',
    CA: 'CAD',
    // EU countries
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    BE: 'EUR',
    AT: 'EUR',
    PT: 'EUR',
    IE: 'EUR',
    FI: 'EUR',
  };

  const currencyCode = countryToCurrency[countryCode.toUpperCase()] || 'USD';
  return getCurrencyByCode(currencyCode) || getDefaultCurrency();
};
