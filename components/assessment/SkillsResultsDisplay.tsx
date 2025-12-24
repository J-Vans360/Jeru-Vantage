type DomainScore = {
  code: string;
  name: string;
  category: string;
  description: string;
  color: string;
  icon: string;
  score: number;
  band: string;
  itemCount: number;
};

type CategoryAverage = {
  code: string;
  name: string;
  description: string;
  color: string;
  averageScore: number;
  skills: DomainScore[];
};

type SkillsResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    domains: DomainScore[];
    categorizedResults: Record<string, DomainScore[]>;
    categoryAverages: CategoryAverage[];
    timestamp: string;
  };
  domains: Array<{
    code: string;
    name: string;
    category: string;
    description: string;
    color: string;
    icon: string;
  }>;
  categories: Array<{
    code: string;
    name: string;
    description: string;
    color: string;
  }>;
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function SkillsResultsDisplay({
  section,
  scores,
  domains,
  categories,
  onContinue,
  continueButtonText = 'Continue to Part B: S4 →',
  isSaving,
}: SkillsResultsDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your 21st Century Skills Profile
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Skills for Success in the Modern World
          </h2>
          <p className="text-gray-700 mb-4">
            The 21st century workplace demands a unique blend of skills beyond traditional academics.
            These 12 skills are consistently identified by employers, educators, and researchers as
            critical for career success and personal fulfillment.
          </p>
          <p className="text-gray-700">
            Your results are grouped into three categories: Learning Skills (how you think),
            Literacy Skills (how you process information), and Life Skills (how you navigate the world).
          </p>
        </div>

        {/* Category Sections */}
        {scores.categoryAverages.map((category) => (
          <div key={category.code} className="mb-8">
            {/* Category Header */}
            <div
              className="rounded-t-2xl p-6 text-white"
              style={{ backgroundColor: category.color }}
            >
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-lg opacity-95">{category.description}</p>
              <div className="mt-3 bg-white/20 rounded-lg px-4 py-2 inline-block">
                <span className="text-sm font-semibold">
                  Category Average: {category.averageScore}/25
                </span>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="bg-white rounded-b-2xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.code}
                    className="border-2 rounded-xl p-4"
                    style={{ borderColor: skill.color }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{skill.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {skill.name}
                          </h3>
                          <p className="text-xs text-gray-600">{skill.description}</p>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-2xl font-bold" style={{ color: skill.color }}>
                          {skill.score}
                        </div>
                        <div className="text-xs text-gray-500">/ 25</div>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(skill.score / 25) * 100}%`,
                            backgroundColor: skill.color,
                          }}
                        />
                      </div>
                    </div>

                    {/* Band Label */}
                    <div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: skill.color }}
                      >
                        {skill.band}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Interpretation Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Understanding Your Scores
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">Strong (20-25)</div>
              <p className="text-sm text-gray-600">
                You consistently demonstrate this skill
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="font-bold text-yellow-700 mb-2">Developing (13-19)</div>
              <p className="text-sm text-gray-600">
                You're building competence in this area
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-bold text-red-700 mb-2">Needs Focus (5-12)</div>
              <p className="text-sm text-gray-600">
                This is a growth area for you
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            These skills are learnable and improvable. Areas marked "Needs Focus" aren't weaknesses—
            they're opportunities for growth and development.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">💡 Next Steps</h4>
            <p className="text-sm text-gray-700">
              Consider choosing 1-2 skills in the "Needs Focus" or "Developing" range to work on.
              Small, consistent practice is more effective than trying to improve everything at once.
              Look for courses, clubs, or projects that naturally develop these skills.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
