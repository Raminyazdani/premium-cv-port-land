/**
 * Tests for Shared Format Utilities - Text formatting
 */

import { describe, it, expect } from 'vitest'
import {
  safeText,
  truncateText,
  joinNonEmpty,
  formatStudyTypeAndArea,
  capitalizeFirst,
  getInitials,
} from '@/shared/format/text'

describe('safeText', () => {
  it('returns string value as-is', () => {
    expect(safeText('hello')).toBe('hello')
  })

  it('returns fallback for null', () => {
    expect(safeText(null, 'default')).toBe('default')
  })

  it('returns fallback for undefined', () => {
    expect(safeText(undefined, 'default')).toBe('default')
  })

  it('converts number to string', () => {
    expect(safeText(42)).toBe('42')
  })

  it('returns empty string as default fallback', () => {
    expect(safeText(null)).toBe('')
  })

  it('returns fallback for objects', () => {
    expect(safeText({}, 'fallback')).toBe('fallback')
  })
})

describe('truncateText', () => {
  it('does not truncate short text', () => {
    expect(truncateText('hello', 10)).toBe('hello')
  })

  it('truncates long text with ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello...')
  })

  it('uses custom ellipsis', () => {
    expect(truncateText('hello world', 5, '…')).toBe('hello…')
  })

  it('returns empty string for null', () => {
    expect(truncateText(null, 10)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(truncateText(undefined, 10)).toBe('')
  })

  it('trims whitespace at truncation point', () => {
    expect(truncateText('hello   world', 8)).toBe('hello...')
  })
})

describe('joinNonEmpty', () => {
  it('joins non-empty strings', () => {
    expect(joinNonEmpty(['a', 'b', 'c'])).toBe('a, b, c')
  })

  it('filters out null values', () => {
    expect(joinNonEmpty(['a', null, 'c'])).toBe('a, c')
  })

  it('filters out undefined values', () => {
    expect(joinNonEmpty(['a', undefined, 'c'])).toBe('a, c')
  })

  it('filters out empty strings', () => {
    expect(joinNonEmpty(['a', '', 'c'])).toBe('a, c')
  })

  it('filters out whitespace-only strings', () => {
    expect(joinNonEmpty(['a', '   ', 'c'])).toBe('a, c')
  })

  it('uses custom separator', () => {
    expect(joinNonEmpty(['a', 'b', 'c'], ' | ')).toBe('a | b | c')
  })

  it('returns empty string for empty array', () => {
    expect(joinNonEmpty([])).toBe('')
  })
})

describe('formatStudyTypeAndArea', () => {
  it('combines study type and area', () => {
    expect(formatStudyTypeAndArea("Master's", 'CS')).toBe("Master's in CS")
  })

  it('returns study type when area is null', () => {
    expect(formatStudyTypeAndArea("Master's", null)).toBe("Master's")
  })

  it('returns area when study type is null', () => {
    expect(formatStudyTypeAndArea(null, 'CS')).toBe('CS')
  })

  it('returns empty string when both are null', () => {
    expect(formatStudyTypeAndArea(null, null)).toBe('')
  })

  it('uses custom connector', () => {
    expect(formatStudyTypeAndArea('PhD', 'Biology', 'of')).toBe('PhD of Biology')
  })
})

describe('capitalizeFirst', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello')
  })

  it('handles already capitalized', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello')
  })

  it('handles single letter', () => {
    expect(capitalizeFirst('a')).toBe('A')
  })

  it('returns empty string for null', () => {
    expect(capitalizeFirst(null)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(capitalizeFirst('')).toBe('')
  })
})

describe('getInitials', () => {
  it('gets initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('gets single initial from single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('handles multiple names', () => {
    expect(getInitials('John Michael Doe')).toBe('JD')
  })

  it('returns fallback for null', () => {
    expect(getInitials(null, '?')).toBe('?')
  })

  it('returns fallback for empty string', () => {
    expect(getInitials('', 'N/A')).toBe('N/A')
  })

  it('handles extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD')
  })
})
