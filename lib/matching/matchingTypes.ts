export interface StudentProfile {
  id: string;

  // From Assessment Results
  hollandCode: string; // e.g., "RIA"
  hollandScores: HollandScore[]; // Individual RIASEC scores
  personalityScores: PersonalityScore[]; // Big 5 traits
  valuesTop3: string[]; // Top 3 values
  multipleIntelligences: IntelligenceScore[];
  skillsAverage: number; // 21st century skills avg
  executionScore: number; // Grit & execution %

  // From Profile / C1 (when available)
  gpa?: number;
  budgetMin?: number;
  budgetMax?: number;
  country: string;
  region?: string;
  preferredCountries?: string[];
  degreeLevel: 'BACHELORS' | 'MASTERS' | 'PHD';
  interestedFields?: string[]; // Keywords like "engineering", "medicine"

  // Test scores (optional)
  satScore?: number;
  ieltsScore?: number;
  toeflScore?: number;
}

export interface HollandScore {
  code: string; // R, I, A, S, E, C
  name: string; // Realistic, Investigative, etc.
  score: number; // 0-50
}

export interface PersonalityScore {
  trait: string; // O, C, E, A, N
  name: string; // Openness, Conscientiousness, etc.
  score: number; // 0-50
  band: string; // Low, Medium, High
}

export interface IntelligenceScore {
  type: string;
  score: number;
}

export interface UniversityProfile {
  id: string;
  name: string;
  country: string;
  state?: string;
  logo?: string;
  partnerTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

  // Criteria
  criteria: {
    minGPA?: number;
    minSATScore?: number;
    minIELTS?: number;
    minBudget?: number;
    maxBudget?: number;
    targetCountries: string[];
    targetHollandCodes: string[];
    targetPersonality?: PersonalityPreference[];
    minMatchScore: number; // Default 85
  };

  // Programs
  programs: ProgramProfile[];
}

export interface ProgramProfile {
  id: string;
  name: string;
  faculty: string;
  degree: 'BACHELORS' | 'MASTERS' | 'PHD';
  tuitionAnnual: number;
  hollandCodes: string[];
  keywords: string[];
}

export interface PersonalityPreference {
  trait: string;
  minScore?: number;
  maxScore?: number;
}

export interface MatchResult {
  universityId: string;
  university: UniversityProfile;
  programId?: string;
  program?: ProgramProfile;

  matchScore: number; // 0-100 overall
  componentScores: ComponentScores;
  matchReasons: MatchReason[];

  displayPriority: number; // Final ranking position
  isHeroMatch: boolean; // Top spot?
  isRunnerUp: boolean; // Secondary spot?
}

export interface ComponentScores {
  academicFit: number; // 0-100
  financialFit: number; // 0-100
  hollandFit: number; // 0-100
  geographicFit: number; // 0-100
  personalityFit: number; // 0-100
  programFit: number; // 0-100
}

export interface MatchReason {
  category:
    | 'academic'
    | 'financial'
    | 'interest'
    | 'location'
    | 'scholarship'
    | 'program';
  icon: string;
  title: string;
  description: string;
}
