'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MessageSquare, ChevronRight, ChevronLeft, Check, Sparkles,
  DollarSign, Lightbulb, Share2, Heart, ThumbsUp, Send
} from 'lucide-react';

interface PilotSurveyFlowProps {
  studentId: string;
  studentName: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

const REFERRAL_SOURCES = [
  { id: 'friend', label: 'Friend or Family', icon: '👥' },
  { id: 'teacher', label: 'Teacher/Counselor', icon: '👨‍🏫' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
  { id: 'school', label: 'School Event/Fair', icon: '🏫' },
  { id: 'search', label: 'Google Search', icon: '🔍' },
  { id: 'advertisement', label: 'Advertisement', icon: '📺' },
  { id: 'other', label: 'Other', icon: '💬' },
];

const CHALLENGES = [
  { id: 'too_many_options', label: 'Too many options, hard to narrow down', icon: '🤯' },
  { id: 'lack_info', label: 'Lack of information about universities', icon: '❓' },
  { id: 'cost_concerns', label: 'Cost and financial concerns', icon: '💰' },
  { id: 'career_uncertainty', label: 'Unsure about career path', icon: '🎯' },
  { id: 'admission_requirements', label: 'Understanding admission requirements', icon: '📋' },
  { id: 'location_decision', label: 'Deciding on location/country', icon: '🌍' },
  { id: 'family_pressure', label: 'Family expectations and pressure', icon: '👨‍👩‍👧' },
  { id: 'visa_concerns', label: 'Visa and immigration concerns', icon: '🛂' },
  { id: 'other', label: 'Other', icon: '💬' },
];

const PRICE_RANGES = [
  { id: 'free_only', label: 'Free only', value: '$0' },
  { id: 'under_10', label: 'Under $10', value: '$1-10' },
  { id: '10_25', label: '$10 - $25', value: '$10-25' },
  { id: '25_50', label: '$25 - $50', value: '$25-50' },
  { id: '50_100', label: '$50 - $100', value: '$50-100' },
  { id: 'over_100', label: 'Over $100', value: '$100+' },
];

const DESIRED_FEATURES = [
  { id: 'career_counseling', label: '1-on-1 Career Counseling', icon: '🎯' },
  { id: 'university_matching', label: 'AI University Matching', icon: '🤖' },
  { id: 'application_help', label: 'Application Essay Help', icon: '✍️' },
  { id: 'scholarship_finder', label: 'Scholarship Finder', icon: '🎓' },
  { id: 'interview_prep', label: 'Interview Preparation', icon: '🎤' },
  { id: 'visa_guidance', label: 'Visa & Immigration Guidance', icon: '🛂' },
  { id: 'alumni_connect', label: 'Connect with Alumni', icon: '🤝' },
  { id: 'virtual_tours', label: 'Virtual Campus Tours', icon: '🏛️' },
  { id: 'parent_resources', label: 'Resources for Parents', icon: '👨‍👩‍👧' },
  { id: 'peer_community', label: 'Peer Community/Forum', icon: '💬' },
];

export default function PilotSurveyFlow({
  studentId,
  studentName,
  onComplete,
  onSkip,
}: PilotSurveyFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    referralSource: '',
    referralOther: '',
    biggestChallenge: '',
    challengeDetails: '',
    willingToPay: '',
    priceRange: '',
    desiredFeatures: [] as string[],
    otherFeatures: '',
    generalFeedback: '',
    npsScore: undefined as number | undefined,
  });

  const totalSteps = 5;

  const toggleFeature = (featureId: string) => {
    setForm(prev => ({
      ...prev,
      desiredFeatures: prev.desiredFeatures.includes(featureId)
        ? prev.desiredFeatures.filter(f => f !== featureId)
        : [...prev.desiredFeatures, featureId],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await fetch('/api/pilot/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralSource: form.referralSource,
          referralOther: form.referralOther || null,
          biggestChallenge: form.biggestChallenge,
          challengeDetails: form.challengeDetails || null,
          willingToPay: form.willingToPay,
          priceRange: form.priceRange || null,
          desiredFeatures: form.desiredFeatures,
          otherFeatures: form.otherFeatures || null,
          generalFeedback: form.generalFeedback || null,
        }),
      });

      if (onComplete) {
        onComplete();
      } else {
        router.push('/pilot-assessment/results');
      }
    } catch (error) {
      console.error('Failed to save survey:', error);
      if (onComplete) {
        onComplete();
      } else {
        router.push('/pilot-assessment/results');
      }
    }

    setSubmitting(false);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push('/pilot-assessment/results');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.referralSource !== '';
      case 2: return form.biggestChallenge !== '';
      case 3: return form.willingToPay !== '';
      case 4: return form.desiredFeatures.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Quick Feedback Survey
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Help Us Improve!
          </h1>
          <p className="text-gray-600">
            Your feedback shapes the future of Jeru Vantage (2 min)
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-purple-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Referral Source */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">How did you hear about us?</h2>
                  <p className="text-sm text-gray-500">Select one option</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {REFERRAL_SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setForm(prev => ({ ...prev, referralSource: source.id }))}
                    className={`
                      p-4 rounded-xl text-left transition-all
                      ${form.referralSource === source.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <span className="text-2xl mb-2 block">{source.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{source.label}</span>
                  </button>
                ))}
              </div>

              {form.referralSource === 'other' && (
                <input
                  type="text"
                  placeholder="Please specify..."
                  value={form.referralOther}
                  onChange={(e) => setForm(prev => ({ ...prev, referralOther: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              )}
            </motion.div>
          )}

          {/* Step 2: Biggest Challenge */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">What&apos;s your biggest challenge?</h2>
                  <p className="text-sm text-gray-500">In choosing a university/career</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {CHALLENGES.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => setForm(prev => ({ ...prev, biggestChallenge: challenge.id }))}
                    className={`
                      w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all
                      ${form.biggestChallenge === challenge.id
                        ? 'bg-orange-100 border-2 border-orange-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <span className="text-xl">{challenge.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{challenge.label}</span>
                  </button>
                ))}
              </div>

              {form.biggestChallenge && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us more (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific details about your challenge..."
                    value={form.challengeDetails}
                    onChange={(e) => setForm(prev => ({ ...prev, challengeDetails: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Willingness to Pay */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Would you pay for detailed guidance?</h2>
                  <p className="text-sm text-gray-500">For comprehensive career & university guidance</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { value: 'YES', label: 'Yes, if it provides real value', emoji: '✅' },
                  { value: 'MAYBE', label: 'Maybe, depends on the price and features', emoji: '🤔' },
                  { value: 'NO', label: 'No, I prefer free resources', emoji: '❌' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setForm(prev => ({ ...prev, willingToPay: option.value }))}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all
                      ${form.willingToPay === option.value
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <span className="font-medium text-gray-700">
                      {option.emoji} {option.label}
                    </span>
                  </button>
                ))}
              </div>

              {(form.willingToPay === 'YES' || form.willingToPay === 'MAYBE') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What price range seems reasonable?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRICE_RANGES.map((price) => (
                      <button
                        key={price.id}
                        onClick={() => setForm(prev => ({ ...prev, priceRange: price.id }))}
                        className={`
                          p-3 rounded-xl text-center transition-all
                          ${form.priceRange === price.id
                            ? 'bg-green-100 border-2 border-green-500'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                          }
                        `}
                      >
                        <div className="font-bold text-gray-900">{price.value}</div>
                        <div className="text-xs text-gray-500">{price.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Desired Features */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">What features would help you?</h2>
                  <p className="text-sm text-gray-500">Select all that interest you</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {DESIRED_FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`
                      p-3 rounded-xl text-left transition-all flex items-center gap-2
                      ${form.desiredFeatures.includes(feature.id)
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-xs font-medium text-gray-700 flex-1">{feature.label}</span>
                    {form.desiredFeatures.includes(feature.id) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any other features you&apos;d like? (optional)
                </label>
                <input
                  type="text"
                  placeholder="Tell us your ideas..."
                  value={form.otherFeatures}
                  onChange={(e) => setForm(prev => ({ ...prev, otherFeatures: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: General Feedback & NPS */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Any final thoughts?</h2>
                  <p className="text-sm text-gray-500">We read every response!</p>
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Share any feedback, suggestions, or thoughts about your experience..."
                value={form.generalFeedback}
                onChange={(e) => setForm(prev => ({ ...prev, generalFeedback: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 mb-6"
              />

              {/* NPS Score */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  How likely are you to recommend Jeru Vantage to a friend?
                </p>
                <div className="flex justify-between gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setForm(prev => ({ ...prev, npsScore: score }))}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium text-sm transition-all ${
                        form.npsScore === score
                          ? score <= 6
                            ? 'bg-red-500 text-white'
                            : score <= 8
                              ? 'bg-yellow-500 text-white'
                              : 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <ThumbsUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-800">
                    <strong>Thank you for your feedback!</strong> Your input directly shapes
                    how we build Jeru Vantage for students like you.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-400 hover:text-gray-600"
            >
              Skip Survey
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit & View Results
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
