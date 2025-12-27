/**
 * DEBUG UTILITY: Data Flow Diagnostic
 * 
 * This file helps diagnose why content is not showing in sections.
 * Temporary - should be removed after bug is fixed.
 */

import type { CVData } from '@/types/cv'

export function logDataSummary(label: string, data: any) {
  if (!import.meta.env.DEV) return
  
  console.group(`🔍 [DEBUG] ${label}`)
  console.log('Type:', typeof data)
  console.log('Is Array:', Array.isArray(data))
  console.log('Is null/undefined:', data === null || data === undefined)
  
  if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      console.log('Array length:', data.length)
      if (data.length > 0) {
        console.log('First item:', data[0])
        console.log('First item keys:', Object.keys(data[0] || {}))
      }
    } else {
      console.log('Object keys:', Object.keys(data))
      const firstKey = Object.keys(data)[0]
      if (firstKey) {
        console.log(`First key "${firstKey}" value type:`, typeof data[firstKey])
        console.log(`First key "${firstKey}" is array:`, Array.isArray(data[firstKey]))
      }
    }
  }
  
  console.groupEnd()
}

export function validateCVDataStructure(data: CVData): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check basics
  if (!Array.isArray(data.basics)) {
    issues.push(`basics is not an array: ${typeof data.basics}`)
  } else if (data.basics.length === 0) {
    issues.push('basics array is empty')
  }
  
  // Check profiles
  if (!Array.isArray(data.profiles)) {
    issues.push(`profiles is not an array: ${typeof data.profiles}`)
  } else if (data.profiles.length === 0) {
    issues.push('profiles array is empty')
  }
  
  // Check education
  if (!Array.isArray(data.education)) {
    issues.push(`education is not an array: ${typeof data.education}`)
  } else if (data.education.length === 0) {
    issues.push('education array is empty')
  }
  
  // Check experiences
  if (!Array.isArray(data.experiences)) {
    issues.push(`experiences is not an array: ${typeof data.experiences}`)
  } else if (data.experiences.length === 0) {
    issues.push('experiences array is empty')
  }
  
  // Check projects
  if (!Array.isArray(data.projects)) {
    issues.push(`projects is not an array: ${typeof data.projects}`)
  } else if (data.projects.length === 0) {
    issues.push('projects array is empty')
  }
  
  // Check skills
  if (!data.skills || typeof data.skills !== 'object' || Array.isArray(data.skills)) {
    issues.push(`skills is not an object: ${typeof data.skills}`)
  } else if (Object.keys(data.skills).length === 0) {
    issues.push('skills object is empty')
  }
  
  // Check languages
  if (!Array.isArray(data.languages)) {
    issues.push(`languages is not an array: ${typeof data.languages}`)
  } else if (data.languages.length === 0) {
    issues.push('languages array is empty')
  }
  
  // Check workshop_and_certifications
  if (!Array.isArray(data.workshop_and_certifications)) {
    issues.push(`workshop_and_certifications is not an array: ${typeof data.workshop_and_certifications}`)
  } else if (data.workshop_and_certifications.length === 0) {
    issues.push('workshop_and_certifications array is empty')
  }
  
  // Check publications
  if (!Array.isArray(data.publications)) {
    issues.push(`publications is not an array: ${typeof data.publications}`)
  } else if (data.publications.length === 0) {
    issues.push('publications array is empty')
  }
  
  // Check references
  if (!Array.isArray(data.references)) {
    issues.push(`references is not an array: ${typeof data.references}`)
  } else if (data.references.length === 0) {
    issues.push('references array is empty')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

export function logSectionRenderDecision(
  sectionName: string,
  data: any,
  filteredData: any,
  selectedFocus: string
) {
  if (!import.meta.env.DEV) return
  
  console.group(`📋 [RENDER] ${sectionName}`)
  console.log('Selected Focus:', selectedFocus)
  console.log('Raw data length:', Array.isArray(data) ? data.length : 'N/A (not array)')
  console.log('Filtered data length:', Array.isArray(filteredData) ? filteredData.length : 'N/A (not array)')
  
  if (Array.isArray(data) && data.length > 0) {
    console.log('First item type_key:', data[0]?.type_key)
  }
  
  if (Array.isArray(filteredData)) {
    if (filteredData.length === 0 && Array.isArray(data) && data.length > 0) {
      console.warn('⚠️  All items filtered out!')
      console.log('First raw item:', data[0])
    }
  }
  
  console.groupEnd()
}
