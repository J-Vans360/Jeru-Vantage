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

export function calculateValuesScores(
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
    let band = 'Mid-range';
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

export function calculateHollandScores(
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
    let band = 'Mid-range';
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

  // Calculate Holland Code (top 3 domains by score)
  const sortedDomains = [...results].sort((a, b) => b.score - a.score);
  const hollandCode = sortedDomains.slice(0, 3).map((d) => d.code).join('');

  return {
    domains: results,
    hollandCode,
    topThree: sortedDomains.slice(0, 3),
    timestamp: new Date().toISOString(),
  };
}

export function calculateIntelligencesScores(
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
    let band = 'Moderate';
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

  // Calculate top 3 intelligences
  const sortedDomains = [...results].sort((a, b) => b.score - a.score);
  const topIntelligences = sortedDomains.slice(0, 3).map((d) => d.code).join('');

  return {
    domains: results,
    topIntelligences,
    topThree: sortedDomains.slice(0, 3),
    timestamp: new Date().toISOString(),
  };
}

export function calculateCognitiveScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, domains, scoring } = assessmentData;

  // Initialize domain scores
  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain: any) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  // Calculate scores for each domain
  questions.forEach((question: any) => {
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

  // Format results with spectrum interpretations
  const results = domains.map((domain: any) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    // Determine spectrum position and label
    let spectrumPosition = 'balanced'; // balanced, first, opposite
    let label = scoring.interpretation.balanced.label;

    if (score >= scoring.interpretation.high.min) {
      spectrumPosition = 'first';
      label = scoring.interpretation.high.label;
    } else if (score <= scoring.interpretation.low.max) {
      spectrumPosition = 'opposite';
      label = scoring.interpretation.low.label;
    }

    // Calculate percentage position on spectrum (0-100)
    // Score range is 10-50, map to 0-100 where:
    // 10 = 0% (far left, opposite style)
    // 30 = 50% (middle, balanced)
    // 50 = 100% (far right, first style)
    const percentage = ((score - scoring.minScore) / (scoring.maxScore - scoring.minScore)) * 100;

    return {
      code: domain.code,
      name: domain.name,
      description: domain.description,
      color: domain.color,
      opposite: domain.opposite,
      score,
      spectrumPosition,
      label,
      percentage,
      itemCount: domainData.count,
    };
  });

  return {
    domains: results,
    timestamp: new Date().toISOString(),
  };
}

export function calculateStressScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, domains, scoring } = assessmentData;

  // Initialize domain scores
  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain: any) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  // Calculate scores for each domain
  questions.forEach((question: any) => {
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
  const results = domains.map((domain: any) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    // Determine band
    let band = 'Secondary Response';
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
      icon: domain.icon,
      score,
      band,
      itemCount: domainData.count,
    };
  });

  // Find primary stress response (highest score)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  const primaryResponse = sortedResults[0];

  return {
    domains: results,
    primaryResponse,
    sortedResponses: sortedResults,
    timestamp: new Date().toISOString(),
  };
}

export function calculateSkillsScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, domains, categories, scoring } = assessmentData;

  // Initialize domain scores
  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain: any) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  // Calculate scores for each domain
  questions.forEach((question: any) => {
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
  const results = domains.map((domain: any) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    // Determine band
    let band = 'Developing';
    if (score >= scoring.bands.high.min) {
      band = scoring.bands.high.label;
    } else if (score <= scoring.bands.low.max) {
      band = scoring.bands.low.label;
    }

    return {
      code: domain.code,
      name: domain.name,
      category: domain.category,
      description: domain.description,
      color: domain.color,
      icon: domain.icon,
      score,
      band,
      itemCount: domainData.count,
    };
  });

  // Group results by category
  const categorizedResults: Record<string, any[]> = {};
  categories.forEach((category: any) => {
    categorizedResults[category.code] = results.filter(
      (r: any) => r.category === category.code
    );
  });

  // Calculate category averages
  const categoryAverages = categories.map((category: any) => {
    const categorySkills = categorizedResults[category.code];
    const avgScore = categorySkills.length > 0
      ? categorySkills.reduce((sum, skill) => sum + skill.score, 0) / categorySkills.length
      : 0;
    
    return {
      code: category.code,
      name: category.name,
      description: category.description,
      color: category.color,
      averageScore: Math.round(avgScore * 10) / 10,
      skills: categorySkills,
    };
  });

  return {
    domains: results,
    categorizedResults,
    categoryAverages,
    timestamp: new Date().toISOString(),
  };
}

export function calculateSocialCheckScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, scoring } = assessmentData;

  let totalScore = 0;

  // Calculate total score
  questions.forEach((question: any) => {
    const answer = answers[question.id];
    if (answer === undefined) return;

    // Apply reverse scoring if needed
    let score = answer;
    if (question.reverse) {
      score = scoring.reverseScoring[answer.toString()];
    }

    totalScore += score;
  });

  // Determine interpretation
  let interpretation = scoring.interpretation.authentic;
  if (totalScore >= scoring.interpretation.high.min) {
    interpretation = scoring.interpretation.high;
  } else if (totalScore >= scoring.interpretation.moderate.min) {
    interpretation = scoring.interpretation.moderate;
  }

  return {
    totalScore,
    interpretation: {
      label: interpretation.label,
      description: interpretation.description,
      range: `${interpretation.min}-${interpretation.max}`,
    },
    timestamp: new Date().toISOString(),
  };
}

export function calculateEnvironmentScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, domains, scoring } = assessmentData;

  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain: any) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  questions.forEach((question: any) => {
    const answer = answers[question.id];
    if (answer === undefined) return;

    let score = answer;
    if (question.reverse) {
      score = scoring.reverseScoring[answer.toString()];
    }

    if (domainScores[question.domain]) {
      domainScores[question.domain].total += score;
      domainScores[question.domain].count += 1;
    }
  });

  const results = domains.map((domain: any) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    const interpretations = scoring.interpretation[domain.code];
    let label = interpretations.mid.label;
    if (score >= interpretations.high.min) {
      label = interpretations.high.label;
    } else if (score <= interpretations.low.max) {
      label = interpretations.low.label;
    }

    return {
      code: domain.code,
      name: domain.name,
      description: domain.description,
      color: domain.color,
      icon: domain.icon,
      score,
      label,
      itemCount: domainData.count,
    };
  });

  return {
    domains: results,
    timestamp: new Date().toISOString(),
  };
}

export function calculateExecutionScores(
  answers: Record<number, number>,
  assessmentData: any
) {
  const { questions, domains, scoring } = assessmentData;

  const domainScores: Record<string, { total: number; count: number }> = {};
  domains.forEach((domain: any) => {
    domainScores[domain.code] = { total: 0, count: 0 };
  });

  questions.forEach((question: any) => {
    const answer = answers[question.id];
    if (answer === undefined) return;

    let score = answer;
    if (question.reverse) {
      score = scoring.reverseScoring[answer.toString()];
    }

    if (domainScores[question.domain]) {
      domainScores[question.domain].total += score;
      domainScores[question.domain].count += 1;
    }
  });

  const results = domains.map((domain: any) => {
    const domainData = domainScores[domain.code];
    const score = domainData.total;

    let band = 'Developing';
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
      icon: domain.icon,
      score,
      band,
      itemCount: domainData.count,
    };
  });

  const totalScore = results.reduce((sum: number, r: any) => sum + r.score, 0);
  const executionScore = Math.round((totalScore / (results.length * scoring.maxScore)) * 100);

  const areasNeedingFocus = results.filter((r: any) => r.band === 'Needs Focus');

  return {
    domains: results,
    executionScore,
    areasNeedingFocus,
    timestamp: new Date().toISOString(),
  };
}
