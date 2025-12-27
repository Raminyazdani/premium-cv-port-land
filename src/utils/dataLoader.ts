import type { CVData } from '@/types/cv'
import { DataValidator, deduplicateArray, sanitizeDate } from './dataValidator'
import { normalizeCVData, type Language } from './dataNormalizer'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/ramin_de.json'
import cvDataFA from '@/data/ramin_fa.json'

export interface LoadDataResult {
  data: CVData
  validationResult: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
}

/**
 * Loads CV data for the specified language
 */
function loadCVDataForLanguage(lang: Language): any {
  switch (lang) {
    case 'de':
      return cvDataDE
    case 'fa':
      return cvDataFA
    case 'en':
    default:
      return cvDataEN
  }
}

/**
 * Loads, normalizes, and validates CV data for the specified language
 */
export function loadAndValidateData(lang: Language = 'en'): LoadDataResult {
  // Load raw data for language
  const rawData = loadCVDataForLanguage(lang)
  
  if (import.meta.env.DEV) {
    console.log(`📂 [loadAndValidateData] Loaded raw data for language: ${lang}`)
    console.log(`📂 [loadAndValidateData] Raw data keys:`, Object.keys(rawData))
    console.log(`📂 [loadAndValidateData] Raw data sample (first 3 keys):`, 
      Object.fromEntries(Object.entries(rawData).slice(0, 3).map(([k, v]) => [
        k,
        Array.isArray(v) ? `array[${v.length}]` : typeof v
      ]))
    )
  }
  
  // Normalize to canonical English schema
  const normalized = normalizeCVData(rawData, lang)
  
  if (import.meta.env.DEV) {
    console.log(`🔄 [loadAndValidateData] After normalization:`)
    console.log(`   - Normalized keys:`, Object.keys(normalized))
    console.log(`   - education:`, Array.isArray(normalized.education) ? `array[${normalized.education.length}]` : typeof normalized.education)
    console.log(`   - projects:`, Array.isArray(normalized.projects) ? `array[${normalized.projects.length}]` : typeof normalized.projects)
  }
  
  // Validate normalized data
  const validator = new DataValidator()
  const validationResult = validator.validate(normalized)

  if (validationResult.errors.length > 0) {
    console.error('❌ Data validation errors:', validationResult.errors)
  }

  if (validationResult.warnings.length > 0) {
    console.warn('⚠️  Data validation warnings:', validationResult.warnings)
  }

  // Sanitize normalized data
  const sanitizedData = sanitizeData(normalized as CVData)
  
  if (import.meta.env.DEV) {
    console.log(`🧹 [loadAndValidateData] After sanitization:`)
    console.log(`   - education:`, Array.isArray(sanitizedData.education) ? `array[${sanitizedData.education.length}]` : typeof sanitizedData.education)
    console.log(`   - projects:`, Array.isArray(sanitizedData.projects) ? `array[${sanitizedData.projects.length}]` : typeof sanitizedData.projects)
  }

  return {
    data: sanitizedData,
    validationResult
  }
}

function sanitizeData(data: CVData): CVData {
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

function sanitizeBasics(basics: CVData['basics']): CVData['basics'] {
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

function sanitizeProfiles(profiles: CVData['profiles']): CVData['profiles'] {
  if (!Array.isArray(profiles)) return []

  return profiles.filter(profile => {
    if (!profile) return false
    return profile.network || profile.username || profile.url
  })
}

function sanitizeEducation(education: CVData['education']): CVData['education'] {
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
    })
  )
}

function sanitizeLanguages(languages: CVData['languages']): CVData['languages'] {
  if (!Array.isArray(languages)) return []

  return languages.filter(lang => lang && typeof lang === 'object')
}

function sanitizeCertifications(
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

function sanitizeSkills(skills: CVData['skills']): CVData['skills'] {
  if (!skills || typeof skills !== 'object' || Array.isArray(skills)) {
    return {}
  }

  const sanitized: CVData['skills'] = {}

  Object.entries(skills).forEach(([topCategory, categories]) => {
    if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
      return
    }

    sanitized[topCategory] = {}

    Object.entries(categories).forEach(([subCategory, items]) => {
      if (!Array.isArray(items)) {
        return
      }

      sanitized[topCategory][subCategory] = items
        .filter(item => item && item.long_name && item.short_name)
        .map(item => ({
          ...item,
          type_key: sanitizeTypeKey(item.type_key)
        }))
    })
  })

  return sanitized
}

function sanitizeExperiences(experiences: CVData['experiences']): CVData['experiences'] {
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
    })
  )
}

function sanitizeProjects(projects: CVData['projects']): CVData['projects'] {
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
    })
  )
}

function sanitizePublications(publications: CVData['publications']): CVData['publications'] {
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

function sanitizeReferences(references: CVData['references']): CVData['references'] {
  if (!Array.isArray(references)) return []

  return references
    .filter(ref => ref && (ref.name || ref.email))
    .map(item => ({
      ...item,
      type_key: sanitizeTypeKey(item.type_key)
    }))
}

function sanitizeTypeKey(typeKey: string[] | Array<{name: string}> | undefined | null): string[] {
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

export function extractAllTypeKeys(data: CVData): string[] {
  const allKeys = new Set<string>(['Full CV'])

  const addKeys = (typeKey: string[] | Array<{name: string}> | undefined | null) => {
    const sanitized = sanitizeTypeKey(typeKey)
    sanitized.forEach(key => allKeys.add(key))
  }

  data.education?.forEach(item => addKeys(item?.type_key))
  data.workshop_and_certifications?.forEach(group => {
    group?.certifications?.forEach(cert => addKeys(cert?.type_key))
  })
  
  if (data.skills) {
    Object.values(data.skills).forEach(category => {
      if (category && typeof category === 'object') {
        Object.values(category).forEach(items => {
          if (Array.isArray(items)) {
            items.forEach(item => addKeys(item?.type_key))
          }
        })
      }
    })
  }

  data.experiences?.forEach(item => addKeys(item?.type_key))
  data.projects?.forEach(item => addKeys(item?.type_key))
  data.publications?.forEach(item => addKeys(item?.type_key))
  data.references?.forEach(item => addKeys(item?.type_key))

  return Array.from(allKeys).sort()
}
