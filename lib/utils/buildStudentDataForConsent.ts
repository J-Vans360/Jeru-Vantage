interface StudentAssessmentData {
  user: {
    name: string;
    email: string;
  };
  profile: {
    country?: string;
    degreeLevel?: string;
    budgetMin?: number;
    budgetMax?: number;
    gpa?: number;
  } | null;
  assessmentResults: any[];
}

interface DataItem {
  id: string;
  category: 'identity' | 'academic' | 'interests' | 'financial' | 'skills' | 'assessment';
  label: string;
  value: string;
  level: 'basic' | 'enhanced' | 'full';
  required: boolean;
  sensitive: boolean;
  description?: string;
}

export function buildStudentDataForConsent(
  student: StudentAssessmentData,
  matchScore: number
): DataItem[] {
  const items: DataItem[] = [];

  // ============ BASIC LEVEL ============
  // Required items - cannot be toggled off
  items.push({
    id: 'name',
    category: 'identity',
    label: 'Full Name',
    value: student.user.name,
    level: 'basic',
    required: true,
    sensitive: false,
    description: 'Required for the university to address you properly',
  });

  items.push({
    id: 'email',
    category: 'identity',
    label: 'Email Address',
    value: student.user.email,
    level: 'basic',
    required: true,
    sensitive: false,
    description: 'Required for the university to contact you',
  });

  items.push({
    id: 'country',
    category: 'identity',
    label: 'Country',
    value: student.profile?.country || 'Not specified',
    level: 'basic',
    required: false,
    sensitive: false,
    description: 'Helps with visa and logistics planning',
  });

  items.push({
    id: 'degree_level',
    category: 'academic',
    label: 'Degree Level Seeking',
    value: formatDegreeLevel(student.profile?.degreeLevel),
    level: 'basic',
    required: false,
    sensitive: false,
    description: 'Ensures you receive relevant program information',
  });

  items.push({
    id: 'match_score',
    category: 'assessment',
    label: 'Match Score',
    value: `${matchScore}%`,
    level: 'basic',
    required: true,
    sensitive: false,
    description: 'Shows how well you fit their programs',
  });

  // ============ ENHANCED LEVEL ============
  const hollandResult = student.assessmentResults.find(
    (r) => r.domainName === 'Career Interests (Holland Code)'
  );

  if (hollandResult?.scores?.code) {
    items.push({
      id: 'holland_code',
      category: 'interests',
      label: 'Career Interest Code (RIASEC)',
      value: hollandResult.scores.code,
      level: 'enhanced',
      required: false,
      sensitive: false,
      description: 'Helps match you with suitable programs',
    });

    const topInterests = hollandResult.scores.domains
      ?.sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)
      .map((d: any) => d.name)
      .join(', ');

    if (topInterests) {
      items.push({
        id: 'top_interests',
        category: 'interests',
        label: 'Top 3 Career Interests',
        value: topInterests,
        level: 'enhanced',
        required: false,
        sensitive: false,
        description: 'Your strongest career interest areas',
      });
    }
  }

  const valuesResult = student.assessmentResults.find(
    (r) => r.domainName === 'Values & Interests'
  );

  if (valuesResult?.scores?.topValues) {
    const topValues = valuesResult.scores.topValues
      .slice(0, 3)
      .map((v: any) => v.name)
      .join(', ');

    items.push({
      id: 'top_values',
      category: 'interests',
      label: 'Top 3 Personal Values',
      value: topValues,
      level: 'enhanced',
      required: false,
      sensitive: true, // Marked as sensitive
      description: 'What matters most to you in life and career',
    });
  }

  // Budget - sensitive
  if (student.profile?.budgetMax) {
    items.push({
      id: 'budget_range',
      category: 'financial',
      label: 'Annual Budget Range',
      value: formatBudgetRange(student.profile.budgetMin, student.profile.budgetMax),
      level: 'enhanced',
      required: false,
      sensitive: true, // Marked as sensitive
      description: 'Helps identify affordable programs and scholarships',
    });
  }

  // Academic status (not exact GPA)
  items.push({
    id: 'academic_status',
    category: 'academic',
    label: 'Academic Qualification Status',
    value: getAcademicStatus(student.profile?.gpa),
    level: 'enhanced',
    required: false,
    sensitive: false,
    description: 'General academic standing (not your exact grades)',
  });

  // ============ FULL LEVEL ============
  const intelligencesResult = student.assessmentResults.find(
    (r) => r.domainName === 'Multiple Intelligences'
  );

  if (intelligencesResult?.scores?.domains) {
    const topIntelligences = intelligencesResult.scores.domains
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)
      .map((d: any) => d.name)
      .join(', ');

    items.push({
      id: 'multiple_intelligences',
      category: 'assessment',
      label: 'Top Learning Strengths',
      value: topIntelligences,
      level: 'full',
      required: false,
      sensitive: false,
      description: 'Your strongest intelligence types',
    });
  }

  const skillsResult = student.assessmentResults.find(
    (r) => r.domainName === '21st Century Skills'
  );

  if (skillsResult?.scores) {
    items.push({
      id: 'skills_summary',
      category: 'skills',
      label: '21st Century Skills Level',
      value: getSkillsLevel(skillsResult.scores),
      level: 'full',
      required: false,
      sensitive: false,
      description: 'Overall proficiency in modern skills',
    });
  }

  const executionResult = student.assessmentResults.find(
    (r) => r.domainName === 'Execution & Grit'
  );

  if (executionResult?.scores?.overallPercentage) {
    items.push({
      id: 'execution_score',
      category: 'assessment',
      label: 'Execution & Grit Score',
      value: `${executionResult.scores.overallPercentage}%`,
      level: 'full',
      required: false,
      sensitive: false,
      description: 'Your persistence and follow-through capability',
    });
  }

  return items;
}

// Helper functions
function formatDegreeLevel(level?: string): string {
  const labels: Record<string, string> = {
    BACHELORS: "Bachelor's Degree",
    MASTERS: "Master's Degree",
    PHD: 'PhD / Doctorate',
    DIPLOMA: 'Diploma',
    CERTIFICATE: 'Certificate',
  };
  return labels[level || ''] || 'Not specified';
}

function formatBudgetRange(min?: number, max?: number): string {
  if (!max) return 'Not specified';
  if (!min) return `Up to $${max.toLocaleString()}/year`;
  return `$${min.toLocaleString()} - $${max.toLocaleString()}/year`;
}

function getAcademicStatus(gpa?: number): string {
  if (!gpa) return 'Not provided';
  if (gpa >= 3.5) return 'Excellent Standing';
  if (gpa >= 3.0) return 'Good Standing';
  if (gpa >= 2.5) return 'Satisfactory Standing';
  return 'Review Required';
}

function getSkillsLevel(scores: any): string {
  const avg = scores.overallAvg || 0;
  const maxScore = 25;
  const percentage = (avg / maxScore) * 100;

  if (percentage >= 80) return 'Advanced';
  if (percentage >= 60) return 'Proficient';
  if (percentage >= 40) return 'Developing';
  return 'Emerging';
}

// Export helper to build simple student data object for consent modal
export function buildSimpleStudentData(student: StudentAssessmentData): {
  name: string;
  email: string;
  country: string;
  degreeLevel: string;
  hollandCode?: string;
  topValues?: string[];
  budgetRange?: string;
  topIntelligences?: string[];
  skillsProficiency?: string;
  executionGrit?: string;
} {
  const hollandResult = student.assessmentResults.find(
    (r) => r.domainName === 'Career Interests (Holland Code)'
  );
  const valuesResult = student.assessmentResults.find(
    (r) => r.domainName === 'Values & Interests'
  );
  const intelligencesResult = student.assessmentResults.find(
    (r) => r.domainName === 'Multiple Intelligences'
  );
  const skillsResult = student.assessmentResults.find(
    (r) => r.domainName === '21st Century Skills'
  );
  const executionResult = student.assessmentResults.find(
    (r) => r.domainName === 'Execution & Grit'
  );

  return {
    name: student.user.name,
    email: student.user.email,
    country: student.profile?.country || 'Not specified',
    degreeLevel: formatDegreeLevel(student.profile?.degreeLevel),
    hollandCode: hollandResult?.scores?.code,
    topValues: valuesResult?.scores?.topValues?.slice(0, 3).map((v: any) => v.name),
    budgetRange: formatBudgetRange(student.profile?.budgetMin, student.profile?.budgetMax),
    topIntelligences: intelligencesResult?.scores?.domains
      ?.sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)
      .map((d: any) => d.name),
    skillsProficiency: skillsResult?.scores ? getSkillsLevel(skillsResult.scores) : undefined,
    executionGrit: executionResult?.scores?.overallPercentage
      ? `${executionResult.scores.overallPercentage}%`
      : undefined,
  };
}
