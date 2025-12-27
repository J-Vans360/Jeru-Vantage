'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, HelpCircle } from 'lucide-react';
import {
  CAREER_CATEGORIES,
  CAREER_CLUSTERS,
  getClustersByCategory,
  getClusterById,
  getCategoryById
} from '@/lib/constants/careerClusters';

interface CareerClusterSelectorProps {
  label: string;
  required?: boolean;
  value: string | null;        // Can be cluster ID or 'not_sure'
  customValue?: string | null; // For custom typed values
  onChange: (clusterId: string | null, customText?: string) => void;
  excludeIds?: string[];
}

export default function CareerClusterSelector({
  label,
  required = false,
  value,
  customValue,
  onChange,
  excludeIds = [],
}: CareerClusterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if value is a cluster ID or custom text
  const selectedCluster = value && value !== 'not_sure' && !customValue ? getClusterById(value) : null;
  const displayValue = customValue || selectedCluster?.name || (value === 'not_sure' ? 'Not sure yet' : '');

  // Filter clusters based on search
  const filteredClusters = searchText
    ? CAREER_CLUSTERS.filter(cluster =>
        cluster.name.toLowerCase().includes(searchText.toLowerCase()) ||
        cluster.examples.some(ex => ex.toLowerCase().includes(searchText.toLowerCase()))
      ).filter(c => !excludeIds.includes(c.id))
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (text: string) => {
    setSearchText(text);
    setIsOpen(true);
  };

  const handleClusterSelect = (clusterId: string) => {
    onChange(clusterId, undefined);
    setSearchText('');
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const handleNotSure = () => {
    onChange('not_sure', undefined);
    setSearchText('');
    setIsOpen(false);
  };

  const handleCustomEntry = () => {
    if (searchText.trim()) {
      onChange(null, searchText.trim());
      setSearchText('');
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null, undefined);
    setSearchText('');
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchText.trim()) {
      e.preventDefault();
      handleCustomEntry();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-base font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchText : displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Type your career interest or select from dropdown..."
          className={`
            w-full pl-10 pr-20 py-3 border-2 rounded-xl transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
            ${value === 'not_sure'
              ? 'border-amber-300 bg-amber-50'
              : (displayValue && !isOpen)
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200'
            }
          `}
        />

        {/* Right side buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(displayValue || value === 'not_sure') && !isOpen && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
                setSearchText('');
              } else {
                setIsOpen(true);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Show selected value indicator */}
      {!isOpen && value === 'not_sure' && (
        <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>We&apos;ll help you discover your ideal career path!</span>
        </div>
      )}
      {!isOpen && selectedCluster && (
        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
          <span>{selectedCluster.icon}</span>
          <span>{getCategoryById(selectedCluster.category)?.name}</span>
        </div>
      )}
      {!isOpen && customValue && !selectedCluster && value !== 'not_sure' && (
        <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm">
          <span>✏️</span>
          <span>Custom career interest</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-80 overflow-y-auto">

            {/* "Not Sure" Option - Always at top */}
            <button
              type="button"
              onClick={handleNotSure}
              className={`
                w-full px-4 py-3 flex items-center gap-3 text-left border-b border-gray-100
                hover:bg-amber-50 transition-colors
                ${value === 'not_sure' ? 'bg-amber-50' : ''}
              `}
            >
              <span className="text-xl">🤔</span>
              <div className="flex-1">
                <div className="font-medium text-amber-700">Not sure yet</div>
                <div className="text-xs text-amber-600">
                  I need help discovering my career interests
                </div>
              </div>
              {value === 'not_sure' && (
                <Check className="w-5 h-5 text-amber-600" />
              )}
            </button>

            {/* Search Results (if typing) */}
            {searchText && filteredClusters.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                  Matching Career Clusters
                </div>
                {filteredClusters.slice(0, 5).map((cluster) => (
                  <button
                    key={cluster.id}
                    type="button"
                    onClick={() => handleClusterSelect(cluster.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50"
                  >
                    <span className="text-lg">{cluster.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{cluster.name}</div>
                      <div className="text-xs text-gray-500">
                        e.g., {cluster.examples.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Custom Entry Option (if typing something not matching clusters) */}
            {searchText && searchText.length > 2 && (
              <button
                type="button"
                onClick={handleCustomEntry}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 border-b border-gray-100"
              >
                <span className="text-lg">✏️</span>
                <div className="flex-1">
                  <div className="font-medium text-blue-700">Use &quot;{searchText}&quot;</div>
                  <div className="text-xs text-blue-600">
                    Add as custom career interest
                  </div>
                </div>
              </button>
            )}

            {/* Browse by Category */}
            <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
              Browse Career Clusters
            </div>

            {CAREER_CATEGORIES.map((category) => {
              const clusters = getClustersByCategory(category.id);
              const isExpanded = selectedCategory === category.id;
              const availableClusters = clusters.filter(c => !excludeIds.includes(c.id));

              return (
                <div key={category.id}>
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category.id)}
                    className={`
                      w-full px-4 py-3 flex items-center justify-between text-left
                      hover:bg-gray-50 transition-colors
                      ${isExpanded ? 'bg-gray-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className="text-xs text-gray-400">
                        ({availableClusters.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Clusters under this category */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {availableClusters.length > 0 ? (
                        availableClusters.map((cluster) => (
                          <button
                            key={cluster.id}
                            type="button"
                            onClick={() => handleClusterSelect(cluster.id)}
                            className={`
                              w-full px-4 py-3 pl-12 flex items-center gap-3 text-left
                              hover:bg-blue-50 transition-colors
                              ${value === cluster.id ? 'bg-blue-50' : ''}
                            `}
                          >
                            <span className="text-lg">{cluster.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{cluster.name}</div>
                              <div className="text-xs text-gray-500">
                                e.g., {cluster.examples.slice(0, 3).join(', ')}
                              </div>
                            </div>
                            {value === cluster.id && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 pl-12 text-sm text-gray-400">
                          All options already selected
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
