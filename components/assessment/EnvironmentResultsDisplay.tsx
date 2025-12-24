type DomainScore = {
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  score: number;
  label: string;
  itemCount: number;
};

type EnvironmentResultsDisplayProps = {
  section: { title: string; subtitle: string; icon: string };
  scores: { domains: DomainScore[]; timestamp: string };
  domains: Array<{ code: string; name: string; description: string; color: string; icon: string }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function EnvironmentResultsDisplay({ section, scores, domains: _domains, onContinue, continueButtonText = 'Continue →', isSaving }: EnvironmentResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Environment Preferences</h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {scores.domains.map((domain) => (
            <div key={domain.code} className="bg-white rounded-2xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: domain.color }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3"><span className="text-4xl">{domain.icon}</span>
                  <div><h3 className="text-xl font-bold text-gray-900">{domain.name}</h3><p className="text-sm text-gray-600">{domain.description}</p></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold" style={{ color: domain.color }}>{domain.score}/65</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${(domain.score / 65) * 100}%`, backgroundColor: domain.color }} />
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: domain.color }}>{domain.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What This Means</h3>
          <p className="text-gray-700 mb-4">Your environment preferences help identify universities that match your ideal learning setting, social atmosphere, and financial priorities.</p>
        </div>
        <div className="flex justify-center">
          <button onClick={onContinue} disabled={isSaving} className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isSaving ? 'Saving...' : continueButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
