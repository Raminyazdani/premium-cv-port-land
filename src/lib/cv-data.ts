import type { CVData } from '@/types/cv'
import cvDataJson from '@/data/cv.json'

export function getCVData(): CVData {
  return cvDataJson as CVData
}

export function getBasics() {
  const data = getCVData()
  return data.basics ?? null
}

export function getProfilePhotoUrl(): string | null {
  const basics = getBasics()
  
  if (basics?.Pictures && Array.isArray(basics.Pictures)) {
    const profilePic = basics.Pictures.find(pic => pic.type_of === 'profile')
    if (profilePic?.URL) return profilePic.URL
  }
  
  if (basics?.image) return basics.image
  
  return null
}

export function getInitials(name?: string | null): string {
  if (!name) return '??'
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatLocation(location?: { city?: string | null, region?: string | null, country?: string | null } | null): string {
  if (!location) return ''
  
  const parts = [location.city, location.region, location.country].filter(Boolean)
  return parts.join(', ')
}
