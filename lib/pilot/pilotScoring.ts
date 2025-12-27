import { PILOT_QUESTIONS, PILOT_DOMAINS, PilotQuestion, PilotDomain } from './pilotQuestions';

export interface SubDomainScore {
  id: string;
  name: string;
  score: number; // 0-100
  rawScore: number; // Sum of answers
  maxScore: number; // Max possible
  questionCount: number;
}

export interface DomainScore {
  id: string;
  name: string;
  icon: string;
  color: string;
  score: number; // 0-100 average
  subDomains: SubDomainScore[];
}

export interface PilotAssessmentScores {
  domains: DomainScore[];
  hollandCode: string; // e.g., "RIA"
  topStrengths: SubDomainScore[];
  developmentAreas: SubDomainScore[];
  overallProfile: {
    dominantTraits: string[];
    learningStyle: string;
    workStyle: string;
  };
}

// Calculate score for a single answer (1-5 Likert scale)
function calculateAnswerScore(answer: number, isReverse: boolean): number {
  if (isReverse) {
    // Reverse: 5->1, 4->2, 3->3, 2->4, 1->5
    return 6 - answer;
  }
  return answer;
}

// Calculate sub-domain score
function calculateSubDomainScore(
  subDomainId: string,
  responses: Record<string, number>
): SubDomainScore {
  const questions = PILOT_QUESTIONS.filter((q) => q.subDomainId === subDomainId);
  const domain = PILOT_DOMAINS.find((d) => d.subDomains.some((s) => s.id === subDomainId));
  const subDomain = domain?.subDomains.find((s) => s.id === subDomainId);

  let rawScore = 0;
  const maxScore = questions.length * 5; // Max is 5 per question

  questions.forEach((q) => {
    const answer = responses[q.id];
    if (answer !== undefined) {
      rawScore += calculateAnswerScore(answer, q.isReverse);
    }
  });

  const score = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

  return {
    id: subDomainId,
    name: subDomain?.name || subDomainId,
    score,
    rawScore,
    maxScore,
    questionCount: questions.length,
  };
}

// Calculate domain score
function calculateDomainScore(
  domain: PilotDomain,
  responses: Record<string, number>
): DomainScore {
  const subDomainScores = domain.subDomains.map((sub) =>
    calculateSubDomainScore(sub.id, responses)
  );

  // Average of sub-domain scores
  const avgScore =
    subDomainScores.length > 0
      ? Math.round(subDomainScores.reduce((sum, s) => sum + s.score, 0) / subDomainScores.length)
      : 0;

  return {
    id: domain.id,
    name: domain.name,
    icon: domain.icon,
    color: domain.color,
    score: avgScore,
    subDomains: subDomainScores,
  };
}

// Calculate Holland Code (RIASEC)
function calculateHollandCode(domainScores: DomainScore[]): string {
  const hollandDomain = domainScores.find((d) => d.id === 'holland');
  if (!hollandDomain) return 'XXX';

  // Map sub-domain IDs to RIASEC letters
  const riasecMap: Record<string, string> = {
    realistic: 'R',
    investigative: 'I',
    artistic: 'A',
    social: 'S',
    enterprising: 'E',
    conventional: 'C',
  };

  // Sort by score descending and take top 3
  const sorted = [...hollandDomain.subDomains]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return sorted.map((s) => riasecMap[s.id] || 'X').join('');
}

// Get top strengths (highest scoring sub-domains)
function getTopStrengths(domainScores: DomainScore[], count: number = 5): SubDomainScore[] {
  const allSubDomains = domainScores.flatMap((d) => d.subDomains);
  return [...allSubDomains].sort((a, b) => b.score - a.score).slice(0, count);
}

// Get development areas (lowest scoring sub-domains)
function getDevelopmentAreas(domainScores: DomainScore[], count: number = 5): SubDomainScore[] {
  const allSubDomains = domainScores.flatMap((d) => d.subDomains);
  return [...allSubDomains].sort((a, b) => a.score - b.score).slice(0, count);
}

// Determine learning style from cognitive domain
function determineLearningStyle(domainScores: DomainScore[]): string {
  const cognitive = domainScores.find((d) => d.id === 'cognitive');
  if (!cognitive) return 'Balanced';

  const styles: string[] = [];

  const analyticalScore =
    cognitive.subDomains.find((s) => s.id === 'analytical_intuitive')?.score || 50;
  const sequentialScore =
    cognitive.subDomains.find((s) => s.id === 'sequential_global')?.score || 50;
  const verbalScore = cognitive.subDomains.find((s) => s.id === 'verbal_visual')?.score || 50;
  const activeScore = cognitive.subDomains.find((s) => s.id === 'active_reflective')?.score || 50;

  if (analyticalScore > 60) styles.push('Analytical');
  else if (analyticalScore < 40) styles.push('Intuitive');

  if (sequentialScore > 60) styles.push('Sequential');
  else if (sequentialScore < 40) styles.push('Global');

  if (verbalScore > 60) styles.push('Verbal');
  else if (verbalScore < 40) styles.push('Visual');

  if (activeScore > 60) styles.push('Active');
  else if (activeScore < 40) styles.push('Reflective');

  return styles.length > 0 ? styles.join(', ') : 'Balanced';
}

// Determine work style from personality and values
function determineWorkStyle(domainScores: DomainScore[]): string {
  const personality = domainScores.find((d) => d.id === 'personality');
  const values = domainScores.find((d) => d.id === 'values');

  const traits: string[] = [];

  if (personality) {
    const extraversion =
      personality.subDomains.find((s) => s.id === 'extraversion')?.score || 50;
    const conscientiousness =
      personality.subDomains.find((s) => s.id === 'conscientiousness')?.score || 50;

    if (extraversion > 60) traits.push('Collaborative');
    else if (extraversion < 40) traits.push('Independent');

    if (conscientiousness > 60) traits.push('Structured');
    else if (conscientiousness < 40) traits.push('Flexible');
  }

  if (values) {
    const independence = values.subDomains.find((s) => s.id === 'independence')?.score || 50;
    const achievement = values.subDomains.find((s) => s.id === 'achievement')?.score || 50;

    if (independence > 60) traits.push('Autonomous');
    if (achievement > 70) traits.push('Achievement-Driven');
  }

  return traits.length > 0 ? traits.join(', ') : 'Adaptable';
}

// Get dominant personality traits
function getDominantTraits(domainScores: DomainScore[]): string[] {
  const traits: string[] = [];

  // From personality (Big 5)
  const personality = domainScores.find((d) => d.id === 'personality');
  if (personality) {
    personality.subDomains
      .filter((s) => s.score >= 70)
      .forEach((s) => traits.push(`High ${s.name}`));
  }

  // From Holland
  const holland = domainScores.find((d) => d.id === 'holland');
  if (holland) {
    const topHolland = [...holland.subDomains].sort((a, b) => b.score - a.score).slice(0, 2);
    topHolland.forEach((s) => traits.push(s.name));
  }

  return traits.slice(0, 5);
}

// Main scoring function
export function calculatePilotScores(
  responses: Record<string, number>
): PilotAssessmentScores {
  // Calculate all domain scores
  const domainScores = PILOT_DOMAINS.map((domain) =>
    calculateDomainScore(domain, responses)
  );

  // Calculate Holland Code
  const hollandCode = calculateHollandCode(domainScores);

  // Get strengths and development areas
  const topStrengths = getTopStrengths(domainScores);
  const developmentAreas = getDevelopmentAreas(domainScores);

  // Build overall profile
  const overallProfile = {
    dominantTraits: getDominantTraits(domainScores),
    learningStyle: determineLearningStyle(domainScores),
    workStyle: determineWorkStyle(domainScores),
  };

  return {
    domains: domainScores,
    hollandCode,
    topStrengths,
    developmentAreas,
    overallProfile,
  };
}

// Validate that all questions have been answered
export function validateResponses(responses: Record<string, number>): {
  isComplete: boolean;
  answeredCount: number;
  totalCount: number;
  missingQuestions: string[];
} {
  const totalCount = PILOT_QUESTIONS.length;
  const missingQuestions: string[] = [];

  PILOT_QUESTIONS.forEach((q) => {
    if (responses[q.id] === undefined) {
      missingQuestions.push(q.id);
    }
  });

  return {
    isComplete: missingQuestions.length === 0,
    answeredCount: totalCount - missingQuestions.length,
    totalCount,
    missingQuestions,
  };
}

// Get progress by domain
export function getProgressByDomain(responses: Record<string, number>): {
  domainId: string;
  domainName: string;
  answered: number;
  total: number;
  percentage: number;
}[] {
  return PILOT_DOMAINS.map((domain) => {
    const domainQuestions = PILOT_QUESTIONS.filter((q) => q.domainId === domain.id);
    const answered = domainQuestions.filter((q) => responses[q.id] !== undefined).length;

    return {
      domainId: domain.id,
      domainName: domain.name,
      answered,
      total: domainQuestions.length,
      percentage: Math.round((answered / domainQuestions.length) * 100),
    };
  });
}

// Get top intelligences from Multiple Intelligences domain
export function getTopIntelligences(domainScores: DomainScore[], count: number = 3): SubDomainScore[] {
  const intelligences = domainScores.find((d) => d.id === 'intelligences');
  if (!intelligences) return [];
  return [...intelligences.subDomains].sort((a, b) => b.score - a.score).slice(0, count);
}

// Get top values from Values domain
export function getTopValues(domainScores: DomainScore[], count: number = 3): SubDomainScore[] {
  const values = domainScores.find((d) => d.id === 'values');
  if (!values) return [];
  return [...values.subDomains].sort((a, b) => b.score - a.score).slice(0, count);
}

// Get cognitive style description
export function getCognitiveStyleDescription(domainScores: DomainScore[]): Record<string, string> {
  const cognitive = domainScores.find((d) => d.id === 'cognitive');
  if (!cognitive) return {};

  const descriptions: Record<string, string> = {};

  cognitive.subDomains.forEach((s) => {
    if (s.id === 'analytical_intuitive') {
      descriptions.thinking = s.score >= 50 ? 'Analytical' : 'Intuitive';
    } else if (s.id === 'sequential_global') {
      descriptions.learning = s.score >= 50 ? 'Sequential' : 'Global';
    } else if (s.id === 'verbal_visual') {
      descriptions.processing = s.score >= 50 ? 'Verbal' : 'Visual';
    } else if (s.id === 'active_reflective') {
      descriptions.action = s.score >= 50 ? 'Active' : 'Reflective';
    }
  });

  return descriptions;
}

// Get stress response profile
export function getStressResponseProfile(domainScores: DomainScore[]): SubDomainScore[] {
  const stress = domainScores.find((d) => d.id === 'stress');
  if (!stress) return [];
  return [...stress.subDomains].sort((a, b) => b.score - a.score);
}

// Get Big 5 personality summary
export function getPersonalitySummary(domainScores: DomainScore[]): Record<string, { score: number; level: string }> {
  const personality = domainScores.find((d) => d.id === 'personality');
  if (!personality) return {};

  const summary: Record<string, { score: number; level: string }> = {};

  personality.subDomains.forEach((s) => {
    let level: string;
    if (s.score >= 80) level = 'Very High';
    else if (s.score >= 60) level = 'High';
    else if (s.score >= 40) level = 'Moderate';
    else if (s.score >= 20) level = 'Low';
    else level = 'Very Low';

    summary[s.id] = { score: s.score, level };
  });

  return summary;
}

// Generate comprehensive profile summary
export function generateProfileSummary(scores: PilotAssessmentScores): {
  hollandCode: string;
  hollandDescription: string;
  topIntelligences: string[];
  topValues: string[];
  cognitiveStyle: Record<string, string>;
  dominantStressResponse: string;
  personalityHighlights: string[];
  overallStrength: string;
  careerSuggestions: string[];
} {
  const hollandDescriptions: Record<string, string> = {
    R: 'Realistic - Practical, hands-on problem solver',
    I: 'Investigative - Analytical thinker who loves research',
    A: 'Artistic - Creative and values self-expression',
    S: 'Social - Enjoys helping and working with people',
    E: 'Enterprising - Natural leader who persuades and manages',
    C: 'Conventional - Organized and detail-oriented',
  };

  const careerMap: Record<string, string[]> = {
    RIA: ['Engineer', 'Architect', 'Scientist', 'Technician'],
    RIS: ['Surgeon', 'Physical Therapist', 'Nurse', 'Paramedic'],
    RIC: ['Quality Analyst', 'Lab Technician', 'Machinist'],
    AIR: ['Research Scientist', 'Data Scientist', 'Professor'],
    AIS: ['Psychologist', 'Counselor', 'Art Therapist'],
    AIE: ['Product Designer', 'UX Researcher', 'Innovation Consultant'],
    SAI: ['Teacher', 'Social Worker', 'Counselor', 'Coach'],
    SAE: ['HR Manager', 'Training Director', 'Life Coach'],
    SEC: ['Administrative Manager', 'Office Manager', 'Executive Assistant'],
    EAS: ['Marketing Manager', 'PR Director', 'Event Planner'],
    ESC: ['Business Manager', 'Sales Director', 'Real Estate Agent'],
    CIA: ['Accountant', 'Financial Analyst', 'Auditor', 'Actuary'],
    CIR: ['Database Administrator', 'Systems Analyst', 'Network Admin'],
    CSE: ['Office Manager', 'Project Coordinator', 'Executive Assistant'],
  };

  const topIntelligences = getTopIntelligences(scores.domains).map((s) => s.name);
  const topValues = getTopValues(scores.domains).map((s) => s.name);
  const cognitiveStyle = getCognitiveStyleDescription(scores.domains);
  const stressProfile = getStressResponseProfile(scores.domains);
  const dominantStressResponse = stressProfile[0]?.name || 'Balanced';

  // Get personality highlights
  const personalityDomain = scores.domains.find((d) => d.id === 'personality');
  const personalityHighlights = personalityDomain
    ? [...personalityDomain.subDomains]
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((s) => s.name)
    : [];

  // Determine overall strength area
  const sortedDomains = [...scores.domains].sort((a, b) => b.score - a.score);
  const overallStrength = sortedDomains[0]?.name || 'Balanced';

  // Get career suggestions based on Holland Code
  const careerSuggestions = careerMap[scores.hollandCode] || ['Explore various career options'];

  // Build Holland description
  const hollandLetters = scores.hollandCode.split('');
  const hollandDescription = hollandLetters
    .map((letter) => hollandDescriptions[letter] || '')
    .filter(Boolean)
    .join('; ');

  return {
    hollandCode: scores.hollandCode,
    hollandDescription,
    topIntelligences,
    topValues,
    cognitiveStyle,
    dominantStressResponse,
    personalityHighlights,
    overallStrength,
    careerSuggestions,
  };
}
