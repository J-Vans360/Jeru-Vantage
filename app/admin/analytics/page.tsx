'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  completionByGrade: { grade: string; completed: number; total: number }[];
  hollandCodeDistribution: { code: string; count: number; percentage: number }[];
  topStrengths: { name: string; count: number }[];
  topDevelopmentAreas: { name: string; count: number }[];
  countryPreferences: { country: string; count: number; percentage: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights and trends across your student population</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion by Grade */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Assessment Completion by Grade
          </h2>
          {data?.completionByGrade && data.completionByGrade.length > 0 ? (
            <div className="space-y-4">
              {data.completionByGrade.map((grade) => {
                const percentage = grade.total > 0 ? Math.round((grade.completed / grade.total) * 100) : 0;
                return (
                  <div key={grade.grade}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Grade {grade.grade}</span>
                      <span className="text-gray-500">
                        {grade.completed}/{grade.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No grade data available yet</p>
          )}
        </div>

        {/* Holland Code Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Top Career Interests (Holland Code)
          </h2>
          {data?.hollandCodeDistribution && data.hollandCodeDistribution.length > 0 ? (
            <div className="space-y-3">
              {data.hollandCodeDistribution.slice(0, 6).map((item, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];
                return (
                  <div key={item.code} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${colors[index]}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.code}</span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className={`${colors[index]} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No Holland Code data available yet</p>
          )}
        </div>

        {/* Top Strengths */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Common Strengths
          </h2>
          {data?.topStrengths && data.topStrengths.length > 0 ? (
            <ul className="space-y-3">
              {data.topStrengths.slice(0, 5).map((strength, index) => (
                <li key={strength.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">{strength.name}</span>
                  <span className="text-sm text-gray-500">{strength.count} students</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No strength data available yet</p>
          )}
        </div>

        {/* Development Areas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Common Development Areas
          </h2>
          {data?.topDevelopmentAreas && data.topDevelopmentAreas.length > 0 ? (
            <ul className="space-y-3">
              {data.topDevelopmentAreas.slice(0, 5).map((area, index) => (
                <li key={area.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">{area.name}</span>
                  <span className="text-sm text-gray-500">{area.count} students</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No development area data available yet</p>
          )}
        </div>

        {/* Country Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">University Destination Preferences</h2>
          {data?.countryPreferences && data.countryPreferences.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {data.countryPreferences.map((country) => (
                <div key={country.country} className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-2xl font-bold text-gray-900">{country.percentage}%</p>
                  <p className="text-sm text-gray-600">{country.country}</p>
                  <p className="text-xs text-gray-400">{country.count} students</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No country preference data available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
