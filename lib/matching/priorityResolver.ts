import { MatchResult, UniversityProfile } from './matchingTypes';
import {
  TIER_ADVANTAGES,
  TIER_VALUES,
  MAX_HERO_MATCHES,
  MAX_RUNNER_UP_MATCHES,
  MIN_DISPLAY_SCORE,
} from './constants';

/**
 * Resolve priority when multiple universities match
 * Implements the 4-layer priority logic
 */
export function resolvePriorities(matches: MatchResult[]): MatchResult[] {
  // Filter out below-threshold matches
  let qualified = matches.filter((m) => m.matchScore >= MIN_DISPLAY_SCORE);

  if (qualified.length === 0) return [];

  // Sort by raw score first (highest to lowest)
  qualified.sort((a, b) => b.matchScore - a.matchScore);

  // Apply tier-based tie-breaking
  qualified = applyTierAdvantages(qualified);

  // Apply round-robin for exact ties
  qualified = applyRoundRobin(qualified);

  // Assign display priorities
  qualified = qualified.map((match, index) => ({
    ...match,
    displayPriority: index + 1,
    isHeroMatch: index < MAX_HERO_MATCHES,
    isRunnerUp:
      index >= MAX_HERO_MATCHES &&
      index < MAX_HERO_MATCHES + MAX_RUNNER_UP_MATCHES,
  }));

  // Return only displayable matches
  return qualified.slice(0, MAX_HERO_MATCHES + MAX_RUNNER_UP_MATCHES);
}

/**
 * Layer 2: Apply tier advantages for close scores
 */
function applyTierAdvantages(matches: MatchResult[]): MatchResult[] {
  if (matches.length < 2) return matches;

  const result = [...matches];

  // Compare adjacent pairs and swap if tier advantage applies
  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i];
    const next = result[i + 1];

    const scoreDiff = current.matchScore - next.matchScore;
    const nextTierAdvantage = TIER_ADVANTAGES[next.university.partnerTier];

    // If score difference is within the lower-ranked university's tier advantage
    if (scoreDiff <= nextTierAdvantage && scoreDiff > 0) {
      // Check if next has higher tier
      const currentTierValue = getTierValue(current.university.partnerTier);
      const nextTierValue = getTierValue(next.university.partnerTier);

      if (nextTierValue > currentTierValue) {
        // Swap - higher tier wins the tie
        [result[i], result[i + 1]] = [result[i + 1], result[i]];
      }
    }
  }

  return result;
}

/**
 * Layer 4: Round-robin for exact ties
 * Uses a deterministic rotation based on current timestamp
 */
function applyRoundRobin(matches: MatchResult[]): MatchResult[] {
  if (matches.length < 2) return matches;

  const result = [...matches];

  // Group exact ties (same score, same tier)
  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i];
    const next = result[i + 1];

    if (
      current.matchScore === next.matchScore &&
      current.university.partnerTier === next.university.partnerTier
    ) {
      // Exact tie - use rotation
      const rotationSeed = Math.floor(Date.now() / 1000 / 60); // Changes every minute
      const shouldSwap = rotationSeed % 2 === 0;

      if (shouldSwap) {
        [result[i], result[i + 1]] = [result[i + 1], result[i]];
      }
    }
  }

  return result;
}

/**
 * Get numeric value for tier comparison
 */
function getTierValue(tier: UniversityProfile['partnerTier']): number {
  return TIER_VALUES[tier];
}

/**
 * Check if a university passes the "Veto" filter
 * Returns false if student doesn't meet minimum requirements
 */
export function passesVetoFilter(
  studentGPA: number | undefined,
  studentBudget: number | undefined,
  criteria: UniversityProfile['criteria'],
  tuition: number
): { passes: boolean; reason?: string } {
  // GPA veto
  if (criteria.minGPA && studentGPA && studentGPA < criteria.minGPA * 0.9) {
    return {
      passes: false,
      reason: `GPA ${studentGPA} below minimum ${criteria.minGPA}`,
    };
  }

  // Budget veto - only veto if significantly below (>30% shortfall)
  if (studentBudget && studentBudget < tuition * 0.7) {
    return {
      passes: false,
      reason: `Budget $${studentBudget} significantly below tuition $${tuition}`,
    };
  }

  return { passes: true };
}

/**
 * Get all matches above a certain threshold for a student
 * Useful for showing "other options" beyond hero/runner-up
 */
export function getExtendedMatches(
  matches: MatchResult[],
  limit: number = 10
): MatchResult[] {
  return matches
    .filter((m) => m.matchScore >= MIN_DISPLAY_SCORE - 10) // Slightly lower threshold
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
