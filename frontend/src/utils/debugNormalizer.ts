/**
 * DEBUG UTILITY: Diagnose normalization issues
 * This file helps identify why sections are empty after normalization
 */

import { normalizeCVData, type Language } from './dataNormalizer'
import cvDataEN from '@/data/cv.json'
import cvDataDE from '@/data/ramin_de.json'
import cvDataFA from '@/data/ramin_fa.json'

export function diagnoseNormalization(lang: Language = 'en') {
  console.group(`🔍 NORMALIZATION DIAGNOSIS for ${lang.toUpperCase()}`)
  
  // Load raw data
  let rawData: any
  switch (lang) {
    case 'de':
      rawData = cvDataDE
      break
    case 'fa':
      rawData = cvDataFA
      break
    default:
      rawData = cvDataEN
  }
  
  console.log('📥 Raw Data Keys:', Object.keys(rawData))
  console.log('📥 Raw Data Sample (first 3 keys):', 
    Object.keys(rawData).slice(0, 3).reduce((acc, key) => {
      const value = rawData[key]
      acc[key] = Array.isArray(value) 
        ? `Array(${value.length})` 
        : typeof value === 'object' 
          ? `Object(${Object.keys(value).length} keys)` 
          : typeof value
      return acc
    }, {} as Record<string, any>)
  )
  
  // Check specific sections
  console.group('📊 Section Analysis')
  
  const sections = [
    'basics', 'grunddaten', 'اطلاعات_پایه',
    'education', 'ausbildung', 'تحصیلات',
    'profiles', 'profile', 'پروفایل‌ها',
    'projects', 'projekte', 'پروژه‌ها'
  ]
  
  sections.forEach(key => {
    if (rawData[key] !== undefined) {
      const value = rawData[key]
      console.log(`✓ Found: ${key} =`, Array.isArray(value) ? `Array(${value.length})` : typeof value)
    }
  })
  
  console.groupEnd()
  
  // Normalize
  console.log('\n🔄 Normalizing...')
  const normalized = normalizeCVData(rawData, lang)
  
  console.log('📤 Normalized Keys:', Object.keys(normalized))
  console.log('📤 Normalized Data Summary:', {
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
  console.group('⚠️  Empty Section Check')
  Object.entries(normalized).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      console.warn(`Empty array: ${key}`)
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
      console.warn(`Empty object: ${key}`)
    }
  })
  console.groupEnd()
  
  console.groupEnd()
  
  return { rawData, normalized }
}

// Run diagnostics in dev mode
if (import.meta.env.DEV) {
  console.log('🚀 Running normalization diagnostics...')
  diagnoseNormalization('en')
  diagnoseNormalization('de')
  diagnoseNormalization('fa')
}
