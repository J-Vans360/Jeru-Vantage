'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Types
type Report = {
  id: string;
  generationNumber: number;
  createdAt: string;
};

type FullReport = Report & {
  reportContent: string;
  assessmentSnapshot: any;
};

// Table of Contents sections
const TOC_SECTIONS = [
  { id: 'executive-summary', label: '1. Executive Summary', icon: '📊' },
  { id: 'personality-profile', label: '2. Personality Profile', icon: '🧠' },
  { id: 'cognitive-patterns', label: '3. Cognitive Patterns', icon: '⚙️' },
  { id: 'ikigai-blueprint', label: '4. Ikigai Blueprint', icon: '🎯' },
  { id: 'swot-analysis', label: '5. SWOT Analysis', icon: '📈' },
  { id: 'dream-reality', label: '6. Dream vs Reality', icon: '💭' },
  { id: 'recommendation-pathways', label: '7. Pathways', icon: '🛤️' },
  { id: 'university-strategy', label: '8. University Strategy', icon: '🎓' },
  { id: 'action-plan', label: '9. Action Plan', icon: '📋' },
  { id: 'personal-note', label: '10. Personal Note', icon: '💌' },
];

// Map section numbers to IDs
const sectionIdMap: Record<string, string> = {
  '1': 'executive-summary',
  '2': 'personality-profile',
  '3': 'cognitive-patterns',
  '4': 'ikigai-blueprint',
  '5': 'swot-analysis',
  '6': 'dream-reality',
  '7': 'recommendation-pathways',
  '8': 'university-strategy',
  '9': 'action-plan',
  '10': 'personal-note',
};

export default function AIJeruPage() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [generationNumber, setGenerationNumber] = useState<number>(1);
  const [reportDate, setReportDate] = useState<Date | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousReports, setPreviousReports] = useState<Report[]>([]);
  const [showReportsList, setShowReportsList] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch previous reports on load
  useEffect(() => {
    fetchPreviousReports();
  }, []);

  // Track scroll position for active section and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // Find active section based on scroll position
      const sections = TOC_SECTIONS.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(TOC_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [recommendations]);

  const fetchPreviousReports = async () => {
    try {
      const response = await fetch('/api/ai-jeru');
      if (response.ok) {
        const data = await response.json();
        setPreviousReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const loadReport = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setShowReportsList(false);

    try {
      const response = await fetch(`/api/ai-jeru?reportId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to load report');
      }

      const data = await response.json();
      const report = data.report as FullReport;

      setRecommendations(report.reportContent);
      setReportId(report.id);
      setGenerationNumber(report.generationNumber);
      setReportDate(new Date(report.createdAt));
      setCollapsedSections(new Set());
      // Extract student name from assessment snapshot
      const snapshot = report.assessmentSnapshot as any;
      setStudentName(snapshot?.profile?.studentName || snapshot?.profile?.name || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const expandAll = () => setCollapsedSections(new Set());
  const collapseAll = () => setCollapsedSections(new Set(TOC_SECTIONS.map((s) => s.id)));

  const getRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setShowSavedMessage(false);

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
      setReportId(data.reportId);
      setGenerationNumber(data.generationNumber);
      setReportDate(new Date(data.createdAt));
      setStudentName(data.studentName || '');
      setCollapsedSections(new Set());
      setShowSavedMessage(true);

      // Refresh previous reports list
      fetchPreviousReports();

      // Hide saved message after 5 seconds
      setTimeout(() => setShowSavedMessage(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom component to render H2 headers with section IDs and collapse functionality
  const renderH2 = (children: React.ReactNode) => {
    const text = String(children);
    const match = text.match(/^(\d+)\./);
    const sectionNum = match ? match[1] : null;
    const sectionId = sectionNum ? sectionIdMap[sectionNum] : null;
    const isCollapsed = sectionId ? collapsedSections.has(sectionId) : false;

    return (
      <h2
        id={sectionId || undefined}
        className="text-2xl font-bold text-purple-700 mt-10 mb-4 pb-3 border-b-2 border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
        onClick={() => sectionId && toggleSection(sectionId)}
      >
        <span>{children}</span>
        {sectionId && (
          <span className="text-purple-400 text-lg no-print">{isCollapsed ? '▶' : '▼'}</span>
        )}
      </h2>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-indigo-50">
      {/* Header - Always visible */}
      <div className="bg-gradient-to-r from-purple-600 to-amber-600 shadow-lg text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🧙‍♂️</div>
              <div>
                <h1 className="text-2xl font-bold">Jeru</h1>
                <p className="text-sm opacity-90">AI Guidance Counselor</p>
              </div>
            </div>
            <div className="flex items-center gap-3 no-print">
              {/* Previous Reports Dropdown */}
              {previousReports.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowReportsList(!showReportsList)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
                  >
                    📚 My Reports ({previousReports.length})
                    <span className="text-xs">{showReportsList ? '▲' : '▼'}</span>
                  </button>
                  {showReportsList && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="p-3 bg-purple-50 border-b">
                        <h3 className="font-bold text-purple-800 text-sm">Previous Reports</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {previousReports.map((report) => (
                          <button
                            key={report.id}
                            onClick={() => loadReport(report.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-50 ${
                              reportId === report.id ? 'bg-purple-100' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-800 text-sm">
                                Report #{report.generationNumber}
                              </span>
                              {reportId === report.id && (
                                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(report.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </button>
                        ))}
                      </div>
                      <Link
                        href="/my-reports"
                        className="block w-full text-center px-4 py-3 bg-gray-50 text-purple-600 font-semibold text-sm hover:bg-gray-100 transition-colors"
                      >
                        View All Reports →
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {recommendations && (
                <>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
                  >
                    📄 Print
                  </button>
                  <button
                    onClick={() => {
                      setRecommendations(null);
                      setReportId(null);
                    }}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-sm"
                  >
                    + New Report
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pre-Report State */}
        {!recommendations && !isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-7xl mb-6">✨</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Discover Your Path?</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Jeru will analyze your complete assessment profile to create a comprehensive guidance report with
                personalized university recommendations, career pathways, SWOT analysis, and a 90-day action plan.
              </p>

              {/* Show previous reports if available */}
              {!isLoadingReports && previousReports.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-purple-800 mb-3">
                    📚 You have {previousReports.length} previous report{previousReports.length > 1 ? 's' : ''}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {previousReports.slice(0, 3).map((report) => (
                      <button
                        key={report.id}
                        onClick={() => loadReport(report.id)}
                        className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm hover:bg-purple-100 transition-colors"
                      >
                        Report #{report.generationNumber} •{' '}
                        {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </button>
                    ))}
                  </div>
                  {previousReports.length > 3 && (
                    <Link href="/my-reports" className="text-purple-600 text-sm hover:underline">
                      View all {previousReports.length} reports →
                    </Link>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-br from-purple-50 to-amber-50 border border-purple-100 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Your Report Will Include:</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {TOC_SECTIONS.map((section) => (
                    <div key={section.id} className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">{section.icon}</span>
                      <span className="text-sm">{section.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={getRecommendations}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white text-xl font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
              >
                {previousReports.length > 0 ? 'Generate New Report' : 'Generate My Report'}
              </button>

              <p className="text-sm text-gray-500 mt-4">Takes approximately 90-120 seconds to generate</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <div className="inline-block animate-spin text-7xl mb-6">🧙‍♂️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Jeru is Crafting Your Report...</h2>
              <p className="text-gray-600 mb-6">
                Analyzing all 10 assessment sections and creating personalized recommendations just for you.
              </p>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'Personality',
                    'Values',
                    'Holland Code',
                    'Intelligences',
                    'Cognitive Style',
                    'Stress Response',
                    'Skills',
                    'Environment',
                    'Execution',
                    'SWOT',
                  ].map((item, i) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>

              <p className="text-sm text-gray-500 mt-6">This may take 90-120 seconds. Please don't refresh the page.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h3 className="font-bold text-red-900 text-xl mb-2">Something went wrong</h3>
                  <p className="text-red-800 mb-4">{error}</p>
                  <button
                    onClick={getRecommendations}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Display with TOC */}
        {recommendations && (
          <div className="flex gap-8">
            {/* Sticky Table of Contents - Left Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 no-print">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-3 border-b">
                  <h3 className="font-bold text-gray-800">Contents</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={expandAll}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      title="Expand All"
                    >
                      +
                    </button>
                    <button
                      onClick={collapseAll}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      title="Collapse All"
                    >
                      −
                    </button>
                  </div>
                </div>
                <nav className="space-y-1">
                  {TOC_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        activeSection === section.id
                          ? 'bg-purple-100 text-purple-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span className="truncate">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12" ref={contentRef}>
                {/* Report Header */}
                <div className="text-center mb-10 pb-8 border-b-2 border-purple-100">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Jeru Vantage{studentName ? ` - ${studentName}` : ''} - Self Discovery Report
                    </h2>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      #{generationNumber}
                    </span>
                  </div>
                  <p className="text-gray-500">Generated by Jeru, AI Guidance Counselor</p>
                  {reportDate && <p className="text-sm text-gray-400 mt-1">{formatDate(reportDate)}</p>}

                  {/* Saved confirmation */}
                  {showSavedMessage && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold animate-pulse">
                      ✓ Report saved to your account
                    </div>
                  )}
                </div>

                {/* Mobile TOC */}
                <div className="lg:hidden mb-8 no-print">
                  <details className="bg-purple-50 rounded-lg p-4">
                    <summary className="font-bold text-purple-700 cursor-pointer">📋 Jump to Section</summary>
                    <nav className="mt-3 space-y-2">
                      {TOC_SECTIONS.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white hover:bg-purple-100 transition-all flex items-center gap-2"
                        >
                          <span>{section.icon}</span>
                          <span>{section.label}</span>
                        </button>
                      ))}
                    </nav>
                  </details>
                </div>

                {/* Markdown Content with Enhanced Typography */}
                <article className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700 prose-li:text-gray-700">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-4xl font-bold text-purple-800 mt-12 mb-6 pb-4 border-b-4 border-purple-200">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => renderH2(children),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-amber-700 mt-8 mb-3 flex items-center gap-2">{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">{children}</h4>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-6 space-y-2 my-4 text-gray-700">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-6 space-y-2 my-4 text-gray-700">{children}</ol>
                      ),
                      li: ({ children }) => <li className="leading-relaxed pl-2">{children}</li>,
                      p: ({ children }) => <p className="text-gray-700 leading-relaxed my-4 text-base">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                      hr: () => <hr className="my-10 border-t-2 border-purple-100" />,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-amber-400 bg-amber-50 pl-6 py-4 my-6 italic text-gray-700 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {recommendations}
                  </ReactMarkdown>
                </article>

                {/* Report Footer */}
                <div className="mt-12 pt-8 border-t-2 border-purple-100 no-print">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      📄 Print / Save as PDF
                    </button>
                    <button
                      onClick={() => {
                        setRecommendations(null);
                        setReportId(null);
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                      Generate New Report
                    </button>
                    <Link
                      href="/my-reports"
                      className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-all"
                    >
                      View All Reports
                    </Link>
                    <Link
                      href="/results"
                      className="px-6 py-3 bg-amber-100 text-amber-700 rounded-lg font-semibold hover:bg-amber-200 transition-all"
                    >
                      Assessment Results
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && recommendations && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all flex items-center justify-center text-2xl no-print z-50"
          title="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Footer Navigation */}
      {!isLoading && !recommendations && (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <Link href="/assessment" className="text-purple-600 hover:text-purple-800 font-semibold">
            ← Back to Assessment Hub
          </Link>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .prose {
            max-width: 100% !important;
          }
          h2 {
            break-after: avoid;
          }
          h3 {
            break-after: avoid;
          }
          p {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  );
}
