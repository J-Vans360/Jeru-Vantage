'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Trophy,
  Target,
  Zap,
  Globe,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import PilotAssessmentFlow from '@/components/pilot/PilotAssessmentFlow';
import UniversityPreferencesStep from '@/components/pilot/UniversityPreferencesStep';
import PilotSurveyStep from '@/components/pilot/PilotSurveyStep';
import { LanguageMode } from '@/lib/pilot/pilotQuestions';

type FlowStep = 'intro' | 'assessment' | 'university' | 'survey' | 'complete';

interface AssessmentData {
  id?: string;
  status?: string;
  responses?: Record<string, number>;
  startedAt?: string;
  completedAt?: string;
}

export default function PilotAssessmentPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FlowStep>('intro');
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [scores, setScores] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('standard');

  // Load language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pilot-assessment-language');
    if (saved === 'esl' || saved === 'standard') {
      setLanguageMode(saved);
    }
  }, []);

  // Save language preference to localStorage
  const handleLanguageChange = (mode: LanguageMode) => {
    setLanguageMode(mode);
    localStorage.setItem('pilot-assessment-language', mode);
  };

  // Check profile and fetch assessment on load
  useEffect(() => {
    if (status === 'authenticated') {
      checkProfileAndFetchAssessment();
    }
  }, [status]);

  const checkProfileAndFetchAssessment = async () => {
    try {
      setLoading(true);

      // Check if profile is complete
      const roleRes = await fetch('/api/auth/check-role');
      const roleData = await roleRes.json();

      if (!roleData.profileComplete) {
        // Profile not complete, redirect to profile page
        router.replace('/profile');
        return;
      }

      // Profile is complete, fetch assessment
      await fetchAssessment();
    } catch (err) {
      console.error('Error checking profile:', err);
      setError('Failed to load');
    }
  };

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pilot/assessment');
      const data = await response.json();

      if (data.exists && data.assessment) {
        setAssessmentData(data.assessment);

        // Determine which step to show based on status
        if (data.assessment.status === 'COMPLETED') {
          setCurrentStep('complete');
          setScores(data.assessment.domainScores);
        } else if (data.assessment.responses && Object.keys(data.assessment.responses).length > 0) {
          setCurrentStep('assessment');
        }
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pilot/assessment', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setAssessmentData(data.assessment);
        setCurrentStep('assessment');
      } else {
        setError(data.error || 'Failed to start assessment');
      }
    } catch (err) {
      console.error('Error starting assessment:', err);
      setError('Failed to start assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = useCallback(async (responses: Record<string, number>) => {
    try {
      await fetch('/api/pilot/assessment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, []);

  const handleAssessmentComplete = async (responses: Record<string, number>) => {
    try {
      setLoading(true);
      const startTime = assessmentData?.startedAt
        ? Math.floor((Date.now() - new Date(assessmentData.startedAt).getTime()) / 1000)
        : null;

      const response = await fetch('/api/pilot/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          totalTimeSeconds: startTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScores(data.scores);
        setCurrentStep('university');
      } else {
        setError(data.error || 'Failed to complete assessment');
      }
    } catch (err) {
      console.error('Error completing assessment:', err);
      setError('Failed to complete assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityComplete = async (preferences: any[]) => {
    try {
      await fetch('/api/pilot/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      setCurrentStep('survey');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setCurrentStep('survey'); // Continue anyway
    }
  };

  const handleSurveyComplete = async (surveyData: any) => {
    try {
      await fetch('/api/pilot/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
      setCurrentStep('complete');
    } catch (err) {
      console.error('Error saving survey:', err);
      setCurrentStep('complete'); // Continue anyway
    }
  };

  const handleSkipUniversity = () => {
    setCurrentStep('survey');
  };

  const handleSkipSurvey = () => {
    setCurrentStep('complete');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Back Navigation */}
      {currentStep !== 'intro' && currentStep !== 'complete' && (
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-lg shadow text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Introduction Step */}
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Pilot Career Assessment
                </h1>
                <p className="text-lg text-gray-600">
                  Discover your strengths, interests, and ideal career paths
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">153 Questions</h3>
                      <p className="text-sm text-gray-600">
                        Comprehensive assessment covering personality, values, interests, and skills
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">~25 Minutes</h3>
                      <p className="text-sm text-gray-600">
                        Your progress is auto-saved, so you can pause and continue anytime
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Instant Results</h3>
                      <p className="text-sm text-gray-600">
                        Get your Holland Code, top strengths, and personalized insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Choose Your Language Style</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Select the language style that&apos;s easiest for you to understand. Both versions measure the same things.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Standard English Option */}
                  <button
                    onClick={() => handleLanguageChange('standard')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      languageMode === 'standard'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {languageMode === 'standard' && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div className="font-semibold text-gray-900 mb-2">Standard English</div>
                    <div className="text-xs text-gray-500 mb-3">Academic vocabulary</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic">
                      &quot;I enjoy exploring new ideas and concepts, even if they seem unconventional.&quot;
                    </div>
                  </button>

                  {/* Simple English (ESL) Option */}
                  <button
                    onClick={() => handleLanguageChange('esl')}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      languageMode === 'esl'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {languageMode === 'esl' && (
                      <div className="absolute top-3 right-3">
                        <Check className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div className="font-semibold text-gray-900 mb-2">Simple English</div>
                    <div className="text-xs text-gray-500 mb-3">Easier to understand</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 italic">
                      &quot;I like learning about new and different ideas.&quot;
                    </div>
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  You can change this anytime during the assessment
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <button
                  onClick={handleStartAssessment}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {assessmentData?.responses && Object.keys(assessmentData.responses).length > 0 ? (
                    <>
                      Continue Assessment
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Start Assessment
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="block w-full py-3 text-center text-gray-600 hover:text-gray-900"
                >
                  Back to Dashboard
                </Link>
              </div>

              {/* Resume Notice */}
              {assessmentData?.responses && Object.keys(assessmentData.responses).length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-800">
                    <strong>Welcome back!</strong> You have{' '}
                    {Object.keys(assessmentData.responses).length} answers saved.
                    Continue where you left off.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Assessment Step */}
        {currentStep === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
          >
            <PilotAssessmentFlow
              initialResponses={(assessmentData?.responses as Record<string, number>) || {}}
              onComplete={handleAssessmentComplete}
              onSave={handleSaveProgress}
              languageMode={languageMode}
              onLanguageChange={handleLanguageChange}
            />
          </motion.div>
        )}

        {/* University Preferences Step */}
        {currentStep === 'university' && (
          <motion.div
            key="university"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <UniversityPreferencesStep
              onComplete={handleUniversityComplete}
              onSkip={handleSkipUniversity}
            />
          </motion.div>
        )}

        {/* Survey Step */}
        {currentStep === 'survey' && (
          <motion.div
            key="survey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <PilotSurveyStep
              onComplete={handleSurveyComplete}
              onSkip={handleSkipSurvey}
            />
          </motion.div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="max-w-lg w-full text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Assessment Complete!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for completing the pilot assessment. Your insights help us build better tools for students.
              </p>

              {/* Quick Results */}
              {scores && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Holland Code</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {scores.hollandCode || 'XXX'}
                  </div>
                  <p className="text-sm text-gray-500">
                    Your top 3 career interest areas
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href="/pilot-assessment/results"
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  View Full Results
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Back to Dashboard
                </Link>
              </div>

              {/* Waitlist CTA */}
              <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h4 className="font-semibold text-purple-900 mb-2">
                  Want the Full 510-Question Assessment?
                </h4>
                <p className="text-sm text-purple-700 mb-4">
                  Join our waitlist for the comprehensive career discovery experience.
                </p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  Join Waitlist
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
