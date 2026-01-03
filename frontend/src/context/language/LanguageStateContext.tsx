/**
 * Language State Context: Core language state management
 * 
 * Handles language selection, persistence, and detection.
 * This is the most basic language context - it only manages the language state
 * and provides methods to change it.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Language } from '@/utils/dataNormalizer'
import { SUPPORTED_LANGUAGES, STORAGE_KEY } from './languageConfig'

interface LanguageStateContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageStateContext = createContext<LanguageStateContextType | undefined>(undefined)

/**
 * Detects initial language from:
 * 1. URL parameter (?lang=xx)
 * 2. localStorage
 * 3. Browser language
 * 4. Default to 'en'
 */
function detectInitialLanguage(): Language {
  // 1. Check URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as Language)) {
    return urlLang as Language
  }

  // 2. Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
      return stored as Language
    }
  } catch (e) {
    console.warn('Failed to read language from localStorage:', e)
  }

  // 3. Check browser language
  const browserLangParts = navigator.language.split('-')
  const browserLang = (browserLangParts[0] ?? '').toLowerCase()
  if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language
  }

  // 4. Default
  return 'en'
}

/**
 * Updates URL parameter without reload
 */
function updateURLParameter(lang: Language) {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

export function LanguageStateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectInitialLanguage())

  // Update URL on mount
  useEffect(() => {
    updateURLParameter(language)
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}. Defaulting to 'en'`)
      lang = 'en'
    }

    setLanguageState(lang)

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e)
    }

    // Update URL parameter
    updateURLParameter(lang)
  }, [])

  const value = {
    language,
    setLanguage
  }

  return (
    <LanguageStateContext.Provider value={value}>
      {children}
    </LanguageStateContext.Provider>
  )
}

export function useLanguageState(): LanguageStateContextType {
  const context = useContext(LanguageStateContext)
  if (!context) {
    throw new Error('useLanguageState must be used within a LanguageStateProvider')
  }
  return context
}
