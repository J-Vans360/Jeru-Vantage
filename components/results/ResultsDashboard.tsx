"use client"

import Link from 'next/link';
import UniversityMatchesWrapper from './UniversityMatchesWrapper';

interface ResultsDashboardProps {
  assessmentResults: any[];
  userId?: string;
}

export default function ResultsDashboard({ assessmentResults, userId }: ResultsDashboardProps) {
  // Group results by part and domain
  const partAResults = assessmentResults.filter((r) => r.partName === 'Part A');
  const partBResults = assessmentResults.filter((r) => r.partName === 'Part B');
  const partCResults = assessmentResults.filter((r) => r.partName === 'Part C');

  // Check if all parts are complete (10 sections total)
  const allPartsComplete = assessmentResults.length >= 10;

  // Helper function to find result by domain name (with flexible matching for legacy data)
  const findResult = (results: any[], domainNames: string[]) => {
    return results.find((r) =>
      domainNames.some(name =>
        r.domainName?.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(r.domainName?.toLowerCase() || '')
      )
    );
  };

  // Extract specific results for Ikigai analysis
  // Use flexible matching to handle any legacy domain name variations
  const personalityResult = findResult(partAResults, ['Personality Architecture', 'Personality', 'Big Five', 'Big 5']);
  const valuesResult = findResult(partAResults, ['Values & Interests', 'Core Values', 'Values']);
  const hollandResult = findResult(partAResults, ['Career Interests (Holland Code)', 'Career Interests', 'Holland Code', 'Holland']);
  const intelligencesResult = findResult(partAResults, ['Multiple Intelligences', 'Intelligences']);
  const cognitiveResult = findResult(partBResults, ['Cognitive Style', 'Cognitive']);
  const stressResult = findResult(partBResults, ['Stress Response', 'Stress']);
  const skillsResult = findResult(partBResults, ['21st Century Skills', '21st Century', 'Skills']);
  const socialResult = findResult(partBResults, ['Social Check', 'Social']);
  const environmentResult = findResult(partCResults, ['Environment & Preferences', 'Environment']);
  const executionResult = findResult(partCResults, ['Execution & Grit', 'Execution', 'Grit']);

  // Ensure topValues exists for backward compatibility
  if (valuesResult?.scores && !valuesResult.scores.topValues && valuesResult.scores.domains) {
    // Create topValues from domains if it doesn't exist (for old assessment data)
    valuesResult.scores.topValues = [...valuesResult.scores.domains].sort((a: any, b: any) => b.score - a.score);
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                🎯 Your Complete Profile
              </h1>
              <p className="text-gray-600">Comprehensive assessment results</p>
            </div>
            {allPartsComplete && (
              <div className="text-5xl">🎉</div>
            )}
          </div>
        </div>

        {/* Results Content */}
        <div className="bg-white p-8 space-y-8 shadow-lg">

          {/* Part A Results */}
          {partAResults.length > 0 && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                <span>📌</span> Part A: The Internal You
              </h2>
              <div className="space-y-6">
                {/* Personality */}
                {personalityResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>👤</span> Personality (Big Five)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {personalityResult.scores.domains?.map((trait: any) => (
                        <div key={trait.code} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold" style={{ color: trait.color }}>{trait.score}</div>
                          <div className="text-xs text-gray-600 mt-1 font-semibold">{trait.name}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${(trait.score / 50) * 100}%`,
                                backgroundColor: trait.color
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{trait.band}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Values */}
                {valuesResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>❤️</span> Core Values
                    </h3>
                    <div className="mb-3">
                      <div className="text-lg font-semibold text-gray-700 mb-3">Top 3 Values:</div>
                      <div className="grid grid-cols-3 gap-3">
                        {valuesResult.scores.topValues?.slice(0, 3).map((value: any, idx: number) => (
                          <div
                            key={value.name}
                            className={`py-3 px-4 rounded-xl font-semibold text-center text-white ${
                              idx === 0 ? 'bg-pink-600' :
                              idx === 1 ? 'bg-pink-500' :
                              'bg-pink-400'
                            }`}
                          >
                            #{idx + 1} {value.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Also valued: {valuesResult.scores.topValues?.slice(3, 6).map((v: any) => v.name).join(', ')}
                    </div>
                  </div>
                )}

                {/* Holland Code */}
                {hollandResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🎯</span> Holland Code (Career Interests)
                    </h3>
                    <div className="mb-4 p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white text-center">
                      <div className="text-sm font-semibold mb-1">Your Code:</div>
                      <div className="text-4xl font-black mb-2">
                        {hollandResult.scores.hollandCode || hollandResult.scores.topThree?.map((d: any) => d.code).join('')}
                      </div>
                      <p className="text-sm opacity-90">
                        {hollandResult.scores.description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {hollandResult.scores.domains?.map((domain: any) => (
                        <div key={domain.code} className="flex items-center gap-4">
                          <div className="w-44 shrink-0">
                            <span className="font-bold text-lg" style={{ color: domain.color }}>{domain.code}</span>
                            <span className="text-gray-600 text-sm ml-2">{domain.name}</span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-7 overflow-hidden">
                            <div
                              className="h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                              style={{
                                width: `${(domain.score / 50) * 100}%`,
                                backgroundColor: domain.color,
                                minWidth: '50px'
                              }}
                            >
                              {domain.score}/50
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multiple Intelligences */}
                {intelligencesResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🧠</span> Multiple Intelligences
                    </h3>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        Top 3: {intelligencesResult.scores.topThree?.map((i: any) => i.name).join(', ')}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {intelligencesResult.scores.domains?.map((domain: any) => (
                        <div key={domain.code} className="flex items-center gap-2">
                          <span className="text-2xl">{domain.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-700">{domain.name}</div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                              <div
                                className="h-3 rounded-full"
                                style={{
                                  width: `${(domain.score / 50) * 100}%`,
                                  backgroundColor: domain.color,
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-sm font-bold text-gray-600">{domain.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Part B Results */}
          {partBResults.length > 0 && (
            <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
              <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <span>🧠</span> Part B: Your Operating System
              </h2>
              <div className="space-y-6">
                {/* Cognitive Style */}
                {cognitiveResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>💭</span> Cognitive Style
                    </h3>
                    <div className="space-y-4">
                      {cognitiveResult.scores.domains?.map((domain: any) => (
                        <div key={domain.code}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-gray-700">
                              {domain.opposite?.name || 'Left'} ↔ {domain.name}
                            </div>
                            <div className="text-sm font-bold" style={{ color: domain.color }}>
                              {domain.score}/50
                            </div>
                          </div>
                          <div className="relative h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow"
                              style={{
                                left: `${domain.percentage || (domain.score / 50) * 100}%`,
                                backgroundColor: domain.color
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{domain.opposite?.name || 'Opposite'}</span>
                            <span>{domain.label}</span>
                            <span>{domain.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stress Response */}
                {stressResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>⚡</span> Stress Response Pattern
                    </h3>
                    <div className="mb-4 p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white text-center">
                      <div className="text-2xl font-bold mb-1">
                        Primary: {stressResult.scores.primaryResponse?.name || 'N/A'}
                      </div>
                      <div className="text-sm opacity-90">
                        {stressResult.scores.primaryResponse?.description || ''}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(stressResult.scores.sortedResponses || stressResult.scores.domains)?.map((response: any, idx: number) => (
                        <div key={response.code} className="text-center p-3 bg-gray-50 rounded-lg border-2" style={{ borderColor: idx === 0 ? response.color : 'transparent' }}>
                          <div className="text-2xl mb-1">{response.icon}</div>
                          <div className="text-xl font-bold" style={{ color: response.color }}>
                            {response.score}/50
                          </div>
                          <div className="text-xs font-semibold text-gray-700">{response.name}</div>
                          {idx === 0 && (
                            <div className="mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                              PRIMARY
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 21st Century Skills */}
                {skillsResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🚀</span> 21st Century Skills
                    </h3>
                    <div className="space-y-4">
                      {skillsResult.scores.categoryAverages?.map((category: any) => (
                        <div key={category.code}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-sm" style={{ color: category.color }}>
                              {category.name}
                            </h4>
                            <div className="text-sm font-bold text-gray-600">
                              Avg: {category.averageScore}/25
                            </div>
                          </div>
                          <div className={`grid gap-2 ${
                            category.skills?.length === 3 ? 'grid-cols-3' :
                            category.skills?.length === 5 ? 'grid-cols-5' :
                            'grid-cols-2 md:grid-cols-4'
                          }`}>
                            {category.skills?.map((skill: any) => (
                              <div
                                key={skill.code}
                                className="text-center p-2 bg-gray-50 rounded border"
                                style={{ borderColor: skill.color }}
                              >
                                <div className="text-xl mb-1">{skill.icon}</div>
                                <div className="text-xs font-semibold text-gray-700 mb-1">{skill.name}</div>
                                <div className="text-lg font-bold" style={{ color: skill.color }}>
                                  {skill.score}/25
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div
                                    className="h-1.5 rounded-full"
                                    style={{
                                      width: `${(skill.score / 25) * 100}%`,
                                      backgroundColor: skill.color,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Check */}
                {socialResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>✨</span> Authenticity Check
                    </h3>
                    <div className="text-center">
                      <div className="text-6xl mb-3">
                        {(socialResult.scores.totalScore || 0) <= 50 ? '✅' :
                         (socialResult.scores.totalScore || 0) <= 70 ? '⚠️' : '🚨'}
                      </div>
                      <div className="text-3xl font-bold text-rose-600 mb-2">
                        {socialResult.scores.totalScore || 0}/100
                      </div>
                      <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{
                        backgroundColor: (socialResult.scores.totalScore || 0) <= 50 ? '#dcfce7' :
                                        (socialResult.scores.totalScore || 0) <= 70 ? '#fef9c3' : '#fee2e2',
                        color: (socialResult.scores.totalScore || 0) <= 50 ? '#166534' :
                               (socialResult.scores.totalScore || 0) <= 70 ? '#854d0e' : '#991b1b'
                      }}>
                        {socialResult.scores.interpretation?.label || 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {socialResult.scores.interpretation?.description || ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Part C Results */}
          {partCResults.length > 0 && (
            <div className="border-2 border-emerald-200 rounded-xl p-6 bg-emerald-50">
              <h2 className="text-2xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                <span>🌍</span> Part C: The Reality Check
              </h2>
              <div className="space-y-6">
                {/* Environment */}
                {environmentResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🌍</span> Environment & Preferences
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {environmentResult.scores.domains?.map((domain: any) => (
                        <div key={domain.code} className="text-center">
                          <div className="text-3xl mb-2">{domain.icon}</div>
                          <div className="text-2xl font-bold" style={{ color: domain.color }}>
                            {domain.score}/65
                          </div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">{domain.name}</div>
                          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            {domain.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execution */}
                {executionResult?.scores && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🚀</span> Execution & Grit
                    </h3>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white text-center mb-6">
                      <div className="text-6xl font-black mb-2">{executionResult.scores.executionScore}%</div>
                      <div className="text-lg">Overall Academic Readiness</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {executionResult.scores.domains?.map((domain: any, idx: number, arr: any[]) => {
                        const isLastOdd = idx === arr.length - 1 && arr.length % 2 === 1;
                        return (
                          <div key={domain.code} className={`bg-gray-50 rounded-lg p-4 ${isLastOdd ? 'md:col-span-2' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{domain.icon}</span>
                              <div className="flex-1">
                                <div className="text-sm font-bold text-gray-800">{domain.name}</div>
                                <div className="text-xs text-gray-600">{domain.score}/50 - {domain.band}</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full ${
                                  domain.band === 'Strong' ? 'bg-green-500' :
                                  domain.band === 'Developing' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(domain.score / 50) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ikigai Analysis */}
          {allPartsComplete && hollandResult && intelligencesResult && valuesResult && environmentResult && (
            <div className="border-2 border-yellow-200 rounded-xl p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
              <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
                🌸 Your Ikigai Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* What You Love */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-200">
                  <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                    <span>❤️</span> What You Love
                  </h3>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Top Values:</div>
                    {valuesResult.scores.topValues?.slice(0, 3).map((value: any) => (
                      <div key={value.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        <span className="text-gray-700">{value.name}</span>
                      </div>
                    ))}
                    <div className="font-semibold text-gray-800 mt-4">Career Interests:</div>
                    <div className="text-2xl font-bold text-pink-600">{hollandResult.scores.hollandCode}</div>
                    <div className="text-sm text-gray-600">{hollandResult.scores.description}</div>
                  </div>
                </div>

                {/* What You're Good At */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                    <span>⭐</span> What You're Good At
                  </h3>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Top Intelligences:</div>
                    {intelligencesResult.scores.topThree?.map((intel: any) => (
                      <div key={intel.name} className="flex items-center gap-2">
                        <span className="text-xl">{intel.icon}</span>
                        <span className="text-gray-700 font-semibold">{intel.name}</span>
                        <span className="text-sm text-gray-500">({intel.score}/50)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What the World Needs */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                    <span>🌍</span> What the World Needs
                  </h3>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Holland Code Careers:</div>
                    {hollandResult.scores.domains?.slice(0, 3).map((domain: any) => (
                      <div key={domain.code} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-700">{domain.code} - {domain.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What You Can Be Paid For */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                    <span>💰</span> What You Can Be Paid For
                  </h3>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Execution Readiness:</div>
                    <div className="text-3xl font-bold text-blue-600">{executionResult?.scores?.executionScore || 0}%</div>
                    <div className="text-sm text-gray-600">Academic readiness across 5 key domains</div>
                    {environmentResult.scores.domains?.find((d: any) => d.code === 'FIN') && (
                      <>
                        <div className="font-semibold text-gray-800 mt-4">Financial Priorities:</div>
                        <div className="text-gray-700">
                          {environmentResult.scores.domains.find((d: any) => d.code === 'FIN').label}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ikigai Summary */}
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Your Unique Path Forward</h3>
                <p className="text-lg mb-4">
                  Based on your complete profile, you show strong alignment in{' '}
                  <span className="font-bold">{hollandResult.scores.hollandCode}</span> careers,
                  with natural strengths in{' '}
                  <span className="font-bold">{intelligencesResult.scores.topThree?.[0]?.name}</span>.
                </p>
                <p className="text-sm opacity-90">
                  Your values of <span className="font-semibold">{valuesResult.scores.topValues?.[0]?.name}</span> and{' '}
                  <span className="font-semibold">{valuesResult.scores.topValues?.[1]?.name}</span> will guide
                  you toward meaningful work that makes an impact.
                </p>
              </div>
            </div>
          )}

          {/* Completion Badge */}
          {allPartsComplete && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-3">Assessment Complete!</h2>
              <p className="text-lg mb-4">
                You've completed all {assessmentResults.length} sections of the Jeru Vantage Self-Discovery Assessment
              </p>
            </div>
          )}

          {/* University Matches Section - "Hidden Gem" */}
          {allPartsComplete && userId && (
            <UniversityMatchesWrapper studentId={userId} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl p-6 border-t shadow-lg">
          <div className="flex justify-between items-center">
            <Link
              href="/assessment"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              ← Back to Assessment Hub
            </Link>
            <div className="flex gap-3">
              {allPartsComplete && (
                <Link
                  href="/ai-jeru"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🧙‍♂️</span> Get AI Guidance
                </Link>
              )}
              {allPartsComplete && (
                <button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  onClick={handlePrint}
                >
                  📄 Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
