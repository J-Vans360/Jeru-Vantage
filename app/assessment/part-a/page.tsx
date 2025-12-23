'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const USER_ID = 'test-user-123';

export default function PartAPage() {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      // Create or update the assessment result for Part A
      const response = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          partName: 'Part A',
          domainName: 'Personality & Values',
          responses: {}, // Placeholder - will be replaced with actual responses
          scores: {}, // Placeholder - will be replaced with actual scores
          completed: true,
        }),
      });

      if (response.ok) {
        // Redirect back to assessment page
        router.push('/assessment');
      } else {
        console.error('Failed to complete Part A');
        setIsCompleting(false);
      }
    } catch (error) {
      console.error('Error completing Part A:', error);
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                Part A: Personality & Values
              </h1>
              <p className="text-gray-600">
                Big Five Personality Traits & Holland Code Career Assessment
              </p>
            </div>
            <Link
              href="/assessment"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 border-t border-gray-200">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Assessment Progress</span>
            <span className="text-sm font-semibold text-purple-600">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="text-6xl mb-4">📋</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Assessment Questions Coming Soon
            </h2>

            <p className="text-gray-600 text-lg">
              The Big Five Personality and Holland Code assessments will be integrated here.
            </p>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mt-8">
              <h3 className="font-bold text-purple-600 mb-3">What You'll Discover:</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Big Five Traits:</strong> Your levels of Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Holland Code:</strong> Your career interest areas (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>University Fit:</strong> How your personality aligns with different campus cultures and academic environments</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <p className="text-sm text-gray-500 mb-4">
                For testing purposes, you can mark this section as complete:
              </p>
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  isCompleting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                }`}
              >
                {isCompleting ? 'Completing...' : 'Complete Part A ✓'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl p-6 border-t">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Part A of 3</span>
            <span>Estimated time: 15-20 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
