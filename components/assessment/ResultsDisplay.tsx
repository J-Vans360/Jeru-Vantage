type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  score: number;
  band: string;
  itemCount: number;
};

type ResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    domains: DomainScore[];
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

export default function ResultsDisplay({
  section,
  scores,
  domains: _domains,
  onContinue,
  continueButtonText = 'Continue to Assessment Hub →',
  isSaving,
}: ResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
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
            Understanding Your Scores
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">High (38-50)</div>
              <p className="text-sm text-gray-600">
                Strong expression of this trait
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-bold text-blue-700 mb-2">Mid-range (25-37)</div>
              <p className="text-sm text-gray-600">
                Flexible and adaptable in this area
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-bold text-purple-700 mb-2">Low (10-24)</div>
              <p className="text-sm text-gray-600">
                Lower expression of this trait
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Remember: There are no "good" or "bad" scores. Each personality profile
            has unique strengths and opportunities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
