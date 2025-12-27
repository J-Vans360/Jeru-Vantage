'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SharedDataHistory from './SharedDataHistory';
import { Loader2 } from 'lucide-react';

interface SharedDataRecord {
  id: string;
  universityId: string;
  universityName: string;
  universityLogo?: string;
  universityCountry: string;
  programName?: string;
  consentLevel: 'BASIC' | 'ENHANCED' | 'FULL';
  consentDate: Date;
  status: string;
  matchScore: number;
  sharedData: {
    basic: { label: string; value: string; category: 'identity' | 'academic' | 'interests' | 'financial' | 'assessment' }[];
    enhanced?: { label: string; value: string; category: 'identity' | 'academic' | 'interests' | 'financial' | 'assessment' }[];
    full?: { label: string; value: string; category: 'identity' | 'academic' | 'interests' | 'financial' | 'assessment' }[];
  };
  canWithdraw: boolean;
}

export default function SharedDataHistoryWrapper() {
  const router = useRouter();
  const [records, setRecords] = useState<SharedDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSharedData();
  }, []);

  const fetchSharedData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/shared-data');

      if (!response.ok) {
        throw new Error('Failed to fetch shared data');
      }

      const data = await response.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error('Error fetching shared data:', err);
      setError('Unable to load your shared data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawConsent = async (recordId: string) => {
    try {
      const response = await fetch(`/api/student/shared-data/${recordId}/withdraw`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to withdraw consent');
      }

      // Remove the record from the list or update its status
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? { ...r, canWithdraw: false, status: 'CONSENT_WITHDRAWN' }
            : r
        )
      );

      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error('Error withdrawing consent:', err);
      throw err; // Re-throw so the component can handle it
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-gray-500">Loading your shared data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchSharedData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <SharedDataHistory
      records={records}
      onWithdrawConsent={handleWithdrawConsent}
    />
  );
}
