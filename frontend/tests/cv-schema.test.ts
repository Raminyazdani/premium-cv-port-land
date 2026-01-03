/**
 * CV Schema Validation Tests
 * 
 * Tests for the Zod schema in @/schemas/cv.schema.ts
 * Includes positive and negative test cases for schema validation
 */

import { describe, it, expect } from 'vitest'
import {
  CVDataSchema,
  BasicsSchema,
  EducationSchema,
  SkillItemSchema,
  ProjectSchema,
  PublicationSchema,
  ExperienceSchema,
  ReferenceSchema,
  validateCVDataSchema,
  safeParseCVData,
  isCVData
} from '@/schemas/cv.schema'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/cv_de.json'
import cvDataFA from '@/data/cv_fa.json'

describe('CV Schema Validation', () => {
  describe('CVDataSchema', () => {
    it('validates English CV data successfully', () => {
      const result = CVDataSchema.safeParse(cvDataEN)
      expect(result.success).toBe(true)
    })

    it('validates German CV data successfully', () => {
      const result = CVDataSchema.safeParse(cvDataDE)
      expect(result.success).toBe(true)
    })

    it('validates Persian CV data successfully', () => {
      const result = CVDataSchema.safeParse(cvDataFA)
      expect(result.success).toBe(true)
    })

    it('rejects null input', () => {
      const result = CVDataSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('rejects non-object input', () => {
      const result = CVDataSchema.safeParse('not an object')
      expect(result.success).toBe(false)
    })

    it('allows empty object (all fields are optional)', () => {
      const result = CVDataSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('preserves extra fields with passthrough', () => {
      const dataWithExtra = { ...cvDataEN, custom_field: 'custom_value' }
      const result = CVDataSchema.safeParse(dataWithExtra)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toHaveProperty('custom_field', 'custom_value')
      }
    })
  })

  describe('BasicsSchema', () => {
    it('validates basic info with all fields', () => {
      const basics = {
        fname: 'John',
        lname: 'Doe',
        email: 'john@example.com',
        phone: { number: '+1234567890' },
        location: { city: 'Berlin', country: 'Germany' },
        birthDate: '1990-01-15'
      }
      const result = BasicsSchema.safeParse(basics)
      expect(result.success).toBe(true)
    })

    it('validates minimal basics', () => {
      const basics = { fname: 'John' }
      const result = BasicsSchema.safeParse(basics)
      expect(result.success).toBe(true)
    })

    it('validates basics with Pictures array', () => {
      const basics = {
        fname: 'John',
        Pictures: [
          { type_of: 'profile', URL: 'https://example.com/photo.jpg' }
        ]
      }
      const result = BasicsSchema.safeParse(basics)
      expect(result.success).toBe(true)
    })
  })

  describe('EducationSchema', () => {
    it('validates education entry', () => {
      const education = {
        institution: 'MIT',
        studyType: 'Bachelor',
        area: 'Computer Science',
        startDate: '2010-09-01',
        endDate: '2014-06-01',
        type_key: ['Education', 'AI']
      }
      const result = EducationSchema.safeParse(education)
      expect(result.success).toBe(true)
    })

    it('validates education with null dates', () => {
      const education = {
        institution: 'MIT',
        startDate: null,
        endDate: null
      }
      const result = EducationSchema.safeParse(education)
      expect(result.success).toBe(true)
    })
  })

  describe('SkillItemSchema', () => {
    it('validates skill item with required fields', () => {
      const skill = {
        long_name: 'Python',
        short_name: 'PY',
        type_key: ['Backend', 'AI']
      }
      const result = SkillItemSchema.safeParse(skill)
      expect(result.success).toBe(true)
    })

    it('rejects skill item missing long_name', () => {
      const skill = {
        short_name: 'PY',
        type_key: ['Backend']
      }
      const result = SkillItemSchema.safeParse(skill)
      expect(result.success).toBe(false)
    })

    it('rejects skill item missing short_name', () => {
      const skill = {
        long_name: 'Python',
        type_key: ['Backend']
      }
      const result = SkillItemSchema.safeParse(skill)
      expect(result.success).toBe(false)
    })

    it('rejects skill item with non-array type_key', () => {
      const skill = {
        long_name: 'Python',
        short_name: 'PY',
        type_key: 'Backend' // should be an array
      }
      const result = SkillItemSchema.safeParse(skill)
      expect(result.success).toBe(false)
    })
  })

  describe('ProjectSchema', () => {
    it('validates project with all fields', () => {
      const project = {
        title: 'My Project',
        description: 'A sample project',
        url: 'https://github.com/example/project',
        highlights: ['Feature 1', 'Feature 2'],
        type_key: ['Software', 'Web']
      }
      const result = ProjectSchema.safeParse(project)
      expect(result.success).toBe(true)
    })

    it('validates project with case study', () => {
      const project = {
        title: 'My Project',
        caseStudy: {
          problem: 'The problem',
          solution: 'The solution',
          technologies: ['React', 'TypeScript']
        }
      }
      const result = ProjectSchema.safeParse(project)
      expect(result.success).toBe(true)
    })
  })

  describe('PublicationSchema', () => {
    it('validates publication with year as number', () => {
      const publication = {
        title: 'My Paper',
        authors: ['Author One', 'Author Two'],
        year: 2023,
        journal: 'Nature',
        doi: '10.1234/example'
      }
      const result = PublicationSchema.safeParse(publication)
      expect(result.success).toBe(true)
    })

    it('validates publication with type_key as string array', () => {
      const publication = {
        title: 'My Paper',
        type_key: ['Research', 'AI']
      }
      const result = PublicationSchema.safeParse(publication)
      expect(result.success).toBe(true)
    })

    it('validates publication with type_key as object array', () => {
      const publication = {
        title: 'My Paper',
        type_key: [{ name: 'Research', color: 'blue' }]
      }
      const result = PublicationSchema.safeParse(publication)
      expect(result.success).toBe(true)
    })
  })

  describe('ExperienceSchema', () => {
    it('validates experience entry', () => {
      const experience = {
        role: 'Software Engineer',
        institution: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Building things',
        type_key: ['Work', 'Software']
      }
      const result = ExperienceSchema.safeParse(experience)
      expect(result.success).toBe(true)
    })
  })

  describe('ReferenceSchema', () => {
    it('validates reference entry', () => {
      const reference = {
        name: 'Dr. Jane Smith',
        position: 'Professor',
        institution: 'MIT',
        email: ['jane@mit.edu'],
        type_key: ['Academic']
      }
      const result = ReferenceSchema.safeParse(reference)
      expect(result.success).toBe(true)
    })
  })

  describe('Helper functions', () => {
    describe('validateCVDataSchema', () => {
      it('returns parsed data for valid input', () => {
        const result = validateCVDataSchema(cvDataEN)
        expect(result).toBeDefined()
        expect(result.basics).toBeDefined()
      })

      it('throws for invalid input', () => {
        expect(() => validateCVDataSchema(null)).toThrow()
      })
    })

    describe('safeParseCVData', () => {
      it('returns success result for valid data', () => {
        const result = safeParseCVData(cvDataEN)
        expect(result.success).toBe(true)
      })

      it('returns error result for invalid data', () => {
        const result = safeParseCVData(null)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error).toBeDefined()
        }
      })
    })

    describe('isCVData', () => {
      it('returns true for valid CV data', () => {
        expect(isCVData(cvDataEN)).toBe(true)
        expect(isCVData(cvDataDE)).toBe(true)
        expect(isCVData(cvDataFA)).toBe(true)
      })

      it('returns false for invalid data', () => {
        expect(isCVData(null)).toBe(false)
        expect(isCVData('string')).toBe(false)
        expect(isCVData(123)).toBe(false)
        expect(isCVData([])).toBe(false)
      })

      it('returns true for empty object (all fields optional)', () => {
        expect(isCVData({})).toBe(true)
      })
    })
  })

  describe('Negative tests - invalid shapes', () => {
    it('rejects array at top level', () => {
      const result = CVDataSchema.safeParse([])
      expect(result.success).toBe(false)
    })

    it('rejects number at top level', () => {
      const result = CVDataSchema.safeParse(42)
      expect(result.success).toBe(false)
    })

    it('rejects undefined', () => {
      const result = CVDataSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('skills with wrong structure reports error correctly', () => {
      // Skills should be nested objects, not an array
      const badData = {
        skills: 'not an object'
      }
      const result = CVDataSchema.safeParse(badData)
      expect(result.success).toBe(false)
    })

    it('education as non-array fails', () => {
      const badData = {
        education: { institution: 'MIT' } // should be an array
      }
      const result = CVDataSchema.safeParse(badData)
      expect(result.success).toBe(false)
    })

    it('profiles as non-array fails', () => {
      const badData = {
        profiles: { network: 'GitHub' } // should be an array
      }
      const result = CVDataSchema.safeParse(badData)
      expect(result.success).toBe(false)
    })
  })
})
