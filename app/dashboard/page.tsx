import { getStudentProfile } from '@/actions/profile-actions';
import { getCurrentUserId } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Dashboard() {
  const userId = await getCurrentUserId();
  const result = await getStudentProfile(userId);

  // Fetch assessment results
  let assessmentResults: any[] = [];
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
  }

  // Extract specific assessment results
  const valuesResult = assessmentResults.find((r) => r.domainName === 'Values & Interests');
  const personalityResult = assessmentResults.find((r) => r.domainName === 'Personality Architecture');
  const hollandResult = assessmentResults.find((r) => r.domainName === 'Career Interests (Holland Code)');
  const intelligencesResult = assessmentResults.find((r) => r.domainName === 'Multiple Intelligences');

  if (!result.success || !result.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Profile Found</h1>
            <p className="text-gray-600 mb-6">You haven't completed your profile yet.</p>
            <Link
              href="/profile"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Create Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = result.profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                📊 Student Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold">{profile.studentName}</span>!
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profile"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                ✏️ Edit Profile
              </Link>
              <Link
                href="/assessment"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                🚀 Start Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="bg-white p-8 space-y-6">
          
          {/* A. Demographics */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              A. Demographics & Residency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-semibold">{profile.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Grade</p>
                <p className="font-semibold">{profile.currentGrade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Entry Year</p>
                <p className="font-semibold">{profile.targetEntryYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Citizenship</p>
                <p className="font-semibold">{profile.citizenshipPrimary}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country of Residence</p>
                <p className="font-semibold">{profile.countryResidence}</p>
              </div>
              {profile.citizenshipSecondary && (
                <div>
                  <p className="text-sm text-gray-500">Second Citizenship</p>
                  <p className="font-semibold">{profile.citizenshipSecondary}</p>
                </div>
              )}
            </div>
          </div>

          {/* B. Financial */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              B. Financial Reality Check
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Annual Budget Range</p>
                <p className="font-semibold">{profile.annualBudgetRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Need-Based Aid</p>
                <p className="font-semibold capitalize">{profile.needBasedAid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">US Applicant Status</p>
                <p className="font-semibold">{profile.usApplicantStatus === 'us-citizen' ? 'US Citizen/Green Card' : 'International'}</p>
              </div>
            </div>
          </div>

          {/* C. Educational */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              C. Educational System Context
            </h2>
            <div>
              <p className="text-sm text-gray-500">Primary Curriculum</p>
              <p className="font-semibold capitalize">{profile.primaryCurriculum.replace('-', ' ')}</p>
            </div>
            {profile.curriculumOther && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">Other Curriculum</p>
                <p className="font-semibold">{profile.curriculumOther}</p>
              </div>
            )}
          </div>

          {/* D. Academic Data */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              D. Academic Data
            </h2>
            {profile.subjects && profile.subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Course</th>
                      <th className="p-3 font-semibold">Level</th>
                      <th className="p-3 font-semibold">Grade</th>
                      <th className="p-3 font-semibold">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.subjects
                      .filter((s: any) => s.subjectCategory || s.courseName)
                      .map((subject: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{subject.subjectCategory || '-'}</td>
                          <td className="p-3">{subject.courseName || '-'}</td>
                          <td className="p-3">{subject.difficultyLevel || '-'}</td>
                          <td className="p-3">{subject.latestGrade || '-'}</td>
                          <td className="p-3">
                            {'⭐'.repeat(subject.interestLevel)}
                            {'☆'.repeat(5 - subject.interestLevel)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No subjects added</p>
            )}
          </div>

          {/* E. Testing */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              E. Standardized Testing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.nativeEnglish && (
                <div className="col-span-3">
                  <p className="font-semibold text-green-600">✓ Native English Speaker</p>
                </div>
              )}
              {profile.ieltsScore && (
                <div>
                  <p className="text-sm text-gray-500">IELTS</p>
                  <p className="font-semibold">{profile.ieltsScore}</p>
                </div>
              )}
              {profile.toeflScore && (
                <div>
                  <p className="text-sm text-gray-500">TOEFL</p>
                  <p className="font-semibold">{profile.toeflScore}</p>
                </div>
              )}
              {profile.duolingoScore && (
                <div>
                  <p className="text-sm text-gray-500">Duolingo</p>
                  <p className="font-semibold">{profile.duolingoScore}</p>
                </div>
              )}
              {profile.satTotal && (
                <div>
                  <p className="text-sm text-gray-500">SAT Total</p>
                  <p className="font-semibold">{profile.satTotal}</p>
                </div>
              )}
              {profile.actComposite && (
                <div>
                  <p className="text-sm text-gray-500">ACT</p>
                  <p className="font-semibold">{profile.actComposite}</p>
                </div>
              )}
              {profile.testOptional && (
                <div>
                  <p className="font-semibold text-blue-600">📝 Applying Test Optional</p>
                </div>
              )}
              {!profile.nativeEnglish && !profile.ieltsScore && !profile.toeflScore && !profile.satTotal && !profile.testOptional && (
                <p className="text-gray-500">No test scores recorded</p>
              )}
            </div>
          </div>

          {/* F. Learning Context */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              F. Learning & Disciplinary Context
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Learning Support</p>
                <p className="font-semibold">{profile.learningSupport ? 'Yes - Support Needed' : 'No support needed'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disciplinary Record</p>
                <p className="font-semibold capitalize">{profile.disciplinaryRecord === 'clean' ? '✓ Clean Record' : 'Has Infractions'}</p>
              </div>
            </div>
          </div>

          {/* G. Aspirations */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-600 mb-4 border-b pb-2">
              G. Student Aspirations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Career Interest #1</p>
                <p className="font-semibold">{profile.careerInterest1}</p>
              </div>
              {profile.careerInterest2 && (
                <div>
                  <p className="text-sm text-gray-500">Career Interest #2</p>
                  <p className="font-semibold">{profile.careerInterest2}</p>
                </div>
              )}
              {profile.careerInterest3 && (
                <div>
                  <p className="text-sm text-gray-500">Career Interest #3</p>
                  <p className="font-semibold">{profile.careerInterest3}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Primary Destination</p>
                <p className="font-semibold">{profile.destinationCountry1}</p>
              </div>
              {profile.destinationCountry2 && (
                <div>
                  <p className="text-sm text-gray-500">Alternative Destination</p>
                  <p className="font-semibold">{profile.destinationCountry2}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Results - Core Values */}
          {valuesResult?.scores && (
            <div className="border-2 border-pink-200 rounded-lg p-6 bg-pink-50">
              <h2 className="text-xl font-bold text-pink-600 mb-4 border-b border-pink-300 pb-2 flex items-center gap-2">
                <span>❤️</span> H. Assessment Results - Core Values & Interests
              </h2>
              <div className="bg-white rounded-lg p-4">
                <div className="mb-3">
                  <div className="text-lg font-semibold text-gray-700 mb-3">Your Top 3 Core Values:</div>
                  <div className="flex flex-wrap gap-2">
                    {valuesResult.scores.topValues?.slice(0, 3).map((value: any, idx: number) => (
                      <div
                        key={value.name}
                        className={`px-4 py-2 rounded-full font-semibold ${
                          idx === 0 ? 'bg-pink-600 text-white text-lg' :
                          idx === 1 ? 'bg-pink-500 text-white' :
                          'bg-pink-400 text-white'
                        }`}
                      >
                        #{idx + 1} {value.name}
                      </div>
                    ))}
                  </div>
                </div>
                {valuesResult.scores.topValues?.length > 3 && (
                  <div className="text-sm text-gray-600 mt-3">
                    <span className="font-semibold">Also valued:</span> {valuesResult.scores.topValues.slice(3, 6).map((v: any) => v.name).join(', ')}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/results"
                    className="inline-block px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-all text-sm"
                  >
                    View Complete Assessment Results →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Results Summary */}
          {assessmentResults.length > 0 && !valuesResult && (
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-300 pb-2">
                H. Assessment Results
              </h2>
              <p className="text-gray-700 mb-4">
                You've completed {assessmentResults.length} assessment section{assessmentResults.length !== 1 ? 's' : ''}.
              </p>
              <Link
                href="/results"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
              >
                View Complete Assessment Results →
              </Link>
            </div>
          )}

          {/* No Assessment Results Yet */}
          {assessmentResults.length === 0 && (
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-600 mb-4 border-b border-gray-300 pb-2">
                H. Assessment Results
              </h2>
              <p className="text-gray-600 mb-4">
                You haven't completed any assessment sections yet.
              </p>
              <Link
                href="/assessment"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
              >
                Start Assessment →
              </Link>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl p-6 border-t">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              Profile last updated: {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
            <Link
              href="/assessment"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Continue to Assessment →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}