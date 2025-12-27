'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  GraduationCap,
  Edit2,
  Trash2,
  DollarSign,
  Users,
  ChevronDown,
  ChevronRight,
  BookOpen,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Program {
  id: string;
  name: string;
  faculty: string;
  degree: string;
  duration: number;
  tuitionAnnual: number;
  hollandCodes: string[];
  keywords: string[];
  isActive: boolean;
  matchCount?: number;
}

interface ProgramsManagerProps {
  universityId: string;
  programs: Program[];
  faculties: string[];
}

const HOLLAND_OPTIONS = [
  {
    code: 'R',
    name: 'Realistic',
    color: 'bg-red-100 text-red-700',
    description: 'Hands-on, practical',
  },
  {
    code: 'I',
    name: 'Investigative',
    color: 'bg-blue-100 text-blue-700',
    description: 'Analytical, intellectual',
  },
  {
    code: 'A',
    name: 'Artistic',
    color: 'bg-purple-100 text-purple-700',
    description: 'Creative, expressive',
  },
  {
    code: 'S',
    name: 'Social',
    color: 'bg-green-100 text-green-700',
    description: 'Helping, teaching',
  },
  {
    code: 'E',
    name: 'Enterprising',
    color: 'bg-orange-100 text-orange-700',
    description: 'Leading, persuading',
  },
  {
    code: 'C',
    name: 'Conventional',
    color: 'bg-gray-100 text-gray-700',
    description: 'Organizing, detail-oriented',
  },
];

const DEGREE_OPTIONS = [
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'BACHELORS', label: "Bachelor's Degree" },
  { value: 'MASTERS', label: "Master's Degree" },
  { value: 'PHD', label: 'PhD / Doctorate' },
];

const SUGGESTED_KEYWORDS = [
  'AI',
  'Machine Learning',
  'Data Science',
  'Software Engineering',
  'Cybersecurity',
  'Business',
  'Finance',
  'Marketing',
  'Entrepreneurship',
  'Management',
  'Medicine',
  'Nursing',
  'Public Health',
  'Psychology',
  'Biology',
  'Engineering',
  'Robotics',
  'Mechanical',
  'Electrical',
  'Civil',
  'Design',
  'Architecture',
  'Art',
  'Music',
  'Film',
  'Law',
  'International Relations',
  'Political Science',
  'Economics',
  'Education',
  'Teaching',
  'STEM',
  'Research',
  'Innovation',
];

export default function ProgramsManager({
  universityId,
  programs,
  faculties,
}: ProgramsManagerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaculties, setExpandedFaculties] = useState<Set<string>>(new Set(faculties));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);

  // Filter programs
  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by faculty
  const programsByFaculty = filteredPrograms.reduce(
    (acc, program) => {
      if (!acc[program.faculty]) acc[program.faculty] = [];
      acc[program.faculty].push(program);
      return acc;
    },
    {} as Record<string, Program[]>
  );

  const toggleFaculty = (faculty: string) => {
    const newExpanded = new Set(expandedFaculties);
    if (newExpanded.has(faculty)) {
      newExpanded.delete(faculty);
    } else {
      newExpanded.add(faculty);
    }
    setExpandedFaculties(newExpanded);
  };

  const handleDelete = async (programId: string) => {
    try {
      await fetch(`/api/university/${universityId}/programs/${programId}`, {
        method: 'DELETE',
      });
      router.refresh();
      setDeletingProgram(null);
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600 mt-1">Manage your academic programs and matching criteria</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Programs"
          value={programs.length}
          icon={<GraduationCap className="w-5 h-5" />}
        />
        <StatCard
          label="Active Programs"
          value={programs.filter((p) => p.isActive).length}
          icon={<Check className="w-5 h-5" />}
        />
        <StatCard
          label="Faculties"
          value={faculties.length}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatCard
          label="Total Matches"
          value={programs.reduce((sum, p) => sum + (p.matchCount || 0), 0)}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search programs by name, faculty, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Programs List by Faculty */}
      <div className="space-y-4">
        {Object.entries(programsByFaculty).map(([faculty, facultyPrograms]) => (
          <div
            key={faculty}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Faculty Header */}
            <button
              onClick={() => toggleFaculty(faculty)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedFaculties.has(faculty) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-semibold text-gray-900">{faculty}</span>
                <span className="text-sm text-gray-500">
                  ({facultyPrograms.length} program{facultyPrograms.length !== 1 ? 's' : ''})
                </span>
              </div>
            </button>

            {/* Programs */}
            {expandedFaculties.has(faculty) && (
              <div className="divide-y divide-gray-100">
                {facultyPrograms.map((program) => (
                  <div key={program.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{program.name}</h3>
                          {!program.isActive && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {DEGREE_OPTIONS.find((d) => d.value === program.degree)?.label}
                          </span>
                          <span>-</span>
                          <span>
                            {program.duration} year{program.duration !== 1 ? 's' : ''}
                          </span>
                          <span>-</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />$
                            {program.tuitionAnnual.toLocaleString()}/year
                          </span>
                          <span>-</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {program.matchCount || 0} matches
                          </span>
                        </div>

                        {/* Holland Codes */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {program.hollandCodes.map((code) => {
                            const holland = HOLLAND_OPTIONS.find((h) => h.code === code);
                            return (
                              <span
                                key={code}
                                className={`px-2 py-1 rounded text-xs font-medium ${holland?.color || 'bg-gray-100 text-gray-700'}`}
                              >
                                {code} - {holland?.name}
                              </span>
                            );
                          })}
                          {program.hollandCodes.length === 0 && (
                            <span className="text-xs text-amber-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              No Holland codes set
                            </span>
                          )}
                        </div>

                        {/* Keywords */}
                        {program.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {program.keywords.slice(0, 5).map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                              >
                                {keyword}
                              </span>
                            ))}
                            {program.keywords.length > 5 && (
                              <span className="text-xs text-gray-400">
                                +{program.keywords.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProgram(program)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProgram(program)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredPrograms.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No programs found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Add your first program to start matching students'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Program
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingProgram) && (
        <ProgramModal
          universityId={universityId}
          program={editingProgram}
          faculties={faculties}
          onClose={() => {
            setShowAddModal(false);
            setEditingProgram(null);
          }}
          onSave={() => {
            router.refresh();
            setShowAddModal(false);
            setEditingProgram(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingProgram && (
        <DeleteConfirmModal
          programName={deletingProgram.name}
          onCancel={() => setDeletingProgram(null)}
          onConfirm={() => handleDelete(deletingProgram.id)}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Program Modal Component
function ProgramModal({
  universityId,
  program,
  faculties,
  onClose,
  onSave,
}: {
  universityId: string;
  program: Program | null;
  faculties: string[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: program?.name || '',
    faculty: program?.faculty || '',
    newFaculty: '',
    degree: program?.degree || 'BACHELORS',
    duration: program?.duration || 4,
    tuitionAnnual: program?.tuitionAnnual || 0,
    hollandCodes: program?.hollandCodes || [],
    keywords: program?.keywords || [],
    newKeyword: '',
    isActive: program?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const faculty = form.newFaculty || form.faculty;

    try {
      const url = program
        ? `/api/university/${universityId}/programs/${program.id}`
        : `/api/university/${universityId}/programs`;

      await fetch(url, {
        method: program ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          faculty,
          degree: form.degree,
          duration: form.duration,
          tuitionAnnual: form.tuitionAnnual,
          hollandCodes: form.hollandCodes,
          keywords: form.keywords,
          isActive: form.isActive,
        }),
      });

      onSave();
    } catch (error) {
      console.error('Failed to save program:', error);
    }
    setSaving(false);
  };

  const toggleHollandCode = (code: string) => {
    setForm((prev) => ({
      ...prev,
      hollandCodes: prev.hollandCodes.includes(code)
        ? prev.hollandCodes.filter((c) => c !== code)
        : [...prev.hollandCodes, code],
    }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !form.keywords.includes(keyword)) {
      setForm((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
        newKeyword: '',
      }));
    }
  };

  const removeKeyword = (keyword: string) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {program ? 'Edit Program' : 'Add New Program'}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., BSc Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                {faculties.length > 0 ? (
                  <select
                    value={form.faculty}
                    onChange={(e) => setForm((prev) => ({ ...prev, faculty: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select or add new...</option>
                    {faculties.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                ) : null}
                <input
                  type="text"
                  value={form.newFaculty}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, newFaculty: e.target.value, faculty: '' }))
                  }
                  placeholder={
                    faculties.length > 0 ? 'Or enter new faculty name' : 'Enter faculty name'
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree Level *
                </label>
                <select
                  value={form.degree}
                  onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DEGREE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (years) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="8"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, duration: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Tuition (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.tuitionAnnual}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tuitionAnnual: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Holland Codes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holland Codes (RIASEC) *
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select the personality types that best match this program. This helps match
                students with compatible interests.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {HOLLAND_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => toggleHollandCode(option.code)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.hollandCodes.includes(option.code)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${option.color}`}>
                        {option.code}
                      </span>
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <p className="text-sm text-gray-500 mb-3">
                Add keywords to help match students interested in specific topics.
              </p>

              {/* Current Keywords */}
              <div className="flex flex-wrap gap-2 mb-3">
                {form.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Keyword */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={form.newKeyword}
                  onChange={(e) => setForm((prev) => ({ ...prev, newKeyword: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword(form.newKeyword);
                    }
                  }}
                  placeholder="Type and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addKeyword(form.newKeyword)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>

              {/* Suggested Keywords */}
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_KEYWORDS.filter((k) => !form.keywords.includes(k))
                  .slice(0, 12)
                  .map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => addKeyword(keyword)}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                    >
                      + {keyword}
                    </button>
                  ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Program is active and accepting applications
              </label>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                !form.name ||
                (!form.faculty && !form.newFaculty) ||
                form.hollandCodes.length === 0
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : program ? 'Save Changes' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  programName,
  onCancel,
  onConfirm,
}: {
  programName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Program</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{programName}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
