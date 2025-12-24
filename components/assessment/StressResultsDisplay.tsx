type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  score: number;
  band: string;
  itemCount: number;
};

type StressResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    domains: DomainScore[];
    primaryResponse: DomainScore;
    sortedResponses: DomainScore[];
    timestamp: string;
  };
  domains: Array<{
    code: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  }>;
  stressInfo: {
    description: string;
    management: Record<string, string>;
  };
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function StressResultsDisplay({
  section,
  scores,
  domains: _domains,
  stressInfo,
  onContinue,
  continueButtonText = 'Continue to Part B: S3 →',
  isSaving,
}: StressResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Stress Response Profile
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Primary Response Banner */}
        <div
          className="rounded-2xl shadow-xl p-8 mb-8 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${scores.primaryResponse.color} 0%, ${scores.primaryResponse.color}dd 100%)`
          }}
        >
          <div className="text-6xl mb-4">{scores.primaryResponse.icon}</div>
          <h2 className="text-3xl font-bold mb-2">
            Your Primary Stress Response: {scores.primaryResponse.name}
          </h2>
          <p className="text-xl mb-4 opacity-95">
            {scores.primaryResponse.description}
          </p>
          <div className="bg-white/20 rounded-lg px-6 py-3 inline-block">
            <div className="text-4xl font-black">{scores.primaryResponse.score}/50</div>
            <div className="text-sm opacity-90">{scores.primaryResponse.band}</div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding the Four Fs
          </h2>
          <p className="text-gray-700 mb-4">
            {stressInfo.description}
          </p>
          <p className="text-gray-700">
            These are automatic nervous system responses—not character flaws. Recognizing your
            patterns is the first step to managing stress more effectively.
          </p>
        </div>

        {/* All Four Responses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {scores.sortedResponses.map((domain, index) => (
            <div
              key={domain.code}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4"
              style={{ borderLeftColor: domain.color }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{domain.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {domain.name}
                      </h3>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
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
              <div className="mb-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: domain.color }}
                >
                  {domain.band}
                </span>
              </div>

              {/* Management Strategy */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs font-bold text-gray-700 mb-1">
                  MANAGEMENT STRATEGY:
                </div>
                <p className="text-sm text-gray-700">
                  {stressInfo.management[domain.code]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Understanding Your Scores
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-bold text-red-700 mb-2">Primary Response (38-50)</div>
              <p className="text-sm text-gray-600">
                Your automatic go-to pattern under stress
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="font-bold text-yellow-700 mb-2">Secondary Response (25-37)</div>
              <p className="text-sm text-gray-600">
                You sometimes use this when stressed
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">Rarely Used (10-24)</div>
              <p className="text-sm text-gray-600">
                Not a typical response pattern for you
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Remember: All four responses are normal and adaptive in the right context. The goal isn't
            to eliminate them, but to increase your awareness and develop healthier coping strategies.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
