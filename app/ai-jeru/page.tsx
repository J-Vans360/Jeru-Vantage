'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function AIJeruPage() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-jeru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 rounded-t-2xl p-8 shadow-lg text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🧙‍♂️</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Meet Jeru</h1>
              <p className="text-lg opacity-90">
                Your AI-Powered University & Career Guidance Counselor
              </p>
            </div>
          </div>
          <p className="text-sm opacity-80 max-w-3xl">
            With 20+ years of experience, Jeru analyzes your complete profile to provide personalized guidance
            on university admissions, career pathways, and your unique Ikigai journey.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-2xl p-8 shadow-lg">
          {!recommendations && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Discover Your Path?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Jeru will analyze your personality, values, skills, and aspirations to create a comprehensive
                guidance report tailored just for you. This includes university recommendations, career pathways,
                and a strategic action plan.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-bold text-amber-900 mb-3">What You'll Receive:</h3>
                <ul className="text-left text-sm text-amber-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">📊</span>
                    <span>Executive Summary & Your Unique Archetype</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">🎯</span>
                    <span>Personalized Ikigai Blueprint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">🎓</span>
                    <span>University Strategy (Safety/Target/Reach)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">🛤️</span>
                    <span>3 Alternative Career Pathways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">📈</span>
                    <span>Gap Analysis & Action Plan</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={getRecommendations}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                Ask Jeru for Guidance
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin text-6xl mb-6">🧙‍♂️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Jeru is Analyzing Your Profile...
              </h2>
              <p className="text-gray-600 mb-4">
                This may take 30-60 seconds as we process your complete assessment data.
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Error</h3>
                  <p className="text-red-800 mb-4">{error}</p>
                  <button
                    onClick={getRecommendations}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {recommendations && (
            <div className="prose prose-lg max-w-none">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Your Personalized Guidance Report</h2>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm no-print"
                >
                  📄 Print Report
                </button>
              </div>

              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-purple-700 mt-8 mb-4 border-b-2 border-purple-200 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-amber-700 mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 my-4 text-gray-700">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700">
                        {children}
                      </ol>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed my-3">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-gray-900">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {recommendations}
                </ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 no-print">
                <button
                  onClick={() => setRecommendations(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  ← Get New Guidance
                </button>
                <Link
                  href="/results"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  View Assessment Results →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="mt-6 text-center">
            <Link
              href="/assessment"
              className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
            >
              ← Back to Assessment Hub
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
