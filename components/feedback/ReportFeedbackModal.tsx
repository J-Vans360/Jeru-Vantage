'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  X,
  Send,
  MessageSquare,
  Sparkles,
  Quote,
  ChevronRight,
  Check,
} from 'lucide-react';

interface ReportFeedbackModalProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onSubmit: () => void;
}

type Step = 'rating' | 'feedback' | 'testimonial' | 'thanks';

export default function ReportFeedbackModal({
  studentId,
  studentName,
  onClose,
  onSubmit,
}: ReportFeedbackModalProps) {
  const [step, setStep] = useState<Step>('rating');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    overallRating: 0,
    accuracyRating: 0,
    npsScore: -1,
    mostValuableInsight: '',
    improvementSuggestion: '',
    canFeature: false,
    featureAnonymously: true,
    testimonialQuote: '',
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/feedback/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          ...form,
        }),
      });
      setStep('thanks');
      setTimeout(() => {
        onSubmit();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
    setSubmitting(false);
  };

  const canProceedFromRating =
    form.overallRating > 0 && form.accuracyRating > 0 && form.npsScore >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Your Feedback Matters</h3>
              <p className="text-white/70 text-sm">Help us improve Jeru Vantage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        {step !== 'thanks' && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {['rating', 'feedback', 'testimonial'].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      step === s
                        ? 'bg-blue-600 text-white'
                        : ['rating', 'feedback', 'testimonial'].indexOf(step) > idx
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }
                  `}
                  >
                    {['rating', 'feedback', 'testimonial'].indexOf(step) > idx ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 2 && (
                    <div
                      className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                        ['rating', 'feedback', 'testimonial'].indexOf(step) > idx
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Ratings */}
            {step === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Hi {studentName.split(' ')[0]}!
                  </h4>
                  <p className="text-gray-600">How was your Jeru Report experience?</p>
                </div>

                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How helpful was your Jeru Report?
                  </label>
                  <StarRating
                    value={form.overallRating}
                    onChange={(val) => setForm({ ...form, overallRating: val })}
                  />
                </div>

                {/* Accuracy Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How accurate do you feel the results are?
                  </label>
                  <StarRating
                    value={form.accuracyRating}
                    onChange={(val) => setForm({ ...form, accuracyRating: val })}
                  />
                </div>

                {/* NPS Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How likely are you to recommend Jeru Vantage to a friend?
                  </label>
                  <NPSSlider
                    value={form.npsScore}
                    onChange={(val) => setForm({ ...form, npsScore: val })}
                  />
                </div>

                <button
                  onClick={() => setStep('feedback')}
                  disabled={!canProceedFromRating}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Qualitative Feedback */}
            {step === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Tell Us More</h4>
                  <p className="text-gray-600">Your insights help us create better experiences</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What was the most valuable insight from your report?
                  </label>
                  <textarea
                    rows={3}
                    value={form.mostValuableInsight}
                    onChange={(e) => setForm({ ...form, mostValuableInsight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Learning about my Holland Code really helped me understand my career interests..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What could we improve?
                  </label>
                  <textarea
                    rows={3}
                    value={form.improvementSuggestion}
                    onChange={(e) => setForm({ ...form, improvementSuggestion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any suggestions to make the report more helpful..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('rating')}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('testimonial')}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Testimonial */}
            {step === 'testimonial' && (
              <motion.div
                key="testimonial"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Quote className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Share Your Story?</h4>
                  <p className="text-gray-600">Help future students by sharing your experience</p>
                </div>

                {/* Feature Consent */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.canFeature}
                      onChange={(e) => setForm({ ...form, canFeature: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        Yes, you can feature my feedback
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        We may display your feedback on our website to help other students
                      </p>
                    </div>
                  </label>

                  {form.canFeature && (
                    <div className="mt-4 pl-8 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={form.featureAnonymously}
                          onChange={() => setForm({ ...form, featureAnonymously: true })}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Show as anonymous</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!form.featureAnonymously}
                          onChange={() => setForm({ ...form, featureAnonymously: false })}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Show with my first name</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Custom Quote */}
                {form.canFeature && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Write a short testimonial (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={form.testimonialQuote}
                      onChange={(e) => setForm({ ...form, testimonialQuote: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., This report helped me discover my true career path..."
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('feedback')}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Thank You */}
            {step === 'thanks' && (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-10 h-10 text-green-600" />
                </motion.div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h4>
                <p className="text-gray-600 mb-4">
                  Your feedback helps us create better experiences for students like you.
                </p>
                <p className="text-sm text-gray-400">Closing automatically...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Star Rating Component
function StarRating({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const [hovered, setHovered] = useState(0);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-10 h-10 transition-colors ${
                star <= (hovered || value) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500 h-5">{labels[hovered || value] || 'Select a rating'}</span>
    </div>
  );
}

// NPS Slider Component
function NPSSlider({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`
              w-8 h-8 rounded-lg text-sm font-medium transition-all
              ${
                value === num
                  ? num <= 6
                    ? 'bg-red-500 text-white'
                    : num <= 8
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  );
}
