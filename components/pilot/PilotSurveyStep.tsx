'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ChevronRight,
  Sparkles,
  DollarSign,
  Lightbulb,
  Users,
  CheckCircle,
} from 'lucide-react';

interface PilotSurveyData {
  referralSource: string;
  referralOther?: string;
  biggestChallenge: string;
  challengeDetails?: string;
  willingToPay: string;
  priceRange?: string;
  desiredFeatures: string[];
  otherFeatures?: string;
  generalFeedback?: string;
}

interface PilotSurveyStepProps {
  onComplete: (data: PilotSurveyData) => void;
  onSkip: () => void;
}

const REFERRAL_SOURCES = [
  'Google Search',
  'Social Media (Instagram, TikTok, etc.)',
  'Friend or Family',
  'School Counselor',
  'YouTube',
  'Blog or Article',
  'Education Fair',
  'Other',
];

const CHALLENGES = [
  "I don't know what career is right for me",
  "I don't know which universities to apply to",
  "I'm unsure about my strengths and weaknesses",
  'Application essays and personal statements',
  'Understanding admission requirements',
  'Choosing the right major/course',
  'Finding scholarships and financial aid',
  "I'm overwhelmed by the whole process",
  'Other',
];

const PRICE_RANGES = [
  'Free only',
  '$10 - $25 (one-time)',
  '$25 - $50 (one-time)',
  '$50 - $100 (one-time)',
  '$100+ for premium features',
  'Monthly subscription ($5-15/month)',
];

const DESIRED_FEATURES = [
  'Full 510-question comprehensive assessment',
  'University matching and recommendations',
  'Career path suggestions',
  'Scholarship finder',
  'Application essay feedback',
  ' 1-on-1 counselor sessions',
  'Parent/Guardian dashboard',
  'School counselor integration',
  'Mobile app',
  'WhatsApp notifications',
];

export default function PilotSurveyStep({ onComplete, onSkip }: PilotSurveyStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PilotSurveyData>({
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
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleFeature = (feature: string) => {
    setData((prev) => ({
      ...prev,
      desiredFeatures: prev.desiredFeatures.includes(feature)
        ? prev.desiredFeatures.filter((f) => f !== feature)
        : [...prev.desiredFeatures, feature],
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
        return true; // Feedback is optional
      default:
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Survey</h1>
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
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-6"
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
                  key={source}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    data.referralSource === source
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="referralSource"
                    value={source}
                    checked={data.referralSource === source}
                    onChange={(e) =>
                      setData({ ...data, referralSource: e.target.value })
                    }
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{source}</span>
                </label>
              ))}
            </div>
            {data.referralSource === 'Other' && (
              <input
                type="text"
                value={data.referralOther || ''}
                onChange={(e) => setData({ ...data, referralOther: e.target.value })}
                className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  key={challenge}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    data.biggestChallenge === challenge
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="challenge"
                    value={challenge}
                    checked={data.biggestChallenge === challenge}
                    onChange={(e) =>
                      setData({ ...data, biggestChallenge: e.target.value })
                    }
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{challenge}</span>
                </label>
              ))}
            </div>
            <textarea
              value={data.challengeDetails || ''}
              onChange={(e) => setData({ ...data, challengeDetails: e.target.value })}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              {['YES', 'MAYBE', 'NO'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.willingToPay === option
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="willingToPay"
                    value={option}
                    checked={data.willingToPay === option}
                    onChange={(e) => setData({ ...data, willingToPay: e.target.value })}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 font-medium">
                    {option === 'YES'
                      ? 'Yes, if the value is clear'
                      : option === 'MAYBE'
                        ? 'Maybe, depends on the price'
                        : "No, I prefer free tools only"}
                  </span>
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
                      key={range}
                      onClick={() => setData({ ...data, priceRange: range })}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        data.priceRange === range
                          ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DESIRED_FEATURES.map((feature) => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    data.desiredFeatures.includes(feature)
                      ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      data.desiredFeatures.includes(feature)
                        ? 'bg-purple-600'
                        : 'border border-gray-300'
                    }`}
                  >
                    {data.desiredFeatures.includes(feature) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {feature}
                </button>
              ))}
            </div>

            <textarea
              value={data.otherFeatures || ''}
              onChange={(e) => setData({ ...data, otherFeatures: e.target.value })}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Any other features you'd like to see? (optional)"
              rows={2}
            />
          </div>
        )}

        {/* Step 5: General Feedback */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Your thoughts, suggestions, or questions..."
              rows={5}
            />

            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>Thank you for your feedback!</strong> Your input directly shapes
                how we build Jeru Vantage. We&apos;re building this for students like you.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentStep === 0 ? (
          <button
            onClick={onSkip}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            Skip Survey
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
