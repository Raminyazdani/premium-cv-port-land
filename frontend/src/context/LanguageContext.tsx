/**
 * Language Context: Global language state management
 * 
 * This file maintains backward compatibility by re-exporting from the
 * modular language context system. The responsibilities have been split:
 * 
 * - LanguageStateContext: Core language state and persistence
 * - DirectionContext: RTL/LTR detection and DOM updates
 * - TranslationContext: UI translations and key label translations
 * - FormatterContext: Locale-aware formatting utilities
 * 
 * FUTURE-LANGUAGE-READY: To add a new language (e.g., Italian):
 * 1. Add cv_it.json to src/data/ with canonical English keys
 * 2. Add language metadata in src/context/language/languageConfig.ts
 * 3. (Optional) Extend lang.json with IT translations for structural keys
 * That's it! No code changes needed.
 * 
 * @module LanguageContext
 * @see src/context/language/index.ts for the modular implementation
 */

import React from 'react'
import type { Language } from '@/utils/dataNormalizer'

// Import from the modular system
import {
  LANGUAGE_METADATA,
  getAvailableLanguages,
  LanguageProviders,
  useLanguageState,
  useDirection,
  useTranslation as useTranslationFromModule,
  useT as useTFromModule,
  useKeyLabelTranslation as useKeyLabelTranslationFromModule,
  useFormatters as useFormattersFromModule,
  useSkillCategoryLabel as useSkillCategoryLabelFromModule
} from './language'

// Re-export configuration
export { LANGUAGE_METADATA, getAvailableLanguages }

// Legacy type for backward compatibility
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

/**
 * LanguageProvider: Combined provider for backward compatibility
 * 
 * Uses the modular provider system internally but exposes the same
 * interface as before for all existing consumers.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProviders>{children}</LanguageProviders>
}

/**
 * Hook for accessing language state and RTL status
 * 
 * Combines useLanguageState and useDirection for backward compatibility.
 */
export function useLanguage(): LanguageContextType {
  const { language, setLanguage } = useLanguageState()
  const { isRTL } = useDirection()
  
  return {
    language,
    setLanguage,
    isRTL
  }
}

/**
 * Hook for accessing UI translations
 */
export function useTranslation() {
  return useTranslationFromModule()
}

/**
 * Hook for getting translated text by key path
 */
export function useT() {
  return useTFromModule()
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
  return useKeyLabelTranslationFromModule()
}

/**
 * Hook for locale-aware formatting utilities
 * 
 * Provides date, number, and plural formatting functions
 * that automatically use the current language's locale.
 */
export function useFormatters() {
  return useFormattersFromModule()
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
  return useSkillCategoryLabelFromModule()
}
