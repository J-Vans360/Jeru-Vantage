// Types
export * from './matchingTypes';

// Constants
export * from './constants';

// Core functions
export {
  findUniversityMatches,
  saveMatchResults,
  getCachedMatches,
} from './universityMatcher';

export {
  calculateHollandFit,
  calculateAcademicFit,
  calculateFinancialFit,
  calculateGeographicFit,
  calculatePersonalityFit,
  calculateProgramFit,
  generateMatchReasons,
} from './scoreCalculators';

export {
  resolvePriorities,
  passesVetoFilter,
  getExtendedMatches,
} from './priorityResolver';
