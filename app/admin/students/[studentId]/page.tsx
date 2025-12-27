'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentDetail {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  studentProfile: any;
  assessmentResults: any[];
  jeruReports: any[];
  schoolStudent: {
    grade: string | null;
    section: string | null;
    studentId: string | null;
    enrolledAt: string;
  }[];
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/students/${params.studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.student);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
        <Link href="/admin/students" className="text-orange-500 hover:underline mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  const schoolInfo = student.schoolStudent[0];
  const completedSections = student.assessmentResults?.length || 0;
  const progress = Math.round((completedSections / 10) * 100);

  // Assessment sections for tracking
  const assessmentSections = [
    { id: 'part-a-s1', name: 'Part A - Section 1: Personality' },
    { id: 'part-a-s2', name: 'Part A - Section 2: Values' },
    { id: 'part-a-s3', name: 'Part A - Section 3: Holland Code' },
    { id: 'part-a-s4', name: 'Part A - Section 4: Multiple Intelligences' },
    { id: 'part-b-s1', name: 'Part B - Section 1: Cognitive Style' },
    { id: 'part-b-s2', name: 'Part B - Section 2: Stress Response' },
    { id: 'part-b-s3', name: 'Part B - Section 3: 21st Century Skills' },
    { id: 'part-b-s4', name: 'Part B - Section 4: Environment Preferences' },
    { id: 'part-c-s1', name: 'Part C - Section 1: Execution Style' },
    { id: 'part-c-s2', name: 'Part C - Section 2: Summary' },
  ];

  return (
    <div>
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Students
      </button>

      {/* Student Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">
                {student.name?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name || 'Unnamed Student'}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {student.email}
                </span>
                {schoolInfo?.grade && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Grade {schoolInfo.grade}
                    {schoolInfo.section && ` - ${schoolInfo.section}`}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {new Date(schoolInfo?.enrolledAt || student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Assessment Progress</h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {assessmentSections.map((section) => {
              const completed = student.assessmentResults?.some(
                (a) => a.partName === section.id || a.domainName?.toLowerCase().includes(section.id.split('-')[1])
              );
              return (
                <div key={section.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{section.name}</span>
                  {completed ? (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Jeru Reports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Jeru Reports</h2>

          {!student.jeruReports || student.jeruReports.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm">No reports generated yet</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {student.jeruReports.map((report: any) => (
                <li key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Report #{report.generationNumber}</p>
                      <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Student Profile Summary */}
      {student.studentProfile && (
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Career Interests</p>
              <p className="font-medium">
                {[
                  student.studentProfile.careerInterest1,
                  student.studentProfile.careerInterest2,
                  student.studentProfile.careerInterest3,
                ]
                  .filter(Boolean)
                  .join(', ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Countries</p>
              <p className="font-medium">
                {[
                  student.studentProfile.destinationCountry1,
                  student.studentProfile.destinationCountry2,
                  student.studentProfile.destinationCountry3,
                ]
                  .filter(Boolean)
                  .join(', ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Curriculum</p>
              <p className="font-medium">{student.studentProfile.primaryCurriculum || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
