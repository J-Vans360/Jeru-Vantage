'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  Mail,
  User,
  Globe,
  GraduationCap,
  Calendar,
  TrendingUp,
  UserPlus,
  MessageSquare,
  FileCheck,
  Award,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface Lead {
  id: string;
  studentName: string;
  studentEmail: string;
  country: string;
  degreeLevel: string;
  hollandCode: string;
  matchScore: number;
  status: string;
  createdAt: Date;
  consentDate: Date;
  programId: string | null;
}

interface LeadsManagerProps {
  universityId: string;
  leads: Lead[];
  countries: string[];
  programs: { id: string; name: string }[];
  stats: {
    total: number;
    new: number;
    contacted: number;
    applied: number;
    enrolled: number;
  };
  filters: {
    status?: string;
    country?: string;
    program?: string;
    search?: string;
    sort?: string;
  };
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  NEW: { label: 'New', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: UserPlus },
  CONTACTED: { label: 'Contacted', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: MessageSquare },
  APPLIED: { label: 'Applied', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: FileCheck },
  ENROLLED: { label: 'Enrolled', color: 'text-green-600', bgColor: 'bg-green-100', icon: Award },
};

const degreeLevelLabels: Record<string, string> = {
  BACHELORS: "Bachelor's",
  MASTERS: "Master's",
  PHD: 'PhD',
};

export default function LeadsManager({
  universityId,
  leads,
  countries,
  programs,
  stats,
  filters,
}: LeadsManagerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [selectedCountry, setSelectedCountry] = useState(filters.country || 'all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Filter leads based on search term (client-side for immediate feedback)
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.studentName.toLowerCase().includes(term) ||
        lead.studentEmail.toLowerCase().includes(term) ||
        lead.country.toLowerCase().includes(term)
    );
  }, [leads, searchTerm]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === 'status') {
      if (value !== 'all') params.set('status', value);
      if (selectedCountry !== 'all') params.set('country', selectedCountry);
    } else if (key === 'country') {
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (value !== 'all') params.set('country', value);
    }
    if (searchTerm) params.set('search', searchTerm);

    const queryString = params.toString();
    router.push(`/university/${universityId}/leads${queryString ? `?${queryString}` : ''}`);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    try {
      const response = await fetch(`/api/university/${universityId}/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const exportToCSV = () => {
    const leadsToExport = selectedLeads.length > 0
      ? filteredLeads.filter((l) => selectedLeads.includes(l.id))
      : filteredLeads;

    const headers = ['Name', 'Email', 'Country', 'Degree Level', 'Holland Code', 'Match Score', 'Status', 'Consent Date'];
    const rows = leadsToExport.map((lead) => [
      lead.studentName,
      lead.studentEmail,
      lead.country,
      degreeLevelLabels[lead.degreeLevel] || lead.degreeLevel,
      lead.hollandCode,
      lead.matchScore,
      statusConfig[lead.status]?.label || lead.status,
      format(new Date(lead.consentDate), 'yyyy-MM-dd'),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getProgramName = (programId: string | null) => {
    if (!programId) return 'General Interest';
    return programs.find((p) => p.id === programId)?.name || 'Unknown Program';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = stats[key.toLowerCase() as keyof typeof stats] || 0;
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors"
              onClick={() => {
                setSelectedStatus(key);
                updateFilters('status', key);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{config.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  updateFilters('status', e.target.value);
                }}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  updateFilters('country', e.target.value);
                }}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export {selectedLeads.length > 0 ? `(${selectedLeads.length})` : 'All'}
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedLeads.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-indigo-700 font-medium">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLeads([])}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Degree
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Holland Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No leads found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm || selectedStatus !== 'all' || selectedCountry !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Leads will appear here when students match with your programs'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {lead.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.studentName}</p>
                          <p className="text-sm text-gray-500">{lead.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{lead.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {degreeLevelLabels[lead.degreeLevel] || lead.degreeLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                        {lead.hollandCode}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ width: `${lead.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{lead.matchScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          disabled={updatingStatus === lead.id}
                          className={`${statusConfig[lead.status]?.bgColor || 'bg-gray-100'} ${statusConfig[lead.status]?.color || 'text-gray-600'} px-3 py-1.5 rounded-full text-sm font-medium border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 appearance-none pr-8`}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                              {config.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm" title={format(new Date(lead.createdAt), 'PPP')}>
                          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={`mailto:${lead.studentEmail}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Showing {filteredLeads.length} of {stats.total} leads
          {selectedStatus !== 'all' && ` with status "${statusConfig[selectedStatus]?.label}"`}
          {selectedCountry !== 'all' && ` from ${selectedCountry}`}
        </p>
      </div>
    </div>
  );
}
