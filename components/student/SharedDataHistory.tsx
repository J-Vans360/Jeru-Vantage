'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Shield,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
} from 'lucide-react';

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
    basic: SharedDataItem[];
    enhanced?: SharedDataItem[];
    full?: SharedDataItem[];
  };
  canWithdraw: boolean;
}

interface SharedDataItem {
  label: string;
  value: string;
  category: 'identity' | 'academic' | 'interests' | 'financial' | 'assessment';
}

interface SharedDataHistoryProps {
  records: SharedDataRecord[];
  onWithdrawConsent: (recordId: string) => Promise<void>;
}

const consentLevelLabels = {
  BASIC: { label: 'Basic Profile', color: 'bg-blue-100 text-blue-700' },
  ENHANCED: { label: 'Enhanced Profile', color: 'bg-purple-100 text-purple-700' },
  FULL: { label: 'Full Profile', color: 'bg-green-100 text-green-700' },
};

const categoryIcons: Record<string, string> = {
  identity: '👤',
  academic: '📚',
  interests: '🎯',
  financial: '💰',
  assessment: '📊',
};

export default function SharedDataHistory({
  records,
  onWithdrawConsent,
}: SharedDataHistoryProps) {
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState<string | null>(null);

  const handleWithdraw = async (recordId: string) => {
    setWithdrawingId(recordId);
    try {
      await onWithdrawConsent(recordId);
      setShowWithdrawConfirm(null);
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
    }
    setWithdrawingId(null);
  };

  const downloadDataCopy = (record: SharedDataRecord) => {
    const data = {
      university: record.universityName,
      sharedOn: format(new Date(record.consentDate), 'PPP'),
      consentLevel: record.consentLevel,
      dataShared: record.sharedData,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shared-data-${record.universityName.replace(/\s+/g, '-')}-${format(new Date(record.consentDate), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Shared Data Yet</h3>
        <p className="text-gray-500">
          When you connect with universities, you'll see exactly what information was shared here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Shared Data</h2>
          <p className="text-gray-600 text-sm mt-1">
            View exactly what information you've shared with universities
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          {records.length} connection{records.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Your data, your control.</strong> You can withdraw consent at any time.
          Universities will be notified and must delete your information within 30 days.
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {records.map((record) => {
          const isExpanded = expandedRecord === record.id;
          const levelConfig = consentLevelLabels[record.consentLevel];

          return (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Record Header */}
              <button
                onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {record.universityLogo ? (
                    <img
                      src={record.universityLogo}
                      alt={record.universityName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {record.universityName.charAt(0)}
                    </div>
                  )}

                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{record.universityName}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{record.universityCountry}</span>
                      {record.programName && (
                        <>
                          <span>•</span>
                          <span>{record.programName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${levelConfig.color}`}
                    >
                      {levelConfig.label}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Shared {format(new Date(record.consentDate), 'MMM d, yyyy')}
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6 space-y-6">
                      {/* Match Info */}
                      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-500">Match Score</div>
                          <div className="text-2xl font-bold text-green-600">
                            {record.matchScore}%
                          </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200" />
                        <div>
                          <div className="text-sm text-gray-500">Status</div>
                          <div className="font-medium text-gray-900">{record.status}</div>
                        </div>
                        <div className="h-10 w-px bg-gray-200" />
                        <div>
                          <div className="text-sm text-gray-500">Consent Level</div>
                          <div className="font-medium text-gray-900">{levelConfig.label}</div>
                        </div>
                      </div>

                      {/* Shared Data Breakdown */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Data Shared with {record.universityName}
                        </h4>

                        {/* Basic Data */}
                        <DataSection title="Basic Information" items={record.sharedData.basic} />

                        {/* Enhanced Data */}
                        {record.sharedData.enhanced && record.sharedData.enhanced.length > 0 && (
                          <DataSection
                            title="Enhanced Information"
                            items={record.sharedData.enhanced}
                          />
                        )}

                        {/* Full Data */}
                        {record.sharedData.full && record.sharedData.full.length > 0 && (
                          <DataSection
                            title="Full Profile Information"
                            items={record.sharedData.full}
                          />
                        )}
                      </div>

                      {/* What Was NOT Shared */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          Protected Information (NOT shared)
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Your raw assessment responses</li>
                          <li>• Stress response assessment details</li>
                          <li>• Detailed personality scores</li>
                          <li>• Cognitive style analysis</li>
                          <li>• Any identified areas for development</li>
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={() => downloadDataCopy(record)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Copy
                        </button>

                        {record.canWithdraw && (
                          <button
                            onClick={() => setShowWithdrawConfirm(record.id)}
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Withdraw Consent
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Withdraw Confirmation Modal */}
              {showWithdrawConfirm === record.id && (
                <WithdrawConfirmModal
                  universityName={record.universityName}
                  onCancel={() => setShowWithdrawConfirm(null)}
                  onConfirm={() => handleWithdraw(record.id)}
                  loading={withdrawingId === record.id}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Data Section Component
function DataSection({ title, items }: { title: string; items: SharedDataItem[] }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>
      <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
        {items.map((item, idx) => (
          <div key={idx} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{categoryIcons[item.category]}</span>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Withdraw Confirmation Modal
function WithdrawConfirmModal({
  universityName,
  onCancel,
  onConfirm,
  loading,
}: {
  universityName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Withdraw Consent?</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to withdraw your consent to share data with{' '}
            <strong>{universityName}</strong>?
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-amber-800">
              <strong>What happens next:</strong>
              <ul className="mt-2 space-y-1">
                <li>• {universityName} will be notified</li>
                <li>• They must delete your data within 30 days</li>
                <li>• Any pending application may be affected</li>
                <li>• You can reconnect later if you change your mind</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Keep Connection
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Withdrawing...' : 'Withdraw Consent'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
