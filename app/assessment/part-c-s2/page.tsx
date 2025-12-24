'use client';
import { useState } from 'react';
import { useUserId } from '@/lib/get-user-id';
import { useRouter } from 'next/navigation';
import assessmentData from '@/data/part-c-s2-execution.json';
import { calculateExecutionScores } from '@/lib/scoring';
import ExecutionResultsDisplay from '@/components/assessment/ExecutionResultsDisplay';


export default function PartCS2Page() {
  const router = useRouter();
  const userId = useUserId();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scores, setScores] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!userId) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const { section, questions, domains } = assessmentData;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    } else if (Object.keys(newAnswers).length === questions.length) {
      handleComplete(newAnswers);
    }
  };

  const handleComplete = async (finalAnswers: Record<number, number>) => {
    const calculatedScores = calculateExecutionScores(finalAnswers, assessmentData);
    setScores(calculatedScores);
    setIsComplete(true);
    setIsSaving(true);
    try {
      await fetch('/api/assessment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sectionId: section.id, answers: finalAnswers, scores: calculatedScores }),
      });
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); };
  const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1); };
  const isCurrentAnswered = answers[currentQuestion?.id] !== undefined;
  const selectedValue = answers[currentQuestion?.id];

  if (isComplete && scores) {
    return <ExecutionResultsDisplay section={section} scores={scores} domains={domains} onContinue={() => router.push('/results')} continueButtonText="All Parts Complete! View Your Results →" isSaving={isSaving} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{section.icon}</span>
            <div><h1 className="text-3xl font-bold text-gray-900">{section.title}</h1><p className="text-lg text-gray-600">{section.subtitle}</p></div>
          </div>
          <p className="text-gray-600 mb-4">{section.description}</p><p className="text-sm text-gray-500">⏱️ {section.estimatedTime}</p>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm text-gray-500">{answeredCount} / {questions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-8"><p className="text-2xl text-gray-800 font-medium leading-relaxed">{currentQuestion.text}</p></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} onClick={() => handleAnswer(value)} className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedValue === value ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{section.scale.labels[value.toString() as keyof typeof section.scale.labels]}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedValue === value ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                    {selectedValue === value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">← Back</button>
          <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Next →</button>
        </div>
        {isCurrentAnswered && <div className="mt-4 text-center"><p className="text-sm text-green-600 font-medium">✓ Answer saved</p></div>}
      </div>
    </div>
  );
}
