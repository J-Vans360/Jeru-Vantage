'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  TrendingUp,
  MessageCircle,
  Send,
  Download,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

interface CareerMatch {
  title: string;
  match: number;
  description: string;
}

interface University {
  name: string;
  program: string;
  country: string;
}

interface GrowthArea {
  area: string;
  tip: string;
}

interface ReportData {
  careerNarrative: string;
  careerMatches: CareerMatch[];
  universities: University[];
  growthAreas: GrowthArea[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiReportPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [hollandCode, setHollandCode] = useState<string>('');
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(3);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReport();
      fetchChatHistory();
    }
  }, [status]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-report');
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReport(data.report);
        setHollandCode(data.hollandCode || '');
        setDownloadUnlocked(data.downloadUnlocked || false);
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to load your AI report');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/ai-chat/history');
      const data = await response.json();
      if (data.messages) {
        setChatMessages(data.messages);
        setQuestionsUsed(data.questionsUsed || 0);
        setMaxQuestions(data.maxQuestions || 3);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading || questionsUsed >= maxQuestions) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai-chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        setQuestionsUsed(data.questionsUsed);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUnlocked) {
      router.push('/survey/ai-report');
    } else {
      // TODO: Implement PDF download
      alert('PDF download coming soon!');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your AI Career Report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Report Not Ready</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/pilot-assessment"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Complete Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <button
            onClick={handleDownload}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              downloadUnlocked
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {downloadUnlocked ? (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Unlock Download
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your AI Career Report
          </h1>
          {hollandCode && (
            <div className="flex justify-center gap-2 mt-4">
              {hollandCode.split('').map((letter, idx) => (
                <span
                  key={idx}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Narrative */}
            {report?.careerNarrative && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Your Career Story
                </h2>
                <div className="prose prose-gray max-w-none">
                  {report.careerNarrative.split('\n\n').map((para, idx) => (
                    <p key={idx} className="text-gray-700 mb-4">{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Career Matches */}
            {report?.careerMatches && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Top Career Matches
                </h2>
                <div className="space-y-4">
                  {report.careerMatches.map((career, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">{career.title}</h3>
                        <p className="text-sm text-gray-600">{career.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">{career.match}%</span>
                        <p className="text-xs text-gray-500">Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Universities */}
            {report?.universities && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Recommended Universities
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {report.universities.map((uni, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900">{uni.name}</h3>
                      <p className="text-sm text-blue-700">{uni.program}</p>
                      <p className="text-xs text-gray-500 mt-1">{uni.country}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Growth Areas */}
            {report?.growthAreas && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Growth Opportunities
                </h2>
                <div className="space-y-4">
                  {report.growthAreas.map((area, idx) => (
                    <div key={idx} className="p-4 bg-amber-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900">{area.area}</h3>
                      <p className="text-sm text-gray-700 mt-1">{area.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Chat with AI Jeru</h3>
                </div>
                <p className="text-sm text-indigo-100 mt-1">
                  {questionsUsed}/{maxQuestions} questions used
                </p>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Ask me anything about your results!</p>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                {questionsUsed >= maxQuestions ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">Question limit reached</p>
                    <button
                      onClick={() => router.push('/survey/ai-report')}
                      className="text-sm text-indigo-600 hover:underline mt-1"
                    >
                      Complete survey for more features
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!chatInput.trim() || chatLoading}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CTA for Survey 2 */}
            {!downloadUnlocked && (
              <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2">Unlock PDF Download</h3>
                <p className="text-sm text-indigo-100 mb-4">
                  Complete a quick survey to download and share your report.
                </p>
                <button
                  onClick={() => router.push('/survey/ai-report')}
                  className="w-full py-2 bg-white text-indigo-600 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  Complete Survey <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
