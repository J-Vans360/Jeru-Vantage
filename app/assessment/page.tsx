import { getStudentProfile } from '@/actions/profile-actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const USER_ID = 'test-user-123';

async function getAssessmentProgress(userId: string) {
  const results = await prisma.assessmentResult.findMany({
    where: { userId },
    select: {
      partName: true,
      completed: true,
    },
  });

  const partA = results.find((r) => r.partName === 'Part A');
  const partB = results.find((r) => r.partName === 'Part B');
  const partC = results.find((r) => r.partName === 'Part C');

  return {
    partACompleted: partA?.completed || false,
    partBCompleted: partB?.completed || false,
    partCCompleted: partC?.completed || false,
  };
}

export default async function AssessmentPage() {
  const profileResult = await getStudentProfile(USER_ID);
  const progress = await getAssessmentProgress(USER_ID);

  if (!profileResult.success || !profileResult.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Required</h1>
            <p className="text-gray-600 mb-6">Please complete your profile before starting the assessment.</p>
            <Link
              href="/profile"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileResult.profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                Self-Discovery Assessment
              </h1>
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{profile.studentName}</span>! Complete all three parts to unlock your personalized university matches.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Progress</h2>
          <div className="flex items-center gap-4">
            {/* Section 0 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-semibold text-green-600">Section 0</span>
            </div>

            <div className="flex-1 h-1 bg-green-500"></div>

            {/* Part A */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                progress.partACompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {progress.partACompleted ? '✓' : 'A'}
              </div>
              <span className={`ml-2 text-sm font-semibold ${
                progress.partACompleted ? 'text-green-600' : 'text-gray-600'
              }`}>
                Part A
              </span>
            </div>

            <div className={`flex-1 h-1 ${progress.partACompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            {/* Part B */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                progress.partBCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {progress.partBCompleted ? '✓' : 'B'}
              </div>
              <span className={`ml-2 text-sm font-semibold ${
                progress.partBCompleted ? 'text-green-600' : 'text-gray-600'
              }`}>
                Part B
              </span>
            </div>

            <div className={`flex-1 h-1 ${progress.partBCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            {/* Part C */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                progress.partCCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {progress.partCCompleted ? '✓' : 'C'}
              </div>
              <span className={`ml-2 text-sm font-semibold ${
                progress.partCCompleted ? 'text-green-600' : 'text-gray-600'
              }`}>
                Part C
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="bg-white p-8 space-y-6">

          {/* Part A Card */}
          <div className={`border-2 rounded-xl p-6 transition-all ${
            !progress.partACompleted
              ? 'border-purple-300 bg-purple-50'
              : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">
                  Part A: Personality & Values
                </h3>
                <p className="text-gray-700 mb-3">
                  Discover your personality type and core values through the Big Five personality traits and Holland Code career assessment.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 15-20 minutes</span>
                  <span className={`font-semibold ${
                    progress.partACompleted ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    {progress.partACompleted ? '✓ Completed' : '○ Not Started'}
                  </span>
                </div>
              </div>
              {progress.partACompleted && (
                <div className="text-4xl">✅</div>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href="/assessment/part-a"
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  progress.partACompleted
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                }`}
              >
                {progress.partACompleted ? 'Review Part A' : 'Start Part A →'}
              </Link>
            </div>
          </div>

          {/* Part B Card */}
          <div className={`border-2 rounded-xl p-6 transition-all ${
            !progress.partACompleted
              ? 'border-gray-300 bg-gray-100 opacity-60'
              : !progress.partBCompleted
                ? 'border-purple-300 bg-purple-50'
                : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  !progress.partACompleted ? 'text-gray-500' : 'text-purple-600'
                }`}>
                  Part B: Cognitive Style & Skills
                </h3>
                <p className={`mb-3 ${
                  !progress.partACompleted ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  Explore your learning preferences through Multiple Intelligences and assess your 21st Century Skills development.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 15-20 minutes</span>
                  <span className={`font-semibold ${
                    progress.partBCompleted ? 'text-green-600' :
                    !progress.partACompleted ? 'text-gray-500' : 'text-purple-600'
                  }`}>
                    {progress.partBCompleted ? '✓ Completed' : '○ Not Started'}
                  </span>
                </div>
              </div>
              {progress.partBCompleted && (
                <div className="text-4xl">✅</div>
              )}
              {!progress.partACompleted && (
                <div className="text-4xl">🔒</div>
              )}
            </div>
            <div className="flex gap-3">
              {progress.partACompleted ? (
                <Link
                  href="/assessment/part-b"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    progress.partBCompleted
                      ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                  }`}
                >
                  {progress.partBCompleted ? 'Review Part B' : 'Start Part B →'}
                </Link>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                >
                  🔒 Complete Part A First
                </button>
              )}
            </div>
          </div>

          {/* Part C Card */}
          <div className={`border-2 rounded-xl p-6 transition-all ${
            !progress.partBCompleted
              ? 'border-gray-300 bg-gray-100 opacity-60'
              : !progress.partCCompleted
                ? 'border-purple-300 bg-purple-50'
                : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  !progress.partBCompleted ? 'text-gray-500' : 'text-purple-600'
                }`}>
                  Part C: Environment & Preferences
                </h3>
                <p className={`mb-3 ${
                  !progress.partBCompleted ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  Define your ideal university environment, campus culture preferences, and lifestyle priorities.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 15-20 minutes</span>
                  <span className={`font-semibold ${
                    progress.partCCompleted ? 'text-green-600' :
                    !progress.partBCompleted ? 'text-gray-500' : 'text-purple-600'
                  }`}>
                    {progress.partCCompleted ? '✓ Completed' : '○ Not Started'}
                  </span>
                </div>
              </div>
              {progress.partCCompleted && (
                <div className="text-4xl">✅</div>
              )}
              {!progress.partBCompleted && (
                <div className="text-4xl">🔒</div>
              )}
            </div>
            <div className="flex gap-3">
              {progress.partBCompleted ? (
                <Link
                  href="/assessment/part-c"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    progress.partCCompleted
                      ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                  }`}
                >
                  {progress.partCCompleted ? 'Review Part C' : 'Start Part C →'}
                </Link>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                >
                  🔒 Complete Part B First
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl p-6 border-t">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              Complete all three parts to unlock your personalized recommendations
            </p>
            {progress.partACompleted && progress.partBCompleted && progress.partCCompleted && (
              <Link
                href="/results"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                View Results →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
