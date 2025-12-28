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
import { 
  getUIStrings, 
  type UIStrings, 
  t as translate,
  formatDate,
  formatDateDisplay,
  formatDateRange,
  formatNumber,
  formatCurrency,
  formatPercent,
  pluralize,
  pluralizeWithCount,
  formatRelativeTime,
  formatList,
  dateFormatPresets
} from '@/lib/i18n'

export function useTranslation(): UIStrings {
  const { language } = useLanguage()
  return getUIStrings(language)
}

/**
 * Hook for getting translated text by key path
 */
export function useT() {
  const { language } = useLanguage()
  return (key: string) => translate(language, key)
}

/**
 * Plural forms type for pluralization functions
 */
type PluralFormsInput = {
  zero?: string
  one: string
  two?: string
  few?: string
  many?: string
  other: string
}

/**
 * Hook for locale-aware formatting utilities
 * 
 * Provides date, number, and plural formatting functions
 * that automatically use the current language's locale.
 */
export function useFormatters() {
  const { language } = useLanguage()
  
  return {
    /**
     * Format a date according to the current locale
     * @example formatDate(new Date()) // EN: "January 15, 2024", DE: "15. Januar 2024"
     */
    formatDate: (date: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, language, options),
    
    /**
     * Format a date for display, handling "present" translations
     * @example formatDateDisplay('2024-01') // "January 2024" or "Januar 2024"
     */
    formatDateDisplay: (date: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions) => 
      formatDateDisplay(date, language, options),
    
    /**
     * Format a date range with proper locale formatting
     * @example formatDateRange('2020-01', 'present') // "January 2020 – Present"
     */
    formatDateRange: (startDate: Date | string | number | null | undefined, endDate: Date | string | number | null | undefined) => 
      formatDateRange(startDate, endDate, language),
    
    /**
     * Format a number according to the current locale
     * @example formatNumber(1234.56) // EN: "1,234.56", DE: "1.234,56"
     */
    formatNumber: (value: number | null | undefined, options?: Intl.NumberFormatOptions) => 
      formatNumber(value, language, options),
    
    /**
     * Format a currency value according to the current locale
     * @example formatCurrency(99.99) // "$99.99" or "99,99 €"
     */
    formatCurrency: (value: number | null | undefined, currency?: string) => 
      formatCurrency(value, language, currency),
    
    /**
     * Format a percentage according to the current locale
     * @example formatPercent(0.85) // "85%" or "85 %"
     */
    formatPercent: (value: number | null | undefined) => 
      formatPercent(value, language),
    
    /**
     * Get the correct plural form based on count
     * @example pluralize(1, { one: 'item', other: 'items' }) // "item"
     */
    pluralize: (count: number, forms: PluralFormsInput) => 
      pluralize(count, forms, language),
    
    /**
     * Format a count with its pluralized label
     * @example pluralizeWithCount(5, { one: 'item', other: 'items' }) // "5 items"
     */
    pluralizeWithCount: (count: number, forms: PluralFormsInput) => 
      pluralizeWithCount(count, forms, language),
    
    /**
     * Format relative time
     * @example formatRelativeTime(-3, 'day') // "3 days ago"
     */
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => 
      formatRelativeTime(value, unit, language),
    
    /**
     * Format a list of items with proper conjunction
     * @example formatList(['a', 'b', 'c']) // EN: "a, b, and c", DE: "a, b und c"
     */
    formatList: (items: string[], type?: 'conjunction' | 'disjunction') => 
      formatList(items, language, type),
    
    /**
     * Date format presets for common use cases
     */
    datePresets: dateFormatPresets,
    
    /**
     * The current language code
     */
    language
  }
}
