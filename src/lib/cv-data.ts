import type { CVData, Basics, Location } from '@/types/cv'
import cvDataJson from '@/data/cv.json'

export function getCVData(): CVData {
  return cvDataJson as unknown as CVData
}

export function getBasics(): Basics | null {
  const data = getCVData()
  
  if (!data.basics) return null
  
  if (Array.isArray(data.basics)) {
    return data.basics[0] ?? null
  }
  
  return data.basics
}

export function getFullName(basics: Basics | null): string {
  if (!basics) return ''
  
  if (basics.fname || basics.lname) {
    return [basics.fname, basics.lname].filter(Boolean).join(' ').trim() || 'Unknown'
  }
  
  return basics.name ?? 'Unknown'
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

export function formatLocation(location?: Location | Location[] | null): string {
  if (!location) return ''
  
  const loc = Array.isArray(location) ? location[0] : location
  if (!loc) return ''
  
  const parts = [loc.city, loc.region, loc.country].filter(Boolean)
  return parts.join(', ')
}

export function getRoles(label?: string | string[] | null): string[] {
  if (!label) return []
  
  if (Array.isArray(label)) {
    return label.filter(Boolean)
  }
  
  return label.split('·').map(r => r.trim()).filter(Boolean)
}
