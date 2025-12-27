/**
 * Language Context: Global language state management
 * 
 * Handles language selection, persistence, and RTL support
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Language } from '@/utils/dataNormalizer'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'cv-language'
const SUPPORTED_LANGUAGES: Language[] = ['en', 'de', 'fa']

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
  const browserLang = navigator.language.split('-')[0].toLowerCase()
  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language
  }

  // 4. Default
  return 'en'
}

/**
 * Applies HTML attributes for language and directionality
 */
function applyLanguageToDOM(lang: Language) {
  const html = document.documentElement
  
  // Set lang attribute
  html.setAttribute('lang', lang)
  
  // Set dir attribute
  const dir = lang === 'fa' ? 'rtl' : 'ltr'
  html.setAttribute('dir', dir)
  
  // Update URL without reload
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectInitialLanguage())
  const isRTL = language === 'fa'

  // Apply language to DOM on mount and when language changes
  useEffect(() => {
    applyLanguageToDOM(language)
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

    // Apply to DOM
    applyLanguageToDOM(lang)
  }, [])

  const value = {
    language,
    setLanguage,
    isRTL
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

/**
 * Hook for accessing UI translations
 */
import { getUIStrings, type UIStrings } from '@/lib/i18n'

export function useTranslation(): UIStrings {
  const { language } = useLanguage()
  return getUIStrings(language)
}

/**
 * Hook for getting translated text by key path
 */
import { t as translate } from '@/lib/i18n'

export function useT() {
  const { language } = useLanguage()
  return (key: string) => translate(language, key)
}
