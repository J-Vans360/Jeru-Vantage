'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Report = {
  id: string;
  generationNumber: number;
  createdAt: string;
};

type FullReport = Report & {
  reportContent: string;
  assessmentSnapshot: any;
};

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<FullReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/ai-jeru');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReport = async (id: string) => {
    setIsLoadingReport(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai-jeru?reportId=${id}`);
      if (!response.ok) throw new Error('Failed to load report');
      const data = await response.json();
      setSelectedReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setIsLoadingReport(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get summary from assessment snapshot
  const getSnapshotSummary = (snapshot: any) => {
    if (!snapshot) return null;
    const profile = snapshot.profile || {};
    const assessmentCount = Object.keys(snapshot.assessments || {}).length;
    return {
      name: profile.studentName || profile.name || 'Student',
      grade: profile.grade || 'N/A',
      assessments: assessmentCount,
      careerInterests: profile.careerInterests || [],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-amber-600 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/ai-jeru"
                className="text-white/80 hover:text-white transition-colors"
              >
                ← Back
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-4xl">📚</div>
                <div>
                  <h1 className="text-2xl font-bold">My Jeru Reports</h1>
                  <p className="text-sm opacity-90">Your saved guidance reports</p>
                </div>
              </div>
            </div>
            <Link
              href="/ai-jeru"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm"
            >
              + Generate New Report
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin text-5xl mb-4">📚</div>
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-900">Error</h3>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && reports.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="text-7xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Reports Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't generated any Jeru guidance reports yet. Get personalized university and career recommendations based on your assessment results.
            </p>
            <Link
              href="/ai-jeru"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
            >
              Generate Your First Report
            </Link>
          </div>
        )}

        {/* Reports List and Viewer */}
        {!isLoading && reports.length > 0 && (
          <div className="flex gap-8">
            {/* Reports List - Left Side */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-purple-50 border-b">
                  <h2 className="font-bold text-purple-800">
                    All Reports ({reports.length})
                  </h2>
                </div>
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => loadReport(report.id)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors ${
                        selectedReport?.id === report.id ? 'bg-purple-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-800">
                          Report #{report.generationNumber}
                        </span>
                        {selectedReport?.id === report.id && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                            Viewing
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatShortDate(report.createdAt)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reports</span>
                    <span className="font-semibold">{reports.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Report</span>
                    <span className="font-semibold">
                      {formatShortDate(reports[reports.length - 1]?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latest Report</span>
                    <span className="font-semibold">
                      {formatShortDate(reports[0]?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Viewer - Right Side */}
            <div className="flex-1 min-w-0">
              {!selectedReport && !isLoadingReport && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Select a Report
                  </h3>
                  <p className="text-gray-600">
                    Click on a report from the list to view its contents
                  </p>
                </div>
              )}

              {isLoadingReport && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="inline-block animate-spin text-5xl mb-4">📄</div>
                  <p className="text-gray-600">Loading report...</p>
                </div>
              )}

              {selectedReport && !isLoadingReport && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Report Header */}
                  <div className="p-6 bg-gradient-to-r from-purple-600 to-amber-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">
                          Report #{selectedReport.generationNumber}
                        </h2>
                        <p className="text-sm opacity-90">
                          {formatDate(selectedReport.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm"
                        >
                          📄 Print
                        </button>
                        <Link
                          href={`/ai-jeru`}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm"
                        >
                          View Full →
                        </Link>
                      </div>
                    </div>

                    {/* Assessment Snapshot Summary */}
                    {selectedReport.assessmentSnapshot && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-xs opacity-70 mb-2">ASSESSMENT SNAPSHOT</p>
                        {(() => {
                          const summary = getSnapshotSummary(selectedReport.assessmentSnapshot);
                          if (!summary) return null;
                          return (
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span>👤 {summary.name}</span>
                              <span>📚 Grade {summary.grade}</span>
                              <span>📊 {summary.assessments} assessments</span>
                              {summary.careerInterests.length > 0 && (
                                <span>🎯 {summary.careerInterests[0]}</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Report Content */}
                  <div className="p-8 max-h-[calc(100vh-400px)] overflow-y-auto">
                    <article className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-3xl font-bold text-purple-800 mt-8 mb-4 pb-2 border-b-2 border-purple-200">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-2xl font-bold text-purple-700 mt-6 mb-3">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xl font-bold text-amber-700 mt-4 mb-2">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-700 leading-relaxed my-3">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-outside ml-6 space-y-1 my-3 text-gray-700">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-outside ml-6 space-y-1 my-3 text-gray-700">
                              {children}
                            </ol>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-gray-900">{children}</strong>
                          ),
                          hr: () => <hr className="my-6 border-t-2 border-purple-100" />,
                        }}
                      >
                        {selectedReport.reportContent}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compare Reports Feature Placeholder */}
      {reports.length >= 2 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-gradient-to-r from-purple-100 to-amber-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">Compare Reports</h3>
                <p className="text-sm text-gray-600">
                  Track your progress by comparing different reports over time.
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
