import type { CVData } from '@/types/cv'
import { logger } from '@/lib/logger'
import { sanitizeDateString } from './dataValidation'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Type guard for checking if a value is a non-null object
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Type guard for checking if a value is an array
 * @internal Exported for potential use in other validators
 */
export function isArrayOf<T>(
  value: unknown,
  itemCheck?: (item: unknown) => item is T
): value is T[] {
  if (!Array.isArray(value)) return false
  if (itemCheck) {
    return value.every(itemCheck)
  }
  return true
}

/**
 * Safe property accessor for unknown objects
 */
function getStringProp(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key]
  return typeof value === 'string' ? value : undefined
}

/**
 * Safe property accessor for number properties
 */
function getNumberProp(obj: Record<string, unknown>, key: string): number | undefined {
  const value = obj[key]
  return typeof value === 'number' ? value : undefined
}

/**
 * Safe property accessor for array properties
 */
function getArrayProp(obj: Record<string, unknown>, key: string): unknown[] | undefined {
  const value = obj[key]
  return Array.isArray(value) ? value : undefined
}

export class DataValidator {
  private errors: string[] = []
  private warnings: string[] = []

  validate(data: unknown): ValidationResult {
    this.errors = []
    this.warnings = []

    if (!isRecord(data)) {
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
      if (!isRecord(item)) {
        this.errors.push(`Basics item ${index} is not a valid object`)
        return
      }

      const birthDate = getStringProp(item, 'birthDate')
      if (birthDate && !this.isValidDate(birthDate)) {
        this.warnings.push(`Basics item ${index}: Invalid birthDate format "${birthDate}"`)
      }

      const pictures = getArrayProp(item, 'Pictures')
      if (pictures) {
        pictures.forEach((pic: unknown, picIndex: number) => {
          if (!isRecord(pic)) {
            this.warnings.push(`Basics item ${index}, Picture ${picIndex} is invalid`)
            return
          }
          if (!pic['type_of'] || !pic['URL']) {
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
      if (!isRecord(profile)) {
        this.errors.push(`Profile item ${index} is not a valid object`)
        return
      }

      if (!profile['network'] && !profile['username'] && !profile['url']) {
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
      if (!isRecord(item)) {
        this.errors.push(`Education item ${index} is not a valid object`)
        return
      }

      const key = JSON.stringify({
        institution: item['institution'],
        studyType: item['studyType'],
        startDate: item['startDate']
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate education entry found at index ${index}`)
      }
      seen.add(key)

      const startDate = getStringProp(item, 'startDate')
      if (startDate && startDate !== 'present' && !this.isValidDate(startDate)) {
        this.warnings.push(`Education item ${index}: Invalid startDate format "${startDate}"`)
      }

      const endDate = getStringProp(item, 'endDate')
      if (endDate && endDate !== 'present' && !this.isValidDate(endDate)) {
        this.warnings.push(`Education item ${index}: Invalid endDate format "${endDate}"`)
      }

      this.validateTypeKey(item['type_key'], `Education item ${index}`)
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
      if (!isRecord(item)) {
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
      if (!isRecord(issuerGroup)) {
        this.errors.push(`Certification group ${issuerIndex} is not a valid object`)
        return
      }

      const certs = getArrayProp(issuerGroup, 'certifications')
      if (certs) {
        certs.forEach((cert: unknown, certIndex: number) => {
          if (!isRecord(cert)) {
            this.errors.push(`Certification ${issuerIndex}.${certIndex} is not a valid object`)
            return
          }

          const date = getStringProp(cert, 'date')
          if (date && !this.isValidDate(date)) {
            this.warnings.push(`Certification ${issuerIndex}.${certIndex}: Invalid date format "${date}"`)
          }

          this.validateTypeKey(cert['type_key'], `Certification ${issuerIndex}.${certIndex}`)
        })
      }
    })
  }

  private validateSkills(skills: unknown): void {
    if (!skills) {
      this.warnings.push('Skills section is missing')
      return
    }

    if (!isRecord(skills)) {
      this.errors.push('Skills must be an object (not an array)')
      return
    }

    Object.entries(skills).forEach(([topCategory, categories]) => {
      if (!isRecord(categories)) {
        this.errors.push(`Skills category "${topCategory}" must be an object`)
        return
      }

      Object.entries(categories).forEach(([subCategory, items]) => {
        if (!Array.isArray(items)) {
          this.errors.push(`Skills category "${topCategory}.${subCategory}" must be an array`)
          return
        }

        items.forEach((item: unknown, itemIndex: number) => {
          if (!isRecord(item)) {
            this.errors.push(`Skill item "${topCategory}.${subCategory}[${itemIndex}]" is not a valid object`)
            return
          }

          if (!item['long_name'] || !item['short_name']) {
            this.warnings.push(`Skill item "${topCategory}.${subCategory}[${itemIndex}]" missing long_name or short_name`)
          }

          this.validateTypeKey(item['type_key'], `Skill "${topCategory}.${subCategory}[${itemIndex}]"`)
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
      if (!isRecord(item)) {
        this.errors.push(`Experience item ${index} is not a valid object`)
        return
      }

      const key = JSON.stringify({
        role: item['role'],
        institution: item['institution'],
        duration: item['duration']
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate experience entry found at index ${index}`)
      }
      seen.add(key)

      this.validateTypeKey(item['type_key'], `Experience item ${index}`)
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
      if (!isRecord(item)) {
        this.errors.push(`Project item ${index} is not a valid object`)
        return
      }

      const key = JSON.stringify({
        title: item['title'],
        url: item['url']
      })

      if (seen.has(key)) {
        this.warnings.push(`Duplicate project entry found at index ${index}: "${String(item['title'] ?? '')}"`)
      }
      seen.add(key)

      this.validateTypeKey(item['type_key'], `Project item ${index}`)
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
      if (!isRecord(item)) {
        this.errors.push(`Publication item ${index} is not a valid object`)
        return
      }

      const date = getStringProp(item, 'date')
      if (date && !this.isValidDate(date)) {
        this.warnings.push(`Publication item ${index}: Invalid date format "${date}"`)
      }

      const year = getNumberProp(item, 'year')
      if (year !== undefined && (year < 1900 || year > 2100)) {
        this.warnings.push(`Publication item ${index}: Year ${year} seems invalid`)
      }

      this.validateTypeKey(item['type_key'], `Publication item ${index}`)
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
      if (!isRecord(item)) {
        this.errors.push(`Reference item ${index} is not a valid object`)
        return
      }

      if (!item['name'] && !item['email']) {
        this.warnings.push(`Reference item ${index} has no name or email`)
      }

      this.validateTypeKey(item['type_key'], `Reference item ${index}`)
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

    const parts = dateStr.split('-').map(Number)
    if (parts.length !== 3) return false
    
    const [year, month, day] = parts
    if (year === undefined || month === undefined || day === undefined) return false
    
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

/**
 * Result of deduplication operation
 */
export interface DeduplicationResult<T> {
  /** The deduplicated array */
  items: T[]
  /** Items that were removed as duplicates */
  removedItems: { index: number; item: T; key: string }[]
}

/**
 * Deduplicates an array based on a key function
 * 
 * **Policy: FIRST_WINS**
 * - The first occurrence of a key is kept, subsequent duplicates are removed
 * - Deterministic: given the same input order, produces the same output order
 * - Transparent: logs removed items in debug mode
 * 
 * **Matching Criteria**:
 * - Uses JSON.stringify of key fields for exact matching
 * - Case-sensitive comparison
 * - null/undefined are treated as equal (both serialize to "null")
 * 
 * @param array - The array to deduplicate
 * @param getKey - Function to extract the deduplication key from each item
 * @param context - Optional context string for logging (e.g., "projects", "experiences")
 * @returns The deduplicated array
 */
export function deduplicateArray<T>(
  array: T[],
  getKey: (item: T) => string,
  context?: string
): T[] {
  const result = deduplicateArrayWithDetails(array, getKey, context)
  return result.items
}

/**
 * Deduplicates an array and returns details about removed items
 * 
 * Use this when you need to know which items were removed for testing or debugging.
 * 
 * **Tracking Behavior**:
 * - Uses a Map to track key → first occurrence index
 * - When a duplicate is found, logs the original index and the duplicate index
 * - Removed items include their original array index, the item itself, and the key
 * 
 * @param array - The array to deduplicate
 * @param getKey - Function to extract the deduplication key from each item
 * @param context - Optional context string for logging (e.g., "projects", "experiences")
 * @returns Object containing deduplicated items and list of removed items with their original indexes
 */
export function deduplicateArrayWithDetails<T>(
  array: T[],
  getKey: (item: T) => string,
  context?: string
): DeduplicationResult<T> {
  // Track key → first occurrence index for deterministic duplicate detection
  const seen = new Map<string, number>()
  const removedItems: { index: number; item: T; key: string }[] = []
  
  const items = array.filter((item, index) => {
    const key = getKey(item)
    const firstIndex = seen.get(key)
    
    if (firstIndex !== undefined) {
      removedItems.push({ index, item, key })
      logger.debug(
        `[Deduplication] ${context || 'Array'}: Removing duplicate at index ${index} ` +
        `(first seen at index ${firstIndex}), key: ${key}`
      )
      return false
    }
    
    seen.set(key, index)
    return true
  })
  
  // Log summary if any duplicates were removed
  if (removedItems.length > 0) {
    logger.debug(
      `[Deduplication] ${context || 'Array'}: Removed ${removedItems.length} duplicate(s), ` +
      `${array.length} → ${items.length} items`
    )
  }
  
  return { items, removedItems }
}
