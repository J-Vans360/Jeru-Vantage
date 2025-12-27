// Career Clusters based on the 16 standard Career Clusters framework
// Grouped into 5 main categories for easier navigation

export const CAREER_CATEGORIES = [
  {
    id: 'business',
    name: 'Business & Administrative',
    icon: '💼',
    color: 'blue',
  },
  {
    id: 'creative',
    name: 'Creative & Communicative',
    icon: '💡',
    color: 'purple',
  },
  {
    id: 'industrial',
    name: 'Industrial & Manufacturing',
    icon: '🛠️',
    color: 'orange',
  },
  {
    id: 'service',
    name: 'Service & Education',
    icon: '🧑‍🤝‍🧑',
    color: 'green',
  },
  {
    id: 'science',
    name: 'Science & Resource',
    icon: '🔬',
    color: 'cyan',
  },
];

export const CAREER_CLUSTERS = [
  // Business & Administrative
  {
    id: 'business_management',
    name: 'Business Management & Administration',
    category: 'business',
    icon: '📊',
    examples: ['CEO', 'Manager', 'HR Professional', 'Operations'],
  },
  {
    id: 'finance',
    name: 'Finance',
    category: 'business',
    icon: '💰',
    examples: ['Accountant', 'Financial Analyst', 'Banker', 'Investment'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'business',
    icon: '📣',
    examples: ['Marketing Manager', 'Brand Strategist', 'Advertising', 'Sales'],
  },
  {
    id: 'government',
    name: 'Government & Public Administration',
    category: 'business',
    icon: '🏛️',
    examples: ['Civil Servant', 'Policy Analyst', 'Diplomat', 'Administrator'],
  },

  // Creative & Communicative
  {
    id: 'arts_media',
    name: 'Arts, Audio/Video Technology & Communications',
    category: 'creative',
    icon: '🎨',
    examples: ['Designer', 'Filmmaker', 'Journalist', 'Musician', 'Writer'],
  },

  // Industrial & Manufacturing
  {
    id: 'architecture',
    name: 'Architecture & Construction',
    category: 'industrial',
    icon: '🏗️',
    examples: ['Architect', 'Civil Engineer', 'Construction Manager', 'Urban Planner'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    category: 'industrial',
    icon: '🏭',
    examples: ['Production Manager', 'Quality Control', 'Industrial Engineer'],
  },
  {
    id: 'transportation',
    name: 'Transportation, Distribution & Logistics',
    category: 'industrial',
    icon: '🚚',
    examples: ['Logistics Manager', 'Supply Chain', 'Pilot', 'Ship Captain'],
  },

  // Service & Education
  {
    id: 'education',
    name: 'Education & Training',
    category: 'service',
    icon: '📚',
    examples: ['Teacher', 'Professor', 'Trainer', 'Curriculum Developer'],
  },
  {
    id: 'health_science',
    name: 'Health Science',
    category: 'service',
    icon: '⚕️',
    examples: ['Doctor', 'Nurse', 'Pharmacist', 'Therapist', 'Surgeon'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    category: 'service',
    icon: '🏨',
    examples: ['Hotel Manager', 'Chef', 'Travel Agent', 'Event Planner'],
  },
  {
    id: 'human_services',
    name: 'Human Services',
    category: 'service',
    icon: '🤝',
    examples: ['Social Worker', 'Counselor', 'Psychologist', 'NGO Worker'],
  },
  {
    id: 'law_security',
    name: 'Law, Public Safety, Corrections & Security',
    category: 'service',
    icon: '⚖️',
    examples: ['Lawyer', 'Police Officer', 'Judge', 'Security Analyst'],
  },

  // Science & Resource
  {
    id: 'agriculture',
    name: 'Agriculture, Food & Natural Resources',
    category: 'science',
    icon: '🌾',
    examples: ['Agronomist', 'Food Scientist', 'Environmental Manager'],
  },
  {
    id: 'stem',
    name: 'Science, Technology, Engineering & Mathematics',
    category: 'science',
    icon: '🔬',
    examples: ['Scientist', 'Engineer', 'Researcher', 'Mathematician'],
  },
  {
    id: 'information_technology',
    name: 'Information Technology',
    category: 'science',
    icon: '💻',
    examples: ['Software Developer', 'Data Scientist', 'Cybersecurity', 'AI Engineer'],
  },
];

// Helper function to get clusters by category
export function getClustersByCategory(categoryId: string) {
  return CAREER_CLUSTERS.filter(cluster => cluster.category === categoryId);
}

// Helper to get cluster by ID
export function getClusterById(clusterId: string) {
  return CAREER_CLUSTERS.find(cluster => cluster.id === clusterId);
}

// Helper to get category by ID
export function getCategoryById(categoryId: string) {
  return CAREER_CATEGORIES.find(cat => cat.id === categoryId);
}

// Type exports
export type CareerCategory = typeof CAREER_CATEGORIES[number];
export type CareerCluster = typeof CAREER_CLUSTERS[number];
