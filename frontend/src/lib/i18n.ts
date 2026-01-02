/**
 * i18n: UI Text Translations
 * 
 * This module re-exports from the modular i18n system.
 * 
 * For new translations, add them to:
 * - src/i18n/types.ts (type definitions)
 * - src/i18n/translations/en.ts, de.ts, fa.ts (translations)
 * 
 * @see src/i18n/index.ts for full documentation
 */

// Re-export everything from the modular i18n system
export {
  getUIStrings,
  t,
  tl,
  interpolate,
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
  getDomainLabel,
  normalizeDomainKey,
  dateFormatPresets,
} from '@/i18n'

export type { UIStrings, Translations, TranslationKey } from '@/i18n'
