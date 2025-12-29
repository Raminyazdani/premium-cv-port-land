/**
 * Sanitize Data Tests
 *
 * Tests for the extracted sanitization functions from dataLoader.ts
 */

import { describe, it, expect } from 'vitest'
import {
  sanitizeData,
  sanitizeBasics,
  sanitizeProfiles,
  sanitizeEducation,
  sanitizeLanguages,
  sanitizeCertifications,
  sanitizeSkills,
  sanitizeExperiences,
  sanitizeProjects,
  sanitizePublications,
  sanitizeReferences,
  sanitizeTypeKey
} from '@/utils/sanitizeData'
import type { CVData } from '@/types/cv'

describe('sanitizeData', () => {
  describe('sanitizeTypeKey', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeTypeKey(undefined)).toEqual([])
    })

    it('returns empty array for null', () => {
      expect(sanitizeTypeKey(null)).toEqual([])
    })

    it('returns empty array for non-array input', () => {
      // @ts-expect-error testing invalid input
      expect(sanitizeTypeKey('not an array')).toEqual([])
    })

    it('handles string arrays correctly', () => {
      expect(sanitizeTypeKey(['AI', 'ML', 'Data Science'])).toEqual(['AI', 'ML', 'Data Science'])
    })

    it('handles object arrays with name property', () => {
      const input = [{ name: 'AI' }, { name: 'ML' }]
      expect(sanitizeTypeKey(input)).toEqual(['AI', 'ML'])
    })

    it('filters out empty strings', () => {
      expect(sanitizeTypeKey(['AI', '', '  ', 'ML'])).toEqual(['AI', 'ML'])
    })

    it('handles mixed array of strings and objects', () => {
      const input = ['AI', { name: 'ML' }, 'Data Science']
      expect(sanitizeTypeKey(input as any)).toEqual(['AI', 'ML', 'Data Science'])
    })
  })

  describe('sanitizeBasics', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeBasics(undefined)).toEqual([])
    })

    it('returns empty array for non-array', () => {
      // @ts-expect-error testing invalid input
      expect(sanitizeBasics('not an array')).toEqual([])
    })

    it('sanitizes birth date', () => {
      const basics = [{
        fname: 'John',
        lname: 'Doe',
        birthDate: '1990-01-15'
      }]
      const result = sanitizeBasics(basics)
      expect(result[0]?.birthDate).toBe('1990-01-15')
    })

    it('filters invalid pictures', () => {
      const basics = [{
        fname: 'John',
        lname: 'Doe',
        Pictures: [
          { type_of: 'avatar', URL: 'https://example.com/avatar.jpg' },
          { type_of: 'avatar', URL: '' }, // invalid - empty URL
          { type_of: '', URL: 'https://example.com/photo.jpg' }, // invalid - empty type_of
          null // invalid - null
        ]
      }] as any
      const result = sanitizeBasics(basics)
      expect(result[0]?.Pictures).toHaveLength(1)
      expect(result[0]?.Pictures?.[0]?.URL).toBe('https://example.com/avatar.jpg')
    })
  })

  describe('sanitizeProfiles', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeProfiles(undefined)).toEqual([])
    })

    it('filters profiles with at least one field', () => {
      const profiles = [
        { network: 'LinkedIn', username: 'johndoe', url: 'https://linkedin.com/in/johndoe' },
        { network: 'GitHub', username: '', url: '' }, // valid - has network
        { network: '', username: '', url: '' }, // invalid - no fields
        null // invalid - null
      ] as any
      const result = sanitizeProfiles(profiles)
      expect(result).toHaveLength(2)
    })
  })

  describe('sanitizeEducation', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeEducation(undefined)).toEqual([])
    })

    it('sanitizes dates and type_key', () => {
      const education = [{
        institution: 'MIT',
        studyType: 'PhD',
        startDate: '2018-09-01',
        endDate: 'present',
        type_key: ['AI', 'ML']
      }]
      const result = sanitizeEducation(education)
      expect(result[0]?.startDate).toBe('2018-09-01')
      expect(result[0]?.endDate).toBe('present')
      expect(result[0]?.type_key).toEqual(['AI', 'ML'])
    })

    it('removes duplicate entries based on institution, studyType, and startDate', () => {
      const education = [
        { institution: 'MIT', studyType: 'PhD', startDate: '2018-09-01' },
        { institution: 'MIT', studyType: 'PhD', startDate: '2018-09-01' }, // duplicate
        { institution: 'Stanford', studyType: 'MSc', startDate: '2015-09-01' }
      ]
      const result = sanitizeEducation(education)
      expect(result).toHaveLength(2)
    })
  })

  describe('sanitizeLanguages', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeLanguages(undefined)).toEqual([])
    })

    it('filters out non-objects', () => {
      const languages = [
        { language: 'English', fluency: 'Native' },
        null,
        undefined,
        'not an object'
      ] as any
      const result = sanitizeLanguages(languages)
      expect(result).toHaveLength(1)
    })
  })

  describe('sanitizeCertifications', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeCertifications(undefined)).toEqual([])
    })

    it('sanitizes dates and type_key in certifications', () => {
      const certs = [{
        issuer: 'AWS',
        certifications: [{
          name: 'Solutions Architect',
          date: '2023-01-15',
          type_key: ['Cloud']
        }]
      }]
      const result = sanitizeCertifications(certs)
      expect(result[0]?.certifications?.[0]?.date).toBe('2023-01-15')
      expect(result[0]?.certifications?.[0]?.type_key).toEqual(['Cloud'])
    })
  })

  describe('sanitizeSkills', () => {
    it('returns empty object for undefined', () => {
      expect(sanitizeSkills(undefined)).toEqual({})
    })

    it('returns empty object for array', () => {
      // @ts-expect-error testing invalid input
      expect(sanitizeSkills([])).toEqual({})
    })

    it('sanitizes nested skill structure', () => {
      const skills = {
        'Technical Skills': {
          'Programming': [
            { long_name: 'Python', short_name: 'PY', type_key: ['AI'] },
            { long_name: '', short_name: 'JS' }, // invalid - no long_name
          ]
        }
      }
      const result = sanitizeSkills(skills as any)
      expect(result['Technical Skills']?.['Programming']).toHaveLength(1)
      expect(result['Technical Skills']?.['Programming']?.[0]?.long_name).toBe('Python')
    })
  })

  describe('sanitizeExperiences', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeExperiences(undefined)).toEqual([])
    })

    it('removes duplicate experiences based on role, institution, and duration', () => {
      const experiences = [
        { role: 'Engineer', institution: 'Google', duration: '2020-2023' },
        { role: 'Engineer', institution: 'Google', duration: '2020-2023' }, // duplicate
        { role: 'Manager', institution: 'Google', duration: '2023-present' }
      ]
      const result = sanitizeExperiences(experiences)
      expect(result).toHaveLength(2)
    })
  })

  describe('sanitizeProjects', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeProjects(undefined)).toEqual([])
    })

    it('removes duplicate projects based on title and url', () => {
      const projects = [
        { title: 'Project A', url: 'https://example.com/a' },
        { title: 'Project A', url: 'https://example.com/a' }, // duplicate
        { title: 'Project B', url: 'https://example.com/b' }
      ]
      const result = sanitizeProjects(projects)
      expect(result).toHaveLength(2)
    })
  })

  describe('sanitizePublications', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizePublications(undefined)).toEqual([])
    })

    it('sanitizes dates and type_key', () => {
      const publications = [{
        title: 'AI Research Paper',
        date: '2023-06-15',
        type_key: ['AI', 'Research']
      }]
      const result = sanitizePublications(publications)
      expect(result[0]?.date).toBe('2023-06-15')
      expect(result[0]?.type_key).toEqual(['AI', 'Research'])
    })
  })

  describe('sanitizeReferences', () => {
    it('returns empty array for undefined', () => {
      expect(sanitizeReferences(undefined)).toEqual([])
    })

    it('filters references that have name or email', () => {
      const references = [
        { name: 'John Doe', email: ['john@example.com'] },
        { name: '', email: ['jane@example.com'] }, // valid - has email
        { name: '', email: undefined }, // invalid - no name or email
        null
      ] as any
      const result = sanitizeReferences(references)
      expect(result).toHaveLength(2)
    })
  })

  describe('sanitizeData (main function)', () => {
    it('sanitizes all sections of CV data', () => {
      const mockData: CVData = {
        basics: [{ fname: 'John', lname: 'Doe' }],
        profiles: [{ network: 'LinkedIn' }],
        education: [{ institution: 'MIT', studyType: 'PhD' }],
        languages: [{ language: 'English' }],
        workshop_and_certifications: [{ issuer: 'AWS', certifications: [] }],
        skills: {},
        experiences: [{ role: 'Engineer', institution: 'Google' }],
        projects: [{ title: 'Project A' }],
        publications: [{ title: 'Paper A' }],
        references: [{ name: 'John Doe' }]
      }

      const result = sanitizeData(mockData)

      expect(result).toHaveProperty('basics')
      expect(result).toHaveProperty('profiles')
      expect(result).toHaveProperty('education')
      expect(result).toHaveProperty('languages')
      expect(result).toHaveProperty('workshop_and_certifications')
      expect(result).toHaveProperty('skills')
      expect(result).toHaveProperty('experiences')
      expect(result).toHaveProperty('projects')
      expect(result).toHaveProperty('publications')
      expect(result).toHaveProperty('references')
    })
  })
})
