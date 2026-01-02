/**
 * Tests for Shared Format Utilities - Date formatting
 */

import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateRange,
  sortByDateDesc,
  sortByDateAsc,
  getDateFormatOptions,
} from '@/shared/format/date'

describe('getDateFormatOptions', () => {
  it('returns correct options for short format', () => {
    const options = getDateFormatOptions('short')
    expect(options.year).toBe('numeric')
    expect(options.month).toBe('short')
  })

  it('returns correct options for long format', () => {
    const options = getDateFormatOptions('long')
    expect(options.year).toBe('numeric')
    expect(options.month).toBe('long')
    expect(options.day).toBe('numeric')
  })

  it('returns correct options for year-only format', () => {
    const options = getDateFormatOptions('year-only')
    expect(options.year).toBe('numeric')
    expect(options.month).toBeUndefined()
  })
})

describe('formatDate', () => {
  it('formats a valid date', () => {
    const result = formatDate('2020-09-15', 'short')
    expect(result).toContain('2020')
    expect(result).toContain('Sep')
  })

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('returns "Present" for present value', () => {
    expect(formatDate('present')).toBe('Present')
    expect(formatDate('Present')).toBe('Present')
  })

  it('handles German present equivalent', () => {
    expect(formatDate('Gegenwart')).toBe('Present')
  })

  it('returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('formatDateRange', () => {
  it('formats a complete date range', () => {
    const result = formatDateRange('2020-01-01', '2022-12-31')
    expect(result).toContain('2020')
    expect(result).toContain('2022')
    expect(result).toContain('–')
  })

  it('uses Present label for null end date', () => {
    const result = formatDateRange('2020-01-01', null)
    expect(result).toContain('Present')
  })

  it('uses custom present label', () => {
    const result = formatDateRange('2020-01-01', null, 'short', 'en-US', 'Ongoing')
    expect(result).toContain('Ongoing')
  })

  it('returns empty string when both dates are null', () => {
    expect(formatDateRange(null, null)).toBe('')
  })

  it('returns end date when only start is null', () => {
    const result = formatDateRange(null, '2022-12-31')
    expect(result).toContain('2022')
    expect(result).not.toContain('–')
  })
})

describe('sortByDateDesc', () => {
  it('sorts items by date newest first', () => {
    const items = [
      { id: 1, date: '2020-01-01' },
      { id: 2, date: '2022-01-01' },
      { id: 3, date: '2021-01-01' },
    ]

    const result = sortByDateDesc(items, item => item.date)

    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(3)
    expect(result[2].id).toBe(1)
  })

  it('places items without dates at the end', () => {
    const items = [
      { id: 1, date: null },
      { id: 2, date: '2022-01-01' },
    ]

    const result = sortByDateDesc(items, item => item.date)

    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(1)
  })

  it('does not mutate original array', () => {
    const items = [
      { id: 1, date: '2020-01-01' },
      { id: 2, date: '2022-01-01' },
    ]

    const result = sortByDateDesc(items, item => item.date)

    expect(items[0].id).toBe(1) // Original unchanged
    expect(result).not.toBe(items) // Different array reference
  })
})

describe('sortByDateAsc', () => {
  it('sorts items by date oldest first', () => {
    const items = [
      { id: 1, date: '2022-01-01' },
      { id: 2, date: '2020-01-01' },
      { id: 3, date: '2021-01-01' },
    ]

    const result = sortByDateAsc(items, item => item.date)

    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(3)
    expect(result[2].id).toBe(1)
  })
})
