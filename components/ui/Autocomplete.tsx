'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface AutocompleteProps {
  suggestions: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  name?: string
  required?: boolean
  label?: string
}

export default function Autocomplete({
  suggestions,
  value,
  onChange,
  placeholder,
  className = '',
  name,
  required,
  label
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && value.length > 0) {
      const matches = suggestions.filter(s =>
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8)
      setFiltered(matches)
    } else {
      setFiltered(suggestions.slice(0, 8))
    }
  }, [value, suggestions])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-base font-semibold text-gray-800 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(item)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-700 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Common suggestion lists for reuse - sorted alphabetically
export const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium',
  'Bhutan', 'Brazil', 'Cambodia', 'Canada', 'Chile', 'China', 'Colombia',
  'Czech Republic', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany',
  'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Ireland',
  'Israel', 'Italy', 'Japan', 'Kenya', 'Kuwait', 'Laos', 'Malaysia',
  'Mexico', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan',
  'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States', 'Vietnam',
  'Other'
]

export const CAREER_INTERESTS = [
  'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Machine Learning',
  'Cybersecurity', 'Cloud Computing', 'Web Development', 'Mobile App Development',
  'Medicine', 'Nursing', 'Pharmacy', 'Dentistry', 'Public Health', 'Veterinary Science',
  'Business Administration', 'Finance', 'Marketing', 'Entrepreneurship', 'Consulting',
  'Accounting', 'Human Resources', 'Supply Chain Management', 'Investment Banking',
  'Law', 'International Relations', 'Public Policy', 'Journalism', 'Communications',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering',
  'Aerospace Engineering', 'Biomedical Engineering', 'Environmental Engineering',
  'Architecture', 'Interior Design', 'Graphic Design', 'Animation', 'UI/UX Design',
  'Psychology', 'Sociology', 'Economics', 'Political Science', 'Anthropology',
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Environmental Science',
  'Education', 'Teaching', 'Counseling', 'Special Education', 'Educational Technology',
  'Music', 'Film', 'Theater', 'Fine Arts', 'Photography', 'Creative Writing',
  'Hospitality', 'Tourism', 'Culinary Arts', 'Event Management', 'Hotel Management',
  'Sports Management', 'Physical Therapy', 'Nutrition', 'Fitness', 'Athletic Training',
  'Aviation', 'Maritime', 'Logistics', 'Real Estate', 'Fashion Design'
]

export const SUBJECTS = [
  'Mathematics', 'Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry',
  'Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Earth Science',
  'English', 'English Literature', 'English Language', 'Creative Writing',
  'History', 'World History', 'US History', 'European History', 'Ancient History',
  'Geography', 'Economics', 'Business Studies', 'Accounting', 'Commerce',
  'Computer Science', 'Information Technology', 'Programming',
  'Psychology', 'Sociology', 'Political Science', 'Philosophy',
  'Art', 'Music', 'Drama', 'Theater', 'Physical Education', 'Health', 'Health Science',
  'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi',
  'Thai', 'Vietnamese', 'Khmer', 'Tamil',
  'AP Calculus AB', 'AP Calculus BC', 'AP Physics', 'AP Chemistry', 'AP Biology',
  'AP English Literature', 'AP English Language', 'AP Computer Science',
  'AP World History', 'AP US History',
  'IB Mathematics', 'IB Physics', 'IB Chemistry', 'IB Biology', 'IB English',
  'IB Economics', 'IB Psychology',
  'Nursing', 'Engineering Drawing', 'Design Technology'
]
