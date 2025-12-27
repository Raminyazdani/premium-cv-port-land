/**
 * CV Data Utilities: Helper functions for accessing CV data
 * 
 * IMPORTANT: These functions are now deprecated in favor of using
 * useCVData() hook directly in components. They are kept for
 * backward compatibility but should not be used in new code.
 * 
 * Use the CVDataContext instead:
 * ```tsx
 * import { useCV } from '@/context/CVDataContext'
 * const data = useCV()
 * ```
 */

import type { CVData, Basics, Location } from '@/types/cv'
import { safeArray, safeString, safeUrl } from '@/utils/dataValidation'
import { DEFAULT_VALUES } from '@/constants/app'

/**
 * @deprecated Use useCVData() hook instead
 * This function no longer works correctly with language switching.
 * It's kept for backward compatibility only.
 */
export function getCVData(): CVData {
  console.warn('getCVData() is deprecated. Use useCVData() hook instead.')
  return {} as CVData
}

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

/**
 * @deprecated Use useCVData() + extractBasics() instead
 */
export function getBasics(): Basics | null {
  console.warn('getBasics() is deprecated. Use useCVData() + extractBasics() instead.')
  return null
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
 * @deprecated Use useCVData() + extractProfilePhotoUrl() instead
 */
export function getProfilePhotoUrl(): string | null {
  console.warn('getProfilePhotoUrl() is deprecated. Use useCVData() + extractProfilePhotoUrl() instead.')
  return null
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
 * @deprecated Use useCVData() + extractCoverPhotoUrl() instead
 */
export function getCoverPhotoUrl(): string | null {
  console.warn('getCoverPhotoUrl() is deprecated. Use useCVData() + extractCoverPhotoUrl() instead.')
  return null
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

/**
 * @deprecated Use useCVData() + extractProfiles() instead
 */
export function getProfiles() {
  console.warn('getProfiles() is deprecated. Use useCVData() + extractProfiles() instead.')
  return []
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
