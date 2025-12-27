import {
  StudentProfile,
  UniversityProfile,
  ProgramProfile,
  ComponentScores,
  MatchReason,
} from './matchingTypes';

/**
 * Calculate Holland Code fit between student and university/program
 * Compares student's RIASEC scores with target codes
 */
export function calculateHollandFit(
  student: StudentProfile,
  targetCodes: string[]
): number {
  if (!targetCodes.length) return 100; // No preference = automatic fit

  // Get student's top 3 Holland codes
  const studentTopCodes = [...student.hollandScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((h) => h.code);

  // Calculate overlap
  let matchCount = 0;
  let totalWeight = 0;

  targetCodes.forEach((code, index) => {
    const weight = 3 - index; // First code worth 3, second worth 2, third worth 1
    totalWeight += weight;

    const studentRank = studentTopCodes.indexOf(code);
    if (studentRank === 0) {
      matchCount += weight * 1.0; // Perfect match
    } else if (studentRank === 1) {
      matchCount += weight * 0.7; // Good match
    } else if (studentRank === 2) {
      matchCount += weight * 0.4; // Partial match
    }
    // Not in top 3 = 0 points
  });

  return Math.round((matchCount / totalWeight) * 100);
}

/**
 * Calculate academic fit based on GPA and test scores
 */
export function calculateAcademicFit(
  student: StudentProfile,
  criteria: UniversityProfile['criteria']
): number {
  const scores: number[] = [];

  // GPA check
  if (criteria.minGPA && student.gpa) {
    if (student.gpa >= criteria.minGPA) {
      // Bonus for exceeding minimum
      const excess = student.gpa - criteria.minGPA;
      scores.push(Math.min(100, 80 + excess * 20));
    } else {
      // Penalty for below minimum
      const deficit = criteria.minGPA - student.gpa;
      scores.push(Math.max(0, 80 - deficit * 40));
    }
  }

  // SAT check
  if (criteria.minSATScore && student.satScore) {
    if (student.satScore >= criteria.minSATScore) {
      scores.push(100);
    } else {
      const ratio = student.satScore / criteria.minSATScore;
      scores.push(Math.round(ratio * 100));
    }
  }

  // IELTS check
  if (criteria.minIELTS && student.ieltsScore) {
    if (student.ieltsScore >= criteria.minIELTS) {
      scores.push(100);
    } else {
      const ratio = student.ieltsScore / criteria.minIELTS;
      scores.push(Math.round(ratio * 100));
    }
  }

  // If no academic criteria or student data, neutral score
  if (scores.length === 0) return 75;

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Calculate financial fit based on budget vs tuition
 */
export function calculateFinancialFit(
  student: StudentProfile,
  program: ProgramProfile,
  criteria: UniversityProfile['criteria']
): number {
  const tuition = program.tuitionAnnual;

  // Check if student has budget info
  if (!student.budgetMax) {
    // No budget info - check if university has range preference
    if (criteria.minBudget && criteria.maxBudget) {
      return 70; // Neutral - unknown fit
    }
    return 80; // No constraints either way
  }

  // Student can afford it
  if (student.budgetMax >= tuition) {
    // Perfect fit if tuition is 60-90% of max budget (room for living expenses)
    const ratio = tuition / student.budgetMax;
    if (ratio >= 0.6 && ratio <= 0.9) {
      return 100; // Sweet spot
    } else if (ratio < 0.6) {
      return 90; // Can easily afford - good
    } else {
      return 85; // Tight but doable
    }
  }

  // Student budget is below tuition
  const shortfall = ((tuition - student.budgetMax) / tuition) * 100;
  if (shortfall <= 10) {
    return 70; // Might work with scholarship
  } else if (shortfall <= 25) {
    return 50; // Significant stretch
  }
  return 30; // Likely can't afford
}

/**
 * Calculate geographic fit
 */
export function calculateGeographicFit(
  student: StudentProfile,
  university: UniversityProfile
): number {
  const { targetCountries } = university.criteria;

  // University targets specific countries
  if (targetCountries.length > 0) {
    if (targetCountries.includes(student.country)) {
      return 100; // Student is in target region
    }
    return 50; // Student not in target region
  }

  // No geographic targeting - check student preference
  if (student.preferredCountries?.length) {
    if (student.preferredCountries.includes(university.country)) {
      return 100;
    }
    return 60; // University not in student's preferred list
  }

  return 80; // No preferences either way
}

/**
 * Calculate personality/culture fit
 */
export function calculatePersonalityFit(
  student: StudentProfile,
  criteria: UniversityProfile['criteria']
): number {
  if (!criteria.targetPersonality?.length) {
    return 80; // No preference
  }

  let totalScore = 0;
  let count = 0;

  criteria.targetPersonality.forEach((pref) => {
    const studentTrait = student.personalityScores.find(
      (p) => p.trait === pref.trait
    );
    if (!studentTrait) return;

    let traitScore = 100;

    if (pref.minScore && studentTrait.score < pref.minScore) {
      const deficit = pref.minScore - studentTrait.score;
      traitScore = Math.max(0, 100 - deficit * 4);
    }

    if (pref.maxScore && studentTrait.score > pref.maxScore) {
      const excess = studentTrait.score - pref.maxScore;
      traitScore = Math.max(0, 100 - excess * 4);
    }

    totalScore += traitScore;
    count++;
  });

  return count > 0 ? Math.round(totalScore / count) : 80;
}

/**
 * Calculate program-specific fit based on keywords
 */
export function calculateProgramFit(
  student: StudentProfile,
  program: ProgramProfile
): number {
  if (!student.interestedFields?.length || !program.keywords.length) {
    return 75; // No data to compare
  }

  const studentKeywords = student.interestedFields.map((k) => k.toLowerCase());
  const programKeywords = program.keywords.map((k) => k.toLowerCase());

  // Count matches
  const matches = studentKeywords.filter((sk) =>
    programKeywords.some((pk) => pk.includes(sk) || sk.includes(pk))
  ).length;

  if (matches === 0) return 50;

  const matchRatio =
    matches / Math.max(studentKeywords.length, programKeywords.length);
  return Math.round(50 + matchRatio * 50);
}

/**
 * Generate human-readable match reasons
 */
export function generateMatchReasons(
  student: StudentProfile,
  university: UniversityProfile,
  program: ProgramProfile,
  scores: ComponentScores
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Holland fit reason
  if (scores.hollandFit >= 80) {
    const sortedScores = [...student.hollandScores].sort(
      (a, b) => b.score - a.score
    );
    const topCode = sortedScores[0];
    if (topCode) {
      reasons.push({
        category: 'interest',
        icon: '🎯',
        title: 'Strong Career Match',
        description: `Their ${program.faculty} aligns with your "${topCode.name}" interests.`,
      });
    }
  }

  // Financial fit reason
  if (scores.financialFit >= 85) {
    reasons.push({
      category: 'financial',
      icon: '💰',
      title: 'Budget Friendly',
      description: `Tuition of $${program.tuitionAnnual.toLocaleString()} fits within your budget.`,
    });
  }

  // Academic fit reason
  if (scores.academicFit >= 90 && student.gpa) {
    reasons.push({
      category: 'academic',
      icon: '📚',
      title: 'Academic Match',
      description: `Your GPA of ${student.gpa} exceeds their requirements.`,
    });
  }

  // Geographic reason
  if (scores.geographicFit >= 90) {
    reasons.push({
      category: 'location',
      icon: '📍',
      title: 'Location Fit',
      description: `${university.country} is in your preferred study destinations.`,
    });
  }

  // Program specific
  if (scores.programFit >= 80) {
    reasons.push({
      category: 'program',
      icon: '🎓',
      title: 'Program Alignment',
      description: `${program.name} matches your field interests.`,
    });
  }

  return reasons.slice(0, 3); // Max 3 reasons displayed
}
