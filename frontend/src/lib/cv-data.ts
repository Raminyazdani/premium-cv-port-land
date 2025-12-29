/**
 * CV Data Utilities: Helper functions for accessing CV data
 *
 * These are pure utility functions that work with CV data.
 * For accessing CV data in components, use the CVDataContext:
 *
 * ```tsx
 * import { useCVData } from '@/context/CVDataContext'
 * const { data } = useCVData()
 * const basics = extractBasics(data)
 * ```
 */

import type { CVData, Basics, Location } from '@/types/cv'
import { safeArray, safeString, safeUrl } from '@/utils/dataValidation'
import { DEFAULT_VALUES } from '@/constants/app'

/**
 * Helper function to extract basics from CV data
 * Use this with data from useCVData() hook
 */
export function extractBasics(data: CVData): Basics | null {
  try {
    if (!data.basics) return null
    
    if (Array.isArray(data.basics)) {
      return data.basics[0] ?? null
    }
    
    return data.basics
  } catch {
    return null
  }
}

export function getFullName(basics: Basics | null | undefined): string {
  if (!basics) return DEFAULT_VALUES.UNKNOWN_NAME
  
  const fname = safeString(basics.fname).trim()
  const lname = safeString(basics.lname).trim()
  const fullName = safeString(basics.name).trim()
  
  if (fname || lname) {
    const name = [fname, lname].filter(Boolean).join(' ').trim()
    return name || DEFAULT_VALUES.UNKNOWN_NAME
  }
  
  return fullName || DEFAULT_VALUES.UNKNOWN_NAME
}

/**
 * Extract profile photo URL from basics data
 */
export function extractProfilePhotoUrl(basics: Basics | null): string | null {
  try {
    if (basics?.Pictures && Array.isArray(basics.Pictures)) {
      const profilePic = basics.Pictures.find(pic => 
        pic && typeof pic === 'object' && pic.type_of === 'profile'
      )
      if (profilePic?.URL) {
        const validUrl = safeUrl(profilePic.URL)
        if (validUrl) return validUrl
      }
    }
    
    if (basics?.image) {
      const validUrl = safeUrl(basics.image)
      if (validUrl) return validUrl
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Extract cover photo URL from basics data
 */
export function extractCoverPhotoUrl(basics: Basics | null): string | null {
  try {
    if (basics?.Pictures && Array.isArray(basics.Pictures)) {
      const coverPic = basics.Pictures.find(pic => 
        pic && typeof pic === 'object' && pic.type_of === 'cover'
      )
      if (coverPic?.URL) {
        const validUrl = safeUrl(coverPic.URL)
        if (validUrl) return validUrl
      }
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Extract profiles from CV data
 */
export function extractProfiles(data: CVData) {
  try {
    return safeArray(data.profiles)
  } catch {
    return []
  }
}

export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return DEFAULT_VALUES.FALLBACK_INITIALS
  
  const trimmed = name.trim()
  if (!trimmed) return DEFAULT_VALUES.FALLBACK_INITIALS
  
  const parts = trimmed.split(/\s+/)
  if (parts.length === 0) return DEFAULT_VALUES.FALLBACK_INITIALS
  if (parts.length === 1) {
    const firstWord = parts[0]
    return firstWord.length >= 2 
      ? firstWord.substring(0, 2).toUpperCase()
      : firstWord.charAt(0).toUpperCase()
  }
  
  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  return (first + last).toUpperCase()
}

export function formatLocation(location?: Location | Location[] | null): string {
  try {
    if (!location) return ''
    
    const loc = Array.isArray(location) ? location[0] : location
    if (!loc) return ''
    
    const parts = [
      safeString(loc.city),
      safeString(loc.region),
      safeString(loc.country)
    ].filter(Boolean)
    
    return parts.join(', ')
  } catch {
    return ''
  }
}

export function getRoles(label?: string | string[] | null): string[] {
  try {
    if (!label) return []
    
    if (Array.isArray(label)) {
      return label
        .filter(item => typeof item === 'string')
        .map(item => item.trim())
        .filter(Boolean)
    }
    
    if (typeof label === 'string') {
      return label
        .split(/[·•|]/)
        .map(r => r.trim())
        .filter(Boolean)
    }
    
    return []
  } catch {
    return []
  }
}
