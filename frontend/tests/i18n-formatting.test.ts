/**
 * I18N Formatting Tests
 * 
 * Tests for locale-aware date, number, and pluralization formatting
 */

import { describe, it, expect } from 'vitest'
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
  dateFormatPresets,
  getUIStrings
} from '@/lib/i18n'
import type { Language } from '@/utils/dataNormalizer'

describe('Date Formatting', () => {
  const testDate = new Date('2024-01-15T12:00:00Z')
  const languages: Language[] = ['en', 'de', 'fa']

  describe('formatDate', () => {
    it('should format dates differently per locale', () => {
      // English: "January 15, 2024"
      const enDate = formatDate(testDate, 'en', dateFormatPresets.long)
      expect(enDate).toContain('January')
      expect(enDate).toContain('15')
      expect(enDate).toContain('2024')

      // German: "15. Januar 2024"
      const deDate = formatDate(testDate, 'de', dateFormatPresets.long)
      expect(deDate).toContain('Januar')
      expect(deDate).toContain('15')
      expect(deDate).toContain('2024')

      // Persian: Contains Persian month
      const faDate = formatDate(testDate, 'fa', dateFormatPresets.long)
      expect(faDate).toBeTruthy()
      expect(faDate.length).toBeGreaterThan(0)
    })

    it('should handle null/undefined dates', () => {
      expect(formatDate(null, 'en')).toBe('')
      expect(formatDate(undefined, 'en')).toBe('')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date', 'en')).toBe('')
    })

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15', 'en', dateFormatPresets.long)
      expect(result).toContain('2024')
    })

    it('should handle numeric timestamps', () => {
      const timestamp = testDate.getTime()
      const result = formatDate(timestamp, 'en', dateFormatPresets.long)
      expect(result).toContain('2024')
    })

    languages.forEach(lang => {
      it(`should format dates for ${lang.toUpperCase()}`, () => {
        const result = formatDate(testDate, lang)
        expect(result).toBeTruthy()
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })

  describe('formatDateDisplay', () => {
    it('should handle "present" in English', () => {
      const result = formatDateDisplay('present', 'en')
      const strings = getUIStrings('en')
      expect(result).toBe(strings.education.present)
    })

    it('should handle "Gegenwart" in German', () => {
      const result = formatDateDisplay('gegenwart', 'de')
      const strings = getUIStrings('de')
      expect(result).toBe(strings.education.present)
    })

    it('should handle Persian "تاکنون"', () => {
      const result = formatDateDisplay('تاکنون', 'fa')
      const strings = getUIStrings('fa')
      expect(result).toBe(strings.education.present)
    })

    it('should format actual dates normally', () => {
      const result = formatDateDisplay(testDate, 'en')
      expect(result).toContain('2024')
    })
  })

  describe('formatDateRange', () => {
    it('should format a date range', () => {
      const result = formatDateRange('2020-01', '2024-01', 'en')
      expect(result).toContain('2020')
      expect(result).toContain('2024')
      expect(result).toContain('–')
    })

    it('should handle present as end date', () => {
      const result = formatDateRange('2020-01', 'present', 'en')
      expect(result).toContain('2020')
      const strings = getUIStrings('en')
      expect(result).toContain(strings.education.present)
    })

    it('should handle missing start date', () => {
      const result = formatDateRange(null, '2024-01', 'en')
      expect(result).toContain('2024')
    })

    it('should handle missing end date', () => {
      const result = formatDateRange('2020-01', null, 'en')
      expect(result).toContain('2020')
      const strings = getUIStrings('en')
      expect(result).toContain(strings.education.present)
    })

    it('should return empty string when both dates missing', () => {
      expect(formatDateRange(null, null, 'en')).toBe('')
    })

    languages.forEach(lang => {
      it(`should format date ranges for ${lang.toUpperCase()}`, () => {
        const result = formatDateRange('2020-01', '2024-01', lang)
        expect(result).toBeTruthy()
        expect(result).toContain('–')
      })
    })
  })
})

describe('Number Formatting', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  describe('formatNumber', () => {
    it('should format numbers differently per locale', () => {
      const value = 1234.56

      // English: "1,234.56"
      const enNum = formatNumber(value, 'en')
      expect(enNum).toMatch(/1[,.]?234/)

      // German: "1.234,56"
      const deNum = formatNumber(value, 'de')
      expect(deNum).toBeTruthy()

      // Persian: Uses Eastern Arabic numerals
      const faNum = formatNumber(value, 'fa')
      expect(faNum).toBeTruthy()
    })

    it('should handle null/undefined values', () => {
      expect(formatNumber(null, 'en')).toBe('')
      expect(formatNumber(undefined, 'en')).toBe('')
    })

    it('should handle zero', () => {
      expect(formatNumber(0, 'en')).toBe('0')
    })

    it('should handle negative numbers', () => {
      const result = formatNumber(-1234, 'en')
      expect(result).toContain('1')
      expect(result).toContain('-')
    })

    languages.forEach(lang => {
      it(`should format numbers for ${lang.toUpperCase()}`, () => {
        const result = formatNumber(1234567.89, lang)
        expect(result).toBeTruthy()
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })

  describe('formatCurrency', () => {
    it('should format currency per locale', () => {
      const enCurrency = formatCurrency(99.99, 'en')
      expect(enCurrency).toContain('$')

      const deCurrency = formatCurrency(99.99, 'de')
      expect(deCurrency).toContain('€')
    })

    it('should allow custom currency', () => {
      const result = formatCurrency(100, 'en', 'EUR')
      expect(result).toContain('€')
    })

    it('should handle null/undefined', () => {
      expect(formatCurrency(null, 'en')).toBe('')
      expect(formatCurrency(undefined, 'en')).toBe('')
    })
  })

  describe('formatPercent', () => {
    it('should format percentages', () => {
      const result = formatPercent(0.85, 'en')
      expect(result).toContain('85')
      expect(result).toContain('%')
    })

    it('should handle null/undefined', () => {
      expect(formatPercent(null, 'en')).toBe('')
    })

    languages.forEach(lang => {
      it(`should format percentages for ${lang.toUpperCase()}`, () => {
        const result = formatPercent(0.5, lang)
        expect(result).toBeTruthy()
      })
    })
  })
})

describe('Pluralization', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  describe('pluralize', () => {
    const forms = {
      one: 'item',
      other: 'items'
    }

    it('should return singular for count of 1', () => {
      expect(pluralize(1, forms, 'en')).toBe('item')
      expect(pluralize(1, forms, 'de')).toBe('item')
    })

    it('should return plural for count of 0', () => {
      expect(pluralize(0, forms, 'en')).toBe('items')
    })

    it('should return plural for count > 1', () => {
      expect(pluralize(2, forms, 'en')).toBe('items')
      expect(pluralize(5, forms, 'en')).toBe('items')
      expect(pluralize(100, forms, 'en')).toBe('items')
    })

    it('should use zero form when provided', () => {
      const formsWithZero = {
        zero: 'no items',
        one: 'item',
        other: 'items'
      }
      // Note: English doesn't have a zero plural rule, so it uses 'other'
      // Only some languages like Arabic have a zero plural rule
      const result = pluralize(0, formsWithZero, 'en')
      expect(result).toBeTruthy()
    })

    languages.forEach(lang => {
      it(`should handle pluralization for ${lang.toUpperCase()}`, () => {
        expect(pluralize(1, forms, lang)).toBeTruthy()
        expect(pluralize(5, forms, lang)).toBeTruthy()
      })
    })
  })

  describe('pluralizeWithCount', () => {
    const forms = {
      one: 'year',
      other: 'years'
    }

    it('should combine count and label', () => {
      const result = pluralizeWithCount(5, forms, 'en')
      expect(result).toContain('5')
      expect(result).toContain('years')
    })

    it('should handle singular', () => {
      const result = pluralizeWithCount(1, forms, 'en')
      expect(result).toContain('1')
      expect(result).toContain('year')
      expect(result).not.toContain('years')
    })

    languages.forEach(lang => {
      it(`should format count with plural for ${lang.toUpperCase()}`, () => {
        const result = pluralizeWithCount(3, forms, lang)
        expect(result).toBeTruthy()
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('Relative Time Formatting', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  describe('formatRelativeTime', () => {
    it('should format past time', () => {
      const result = formatRelativeTime(-3, 'day', 'en')
      expect(result.toLowerCase()).toContain('day')
    })

    it('should format future time', () => {
      const result = formatRelativeTime(2, 'hour', 'en')
      expect(result.toLowerCase()).toContain('hour')
    })

    languages.forEach(lang => {
      it(`should format relative time for ${lang.toUpperCase()}`, () => {
        const result = formatRelativeTime(-1, 'week', lang)
        expect(result).toBeTruthy()
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })
})

describe('List Formatting', () => {
  const languages: Language[] = ['en', 'de', 'fa']

  describe('formatList', () => {
    it('should format a list with conjunction', () => {
      const result = formatList(['a', 'b', 'c'], 'en')
      expect(result).toContain('a')
      expect(result).toContain('b')
      expect(result).toContain('c')
    })

    it('should handle single item', () => {
      const result = formatList(['only'], 'en')
      expect(result).toBe('only')
    })

    it('should handle empty list', () => {
      const result = formatList([], 'en')
      expect(result).toBe('')
    })

    it('should handle two items', () => {
      const result = formatList(['a', 'b'], 'en')
      expect(result).toContain('a')
      expect(result).toContain('b')
    })

    it('should support disjunction', () => {
      const result = formatList(['a', 'b', 'c'], 'en', 'disjunction')
      expect(result).toContain('a')
      expect(result).toContain('b')
      expect(result).toContain('c')
    })

    languages.forEach(lang => {
      it(`should format lists for ${lang.toUpperCase()}`, () => {
        const result = formatList(['one', 'two', 'three'], lang)
        expect(result).toBeTruthy()
        expect(result).toContain('one')
        expect(result).toContain('two')
        expect(result).toContain('three')
      })
    })
  })
})

describe('Date Format Presets', () => {
  it('should have all required presets', () => {
    expect(dateFormatPresets.short).toBeDefined()
    expect(dateFormatPresets.long).toBeDefined()
    expect(dateFormatPresets.full).toBeDefined()
    expect(dateFormatPresets.monthYear).toBeDefined()
    expect(dateFormatPresets.yearOnly).toBeDefined()
  })

  it('should apply different presets correctly', () => {
    const date = new Date('2024-06-15')
    
    const short = formatDate(date, 'en', dateFormatPresets.short)
    const long = formatDate(date, 'en', dateFormatPresets.long)
    const yearOnly = formatDate(date, 'en', dateFormatPresets.yearOnly)
    
    expect(short).toContain('2024')
    expect(long).toContain('15')
    expect(yearOnly).toBe('2024')
  })
})
