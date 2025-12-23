'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveStudentProfile } from '@/actions/profile-actions';
import type { StudentProfileFormData, StudentSubjectData } from '@/types/profile-types';
import { SECTION_NAMES } from '@/types/profile-types';

type ProfileFormProps = {
  userId: string;
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
      {
        subjectCategory: '',
        courseName: '',
        difficultyLevel: '',
        latestGrade: '',
        interestLevel: 0,
        displayOrder: 1,
      },
      {
        subjectCategory: '',
        courseName: '',
        difficultyLevel: '',
        latestGrade: '',
        interestLevel: 0,
        displayOrder: 2,
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

  const updateSubject = (index: number, field: keyof StudentSubjectData, value: string | number) => {
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
        const hasValidSubject = formData.subjects.some(s => 
          s.subjectCategory && s.courseName && s.difficultyLevel && s.latestGrade
        );
        if (!hasValidSubject) {
          setError('Please complete at least one subject with all required fields.');
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
        router.push('/dashboard');
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
                  <select
                    name="currentGrade"
                    value={formData.currentGrade || ''}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    required
                  >
                    <option value="">-- Select Grade --</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Gap Year">Gap Year</option>
                  </select>
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
                  What is your family&apos;s approximate maximum annual budget for Tuition + Living Expenses? *
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
                  Do you plan to apply for &quot;Need-Based&quot; Financial Aid? *
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

          {/* Section 2: Educational System */}
          {currentSection === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                C. Educational System Context
              </h2>
              <p className="text-gray-600 italic">
                Help us understand your current educational background.
              </p>

              <div>
                <label className="block font-semibold mb-2">Primary Educational Curriculum *</label>
                <select
                  name="primaryCurriculum"
                  value={formData.primaryCurriculum || ''}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                >
                  <option value="">-- Select Curriculum --</option>
                  <option value="ib-diploma">IB Diploma (IBDP)</option>
                  <option value="british">British Pattern (A-Levels / IGCSE)</option>
                  <option value="american">American Curriculum (AP / High School Diploma)</option>
                  <option value="indian">Indian Curriculum (CBSE / ICSE)</option>
                  <option value="other">National Curriculum (Other)</option>
                </select>
              </div>

              {formData.primaryCurriculum === 'other' && (
                <div>
                  <label className="block font-semibold mb-2">Please specify your curriculum *</label>
                  <input
                    type="text"
                    name="curriculumOther"
                    value={formData.curriculumOther || ''}
                    onChange={handleChange}
                    placeholder="e.g., French Baccalaureate, German Abitur"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Section 3: Academic Data */}
          {currentSection === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                D. Academic Data
              </h2>
              <p className="text-gray-600 italic">
                List all your current subjects with performance and interest levels.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-900">
                  <strong>Instructions:</strong> Add each subject you&apos;re taking. Be specific about the level and rate your interest honestly.
                </p>
              </div>

              {/* Table Layout for Desktop */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="hidden md:grid md:grid-cols-[2fr_2.5fr_2fr_1.5fr_1.5fr_0.5fr] gap-3 mb-3 px-3 py-2 bg-purple-100 rounded-lg font-semibold text-gray-700 text-sm">
                    <div>Category</div>
                    <div>Course</div>
                    <div>Level</div>
                    <div>Grade</div>
                    <div>Interest</div>
                    <div></div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {formData.subjects?.map((subject, index) => (
                      <div key={index}>
                        {/* Desktop: Single Row Layout */}
                        <div className="hidden md:grid md:grid-cols-[2fr_2.5fr_2fr_1.5fr_1.5fr_0.5fr] gap-3 items-center p-3 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                          {/* Category */}
                          <select
                            value={subject.subjectCategory}
                            onChange={(e) => updateSubject(index, 'subjectCategory', e.target.value)}
                            className="h-9 p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="Languages">Languages</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Arts">Arts</option>
                            <option value="Technology">Technology</option>
                            <option value="Other">Other</option>
                          </select>

                          {/* Course Name */}
                          <input
                            type="text"
                            value={subject.courseName}
                            onChange={(e) => updateSubject(index, 'courseName', e.target.value)}
                            placeholder="e.g., Physics"
                            className="h-9 p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                          />

                          {/* Difficulty Level */}
                          <select
                            value={subject.difficultyLevel}
                            onChange={(e) => updateSubject(index, 'difficultyLevel', e.target.value)}
                            className="h-9 p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="IB HL">IB HL</option>
                            <option value="IB SL">IB SL</option>
                            <option value="AP">AP</option>
                            <option value="Honors">Honors</option>
                            <option value="Regular">Regular</option>
                            <option value="A-Level">A-Level</option>
                            <option value="AS-Level">AS-Level</option>
                          </select>

                          {/* Latest Grade */}
                          <input
                            type="text"
                            value={subject.latestGrade}
                            onChange={(e) => updateSubject(index, 'latestGrade', e.target.value)}
                            placeholder="A, 95%"
                            className="h-9 p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                          />

                          {/* Interest Level */}
                          <div className="flex gap-1 justify-center items-center h-9 px-1 border border-gray-300 rounded bg-gray-50">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateSubject(index, 'interestLevel', star)}
                                className="text-base transition-all hover:scale-125"
                              >
                                {star <= subject.interestLevel ? '⭐' : '☆'}
                              </button>
                            ))}
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeSubject(index)}
                            className="text-red-600 hover:text-red-800 text-xl font-bold h-9"
                            title="Remove subject"
                          >
                            ×
                          </button>
                        </div>

                        {/* Mobile: Stacked Layout */}
                        <div className="md:hidden p-4 border-2 border-gray-200 rounded-lg bg-white space-y-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-700">Subject {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeSubject(index)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Category</label>
                            <select
                              value={subject.subjectCategory}
                              onChange={(e) => updateSubject(index, 'subjectCategory', e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                            >
                              <option value="">Select...</option>
                              <option value="Mathematics">Mathematics</option>
                              <option value="Science">Science</option>
                              <option value="English">English</option>
                              <option value="Languages">Languages</option>
                              <option value="Social Studies">Social Studies</option>
                              <option value="Arts">Arts</option>
                              <option value="Technology">Technology</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Course</label>
                            <input
                              type="text"
                              value={subject.courseName}
                              onChange={(e) => updateSubject(index, 'courseName', e.target.value)}
                              placeholder="e.g., Physics"
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">Level</label>
                              <select
                                value={subject.difficultyLevel}
                                onChange={(e) => updateSubject(index, 'difficultyLevel', e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                              >
                                <option value="">Select...</option>
                                <option value="IB HL">IB HL</option>
                                <option value="IB SL">IB SL</option>
                                <option value="AP">AP</option>
                                <option value="Honors">Honors</option>
                                <option value="Regular">Regular</option>
                                <option value="A-Level">A-Level</option>
                                <option value="AS-Level">AS-Level</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">Grade</label>
                              <input
                                type="text"
                                value={subject.latestGrade}
                                onChange={(e) => updateSubject(index, 'latestGrade', e.target.value)}
                                placeholder="A, 95%"
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:border-purple-600 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Interest Level</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => updateSubject(index, 'interestLevel', star)}
                                  className="text-2xl transition-all hover:scale-110"
                                >
                                  {star <= subject.interestLevel ? '⭐' : '☆'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={addSubject}
                className="w-full py-3 border-2 border-dashed border-purple-400 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              >
                + Add Another Subject
              </button>
            </div>
          )}

          {/* Section 4: Standardized Testing */}
          {currentSection === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                E. Standardized Testing
              </h2>
              <p className="text-gray-600 italic">
                Fill in scores you have. Leave blank if not taken.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">English Proficiency</h3>

              <div className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  name="nativeEnglish"
                  checked={formData.nativeEnglish || false}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="font-medium">Native English Speaker (Not Required)</label>
              </div>

              {!formData.nativeEnglish && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">IELTS</label>
                    <input
                      type="number"
                      name="ieltsScore"
                      value={formData.ieltsScore || ''}
                      onChange={handleChange}
                      step="0.5"
                      min="0"
                      max="9"
                      placeholder="e.g., 7.5"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">TOEFL</label>
                    <input
                      type="number"
                      name="toeflScore"
                      value={formData.toeflScore || ''}
                      onChange={handleChange}
                      min="0"
                      max="120"
                      placeholder="e.g., 100"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Duolingo</label>
                    <input
                      type="number"
                      name="duolingoScore"
                      value={formData.duolingoScore || ''}
                      onChange={handleChange}
                      min="0"
                      max="160"
                      placeholder="e.g., 125"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Entrance Exams</h3>

              <div>
                <label className="block font-semibold mb-2">SAT Scores</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Total</label>
                    <input
                      type="number"
                      name="satTotal"
                      value={formData.satTotal || ''}
                      onChange={handleChange}
                      min="400"
                      max="1600"
                      placeholder="Total"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Math</label>
                    <input
                      type="number"
                      name="satMath"
                      value={formData.satMath || ''}
                      onChange={handleChange}
                      min="200"
                      max="800"
                      placeholder="Math"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Reading/Writing</label>
                    <input
                      type="number"
                      name="satReadingWriting"
                      value={formData.satReadingWriting || ''}
                      onChange={handleChange}
                      min="200"
                      max="800"
                      placeholder="R/W"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">ACT Composite</label>
                  <input
                    type="number"
                    name="actComposite"
                    value={formData.actComposite || ''}
                    onChange={handleChange}
                    min="1"
                    max="36"
                    placeholder="e.g., 32"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">UCAT / BMAT (Medical)</label>
                  <input
                    type="text"
                    name="ucatBmatScore"
                    value={formData.ucatBmatScore || ''}
                    onChange={handleChange}
                    placeholder="Enter score"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Plan to take test in future (Date)</label>
                <input
                  type="text"
                  name="testPlanDate"
                  value={formData.testPlanDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., March 2026"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                <input
                  type="checkbox"
                  name="testOptional"
                  checked={formData.testOptional || false}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="font-medium">Will Apply &quot;Test Optional&quot;</label>
              </div>
            </div>
          )}

          {/* Section 5: Learning & Disciplinary Context */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                F. Learning & Disciplinary Context
              </h2>
              <p className="text-gray-600 italic">
                Help us understand any additional support needs or context.
              </p>

              <div>
                <label className="block font-semibold mb-3">Learning Support</label>
                <div className="space-y-2">
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.learningSupport === false
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}>
                    <input
                      type="radio"
                      name="learningSupport"
                      checked={formData.learningSupport === false}
                      onChange={() => setFormData(prev => ({ ...prev, learningSupport: false }))}
                      className="mr-3 w-5 h-5"
                    />
                    <span>No learning support needed</span>
                  </label>
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.learningSupport === true
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}>
                    <input
                      type="radio"
                      name="learningSupport"
                      checked={formData.learningSupport === true}
                      onChange={() => setFormData(prev => ({ ...prev, learningSupport: true }))}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Yes (I have a diagnosed learning difference like ADHD/Dyslexia and may need support)</span>
                  </label>
                </div>
              </div>

              {formData.learningSupport && (
                <div>
                  <label className="block font-semibold mb-2">Please provide details (optional)</label>
                  <textarea
                    name="learningSupportDetails"
                    value={formData.learningSupportDetails || ''}
                    onChange={handleChange}
                    placeholder="Brief description of your learning support needs..."
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-3">Disciplinary Record *</label>
                <div className="space-y-2">
                  {[
                    { value: 'clean', label: 'Clean Record' },
                    { value: 'infraction', label: 'I have a suspension or major disciplinary infraction on my school record' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.disciplinaryRecord === option.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="disciplinaryRecord"
                        value={option.value}
                        checked={formData.disciplinaryRecord === option.value}
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

          {/* Section 6: Student Aspirations */}
          {currentSection === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-600 pb-2">
                G. Student Aspirations
              </h2>
              <p className="text-gray-600 italic">
                Tell us what you&apos;re currently thinking - we&apos;ll see how it aligns with your profile.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-900">
                  <strong>Note:</strong> If you&apos;re unsure, just list general fields like &quot;Business,&quot; &quot;Healthcare,&quot; or &quot;Engineering.&quot;
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-700">Your Top 3 Career Interests</h3>

              <div>
                <label className="block font-semibold mb-2">Career Interest #1 *</label>
                <input
                  type="text"
                  name="careerInterest1"
                  value={formData.careerInterest1 || ''}
                  onChange={handleChange}
                  placeholder="e.g., Medicine, Computer Science, Business"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Career Interest #2</label>
                <input
                  type="text"
                  name="careerInterest2"
                  value={formData.careerInterest2 || ''}
                  onChange={handleChange}
                  placeholder="Alternative career path"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Career Interest #3</label>
                <input
                  type="text"
                  name="careerInterest3"
                  value={formData.careerInterest3 || ''}
                  onChange={handleChange}
                  placeholder="Another option you're considering"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mt-8">Your Destination Wishlist</h3>

              <div>
                <label className="block font-semibold mb-2">Primary Country *</label>
                <input
                  type="text"
                  name="destinationCountry1"
                  value={formData.destinationCountry1 || ''}
                  onChange={handleChange}
                  placeholder="e.g., United States, United Kingdom"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Specific Universities (optional)</label>
                <textarea
                  name="destinationUniversities1"
                  value={formData.destinationUniversities1 || ''}
                  onChange={handleChange}
                  placeholder="List any universities you're already interested in..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Alternative Country 1</label>
                <input
                  type="text"
                  name="destinationCountry2"
                  value={formData.destinationCountry2 || ''}
                  onChange={handleChange}
                  placeholder="Second choice country"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Specific Universities (optional)</label>
                <textarea
                  name="destinationUniversities2"
                  value={formData.destinationUniversities2 || ''}
                  onChange={handleChange}
                  placeholder="List any universities..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Alternative Country 2</label>
                <input
                  type="text"
                  name="destinationCountry3"
                  value={formData.destinationCountry3 || ''}
                  onChange={handleChange}
                  placeholder="Third choice country"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Specific Universities (optional)</label>
                <textarea
                  name="destinationUniversities3"
                  value={formData.destinationUniversities3 || ''}
                  onChange={handleChange}
                  placeholder="List any universities..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-b-2xl p-8 border-t-2 border-gray-200">
          <div className="flex justify-between gap-4">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                ← Back
              </button>
            )}

            {currentSection < SECTION_NAMES.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : '✓ Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}