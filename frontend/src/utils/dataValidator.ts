import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'
import { sanitizeDateString } from './dataValidation'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class DataValidator {
  private errors: string[] = []
  private warnings: string[] = []

  validate(data: unknown): ValidationResult {
    this.errors = []
    this.warnings = []

    if (!data || typeof data !== 'object') {
      this.errors.push('Data must be a valid object')
      return this.getResult()
    }

    try {
      const cvData = data as Partial<CVData>
      
      this.validateBasics(cvData.basics)
      this.validateProfiles(cvData.profiles)
      this.validateEducation(cvData.education)
      this.validateLanguages(cvData.languages)
      this.validateCertifications(cvData.workshop_and_certifications)
      this.validateSkills(cvData.skills)
      this.validateExperiences(cvData.experiences)
      this.validateProjects(cvData.projects)
      this.validatePublications(cvData.publications)
      this.validateReferences(cvData.references)
    } catch (error) {
      this.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return this.getResult()
  }

  private validateBasics(basics: unknown): void {
    if (!basics) {
      this.warnings.push('Basics section is missing')
      return
    }

    if (!Array.isArray(basics)) {
      this.errors.push('Basics must be an array')
      return
    }

    basics.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Basics item ${index} is not a valid object`)
        return
      }

      const basic = item as Record<string, unknown>

      if (basic.birthDate && typeof basic.birthDate === 'string') {
        if (!this.isValidDate(basic.birthDate)) {
          this.warnings.push(`Basics item ${index}: Invalid birthDate format "${basic.birthDate}"`)
        }
      }

      if (basic.Pictures && Array.isArray(basic.Pictures)) {
        basic.Pictures.forEach((pic: unknown, picIndex: number) => {
          if (!pic || typeof pic !== 'object') {
            this.warnings.push(`Basics item ${index}, Picture ${picIndex} is invalid`)
            return
          }
          const picture = pic as Record<string, unknown>
          if (!picture.type_of || !picture.URL) {
            this.warnings.push(`Basics item ${index}, Picture ${picIndex} missing type_of or URL`)
          }
        })
      }
    })
  }

  private validateProfiles(profiles: unknown): void {
    if (!profiles) {
      this.warnings.push('Profiles section is missing')
      return
    }

    if (!Array.isArray(profiles)) {
      this.errors.push('Profiles must be an array')
      return
    }

    profiles.forEach((profile, index) => {
      if (!profile || typeof profile !== 'object') {
        this.errors.push(`Profile item ${index} is not a valid object`)
        return
      }

      const prof = profile as Record<string, unknown>
      if (!prof.network && !prof.username && !prof.url) {
        this.warnings.push(`Profile item ${index} has no network, username, or url`)
      }
    })
  }

  private validateEducation(education: unknown): void {
    if (!education) {
      this.warnings.push('Education section is missing')
      return
    }

    if (!Array.isArray(education)) {
      this.errors.push('Education must be an array')
      return
    }

    const seen = new Set<string>()

    education.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Education item ${index} is not a valid object`)
        return
      }

      const edu = item as Record<string, unknown>

      const key = JSON.stringify({
        institution: edu.institution,
        studyType: edu.studyType,
        startDate: edu.startDate
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate education entry found at index ${index}`)
      }
      seen.add(key)

      if (edu.startDate && typeof edu.startDate === 'string') {
        if (edu.startDate !== 'present' && !this.isValidDate(edu.startDate)) {
          this.warnings.push(`Education item ${index}: Invalid startDate format "${edu.startDate}"`)
        }
      }

      if (edu.endDate && typeof edu.endDate === 'string') {
        if (edu.endDate !== 'present' && !this.isValidDate(edu.endDate)) {
          this.warnings.push(`Education item ${index}: Invalid endDate format "${edu.endDate}"`)
        }
      }

      this.validateTypeKey(edu.type_key, `Education item ${index}`)
    })
  }

  private validateLanguages(languages: unknown): void {
    if (!languages) {
      this.warnings.push('Languages section is missing')
      return
    }

    if (!Array.isArray(languages)) {
      this.errors.push('Languages must be an array')
      return
    }

    languages.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Language item ${index} is not a valid object`)
      }
    })
  }

  private validateCertifications(certifications: unknown): void {
    if (!certifications) {
      this.warnings.push('Certifications section is missing')
      return
    }

    if (!Array.isArray(certifications)) {
      this.errors.push('Certifications must be an array')
      return
    }

    certifications.forEach((issuerGroup, issuerIndex) => {
      if (!issuerGroup || typeof issuerGroup !== 'object') {
        this.errors.push(`Certification group ${issuerIndex} is not a valid object`)
        return
      }

      const group = issuerGroup as Record<string, unknown>

      if (group.certifications && Array.isArray(group.certifications)) {
        group.certifications.forEach((cert: unknown, certIndex: number) => {
          if (!cert || typeof cert !== 'object') {
            this.errors.push(`Certification ${issuerIndex}.${certIndex} is not a valid object`)
            return
          }

          const c = cert as Record<string, unknown>

          if (c.date && typeof c.date === 'string') {
            if (!this.isValidDate(c.date)) {
              this.warnings.push(`Certification ${issuerIndex}.${certIndex}: Invalid date format "${c.date}"`)
            }
          }

          this.validateTypeKey(c.type_key, `Certification ${issuerIndex}.${certIndex}`)
        })
      }
    })
  }

  private validateSkills(skills: unknown): void {
    if (!skills) {
      this.warnings.push('Skills section is missing')
      return
    }

    if (typeof skills !== 'object' || Array.isArray(skills)) {
      this.errors.push('Skills must be an object (not an array)')
      return
    }

    const skillsObj = skills as Record<string, unknown>

    Object.entries(skillsObj).forEach(([topCategory, categories]) => {
      if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
        this.errors.push(`Skills category "${topCategory}" must be an object`)
        return
      }

      const categoriesObj = categories as Record<string, unknown>

      Object.entries(categoriesObj).forEach(([subCategory, items]) => {
        if (!Array.isArray(items)) {
          this.errors.push(`Skills category "${topCategory}.${subCategory}" must be an array`)
          return
        }

        items.forEach((item: unknown, itemIndex: number) => {
          if (!item || typeof item !== 'object') {
            this.errors.push(`Skill item "${topCategory}.${subCategory}[${itemIndex}]" is not a valid object`)
            return
          }

          const skill = item as Record<string, unknown>

          if (!skill.long_name || !skill.short_name) {
            this.warnings.push(`Skill item "${topCategory}.${subCategory}[${itemIndex}]" missing long_name or short_name`)
          }

          this.validateTypeKey(skill.type_key, `Skill "${topCategory}.${subCategory}[${itemIndex}]"`)
        })
      })
    })
  }

  private validateExperiences(experiences: unknown): void {
    if (!experiences) {
      this.warnings.push('Experiences section is missing')
      return
    }

    if (!Array.isArray(experiences)) {
      this.errors.push('Experiences must be an array')
      return
    }

    const seen = new Set<string>()

    experiences.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Experience item ${index} is not a valid object`)
        return
      }

      const exp = item as Record<string, unknown>

      const key = JSON.stringify({
        role: exp.role,
        institution: exp.institution,
        duration: exp.duration
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate experience entry found at index ${index}`)
      }
      seen.add(key)

      this.validateTypeKey(exp.type_key, `Experience item ${index}`)
    })
  }

  private validateProjects(projects: unknown): void {
    if (!projects) {
      this.warnings.push('Projects section is missing')
      return
    }

    if (!Array.isArray(projects)) {
      this.errors.push('Projects must be an array')
      return
    }

    const seen = new Set<string>()

    projects.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Project item ${index} is not a valid object`)
        return
      }

      const proj = item as Record<string, unknown>

      const key = JSON.stringify({
        title: proj.title,
        url: proj.url
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate project entry found at index ${index}: "${proj.title}"`)
      }
      seen.add(key)

      this.validateTypeKey(proj.type_key, `Project item ${index}`)
    })
  }

  private validatePublications(publications: unknown): void {
    if (!publications) {
      this.warnings.push('Publications section is missing')
      return
    }

    if (!Array.isArray(publications)) {
      this.errors.push('Publications must be an array')
      return
    }

    publications.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Publication item ${index} is not a valid object`)
        return
      }

      const pub = item as Record<string, unknown>

      if (pub.date && typeof pub.date === 'string') {
        if (!this.isValidDate(pub.date)) {
          this.warnings.push(`Publication item ${index}: Invalid date format "${pub.date}"`)
        }
      }

      if (pub.year && typeof pub.year === 'number') {
        if (pub.year < 1900 || pub.year > 2100) {
          this.warnings.push(`Publication item ${index}: Year ${pub.year} seems invalid`)
        }
      }

      this.validateTypeKey(pub.type_key, `Publication item ${index}`)
    })
  }

  private validateReferences(references: unknown): void {
    if (!references) {
      this.warnings.push('References section is missing')
      return
    }

    if (!Array.isArray(references)) {
      this.errors.push('References must be an array')
      return
    }

    references.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        this.errors.push(`Reference item ${index} is not a valid object`)
        return
      }

      const ref = item as Record<string, unknown>

      if (!ref.name && !ref.email) {
        this.warnings.push(`Reference item ${index} has no name or email`)
      }

      this.validateTypeKey(ref.type_key, `Reference item ${index}`)
    })
  }

  private validateTypeKey(typeKey: unknown, context: string): void {
    if (!typeKey) return

    if (!Array.isArray(typeKey)) {
      this.warnings.push(`${context}: type_key must be an array`)
      return
    }

    if (typeKey.length === 0) {
      this.warnings.push(`${context}: type_key is empty`)
    }

    typeKey.forEach((key, index) => {
      if (typeof key !== 'string') {
        this.warnings.push(`${context}: type_key[${index}] must be a string`)
      }
    })
  }

  private isValidDate(dateStr: string): boolean {
    // Handle "present" equivalents in EN/DE/FA
    const presentEquivalents = ['present', 'Present', 'تاکنون', 'حال حاضر', 'Gegenwart', 'heute']
    if (presentEquivalents.includes(dateStr)) return true

    const isoRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!isoRegex.test(dateStr)) return false

    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return false

    const [year, month, day] = dateStr.split('-').map(Number)
    
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false

    const actualDate = new Date(year, month - 1, day)
    if (actualDate.getFullYear() !== year || 
        actualDate.getMonth() !== month - 1 || 
        actualDate.getDate() !== day) {
      return false
    }

    return true
  }

  private getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings]
    }
  }
}

/**
 * Sanitizes a date string, clamping invalid dates to the last valid day of month.
 * 
 * Policy: CLAMP_TO_LAST_VALID_DAY
 * - Invalid dates like "2020-9-31" are clamped to "2020-09-30"
 * - "Present" equivalents in EN/DE/FA are normalized to "present"
 * - Completely unparseable dates return null
 * 
 * @param dateStr - Date string to sanitize
 * @returns Sanitized date string (ISO format), "present", or null if unparseable
 */
export function sanitizeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  
  // Use the robust date sanitizer from dataValidation
  const sanitized = sanitizeDateString(dateStr)
  
  if (!sanitized) {
    logger.warn(`Invalid date format: "${dateStr}", returning null`)
    return null
  }
  
  // Log if the date was clamped
  if (sanitized.wasModified) {
    logger.warn(`Date "${dateStr}" was clamped to "${sanitized.isoString}"`)
  }
  
  return sanitized.isoString
}

export function deduplicateArray<T>(
  array: T[],
  getKey: (item: T) => string
): T[] {
  const seen = new Set<string>()
  return array.filter(item => {
    const key = getKey(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}
