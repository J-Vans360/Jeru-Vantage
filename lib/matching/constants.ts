// Score weights - must sum to 100
export const MATCH_WEIGHTS = {
  hollandFit: 30, // Career interest alignment is most important
  academicFit: 20, // GPA & test scores
  financialFit: 20, // Budget match
  programFit: 15, // Specific program keywords
  geographicFit: 10, // Location preferences
  personalityFit: 5, // Campus culture fit
} as const;

// Tier advantages for tie-breaking (score margin where tier wins)
export const TIER_ADVANTAGES = {
  STANDARD: 0, // Must win purely on merit
  SILVER: 5, // Wins ties within 5%
  GOLD: 7, // Wins ties within 7%
  PLATINUM: 10, // Wins ties within 10%
} as const;

// Display limits
export const MAX_HERO_MATCHES = 1;
export const MAX_RUNNER_UP_MATCHES = 2;
export const MIN_DISPLAY_SCORE = 85;

// Holland code mappings for comparison
export const HOLLAND_CODES = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

// Score thresholds
export const SCORE_BANDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 0,
} as const;

// Partner tier numeric values for comparison
export const TIER_VALUES = {
  STANDARD: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
} as const;
