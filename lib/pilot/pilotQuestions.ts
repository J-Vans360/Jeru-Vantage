export interface PilotQuestion {
  id: string;
  domain: string;
  domainId: string;
  subDomain: string;
  subDomainId: string;
  text: string;
  isReverse: boolean;
  order: number;
}

export interface PilotDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subDomains: PilotSubDomain[];
}

export interface PilotSubDomain {
  id: string;
  name: string;
  description: string;
}

// ============ DOMAIN DEFINITIONS ============

export const PILOT_DOMAINS: PilotDomain[] = [
  {
    id: 'personality',
    name: 'Personality Architecture',
    description: 'Understanding your Big 5 personality traits',
    icon: '🧠',
    color: '#3b82f6',
    subDomains: [
      { id: 'openness', name: 'Openness', description: 'Curiosity and openness to new experiences' },
      { id: 'conscientiousness', name: 'Conscientiousness', description: 'Organization and dependability' },
      { id: 'extraversion', name: 'Extraversion', description: 'Energy from social interactions' },
      { id: 'agreeableness', name: 'Agreeableness', description: 'Cooperation and compassion' },
      { id: 'neuroticism', name: 'Emotional Stability', description: 'Emotional resilience and stability' },
    ],
  },
  {
    id: 'values',
    name: 'Values & Interests',
    description: 'What matters most to you in life and career',
    icon: '💎',
    color: '#8b5cf6',
    subDomains: [
      { id: 'achievement', name: 'Achievement', description: 'Drive for accomplishment and success' },
      { id: 'relationships', name: 'Relationships', description: 'Importance of connections with others' },
      { id: 'security', name: 'Security', description: 'Need for stability and safety' },
      { id: 'independence', name: 'Independence', description: 'Value of autonomy and freedom' },
      { id: 'creativity', name: 'Creativity', description: 'Expression and innovation' },
      { id: 'service', name: 'Service', description: 'Helping others and contributing to society' },
    ],
  },
  {
    id: 'holland',
    name: 'Career Interests (Holland)',
    description: 'Your RIASEC career personality code',
    icon: '🎯',
    color: '#10b981',
    subDomains: [
      { id: 'realistic', name: 'Realistic', description: 'Hands-on, practical work' },
      { id: 'investigative', name: 'Investigative', description: 'Research and analysis' },
      { id: 'artistic', name: 'Artistic', description: 'Creative expression' },
      { id: 'social', name: 'Social', description: 'Helping and teaching others' },
      { id: 'enterprising', name: 'Enterprising', description: 'Leading and persuading' },
      { id: 'conventional', name: 'Conventional', description: 'Organizing and data management' },
    ],
  },
  {
    id: 'intelligences',
    name: 'Multiple Intelligences',
    description: 'Your unique combination of intelligence types',
    icon: '✨',
    color: '#f59e0b',
    subDomains: [
      { id: 'linguistic', name: 'Linguistic', description: 'Word and language intelligence' },
      { id: 'logical', name: 'Logical-Mathematical', description: 'Numbers and reasoning' },
      { id: 'spatial', name: 'Spatial', description: 'Visual and spatial awareness' },
      { id: 'musical', name: 'Musical', description: 'Rhythm and sound intelligence' },
      { id: 'bodily', name: 'Bodily-Kinesthetic', description: 'Physical coordination and movement' },
      { id: 'interpersonal', name: 'Interpersonal', description: 'Understanding others' },
      { id: 'intrapersonal', name: 'Intrapersonal', description: 'Self-understanding' },
      { id: 'naturalistic', name: 'Naturalistic', description: 'Nature and environment awareness' },
    ],
  },
  {
    id: 'cognitive',
    name: 'Cognitive Style',
    description: 'How you process information and learn',
    icon: '🔮',
    color: '#ec4899',
    subDomains: [
      { id: 'analytical_intuitive', name: 'Analytical vs Intuitive', description: 'Logic vs gut feeling' },
      { id: 'sequential_global', name: 'Sequential vs Global', description: 'Step-by-step vs big picture' },
      { id: 'verbal_visual', name: 'Verbal vs Visual', description: 'Words vs images' },
      { id: 'active_reflective', name: 'Active vs Reflective', description: 'Doing vs thinking' },
    ],
  },
  {
    id: 'stress',
    name: 'Stress Response',
    description: 'How you handle pressure and challenges',
    icon: '🛡️',
    color: '#06b6d4',
    subDomains: [
      { id: 'problem_focused', name: 'Problem-Focused', description: 'Taking action to solve problems' },
      { id: 'emotion_focused', name: 'Emotion-Focused', description: 'Managing emotional responses' },
      { id: 'support_seeking', name: 'Support-Seeking', description: 'Reaching out to others for help' },
      { id: 'avoidance', name: 'Avoidance', description: 'Tendency to avoid stressors' },
    ],
  },
  {
    id: 'skills',
    name: '21st Century Skills',
    description: 'Essential skills for the modern world',
    icon: '⚡',
    color: '#84cc16',
    subDomains: [
      { id: 'critical_thinking', name: 'Critical Thinking', description: 'Analyzing and evaluating information' },
      { id: 'creativity_skill', name: 'Creativity', description: 'Generating innovative ideas' },
      { id: 'collaboration', name: 'Collaboration', description: 'Working effectively with others' },
      { id: 'communication', name: 'Communication', description: 'Expressing ideas clearly' },
      { id: 'information_literacy', name: 'Information Literacy', description: 'Finding and using information' },
      { id: 'media_literacy', name: 'Media Literacy', description: 'Understanding media messages' },
      { id: 'technology_literacy', name: 'Technology Literacy', description: 'Using technology effectively' },
      { id: 'financial_literacy', name: 'Financial Literacy', description: 'Managing money and finances' },
      { id: 'flexibility', name: 'Flexibility', description: 'Adapting to change' },
      { id: 'initiative', name: 'Initiative', description: 'Taking action proactively' },
      { id: 'social_skills', name: 'Social Skills', description: 'Navigating social situations' },
      { id: 'productivity', name: 'Productivity', description: 'Managing time and output' },
    ],
  },
  {
    id: 'execution',
    name: 'Execution & Grit',
    description: 'Your ability to follow through and persist',
    icon: '🚀',
    color: '#f97316',
    subDomains: [
      { id: 'goal_setting', name: 'Goal Setting', description: 'Defining clear objectives' },
      { id: 'planning', name: 'Planning', description: 'Creating actionable plans' },
      { id: 'persistence', name: 'Persistence', description: 'Continuing despite obstacles' },
      { id: 'self_discipline', name: 'Self-Discipline', description: 'Controlling impulses and staying focused' },
      { id: 'time_management', name: 'Time Management', description: 'Using time effectively' },
      { id: 'growth_mindset', name: 'Growth Mindset', description: 'Believing abilities can develop' },
    ],
  },
];

// Calculate total sub-domains
export const TOTAL_SUBDOMAINS = PILOT_DOMAINS.reduce(
  (sum, domain) => sum + domain.subDomains.length,
  0
); // Should be 51

export const QUESTIONS_PER_SUBDOMAIN = 3;
export const TOTAL_PILOT_QUESTIONS = TOTAL_SUBDOMAINS * QUESTIONS_PER_SUBDOMAIN; // 153

// ============ PILOT QUESTIONS (153 total) ============

export const PILOT_QUESTIONS: PilotQuestion[] = [
  // ==========================================
  // DOMAIN 1: PERSONALITY (Big 5) - 15 questions
  // ==========================================

  // Openness (3)
  { id: 'P_O_1', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Openness', subDomainId: 'openness', text: 'I enjoy exploring new ideas and concepts, even if they seem unconventional.', isReverse: false, order: 1 },
  { id: 'P_O_2', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Openness', subDomainId: 'openness', text: 'I am curious about many different things and enjoy learning about various topics.', isReverse: false, order: 2 },
  { id: 'P_O_3', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Openness', subDomainId: 'openness', text: 'I prefer sticking to familiar routines rather than trying new approaches.', isReverse: true, order: 3 },

  // Conscientiousness (3)
  { id: 'P_C_1', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Conscientiousness', subDomainId: 'conscientiousness', text: 'I always complete my tasks thoroughly and on time.', isReverse: false, order: 4 },
  { id: 'P_C_2', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Conscientiousness', subDomainId: 'conscientiousness', text: 'I keep my belongings and workspace organized and tidy.', isReverse: false, order: 5 },
  { id: 'P_C_3', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Conscientiousness', subDomainId: 'conscientiousness', text: 'I often leave tasks unfinished or forget about commitments.', isReverse: true, order: 6 },

  // Extraversion (3)
  { id: 'P_E_1', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Extraversion', subDomainId: 'extraversion', text: 'I feel energized after spending time with groups of people.', isReverse: false, order: 7 },
  { id: 'P_E_2', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Extraversion', subDomainId: 'extraversion', text: 'I enjoy being the center of attention in social situations.', isReverse: false, order: 8 },
  { id: 'P_E_3', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Extraversion', subDomainId: 'extraversion', text: 'I prefer quiet evenings alone over social gatherings.', isReverse: true, order: 9 },

  // Agreeableness (3)
  { id: 'P_A_1', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Agreeableness', subDomainId: 'agreeableness', text: 'I go out of my way to help others, even when it inconveniences me.', isReverse: false, order: 10 },
  { id: 'P_A_2', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Agreeableness', subDomainId: 'agreeableness', text: 'I believe most people are fundamentally good and trustworthy.', isReverse: false, order: 11 },
  { id: 'P_A_3', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Agreeableness', subDomainId: 'agreeableness', text: "I tend to be skeptical of others' intentions and motives.", isReverse: true, order: 12 },

  // Neuroticism / Emotional Stability (3)
  { id: 'P_N_1', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Emotional Stability', subDomainId: 'neuroticism', text: 'I remain calm and composed even in stressful situations.', isReverse: false, order: 13 },
  { id: 'P_N_2', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Emotional Stability', subDomainId: 'neuroticism', text: 'I recover quickly from setbacks and disappointments.', isReverse: false, order: 14 },
  { id: 'P_N_3', domain: 'Personality Architecture', domainId: 'personality', subDomain: 'Emotional Stability', subDomainId: 'neuroticism', text: 'I often worry about things that might go wrong.', isReverse: true, order: 15 },

  // ==========================================
  // DOMAIN 2: VALUES & INTERESTS - 18 questions
  // ==========================================

  // Achievement (3)
  { id: 'V_ACH_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Achievement', subDomainId: 'achievement', text: 'Being recognized for my accomplishments is very important to me.', isReverse: false, order: 16 },
  { id: 'V_ACH_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Achievement', subDomainId: 'achievement', text: 'I set ambitious goals and work hard to achieve them.', isReverse: false, order: 17 },
  { id: 'V_ACH_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Achievement', subDomainId: 'achievement', text: 'I am content with average results as long as I tried my best.', isReverse: true, order: 18 },

  // Relationships (3)
  { id: 'V_REL_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Relationships', subDomainId: 'relationships', text: 'Building strong personal relationships is one of my top priorities.', isReverse: false, order: 19 },
  { id: 'V_REL_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Relationships', subDomainId: 'relationships', text: 'I would choose a lower-paying job if it meant more time with loved ones.', isReverse: false, order: 20 },
  { id: 'V_REL_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Relationships', subDomainId: 'relationships', text: 'Career success matters more to me than maintaining friendships.', isReverse: true, order: 21 },

  // Security (3)
  { id: 'V_SEC_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Security', subDomainId: 'security', text: 'Having a stable, predictable career path is very important to me.', isReverse: false, order: 22 },
  { id: 'V_SEC_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Security', subDomainId: 'security', text: 'Financial security is a major factor in my career decisions.', isReverse: false, order: 23 },
  { id: 'V_SEC_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Security', subDomainId: 'security', text: 'I am comfortable taking risks even if it means uncertain outcomes.', isReverse: true, order: 24 },

  // Independence (3)
  { id: 'V_IND_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Independence', subDomainId: 'independence', text: 'I value having the freedom to make my own decisions at work.', isReverse: false, order: 25 },
  { id: 'V_IND_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Independence', subDomainId: 'independence', text: 'I prefer working autonomously rather than being closely supervised.', isReverse: false, order: 26 },
  { id: 'V_IND_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Independence', subDomainId: 'independence', text: 'I prefer having clear instructions rather than figuring things out myself.', isReverse: true, order: 27 },

  // Creativity (3)
  { id: 'V_CRE_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Creativity', subDomainId: 'creativity', text: 'Expressing my creativity is essential to my sense of fulfillment.', isReverse: false, order: 28 },
  { id: 'V_CRE_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Creativity', subDomainId: 'creativity', text: 'I enjoy work that allows me to innovate and create new things.', isReverse: false, order: 29 },
  { id: 'V_CRE_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Creativity', subDomainId: 'creativity', text: 'I prefer structured work with established procedures over creative tasks.', isReverse: true, order: 30 },

  // Service (3)
  { id: 'V_SER_1', domain: 'Values & Interests', domainId: 'values', subDomain: 'Service', subDomainId: 'service', text: "Making a positive difference in others' lives is my primary motivation.", isReverse: false, order: 31 },
  { id: 'V_SER_2', domain: 'Values & Interests', domainId: 'values', subDomain: 'Service', subDomainId: 'service', text: 'I would take a pay cut to work for a cause I believe in.', isReverse: false, order: 32 },
  { id: 'V_SER_3', domain: 'Values & Interests', domainId: 'values', subDomain: 'Service', subDomainId: 'service', text: 'Personal financial gain is more important than helping others.', isReverse: true, order: 33 },

  // ==========================================
  // DOMAIN 3: CAREER INTERESTS (HOLLAND) - 18 questions
  // ==========================================

  // Realistic (3)
  { id: 'H_R_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Realistic', subDomainId: 'realistic', text: 'I enjoy working with my hands to build or fix things.', isReverse: false, order: 34 },
  { id: 'H_R_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Realistic', subDomainId: 'realistic', text: 'I prefer outdoor activities and physical work over desk jobs.', isReverse: false, order: 35 },
  { id: 'H_R_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Realistic', subDomainId: 'realistic', text: 'I would rather analyze data on a computer than operate machinery.', isReverse: true, order: 36 },

  // Investigative (3)
  { id: 'H_I_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Investigative', subDomainId: 'investigative', text: 'I enjoy solving complex problems through research and analysis.', isReverse: false, order: 37 },
  { id: 'H_I_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Investigative', subDomainId: 'investigative', text: 'I am fascinated by scientific discoveries and theories.', isReverse: false, order: 38 },
  { id: 'H_I_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Investigative', subDomainId: 'investigative', text: 'I find detailed research and investigation tedious and boring.', isReverse: true, order: 39 },

  // Artistic (3)
  { id: 'H_A_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Artistic', subDomainId: 'artistic', text: 'I express myself best through art, music, or creative writing.', isReverse: false, order: 40 },
  { id: 'H_A_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Artistic', subDomainId: 'artistic', text: 'I am drawn to careers that allow creative freedom and self-expression.', isReverse: false, order: 41 },
  { id: 'H_A_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Artistic', subDomainId: 'artistic', text: 'I prefer careers with clear rules over those requiring artistic judgment.', isReverse: true, order: 42 },

  // Social (3)
  { id: 'H_S_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Social', subDomainId: 'social', text: 'I find great satisfaction in helping others learn and grow.', isReverse: false, order: 43 },
  { id: 'H_S_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Social', subDomainId: 'social', text: 'I am drawn to careers in teaching, counseling, or healthcare.', isReverse: false, order: 44 },
  { id: 'H_S_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Social', subDomainId: 'social', text: 'I would rather work with data or machines than with people.', isReverse: true, order: 45 },

  // Enterprising (3)
  { id: 'H_E_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Enterprising', subDomainId: 'enterprising', text: 'I enjoy persuading and influencing others to achieve goals.', isReverse: false, order: 46 },
  { id: 'H_E_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Enterprising', subDomainId: 'enterprising', text: 'I am interested in starting my own business someday.', isReverse: false, order: 47 },
  { id: 'H_E_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Enterprising', subDomainId: 'enterprising', text: 'I prefer following instructions rather than leading projects.', isReverse: true, order: 48 },

  // Conventional (3)
  { id: 'H_C_1', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Conventional', subDomainId: 'conventional', text: 'I enjoy organizing information and maintaining accurate records.', isReverse: false, order: 49 },
  { id: 'H_C_2', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Conventional', subDomainId: 'conventional', text: 'I am detail-oriented and thrive in structured environments.', isReverse: false, order: 50 },
  { id: 'H_C_3', domain: 'Career Interests (Holland)', domainId: 'holland', subDomain: 'Conventional', subDomainId: 'conventional', text: 'I dislike repetitive tasks that require attention to detail.', isReverse: true, order: 51 },

  // ==========================================
  // DOMAIN 4: MULTIPLE INTELLIGENCES - 24 questions
  // ==========================================

  // Linguistic (3)
  { id: 'MI_L_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Linguistic', subDomainId: 'linguistic', text: 'I express myself easily and effectively through writing.', isReverse: false, order: 52 },
  { id: 'MI_L_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Linguistic', subDomainId: 'linguistic', text: 'I enjoy reading books, articles, and other written materials.', isReverse: false, order: 53 },
  { id: 'MI_L_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Linguistic', subDomainId: 'linguistic', text: 'I struggle to find the right words to express my thoughts.', isReverse: true, order: 54 },

  // Logical-Mathematical (3)
  { id: 'MI_LM_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Logical-Mathematical', subDomainId: 'logical', text: 'I enjoy solving mathematical problems and puzzles.', isReverse: false, order: 55 },
  { id: 'MI_LM_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Logical-Mathematical', subDomainId: 'logical', text: 'I think in logical, step-by-step sequences.', isReverse: false, order: 56 },
  { id: 'MI_LM_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Logical-Mathematical', subDomainId: 'logical', text: 'Numbers and mathematical concepts confuse me.', isReverse: true, order: 57 },

  // Spatial (3)
  { id: 'MI_S_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Spatial', subDomainId: 'spatial', text: 'I can easily visualize objects from different angles in my mind.', isReverse: false, order: 58 },
  { id: 'MI_S_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Spatial', subDomainId: 'spatial', text: 'I have a good sense of direction and rarely get lost.', isReverse: false, order: 59 },
  { id: 'MI_S_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Spatial', subDomainId: 'spatial', text: 'I find it difficult to read maps or visualize spatial layouts.', isReverse: true, order: 60 },

  // Musical (3)
  { id: 'MI_M_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Musical', subDomainId: 'musical', text: 'I can easily recognize and remember melodies and rhythms.', isReverse: false, order: 61 },
  { id: 'MI_M_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Musical', subDomainId: 'musical', text: 'I often find myself humming, tapping, or moving to music.', isReverse: false, order: 62 },
  { id: 'MI_M_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Musical', subDomainId: 'musical', text: 'I have difficulty distinguishing between different musical tones.', isReverse: true, order: 63 },

  // Bodily-Kinesthetic (3)
  { id: 'MI_BK_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Bodily-Kinesthetic', subDomainId: 'bodily', text: 'I learn best by doing and physically engaging with materials.', isReverse: false, order: 64 },
  { id: 'MI_BK_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Bodily-Kinesthetic', subDomainId: 'bodily', text: 'I am well-coordinated and excel at sports or physical activities.', isReverse: false, order: 65 },
  { id: 'MI_BK_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Bodily-Kinesthetic', subDomainId: 'bodily', text: 'I prefer sitting still and thinking over physical activity.', isReverse: true, order: 66 },

  // Interpersonal (3)
  { id: 'MI_INTER_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Interpersonal', subDomainId: 'interpersonal', text: 'I can easily sense the moods and feelings of others.', isReverse: false, order: 67 },
  { id: 'MI_INTER_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Interpersonal', subDomainId: 'interpersonal', text: 'People often come to me for advice about their problems.', isReverse: false, order: 68 },
  { id: 'MI_INTER_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Interpersonal', subDomainId: 'interpersonal', text: "I often misread social cues and others' emotions.", isReverse: true, order: 69 },

  // Intrapersonal (3)
  { id: 'MI_INTRA_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Intrapersonal', subDomainId: 'intrapersonal', text: 'I have a clear understanding of my own strengths and weaknesses.', isReverse: false, order: 70 },
  { id: 'MI_INTRA_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Intrapersonal', subDomainId: 'intrapersonal', text: 'I regularly reflect on my thoughts, feelings, and behaviors.', isReverse: false, order: 71 },
  { id: 'MI_INTRA_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Intrapersonal', subDomainId: 'intrapersonal', text: 'I rarely think about why I feel or act the way I do.', isReverse: true, order: 72 },

  // Naturalistic (3)
  { id: 'MI_N_1', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Naturalistic', subDomainId: 'naturalistic', text: 'I feel a deep connection to nature and the environment.', isReverse: false, order: 73 },
  { id: 'MI_N_2', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Naturalistic', subDomainId: 'naturalistic', text: 'I can easily identify and categorize plants, animals, or natural patterns.', isReverse: false, order: 74 },
  { id: 'MI_N_3', domain: 'Multiple Intelligences', domainId: 'intelligences', subDomain: 'Naturalistic', subDomainId: 'naturalistic', text: 'I have little interest in nature, wildlife, or environmental issues.', isReverse: true, order: 75 },

  // ==========================================
  // DOMAIN 5: COGNITIVE STYLE - 12 questions
  // ==========================================

  // Analytical vs Intuitive (3)
  { id: 'CS_AI_1', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Analytical vs Intuitive', subDomainId: 'analytical_intuitive', text: 'I prefer to analyze all the facts before making a decision.', isReverse: false, order: 76 },
  { id: 'CS_AI_2', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Analytical vs Intuitive', subDomainId: 'analytical_intuitive', text: 'I make decisions based on logical reasoning rather than gut feelings.', isReverse: false, order: 77 },
  { id: 'CS_AI_3', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Analytical vs Intuitive', subDomainId: 'analytical_intuitive', text: 'I often trust my instincts more than detailed analysis.', isReverse: true, order: 78 },

  // Sequential vs Global (3)
  { id: 'CS_SG_1', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Sequential vs Global', subDomainId: 'sequential_global', text: 'I prefer to learn things in a step-by-step, logical order.', isReverse: false, order: 79 },
  { id: 'CS_SG_2', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Sequential vs Global', subDomainId: 'sequential_global', text: 'I need to see how the pieces connect before I can solve a problem.', isReverse: false, order: 80 },
  { id: 'CS_SG_3', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Sequential vs Global', subDomainId: 'sequential_global', text: 'I like to understand the big picture before focusing on details.', isReverse: true, order: 81 },

  // Verbal vs Visual (3)
  { id: 'CS_VV_1', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Verbal vs Visual', subDomainId: 'verbal_visual', text: 'I understand explanations better when they are written out.', isReverse: false, order: 82 },
  { id: 'CS_VV_2', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Verbal vs Visual', subDomainId: 'verbal_visual', text: 'I remember information better when I read it than when I see diagrams.', isReverse: false, order: 83 },
  { id: 'CS_VV_3', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Verbal vs Visual', subDomainId: 'verbal_visual', text: 'I prefer charts, diagrams, and visual representations over text.', isReverse: true, order: 84 },

  // Active vs Reflective (3)
  { id: 'CS_AR_1', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Active vs Reflective', subDomainId: 'active_reflective', text: 'I learn best by trying things out and experimenting.', isReverse: false, order: 85 },
  { id: 'CS_AR_2', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Active vs Reflective', subDomainId: 'active_reflective', text: 'I prefer to dive into tasks rather than planning extensively first.', isReverse: false, order: 86 },
  { id: 'CS_AR_3', domain: 'Cognitive Style', domainId: 'cognitive', subDomain: 'Active vs Reflective', subDomainId: 'active_reflective', text: 'I need time to think things through before taking action.', isReverse: true, order: 87 },

  // ==========================================
  // DOMAIN 6: STRESS RESPONSE - 12 questions
  // ==========================================

  // Problem-Focused (3)
  { id: 'SR_PF_1', domain: 'Stress Response', domainId: 'stress', subDomain: 'Problem-Focused', subDomainId: 'problem_focused', text: 'When stressed, I focus on finding practical solutions to the problem.', isReverse: false, order: 88 },
  { id: 'SR_PF_2', domain: 'Stress Response', domainId: 'stress', subDomain: 'Problem-Focused', subDomainId: 'problem_focused', text: 'I make action plans to deal with challenges I face.', isReverse: false, order: 89 },
  { id: 'SR_PF_3', domain: 'Stress Response', domainId: 'stress', subDomain: 'Problem-Focused', subDomainId: 'problem_focused', text: 'I feel helpless when faced with difficult situations.', isReverse: true, order: 90 },

  // Emotion-Focused (3)
  { id: 'SR_EF_1', domain: 'Stress Response', domainId: 'stress', subDomain: 'Emotion-Focused', subDomainId: 'emotion_focused', text: 'I try to manage my emotional response to stressful situations.', isReverse: false, order: 91 },
  { id: 'SR_EF_2', domain: 'Stress Response', domainId: 'stress', subDomain: 'Emotion-Focused', subDomainId: 'emotion_focused', text: 'I use relaxation techniques or hobbies to cope with stress.', isReverse: false, order: 92 },
  { id: 'SR_EF_3', domain: 'Stress Response', domainId: 'stress', subDomain: 'Emotion-Focused', subDomainId: 'emotion_focused', text: 'I struggle to control my emotions when under pressure.', isReverse: true, order: 93 },

  // Support-Seeking (3)
  { id: 'SR_SS_1', domain: 'Stress Response', domainId: 'stress', subDomain: 'Support-Seeking', subDomainId: 'support_seeking', text: 'I reach out to friends or family when I need help coping.', isReverse: false, order: 94 },
  { id: 'SR_SS_2', domain: 'Stress Response', domainId: 'stress', subDomain: 'Support-Seeking', subDomainId: 'support_seeking', text: 'Talking to others about my problems helps me feel better.', isReverse: false, order: 95 },
  { id: 'SR_SS_3', domain: 'Stress Response', domainId: 'stress', subDomain: 'Support-Seeking', subDomainId: 'support_seeking', text: 'I prefer to handle my problems alone without involving others.', isReverse: true, order: 96 },

  // Avoidance (3)
  { id: 'SR_AV_1', domain: 'Stress Response', domainId: 'stress', subDomain: 'Avoidance', subDomainId: 'avoidance', text: 'I sometimes distract myself to avoid thinking about problems.', isReverse: false, order: 97 },
  { id: 'SR_AV_2', domain: 'Stress Response', domainId: 'stress', subDomain: 'Avoidance', subDomainId: 'avoidance', text: 'I tend to postpone dealing with difficult situations.', isReverse: false, order: 98 },
  { id: 'SR_AV_3', domain: 'Stress Response', domainId: 'stress', subDomain: 'Avoidance', subDomainId: 'avoidance', text: 'I confront challenges head-on rather than avoiding them.', isReverse: true, order: 99 },

  // ==========================================
  // DOMAIN 7: 21ST CENTURY SKILLS - 36 questions
  // ==========================================

  // Critical Thinking (3)
  { id: 'SK_CT_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Critical Thinking', subDomainId: 'critical_thinking', text: 'I carefully evaluate evidence before forming an opinion.', isReverse: false, order: 100 },
  { id: 'SK_CT_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Critical Thinking', subDomainId: 'critical_thinking', text: 'I question assumptions and look for alternative explanations.', isReverse: false, order: 101 },
  { id: 'SK_CT_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Critical Thinking', subDomainId: 'critical_thinking', text: 'I usually accept information at face value without questioning it.', isReverse: true, order: 102 },

  // Creativity Skill (3)
  { id: 'SK_CR_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Creativity', subDomainId: 'creativity_skill', text: 'I can easily generate original ideas and solutions.', isReverse: false, order: 103 },
  { id: 'SK_CR_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Creativity', subDomainId: 'creativity_skill', text: 'I enjoy finding innovative ways to solve problems.', isReverse: false, order: 104 },
  { id: 'SK_CR_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Creativity', subDomainId: 'creativity_skill', text: 'I struggle to think outside the box or come up with new ideas.', isReverse: true, order: 105 },

  // Collaboration (3)
  { id: 'SK_CO_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Collaboration', subDomainId: 'collaboration', text: 'I work effectively with others to achieve shared goals.', isReverse: false, order: 106 },
  { id: 'SK_CO_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Collaboration', subDomainId: 'collaboration', text: "I value diverse perspectives and incorporate others' input.", isReverse: false, order: 107 },
  { id: 'SK_CO_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Collaboration', subDomainId: 'collaboration', text: 'I prefer working alone over collaborating with a team.', isReverse: true, order: 108 },

  // Communication (3)
  { id: 'SK_CM_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Communication', subDomainId: 'communication', text: 'I can clearly articulate my ideas in both writing and speaking.', isReverse: false, order: 109 },
  { id: 'SK_CM_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Communication', subDomainId: 'communication', text: "I listen actively and understand others' perspectives.", isReverse: false, order: 110 },
  { id: 'SK_CM_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Communication', subDomainId: 'communication', text: 'I often struggle to get my point across effectively.', isReverse: true, order: 111 },

  // Information Literacy (3)
  { id: 'SK_IL_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Information Literacy', subDomainId: 'information_literacy', text: 'I can efficiently find reliable information from various sources.', isReverse: false, order: 112 },
  { id: 'SK_IL_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Information Literacy', subDomainId: 'information_literacy', text: 'I can distinguish between credible and unreliable sources.', isReverse: false, order: 113 },
  { id: 'SK_IL_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Information Literacy', subDomainId: 'information_literacy', text: 'I often feel overwhelmed when trying to research a topic.', isReverse: true, order: 114 },

  // Media Literacy (3)
  { id: 'SK_ML_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Media Literacy', subDomainId: 'media_literacy', text: 'I can critically analyze media messages and their purposes.', isReverse: false, order: 115 },
  { id: 'SK_ML_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Media Literacy', subDomainId: 'media_literacy', text: 'I understand how media can influence opinions and behaviors.', isReverse: false, order: 116 },
  { id: 'SK_ML_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Media Literacy', subDomainId: 'media_literacy', text: 'I tend to believe what I see in media without questioning it.', isReverse: true, order: 117 },

  // Technology Literacy (3)
  { id: 'SK_TL_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Technology Literacy', subDomainId: 'technology_literacy', text: 'I am comfortable learning and using new technologies.', isReverse: false, order: 118 },
  { id: 'SK_TL_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Technology Literacy', subDomainId: 'technology_literacy', text: 'I can use digital tools effectively to accomplish tasks.', isReverse: false, order: 119 },
  { id: 'SK_TL_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Technology Literacy', subDomainId: 'technology_literacy', text: 'I struggle with technology and avoid using new digital tools.', isReverse: true, order: 120 },

  // Financial Literacy (3)
  { id: 'SK_FL_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Financial Literacy', subDomainId: 'financial_literacy', text: 'I understand basic financial concepts like budgeting and saving.', isReverse: false, order: 121 },
  { id: 'SK_FL_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Financial Literacy', subDomainId: 'financial_literacy', text: 'I make informed decisions about spending and investments.', isReverse: false, order: 122 },
  { id: 'SK_FL_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Financial Literacy', subDomainId: 'financial_literacy', text: 'I rarely think about or plan my financial future.', isReverse: true, order: 123 },

  // Flexibility (3)
  { id: 'SK_FX_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Flexibility', subDomainId: 'flexibility', text: 'I adapt easily to new situations and changing circumstances.', isReverse: false, order: 124 },
  { id: 'SK_FX_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Flexibility', subDomainId: 'flexibility', text: 'I am open to feedback and willing to change my approach.', isReverse: false, order: 125 },
  { id: 'SK_FX_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Flexibility', subDomainId: 'flexibility', text: 'I find it difficult to adjust when plans change unexpectedly.', isReverse: true, order: 126 },

  // Initiative (3)
  { id: 'SK_IN_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Initiative', subDomainId: 'initiative', text: 'I take initiative and start projects without being asked.', isReverse: false, order: 127 },
  { id: 'SK_IN_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Initiative', subDomainId: 'initiative', text: 'I actively seek out opportunities for learning and growth.', isReverse: false, order: 128 },
  { id: 'SK_IN_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Initiative', subDomainId: 'initiative', text: 'I wait for others to tell me what to do rather than taking action.', isReverse: true, order: 129 },

  // Social Skills (3)
  { id: 'SK_SS_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Social Skills', subDomainId: 'social_skills', text: 'I navigate social situations with ease and confidence.', isReverse: false, order: 130 },
  { id: 'SK_SS_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Social Skills', subDomainId: 'social_skills', text: 'I can build rapport and positive relationships with diverse people.', isReverse: false, order: 131 },
  { id: 'SK_SS_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Social Skills', subDomainId: 'social_skills', text: 'I feel uncomfortable or awkward in most social interactions.', isReverse: true, order: 132 },

  // Productivity (3)
  { id: 'SK_PR_1', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Productivity', subDomainId: 'productivity', text: 'I consistently deliver quality work within deadlines.', isReverse: false, order: 133 },
  { id: 'SK_PR_2', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Productivity', subDomainId: 'productivity', text: 'I effectively prioritize tasks to maximize my output.', isReverse: false, order: 134 },
  { id: 'SK_PR_3', domain: '21st Century Skills', domainId: 'skills', subDomain: 'Productivity', subDomainId: 'productivity', text: 'I often procrastinate and struggle to complete tasks on time.', isReverse: true, order: 135 },

  // ==========================================
  // DOMAIN 8: EXECUTION & GRIT - 18 questions
  // ==========================================

  // Goal Setting (3)
  { id: 'EX_GS_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Goal Setting', subDomainId: 'goal_setting', text: 'I set clear, specific goals for what I want to achieve.', isReverse: false, order: 136 },
  { id: 'EX_GS_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Goal Setting', subDomainId: 'goal_setting', text: 'I break down long-term goals into manageable milestones.', isReverse: false, order: 137 },
  { id: 'EX_GS_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Goal Setting', subDomainId: 'goal_setting', text: 'I rarely set goals and prefer to see where life takes me.', isReverse: true, order: 138 },

  // Planning (3)
  { id: 'EX_PL_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Planning', subDomainId: 'planning', text: 'I create detailed plans before starting important projects.', isReverse: false, order: 139 },
  { id: 'EX_PL_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Planning', subDomainId: 'planning', text: 'I anticipate potential obstacles and plan how to address them.', isReverse: false, order: 140 },
  { id: 'EX_PL_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Planning', subDomainId: 'planning', text: 'I tend to jump into tasks without much planning.', isReverse: true, order: 141 },

  // Persistence (3)
  { id: 'EX_PE_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Persistence', subDomainId: 'persistence', text: 'I keep working toward my goals even when progress is slow.', isReverse: false, order: 142 },
  { id: 'EX_PE_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Persistence', subDomainId: 'persistence', text: 'Setbacks and failures motivate me to try harder.', isReverse: false, order: 143 },
  { id: 'EX_PE_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Persistence', subDomainId: 'persistence', text: 'I tend to give up when things get difficult.', isReverse: true, order: 144 },

  // Self-Discipline (3)
  { id: 'EX_SD_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Self-Discipline', subDomainId: 'self_discipline', text: 'I can resist temptations that might distract me from my goals.', isReverse: false, order: 145 },
  { id: 'EX_SD_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Self-Discipline', subDomainId: 'self_discipline', text: 'I maintain focus on important tasks even when they are boring.', isReverse: false, order: 146 },
  { id: 'EX_SD_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Self-Discipline', subDomainId: 'self_discipline', text: 'I often get distracted by more enjoyable activities.', isReverse: true, order: 147 },

  // Time Management (3)
  { id: 'EX_TM_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Time Management', subDomainId: 'time_management', text: 'I use my time efficiently and avoid wasting it on unproductive activities.', isReverse: false, order: 148 },
  { id: 'EX_TM_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Time Management', subDomainId: 'time_management', text: 'I schedule my tasks and stick to my planned timeline.', isReverse: false, order: 149 },
  { id: 'EX_TM_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Time Management', subDomainId: 'time_management', text: 'I frequently underestimate how long tasks will take.', isReverse: true, order: 150 },

  // Growth Mindset (3)
  { id: 'EX_GM_1', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Growth Mindset', subDomainId: 'growth_mindset', text: 'I believe my abilities can be developed through dedication and hard work.', isReverse: false, order: 151 },
  { id: 'EX_GM_2', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Growth Mindset', subDomainId: 'growth_mindset', text: 'I view challenges as opportunities to learn and grow.', isReverse: false, order: 152 },
  { id: 'EX_GM_3', domain: 'Execution & Grit', domainId: 'execution', subDomain: 'Growth Mindset', subDomainId: 'growth_mindset', text: 'I believe my intelligence and talents are fixed traits.', isReverse: true, order: 153 },
];

// Helper function to get questions by domain
export function getQuestionsByDomain(domainId: string): PilotQuestion[] {
  return PILOT_QUESTIONS.filter((q) => q.domainId === domainId);
}

// Helper function to get questions by sub-domain
export function getQuestionsBySubDomain(subDomainId: string): PilotQuestion[] {
  return PILOT_QUESTIONS.filter((q) => q.subDomainId === subDomainId);
}

// Get shuffled questions for assessment (randomize order but keep grouped by domain)
export function getShuffledQuestions(): PilotQuestion[] {
  const shuffled: PilotQuestion[] = [];

  // Shuffle domains
  const shuffledDomains = [...PILOT_DOMAINS].sort(() => Math.random() - 0.5);

  shuffledDomains.forEach((domain) => {
    const domainQuestions = getQuestionsByDomain(domain.id);
    // Shuffle questions within domain
    const shuffledDomainQuestions = domainQuestions.sort(() => Math.random() - 0.5);
    shuffled.push(...shuffledDomainQuestions);
  });

  return shuffled;
}
