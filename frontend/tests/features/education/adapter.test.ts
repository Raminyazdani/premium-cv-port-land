/**
 * Tests for Education Feature Module - Adapter
 * 
 * Tests the data transformation from raw CV data to view models.
 */

import { describe, it, expect } from 'vitest'
import {
  toEducationViewModel,
  toEducationViewModels,
  filterByFocus,
  filterByTag,
  sortByDateDesc,
  extractTags,
} from '@/features/education/adapter'
import type { Education } from '@/types/cv'
import type { EducationViewModel } from '@/features/education/model'

const mockTranslations = {
  unknownInstitution: 'Unknown Institution',
}

/**
 * Creates a mock EducationViewModel with default values.
 * Reduces test boilerplate for creating view model objects.
 */
function createMockViewModel(
  overrides: Partial<EducationViewModel>
): EducationViewModel {
  return {
    id: 'test-id',
    institution: 'Test',
    studyType: '',
    area: '',
    studyDescription: '',
    location: '',
    dateRange: '',
    startDate: null,
    endDate: null,
    gpa: '',
    logoUrl: null,
    tags: [],
    typeKey: [],
    isCurrent: false,
    ...overrides,
  }
}

describe('toEducationViewModel', () => {
  it('transforms a complete education entry to view model', () => {
    const education: Education = {
      institution: 'MIT',
      studyType: "Master's",
      area: 'Computer Science',
      location: 'Cambridge, MA',
      startDate: '2020-09-01',
      endDate: '2022-05-15',
      gpa: '3.9',
      logo_url: 'https://example.com/logo.png',
      type_key: ['Academic', 'Full CV'],
    }

    const result = toEducationViewModel(education, 0, mockTranslations)

    expect(result.id).toContain('education-0-mit')
    expect(result.institution).toBe('MIT')
    expect(result.studyType).toBe("Master's")
    expect(result.area).toBe('Computer Science')
    expect(result.studyDescription).toBe("Master's in Computer Science")
    expect(result.location).toBe('Cambridge, MA')
    expect(result.gpa).toBe('3.9')
    expect(result.logoUrl).toBe('https://example.com/logo.png')
    expect(result.tags).toEqual(['Academic']) // Full CV filtered out
    expect(result.typeKey).toEqual(['Academic', 'Full CV'])
    expect(result.isCurrent).toBe(false)
  })

  it('handles missing optional fields', () => {
    const education: Education = {
      institution: 'University X',
    }

    const result = toEducationViewModel(education, 0, mockTranslations)

    expect(result.institution).toBe('University X')
    expect(result.studyType).toBe('')
    expect(result.area).toBe('')
    expect(result.studyDescription).toBe('')
    expect(result.location).toBe('')
    expect(result.gpa).toBe('')
    expect(result.logoUrl).toBeNull()
    expect(result.tags).toEqual([])
    expect(result.typeKey).toEqual([])
  })

  it('uses fallback for missing institution', () => {
    const education: Education = {}

    const result = toEducationViewModel(education, 0, mockTranslations)

    expect(result.institution).toBe('Unknown Institution')
  })

  it('creates correct study description with only studyType', () => {
    const education: Education = {
      institution: 'Test',
      studyType: 'PhD',
    }

    const result = toEducationViewModel(education, 0, mockTranslations)
    expect(result.studyDescription).toBe('PhD')
  })

  it('creates correct study description with only area', () => {
    const education: Education = {
      institution: 'Test',
      area: 'Biology',
    }

    const result = toEducationViewModel(education, 0, mockTranslations)
    expect(result.studyDescription).toBe('Biology')
  })

  it('identifies current education (no end date)', () => {
    const education: Education = {
      institution: 'University Y',
      startDate: '2023-01-01',
    }

    const result = toEducationViewModel(education, 0, mockTranslations)
    expect(result.isCurrent).toBe(true)
  })
})

describe('toEducationViewModels', () => {
  it('transforms an array of education entries', () => {
    const educationData: Education[] = [
      { institution: 'University A', studyType: "Bachelor's" },
      { institution: 'University B', studyType: "Master's" },
    ]

    const results = toEducationViewModels(educationData, mockTranslations)

    expect(results).toHaveLength(2)
    expect(results[0].institution).toBe('University A')
    expect(results[1].institution).toBe('University B')
  })

  it('handles empty array', () => {
    const results = toEducationViewModels([], mockTranslations)
    expect(results).toEqual([])
  })
})

describe('filterByFocus', () => {
  const viewModels = [
    createMockViewModel({ id: '1', typeKey: ['Academic', 'Full CV'], tags: ['Academic'] }),
    createMockViewModel({ id: '2', typeKey: ['Industry', 'Full CV'], tags: ['Industry'] }),
    createMockViewModel({ id: '3', typeKey: [], tags: [] }),
  ]

  it('returns all items for "Full CV" focus', () => {
    const result = filterByFocus(viewModels, 'Full CV')
    expect(result).toHaveLength(3)
  })

  it('returns all items for empty focus', () => {
    const result = filterByFocus(viewModels, '')
    expect(result).toHaveLength(3)
  })

  it('filters by specific focus', () => {
    const result = filterByFocus(viewModels, 'Academic')
    expect(result).toHaveLength(2) // Matches 'Academic' + empty typeKey
    expect(result.find(vm => vm.id === '1')).toBeDefined()
    expect(result.find(vm => vm.id === '3')).toBeDefined()
  })

  it('case-insensitive matching', () => {
    const result = filterByFocus(viewModels, 'academic')
    expect(result.find(vm => vm.id === '1')).toBeDefined()
  })
})

describe('filterByTag', () => {
  const viewModels = [
    createMockViewModel({ id: '1', typeKey: ['Programming'], tags: ['Programming'] }),
    createMockViewModel({ id: '2', typeKey: ['Design'], tags: ['Design'] }),
  ]

  it('returns all items when tag is allLabel', () => {
    const result = filterByTag(viewModels, 'All', 'All')
    expect(result).toHaveLength(2)
  })

  it('returns all items when tag is empty', () => {
    const result = filterByTag(viewModels, '', 'All')
    expect(result).toHaveLength(2)
  })

  it('filters by specific tag', () => {
    const result = filterByTag(viewModels, 'Programming', 'All')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})

describe('sortByDateDesc', () => {
  it('sorts by start date newest first', () => {
    const viewModels = [
      createMockViewModel({ id: '1', startDate: new Date('2020-01-01') }),
      createMockViewModel({ id: '2', startDate: new Date('2022-01-01') }),
      createMockViewModel({ id: '3', startDate: new Date('2021-01-01') }),
    ]

    const result = sortByDateDesc(viewModels)

    expect(result[0].id).toBe('2')
    expect(result[1].id).toBe('3')
    expect(result[2].id).toBe('1')
  })

  it('places items without dates at the end', () => {
    const viewModels = [
      createMockViewModel({ id: '1', startDate: null }),
      createMockViewModel({ id: '2', startDate: new Date('2022-01-01') }),
    ]

    const result = sortByDateDesc(viewModels)

    expect(result[0].id).toBe('2')
    expect(result[1].id).toBe('1')
  })

  it('does not mutate original array', () => {
    const original = [
      createMockViewModel({ id: '1', startDate: new Date('2020-01-01') }),
      createMockViewModel({ id: '2', startDate: new Date('2022-01-01') }),
    ]

    const result = sortByDateDesc(original)

    expect(original[0].id).toBe('1') // Original unchanged
    expect(result[0].id).toBe('2')   // Result is sorted
    expect(result).not.toBe(original) // Different array reference
  })
})

describe('extractTags', () => {
  it('extracts unique tags from view models', () => {
    const viewModels = [
      createMockViewModel({ tags: ['Programming', 'Academic'] }),
      createMockViewModel({ tags: ['Programming', 'Industry'] }),
    ]

    const result = extractTags(viewModels)

    expect(result).toHaveLength(3)
    expect(result).toContain('Academic')
    expect(result).toContain('Industry')
    expect(result).toContain('Programming')
  })

  it('returns sorted tags', () => {
    const viewModels = [
      createMockViewModel({ tags: ['Zebra', 'Apple'] }),
    ]

    const result = extractTags(viewModels)

    expect(result[0]).toBe('Apple')
    expect(result[1]).toBe('Zebra')
  })

  it('handles empty array', () => {
    const result = extractTags([])
    expect(result).toEqual([])
  })
})
