import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SharedDataHistoryWrapper from '@/components/student/SharedDataHistoryWrapper';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default async function PrivacyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy & Data</h1>
        <p className="text-gray-600 mt-2">
          Manage your data and see what you've shared with universities
        </p>
      </div>

      {/* Privacy Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Data Protection</h3>
          <p className="text-sm text-gray-500">
            Your data is encrypted and securely stored following GDPR guidelines.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Consent Control</h3>
          <p className="text-sm text-gray-500">
            You decide who sees your information and can withdraw consent anytime.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Full Transparency</h3>
          <p className="text-sm text-gray-500">
            See exactly what data was shared with each university connection.
          </p>
        </div>
      </div>

      {/* Shared Data History */}
      <SharedDataHistoryWrapper />

      {/* Additional Privacy Info */}
      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <FileText className="w-6 h-6 text-gray-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Rights</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <strong>Right to Access:</strong> Download a copy of all your data at any time.
              </li>
              <li>
                <strong>Right to Rectification:</strong> Update or correct your personal information.
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your data (subject to legal
                requirements).
              </li>
              <li>
                <strong>Right to Withdraw:</strong> Revoke consent for data sharing with
                universities.
              </li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              For any privacy concerns, contact us at{' '}
              <a href="mailto:privacy@jeruvantage.com" className="text-blue-600 hover:underline">
                privacy@jeruvantage.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
