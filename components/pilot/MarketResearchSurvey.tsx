'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  DollarSign,
  Lightbulb,
  Users,
  CheckCircle,
  ThumbsUp,
  Send,
} from 'lucide-react';

interface MarketResearchData {
  referralSource: string;
  referralOther?: string;
  biggestChallenge: string;
  challengeDetails?: string;
  willingToPay: 'YES' | 'MAYBE' | 'NO' | '';
  priceRange?: string;
  desiredFeatures: string[];
  otherFeatures?: string;
  generalFeedback?: string;
  npsScore?: number;
}

interface MarketResearchSurveyProps {
  studentId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const REFERRAL_SOURCES = [
  { id: 'google', label: 'Google Search', icon: '🔍' },
  { id: 'social', label: 'Social Media (Instagram, TikTok, etc.)', icon: '📱' },
  { id: 'friend', label: 'Friend or Family', icon: '👥' },
  { id: 'counselor', label: 'School Counselor', icon: '🎓' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'blog', label: 'Blog or Article', icon: '📝' },
  { id: 'fair', label: 'Education Fair', icon: '🎪' },
  { id: 'other', label: 'Other', icon: '💬' },
];

const CHALLENGES = [
  { id: 'career', label: "I don't know what career is right for me", icon: '🤔' },
  { id: 'university', label: "I don't know which universities to apply to", icon: '🏛️' },
  { id: 'strengths', label: "I'm unsure about my strengths and weaknesses", icon: '💪' },
  { id: 'essays', label: 'Application essays and personal statements', icon: '✍️' },
  { id: 'requirements', label: 'Understanding admission requirements', icon: '📋' },
  { id: 'major', label: 'Choosing the right major/course', icon: '📚' },
  { id: 'financial', label: 'Finding scholarships and financial aid', icon: '💰' },
  { id: 'overwhelmed', label: "I'm overwhelmed by the whole process", icon: '😰' },
  { id: 'other', label: 'Other', icon: '💬' },
];

const PRICE_RANGES = [
  { id: 'free', label: 'Free only', description: "I prefer free tools" },
  { id: '10-25', label: '$10 - $25', description: 'One-time payment' },
  { id: '25-50', label: '$25 - $50', description: 'One-time payment' },
  { id: '50-100', label: '$50 - $100', description: 'One-time payment' },
  { id: '100+', label: '$100+', description: 'For premium features' },
  { id: 'subscription', label: '$5-15/month', description: 'Monthly subscription' },
];

const DESIRED_FEATURES = [
  { id: 'full-assessment', label: 'Full 510-question comprehensive assessment', popular: true },
  { id: 'university-matching', label: 'University matching and recommendations', popular: true },
  { id: 'career-paths', label: 'Career path suggestions', popular: true },
  { id: 'scholarship', label: 'Scholarship finder', popular: false },
  { id: 'essay-feedback', label: 'Application essay feedback', popular: false },
  { id: 'counselor', label: '1-on-1 counselor sessions', popular: false },
  { id: 'parent-dashboard', label: 'Parent/Guardian dashboard', popular: false },
  { id: 'school-integration', label: 'School counselor integration', popular: false },
  { id: 'mobile-app', label: 'Mobile app', popular: false },
  { id: 'whatsapp', label: 'WhatsApp notifications', popular: false },
];

export default function MarketResearchSurvey({
  studentId,
  onComplete,
  onSkip,
}: MarketResearchSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<MarketResearchData>({
    referralSource: '',
    biggestChallenge: '',
    willingToPay: '',
    desiredFeatures: [],
  });

  const steps = [
    { id: 'referral', title: 'How did you find us?', icon: Users },
    { id: 'challenge', title: 'Your biggest challenge', icon: Lightbulb },
    { id: 'pricing', title: 'Value & Pricing', icon: DollarSign },
    { id: 'features', title: 'Desired Features', icon: Sparkles },
    { id: 'feedback', title: 'Final Thoughts', icon: MessageSquare },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleFeature = (featureId: string) => {
    setData((prev) => ({
      ...prev,
      desiredFeatures: prev.desiredFeatures.includes(featureId)
        ? prev.desiredFeatures.filter((f) => f !== featureId)
        : [...prev.desiredFeatures, featureId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.referralSource !== '';
      case 1:
        return data.biggestChallenge !== '';
      case 2:
        return data.willingToPay !== '';
      case 3:
        return data.desiredFeatures.length > 0;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      await fetch('/api/pilot/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          studentId,
        }),
      });

      onComplete();
    } catch (error) {
      console.error('Failed to submit survey:', error);
      onComplete();
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Feedback Survey</h1>
          <p className="text-gray-600">
            Help us build better tools for students like you (2 min)
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  idx < currentStep
                    ? 'bg-green-500 text-white'
                    : idx === currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx < currentStep ? <CheckCircle className="w-5 h-5" /> : idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 h-1 mx-1 rounded ${
                    idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm"
          >
            {/* Step 1: Referral Source */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  How did you hear about Jeru Vantage?
                </h2>
                <div className="space-y-2">
                  {REFERRAL_SOURCES.map((source) => (
                    <label
                      key={source.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        data.referralSource === source.id
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="referralSource"
                        value={source.id}
                        checked={data.referralSource === source.id}
                        onChange={(e) =>
                          setData({ ...data, referralSource: e.target.value })
                        }
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xl">{source.icon}</span>
                      <span className="text-gray-700">{source.label}</span>
                    </label>
                  ))}
                </div>
                {data.referralSource === 'other' && (
                  <input
                    type="text"
                    value={data.referralOther || ''}
                    onChange={(e) => setData({ ...data, referralOther: e.target.value })}
                    className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Please specify..."
                  />
                )}
              </div>
            )}

            {/* Step 2: Biggest Challenge */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  What&apos;s your biggest challenge right now?
                </h2>
                <div className="space-y-2">
                  {CHALLENGES.map((challenge) => (
                    <label
                      key={challenge.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        data.biggestChallenge === challenge.id
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="challenge"
                        value={challenge.id}
                        checked={data.biggestChallenge === challenge.id}
                        onChange={(e) =>
                          setData({ ...data, biggestChallenge: e.target.value })
                        }
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xl">{challenge.icon}</span>
                      <span className="text-gray-700">{challenge.label}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  value={data.challengeDetails || ''}
                  onChange={(e) => setData({ ...data, challengeDetails: e.target.value })}
                  className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tell us more about your challenge (optional)..."
                  rows={3}
                />
              </div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Would you pay for a comprehensive career assessment?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  This helps us understand how to make our tools accessible to everyone.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { value: 'YES', label: 'Yes, if the value is clear', icon: '👍' },
                    { value: 'MAYBE', label: 'Maybe, depends on the price', icon: '🤔' },
                    { value: 'NO', label: 'No, I prefer free tools only', icon: '👎' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        data.willingToPay === option.value
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="willingToPay"
                        value={option.value}
                        checked={data.willingToPay === option.value}
                        onChange={(e) =>
                          setData({ ...data, willingToPay: e.target.value as 'YES' | 'MAYBE' | 'NO' })
                        }
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-gray-700 font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>

                {(data.willingToPay === 'YES' || data.willingToPay === 'MAYBE') && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      What price range seems fair?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setData({ ...data, priceRange: range.id })}
                          className={`p-3 rounded-xl text-left transition-all ${
                            data.priceRange === range.id
                              ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                              : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">{range.label}</div>
                          <div className="text-xs opacity-70">{range.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Desired Features */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  What features would help you most?
                </h2>
                <p className="text-sm text-gray-500 mb-4">Select all that apply</p>

                <div className="space-y-2">
                  {DESIRED_FEATURES.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        data.desiredFeatures.includes(feature.id)
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          data.desiredFeatures.includes(feature.id)
                            ? 'bg-purple-600'
                            : 'border-2 border-gray-300'
                        }`}
                      >
                        {data.desiredFeatures.includes(feature.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-700 flex-1">{feature.label}</span>
                      {feature.popular && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <textarea
                  value={data.otherFeatures || ''}
                  onChange={(e) => setData({ ...data, otherFeatures: e.target.value })}
                  className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Any other features you'd like to see? (optional)"
                  rows={2}
                />
              </div>
            )}

            {/* Step 5: Final Feedback */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Any final thoughts?
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Share feedback, suggestions, or anything else you&apos;d like us to know.
                </p>

                <textarea
                  value={data.generalFeedback || ''}
                  onChange={(e) => setData({ ...data, generalFeedback: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Your thoughts, suggestions, or questions..."
                  rows={5}
                />

                {/* NPS Score */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    How likely are you to recommend Jeru Vantage to a friend?
                  </p>
                  <div className="flex justify-between gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        onClick={() => setData({ ...data, npsScore: score })}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                          data.npsScore === score
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

                <div className="mt-6 bg-purple-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <ThumbsUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-purple-800">
                      <strong>Thank you for your feedback!</strong> Your input directly shapes
                      how we build Jeru Vantage. We&apos;re building this for students like you.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep === 0 ? (
            <button
              onClick={onSkip}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
            >
              Skip Survey
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                <Send className="w-5 h-5" />
                Submit & View Results
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
