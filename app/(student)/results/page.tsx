import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ResultsDashboard from '@/components/results/ResultsDashboard';
import { getCurrentUserId } from '@/lib/auth-utils';

export default async function ResultsPage() {
  const userId = await getCurrentUserId();
  let assessmentResults: any[] = [];
  let error: string | null = null;

  try {
    assessmentResults = await prisma.assessmentResult.findMany({
      where: {
        userId,
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

  return <ResultsDashboard assessmentResults={assessmentResults} userId={userId} />;
}
