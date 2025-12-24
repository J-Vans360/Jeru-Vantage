import { getStudentProfile } from '@/actions/profile-actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getCurrentUserId } from '@/lib/auth-utils';

async function getAssessmentProgress(userId: string) {
  const results = await prisma.assessmentResult.findMany({
    where: { userId },
    select: {
      partName: true,
      domainName: true,
      completed: true,
    },
  });

  // Check for Part A subsections
  const partAS1 = results.find((r) => r.partName === 'Part A' && r.domainName === 'Personality Architecture');
  const partAS2 = results.find((r) => r.partName === 'Part A' && r.domainName === 'Values & Interests');
  const partAS3 = results.find((r) => r.partName === 'Part A' && r.domainName === 'Career Interests (Holland Code)');
  const partAS4 = results.find((r) => r.partName === 'Part A' && r.domainName === 'Multiple Intelligences');

  // Part A is completed when S1, S2, S3, and S4 are all completed
  const partACompleted = (partAS1?.completed || false) && (partAS2?.completed || false) && (partAS3?.completed || false) && (partAS4?.completed || false);

  // Check for Part B subsections
  const partBS1 = results.find((r) => r.partName === 'Part B' && r.domainName === 'Cognitive Style');
  const partBS2 = results.find((r) => r.partName === 'Part B' && r.domainName === 'Stress Response');
  const partBS3 = results.find((r) => r.partName === 'Part B' && r.domainName === '21st Century Skills');
  const partBS4 = results.find((r) => r.partName === 'Part B' && r.domainName === 'Social Check');

  // Part B is completed when all 4 subsections are completed
  const partBCompleted = (partBS1?.completed || false) && (partBS2?.completed || false) && (partBS3?.completed || false) && (partBS4?.completed || false);

  // Check for Part C subsections
  const partCS1 = results.find((r) => r.partName === 'Part C' && r.domainName === 'Environment & Preferences');
  const partCS2 = results.find((r) => r.partName === 'Part C' && r.domainName === 'Execution & Grit');

  // Part C is completed when both subsections are completed
  const partCCompleted = (partCS1?.completed || false) && (partCS2?.completed || false);

  return {
    partAS1Completed: partAS1?.completed || false,
    partAS2Completed: partAS2?.completed || false,
    partAS3Completed: partAS3?.completed || false,
    partAS4Completed: partAS4?.completed || false,
    partACompleted,
    partBS1Completed: partBS1?.completed || false,
    partBS2Completed: partBS2?.completed || false,
    partBS3Completed: partBS3?.completed || false,
    partBS4Completed: partBS4?.completed || false,
    partBCompleted,
    partCS1Completed: partCS1?.completed || false,
    partCS2Completed: partCS2?.completed || false,
    partCCompleted,
  };
}

export default async function AssessmentPage() {
  const userId = await getCurrentUserId();
  const profileResult = await getStudentProfile(userId);
  const progress = await getAssessmentProgress(userId);

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
                  Discover your personality type and core values through the Big Five personality traits and values assessment.
                </p>

                {/* Subsection Progress */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partAS1Completed ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {progress.partAS1Completed ? '✓' : '○'} S1: Personality Architecture (50 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partAS2Completed ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {progress.partAS2Completed ? '✓' : '○'} S2: Core Values (60 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partAS3Completed ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {progress.partAS3Completed ? '✓' : '○'} S3: Holland Code - Career Interests (60 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partAS4Completed ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {progress.partAS4Completed ? '✓' : '○'} S4: Multiple Intelligences (80 questions)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 55-60 minutes total</span>
                  <span className={`font-semibold ${
                    progress.partACompleted ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    {progress.partACompleted ? '✓ Completed' : progress.partAS1Completed || progress.partAS2Completed || progress.partAS3Completed || progress.partAS4Completed ? '⟳ In Progress' : '○ Not Started'}
                  </span>
                </div>
              </div>
              {progress.partACompleted && (
                <div className="text-4xl">✅</div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              {!progress.partAS1Completed ? (
                <Link
                  href="/assessment/part-a"
                  className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
                >
                  Start S1: Personality →
                </Link>
              ) : !progress.partAS2Completed ? (
                <Link
                  href="/assessment/part-a-s2"
                  className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-pink-600 to-red-600 text-white hover:shadow-lg"
                >
                  Start S2: Core Values →
                </Link>
              ) : !progress.partAS3Completed ? (
                <Link
                  href="/assessment/part-a-s3"
                  className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:shadow-lg"
                >
                  Start S3: Holland Code →
                </Link>
              ) : !progress.partAS4Completed ? (
                <Link
                  href="/assessment/part-a-s4"
                  className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                >
                  Start S4: Intelligences →
                </Link>
              ) : (
                <>
                  <Link
                    href="/assessment/part-a"
                    className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Review S1
                  </Link>
                  <Link
                    href="/assessment/part-a-s2"
                    className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Review S2
                  </Link>
                  <Link
                    href="/assessment/part-a-s3"
                    className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Review S3
                  </Link>
                  <Link
                    href="/assessment/part-a-s4"
                    className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Review S4
                  </Link>
                </>
              )}
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
                  Part B: Your Operating System
                </h3>
                <p className={`mb-3 ${
                  !progress.partACompleted ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  Understand how you think, respond to stress, and navigate the world around you.
                </p>

                {/* Subsection Progress */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partBS1Completed ? 'text-green-600 font-semibold' : progress.partACompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {progress.partBS1Completed ? '✓' : '○'} S1: Cognitive Style (50 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partBS2Completed ? 'text-green-600 font-semibold' : progress.partACompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {progress.partBS2Completed ? '✓' : '○'} S2: Stress Response (40 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partBS3Completed ? 'text-green-600 font-semibold' : progress.partACompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {progress.partBS3Completed ? '✓' : '○'} S3: 21st Century Skills (60 questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${progress.partBS4Completed ? 'text-green-600 font-semibold' : progress.partACompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {progress.partBS4Completed ? '✓' : '○'} S4: Social Check (20 questions)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 40-45 minutes total</span>
                  <span className={`font-semibold ${
                    progress.partBCompleted ? 'text-green-600' :
                    !progress.partACompleted ? 'text-gray-500' : 'text-purple-600'
                  }`}>
                    {progress.partBCompleted ? '✓ Completed' : progress.partBS1Completed || progress.partBS2Completed || progress.partBS3Completed || progress.partBS4Completed ? '⟳ In Progress' : '○ Not Started'}
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
            <div className="flex gap-3 flex-wrap">
              {progress.partACompleted ? (
                <>
                  {!progress.partBS1Completed ? (
                    <Link
                      href="/assessment/part-b-s1"
                      className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
                    >
                      Start S1: Cognitive Style →
                    </Link>
                  ) : !progress.partBS2Completed ? (
                    <Link
                      href="/assessment/part-b-s2"
                      className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg"
                    >
                      Start S2: Stress Response →
                    </Link>
                  ) : !progress.partBS3Completed ? (
                    <Link
                      href="/assessment/part-b-s3"
                      className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                    >
                      Start S3: 21st Century Skills →
                    </Link>
                  ) : !progress.partBS4Completed ? (
                    <Link
                      href="/assessment/part-b-s4"
                      className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:shadow-lg"
                    >
                      Start S4: Social Check →
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/assessment/part-b-s1"
                        className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                      >
                        Review S1
                      </Link>
                      <Link
                        href="/assessment/part-b-s2"
                        className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                      >
                        Review S2
                      </Link>
                      <Link
                        href="/assessment/part-b-s3"
                        className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                      >
                        Review S3
                      </Link>
                      <Link
                        href="/assessment/part-b-s4"
                        className="px-6 py-3 rounded-lg font-semibold transition-all bg-gray-300 text-gray-700 hover:bg-gray-400"
                      >
                        Review S4
                      </Link>
                    </>
                  )}
                </>
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
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  !progress.partBCompleted ? 'text-gray-500' : 'text-emerald-600'
                }`}>
                  🌍 Part C: The Reality Check
                </h3>
                <p className={`mb-3 ${
                  !progress.partBCompleted ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  Assess your environment preferences and academic execution capacity
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ 18-20 minutes</span>
                  <span className={`font-semibold ${
                    progress.partCCompleted ? 'text-green-600' :
                    !progress.partBCompleted ? 'text-gray-500' : 'text-emerald-600'
                  }`}>
                    {progress.partCCompleted ? '✓ Completed' : '2 sections'}
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

            {/* Subsections */}
            <div className="mb-4 space-y-2 pl-4 border-l-2 border-emerald-300">
              <div className={`text-sm ${
                !progress.partBCompleted ? 'text-gray-500' : 'text-gray-700'
              }`}>
                <span className={progress.partCS1Completed ? 'text-green-600 font-semibold' : ''}>
                  {progress.partCS1Completed ? '✓' : '○'} S1: Environment & Preferences
                </span>
              </div>
              <div className={`text-sm ${
                !progress.partBCompleted ? 'text-gray-500' : 'text-gray-700'
              }`}>
                <span className={progress.partCS2Completed ? 'text-green-600 font-semibold' : ''}>
                  {progress.partCS2Completed ? '✓' : '○'} S2: Execution & Grit
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {progress.partBCompleted ? (
                <>
                  {!progress.partCS1Completed && (
                    <Link
                      href="/assessment/part-c-s1"
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg transition-all"
                    >
                      Start S1 →
                    </Link>
                  )}
                  {progress.partCS1Completed && !progress.partCS2Completed && (
                    <Link
                      href="/assessment/part-c-s2"
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all"
                    >
                      Start S2 →
                    </Link>
                  )}
                  {progress.partCCompleted && (
                    <>
                      <Link
                        href="/assessment/part-c-s1"
                        className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-sm"
                      >
                        Review S1
                      </Link>
                      <Link
                        href="/assessment/part-c-s2"
                        className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-sm"
                      >
                        Review S2
                      </Link>
                    </>
                  )}
                </>
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
