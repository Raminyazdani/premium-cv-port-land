/**
 * Translation Context: Provides translation utilities
 * 
 * Provides access to UI translations and key label translations.
 * This context wraps the i18n module functions with the current language.
 */

import { useLanguageState } from './LanguageStateContext'
import { 
  getUIStrings, 
  type UIStrings, 
  t as translate,
  tl as translateKeyLabel
} from '@/lib/i18n'

/**
 * Hook for accessing UI translations
 * 
 * Returns the complete UI strings object for the current language.
 * 
 * @example
 * const t = useTranslation()
 * console.log(t.sections.education) // "Ausbildung" in German
 */
export function useTranslation(): UIStrings {
  const { language } = useLanguageState()
  return getUIStrings(language)
}

/**
 * Hook for getting translated text by key path
 * 
 * @example
 * const t = useT()
 * console.log(t('sections.education')) // "Ausbildung" in German
 */
export function useT() {
  const { language } = useLanguageState()
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
  const { language } = useLanguageState()
  return (keyName: string) => translateKeyLabel(keyName, language)
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
