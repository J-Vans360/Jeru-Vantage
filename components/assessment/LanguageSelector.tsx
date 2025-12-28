'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Globe, Clock, X } from 'lucide-react';
import {
  LANGUAGES,
  getActiveLanguages,
  getLanguagesByRegion,
} from '@/lib/constants/languages';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  variant?: 'dropdown' | 'modal';
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  variant = 'dropdown',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const current = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];
  const activeLanguages = getActiveLanguages();
  const languagesByRegion = getLanguagesByRegion();

  // Detect mobile for bottom sheet
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  // Render bottom sheet for mobile
  if (isMobile && isOpen) {
    return (
      <>
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">
            {current.flag} {current.nativeName}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Bottom Sheet Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />

        {/* Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-hidden animate-slide-up">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Select Language</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh] pb-8">
            {/* Available Section */}
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Available
              </div>
              <div className="space-y-2">
                {activeLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-orange-50 border-2 border-orange-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{lang.nativeName}</div>
                      {lang.name !== lang.nativeName && (
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      )}
                    </div>
                    {currentLanguage === lang.code && (
                      <span className="text-orange-600 text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="px-4 pb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Coming Soon
              </div>
              {Object.entries(languagesByRegion)
                .filter(([region]) => region !== 'Global')
                .map(([region, langs]) => (
                  <div key={region} className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">{region}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {langs
                        .filter((l) => l.status === 'coming_soon')
                        .map((lang) => (
                          <div
                            key={lang.code}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg opacity-60"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-600 truncate">
                                {lang.nativeName}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Want your language added?{' '}
                <a href="/contact" className="text-orange-600 hover:underline">
                  Let us know!
                </a>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">
          {current.flag} {current.nativeName}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Available Section */}
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Available
              </div>
              {activeLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-orange-50 text-orange-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{lang.nativeName}</div>
                    {lang.name !== lang.nativeName && (
                      <div className="text-xs text-gray-500">{lang.name}</div>
                    )}
                  </div>
                  {currentLanguage === lang.code && (
                    <span className="text-orange-600">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Coming Soon Section */}
            <div className="p-2 max-h-64 overflow-y-auto">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Coming Soon
              </div>

              {Object.entries(languagesByRegion)
                .filter(([region]) => region !== 'Global')
                .map(([region, langs]) => (
                  <div key={region} className="mb-2">
                    <div className="px-3 py-1 text-xs text-gray-400">{region}</div>
                    {langs
                      .filter((l) => l.status === 'coming_soon')
                      .map((lang) => (
                        <div
                          key={lang.code}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                        >
                          <span className="text-xl opacity-50">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium">{lang.nativeName}</div>
                            {lang.name !== lang.nativeName && (
                              <div className="text-xs">{lang.name}</div>
                            )}
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            Soon
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Want your language added?{' '}
                <a href="/contact" className="text-orange-600 hover:underline">
                  Let us know!
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
