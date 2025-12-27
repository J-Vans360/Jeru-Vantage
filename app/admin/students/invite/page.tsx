'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InviteStudentsPage() {
  const router = useRouter();
  const [schoolCode, setSchoolCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => setSchoolCode(data.school?.code || ''));
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const registrationLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?code=${schoolCode}`;

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Students
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invite Students</h1>
        <p className="text-gray-600 mt-1">Share the school code or registration link with your students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Code */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">School Code</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Students enter this code when registering to automatically join your school.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-orange-50 border-2 border-orange-200 px-4 py-4 rounded-lg font-mono text-2xl font-bold text-center text-orange-600">
              {schoolCode}
            </code>
            <button
              onClick={() => handleCopy(schoolCode)}
              className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Direct Registration Link</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share this link - the school code is pre-filled for easy registration.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={registrationLink}
              className="flex-1 bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-600 border border-gray-200"
            />
            <button
              onClick={() => handleCopy(registrationLink)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">How Students Join</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-orange-600">1</span>
            </div>
            <h3 className="font-medium mb-1">Create Account</h3>
            <p className="text-sm text-gray-600">Student registers at the registration page</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-orange-600">2</span>
            </div>
            <h3 className="font-medium mb-1">Enter School Code</h3>
            <p className="text-sm text-gray-600">Student enters your school code: {schoolCode}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-orange-600">3</span>
            </div>
            <h3 className="font-medium mb-1">Auto-Enrolled</h3>
            <p className="text-sm text-gray-600">Student is automatically added to your school</p>
          </div>
        </div>
      </div>

      {/* Email Template */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
        <h2 className="text-lg font-semibold mb-4">Sample Email to Students</h2>
        <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-2">Dear Student,</p>
          <p className="mb-2">
            Please register for your career assessment at Jeru Vantage using the following school code:
          </p>
          <p className="mb-2 font-bold text-orange-600">{schoolCode}</p>
          <p className="mb-2">
            Or use this direct link:{' '}
            <span className="text-blue-600 break-all">{registrationLink}</span>
          </p>
          <p>Best regards,</p>
          <p>Your School Counselor</p>
        </div>
        <button
          onClick={() =>
            handleCopy(
              `Dear Student,\n\nPlease register for your career assessment at Jeru Vantage using the following school code: ${schoolCode}\n\nOr use this direct link: ${registrationLink}\n\nBest regards,\nYour School Counselor`
            )
          }
          className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Email Template
        </button>
      </div>
    </div>
  );
}
