/**
 * Tests for shared domain utilities.
 */

import { describe, it, expect } from 'vitest'
import {
  DOMAIN_KEYS,
  mapTypeKeyToDomainLabel,
  getUniqueDomainLabels,
  collectAllDomainLabels,
  filterByDomainLabels,
  matchesDomainFilter,
} from '@/shared/utils/domain-utils'

describe('DOMAIN_KEYS', () => {
  it('contains all expected domain keys', () => {
    expect(DOMAIN_KEYS).toContain('programming')
    expect(DOMAIN_KEYS).toContain('bioinformatics')
    expect(DOMAIN_KEYS).toContain('biotechnology')
    expect(DOMAIN_KEYS).toContain('academic')
    expect(DOMAIN_KEYS).toContain('industry')
    expect(DOMAIN_KEYS).toContain('robotics')
    expect(DOMAIN_KEYS).toContain('embedded_systems')
    expect(DOMAIN_KEYS).toContain('student_projects')
  })
})

describe('mapTypeKeyToDomainLabel', () => {
  it('maps programming key to label in English', () => {
    const label = mapTypeKeyToDomainLabel('programming', 'en')
    expect(label).toBe('Programming')
  })

  it('maps programming key to label in German', () => {
    const label = mapTypeKeyToDomainLabel('programming', 'de')
    expect(label).toBe('Programmierung')
  })

  it('maps programming key to label in Persian', () => {
    const label = mapTypeKeyToDomainLabel('programming', 'fa')
    expect(label).toBe('برنامه‌نویسی')
  })

  it('handles case-insensitive input', () => {
    expect(mapTypeKeyToDomainLabel('PROGRAMMING', 'en')).toBe('Programming')
    expect(mapTypeKeyToDomainLabel('Programming', 'en')).toBe('Programming')
  })

  it('returns null for unrecognized keys', () => {
    expect(mapTypeKeyToDomainLabel('unknown', 'en')).toBeNull()
    expect(mapTypeKeyToDomainLabel('', 'en')).toBeNull()
  })

  it('handles German language variant keys', () => {
    const label = mapTypeKeyToDomainLabel('programmierung', 'en')
    expect(label).toBe('Programming')
  })

  it('handles Persian language variant keys', () => {
    const label = mapTypeKeyToDomainLabel('برنامه‌نویسی', 'en')
    expect(label).toBe('Programming')
  })

  it('maps all domain keys correctly', () => {
    const mappings: Record<string, string> = {
      'bioinformatics': 'Bioinformatics',
      'biotechnology': 'Biotechnology',
      'academic': 'Academic',
      'industry': 'Industry',
      'robotics': 'Robotics',
      'embedded systems': 'Embedded Systems',
      'student projects': 'Student Projects',
    }

    for (const [key, expected] of Object.entries(mappings)) {
      expect(mapTypeKeyToDomainLabel(key, 'en')).toBe(expected)
    }
  })
})

describe('getUniqueDomainLabels', () => {
  it('returns unique labels from type keys', () => {
    const labels = getUniqueDomainLabels(['programming', 'academic', 'programming'], 'en')
    expect(labels).toHaveLength(2)
    expect(labels).toContain('Programming')
    expect(labels).toContain('Academic')
  })

  it('returns empty array for null input', () => {
    expect(getUniqueDomainLabels(null, 'en')).toEqual([])
  })

  it('returns empty array for undefined input', () => {
    expect(getUniqueDomainLabels(undefined, 'en')).toEqual([])
  })

  it('returns empty array for empty array', () => {
    expect(getUniqueDomainLabels([], 'en')).toEqual([])
  })

  it('filters out unrecognized keys', () => {
    const labels = getUniqueDomainLabels(['programming', 'unknown', 'invalid'], 'en')
    expect(labels).toHaveLength(1)
    expect(labels).toContain('Programming')
  })

  it('returns labels in target language', () => {
    const labelsEn = getUniqueDomainLabels(['programming'], 'en')
    const labelsDe = getUniqueDomainLabels(['programming'], 'de')
    const labelsFa = getUniqueDomainLabels(['programming'], 'fa')

    expect(labelsEn).toContain('Programming')
    expect(labelsDe).toContain('Programmierung')
    expect(labelsFa).toContain('برنامه‌نویسی')
  })
})

describe('collectAllDomainLabels', () => {
  it('collects labels from multiple items', () => {
    const items = [
      { type_key: ['programming'] },
      { type_key: ['academic'] },
      { type_key: ['bioinformatics'] },
    ]

    const labels = collectAllDomainLabels(items, 'en')
    expect(labels).toHaveLength(3)
    expect(labels).toContain('Programming')
    expect(labels).toContain('Academic')
    expect(labels).toContain('Bioinformatics')
  })

  it('returns sorted labels', () => {
    const items = [
      { type_key: ['robotics'] },
      { type_key: ['academic'] },
      { type_key: ['biotechnology'] },
    ]

    const labels = collectAllDomainLabels(items, 'en')
    expect(labels[0]).toBe('Academic')
    expect(labels[1]).toBe('Biotechnology')
    expect(labels[2]).toBe('Robotics')
  })

  it('handles items without type_key', () => {
    const items = [
      { type_key: ['programming'] },
      { title: 'No type key' },
      { type_key: null },
    ]

    const labels = collectAllDomainLabels(items, 'en')
    expect(labels).toHaveLength(1)
    expect(labels).toContain('Programming')
  })

  it('returns empty array for empty items', () => {
    expect(collectAllDomainLabels([], 'en')).toEqual([])
  })
})

describe('filterByDomainLabels', () => {
  const items = [
    { id: 1, type_key: ['programming'] },
    { id: 2, type_key: ['academic'] },
    { id: 3, type_key: ['programming', 'academic'] },
    { id: 4, type_key: ['bioinformatics'] },
  ]

  it('returns all items when no domains selected', () => {
    const filtered = filterByDomainLabels(items, new Set(), 'en')
    expect(filtered).toHaveLength(4)
  })

  it('filters items by single domain', () => {
    const filtered = filterByDomainLabels(items, new Set(['Programming']), 'en')
    expect(filtered).toHaveLength(2)
    expect(filtered.map(i => i.id)).toEqual([1, 3])
  })

  it('filters items by multiple domains (OR logic)', () => {
    const filtered = filterByDomainLabels(items, new Set(['Programming', 'Bioinformatics']), 'en')
    expect(filtered).toHaveLength(3)
    expect(filtered.map(i => i.id)).toEqual([1, 3, 4])
  })

  it('returns empty array when no items match', () => {
    const filtered = filterByDomainLabels(items, new Set(['Industry']), 'en')
    expect(filtered).toHaveLength(0)
  })
})

describe('matchesDomainFilter', () => {
  it('returns true when no domains selected', () => {
    expect(matchesDomainFilter(['programming'], new Set(), 'en')).toBe(true)
  })

  it('returns true when item has matching domain', () => {
    expect(matchesDomainFilter(['programming'], new Set(['Programming']), 'en')).toBe(true)
  })

  it('returns false when item does not have matching domain', () => {
    expect(matchesDomainFilter(['programming'], new Set(['Academic']), 'en')).toBe(false)
  })

  it('returns true when item has any of selected domains', () => {
    expect(
      matchesDomainFilter(['programming', 'academic'], new Set(['Academic', 'Industry']), 'en')
    ).toBe(true)
  })

  it('returns true for null type_key when no domains selected', () => {
    expect(matchesDomainFilter(null, new Set(), 'en')).toBe(true)
  })

  it('returns false for null type_key when domains are selected', () => {
    expect(matchesDomainFilter(null, new Set(['Programming']), 'en')).toBe(false)
  })
})
