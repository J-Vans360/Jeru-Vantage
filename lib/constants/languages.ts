export type LanguageStatus = 'active' | 'coming_soon' | 'not_available';

export interface LanguageOption {
  code: string;
  name: string; // English name
  nativeName: string; // Native script
  status: LanguageStatus;
  flag?: string; // Emoji flag
  region: string; // For grouping
}

export const LANGUAGES: LanguageOption[] = [
  // ========== AVAILABLE ==========
  {
    code: 'en-b2',
    name: 'Standard English',
    nativeName: 'Standard English',
    status: 'active',
    flag: '🇬🇧',
    region: 'Global',
  },
  {
    code: 'en-esl',
    name: 'Simple English',
    nativeName: 'Simple English (ESL)',
    status: 'active',
    flag: '🌍',
    region: 'Global',
  },

  // ========== SOUTHEAST ASIA (Priority 1) ==========
  {
    code: 'km',
    name: 'Khmer',
    nativeName: 'ខ្មែរ',
    status: 'coming_soon',
    flag: '🇰🇭',
    region: 'Southeast Asia',
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ภาษาไทย',
    status: 'coming_soon',
    flag: '🇹🇭',
    region: 'Southeast Asia',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    status: 'coming_soon',
    flag: '🇻🇳',
    region: 'Southeast Asia',
  },
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    nativeName: 'Bahasa Indonesia',
    status: 'coming_soon',
    flag: '🇮🇩',
    region: 'Southeast Asia',
  },
  {
    code: 'ms',
    name: 'Bahasa Melayu',
    nativeName: 'Bahasa Melayu',
    status: 'coming_soon',
    flag: '🇲🇾',
    region: 'Southeast Asia',
  },
  {
    code: 'my',
    name: 'Burmese',
    nativeName: 'မြန်မာ',
    status: 'coming_soon',
    flag: '🇲🇲',
    region: 'Southeast Asia',
  },
  {
    code: 'fil',
    name: 'Filipino',
    nativeName: 'Filipino',
    status: 'coming_soon',
    flag: '🇵🇭',
    region: 'Southeast Asia',
  },

  // ========== SOUTH ASIA (Priority 2) ==========
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    status: 'coming_soon',
    flag: '🇮🇳',
    region: 'South Asia',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    status: 'coming_soon',
    flag: '🇮🇳',
    region: 'South Asia',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    status: 'coming_soon',
    flag: '🇧🇩',
    region: 'South Asia',
  },
  {
    code: 'si',
    name: 'Sinhala',
    nativeName: 'සිංහල',
    status: 'coming_soon',
    flag: '🇱🇰',
    region: 'South Asia',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    status: 'coming_soon',
    flag: '🇳🇵',
    region: 'South Asia',
  },

  // ========== EAST ASIA (Priority 3) ==========
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    status: 'coming_soon',
    flag: '🇨🇳',
    region: 'East Asia',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    status: 'coming_soon',
    flag: '🇯🇵',
    region: 'East Asia',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    status: 'coming_soon',
    flag: '🇰🇷',
    region: 'East Asia',
  },
];

// Helper functions
export const getActiveLanguages = () => LANGUAGES.filter((l) => l.status === 'active');

export const getComingSoonLanguages = () => LANGUAGES.filter((l) => l.status === 'coming_soon');

export const getLanguagesByRegion = () => {
  const grouped: Record<string, LanguageOption[]> = {};
  LANGUAGES.forEach((lang) => {
    if (!grouped[lang.region]) grouped[lang.region] = [];
    grouped[lang.region].push(lang);
  });
  return grouped;
};

export const getLanguageByCode = (code: string) => LANGUAGES.find((l) => l.code === code);
