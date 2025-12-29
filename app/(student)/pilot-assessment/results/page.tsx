'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Star,
  Target,
  Brain,
  Briefcase,
  Zap,
  Award,
  ChevronRight,
  Download,
  Share2,
} from 'lucide-react';
import { PILOT_DOMAINS } from '@/lib/pilot/pilotQuestions';

interface DomainScore {
  id: string;
  name: string;
  score: number;
  icon: string;
  color: string;
}

interface SubDomainScore {
  id: string;
  name: string;
  score: number;
  domainId: string;
}

interface AssessmentResults {
  domainScores: DomainScore[];
  subDomainScores: SubDomainScore[];
  hollandCode?: string;
  completedAt?: string;
}

const HOLLAND_DESCRIPTIONS: Record<string, { name: string; description: string; careers: string[] }> = {
  R: {
    name: 'Realistic',
    description: 'Practical, hands-on problem solvers who enjoy working with tools, machines, and nature.',
    careers: ['Engineer', 'Mechanic', 'Architect', 'Pilot', 'Surgeon'],
  },
  I: {
    name: 'Investigative',
    description: 'Analytical thinkers who enjoy research, problem-solving, and working with ideas.',
    careers: ['Scientist', 'Researcher', 'Data Analyst', 'Doctor', 'Professor'],
  },
  A: {
    name: 'Artistic',
    description: 'Creative individuals who value self-expression and innovation.',
    careers: ['Designer', 'Writer', 'Artist', 'Musician', 'Film Director'],
  },
  S: {
    name: 'Social',
    description: 'Helpers who enjoy working with people, teaching, and making a difference.',
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'HR Manager'],
  },
  E: {
    name: 'Enterprising',
    description: 'Leaders who enjoy persuading, managing, and taking on business challenges.',
    careers: ['Entrepreneur', 'Manager', 'Lawyer', 'Salesperson', 'CEO'],
  },
  C: {
    name: 'Conventional',
    description: 'Organized individuals who value accuracy, structure, and attention to detail.',
    careers: ['Accountant', 'Banker', 'Administrator', 'Auditor', 'Data Entry'],
  },
};

export default function PilotResultsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResults();
    }
  }, [status]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pilot/assessment');
      const data = await response.json();

      if (data.exists && data.assessment?.status === 'COMPLETED') {
        // Calculate Holland Code from domain scores
        const hollandDomain = data.assessment.domainScores?.find((d: DomainScore) => d.id === 'holland');
        let hollandCode = 'XXX';

        if (hollandDomain && data.assessment.subDomainScores) {
          const hollandSubs = data.assessment.subDomainScores
            .filter((s: SubDomainScore) => s.domainId === 'holland')
            .sort((a: SubDomainScore, b: SubDomainScore) => b.score - a.score)
            .slice(0, 3);

          const riasecMap: Record<string, string> = {
            realistic: 'R',
            investigative: 'I',
            artistic: 'A',
            social: 'S',
            enterprising: 'E',
            conventional: 'C',
          };

          hollandCode = hollandSubs.map((s: SubDomainScore) => riasecMap[s.id] || 'X').join('');
        }

        setResults({
          domainScores: data.assessment.domainScores || [],
          subDomainScores: data.assessment.subDomainScores || [],
          hollandCode,
          completedAt: data.assessment.completedAt,
        });
      } else {
        setError('No completed assessment found');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getTopStrengths = () => {
    if (!results?.subDomainScores) return [];
    return [...results.subDomainScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const getDevelopmentAreas = () => {
    if (!results?.subDomainScores) return [];
    return [...results.subDomainScores]
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Please complete the pilot assessment first.'}
          </p>
          <Link
            href="/pilot-assessment"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const hollandLetters = results.hollandCode?.split('') || [];
  const topStrengths = getTopStrengths();
  const developmentAreas = getDevelopmentAreas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Pilot Assessment Results
          </h1>
          {results.completedAt && (
            <p className="text-gray-500">
              Completed on {new Date(results.completedAt).toLocaleDateString()}
            </p>
          )}
        </motion.div>

        {/* Holland Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Your Holland Code
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            {hollandLetters.map((letter, idx) => (
              <div
                key={idx}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {hollandLetters.map((letter, idx) => {
              const info = HOLLAND_DESCRIPTIONS[letter];
              if (!info) return null;
              return (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                      {letter}
                    </span>
                    <span className="font-semibold text-gray-900">{info.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {info.careers.map((career) => (
                      <span
                        key={career}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Domain Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Domain Scores
          </h2>

          <div className="space-y-4">
            {results.domainScores.map((domain) => {
              const domainDef = PILOT_DOMAINS.find((d) => d.id === domain.id);
              return (
                <div key={domain.id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{domain.icon || domainDef?.icon}</span>
                      <span className="font-medium text-gray-900">{domain.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{domain.score}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.score}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: domain.color || domainDef?.color || '#8B5CF6' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Strengths & Development Areas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Top Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Strengths
            </h2>

            <div className="space-y-3">
              {topStrengths.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-700">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{item.score}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Development Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Growth Areas
            </h2>

            <div className="space-y-3">
              {developmentAreas.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-700">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{item.score}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <Zap className="w-10 h-10 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            Get Your AI Career Report
          </h3>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Answer a few quick questions and unlock your personalized AI career report with university recommendations and career matches.
          </p>
          <button
            onClick={() => router.push('/survey/assessment')}
            className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 mx-auto"
          >
            Get Your AI Career Report
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
