/**
 * Data Sanitization Module
 *
 * Provides sanitization functions for CV data to ensure data integrity
 * and consistency. Extracted from dataLoader.ts for single responsibility.
 */

import type { CVData } from '@/types/cv'
import { deduplicateArray, sanitizeDate } from './dataValidator'

/**
 * Sanitizes all CV data sections
 */
export function sanitizeData(data: CVData): CVData {
  return {
    basics: sanitizeBasics(data.basics),
    profiles: sanitizeProfiles(data.profiles),
    education: sanitizeEducation(data.education),
    languages: sanitizeLanguages(data.languages),
    workshop_and_certifications: sanitizeCertifications(data.workshop_and_certifications),
    skills: sanitizeSkills(data.skills),
    experiences: sanitizeExperiences(data.experiences),
    projects: sanitizeProjects(data.projects),
    publications: sanitizePublications(data.publications),
    references: sanitizeReferences(data.references)
  }
}

/**
 * Sanitizes basics section
 */
export function sanitizeBasics(basics: CVData['basics']): CVData['basics'] {
  if (!Array.isArray(basics)) return []

  return basics.map(item => {
    if (!item) return item

    return {
      ...item,
      birthDate: sanitizeDate(item.birthDate),
      Pictures: Array.isArray(item.Pictures)
        ? item.Pictures.filter(pic => pic && pic.type_of && pic.URL)
        : undefined
    }
  })
}

/**
 * Sanitizes profiles section
 */
export function sanitizeProfiles(profiles: CVData['profiles']): CVData['profiles'] {
  if (!Array.isArray(profiles)) return []

  return profiles.filter(profile => {
    if (!profile) return false
    return profile.network || profile.username || profile.url
  })
}

/**
 * Sanitizes education section with date sanitization and deduplication
 */
export function sanitizeEducation(education: CVData['education']): CVData['education'] {
  if (!Array.isArray(education)) return []

  const sanitized = education.map(item => {
    if (!item) return item

    return {
      ...item,
      startDate: sanitizeDate(item.startDate),
      endDate: sanitizeDate(item.endDate),
      type_key: sanitizeTypeKey(item.type_key)
    }
  })

  return deduplicateArray(sanitized, item =>
    JSON.stringify({
      institution: item?.institution,
      studyType: item?.studyType,
      startDate: item?.startDate
    }),
    'education'
  )
}

/**
 * Sanitizes languages section
 */
export function sanitizeLanguages(languages: CVData['languages']): CVData['languages'] {
  if (!Array.isArray(languages)) return []

  return languages.filter(lang => lang && typeof lang === 'object')
}

/**
 * Sanitizes certifications section with date sanitization
 */
export function sanitizeCertifications(
  certifications: CVData['workshop_and_certifications']
): CVData['workshop_and_certifications'] {
  if (!Array.isArray(certifications)) return []

  return certifications.map(issuerGroup => {
    if (!issuerGroup || typeof issuerGroup !== 'object') return issuerGroup

    const certs = Array.isArray(issuerGroup.certifications)
      ? issuerGroup.certifications.map(cert => {
          if (!cert) return cert

          return {
            ...cert,
            date: sanitizeDate(cert.date),
            type_key: sanitizeTypeKey(cert.type_key)
          }
        })
      : []

    return {
      ...issuerGroup,
      certifications: certs
    }
  })
}

/**
 * Sanitizes skills section
 */
export function sanitizeSkills(skills: CVData['skills']): CVData['skills'] {
  if (!skills || typeof skills !== 'object' || Array.isArray(skills)) {
    return {}
  }

  const sanitized: CVData['skills'] = {}

  Object.entries(skills).forEach(([topCategory, categories]) => {
    if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
      return
    }

    sanitized[topCategory] = {}
    const categoryObj = sanitized[topCategory]

    Object.entries(categories).forEach(([subCategory, items]) => {
      if (!Array.isArray(items)) {
        return
      }

      categoryObj[subCategory] = items
        .filter(item => item && item.long_name && item.short_name)
        .map(item => ({
          ...item,
          type_key: sanitizeTypeKey(item.type_key)
        }))
    })
  })

  return sanitized
}

/**
 * Sanitizes experiences section with deduplication
 */
export function sanitizeExperiences(experiences: CVData['experiences']): CVData['experiences'] {
  if (!Array.isArray(experiences)) return []

  const sanitized = experiences.map(item => {
    if (!item) return item

    return {
      ...item,
      type_key: sanitizeTypeKey(item.type_key)
    }
  })

  return deduplicateArray(sanitized, item =>
    JSON.stringify({
      role: item?.role,
      institution: item?.institution,
      duration: item?.duration
    }),
    'experiences'
  )
}

/**
 * Sanitizes projects section with deduplication
 */
export function sanitizeProjects(projects: CVData['projects']): CVData['projects'] {
  if (!Array.isArray(projects)) return []

  const sanitized = projects.map(item => {
    if (!item) return item

    return {
      ...item,
      type_key: sanitizeTypeKey(item.type_key)
    }
  })

  return deduplicateArray(sanitized, item =>
    JSON.stringify({
      title: item?.title,
      url: item?.url
    }),
    'projects'
  )
}

/**
 * Sanitizes publications section with date sanitization
 */
export function sanitizePublications(publications: CVData['publications']): CVData['publications'] {
  if (!Array.isArray(publications)) return []

  return publications.map(item => {
    if (!item) return item

    return {
      ...item,
      date: sanitizeDate(item.date),
      type_key: sanitizeTypeKey(item.type_key)
    }
  })
}

/**
 * Sanitizes references section
 */
export function sanitizeReferences(references: CVData['references']): CVData['references'] {
  if (!Array.isArray(references)) return []

  return references
    .filter(ref => ref && (ref.name || ref.email))
    .map(item => ({
      ...item,
      type_key: sanitizeTypeKey(item.type_key)
    }))
}

/**
 * Sanitizes type_key array, handling both string arrays and object arrays
 */
export function sanitizeTypeKey(typeKey: string[] | Array<{name: string}> | undefined | null): string[] {
  if (!typeKey) return []
  if (!Array.isArray(typeKey)) return []

  return typeKey
    .map(key => {
      if (typeof key === 'string') return key
      if (typeof key === 'object' && key !== null && 'name' in key) {
        return String(key.name)
      }
      return ''
    })
    .filter(key => key.trim().length > 0)
}
