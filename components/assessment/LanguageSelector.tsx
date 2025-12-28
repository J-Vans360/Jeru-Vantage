// /components/assessment/LanguageSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Clock, Check, Search, X } from 'lucide-react';
import {
  getActiveLanguages,
  getComingSoonLanguages,
  getLanguageByCode,
  getDefaultLanguage,
  type LanguageOption,
} from '@/lib/constants/languages';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  variant?: 'default' | 'compact' | 'full';
  showSearch?: boolean;
  className?: string;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  variant = 'default',
  showSearch = false,
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const current = getLanguageByCode(currentLanguage) || getDefaultLanguage();
  const activeLanguages = getActiveLanguages();
  const comingSoonLanguages = getComingSoonLanguages();

  // Filter languages based on search query
  const filteredComingSoon = searchQuery
    ? comingSoonLanguages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : comingSoonLanguages;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleSelectLanguage = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Compact variant (just icon + flag)
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Select language"
        >
          <span className="text-lg">{current.flag}</span>
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <DropdownMenu
            activeLanguages={activeLanguages}
            comingSoonLanguages={filteredComingSoon}
            currentLanguage={currentLanguage}
            onSelect={handleSelectLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={showSearch}
            searchInputRef={searchInputRef}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    );
  }

  // Full variant (larger display)
  if (variant === 'full') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-between gap-3 w-full px-4 py-3 bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700 rounded-xl
                     hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                {current.flag} {current.nativeName}
              </div>
              <div className="text-xs text-gray-500">{current.name}</div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <DropdownMenu
            activeLanguages={activeLanguages}
            comingSoonLanguages={filteredComingSoon}
            currentLanguage={currentLanguage}
            onSelect={handleSelectLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={showSearch}
            searchInputRef={searchInputRef}
            onKeyDown={handleKeyDown}
            position="full-width"
          />
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700 rounded-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {current.flag} {current.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <DropdownMenu
          activeLanguages={activeLanguages}
          comingSoonLanguages={filteredComingSoon}
          currentLanguage={currentLanguage}
          onSelect={handleSelectLanguage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={showSearch}
          searchInputRef={searchInputRef}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}

// ========== DROPDOWN MENU COMPONENT ==========

interface DropdownMenuProps {
  activeLanguages: LanguageOption[];
  comingSoonLanguages: LanguageOption[];
  currentLanguage: string;
  onSelect: (code: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSearch: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onKeyDown: (event: React.KeyboardEvent) => void;
  position?: 'default' | 'full-width';
}

function DropdownMenu({
  activeLanguages,
  comingSoonLanguages,
  currentLanguage,
  onSelect,
  searchQuery,
  onSearchChange,
  showSearch,
  searchInputRef,
  onKeyDown,
  position = 'default',
}: DropdownMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" />

      {/* Menu */}
      <div
        className={`absolute mt-2 bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700 rounded-xl
                    shadow-xl z-50 overflow-hidden
                    ${position === 'full-width' ? 'left-0 right-0' : 'right-0 w-80'}`}
        onKeyDown={onKeyDown}
      >
        {/* Search (optional) */}
        {showSearch && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-900
                           border border-gray-200 dark:border-gray-700 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           text-gray-900 dark:text-white placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Available Languages Section */}
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Available
          </div>
          {activeLanguages.map((lang) => (
            <LanguageItem
              key={lang.code}
              language={lang}
              isSelected={currentLanguage === lang.code}
              onSelect={onSelect}
              isDisabled={false}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Coming Soon Languages Section */}
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Coming Soon ({comingSoonLanguages.length})
          </div>

          {comingSoonLanguages.length > 0 ? (
            comingSoonLanguages.map((lang) => (
              <LanguageItem
                key={lang.code}
                language={lang}
                isSelected={false}
                onSelect={onSelect}
                isDisabled={true}
              />
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-gray-400 text-center">
              No languages match your search
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Want your language added?{' '}
            <a href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Let us know!
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

// ========== LANGUAGE ITEM COMPONENT ==========

interface LanguageItemProps {
  language: LanguageOption;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isDisabled: boolean;
}

function LanguageItem({ language, isSelected, onSelect, isDisabled }: LanguageItemProps) {
  if (isDisabled) {
    return (
      <div
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                   text-gray-400 dark:text-gray-500 cursor-not-allowed"
      >
        <span className="text-xl opacity-50">{language.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{language.nativeName}</div>
          {language.name !== language.nativeName && (
            <div className="text-xs truncate">{language.name}</div>
          )}
        </div>
        <span className="shrink-0 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
          Soon
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(language.code)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                 transition-colors ${
                   isSelected
                     ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                     : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                 }`}
    >
      <span className="text-xl">{language.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{language.nativeName}</div>
        {language.name !== language.nativeName && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{language.name}</div>
        )}
      </div>
      {isSelected && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
    </button>
  );
}

// ========== INLINE LANGUAGE SWITCHER (for assessment pages) ==========

interface InlineLanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function InlineLanguageSwitcher({ currentLanguage, onLanguageChange }: InlineLanguageSwitcherProps) {
  const activeLanguages = getActiveLanguages();

  // Don't show if only one language available
  if (activeLanguages.length <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <span className="text-gray-500 dark:text-gray-400">Having trouble understanding?</span>
      {activeLanguages
        .filter((lang) => lang.code !== currentLanguage)
        .map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Switch to {lang.nativeName}
          </button>
        ))}
    </div>
  );
}
