'use client';

import { useState } from 'react';
import {
  Plus, Search, Download,
  Users, CheckCircle, Clock, Ticket, Copy, Check,
  Edit2, Trash2, ToggleRight, AlertTriangle
} from 'lucide-react';

interface PilotCode {
  id: string;
  code: string;
  name: string;
  sourceType: string;
  sourceName: string | null;
  sourceEmail: string | null;
  sourceCountry: string | null;
  maxUses: number | null;
  currentUses: number;
  completedCount: number;
  isActive: boolean;
  validFrom: string | null;
  validUntil: string | null;
  createdAt: string;
}

interface PilotCodesAdminProps {
  codes: PilotCode[];
  stats: {
    totalCodes: number;
    activeCodes: number;
    totalCapacity: number;
    totalUsed: number;
    completedAssessments: number;
  };
}

export default function PilotCodesAdmin({ codes, stats }: PilotCodesAdminProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<PilotCode | null>(null);
  const [deletingCode, setDeletingCode] = useState<PilotCode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCodes = codes.filter(code => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.sourceName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || code.sourceType === filterType;

    return matchesSearch && matchesType;
  });

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: PilotCode) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/super-admin/pilot/codes/${code.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingCode(null);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete code');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete code');
    }
    setIsDeleting(false);
  };

  const handleToggleActive = async (code: PilotCode) => {
    try {
      const res = await fetch(`/api/super-admin/pilot/codes/${code.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !code.isActive }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const completionRate = stats.totalUsed > 0
    ? ((stats.completedAssessments / stats.totalUsed) * 100).toFixed(1)
    : '0';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invite Codes</h1>
          <p className="text-gray-600">Manage pilot program access codes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {/* Export CSV */}}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Code
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total Codes"
          value={stats.totalCodes}
          icon={<Ticket className="w-5 h-5" />}
        />
        <StatCard
          label="Active Codes"
          value={stats.activeCodes}
          icon={<ToggleRight className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Total Capacity"
          value={stats.totalCapacity}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Codes Used"
          value={stats.totalUsed}
          subtitle={`${stats.totalCapacity > 0 ? ((stats.totalUsed / stats.totalCapacity) * 100).toFixed(0) : 0}% of capacity`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Completed"
          value={stats.completedAssessments}
          subtitle={`${completionRate}% completion`}
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search codes, names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="COUNSELOR">Counselors</option>
            <option value="SCHOOL">Schools</option>
            <option value="VIP">VIP</option>
            <option value="TEST">Test</option>
          </select>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Code</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name/Source</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Usage</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Completed</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map((code) => (
                <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {code.code}
                      </code>
                      <button
                        onClick={() => copyCode(code.code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedCode === code.code ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{code.name}</div>
                      {code.sourceName && (
                        <div className="text-sm text-gray-500">{code.sourceName}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${code.sourceType === 'COUNSELOR' ? 'bg-blue-100 text-blue-700' : ''}
                      ${code.sourceType === 'SCHOOL' ? 'bg-green-100 text-green-700' : ''}
                      ${code.sourceType === 'VIP' ? 'bg-purple-100 text-purple-700' : ''}
                      ${code.sourceType === 'TEST' ? 'bg-gray-100 text-gray-700' : ''}
                      ${code.sourceType === 'OTHER' ? 'bg-orange-100 text-orange-700' : ''}
                    `}>
                      {code.sourceType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: code.maxUses
                              ? `${(code.currentUses / code.maxUses) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {code.currentUses}/{code.maxUses || '\u221E'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">
                      {code.completedCount}
                      {code.currentUses > 0 && (
                        <span className="text-gray-400 ml-1">
                          ({((code.completedCount / code.currentUses) * 100).toFixed(0)}%)
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${code.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {code.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(code)}
                        className={`p-1 ${code.isActive ? 'text-green-500 hover:text-red-600' : 'text-gray-400 hover:text-green-600'}`}
                        title={code.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <ToggleRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCode(code)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCode(code)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCodes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No codes found matching your criteria
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCodeModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit Modal */}
      {editingCode && (
        <EditCodeModal
          code={editingCode}
          onClose={() => setEditingCode(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Code</h2>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete the code <strong>{deletingCode.code}</strong>?
            </p>
            {deletingCode.currentUses > 0 && (
              <p className="text-amber-600 text-sm mb-4">
                Warning: This code has been used {deletingCode.currentUses} time(s). Deleting it will remove all usage records.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeletingCode(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingCode)}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  color = 'gray'
}: {
  label: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'gray' | 'green' | 'blue' | 'purple';
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{label}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function CreateCodeModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    code: '',
    name: '',
    sourceType: 'COUNSELOR',
    sourceName: '',
    sourceEmail: '',
    sourceCountry: '',
    maxUses: 50,
    validUntil: '',
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await fetch('/api/super-admin/pilot/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to create code:', error);
    }

    setCreating(false);
  };

  const generateCode = () => {
    const prefix = form.sourceType === 'COUNSELOR' ? 'COUN' :
                   form.sourceType === 'SCHOOL' ? 'SCH' :
                   form.sourceType === 'VIP' ? 'VIP' : 'TEST';
    const suffix = form.sourceName
      ? form.sourceName.toUpperCase().replace(/\s+/g, '-').slice(0, 10)
      : Math.random().toString(36).substring(2, 6).toUpperCase();
    setForm(prev => ({ ...prev, code: `${prefix}-${suffix}` }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Invite Code</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <select
              value={form.sourceType}
              onChange={(e) => setForm(prev => ({ ...prev, sourceType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="COUNSELOR">Counselor</option>
              <option value="SCHOOL">School</option>
              <option value="VIP">VIP</option>
              <option value="TEST">Test</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Sarah Tan - Singapore"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Name (Counselor/School)
            </label>
            <input
              type="text"
              value={form.sourceName}
              onChange={(e) => setForm(prev => ({ ...prev, sourceName: e.target.value }))}
              placeholder="e.g., Sarah Tan"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.sourceEmail}
                onChange={(e) => setForm(prev => ({ ...prev, sourceEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.sourceCountry}
                onChange={(e) => setForm(prev => ({ ...prev, sourceCountry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="COUN-SARAH-SG"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono uppercase"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm(prev => ({ ...prev, validUntil: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCodeModal({ code, onClose }: { code: PilotCode; onClose: () => void }) {
  const [form, setForm] = useState({
    name: code.name,
    sourceType: code.sourceType,
    sourceName: code.sourceName || '',
    sourceEmail: code.sourceEmail || '',
    sourceCountry: code.sourceCountry || '',
    maxUses: code.maxUses || 50,
    validUntil: code.validUntil ? code.validUntil.split('T')[0] : '',
    isActive: code.isActive,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/super-admin/pilot/codes/${code.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        onClose();
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update code');
      }
    } catch (error) {
      console.error('Failed to update code:', error);
      alert('Failed to update code');
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Code: {code.code}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <select
              value={form.sourceType}
              onChange={(e) => setForm(prev => ({ ...prev, sourceType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="COUNSELOR">Counselor</option>
              <option value="SCHOOL">School</option>
              <option value="VIP">VIP</option>
              <option value="TEST">Test</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Name
            </label>
            <input
              type="text"
              value={form.sourceName}
              onChange={(e) => setForm(prev => ({ ...prev, sourceName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.sourceEmail}
                onChange={(e) => setForm(prev => ({ ...prev, sourceEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.sourceCountry}
                onChange={(e) => setForm(prev => ({ ...prev, sourceCountry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm(prev => ({ ...prev, validUntil: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
