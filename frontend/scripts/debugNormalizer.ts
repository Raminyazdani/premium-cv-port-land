/**
 * DEBUG UTILITY: Diagnose normalization issues
 * This file helps identify why sections are empty after normalization.
 * 
 * Run with: npx tsx scripts/debugNormalizer.ts
 * (requires tsx: npm install -D tsx)
 */

import { normalizeCVData, type Language } from '../src/utils/dataNormalizer'
import cvDataEN from '../src/data/cv.json'
import cvDataDE from '../src/data/ramin_de.json'
import cvDataFA from '../src/data/ramin_fa.json'
import { logger } from '../src/lib/logger'

export function diagnoseNormalization(lang: Language = 'en') {
  logger.group(`🔍 NORMALIZATION DIAGNOSIS for ${lang.toUpperCase()}`)
  
  // Load raw data
  let rawData: Record<string, unknown>
  switch (lang) {
    case 'de':
      rawData = cvDataDE as Record<string, unknown>
      break
    case 'fa':
      rawData = cvDataFA as Record<string, unknown>
      break
    default:
      rawData = cvDataEN as Record<string, unknown>
  }
  
  logger.debug('📥 Raw Data Keys:', Object.keys(rawData))
  logger.debug('📥 Raw Data Sample (first 3 keys):', 
    Object.keys(rawData).slice(0, 3).reduce((acc, key) => {
      const value = rawData[key]
      acc[key] = Array.isArray(value) 
        ? `Array(${value.length})` 
        : value && typeof value === 'object'
          ? `Object(${Object.keys(value).length} keys)` 
          : typeof value
      return acc
    }, {} as Record<string, string>)
  )
  
  // Check specific sections
  logger.group('📊 Section Analysis')
  
  const sections = [
    'basics', 'grunddaten', 'اطلاعات_پایه',
    'education', 'ausbildung', 'تحصیلات',
    'profiles', 'profile', 'پروفایل‌ها',
    'projects', 'projekte', 'پروژه‌ها'
  ]
  
  sections.forEach(key => {
    if (rawData[key] !== undefined) {
      const value = rawData[key]
      logger.debug(`✓ Found: ${key} =`, Array.isArray(value) ? `Array(${value.length})` : typeof value)
    }
  })
  
  logger.groupEnd()
  
  // Normalize
  logger.debug('🔄 Normalizing...')
  const normalized = normalizeCVData(rawData, lang)
  
  logger.debug('📤 Normalized Keys:', Object.keys(normalized))
  logger.debug('📤 Normalized Data Summary:', {
    basics: Array.isArray(normalized.basics) ? `Array(${normalized.basics.length})` : typeof normalized.basics,
    profiles: Array.isArray(normalized.profiles) ? `Array(${normalized.profiles?.length || 0})` : typeof normalized.profiles,
    education: Array.isArray(normalized.education) ? `Array(${normalized.education?.length || 0})` : typeof normalized.education,
    experiences: Array.isArray(normalized.experiences) ? `Array(${normalized.experiences?.length || 0})` : typeof normalized.experiences,
    projects: Array.isArray(normalized.projects) ? `Array(${normalized.projects?.length || 0})` : typeof normalized.projects,
    publications: Array.isArray(normalized.publications) ? `Array(${normalized.publications?.length || 0})` : typeof normalized.publications,
    skills: typeof normalized.skills === 'object' && normalized.skills ? `Object(${Object.keys(normalized.skills).length} categories)` : typeof normalized.skills,
    languages: Array.isArray(normalized.languages) ? `Array(${normalized.languages?.length || 0})` : typeof normalized.languages,
    workshop_and_certifications: Array.isArray(normalized.workshop_and_certifications) ? `Array(${normalized.workshop_and_certifications?.length || 0})` : typeof normalized.workshop_and_certifications,
    references: Array.isArray(normalized.references) ? `Array(${normalized.references?.length || 0})` : typeof normalized.references,
  })
  
  // Check for empty arrays
  logger.group('⚠️  Empty Section Check')
  Object.entries(normalized).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      logger.warn(`Empty array: ${key}`)
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
      logger.warn(`Empty object: ${key}`)
    }
  })
  logger.groupEnd()
  
  logger.groupEnd()
  
  return { rawData, normalized }
}
