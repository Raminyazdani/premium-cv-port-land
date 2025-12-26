/**
 * Language Manager
 * Handles language switching, RTL support, and persistence via localStorage
 */

export type LanguageCode = 'en' | 'fa' | 'de'

export interface LanguageOption {
  code: LanguageCode
  label: string
  nativeLabel: string
  direction: 'ltr' | 'rtl'
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    direction: 'ltr'
  },
  {
    code: 'fa',
    label: 'Farsi',
    nativeLabel: 'فارسی',
    direction: 'rtl'
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    direction: 'ltr'
  }
]

const LANGUAGE_STORAGE_KEY = 'cv-language-preference'
const DEFAULT_LANGUAGE: LanguageCode = 'en'

/**
 * Get the current language from localStorage or default
 */
export function getStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && LANGUAGE_OPTIONS.some(opt => opt.code === stored)) {
      return stored as LanguageCode
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error)
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * Save language preference to localStorage
 */
export function saveLanguage(language: LanguageCode): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error)
  }
}

/**
 * Get language direction (ltr or rtl)
 */
export function getLanguageDirection(language: LanguageCode): 'ltr' | 'rtl' {
  return LANGUAGE_OPTIONS.find(opt => opt.code === language)?.direction || 'ltr'
}

/**
 * Apply language and direction to the document root element
 */
export function applyLanguage(language: LanguageCode): void {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  const direction = getLanguageDirection(language)
  
  root.setAttribute('lang', language)
  root.setAttribute('dir', direction)
  root.setAttribute('data-language', language)
}

/**
 * Set language and persist preference
 */
export function setLanguage(language: LanguageCode): void {
  applyLanguage(language)
  saveLanguage(language)
}

/**
 * Initialize language on app load
 */
export function initializeLanguage(): LanguageCode {
  const language = getStoredLanguage()
  applyLanguage(language)
  return language
}

/**
 * Get language label by code
 */
export function getLanguageLabel(language: LanguageCode): string {
  return LANGUAGE_OPTIONS.find(opt => opt.code === language)?.label || 'English'
}

/**
 * Get language native label by code
 */
export function getLanguageNativeLabel(language: LanguageCode): string {
  return LANGUAGE_OPTIONS.find(opt => opt.code === language)?.nativeLabel || 'English'
}

/**
 * Check if current language is RTL
 */
export function isRTL(language?: LanguageCode): boolean {
  const lang = language || getStoredLanguage()
  return getLanguageDirection(lang) === 'rtl'
}
