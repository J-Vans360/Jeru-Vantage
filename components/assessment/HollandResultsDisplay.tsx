type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  score: number;
  band: string;
  itemCount: number;
};

type HollandResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    domains: DomainScore[];
    hollandCode: string;
    topThree: DomainScore[];
    timestamp: string;
  };
  domains: Array<{
    code: string;
    name: string;
    description: string;
    color: string;
  }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function HollandResultsDisplay({
  section,
  scores,
  domains: _domains,
  onContinue,
  continueButtonText = 'Continue to Assessment Hub →',
  isSaving,
}: HollandResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Holland Code Display */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Your Holland Code</h2>
          <div className="text-7xl font-black mb-4 tracking-wider">
            {scores.hollandCode}
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {scores.topThree.map((domain, index) => (
              <div key={domain.code} className="bg-white/20 rounded-lg px-4 py-2">
                <span className="font-semibold">#{index + 1}: {domain.name}</span>
                <span className="ml-2 text-sm">({domain.score}/50)</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm opacity-90">
            Your top 3 career interest areas define your unique Holland Code
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-6 mb-8">
          {scores.domains.map((domain) => (
            <div
              key={domain.code}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4"
              style={{ borderLeftColor: domain.color }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {domain.name}
                  </h3>
                  <p className="text-gray-600">{domain.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold" style={{ color: domain.color }}>
                    {domain.score}
                  </div>
                  <div className="text-sm text-gray-500">out of 50</div>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${(domain.score / 50) * 100}%`,
                      backgroundColor: domain.color,
                    }}
                  />
                </div>
              </div>

              {/* Band Label */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Interpretation:
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: domain.color }}
                  >
                    {domain.band}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Based on {domain.itemCount} questions
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Understanding Your Holland Code
          </h3>
          <div className="space-y-3 mb-4">
            <p className="text-gray-700">
              Your Holland Code combines your top 3 career interest areas. People with similar codes tend to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Enjoy similar types of work activities</li>
              <li>Thrive in similar work environments</li>
              <li>Find satisfaction in similar career fields</li>
            </ul>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">High (38-50)</div>
              <p className="text-sm text-gray-600">
                Strong interest in this area
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-bold text-blue-700 mb-2">Mid-range (25-37)</div>
              <p className="text-sm text-gray-600">
                Moderate interest in this area
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-bold text-purple-700 mb-2">Low (10-24)</div>
              <p className="text-sm text-gray-600">
                Limited interest in this area
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Remember: All career interests are equally valuable. Your unique combination helps identify fields where you'll be most engaged.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
