'use client';

import { useEffect, useState } from 'react';
import UniversityMatches from './UniversityMatches';

interface Props {
  studentId: string;
}

export default function UniversityMatchesWrapper({ studentId }: Props) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/matching/student/${studentId}`);
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
      setLoading(false);
    }

    fetchMatches();
  }, [studentId]);

  if (loading) {
    return (
      <div className="mt-12 text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-500 mt-2">Finding university matches...</p>
      </div>
    );
  }

  return <UniversityMatches studentId={studentId} matches={matches} />;
}
