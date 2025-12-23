'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveStudentProfile } from '@/actions/profile-actions';
import type { StudentProfileFormData, StudentSubjectData } from '@/types/profile-types';
import { SECTION_NAMES } from '@/types/profile-types';

// You'll need to create a user context/hook to get the current user ID
// For now, I'll use a placeholder
// import { useUser } from '@/hooks/use-user';

type ProfileFormProps = {
  userId: string; // Pass this from parent component
  initialData?: Partial<StudentProfileFormData>;
};

export default function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<StudentProfileFormData>>({
    subjects: [
      {
        subjectCategory: '',
        courseName: '',
        difficultyLevel: '',
        latestGrade: '',
        interestLevel: 0,
        displayOrder: 0,
      },
    ],
    nativeEnglish: false,
    testOptional: false,
    learningSupport: false,
    ...initialData,
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Subject management
  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [
        ...(prev.subjects || []),
        {
          subjectCategory: '',
          courseName: '',
          difficultyLevel: '',
          latestGrade: '',
          interestLevel: 0,
          displayOrder: (prev.subjects?.length || 0),
        },
      ],
    }));
  };

  const removeSubject = (index: number) => {
    if ((formData.subjects?.length || 0) <= 1) {
      alert('You must have at least one subject.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index),
    }));
  };

  const updateSubject = (index: number, field: keyof StudentSubjectData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects?.map((subject, i) =>
        i === index ? { ...subject, [field]: value } : subject
      ),
    }));
  };

  // Navigation
  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentSection((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  // Validation
  const validateSection = (section: number): boolean => {
    switch (section) {
      case 0: // Demographics
        if (!formData.studentName || !formData.currentGrade || !formData.targetEntryYear ||
            !formData.citizenshipPrimary || !formData.countryResidence) {
          setError('Please fill in all required fields.');
          return false;
        }
        break;
      case 1: // Financial
        if (!formData.annualBudgetRange || !formData.needBasedAid || !formData.usApplicantStatus) {
          setError('Please fill in all required fields.');
          return false;
        }
        break;
      case 2: // Educational
        if (!formData.primaryCurriculum) {
          setError('Please select your curriculum.');
          return false;
        }
        if (formData.primaryCurriculum === 'other' && !formData.curriculumOther) {
          setError('Please specify your curriculum.');
          return false;
        }
        break;
      case 3: // Academic Data
        if (!formData.subjects || formData.subjects.length === 0) {
          setError('Please add at least one subject.');
          return false;
        }
        break;
      case 5: // Learning Context
        if (!formData.disciplinaryRecord) {
          setError('Please fill in all required fields.');
          return false;
        }
        break;
      case 6: // Aspirations
        if (!formData.careerInterest1 || !formData.destinationCountry1) {
          setError('Please fill in all required fields.');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateSection(currentSection)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await saveStudentProfile(userId, formData as StudentProfileFormData);

      if (result.success) {
        // Redirect to assessment or dashboard
        router.push('/assessment/part-a');
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress calculation
  const progress = ((currentSection + 1) / SECTION_NAMES.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">📋 Student Profile</h1>
          <p className="text-gray-600 mb-6">Section 0: Building Your Comprehensive Profile</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Section {currentSection + 1} of {SECTION_NAMES.length}: {SECTION_NAMES[currentSection]}
          </p>
        </div>

        {/* Form Content */}
        <div className="bg-white p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Section 0: Demographics */}
          {currentSection === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                A. Demographics & Residency
              </h2>
              <p className="text-gray-600 italic">
                These factors determine your fee status, visa rules, and eligible universities.
              </p>

              <div>
                <label className="block font-semibold mb-2">Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName || ''}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Current Grade/Year *</label>
                  <input
                    type="text"
                    name="currentGrade"
                    value={formData.currentGrade || ''}
                    onChange={handleChange}
                    placeholder="e.g., Grade 11 / Year 12"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Target University Entry Year *</label>
                  <input
                    type="text"
                    name="targetEntryYear"
                    value={formData.targetEntryYear || ''}
                    onChange={handleChange}
                    placeholder="e.g., Fall 2026"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Country of Citizenship (Passport) *</label>
                <input
                  type="text"
                  name="citizenshipPrimary"
                  value={formData.citizenshipPrimary || ''}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Second Citizenship (if applicable)</label>
                <input
                  type="text"
                  name="citizenshipSecondary"
                  value={formData.citizenshipSecondary || ''}
                  onChange={handleChange}
                  placeholder="Leave blank if not applicable"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Country of Current Residence *</label>
                <input
                  type="text"
                  name="countryResidence"
                  value={formData.countryResidence || ''}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Section 1: Financial */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                B. Financial Reality Check
              </h2>
              <p className="text-gray-600 italic">
                This information is private and helps filter universities that fit your budget.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-900">
                  <strong>Privacy Note:</strong> This information is kept confidential and used only to recommend suitable universities.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-3">
                  What is your family's approximate maximum annual budget for Tuition + Living Expenses? *
                </label>
                <div className="space-y-2">
                  {[
                    { value: '0-15000', label: '$0 - $15,000 (Full Scholarship / Financial Aid Required)' },
                    { value: '15000-30000', label: '$15,000 - $30,000 (Significant Aid Required)' },
                    { value: '30000-50000', label: '$30,000 - $50,000 (Partial Aid / Standard Budget)' },
                    { value: '50000-75000', label: '$50,000 - $75,000 (Access to most Private Universities)' },
                    { value: '75000+', label: '$75,000+ (Budget is not a major constraint)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.annualBudgetRange === option.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="annualBudgetRange"
                        value={option.value}
                        checked={formData.annualBudgetRange === option.value}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">
                  Do you plan to apply for "Need-Based" Financial Aid? *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'required', label: 'Yes, I absolutely require Need-Based Aid to attend' },
                    { value: 'maybe', label: 'Maybe, if available, but it is not mandatory' },
                    { value: 'no', label: 'No, I will be fully self-funded' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.needBasedAid === option.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="needBasedAid"
                        value={option.value}
                        checked={formData.needBasedAid === option.value}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3">US Specific Context *</label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'us-citizen',
                      label: 'I am a US Citizen or Green Card Holder (Eligible for FAFSA/Federal Aid)',
                    },
                    {
                      value: 'international',
                      label: 'I am an International Applicant (Not eligible for US Federal Aid)',
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.usApplicantStatus === option.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="usApplicantStatus"
                        value={option.value}
                        checked={formData.usApplicantStatus === option.value}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Continue with other sections... This is getting long, so I'll create separate component files */}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
            {currentSection > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                ← Back
              </button>
            )}
            
            {currentSection < SECTION_NAMES.length - 1 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
