'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain, Target, Sparkles, Download, Share2,
  ChevronDown, ChevronUp, Star, Shield, Info,
  GraduationCap, Briefcase, Heart, Zap, Clock,
  TrendingUp, Award, CheckCircle, ArrowRight
} from 'lucide-react';
import { PILOT_DOMAINS } from '@/lib/pilot/pilotQuestions';

interface DomainScore {
  id: string;
  name: string;
  score: number;
  icon?: string;
  color?: string;
}

interface SubDomainScore {
  id: string;
  name: string;
  score: number;
  domainId: string;
}

interface ProfileSummary {
  hollandCode: string;
  hollandDescription: string;
  topIntelligences: string[];
  topValues: string[];
  cognitiveStyle: Record<string, string>;
  dominantStressResponse: string;
  personalityHighlights: string[];
  overallStrength: string;
  careerSuggestions: string[];
}

interface UniversityPreference {
  id: string;
  universityName: string;
  country: string;
  category: string;
}

interface PilotResultsDashboardProps {
  studentName: string;
  completedAt: string;
  totalTimeSeconds: number;
  domainScores: DomainScore[];
  subDomainScores: SubDomainScore[];
  profileSummary: ProfileSummary;
  universityPreferences?: UniversityPreference[];
}

const HOLLAND_DESCRIPTIONS: Record<string, { title: string; description: string; careers: string[] }> = {
  R: {
    title: 'Realistic',
    description: 'Practical, hands-on problem solvers who enjoy working with tools, machines, and nature.',
    careers: ['Engineer', 'Architect', 'Pilot', 'Surgeon', 'Mechanic'],
  },
  I: {
    title: 'Investigative',
    description: 'Analytical thinkers who enjoy research, problem-solving, and working with ideas.',
    careers: ['Scientist', 'Researcher', 'Data Analyst', 'Doctor', 'Professor'],
  },
  A: {
    title: 'Artistic',
    description: 'Creative individuals who value self-expression and innovation.',
    careers: ['Designer', 'Writer', 'Artist', 'Musician', 'Film Director'],
  },
  S: {
    title: 'Social',
    description: 'Helpers who enjoy working with people, teaching, and making a difference.',
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'HR Manager'],
  },
  E: {
    title: 'Enterprising',
    description: 'Leaders who enjoy persuading, managing, and taking on business challenges.',
    careers: ['Entrepreneur', 'Manager', 'Lawyer', 'Salesperson', 'CEO'],
  },
  C: {
    title: 'Conventional',
    description: 'Organized individuals who value accuracy, structure, and attention to detail.',
    careers: ['Accountant', 'Banker', 'Administrator', 'Auditor', 'Data Entry'],
  },
};

const DOMAIN_COLORS: Record<string, string> = {
  personality: '#3b82f6',
  values: '#8b5cf6',
  holland: '#10b981',
  intelligences: '#f59e0b',
  cognitive: '#ec4899',
  stress: '#06b6d4',
  skills: '#84cc16',
  execution: '#f97316',
};

export default function PilotResultsDashboard({
  studentName,
  completedAt,
  totalTimeSeconds,
  domainScores,
  subDomainScores,
  profileSummary,
  universityPreferences = [],
}: PilotResultsDashboardProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minutes`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDomainInfo = (domainId: string) => {
    return PILOT_DOMAINS.find(d => d.id === domainId);
  };

  const getSubDomainScores = (domainId: string) => {
    return subDomainScores.filter(s => s.domainId === domainId);
  };

  const hollandLetters = profileSummary.hollandCode.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Your Personalized Jeru Report</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Hello, {studentName.split(' ')[0]}! 👋
            </h1>

            <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
              Congratulations on completing your assessment! Here&apos;s what we discovered about your
              unique strengths, interests, and ideal career directions.
            </p>

            <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Completed in {formatTime(totalTimeSeconds)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>153 questions analyzed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{formatDate(completedAt)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Holland Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm text-gray-500">Career Code</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {profileSummary.hollandCode}
            </div>
            <div className="text-sm text-gray-600">
              {HOLLAND_DESCRIPTIONS[hollandLetters[0]]?.title}
            </div>
          </motion.div>

          {/* Top Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-sm text-gray-500">Top Intelligence</div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {profileSummary.topIntelligences[0] || 'Balanced'}
            </div>
            <div className="text-sm text-gray-600">
              Your strongest learning style
            </div>
          </motion.div>

          {/* Top Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-sm text-gray-500">Core Value</div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {profileSummary.topValues[0] || 'Achievement'}
            </div>
            <div className="text-sm text-gray-600">
              What matters most to you
            </div>
          </motion.div>

          {/* Overall Strength */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-gray-500">Strength Area</div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {profileSummary.overallStrength.split(' ')[0]}
            </div>
            <div className="text-sm text-gray-600">
              Your highest scoring domain
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Profile Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Your Overall Profile
              </h2>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {domainScores.map((domain) => {
                  const domainInfo = getDomainInfo(domain.id);
                  const color = domain.color || DOMAIN_COLORS[domain.id] || '#6b7280';

                  return (
                    <div key={domain.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{domain.icon || domainInfo?.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{domain.name}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color }}>
                          {domain.score}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${domain.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Pilot Note:</strong> This is a preview based on 153 questions.
                    The full assessment (510 questions) provides deeper insights with higher accuracy.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Holland Code Detail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Your Career Code: {profileSummary.hollandCode}
              </h2>

              <div className="space-y-4">
                {hollandLetters.map((letter, idx) => {
                  const info = HOLLAND_DESCRIPTIONS[letter];
                  if (!info) return null;

                  return (
                    <div
                      key={letter}
                      className={`p-4 rounded-xl ${idx === 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                          ${idx === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                        `}>
                          {letter}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{info.title}</div>
                          <div className="text-sm text-gray-500">
                            {idx === 0 ? 'Primary Interest' : idx === 1 ? 'Secondary Interest' : 'Tertiary Interest'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {info.careers.map(career => (
                          <span
                            key={career}
                            className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border border-gray-200"
                          >
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Career Suggestions */}
              {profileSummary.careerSuggestions.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Suggested Career Paths</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileSummary.careerSuggestions.map((career, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-green-700 border border-green-200"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Domain Breakdowns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Detailed Domain Analysis
              </h2>

              <div className="space-y-4">
                {domainScores.map((domain) => {
                  const domainInfo = getDomainInfo(domain.id);
                  const subScores = getSubDomainScores(domain.id);
                  const isExpanded = expandedDomain === domain.id;
                  const color = domain.color || DOMAIN_COLORS[domain.id] || '#6b7280';

                  return (
                    <div key={domain.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{domain.icon || domainInfo?.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{domain.name}</div>
                            <div className="text-sm text-gray-500">{domainInfo?.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold" style={{ color }}>
                            {domain.score}%
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && subScores.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="border-t border-gray-200 p-4 bg-gray-50"
                        >
                          <div className="space-y-3">
                            {subScores.map((sub) => (
                              <div key={sub.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">
                                    {sub.name}
                                  </span>
                                  <span className="text-sm font-semibold" style={{ color }}>
                                    {sub.score}%
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${sub.score}%`,
                                      backgroundColor: color,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Key Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Key Insights
              </h3>

              <div className="space-y-4">
                {/* Personality Highlights */}
                {profileSummary.personalityHighlights.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <div className="text-sm font-medium text-blue-800 mb-1">Personality</div>
                    <div className="text-sm text-blue-700">
                      You score high in {profileSummary.personalityHighlights.join(' and ')}
                    </div>
                  </div>
                )}

                {/* Cognitive Style */}
                {Object.keys(profileSummary.cognitiveStyle).length > 0 && (
                  <div className="p-3 bg-pink-50 rounded-xl">
                    <div className="text-sm font-medium text-pink-800 mb-1">Learning Style</div>
                    <div className="text-sm text-pink-700">
                      {profileSummary.cognitiveStyle.thinking || 'Balanced'} thinker,{' '}
                      {profileSummary.cognitiveStyle.processing || 'adaptive'} learner
                    </div>
                  </div>
                )}

                {/* Stress Response */}
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <div className="text-sm font-medium text-cyan-800 mb-1">Under Pressure</div>
                  <div className="text-sm text-cyan-700">
                    You tend toward {profileSummary.dominantStressResponse} coping
                  </div>
                </div>

                {/* Top Values */}
                {profileSummary.topValues.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <div className="text-sm font-medium text-purple-800 mb-1">Core Values</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileSummary.topValues.map(value => (
                        <span key={value} className="px-2 py-0.5 bg-purple-100 rounded text-xs text-purple-700">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Intelligences */}
                {profileSummary.topIntelligences.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-xl">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Intelligence Strengths</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileSummary.topIntelligences.map(intel => (
                        <span key={intel} className="px-2 py-0.5 bg-yellow-100 rounded text-xs text-yellow-700">
                          {intel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* University Preferences */}
            {universityPreferences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Your University Wishlist
                </h3>

                <div className="space-y-3">
                  {['DREAM', 'GOOD_FIT', 'BACKUP'].map(category => {
                    const unis = universityPreferences.filter(u => u.category === category);
                    if (unis.length === 0) return null;

                    const config = {
                      DREAM: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Dream' },
                      GOOD_FIT: { icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Good Fit' },
                      BACKUP: { icon: Shield, color: 'text-green-600', bg: 'bg-green-50', label: 'Safety' },
                    }[category]!;

                    const Icon = config.icon;

                    return (
                      <div key={category}>
                        <div className={`flex items-center gap-2 ${config.color} text-sm font-medium mb-2`}>
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </div>
                        <div className="space-y-1">
                          {unis.map(uni => (
                            <div
                              key={uni.id}
                              className={`px-3 py-2 ${config.bg} rounded-lg text-sm`}
                            >
                              <div className="font-medium text-gray-900">{uni.universityName}</div>
                              <div className="text-gray-500 text-xs">{uni.country}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700">
                    We&apos;ll notify you when we partner with these universities!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <Download className="w-5 h-5" />
                  Download PDF Report
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share Results
                </button>

                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Back to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Full Assessment CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-white/80">Coming Soon</span>
              </div>
              <h3 className="font-bold text-xl mb-2">
                Want Deeper Insights?
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Join our waitlist for the full 510-question assessment with:
              </p>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  3x more detailed analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  University matching algorithm
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  Career recommendations
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                Join Waitlist
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
