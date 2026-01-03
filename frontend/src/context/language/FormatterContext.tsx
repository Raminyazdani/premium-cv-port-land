/**
 * Formatter Context: Locale-aware formatting utilities
 * 
 * Provides formatting functions for dates, numbers, currencies, etc.
 * All formatters automatically use the current language's locale.
 */

import { useLanguageState } from './LanguageStateContext'
import {
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
  const { language } = useLanguageState()
  
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
