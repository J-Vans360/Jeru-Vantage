type AssessmentData = {
  section: any;
  domains: Array<{
    code: string;
    name: string;
    description: string;
    color: string;
  }>;
  questions: Array<{
    id: number;
    text: string;
    domain: string;
    reverse: boolean;
  }>;
  scoring: {
    method: string;
    reverseScoring: Record<string, number>;
    itemsPerDomain: number;
    minScore: number;
    maxScore: number;
    bands: {
      high: { min: number; max: number; label: string };
      mid: { min: number; max: number; label: string };
      low: { min: number; max: number; label: string };
    };
  };
};

type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  score: number;
  band: string;
  itemCount: number;
};

export function calculatePersonalityScores(
  answers: Record<number, number>,
  assessmentData: AssessmentData
) {
  const { questions, domains, scoring } = assessmentData;

  // Initialize domain scores
  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  // Calculate scores for each domain
  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer === undefined) return;

    // Apply reverse scoring if needed
    let score = answer;
    if (question.reverse) {
      score = scoring.reverseScoring[answer.toString()];
    }

    // Add to domain total
    if (domainScores[question.domain]) {
      domainScores[question.domain].total += score;
      domainScores[question.domain].count += 1;
    }
  });

  // Format results with band interpretations
  const results: DomainScore[] = domains.map((domain) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    // Determine band
    let band = 'Mid-range / Flexible';
    if (score >= scoring.bands.high.min) {
      band = scoring.bands.high.label;
    } else if (score <= scoring.bands.low.max) {
      band = scoring.bands.low.label;
    }

    return {
      code: domain.code,
      name: domain.name,
      description: domain.description,
      color: domain.color,
      score,
      band,
      itemCount: domainData.count,
    };
  });

  return {
    domains: results,
    timestamp: new Date().toISOString(),
  };
}
