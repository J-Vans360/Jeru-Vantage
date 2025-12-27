import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Ticket, AlertTriangle, RefreshCw } from 'lucide-react';
import { unstable_cache } from 'next/cache';

export const metadata = {
  title: 'Pilot Program | Super Admin',
};

type CodeItem = {
  id: string;
  code: string;
  sourceName: string | null;
  sourceType: string;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
};

// Cache the data for 30 seconds
const getCachedPilotData = unstable_cache(
  async () => {
    const codes = await prisma.pilotInviteCode.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        sourceName: true,
        sourceType: true,
        maxUses: true,
        currentUses: true,
        isActive: true,
      }
    });
    return codes;
  },
  ['pilot-codes'],
  { revalidate: 30 } // Refresh every 30 seconds
);

export default async function PilotAdminPage() {
  let codes: CodeItem[] = [];
  let error = '';

  try {
    codes = await getCachedPilotData();
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : 'Database error';
  }

  const totalCodes = codes.length;
  const activeCodes = codes.filter(c => c.isActive).length;
  const totalUsages = codes.reduce((sum, c) => sum + c.currentUses, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pilot Program</h1>
          <p className="text-gray-500">Manage invite codes</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/super-admin/pilot"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 px-3 py-2"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </Link>
          <Link
            href="/super-admin/pilot/codes"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Manage Codes
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <p className="font-medium text-amber-800">Database Issue</p>
            <p className="text-sm text-amber-700">Run: npx prisma db push</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{totalCodes}</p>
          <p className="text-sm text-gray-500">Codes</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{activeCodes}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{totalUsages}</p>
          <p className="text-sm text-gray-500">Used</p>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Invite Codes</h2>
          <span className="text-xs text-gray-400">Auto-refreshes every 30s</span>
        </div>
        {codes.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {codes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-amber-600">{code.code}</td>
                  <td className="px-4 py-3 text-gray-600">{code.sourceName || 'No name'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      code.sourceType === 'COUNSELOR' ? 'bg-blue-100 text-blue-700' :
                      code.sourceType === 'SCHOOL' ? 'bg-green-100 text-green-700' :
                      code.sourceType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{code.sourceType}</span>
                  </td>
                  <td className="px-4 py-3">{code.currentUses}/{code.maxUses || '∞'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      code.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${code.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Ticket className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No codes yet</p>
            <Link href="/super-admin/pilot/codes" className="text-amber-600 text-sm mt-2 inline-block">
              Create your first code →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
