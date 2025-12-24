import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const USER_ID = 'test-user-123';

export default async function ResultsPage() {
  let assessmentResults: any[] = [];
  let error: string | null = null;

  try {
    assessmentResults = await prisma.assessmentResult.findMany({
      where: {
        userId: USER_ID,
        completed: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (err) {
    console.error('Error fetching assessment results:', err);
    error = err instanceof Error ? err.message : 'Database connection error';
  }

  // Handle database error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Database Connection Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-bold text-yellow-900 mb-2">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Check that your Supabase database is running</li>
                <li>Verify your .env file has the correct DATABASE_URL</li>
                <li>Run: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma generate</code></li>
                <li>Run: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma db push</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
            <Link
              href="/assessment"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              ← Back to Assessment Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group results by part
  const partAResults = assessmentResults.filter((r) => r.partName === 'Part A');
  const partBResults = assessmentResults.filter((r) => r.partName === 'Part B');
  const partCResults = assessmentResults.filter((r) => r.partName === 'Part C');

  const allPartsComplete = partAResults.length === 4 && partBResults.length === 4 && partCResults.length === 2;

  if (assessmentResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Results Yet</h1>
            <p className="text-gray-600 mb-6">You haven't completed any assessment sections yet.</p>
            <Link
              href="/assessment"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Start Assessment →
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          {!allPartsComplete && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ Assessment incomplete. Complete all 10 sections for your full profile.
              </p>
            </div>
          )}
        </div>

        {/* Results Content */}
        <div className="bg-white p-8 space-y-8 shadow-lg">
          {/* Part A Results */}
          {partAResults.length > 0 && (
            <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">📌 Part A: The Internal You</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {partAResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">{result.domainName}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Completed: {new Date(result.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-600">
                      {result.scores && typeof result.scores === 'object' && (
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.scores, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part B Results */}
          {partBResults.length > 0 && (
            <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">🧠 Part B: Your Operating System</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {partBResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">{result.domainName}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Completed: {new Date(result.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-600">
                      {result.scores && typeof result.scores === 'object' && (
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.scores, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Part C Results */}
          {partCResults.length > 0 && (
            <div className="border-2 border-emerald-200 rounded-xl p-6 bg-emerald-50">
              <h2 className="text-2xl font-bold text-emerald-600 mb-4">🌍 Part C: The Reality Check</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {partCResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-2">{result.domainName}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Completed: {new Date(result.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-600">
                      {result.scores && typeof result.scores === 'object' && (
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.scores, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allPartsComplete && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold mb-3">Assessment Complete!</h2>
              <p className="text-lg mb-4">
                You've completed all {assessmentResults.length} sections of the Jeru Vantage Self-Discovery Assessment
              </p>
              <div className="bg-white/20 rounded-lg p-4 inline-block">
                <p className="text-sm font-semibold mb-2">Your comprehensive profile includes:</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>PART A</strong>
                    <br />✓ Personality
                    <br />✓ Values
                    <br />✓ Holland Code
                    <br />✓ Intelligences
                  </div>
                  <div>
                    <strong>PART B</strong>
                    <br />✓ Cognitive Style
                    <br />✓ Stress Response
                    <br />✓ 21st Century Skills
                    <br />✓ Authenticity
                  </div>
                  <div>
                    <strong>PART C</strong>
                    <br />✓ Environment
                    <br />✓ Execution Capacity
                  </div>
                </div>
              </div>
            </div>
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
            {allPartsComplete && (
              <button
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                onClick={() => window.print()}
              >
                📄 Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
