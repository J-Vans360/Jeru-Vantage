'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Clock, Brain, Target, Sparkles, Shield,
  ChevronRight, CheckCircle, Users, GraduationCap
} from 'lucide-react';

interface PilotLandingProps {
  hasExistingAssessment?: boolean;
  assessmentProgress?: number;
}

export default function PilotLanding({ hasExistingAssessment, assessmentProgress }: PilotLandingProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setStarting(true);
    router.push('/pilot-assessment');
  };

  const features = [
    {
      icon: Brain,
      title: '8 Dimensions Analyzed',
      description: 'Personality, values, interests, skills, and more',
    },
    {
      icon: Target,
      title: 'Career Path Clarity',
      description: 'Discover careers aligned with your natural strengths',
    },
    {
      icon: GraduationCap,
      title: 'University Matching',
      description: 'Find programs that fit your unique profile',
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your data stays yours - always',
    },
  ];

  const assessmentSections = [
    { name: 'Personality Architecture', questions: 15, time: '3 min' },
    { name: 'Values & Interests', questions: 18, time: '3 min' },
    { name: 'Career Interests (Holland)', questions: 18, time: '3 min' },
    { name: 'Multiple Intelligences', questions: 24, time: '4 min' },
    { name: 'Cognitive Style', questions: 12, time: '2 min' },
    { name: 'Stress Response', questions: 12, time: '2 min' },
    { name: '21st Century Skills', questions: 36, time: '6 min' },
    { name: 'Execution & Grit', questions: 18, time: '3 min' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          {/* Beta Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              Pilot Program - Free Access
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Discover Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Ideal Career Path
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Take our comprehensive 25-minute assessment and receive your personalized
            Jeru Report - a detailed analysis of your strengths, interests, and ideal career directions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-5 h-5" />
              <span>~25 minutes</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2 text-white/70">
              <CheckCircle className="w-5 h-5" />
              <span>153 questions</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2 text-white/70">
              <Users className="w-5 h-5" />
              <span>Join 500+ students</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleStart}
            disabled={starting}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all disabled:opacity-70"
          >
            {starting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : hasExistingAssessment ? (
              <>
                Continue Assessment ({assessmentProgress}%)
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Start Your Journey
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What&apos;s in the Assessment?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {assessmentSections.map((section, idx) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{section.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {section.questions}q · {section.time}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Pilot Program Note</p>
                <p className="text-sm text-amber-700 mt-1">
                  This is a preview assessment with 153 questions. Your feedback helps us improve!
                  The full version (510 questions) provides even deeper insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
