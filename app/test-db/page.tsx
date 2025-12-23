import { prisma } from '../../lib/prisma';

export default async function TestDB() {
  let status = 'Testing...';
  let userCount = 0;
  let error = null;

  try {
    userCount = await prisma.user.count();
    status = '✅ Connected to database!';
  } catch (e: any) {
    status = '❌ Database connection failed';
    error = e.message;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Database Connection Test</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-xl mb-2">{status}</p>
        <p className="text-gray-600">Users in database: {userCount}</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 font-semibold">Error:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}