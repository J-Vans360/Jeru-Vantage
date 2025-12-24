type SocialCheckResultsDisplayProps = {
  section: {
    title: string;
    subtitle: string;
    icon: string;
  };
  scores: {
    totalScore: number;
    interpretation: {
      label: string;
      description: string;
      range: string;
    };
    timestamp: string;
  };
  onContinue: () => void;
  continueButtonText?: string;
  isSaving: boolean;
};

export default function SocialCheckResultsDisplay({
  section,
  scores,
  onContinue,
  continueButtonText = 'Return to Assessment Hub →',
  isSaving,
}: SocialCheckResultsDisplayProps) {
  // Determine color based on interpretation
  const getColor = () => {
    if (scores.interpretation.label === 'Authentic Responder') {
      return { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', border: 'border-green-200', bgLight: 'bg-green-50' };
    } else if (scores.interpretation.label === 'Moderate Image Management') {
      return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-700', border: 'border-yellow-200', bgLight: 'bg-yellow-50' };
    } else {
      return { bg: 'from-red-500 to-rose-500', text: 'text-red-700', border: 'border-red-200', bgLight: 'bg-red-50' };
    }
  };

  const colors = getColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{section.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Authenticity Check Complete
          </h1>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>

        {/* Score Display */}
        <div
          className={`rounded-2xl shadow-xl p-8 mb-8 text-center text-white bg-gradient-to-r ${colors.bg}`}
        >
          <h2 className="text-3xl font-bold mb-2">
            {scores.interpretation.label}
          </h2>
          <p className="text-xl mb-4 opacity-95">
            {scores.interpretation.description}
          </p>
          <div className="bg-white/20 rounded-lg px-6 py-3 inline-block">
            <div className="text-4xl font-black">{scores.totalScore}/100</div>
            <div className="text-sm opacity-90">Social Desirability Score</div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What This Means
          </h2>
          <p className="text-gray-700 mb-4">
            The Social Desirability Scale measures the tendency to present oneself in an overly
            positive or unrealistic way. Everyone wants to look good, but extremely high scores
            may suggest "too good to be true" response patterns.
          </p>

          <div className={`p-4 ${colors.bgLight} rounded-lg border ${colors.border} mb-4`}>
            <div className={`font-bold ${colors.text} mb-2`}>Your Result: {scores.interpretation.label}</div>
            <p className="text-sm text-gray-700">
              {scores.interpretation.label === 'Authentic Responder' && (
                <>
                  Great! Your responses appear genuine and honest. You acknowledged both strengths
                  and normal human imperfections, which suggests your assessment results are likely
                  to be accurate and useful.
                </>
              )}
              {scores.interpretation.label === 'Moderate Image Management' && (
                <>
                  Your responses show some tendency to present yourself positively, which is normal.
                  However, try to answer even more honestly to get the most accurate results.
                  Remember: there are no "right" answers, and admitting common flaws is perfectly normal.
                </>
              )}
              {scores.interpretation.label === 'High Image Management' && (
                <>
                  Your responses suggest a strong tendency to present an idealized self-image.
                  Consider retaking the assessment with more candid responses. Remember: everyone has
                  flaws and struggles—that's what makes us human. Honest responses lead to more
                  helpful and accurate results.
                </>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-bold text-green-700 mb-2">Authentic (20-50)</div>
              <p className="text-sm text-gray-600">
                Honest, realistic responses
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="font-bold text-yellow-700 mb-2">Moderate (51-70)</div>
              <p className="text-sm text-gray-600">
                Some positive self-presentation
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-bold text-red-700 mb-2">High (71-100)</div>
              <p className="text-sm text-gray-600">
                May need more honest responses
              </p>
            </div>
          </div>
        </div>

        {/* Part B Completion Celebration */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-xl p-8 mb-8 text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
          <p className="text-lg mb-4">
            You've completed all of Part B: Your Operating System
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm font-semibold mb-2">You've discovered:</p>
            <ul className="text-sm space-y-1">
              <li>✓ Your Cognitive Style Preferences</li>
              <li>✓ Your Primary Stress Response</li>
              <li>✓ Your 21st Century Skills Profile</li>
              <li>✓ Your Authenticity Score</li>
            </ul>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">📌 Important</h3>
          <p className="text-sm text-gray-700">
            This scale doesn't measure honesty or character—it simply helps ensure your responses
            are realistic. Lower scores are actually better because they indicate more genuine,
            useful results. If you scored in the "High" range, consider whether you were trying
            too hard to present yourself perfectly rather than authentically.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinue}
            disabled={isSaving}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
