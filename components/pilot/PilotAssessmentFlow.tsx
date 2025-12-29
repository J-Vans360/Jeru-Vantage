'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Save,
  Globe,
} from 'lucide-react';
import { PILOT_DOMAINS, PILOT_QUESTIONS, PilotQuestion, LanguageMode, getQuestionText } from '@/lib/pilot/pilotQuestions';
import { getProgressByDomain } from '@/lib/pilot/pilotScoring';

interface PilotAssessmentFlowProps {
  initialResponses?: Record<string, number>;
  onComplete: (responses: Record<string, number>) => void;
  onSave: (responses: Record<string, number>) => void;
  languageMode: LanguageMode;
  onLanguageChange: (mode: LanguageMode) => void;
}

const QUESTIONS_PER_PAGE = 5;

export default function PilotAssessmentFlow({
  initialResponses = {},
  onComplete,
  onSave,
  languageMode,
  onLanguageChange,
}: PilotAssessmentFlowProps) {
  const [responses, setResponses] = useState<Record<string, number>>(initialResponses);
  const [currentPage, setCurrentPage] = useState(() => {
    // If resuming with saved responses, find the first unanswered question's page
    if (Object.keys(initialResponses).length > 0) {
      const firstUnansweredIndex = PILOT_QUESTIONS.findIndex(
        (q) => initialResponses[q.id] === undefined
      );
      if (firstUnansweredIndex === -1) {
        // All answered, go to last page
        return Math.ceil(PILOT_QUESTIONS.length / QUESTIONS_PER_PAGE) - 1;
      }
      return Math.floor(firstUnansweredIndex / QUESTIONS_PER_PAGE);
    }
    return 0;
  });
  const [startTime] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get questions in order
  const questions = PILOT_QUESTIONS;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  // Calculate progress
  const answeredCount = Object.keys(responses).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Get current domain for display
  const currentDomain = currentQuestions[0]
    ? PILOT_DOMAINS.find((d) => d.id === currentQuestions[0].domainId)
    : null;

  const handleSave = useCallback(() => {
    setSaving(true);
    onSave(responses);
    setLastSaved(new Date());
    setSaving(false);
  }, [responses, onSave]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(responses).length > 0) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [responses, handleSave]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleAnswer = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const canGoNext = () => {
    // Check if all current page questions are answered
    return currentQuestions.every((q) => responses[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (answeredCount === questions.length) {
      // All questions answered, complete assessment
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Calculate elapsed time
  const getElapsedTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Domain progress
  const domainProgress = getProgressByDomain(responses);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Question {currentPage * QUESTIONS_PER_PAGE + 1}-
              {Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, questions.length)} of{' '}
              {questions.length}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {getElapsedTime()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onLanguageChange('standard')}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  languageMode === 'standard'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Globe className="w-3 h-3" />
                Standard
              </button>
              <button
                onClick={() => onLanguageChange('esl')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  languageMode === 'esl'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Simple
              </button>
            </div>
            {lastSaved && (
              <span className="text-xs text-gray-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{answeredCount} answered</span>
          <span>{progressPercent}% complete</span>
        </div>
      </div>

      {/* Domain Header */}
      {currentDomain && (
        <motion.div
          key={currentDomain.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentDomain.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentDomain.name}</h2>
              <p className="text-sm text-gray-500">{currentDomain.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {domainProgress
              .filter((d) => d.domainId === currentDomain.id)
              .map((d) => (
                <div key={d.domainId} className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${d.percentage}%`,
                        backgroundColor: currentDomain.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {d.answered}/{d.total}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Questions */}
      <div className="space-y-6 px-4">
        <AnimatePresence mode="wait">
          {currentQuestions.map((question, idx) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={currentPage * QUESTIONS_PER_PAGE + idx + 1}
              value={responses[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
              languageMode={languageMode}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 px-4 pb-8">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(totalPages, 10) }).map((_, idx) => {
            const pageIdx =
              totalPages <= 10
                ? idx
                : currentPage < 5
                  ? idx
                  : currentPage > totalPages - 6
                    ? totalPages - 10 + idx
                    : currentPage - 5 + idx;

            return (
              <button
                key={pageIdx}
                onClick={() => setCurrentPage(pageIdx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  pageIdx === currentPage ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext()}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-colors ${
            canGoNext()
              ? currentPage === totalPages - 1
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentPage === totalPages - 1 ? (
            <>
              Complete
              <CheckCircle className="w-5 h-5" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Domain Progress Sidebar (Desktop) */}
      <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Progress</h4>
        <div className="space-y-2">
          {domainProgress.map((domain) => {
            const domainDef = PILOT_DOMAINS.find((d) => d.id === domain.domainId);
            const isActive = currentDomain?.id === domain.domainId;

            return (
              <div
                key={domain.domainId}
                className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{domainDef?.icon}</span>
                  <span className={`text-xs ${isActive ? 'font-medium text-blue-900' : 'text-gray-600'}`}>
                    {domain.domainName.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${domain.percentage}%`,
                        backgroundColor: domain.percentage === 100 ? '#10b981' : domainDef?.color,
                      }}
                    />
                  </div>
                  {domain.percentage === 100 && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Question Card Component
function QuestionCard({
  question,
  questionNumber,
  value,
  onChange,
  languageMode,
}: {
  question: PilotQuestion;
  questionNumber: number;
  value: number | undefined;
  onChange: (value: number) => void;
  languageMode: LanguageMode;
}) {
  const questionText = getQuestionText(question, languageMode);
  const likertOptions = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl border p-6 transition-colors ${
        value !== undefined ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
          {questionNumber}
        </span>
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-4">{questionText}</p>

          {/* Likert Scale */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {likertOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                  value === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{option.value}</span>
                <span className="sm:hidden">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Labels */}
          <div className="hidden sm:flex justify-between mt-2 text-xs text-gray-400">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>

        {/* Answered indicator */}
        {value !== undefined && (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>
    </motion.div>
  );
}
