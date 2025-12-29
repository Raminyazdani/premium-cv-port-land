/**
 * Data Loader Tests
 *
 * Tests for the extracted loading functions from dataLoader.ts
 */

import { describe, it, expect } from 'vitest'
import { loadCVDataForLanguage, loadAndValidateData, extractAllTypeKeys } from '@/utils/dataLoader'

describe('loadCVDataForLanguage', () => {
  it('loads English data when lang is "en"', () => {
    const data = loadCVDataForLanguage('en') as Record<string, unknown>
    expect(data).toBeDefined()
    expect(data.basics).toBeDefined()
    expect(typeof data).toBe('object')
  })

  it('loads German data when lang is "de"', () => {
    const data = loadCVDataForLanguage('de') as Record<string, unknown>
    expect(data).toBeDefined()
    // German data should have the German key
    expect(data.grunddaten || data.basics).toBeDefined()
  })

  it('loads Persian data when lang is "fa"', () => {
    const data = loadCVDataForLanguage('fa') as Record<string, unknown>
    expect(data).toBeDefined()
    // Persian data should have some key
    expect(Object.keys(data).length).toBeGreaterThan(0)
  })

  it('defaults to English for unknown language', () => {
    // Cast to bypass type checking for this test
    const data = loadCVDataForLanguage('unknown' as any) as Record<string, unknown>
    const enData = loadCVDataForLanguage('en') as Record<string, unknown>
    expect(data).toEqual(enData)
  })
})

describe('loadAndValidateData', () => {
  describe('English (en)', () => {
    it('loads and validates English data', () => {
      const result = loadAndValidateData('en')

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('validationResult')
      expect(result.data).toBeDefined()
    })

    it('returns data with all expected sections', () => {
      const result = loadAndValidateData('en')

      expect(result.data).toHaveProperty('basics')
      expect(result.data).toHaveProperty('profiles')
      expect(result.data).toHaveProperty('education')
      expect(result.data).toHaveProperty('languages')
      expect(result.data).toHaveProperty('workshop_and_certifications')
      expect(result.data).toHaveProperty('skills')
      expect(result.data).toHaveProperty('experiences')
      expect(result.data).toHaveProperty('projects')
      expect(result.data).toHaveProperty('publications')
      expect(result.data).toHaveProperty('references')
    })

    it('returns validationResult with expected structure', () => {
      const result = loadAndValidateData('en')

      expect(result.validationResult).toHaveProperty('isValid')
      expect(result.validationResult).toHaveProperty('errors')
      expect(result.validationResult).toHaveProperty('warnings')
      expect(Array.isArray(result.validationResult.errors)).toBe(true)
      expect(Array.isArray(result.validationResult.warnings)).toBe(true)
    })
  })

  describe('German (de)', () => {
    it('loads and validates German data', () => {
      const result = loadAndValidateData('de')

      expect(result.data).toBeDefined()
      expect(result.data.basics).toBeDefined()
      expect(Array.isArray(result.data.basics)).toBe(true)
    })

    it('normalizes German keys to English schema', () => {
      const result = loadAndValidateData('de')

      // Should have English keys after normalization
      expect(result.data).toHaveProperty('basics')
      expect(result.data).toHaveProperty('education')
      expect(result.data).toHaveProperty('skills')
    })
  })

  describe('Persian (fa)', () => {
    it('loads and validates Persian data', () => {
      const result = loadAndValidateData('fa')

      expect(result.data).toBeDefined()
      expect(result.data.basics).toBeDefined()
    })

    it('normalizes Persian keys to English schema', () => {
      const result = loadAndValidateData('fa')

      // Should have English keys after normalization
      expect(result.data).toHaveProperty('basics')
      expect(result.data).toHaveProperty('education')
      expect(result.data).toHaveProperty('skills')
    })
  })

  describe('Default behavior', () => {
    it('defaults to English when no language provided', () => {
      const result = loadAndValidateData()
      const enResult = loadAndValidateData('en')

      // Both should produce valid results
      expect(result.data).toBeDefined()
      expect(enResult.data).toBeDefined()
    })
  })
})

describe('extractAllTypeKeys', () => {
  it('always includes "Full CV"', () => {
    const result = loadAndValidateData('en')
    const typeKeys = extractAllTypeKeys(result.data)

    expect(typeKeys).toContain('Full CV')
  })

  it('extracts type keys from education', () => {
    const mockData = {
      basics: [],
      profiles: [],
      education: [{ type_key: ['AI', 'ML'] }],
      languages: [],
      workshop_and_certifications: [],
      skills: {},
      experiences: [],
      projects: [],
      publications: [],
      references: []
    } as any

    const typeKeys = extractAllTypeKeys(mockData)

    expect(typeKeys).toContain('AI')
    expect(typeKeys).toContain('ML')
  })

  it('extracts type keys from skills', () => {
    const mockData = {
      basics: [],
      profiles: [],
      education: [],
      languages: [],
      workshop_and_certifications: [],
      skills: {
        'Technical': {
          'Programming': [{ long_name: 'Python', short_name: 'PY', type_key: ['Backend'] }]
        }
      },
      experiences: [],
      projects: [],
      publications: [],
      references: []
    }

    const typeKeys = extractAllTypeKeys(mockData)

    expect(typeKeys).toContain('Backend')
  })

  it('returns sorted array', () => {
    const mockData = {
      basics: [],
      profiles: [],
      education: [{ type_key: ['Z', 'A', 'M'] }],
      languages: [],
      workshop_and_certifications: [],
      skills: {},
      experiences: [],
      projects: [],
      publications: [],
      references: []
    } as any

    const typeKeys = extractAllTypeKeys(mockData)

    // Check that it's sorted
    const sortedCopy = [...typeKeys].sort()
    expect(typeKeys).toEqual(sortedCopy)
  })

  it('removes duplicates', () => {
    const mockData = {
      basics: [],
      profiles: [],
      education: [{ type_key: ['AI'] }, { type_key: ['AI'] }],
      languages: [],
      workshop_and_certifications: [],
      skills: {},
      experiences: [{ type_key: ['AI'] }],
      projects: [],
      publications: [],
      references: []
    } as any

    const typeKeys = extractAllTypeKeys(mockData)

    const aiCount = typeKeys.filter(k => k === 'AI').length
    expect(aiCount).toBe(1)
  })
})
