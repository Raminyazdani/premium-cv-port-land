import type { CVData, Basics, Location } from '@/types/cv'
import cvDataJson from '@/data/cv.json'
import { safeArray, safeString, safeUrl } from '@/utils/dataValidation'

export function getCVData(): CVData {
  try {
    return cvDataJson as unknown as CVData
  } catch {
    return {}
  }
}

export function getBasics(): Basics | null {
  try {
    const data = getCVData()
    
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
  if (!basics) return 'Unknown'
  
  const fname = safeString(basics.fname).trim()
  const lname = safeString(basics.lname).trim()
  const fullName = safeString(basics.name).trim()
  
  if (fname || lname) {
    const name = [fname, lname].filter(Boolean).join(' ').trim()
    return name || 'Unknown'
  }
  
  return fullName || 'Unknown'
}

export function getProfilePhotoUrl(): string | null {
  try {
    const basics = getBasics()
    
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

export function getCoverPhotoUrl(): string | null {
  try {
    const basics = getBasics()
    
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

export function getProfiles() {
  try {
    const data = getCVData()
    return safeArray(data.profiles)
  } catch {
    return []
  }
}

export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return '?'
  
  const trimmed = name.trim()
  if (!trimmed) return '?'
  
  const parts = trimmed.split(/\s+/)
  if (parts.length === 0) return '?'
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
