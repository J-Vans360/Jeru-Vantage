'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, ChevronRight, MapPin, DollarSign, GraduationCap, Sparkles } from 'lucide-react';
import ConsentFlowModal from './ConsentFlowModal';

interface MatchReason {
  category: string;
  icon: string;
  title: string;
  description: string;
}

interface UniversityMatch {
  id: string;
  universityId: string;
  universityName: string;
  universityLogo?: string;
  universityCountry: string;
  programId?: string;
  programName?: string;
  programFaculty?: string;
  tuitionAnnual: number;
  matchScore: number;
  matchReasons: MatchReason[];
  isHeroMatch: boolean;
  isRunnerUp: boolean;
}

interface StudentData {
  name: string;
  email: string;
  country: string;
  degreeLevel: string;
  hollandCode?: string;
  topValues?: string[];
  budgetRange?: string;
  topIntelligences?: string[];
  skillsProficiency?: string;
  executionGrit?: string;
}

interface UniversityMatchesProps {
  studentId: string;
  matches: UniversityMatch[];
  studentData?: StudentData;
}

export default function UniversityMatches({ studentId, matches, studentData }: UniversityMatchesProps) {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<UniversityMatch | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  // Default student data if not provided
  const defaultStudentData: StudentData = studentData || {
    name: 'Student',
    email: 'student@email.com',
    country: 'Not specified',
    degreeLevel: "Bachelor's",
    hollandCode: 'IRC',
    topValues: ['Achievement', 'Independence', 'Recognition'],
    budgetRange: '$30,000 - $50,000/year',
    topIntelligences: ['Logical-Mathematical', 'Linguistic', 'Intrapersonal'],
    skillsProficiency: 'Proficient',
    executionGrit: '78%',
  };

  if (!matches || matches.length === 0) {
    return null; // Don't show section if no matches
  }

  const heroMatch = matches.find(m => m.isHeroMatch);
  const runnerUps = matches.filter(m => m.isRunnerUp);

  const handleConnectClick = (match: UniversityMatch) => {
    setSelectedMatch(match);
    setShowConsentModal(true);
  };

  const handleConsent = async (consentLevel: string, selectedItems: string[]) => {
    if (!selectedMatch) return;

    try {
      const response = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          universityId: selectedMatch.universityId,
          programId: selectedMatch.programId,
          matchScore: selectedMatch.matchScore,
          consentLevel,
          approvedItems: selectedItems,
        }),
      });

      if (response.ok) {
        setConnected((prev) => new Set([...prev, selectedMatch.universityId]));
        setShowConsentModal(false);
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error; // Re-throw so the modal can handle the error
    }
  };

  return (
    <>
      <div className="mt-12 border-t-2 border-dashed border-gray-200 pt-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-4">
            <Gem className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-700">Personalized Opportunities</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Universities That Match Your Profile
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your assessment results, our AI found these institutions that align with your interests, budget, and goals.
          </p>
        </div>

        {/* Hero Match - "Hidden Gem" */}
        {heroMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Gem className="w-4 h-4" />
                Hidden Gem Match
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* University Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      {heroMatch.universityLogo ? (
                        <img
                          src={heroMatch.universityLogo}
                          alt={heroMatch.universityName}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {heroMatch.universityName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {heroMatch.universityName}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          {heroMatch.universityCountry}
                        </div>
                        {heroMatch.programName && (
                          <div className="flex items-center gap-1 text-blue-600 text-sm mt-1">
                            <GraduationCap className="w-4 h-4" />
                            {heroMatch.programName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">Why this is a great match:</div>
                      {heroMatch.matchReasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-lg">{reason.icon}</span>
                          <div>
                            <span className="font-medium text-gray-800">{reason.title}:</span>{' '}
                            <span className="text-gray-600">{reason.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match Score & CTA */}
                  <div className="md:w-64 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                    <div className="text-sm text-green-600 font-medium mb-1">Match Strength</div>
                    <div className="text-5xl font-bold text-green-600 mb-1">
                      {heroMatch.matchScore}%
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm mb-4">
                      <Sparkles className="w-4 h-4" />
                      Excellent Fit
                    </div>

                    {heroMatch.tuitionAnnual && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                        <DollarSign className="w-4 h-4" />
                        ${heroMatch.tuitionAnnual.toLocaleString()}/year
                      </div>
                    )}

                    {connected.has(heroMatch.universityId) ? (
                      <div className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-xl font-semibold">
                        ✓ Request Sent!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConnectClick(heroMatch)}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        Connect with Admissions
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Runner-Up Matches */}
        {runnerUps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runnerUps.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {match.universityLogo ? (
                    <img
                      src={match.universityLogo}
                      alt={match.universityName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                      {match.universityName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 truncate">{match.universityName}</h4>
                        <p className="text-sm text-gray-500">{match.universityCountry}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-blue-600">{match.matchScore}%</div>
                        <div className="text-xs text-gray-500">match</div>
                      </div>
                    </div>

                    {match.programName && (
                      <p className="text-sm text-blue-600 mt-1 truncate">{match.programName}</p>
                    )}

                    {match.matchReasons[0] && (
                      <p className="text-sm text-gray-600 mt-2">
                        {match.matchReasons[0].icon} {match.matchReasons[0].description}
                      </p>
                    )}

                    <div className="mt-3">
                      {connected.has(match.universityId) ? (
                        <span className="text-green-600 text-sm font-medium">✓ Request Sent</span>
                      ) : (
                        <button
                          onClick={() => handleConnectClick(match)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          Connect <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          These recommendations are based on your assessment results and university criteria.
          Sponsored placements are clearly marked.
        </p>
      </div>

      {/* Consent Flow Modal */}
      <AnimatePresence>
        {showConsentModal && selectedMatch && (
          <ConsentFlowModal
            university={selectedMatch}
            studentData={defaultStudentData}
            onClose={() => setShowConsentModal(false)}
            onConsent={handleConsent}
          />
        )}
      </AnimatePresence>
    </>
  );
}
