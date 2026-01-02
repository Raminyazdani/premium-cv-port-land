/**
 * i18n Module Index
 * 
 * This module provides type-safe internationalization for the CV website.
 * 
 * ## Usage
 * 
 * ### Getting all UI strings for a language:
 * ```ts
 * import { getUIStrings } from '@/i18n'
 * const strings = getUIStrings('de')
 * ```
 * 
 * ### Getting a single translation by key path:
 * ```ts
 * import { t } from '@/i18n'
 * const text = t('de', 'sections.education') // "Ausbildung"
 * ```
 * 
 * ### String interpolation:
 * ```ts
 * import { interpolate } from '@/i18n'
 * interpolate('{count} items', { count: 5 }) // "5 items"
 * ```
 * 
 * ## Adding New Translation Keys
 * 
 * 1. Add the key to `src/i18n/types.ts` in the `UIStrings` interface
 * 2. Add translations for all languages in `src/i18n/translations/en.ts`, `de.ts`, `fa.ts`
 * 3. Run tests to verify: `npm run test -- tests/i18n-completeness.test.ts`
 * 
 * ## Module Structure
 * 
 * - `types.ts` - TypeScript interfaces for translation keys
 * - `translations/en.ts` - English translations
 * - `translations/de.ts` - German translations
 * - `translations/fa.ts` - Persian/Farsi translations
 * - `index.ts` - Main exports and utility functions
 */

import type { Language } from '@/utils/dataNormalizer'
import type { UIStrings, Translations } from './types'
import { en } from './translations/en'
import { de } from './translations/de'
import { fa } from './translations/fa'

// Re-export types
export type { UIStrings, Translations, TranslationKey } from './types'

/**
 * All translations organized by language
 */
const translations: Translations = {
  en,
  de,
  fa
}

// Pseudo-localization support for QA
import { isPseudoLocEnabled, pseudoLocalizeObject } from '@/utils/pseudoLocalization'

/**
 * Get all UI strings for a specific language
 * 
 * @param lang - Target language (en/de/fa)
 * @returns Complete UI strings object for the language
 * 
 * @example
 * const t = getUIStrings('de')
 * console.log(t.sections.education) // "Ausbildung"
 */
export function getUIStrings(lang: Language): UIStrings {
  const strings = translations[lang] || translations.en
  
  // Apply pseudo-localization if enabled
  if (isPseudoLocEnabled()) {
    return pseudoLocalizeObject(strings)
  }
  
  return strings
}

/**
 * Get a single translation by dot-notation key path
 * 
 * @param lang - Target language (en/de/fa)
 * @param key - Dot-notation key path (e.g., 'sections.education')
 * @returns Translated string, or the key itself if not found
 * 
 * @example
 * t('de', 'sections.education') // "Ausbildung"
 * t('en', 'actions.download_cv') // "Download CV"
 */
export function t(lang: Language, key: string): string {
  const strings = getUIStrings(lang)
  const keys = key.split('.')
  
  let value: unknown = strings
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}

/**
 * Interpolate variables into a template string
 * 
 * @param template - Template string with {variable} placeholders
 * @param vars - Object with variable values
 * @returns Interpolated string
 * 
 * @example
 * interpolate('{count} items', { count: 5 }) // "5 items"
 * interpolate('Hello, {name}!', { name: 'World' }) // "Hello, World!"
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

// ============================================================================
// KEY LABEL TRANSLATIONS (from lang.json)
// ============================================================================

/**
 * Load lang.json for structural key label translations
 */
import langLabels from '@/data/lang.json'

/**
 * Translate a structural key label using lang.json
 * 
 * This is for CV data field/section labels, NOT UI strings.
 * For UI strings, use `getUIStrings()` or `t()`.
 * 
 * @param keyName - The canonical English key name (e.g., "basics", "education", "fname")
 * @param lang - Target language (en/de/fa)
 * @returns Translated label, with fallback chain: lang → en → keyName
 * 
 * @example
 * tl('basics', 'de')  // → "Grunddaten"
 * tl('fname', 'fa')   // → "نام_کوچک"
 * tl('email', 'en')   // → "email"
 */
export function tl(keyName: string, lang: Language): string {
  // Type assertion for lang.json structure
  const labels = langLabels as Record<string, Record<Language, string>>
  
  if (!labels[keyName]) {
    // Key not in lang.json, return as-is
    return keyName
  }
  
  // Try requested language
  if (labels[keyName][lang]) {
    return labels[keyName][lang]
  }
  
  // Fallback to English
  if (labels[keyName].en) {
    return labels[keyName].en
  }
  
  // Final fallback: return the key itself
  return keyName
}

// ============================================================================
// LOCALE-AWARE FORMATTING UTILITIES
// ============================================================================

/**
 * Language to locale mapping for Intl APIs
 */
const localeMap: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
  fa: 'fa-IR'
}

/**
 * Date formatting options presets
 */
export const dateFormatPresets = {
  short: { year: 'numeric', month: 'short' } as Intl.DateTimeFormatOptions,
  long: { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions,
  full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' } as Intl.DateTimeFormatOptions,
  monthYear: { year: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions,
  yearOnly: { year: 'numeric' } as Intl.DateTimeFormatOptions
}

/**
 * Format a date according to the specified language's locale.
 * 
 * Examples:
 * - EN: "January 15, 2024"
 * - DE: "15. Januar 2024"
 * - FA: "۱۵ دی ۱۴۰۲" (with Persian calendar)
 * 
 * @param date - Date to format (string, Date, or number)
 * @param language - Target language
 * @param options - Intl.DateTimeFormat options (defaults to 'long' preset)
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  language: Language,
  options: Intl.DateTimeFormatOptions = dateFormatPresets.long
): string {
  if (!date) return ''

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return ''
    }

    const locale = localeMap[language]
    
    // For Persian, optionally use Persian calendar
    // Note: Using Gregorian calendar by default for consistency
    // To use Persian calendar, uncomment the calendar option below
    const formatOptions: Intl.DateTimeFormatOptions = {
      ...options,
      // calendar: language === 'fa' ? 'persian' : 'gregory'
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
  } catch {
    return ''
  }
}

/**
 * Format a date for display, handling special cases like "present"
 * 
 * @param date - Date to format
 * @param language - Target language
 * @param options - Formatting options
 * @returns Formatted date or "Present" translation
 */
export function formatDateDisplay(
  date: Date | string | number | null | undefined,
  language: Language,
  options: Intl.DateTimeFormatOptions = dateFormatPresets.monthYear
): string {
  if (!date) return ''
  
  // Handle "present" case
  if (typeof date === 'string') {
    const lowerDate = date.toLowerCase()
    if (lowerDate === 'present' || lowerDate === 'gegenwart' || 
        lowerDate === 'تاکنون' || lowerDate === 'حال حاضر') {
      const strings = getUIStrings(language)
      return strings.education.present
    }
  }
  
  return formatDate(date, language, options)
}

/**
 * Format a date range (start - end) according to locale
 * 
 * @param startDate - Start date
 * @param endDate - End date (or "present")
 * @param language - Target language
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string | number | null | undefined,
  endDate: Date | string | number | null | undefined,
  language: Language
): string {
  const start = formatDateDisplay(startDate, language, dateFormatPresets.monthYear)
  const end = formatDateDisplay(endDate, language, dateFormatPresets.monthYear)
  
  if (!start && !end) return ''
  if (!start) return end
  if (!end) {
    const strings = getUIStrings(language)
    return `${start} – ${strings.education.present}`
  }
  
  return `${start} – ${end}`
}

/**
 * Format a number according to the specified language's locale.
 * 
 * Examples:
 * - EN: "1,234.56"
 * - DE: "1.234,56"
 * - FA: "۱٬۲۳۴٫۵۶" (with Persian numerals)
 * 
 * @param value - Number to format
 * @param language - Target language
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | null | undefined,
  language: Language,
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) return ''
  
  try {
    const locale = localeMap[language]
    
    // For Persian, use Extended Arabic-Indic numerals (۰-۹)
    // 'arabext' = Extended Arabic-Indic numerals used in Persian/Farsi
    const formatOptions: Intl.NumberFormatOptions = {
      ...options,
      numberingSystem: language === 'fa' ? 'arabext' : undefined
    }
    
    return new Intl.NumberFormat(locale, formatOptions).format(value)
  } catch {
    return String(value)
  }
}

/**
 * Format a currency value according to locale
 * 
 * @param value - Numeric value
 * @param language - Target language
 * @param currency - ISO 4217 currency code (default: based on language)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | null | undefined,
  language: Language,
  currency?: string
): string {
  if (value === null || value === undefined) return ''
  
  // Default currency by language
  const defaultCurrencies: Record<Language, string> = {
    en: 'USD',
    de: 'EUR',
    fa: 'IRR'
  }
  
  return formatNumber(value, language, {
    style: 'currency',
    currency: currency || defaultCurrencies[language],
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

/**
 * Format a percentage according to locale
 * 
 * @param value - Decimal value (e.g., 0.85 for 85%)
 * @param language - Target language
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number | null | undefined,
  language: Language
): string {
  if (value === null || value === undefined) return ''
  
  return formatNumber(value, language, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })
}

/**
 * Plural forms for supported languages
 */
type PluralForms = {
  zero?: string
  one: string
  two?: string
  few?: string
  many?: string
  other: string
}

/**
 * Get plural form based on count and language rules.
 * 
 * Uses Intl.PluralRules for proper language-specific pluralization.
 * 
 * @param count - The count to pluralize for
 * @param forms - Object with plural forms (one, other, and optionally zero, two, few, many)
 * @param language - Target language
 * @returns The appropriate plural form
 */
export function pluralize(
  count: number,
  forms: PluralForms,
  language: Language
): string {
  const locale = localeMap[language]
  const pluralRules = new Intl.PluralRules(locale)
  const rule = pluralRules.select(count)
  
  // Return the matching form, with fallback to 'other'
  switch (rule) {
    case 'zero':
      return forms.zero ?? forms.other
    case 'one':
      return forms.one
    case 'two':
      return forms.two ?? forms.other
    case 'few':
      return forms.few ?? forms.other
    case 'many':
      return forms.many ?? forms.other
    default:
      return forms.other
  }
}

/**
 * Helper to format a count with its pluralized label.
 * 
 * Example: pluralizeWithCount(5, { one: 'item', other: 'items' }, 'en') => "5 items"
 * 
 * @param count - The count
 * @param forms - Plural forms
 * @param language - Target language
 * @returns Formatted string with count and plural label
 */
export function pluralizeWithCount(
  count: number,
  forms: PluralForms,
  language: Language
): string {
  const formattedCount = formatNumber(count, language)
  const label = pluralize(count, forms, language)
  return `${formattedCount} ${label}`
}

/**
 * Format relative time (e.g., "3 days ago", "in 2 hours")
 * 
 * @param value - Numeric value (negative for past, positive for future)
 * @param unit - Time unit
 * @param language - Target language
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: Language
): string {
  const locale = localeMap[language]
  
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric: 'auto',
      style: 'long'
    })
    return rtf.format(value, unit)
  } catch {
    // Fallback for unsupported browsers
    const absValue = Math.abs(value)
    const unitStr = `${unit}${absValue !== 1 ? 's' : ''}`
    if (value < 0) {
      return `${absValue} ${unitStr} ago`
    } else {
      return `in ${absValue} ${unitStr}`
    }
  }
}

/**
 * Get the list display format for the language
 * 
 * Example: formatList(['a', 'b', 'c'], 'en') => "a, b, and c"
 *          formatList(['a', 'b', 'c'], 'de') => "a, b und c"
 * 
 * @param items - Array of strings to format as a list
 * @param language - Target language
 * @param type - List format type
 * @returns Formatted list string
 */
export function formatList(
  items: string[],
  language: Language,
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  if (!items || items.length === 0) return ''
  if (items.length === 1) return items[0] || ''
  
  const locale = localeMap[language]
  
  try {
    // Check if Intl.ListFormat is available (ES2021+)
    if (typeof Intl !== 'undefined' && 'ListFormat' in Intl) {
      // Type assertion for Intl.ListFormat (not in ES2020 lib)
      type ListFormatOptions = { style?: string; type?: string }
      type ListFormatConstructor = new (locale: string, options?: ListFormatOptions) => { format: (items: string[]) => string }
      const ListFormat = (Intl as unknown as { ListFormat: ListFormatConstructor }).ListFormat
      const listFormatter = new ListFormat(locale, {
        style: 'long',
        type
      })
      return listFormatter.format(items)
    }
  } catch {
    // Fallback below will handle this case
  }
  
  // Fallback for unsupported browsers or when Intl.ListFormat is not available
  if (items.length === 2) {
    const conjunction = type === 'conjunction' 
      ? (language === 'de' ? ' und ' : language === 'fa' ? ' و ' : ' and ')
      : (language === 'de' ? ' oder ' : language === 'fa' ? ' یا ' : ' or ')
    return items.join(conjunction)
  }
  
  const lastItem = items[items.length - 1] ?? ''
  return items.slice(0, -1).join(', ') + 
         (type === 'conjunction' 
           ? (language === 'de' ? ' und ' : language === 'fa' ? ' و ' : ', and ')
           : (language === 'de' ? ' oder ' : language === 'fa' ? ' یا ' : ', or ')) + 
         lastItem
}

/**
 * Get domain label translation
 * 
 * @param domain - Domain key (programming, bioinformatics, etc.)
 * @param language - Target language
 * @returns Translated domain label
 */
export function getDomainLabel(domain: string, language: Language): string {
  const strings = getUIStrings(language)
  const normalizedDomain = domain.toLowerCase().replace(/\s+/g, '_')
  
  switch (normalizedDomain) {
    case 'programming':
      return strings.domains.programming
    case 'bioinformatics':
      return strings.domains.bioinformatics
    case 'biotechnology':
      return strings.domains.biotechnology
    case 'academic':
      return strings.domains.academic
    case 'industry':
      return strings.domains.industry
    case 'robotics':
      return strings.domains.robotics
    case 'embedded_systems':
      return strings.domains.embedded_systems
    case 'student_projects':
      return strings.domains.student_projects
    default:
      return domain
  }
}

/**
 * Normalize a domain key from any language format to a canonical key
 * 
 * @param key - Domain key in any language
 * @returns Canonical domain key for use with getDomainLabel
 */
export function normalizeDomainKey(key: string): string | null {
  const normalized = key.toLowerCase().trim()
  
  // Map all variations to canonical keys
  const domainMap: Record<string, string> = {
    'programming': 'programming',
    'programmierung': 'programming',
    'برنامه‌نویسی': 'programming',
    'bioinformatics': 'bioinformatics',
    'bioinformatik': 'bioinformatics',
    'بیوانفورماتیک': 'bioinformatics',
    'biotechnology': 'biotechnology',
    'biotechnologie': 'biotechnology',
    'زیست‌فناوری': 'biotechnology',
    'academic': 'academic',
    'akademisch': 'academic',
    'آکادمیک': 'academic',
    'industry': 'industry',
    'industrie': 'industry',
    'صنعت': 'industry',
    'robotics': 'robotics',
    'robotik': 'robotics',
    'رباتیک': 'robotics',
    'embedded systems': 'embedded_systems',
    'eingebettete systeme': 'embedded_systems',
    'سیستم‌های نهفته': 'embedded_systems',
    'student projects': 'student_projects',
    'studentenprojekte': 'student_projects',
    'پروژه‌های دانشجویی': 'student_projects'
  }
  
  return domainMap[normalized] || null
}
