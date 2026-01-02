/**
 * Language Context: Global language state management
 * 
 * Handles language selection, persistence, and RTL support.
 * 
 * FUTURE-LANGUAGE-READY: To add a new language (e.g., Italian):
 * 1. Add cv_it.json to src/data/ with canonical English keys
 * 2. Add language metadata below (language code, display name, direction)
 * 3. (Optional) Extend lang.json with IT translations for structural keys
 * That's it! No code changes needed.
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

/**
 * Language metadata for supported languages
 * 
 * To add a new language:
 * - Add entry here with code, displayName, and direction
 * - Create cv_<code>.json in src/data/
 * - (Optional) Extend lang.json for key label translations
 */
export const LANGUAGE_METADATA: Record<string, { displayName: string; direction: 'ltr' | 'rtl' }> = {
  en: { displayName: 'English', direction: 'ltr' },
  de: { displayName: 'Deutsch', direction: 'ltr' },
  fa: { displayName: 'فارسی', direction: 'rtl' }
  // To add Italian: it: { displayName: 'Italiano', direction: 'ltr' }
}

const SUPPORTED_LANGUAGES: Language[] = Object.keys(LANGUAGE_METADATA) as Language[]

/**
 * Get list of available languages
 * 
 * Dynamically based on LANGUAGE_METADATA entries.
 * To add a new language, just add it to LANGUAGE_METADATA.
 */
export function getAvailableLanguages(): Array<{ code: Language; displayName: string; direction: 'ltr' | 'rtl' }> {
  return SUPPORTED_LANGUAGES.map(code => {
    const metadata = LANGUAGE_METADATA[code] ?? { displayName: code, direction: 'ltr' as const }
    return {
      code,
      displayName: metadata.displayName,
      direction: metadata.direction
    }
  })
}

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
 * Applies HTML attributes for language and directionality
 */
function applyLanguageToDOM(lang: Language) {
  const html = document.documentElement
  
  // Set lang attribute
  html.setAttribute('lang', lang)
  
  // Set dir attribute using metadata
  const metadata = LANGUAGE_METADATA[lang] ?? LANGUAGE_METADATA['en'] ?? { displayName: 'English', direction: 'ltr' as const }
  html.setAttribute('dir', metadata.direction)
  
  // Update URL without reload
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectInitialLanguage())
  const metadata = LANGUAGE_METADATA[language] ?? LANGUAGE_METADATA['en'] ?? { displayName: 'English', direction: 'ltr' as const }
  const isRTL = metadata.direction === 'rtl'

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
  tl as translateKeyLabel,
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
 * Hook for translating structural key labels from lang.json
 * 
 * Use this for CV data field labels (e.g., "basics" → "Grunddaten" in DE)
 * NOT for UI strings (use `useTranslation()` for that)
 * 
 * @example
 * const tl = useKeyLabelTranslation()
 * const basicsLabel = tl('basics')  // "Grunddaten" in DE, "اطلاعات پایه" in FA
 */
export function useKeyLabelTranslation() {
  const { language } = useLanguage()
  return (keyName: string) => translateKeyLabel(keyName, language)
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

/**
 * Hook for getting skill category display labels
 * 
 * NOTE: As of Issue 01, skill category labels are stored as DATA
 * in each language's CV file, not as schema keys. Each CV file
 * (cv.json, cv_de.json, cv_fa.json) contains category/subcategory
 * labels already translated.
 * 
 * Example:
 * - cv.json: "Programming & Scripting"
 * - cv_de.json: "Programmierung & Skripting"  
 * - cv_fa.json: "برنامه‌نویسی و اسکریپت‌نویسی"
 * 
 * Therefore, no translation is needed - just return the label as-is.
 */
export function useSkillCategoryLabel() {
  // Return identity function - labels are already in the correct language
  return (label: string) => label
}
