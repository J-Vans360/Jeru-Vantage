export interface UniversityOption {
  id: string;
  name: string;
  country: string;
  region: string;
  type: 'public' | 'private';
  ranking?: string;
}

export const UNIVERSITY_LIST: UniversityOption[] = [
  // Singapore
  { id: 'nus', name: 'National University of Singapore', country: 'Singapore', region: 'Southeast Asia', type: 'public', ranking: 'Top 20 QS' },
  { id: 'ntu-sg', name: 'Nanyang Technological University', country: 'Singapore', region: 'Southeast Asia', type: 'public', ranking: 'Top 30 QS' },
  { id: 'smu', name: 'Singapore Management University', country: 'Singapore', region: 'Southeast Asia', type: 'private' },
  { id: 'sutd', name: 'Singapore University of Technology and Design', country: 'Singapore', region: 'Southeast Asia', type: 'public' },

  // Malaysia
  { id: 'um', name: 'University of Malaya', country: 'Malaysia', region: 'Southeast Asia', type: 'public', ranking: 'Top 100 QS' },
  { id: 'ukm', name: 'Universiti Kebangsaan Malaysia', country: 'Malaysia', region: 'Southeast Asia', type: 'public' },
  { id: 'upm', name: 'Universiti Putra Malaysia', country: 'Malaysia', region: 'Southeast Asia', type: 'public' },
  { id: 'usm', name: 'Universiti Sains Malaysia', country: 'Malaysia', region: 'Southeast Asia', type: 'public' },
  { id: 'utm', name: 'Universiti Teknologi Malaysia', country: 'Malaysia', region: 'Southeast Asia', type: 'public' },
  { id: 'taylor', name: "Taylor's University", country: 'Malaysia', region: 'Southeast Asia', type: 'private' },
  { id: 'sunway', name: 'Sunway University', country: 'Malaysia', region: 'Southeast Asia', type: 'private' },
  { id: 'monash-my', name: 'Monash University Malaysia', country: 'Malaysia', region: 'Southeast Asia', type: 'private' },

  // Thailand
  { id: 'chula', name: 'Chulalongkorn University', country: 'Thailand', region: 'Southeast Asia', type: 'public', ranking: 'Top 200 QS' },
  { id: 'mahidol', name: 'Mahidol University', country: 'Thailand', region: 'Southeast Asia', type: 'public' },
  { id: 'kasetsart', name: 'Kasetsart University', country: 'Thailand', region: 'Southeast Asia', type: 'public' },
  { id: 'tu-th', name: 'Thammasat University', country: 'Thailand', region: 'Southeast Asia', type: 'public' },

  // Indonesia
  { id: 'ui', name: 'Universitas Indonesia', country: 'Indonesia', region: 'Southeast Asia', type: 'public' },
  { id: 'ugm', name: 'Universitas Gadjah Mada', country: 'Indonesia', region: 'Southeast Asia', type: 'public' },
  { id: 'itb', name: 'Institut Teknologi Bandung', country: 'Indonesia', region: 'Southeast Asia', type: 'public' },
  { id: 'binus', name: 'Binus University', country: 'Indonesia', region: 'Southeast Asia', type: 'private' },

  // Philippines
  { id: 'up', name: 'University of the Philippines', country: 'Philippines', region: 'Southeast Asia', type: 'public' },
  { id: 'ateneo', name: 'Ateneo de Manila University', country: 'Philippines', region: 'Southeast Asia', type: 'private' },
  { id: 'dlsu', name: 'De La Salle University', country: 'Philippines', region: 'Southeast Asia', type: 'private' },
  { id: 'ust', name: 'University of Santo Tomas', country: 'Philippines', region: 'Southeast Asia', type: 'private' },

  // Vietnam
  { id: 'vnu', name: 'Vietnam National University', country: 'Vietnam', region: 'Southeast Asia', type: 'public' },
  { id: 'hust', name: 'Hanoi University of Science and Technology', country: 'Vietnam', region: 'Southeast Asia', type: 'public' },
  { id: 'rmit-vn', name: 'RMIT Vietnam', country: 'Vietnam', region: 'Southeast Asia', type: 'private' },

  // India
  { id: 'iit-b', name: 'IIT Bombay', country: 'India', region: 'South Asia', type: 'public', ranking: 'Top 200 QS' },
  { id: 'iit-d', name: 'IIT Delhi', country: 'India', region: 'South Asia', type: 'public', ranking: 'Top 200 QS' },
  { id: 'iit-m', name: 'IIT Madras', country: 'India', region: 'South Asia', type: 'public', ranking: 'Top 300 QS' },
  { id: 'iit-k', name: 'IIT Kanpur', country: 'India', region: 'South Asia', type: 'public' },
  { id: 'iisc', name: 'Indian Institute of Science', country: 'India', region: 'South Asia', type: 'public', ranking: 'Top 200 QS' },
  { id: 'iim-a', name: 'IIM Ahmedabad', country: 'India', region: 'South Asia', type: 'public' },
  { id: 'iim-b', name: 'IIM Bangalore', country: 'India', region: 'South Asia', type: 'public' },
  { id: 'bits', name: 'BITS Pilani', country: 'India', region: 'South Asia', type: 'private' },
  { id: 'du', name: 'University of Delhi', country: 'India', region: 'South Asia', type: 'public' },
  { id: 'jnu', name: 'Jawaharlal Nehru University', country: 'India', region: 'South Asia', type: 'public' },
  { id: 'manipal', name: 'Manipal Academy of Higher Education', country: 'India', region: 'South Asia', type: 'private' },
  { id: 'vit', name: 'VIT University', country: 'India', region: 'South Asia', type: 'private' },
  { id: 'srm', name: 'SRM Institute of Science and Technology', country: 'India', region: 'South Asia', type: 'private' },
  { id: 'amity', name: 'Amity University', country: 'India', region: 'South Asia', type: 'private' },
  { id: 'christ', name: 'Christ University', country: 'India', region: 'South Asia', type: 'private' },

  // UK
  { id: 'oxford', name: 'University of Oxford', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 5 QS' },
  { id: 'cambridge', name: 'University of Cambridge', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 5 QS' },
  { id: 'imperial', name: 'Imperial College London', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 10 QS' },
  { id: 'ucl', name: 'University College London', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 20 QS' },
  { id: 'lse', name: 'London School of Economics', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 50 QS' },
  { id: 'manchester', name: 'University of Manchester', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 50 QS' },
  { id: 'edinburgh', name: 'University of Edinburgh', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 30 QS' },
  { id: 'warwick', name: 'University of Warwick', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 100 QS' },
  { id: 'kings', name: "King's College London", country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 50 QS' },
  { id: 'bristol', name: 'University of Bristol', country: 'United Kingdom', region: 'Europe', type: 'public', ranking: 'Top 100 QS' },

  // USA
  { id: 'mit', name: 'Massachusetts Institute of Technology', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 5 QS' },
  { id: 'stanford', name: 'Stanford University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 10 QS' },
  { id: 'harvard', name: 'Harvard University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 5 QS' },
  { id: 'caltech', name: 'California Institute of Technology', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },
  { id: 'berkeley', name: 'UC Berkeley', country: 'United States', region: 'North America', type: 'public', ranking: 'Top 30 QS' },
  { id: 'ucla', name: 'UCLA', country: 'United States', region: 'North America', type: 'public', ranking: 'Top 50 QS' },
  { id: 'columbia', name: 'Columbia University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 30 QS' },
  { id: 'yale', name: 'Yale University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },
  { id: 'princeton', name: 'Princeton University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },
  { id: 'nyu', name: 'New York University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 50 QS' },
  { id: 'upenn', name: 'University of Pennsylvania', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },
  { id: 'cornell', name: 'Cornell University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },
  { id: 'duke', name: 'Duke University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 50 QS' },
  { id: 'northwestern', name: 'Northwestern University', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 50 QS' },
  { id: 'uchicago', name: 'University of Chicago', country: 'United States', region: 'North America', type: 'private', ranking: 'Top 20 QS' },

  // Australia
  { id: 'melbourne', name: 'University of Melbourne', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 50 QS' },
  { id: 'sydney', name: 'University of Sydney', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 50 QS' },
  { id: 'anu', name: 'Australian National University', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 50 QS' },
  { id: 'unsw', name: 'UNSW Sydney', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 50 QS' },
  { id: 'monash', name: 'Monash University', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 60 QS' },
  { id: 'queensland', name: 'University of Queensland', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 60 QS' },
  { id: 'adelaide', name: 'University of Adelaide', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 100 QS' },
  { id: 'western-au', name: 'University of Western Australia', country: 'Australia', region: 'Oceania', type: 'public', ranking: 'Top 100 QS' },

  // Canada
  { id: 'toronto', name: 'University of Toronto', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 30 QS' },
  { id: 'ubc', name: 'University of British Columbia', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 50 QS' },
  { id: 'mcgill', name: 'McGill University', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 50 QS' },
  { id: 'waterloo', name: 'University of Waterloo', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 150 QS' },
  { id: 'alberta', name: 'University of Alberta', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 150 QS' },
  { id: 'montreal', name: 'University of Montreal', country: 'Canada', region: 'North America', type: 'public', ranking: 'Top 150 QS' },

  // Hong Kong
  { id: 'hku', name: 'University of Hong Kong', country: 'Hong Kong', region: 'East Asia', type: 'public', ranking: 'Top 30 QS' },
  { id: 'hkust', name: 'HKUST', country: 'Hong Kong', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'cuhk', name: 'Chinese University of Hong Kong', country: 'Hong Kong', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'cityu', name: 'City University of Hong Kong', country: 'Hong Kong', region: 'East Asia', type: 'public', ranking: 'Top 100 QS' },
  { id: 'polyu', name: 'Hong Kong Polytechnic University', country: 'Hong Kong', region: 'East Asia', type: 'public', ranking: 'Top 100 QS' },

  // China
  { id: 'tsinghua', name: 'Tsinghua University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 20 QS' },
  { id: 'peking', name: 'Peking University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 20 QS' },
  { id: 'fudan', name: 'Fudan University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'sjtu', name: 'Shanghai Jiao Tong University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'zhejiang', name: 'Zhejiang University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'nanjing', name: 'Nanjing University', country: 'China', region: 'East Asia', type: 'public', ranking: 'Top 150 QS' },

  // Japan
  { id: 'tokyo', name: 'University of Tokyo', country: 'Japan', region: 'East Asia', type: 'public', ranking: 'Top 30 QS' },
  { id: 'kyoto', name: 'Kyoto University', country: 'Japan', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'osaka', name: 'Osaka University', country: 'Japan', region: 'East Asia', type: 'public', ranking: 'Top 100 QS' },
  { id: 'tohoku', name: 'Tohoku University', country: 'Japan', region: 'East Asia', type: 'public', ranking: 'Top 100 QS' },
  { id: 'tokyo-tech', name: 'Tokyo Institute of Technology', country: 'Japan', region: 'East Asia', type: 'public', ranking: 'Top 100 QS' },
  { id: 'waseda', name: 'Waseda University', country: 'Japan', region: 'East Asia', type: 'private', ranking: 'Top 200 QS' },
  { id: 'keio', name: 'Keio University', country: 'Japan', region: 'East Asia', type: 'private', ranking: 'Top 200 QS' },

  // South Korea
  { id: 'seoul', name: 'Seoul National University', country: 'South Korea', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'kaist', name: 'KAIST', country: 'South Korea', region: 'East Asia', type: 'public', ranking: 'Top 50 QS' },
  { id: 'yonsei', name: 'Yonsei University', country: 'South Korea', region: 'East Asia', type: 'private', ranking: 'Top 100 QS' },
  { id: 'korea-u', name: 'Korea University', country: 'South Korea', region: 'East Asia', type: 'private', ranking: 'Top 100 QS' },
  { id: 'postech', name: 'POSTECH', country: 'South Korea', region: 'East Asia', type: 'private', ranking: 'Top 100 QS' },

  // Europe
  { id: 'eth', name: 'ETH Zurich', country: 'Switzerland', region: 'Europe', type: 'public', ranking: 'Top 10 QS' },
  { id: 'epfl', name: 'EPFL', country: 'Switzerland', region: 'Europe', type: 'public', ranking: 'Top 20 QS' },
  { id: 'tum', name: 'Technical University of Munich', country: 'Germany', region: 'Europe', type: 'public', ranking: 'Top 50 QS' },
  { id: 'lmu', name: 'LMU Munich', country: 'Germany', region: 'Europe', type: 'public', ranking: 'Top 100 QS' },
  { id: 'heidelberg', name: 'Heidelberg University', country: 'Germany', region: 'Europe', type: 'public', ranking: 'Top 100 QS' },
  { id: 'amsterdam', name: 'University of Amsterdam', country: 'Netherlands', region: 'Europe', type: 'public', ranking: 'Top 60 QS' },
  { id: 'delft', name: 'TU Delft', country: 'Netherlands', region: 'Europe', type: 'public', ranking: 'Top 60 QS' },
  { id: 'sorbonne', name: 'Sorbonne University', country: 'France', region: 'Europe', type: 'public', ranking: 'Top 100 QS' },
  { id: 'psl', name: 'PSL University', country: 'France', region: 'Europe', type: 'public', ranking: 'Top 50 QS' },

  // New Zealand
  { id: 'auckland', name: 'University of Auckland', country: 'New Zealand', region: 'Oceania', type: 'public', ranking: 'Top 100 QS' },
  { id: 'otago', name: 'University of Otago', country: 'New Zealand', region: 'Oceania', type: 'public', ranking: 'Top 250 QS' },

  // Middle East
  { id: 'kaust', name: 'King Abdullah University of Science and Technology', country: 'Saudi Arabia', region: 'Middle East', type: 'public', ranking: 'Top 150 QS' },
  { id: 'technion', name: 'Technion - Israel Institute of Technology', country: 'Israel', region: 'Middle East', type: 'public', ranking: 'Top 100 QS' },
  { id: 'tau', name: 'Tel Aviv University', country: 'Israel', region: 'Middle East', type: 'public', ranking: 'Top 200 QS' },
  { id: 'auc', name: 'American University in Cairo', country: 'Egypt', region: 'Middle East', type: 'private' },
];

// Get countries list
export function getCountries(): string[] {
  const countries = new Set(UNIVERSITY_LIST.map(u => u.country));
  return Array.from(countries).sort();
}

// Get regions list
export function getRegions(): string[] {
  const regions = new Set(UNIVERSITY_LIST.map(u => u.region));
  return Array.from(regions).sort();
}

// Filter universities by country
export function getUniversitiesByCountry(country: string): UniversityOption[] {
  return UNIVERSITY_LIST.filter(u => u.country === country);
}

// Filter universities by region
export function getUniversitiesByRegion(region: string): UniversityOption[] {
  return UNIVERSITY_LIST.filter(u => u.region === region);
}

// Search universities
export function searchUniversities(query: string): UniversityOption[] {
  const lowerQuery = query.toLowerCase();
  return UNIVERSITY_LIST.filter(u =>
    u.name.toLowerCase().includes(lowerQuery) ||
    u.country.toLowerCase().includes(lowerQuery)
  );
}
