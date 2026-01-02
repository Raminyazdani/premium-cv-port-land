/**
 * Tests for Education Feature Module - Format utilities
 * 
 * Tests the formatting functions for education-related data.
 */

import { describe, it, expect } from 'vitest'
import {
  formatEducationDateRange,
  formatEducationDate,
  isCurrentEducation,
  formatGpa,
  formatStudyTypeAndArea,
  getEducationDuration,
} from '@/features/education/format'

describe('formatEducationDateRange', () => {
  it('formats a complete date range', () => {
    const result = formatEducationDateRange('2020-09-01', '2022-05-15')
    expect(result).toContain('2020')
    expect(result).toContain('2022')
    expect(result).toContain('–')
  })

  it('uses Present for missing end date', () => {
    const result = formatEducationDateRange('2020-09-01', null)
    expect(result).toContain('2020')
    expect(result).toContain('Present')
  })

  it('uses custom present label', () => {
    const result = formatEducationDateRange('2020-09-01', null, 'Ongoing')
    expect(result).toContain('Ongoing')
  })

  it('handles "present" as end date', () => {
    const result = formatEducationDateRange('2020-09-01', 'present')
    expect(result).toContain('Present')
  })

  it('returns empty string for invalid dates', () => {
    const result = formatEducationDateRange(null, null)
    expect(result).toBe('')
  })
})

describe('formatEducationDate', () => {
  it('formats a date with default format', () => {
    const result = formatEducationDate('2020-09-15', 'medium')
    expect(result).toContain('2020')
    expect(result).toContain('Sep')
  })

  it('handles short format', () => {
    const result = formatEducationDate('2020-09-15', 'short')
    expect(result).toContain('2020')
  })

  it('returns empty string for null', () => {
    const result = formatEducationDate(null)
    expect(result).toBe('')
  })

  it('returns empty string for undefined', () => {
    const result = formatEducationDate(undefined)
    expect(result).toBe('')
  })
})

describe('isCurrentEducation', () => {
  it('returns true for null end date', () => {
    expect(isCurrentEducation(null)).toBe(true)
  })

  it('returns true for undefined end date', () => {
    expect(isCurrentEducation(undefined)).toBe(true)
  })

  it('returns true for "present"', () => {
    expect(isCurrentEducation('present')).toBe(true)
    expect(isCurrentEducation('Present')).toBe(true)
  })

  it('returns false for specific end date', () => {
    expect(isCurrentEducation('2022-05-15')).toBe(false)
  })

  it('returns true for German "Gegenwart"', () => {
    expect(isCurrentEducation('Gegenwart')).toBe(true)
  })
})

describe('formatGpa', () => {
  it('formats GPA with default label', () => {
    const result = formatGpa('3.9')
    expect(result).toBe('GPA: 3.9')
  })

  it('uses custom label', () => {
    const result = formatGpa('3.9', 'Grade:')
    expect(result).toBe('Grade: 3.9')
  })

  it('returns empty string for null', () => {
    const result = formatGpa(null)
    expect(result).toBe('')
  })

  it('returns empty string for empty string', () => {
    const result = formatGpa('')
    expect(result).toBe('')
  })

  it('returns empty string for whitespace only', () => {
    const result = formatGpa('   ')
    expect(result).toBe('')
  })
})

describe('formatStudyTypeAndArea', () => {
  it('combines study type and area', () => {
    const result = formatStudyTypeAndArea("Master's", 'Computer Science')
    expect(result).toBe("Master's in Computer Science")
  })

  it('uses custom connector', () => {
    const result = formatStudyTypeAndArea("Master's", 'Computer Science', 'of')
    expect(result).toBe("Master's of Computer Science")
  })

  it('returns only study type when area is missing', () => {
    const result = formatStudyTypeAndArea("Master's", null)
    expect(result).toBe("Master's")
  })

  it('returns only area when study type is missing', () => {
    const result = formatStudyTypeAndArea(null, 'Computer Science')
    expect(result).toBe('Computer Science')
  })

  it('returns empty string when both are missing', () => {
    const result = formatStudyTypeAndArea(null, null)
    expect(result).toBe('')
  })

  it('trims whitespace', () => {
    const result = formatStudyTypeAndArea("  Master's  ", '  Computer Science  ')
    expect(result).toBe("Master's in Computer Science")
  })
})

describe('getEducationDuration', () => {
  it('calculates duration in years', () => {
    const result = getEducationDuration('2020-01-01', '2022-01-01')
    expect(result).toBe('2 years')
  })

  it('calculates duration in months for short periods', () => {
    const result = getEducationDuration('2020-01-01', '2020-06-01')
    expect(result).toContain('month')
  })

  it('handles singular year', () => {
    const result = getEducationDuration('2020-01-01', '2021-01-01')
    expect(result).toBe('1 year')
  })

  it('handles singular month', () => {
    const result = getEducationDuration('2020-01-01', '2020-02-01')
    expect(result).toBe('1 month')
  })

  it('returns empty string for null start date', () => {
    const result = getEducationDuration(null, '2022-01-01')
    expect(result).toBe('')
  })

  it('uses current date for ongoing education', () => {
    const result = getEducationDuration('2020-01-01', 'present')
    expect(result).toContain('year')
  })
})
