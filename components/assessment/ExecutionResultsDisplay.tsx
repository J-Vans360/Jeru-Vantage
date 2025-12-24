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

type ExecutionResultsDisplayProps = {
  section: { title: string; subtitle: string; icon: string };
  scores: { domains: DomainScore[]; executionScore: number; areasNeedingFocus: DomainScore[]; timestamp: string };
  domains: Array<{ code: string; name: string; description: string; color: string; icon: string }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function ExecutionResultsDisplay({ section, scores, domains: _domains, onContinue, continueButtonText = 'Complete Assessment →', isSaving }: ExecutionResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Execution Capacity</h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Overall Execution Score</h2>
          <div className="text-7xl font-black mb-2">{scores.executionScore}%</div>
          <p className="text-lg opacity-90">Academic readiness across 5 key domains</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {scores.domains.map((domain) => (
            <div key={domain.code} className="bg-white rounded-xl shadow-lg p-4 border-l-4" style={{ borderLeftColor: domain.color }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{domain.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{domain.name}</h3>
                  <p className="text-xs text-gray-600">{domain.description}</p>
                </div>
                <div className="text-2xl font-bold" style={{ color: domain.color }}>{domain.score}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full" style={{ width: `${(domain.score / 50) * 100}%`, backgroundColor: domain.color }} />
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: domain.color }}>{domain.band}</span>
            </div>
          ))}
        </div>

        {scores.areasNeedingFocus.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Areas Needing Focus</h3>
            <ul className="space-y-2">
              {scores.areasNeedingFocus.map((area) => (
                <li key={area.code} className="text-sm text-gray-700">
                  <strong>{area.icon} {area.name}:</strong> Consider developing stronger habits in this area before university
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold mb-3">ASSESSMENT COMPLETE!</h2>
          <p className="text-xl mb-4">Congratulations! You've completed the entire Jeru Vantage Self-Discovery Assessment</p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm font-semibold mb-2">You've discovered:</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div><strong>PART A</strong><br/>✓ Personality<br/>✓ Values<br/>✓ Holland Code<br/>✓ Intelligences</div>
              <div><strong>PART B</strong><br/>✓ Cognitive Style<br/>✓ Stress Response<br/>✓ 21st Century Skills<br/>✓ Authenticity</div>
              <div><strong>PART C</strong><br/>✓ Environment<br/>✓ Execution Capacity</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={onContinue} disabled={isSaving} className="px-10 py-5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isSaving ? 'Saving...' : continueButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
