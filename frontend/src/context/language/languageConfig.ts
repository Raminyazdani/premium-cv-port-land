/**
 * Language Configuration
 * 
 * Centralized configuration for supported languages and their metadata.
 * 
 * FUTURE-LANGUAGE-READY: To add a new language (e.g., Italian):
 * 1. Add entry here with code, displayName, and direction
 * 2. Create cv_<code>.json in src/data/
 * 3. (Optional) Extend lang.json for key label translations
 */

import type { Language } from '@/utils/dataNormalizer'

export const STORAGE_KEY = 'cv-language'

/**
 * Default language metadata fallback
 */
const DEFAULT_METADATA = { displayName: 'English', direction: 'ltr' as const }

/**
 * Language metadata for supported languages
 */
export const LANGUAGE_METADATA: Record<string, { displayName: string; direction: 'ltr' | 'rtl' }> = {
  en: { displayName: 'English', direction: 'ltr' },
  de: { displayName: 'Deutsch', direction: 'ltr' },
  fa: { displayName: 'فارسی', direction: 'rtl' }
  // To add Italian: it: { displayName: 'Italiano', direction: 'ltr' }
}

export const SUPPORTED_LANGUAGES: Language[] = Object.keys(LANGUAGE_METADATA) as Language[]

/**
 * Get list of available languages
 * 
 * Dynamically based on LANGUAGE_METADATA entries.
 * To add a new language, just add it to LANGUAGE_METADATA.
 */
export function getAvailableLanguages(): Array<{ code: Language; displayName: string; direction: 'ltr' | 'rtl' }> {
  return SUPPORTED_LANGUAGES.map(code => {
    const metadata = LANGUAGE_METADATA[code] ?? { displayName: code, direction: DEFAULT_METADATA.direction }
    return {
      code,
      displayName: metadata.displayName,
      direction: metadata.direction
    }
  })
}

/**
 * Get direction for a specific language
 */
export function getLanguageDirection(lang: Language): 'ltr' | 'rtl' {
  const metadata = LANGUAGE_METADATA[lang] ?? LANGUAGE_METADATA['en'] ?? DEFAULT_METADATA
  return metadata.direction
}

/**
 * Check if a language is RTL
 */
export function isLanguageRTL(lang: Language): boolean {
  return getLanguageDirection(lang) === 'rtl'
}
