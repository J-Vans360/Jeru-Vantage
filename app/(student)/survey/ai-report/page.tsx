'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Star, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const SURVEY_2_QUESTIONS = [
  {
    id: 'q1_helpful',
    question: 'How helpful was the AI Jeru report for understanding your career options?',
    type: 'rating',
  },
  {
    id: 'q2_accuracy',
    question: 'How accurate were the career and university recommendations?',
    type: 'rating',
  },
  {
    id: 'q3_chat',
    question: 'How was your experience chatting with AI Jeru?',
    type: 'choice',
    options: ['Very helpful', 'Somewhat helpful', 'Not very helpful', 'Did not use chat'],
  },
  {
    id: 'q4_recommend',
    question: 'Would you recommend Jeru Vantage to a friend?',
    type: 'choice',
    options: ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not'],
  },
  {
    id: 'q5_feedback',
    question: 'Any final thoughts or suggestions?',
    type: 'text',
    optional: true,
  },
];

export default function AiReportSurveyPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPaidUser, setIsPaidUser] = useState(false);

  // Check if user is paid (can skip survey)
  useEffect(() => {
    async function checkUserType() {
      try {
        const res = await fetch('/api/student/status');
        if (res.ok) {
          const data = await res.json();
          setIsPaidUser(data.isPaidUser || false);
        }
      } catch (error) {
        console.error('Failed to check user type:', error);
      }
    }
    checkUserType();
  }, []);

  const handleResponse = (questionId: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyType: 'ai_report_feedback',
          responses,
        }),
      });
      setIsComplete(true);
    } catch (error) {
      console.error('Survey submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen - redirect to university consent
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve Jeru Vantage for students everywhere.
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 mb-6">
            <p className="text-indigo-900 font-medium mb-2">One more step!</p>
            <p className="text-sm text-indigo-700">Share your university preferences to unlock your downloadable report.</p>
          </div>

          <button
            onClick={() => router.push('/consent/university')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = SURVEY_2_QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === SURVEY_2_QUESTIONS.length - 1;
  const canProceed = currentQ.optional || responses[currentQ.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Almost Done!</h1>
          <p className="text-gray-600 mt-2">
            Quick feedback to unlock your downloadable report.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {SURVEY_2_QUESTIONS.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / SURVEY_2_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{currentQ.question}</h2>

          {currentQ.type === 'rating' && (
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleResponse(currentQ.id, star)}
                  className={`p-2 rounded-lg transition-all ${
                    (responses[currentQ.id] as number) >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-10 h-10 fill-current" />
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleResponse(currentQ.id, option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    responses[currentQ.id] === option ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'text' && (
            <textarea
              value={(responses[currentQ.id] as string) || ''}
              onChange={(e) => handleResponse(currentQ.id, e.target.value)}
              placeholder="Your feedback (optional)"
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-gray-600 disabled:opacity-50"
          >
            Back
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Unlock Download <ArrowRight className="w-5 h-5" /></>}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!canProceed}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Skip option for paid users only */}
        {isPaidUser && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/consent/university')}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              Skip survey and continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
