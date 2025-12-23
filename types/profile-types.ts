// Types for Section 0: Student Profile

export type StudentProfileFormData = {
  // A. Demographics & Residency
  studentName: string;
  currentGrade: string;
  targetEntryYear: string;
  citizenshipPrimary: string;
  citizenshipSecondary?: string;
  countryResidence: string;
  
  // B. Financial Reality Check
  annualBudgetRange: string;
  needBasedAid: string;
  usApplicantStatus: string;
  
  // C. Educational System Context
  primaryCurriculum: string;
  curriculumOther?: string;
  
  // D. Academic Data
  subjects: StudentSubjectData[];
  
  // E. Standardized Testing
  ieltsScore?: number;
  toeflScore?: number;
  duolingoScore?: number;
  nativeEnglish: boolean;
  satTotal?: number;
  satMath?: number;
  satReadingWriting?: number;
  actComposite?: number;
  ucatBmatScore?: string;
  testPlanDate?: string;
  testOptional: boolean;
  
  // F. Learning & Disciplinary Context
  learningSupport: boolean;
  learningSupportDetails?: string;
  disciplinaryRecord: string;
  
  // G. Student Aspirations
  careerInterest1: string;
  careerInterest2?: string;
  careerInterest3?: string;
  destinationCountry1: string;
  destinationUniversities1?: string;
  destinationCountry2?: string;
  destinationUniversities2?: string;
  destinationCountry3?: string;
  destinationUniversities3?: string;
};

export type StudentSubjectData = {
  id?: string;
  subjectCategory: string;
  courseName: string;
  difficultyLevel: string;
  latestGrade: string;
  interestLevel: number; // 1-5
  displayOrder: number;
};

export type BudgetRange = 
  | '0-15000'
  | '15000-30000'
  | '30000-50000'
  | '50000-75000'
  | '75000+';

export type NeedBasedAid = 'required' | 'maybe' | 'no';

export type USStatus = 'us-citizen' | 'international';

export type Curriculum = 
  | 'ib-diploma'
  | 'british'
  | 'american'
  | 'indian'
  | 'other';

export type SubjectCategory = 
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Languages'
  | 'Social Studies'
  | 'Arts'
  | 'Technology'
  | 'Other';

export type DifficultyLevel = 
  | 'IB HL'
  | 'IB SL'
  | 'AP'
  | 'Honors'
  | 'Regular'
  | 'A-Level'
  | 'AS-Level';

export type DisciplinaryRecord = 'clean' | 'infraction';

// Budget labels for display
export const BUDGET_LABELS: Record<BudgetRange, string> = {
  '0-15000': '$0 - $15,000 (Full Scholarship / Financial Aid Required)',
  '15000-30000': '$15,000 - $30,000 (Significant Aid Required)',
  '30000-50000': '$30,000 - $50,000 (Partial Aid / Standard Budget)',
  '50000-75000': '$50,000 - $75,000 (Access to most Private Universities)',
  '75000+': '$75,000+ (Budget is not a major constraint)',
};

// Curriculum labels for display
export const CURRICULUM_LABELS: Record<Curriculum, string> = {
  'ib-diploma': 'IB Diploma (IBDP)',
  'british': 'British Pattern (A-Levels / IGCSE)',
  'american': 'American Curriculum (AP / High School Diploma)',
  'indian': 'Indian Curriculum (CBSE / ICSE)',
  'other': 'National Curriculum (Other)',
};

// Section names for progress tracking
export const SECTION_NAMES = [
  'Demographics & Residency',
  'Financial Reality Check',
  'Educational System Context',
  'Academic Data',
  'Standardized Testing',
  'Learning & Disciplinary Context',
  'Student Aspirations',
] as const;

export type SectionName = typeof SECTION_NAMES[number];