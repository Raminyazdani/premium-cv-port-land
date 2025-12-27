/**
 * Data Normalizer: Converts DE/FA JSON to canonical English schema
 * 
 * This module ensures all CV data uses English keys internally,
 * regardless of the source language file.
 */

import type { CVData } from '@/types/cv'
import {
  SECTION_KEYS,
  BASICS_KEYS,
  PHONE_KEYS,
  LOCATION_KEYS,
  PICTURES_KEYS,
  PROFILE_KEYS,
  EDUCATION_KEYS,
  LANGUAGE_KEYS,
  PROFICIENCY_KEYS,
  CERTIFICATION_KEYS,
  WORKSHOP_ISSUER_KEYS,
  WORKSHOP_CERT_KEYS,
  SKILL_KEYS,
  EXPERIENCE_KEYS,
  PROJECT_KEYS,
  PUBLICATION_KEYS,
  REFERENCE_KEYS,
  getEnglishKey,
  type KeyMapping
} from '@/config/keyMappings'

export type Language = 'en' | 'de' | 'fa'

/**
 * Normalizes CV data from any language to canonical English schema
 */
export function normalizeCVData(rawData: any, sourceLang: Language): CVData {
  if (sourceLang === 'en') {
    return rawData as CVData
  }

  if (import.meta.env.DEV) {
    console.log(`🔧 [normalizeCVData] Starting normalization for language: ${sourceLang}`)
    console.log(`📥 [normalizeCVData] Raw data keys:`, Object.keys(rawData))
  }

  const normalized: any = {}

  Object.keys(SECTION_KEYS).forEach((enKey) => {
    const mapping = SECTION_KEYS[enKey]
    const sourceKey = mapping[sourceLang]
    
    if (import.meta.env.DEV) {
      console.log(`🔍 [normalizeCVData] Section: ${enKey}`)
      console.log(`   - Looking for source key: "${sourceKey}"`)
      console.log(`   - Found in raw data: ${rawData[sourceKey] !== undefined}`)
      if (rawData[sourceKey] !== undefined) {
        const sectionData = rawData[sourceKey]
        console.log(`   - Data type: ${Array.isArray(sectionData) ? `array[${sectionData.length}]` : typeof sectionData}`)
      }
    }
    
    if (rawData[sourceKey] !== undefined) {
      const sectionData = rawData[sourceKey]
      normalized[enKey] = normalizeSectionData(enKey, sectionData, sourceLang)
      
      if (import.meta.env.DEV) {
        const result = normalized[enKey]
        console.log(`   ✅ Normalized result type: ${Array.isArray(result) ? `array[${result.length}]` : typeof result}`)
      }
    } else {
      if (import.meta.env.DEV) {
        console.log(`   ⚠️  Source key "${sourceKey}" not found in raw data`)
      }
    }
  })

  if (import.meta.env.DEV) {
    console.log(`📤 [normalizeCVData] Normalized data keys:`, Object.keys(normalized))
  }

  return normalized as CVData
}

/**
 * Normalizes a specific section based on its type
 */
function normalizeSectionData(sectionName: string, data: any, sourceLang: Language): any {
  if (!data) return data

  switch (sectionName) {
    case 'basics':
      return Array.isArray(data) 
        ? data.map(item => normalizeBasics(item, sourceLang))
        : [normalizeBasics(data, sourceLang)]
    
    case 'profiles':
      return Array.isArray(data)
        ? data.map(item => normalizeObject(item, PROFILE_KEYS, sourceLang))
        : []
    
    case 'education':
      return Array.isArray(data)
        ? data.map(item => normalizeObject(item, EDUCATION_KEYS, sourceLang))
        : []
    
    case 'languages':
      return Array.isArray(data)
        ? data.map(item => normalizeLanguage(item, sourceLang))
        : []
    
    case 'workshop_and_certifications':
      return Array.isArray(data)
        ? data.map(item => normalizeWorkshopIssuer(item, sourceLang))
        : []
    
    case 'skills':
      return normalizeSkills(data, sourceLang)
    
    case 'experiences':
      return Array.isArray(data)
        ? data.map(item => normalizeObject(item, EXPERIENCE_KEYS, sourceLang))
        : []
    
    case 'projects':
      return Array.isArray(data)
        ? data.map(item => normalizeObject(item, PROJECT_KEYS, sourceLang))
        : []
    
    case 'publications':
      return Array.isArray(data)
        ? data.map(item => normalizeObject(item, PUBLICATION_KEYS, sourceLang))
        : []
    
    case 'references':
      return Array.isArray(data)
        ? data.map(item => normalizeReference(item, sourceLang))
        : []
    
    default:
      return data
  }
}

/**
 * Normalizes basics section
 */
function normalizeBasics(data: any, sourceLang: Language): any {
  if (!data || typeof data !== 'object') return data

  const normalized = normalizeObject(data, BASICS_KEYS, sourceLang)

  if (normalized.phone && typeof normalized.phone === 'object') {
    normalized.phone = normalizeObject(normalized.phone, PHONE_KEYS, sourceLang)
  }

  if (Array.isArray(normalized.location)) {
    normalized.location = normalized.location.map((loc: any) => 
      normalizeObject(loc, LOCATION_KEYS, sourceLang)
    )
  } else if (normalized.location && typeof normalized.location === 'object') {
    normalized.location = [normalizeObject(normalized.location, LOCATION_KEYS, sourceLang)]
  }

  if (Array.isArray(normalized.Pictures)) {
    normalized.Pictures = normalized.Pictures.map((pic: any) =>
      normalizeObject(pic, PICTURES_KEYS, sourceLang)
    )
  }

  return normalized
}

/**
 * Normalizes language section
 */
function normalizeLanguage(data: any, sourceLang: Language): any {
  if (!data || typeof data !== 'object') return data

  const normalized = normalizeObject(data, LANGUAGE_KEYS, sourceLang)

  if (normalized.proficiency && typeof normalized.proficiency === 'object') {
    normalized.proficiency = normalizeObject(normalized.proficiency, PROFICIENCY_KEYS, sourceLang)
  }

  if (Array.isArray(normalized.certifications)) {
    normalized.certifications = normalized.certifications.map((cert: any) =>
      normalizeObject(cert, CERTIFICATION_KEYS, sourceLang)
    )
  }

  return normalized
}

/**
 * Normalizes workshop issuer
 */
function normalizeWorkshopIssuer(data: any, sourceLang: Language): any {
  if (!data || typeof data !== 'object') return data

  const normalized = normalizeObject(data, WORKSHOP_ISSUER_KEYS, sourceLang)

  if (Array.isArray(normalized.certifications)) {
    normalized.certifications = normalized.certifications.map((cert: any) =>
      normalizeObject(cert, WORKSHOP_CERT_KEYS, sourceLang)
    )
  }

  return normalized
}

/**
 * Normalizes skills section (nested structure)
 */
function normalizeSkills(data: any, sourceLang: Language): any {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {}
  }

  const normalized: any = {}

  Object.keys(data).forEach((topCategoryKey) => {
    const topCategory = data[topCategoryKey]
    
    if (topCategory && typeof topCategory === 'object' && !Array.isArray(topCategory)) {
      normalized[topCategoryKey] = {}
      
      Object.keys(topCategory).forEach((subCategoryKey) => {
        const items = topCategory[subCategoryKey]
        
        if (Array.isArray(items)) {
          normalized[topCategoryKey][subCategoryKey] = items.map(item =>
            normalizeObject(item, SKILL_KEYS, sourceLang)
          )
        }
      })
    }
  })

  return normalized
}

/**
 * Normalizes reference with phone handling
 */
function normalizeReference(data: any, sourceLang: Language): any {
  if (!data || typeof data !== 'object') return data

  const normalized = normalizeObject(data, REFERENCE_KEYS, sourceLang)

  if (Array.isArray(normalized.phone)) {
    normalized.phone = normalized.phone.map((phone: any) =>
      typeof phone === 'object' ? normalizeObject(phone, PHONE_KEYS, sourceLang) : phone
    )
  }

  return normalized
}

/**
 * Generic object normalizer using key mapping
 */
function normalizeObject(
  obj: any,
  keyMap: Record<string, KeyMapping>,
  sourceLang: Language
): any {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  const normalized: any = {}

  Object.keys(obj).forEach((sourceKey) => {
    const enKey = getEnglishKey(keyMap, sourceKey, sourceLang)
    normalized[enKey] = obj[sourceKey]
    
    if (import.meta.env.DEV && enKey === sourceKey && sourceLang !== 'en') {
      console.warn(`⚠️  [normalizeObject] Key "${sourceKey}" not found in keyMap, using as-is`)
    }
  })

  return normalized
}

/**
 * Validates normalized data structure
 */
export function validateNormalizedData(data: CVData): {
  isValid: boolean
  missingKeys: string[]
  extraKeys: string[]
} {
  const expectedKeys = Object.keys(SECTION_KEYS)
  const actualKeys = Object.keys(data)
  
  const missingKeys = expectedKeys.filter(key => !(key in data))
  const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key))
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    extraKeys
  }
}
