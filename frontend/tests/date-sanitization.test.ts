/**
 * F-03: Date sanitization/validation tests
 * 
 * Tests for robust date parsing/sanitization that handles invalid dates
 * in locked JSON files without editing the data files.
 * 
 * Policy: CLAMP_TO_LAST_VALID_DAY
 * - If the day exceeds the number of days in the month, clamp to the last valid day.
 * - Example: "2020-9-31" → "2020-09-30" (September has 30 days)
 */

import { describe, it, expect } from 'vitest'
import {
  sanitizeDateString,
  formatDateSafe,
  parseDateSafe,
  isValidDate,
} from '@/utils/dataValidation'

describe('sanitizeDateString', () => {
  describe('handles missing leading zeros', () => {
    it('should normalize "2020-9-15" to "2020-09-15"', () => {
      const result = sanitizeDateString('2020-9-15')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-09-15')
      expect(result?.wasModified).toBe(false)
    })

    it('should normalize "2020-1-5" to "2020-01-05"', () => {
      const result = sanitizeDateString('2020-1-5')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-01-05')
      expect(result?.wasModified).toBe(false)
    })

    it('should handle month-only dates "2020-9"', () => {
      const result = sanitizeDateString('2020-9')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-09-01')
    })

    it('should handle year-only dates "2020"', () => {
      const result = sanitizeDateString('2020')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-01-01')
    })
  })

  describe('clamps invalid day to last valid day of month', () => {
    it('should clamp "2020-9-31" to "2020-09-30" (September has 30 days)', () => {
      const result = sanitizeDateString('2020-9-31')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-09-30')
      expect(result?.wasModified).toBe(true)
      expect(result?.originalValue).toBe('2020-9-31')
    })

    it('should clamp "2020-02-30" to "2020-02-29" (leap year)', () => {
      const result = sanitizeDateString('2020-02-30')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-02-29')
      expect(result?.wasModified).toBe(true)
    })

    it('should clamp "2021-02-29" to "2021-02-28" (non-leap year)', () => {
      const result = sanitizeDateString('2021-02-29')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2021-02-28')
      expect(result?.wasModified).toBe(true)
    })

    it('should clamp "2020-04-31" to "2020-04-30" (April has 30 days)', () => {
      const result = sanitizeDateString('2020-04-31')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-04-30')
      expect(result?.wasModified).toBe(true)
    })

    it('should not modify valid dates like "2020-09-30"', () => {
      const result = sanitizeDateString('2020-09-30')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-09-30')
      expect(result?.wasModified).toBe(false)
    })

    it('should not modify valid dates like "2020-12-31"', () => {
      const result = sanitizeDateString('2020-12-31')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-12-31')
      expect(result?.wasModified).toBe(false)
    })
  })

  describe('handles invalid month values', () => {
    it('should clamp month 0 to 1', () => {
      const result = sanitizeDateString('2020-0-15')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-01-15')
      expect(result?.wasModified).toBe(true)
    })

    it('should clamp month 13 to 12', () => {
      const result = sanitizeDateString('2020-13-15')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-12-15')
      expect(result?.wasModified).toBe(true)
    })
  })

  describe('handles "present" equivalents', () => {
    const presentEquivalents = [
      'present',
      'Present',
      'PRESENT',
      'تاکنون',      // Persian: "until now"
      'حال حاضر',   // Persian: "current"
      'Gegenwart',  // German: "present"
      'heute',      // German: "today"
      'Heute',
      'aktuell',
      'Aktuell',
    ]

    presentEquivalents.forEach(value => {
      it(`should recognize "${value}" as present`, () => {
        const result = sanitizeDateString(value)
        expect(result).not.toBeNull()
        expect(result?.isoString).toBe('present')
      })
    })
  })

  describe('handles edge cases', () => {
    it('should return null for empty string', () => {
      expect(sanitizeDateString('')).toBeNull()
    })

    it('should return null for null', () => {
      expect(sanitizeDateString(null)).toBeNull()
    })

    it('should return null for undefined', () => {
      expect(sanitizeDateString(undefined)).toBeNull()
    })

    it('should return null for completely invalid strings', () => {
      expect(sanitizeDateString('not-a-date')).toBeNull()
    })

    it('should return null for numbers', () => {
      expect(sanitizeDateString(12345)).toBeNull()
    })

    it('should handle whitespace-padded dates', () => {
      const result = sanitizeDateString('  2020-09-15  ')
      expect(result).not.toBeNull()
      expect(result?.isoString).toBe('2020-09-15')
    })
  })
})

describe('formatDateSafe', () => {
  describe('formats valid dates correctly', () => {
    it('should format "2020-09-15" as "Sep 2020" by default', () => {
      const result = formatDateSafe('2020-09-15')
      expect(result).toBe('Sep 2020')
    })

    it('should format with custom options', () => {
      const result = formatDateSafe('2020-09-15', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      expect(result).toContain('September')
      expect(result).toContain('15')
      expect(result).toContain('2020')
    })
  })

  describe('handles invalid dates by clamping (no "Invalid Date" in output)', () => {
    it('should format "2020-9-31" as "Sep 2020" (clamped to Sep 30)', () => {
      const result = formatDateSafe('2020-9-31')
      expect(result).toBe('Sep 2020')
      expect(result).not.toContain('Invalid')
    })

    it('should format "2021-02-29" correctly (clamped to Feb 28)', () => {
      const result = formatDateSafe('2021-02-29')
      expect(result).toBe('Feb 2021')
      expect(result).not.toContain('Invalid')
    })
  })

  describe('handles "present" equivalents', () => {
    it('should return "Present" for "present"', () => {
      expect(formatDateSafe('present')).toBe('Present')
    })

    it('should return "Present" for "Present"', () => {
      expect(formatDateSafe('Present')).toBe('Present')
    })

    it('should return "Present" for German "heute"', () => {
      expect(formatDateSafe('heute')).toBe('Present')
    })

    it('should return "Present" for Persian "تاکنون"', () => {
      expect(formatDateSafe('تاکنون')).toBe('Present')
    })
  })

  describe('handles empty/null values', () => {
    it('should return empty string for null', () => {
      expect(formatDateSafe(null)).toBe('')
    })

    it('should return empty string for undefined', () => {
      expect(formatDateSafe(undefined)).toBe('')
    })

    it('should return empty string for empty string', () => {
      expect(formatDateSafe('')).toBe('')
    })

    it('should return empty string for completely unparseable dates', () => {
      expect(formatDateSafe('not-a-date')).toBe('')
    })
  })

  it('should never return "Invalid Date" in the output', () => {
    const testCases = [
      '2020-9-31',
      '2021-02-29',
      '2020-13-01',
      '2020-0-15',
      '2020-04-31',
      'garbage',
      '',
      null,
      undefined,
    ]

    testCases.forEach(value => {
      const result = formatDateSafe(value)
      expect(result).not.toContain('Invalid')
    })
  })
})

describe('parseDateSafe', () => {
  describe('parses valid dates', () => {
    it('should parse "2020-09-15"', () => {
      const result = parseDateSafe('2020-09-15')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2020)
      expect(result?.getMonth()).toBe(8) // 0-indexed
      expect(result?.getDate()).toBe(15)
    })
  })

  describe('parses and clamps invalid dates', () => {
    it('should parse "2020-9-31" by clamping to Sep 30', () => {
      const result = parseDateSafe('2020-9-31')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2020)
      expect(result?.getMonth()).toBe(8) // September
      expect(result?.getDate()).toBe(30) // Clamped from 31
    })

    it('should parse "2021-02-29" by clamping to Feb 28', () => {
      const result = parseDateSafe('2021-02-29')
      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2021)
      expect(result?.getMonth()).toBe(1) // February
      expect(result?.getDate()).toBe(28) // Clamped from 29
    })
  })

  describe('handles "present" equivalents', () => {
    it('should return current date for "present"', () => {
      const result = parseDateSafe('present')
      expect(result).toBeInstanceOf(Date)
      // Check it's approximately now (within 1 minute)
      const now = new Date()
      expect(Math.abs((result?.getTime() || 0) - now.getTime())).toBeLessThan(60000)
    })
  })

  describe('returns null for unparseable values', () => {
    it('should return null for empty string', () => {
      expect(parseDateSafe('')).toBeNull()
    })

    it('should return null for null', () => {
      expect(parseDateSafe(null)).toBeNull()
    })

    it('should return null for garbage input', () => {
      expect(parseDateSafe('not-a-date')).toBeNull()
    })
  })
})

describe('isValidDate', () => {
  describe('returns true for valid/clampable dates', () => {
    it('should return true for "2020-09-15"', () => {
      expect(isValidDate('2020-09-15')).toBe(true)
    })

    it('should return true for "2020-9-15" (missing leading zeros)', () => {
      expect(isValidDate('2020-9-15')).toBe(true)
    })

    it('should return true for "2020-9-31" (will be clamped)', () => {
      expect(isValidDate('2020-9-31')).toBe(true)
    })

    it('should return true for "present"', () => {
      expect(isValidDate('present')).toBe(true)
    })

    it('should return true for numeric timestamps', () => {
      expect(isValidDate(Date.now())).toBe(true)
    })
  })

  describe('returns false for invalid values', () => {
    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false)
    })

    it('should return false for null', () => {
      expect(isValidDate(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false)
    })

    it('should return false for garbage strings', () => {
      expect(isValidDate('not-a-date')).toBe(false)
    })
  })
})

describe('Integration: Locked CV JSON date handling', () => {
  /**
   * This test verifies that the specific invalid date in the locked CV JSON
   * (2020-9-31 from certifications) is handled correctly without:
   * 1. Modifying the locked JSON file
   * 2. Showing "Invalid Date" in the UI
   * 3. Crashing the application
   */
  it('should handle "2020-9-31" from locked CV JSON gracefully', () => {
    // The date from cv.json: "2020-9-31" (September has only 30 days)
    const invalidDateFromJson = '2020-9-31'
    
    // Verify it can be sanitized
    const sanitized = sanitizeDateString(invalidDateFromJson)
    expect(sanitized).not.toBeNull()
    expect(sanitized?.isoString).toBe('2020-09-30') // Clamped to last valid day
    expect(sanitized?.wasModified).toBe(true)
    
    // Verify it can be formatted for display
    const formatted = formatDateSafe(invalidDateFromJson)
    expect(formatted).toBe('Sep 2020')
    expect(formatted).not.toContain('Invalid')
    expect(formatted).not.toContain('undefined')
    
    // Verify it can be parsed for sorting
    const parsed = parseDateSafe(invalidDateFromJson)
    expect(parsed).toBeInstanceOf(Date)
    expect(parsed?.getFullYear()).toBe(2020)
    expect(parsed?.getMonth()).toBe(8) // September (0-indexed)
    expect(parsed?.getDate()).toBe(30) // Clamped
    
    // Verify isValidDate returns true (it's clampable)
    expect(isValidDate(invalidDateFromJson)).toBe(true)
  })
})
