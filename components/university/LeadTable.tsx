'use client';

interface Lead {
  id: string;
  createdAt: Date | string;
  matchScore?: number;
  status?: string;
  student?: {
    name?: string;
    country?: string;
    email?: string;
  };
}

interface LeadTableProps {
  leads: Lead[];
  compact?: boolean;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  APPLIED: 'bg-purple-100 text-purple-700',
  ENROLLED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function formatDistanceToNow(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

export default function LeadTable({ leads, compact = false }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No leads yet. Students will appear here when they express interest.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
              Student
            </th>
            {!compact && (
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Country
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
              Match
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
              Received
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">
                  {lead.student?.name || 'Anonymous'}
                </div>
                {!compact && lead.student?.email && (
                  <div className="text-sm text-gray-500">
                    {lead.student.email}
                  </div>
                )}
              </td>
              {!compact && (
                <td className="py-3 px-4 text-gray-600">
                  {lead.student?.country || '-'}
                </td>
              )}
              <td className="py-3 px-4">
                <span className="font-semibold text-green-600">
                  {lead.matchScore || 0}%
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[lead.status || 'NEW'] || statusColors.NEW
                  }`}
                >
                  {lead.status || 'NEW'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {formatDistanceToNow(lead.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
