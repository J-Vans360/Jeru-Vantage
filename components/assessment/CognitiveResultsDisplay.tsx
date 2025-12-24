type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  opposite: {
    code: string;
    name: string;
    description: string;
  };
  score: number;
  spectrumPosition: string;
  label: string;
  percentage: number;
  itemCount: number;
};

type CognitiveResultsDisplayProps = {
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
    opposite: {
      code: string;
      name: string;
      description: string;
    };
  }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function CognitiveResultsDisplay({
  section,
  scores,
  domains: _domains,
  onContinue,
  continueButtonText = 'Continue to Part B: S2 →',
  isSaving,
}: CognitiveResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Cognitive Style Profile
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Your Mental Processing
          </h2>
          <p className="text-gray-700 mb-4">
            Your cognitive style describes how you naturally process information and solve problems.
            These are preferences, not abilities—there's no "better" or "worse" style.
          </p>
          <p className="text-gray-700">
            Below, you'll see where you fall on five key cognitive spectrums. Most people are
            balanced on some dimensions and have strong preferences on others.
          </p>
        </div>

        {/* Spectrum Results */}
        <div className="space-y-6 mb-8">
          {scores.domains.map((domain) => (
            <div
              key={domain.code}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              {/* Spectrum Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <h3 className="text-lg font-bold text-gray-900">
                      {domain.name} ↔ {domain.opposite.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {domain.description} vs. {domain.opposite.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold" style={{ color: domain.color }}>
                    {domain.score}
                  </div>
                  <div className="text-xs text-gray-500">out of 50</div>
                </div>
              </div>

              {/* Spectrum Bar */}
              <div className="relative mb-4">
                {/* Background track */}
                <div className="relative h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full">
                  {/* Left label (Opposite style) */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                    <div className="text-xs font-medium text-gray-600 text-right pr-3 w-24">
                      {domain.opposite.name}
                    </div>
                  </div>

                  {/* Right label (Primary style) */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                    <div className="text-xs font-medium text-gray-600 text-left pl-3 w-24">
                      {domain.name}
                    </div>
                  </div>

                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300" />

                  {/* Position indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${domain.percentage}%` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: domain.color }}
                    />
                  </div>
                </div>

                {/* Scale markers */}
                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                  <span>40</span>
                  <span>50</span>
                </div>
              </div>

              {/* Interpretation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: domain.color }}
                  >
                    {domain.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {domain.itemCount} questions
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {domain.spectrumPosition === 'first' && (
                    <>
                      You have a <strong>strong preference for {domain.name}</strong> thinking.
                      You naturally tend toward {domain.description.toLowerCase()}.
                    </>
                  )}
                  {domain.spectrumPosition === 'opposite' && (
                    <>
                      You have a <strong>strong preference for {domain.opposite.name}</strong> thinking.
                      You naturally tend toward {domain.opposite.description.toLowerCase()}.
                    </>
                  )}
                  {domain.spectrumPosition === 'balanced' && (
                    <>
                      You are <strong>balanced and flexible</strong> on this dimension.
                      You can adapt between {domain.name.toLowerCase()} and {domain.opposite.name.toLowerCase()} approaches as needed.
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            What This Means
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-bold text-purple-700 mb-2">Strong Preference (35-50)</div>
              <p className="text-sm text-gray-600">
                You consistently use this cognitive style
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-bold text-blue-700 mb-2">Balanced (25-34)</div>
              <p className="text-sm text-gray-600">
                You can flexibly use both styles
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="font-bold text-indigo-700 mb-2">Opposite Preference (10-24)</div>
              <p className="text-sm text-gray-600">
                You prefer the alternative cognitive style
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Your cognitive style influences how you learn best, solve problems, and make decisions.
            Understanding it can help you choose study strategies and work environments that suit you.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
