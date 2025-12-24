type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  score: number;
  band: string;
  itemCount: number;
};

type IntelligencesResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    domains: DomainScore[];
    topIntelligences: string;
    topThree: DomainScore[];
    timestamp: string;
  };
  domains: Array<{
    code: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function IntelligencesResultsDisplay({
  section,
  scores,
  domains,
  onContinue,
  continueButtonText = 'Complete Part A →',
  isSaving,
}: IntelligencesResultsDisplayProps) {
  // Map domain codes to icons
  const domainIcons: Record<string, string> = {};
  domains.forEach((d) => {
    domainIcons[d.code] = d.icon;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Part A Complete! 🎉
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Top 3 Intelligences Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Your Top 3 Intelligences</h2>
          <div className="flex justify-center gap-4 flex-wrap mb-4">
            {scores.topThree.map((domain, index) => (
              <div key={domain.code} className="bg-white/20 rounded-xl px-6 py-4">
                <div className="text-4xl mb-2">{domainIcons[domain.code]}</div>
                <div className="font-bold text-lg">#{index + 1}: {domain.name}</div>
                <div className="text-sm opacity-90">{domain.score}/50 - {domain.band}</div>
              </div>
            ))}
          </div>
          <p className="text-sm opacity-90">
            These represent your strongest natural ways of learning and processing information
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {scores.domains.map((domain) => (
            <div
              key={domain.code}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4"
              style={{ borderLeftColor: domain.color }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{domainIcons[domain.code]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {domain.name}
                    </h3>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: domain.color }}>
                    {domain.score}
                  </div>
                  <div className="text-xs text-gray-500">out of 50</div>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(domain.score / 50) * 100}%`,
                      backgroundColor: domain.color,
                    }}
                  />
                </div>
              </div>

              {/* Band Label */}
              <div className="flex justify-between items-center">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: domain.color }}
                >
                  {domain.band}
                </span>
                <span className="text-xs text-gray-500">
                  {domain.itemCount} questions
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Understanding Your Multiple Intelligences
          </h3>
          <p className="text-gray-700 mb-4">
            Howard Gardner's theory suggests we all have a unique combination of eight intelligences.
            No one intelligence is "better" than another—they're simply different ways of being smart!
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">Strong (38-50)</div>
              <p className="text-sm text-gray-600">
                You naturally excel in this area
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-bold text-blue-700 mb-2">Moderate (25-37)</div>
              <p className="text-sm text-gray-600">
                You're competent with room to grow
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-bold text-purple-700 mb-2">Developing (10-24)</div>
              <p className="text-sm text-gray-600">
                You can develop this area further
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Your intelligence profile can help you choose study strategies, career paths, and environments
            where you'll naturally thrive.
          </p>
        </div>

        {/* Part A Completion Celebration */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
          <p className="text-lg mb-4">
            You've completed all of Part A: Personality & Values
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm font-semibold">You've discovered:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>✓ Your Big 5 Personality Traits</li>
              <li>✓ Your Core Values & Motivations</li>
              <li>✓ Your Holland Code (Career Interests)</li>
              <li>✓ Your Multiple Intelligences Profile</li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? 'Saving...' : continueButtonText}
          </button>
        </div>

        {/* Save Status */}
        {isSaving && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Saving your results...</p>
          </div>
        )}
      </div>
    </div>
  );
}
