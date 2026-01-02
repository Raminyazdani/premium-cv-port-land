import { DEFAULT_VALUES } from '@/constants/app'

/**
 * "Present" equivalents in EN/DE/FA for date handling
 */
const PRESENT_EQUIVALENTS = [
  'present',
  'Present',
  'PRESENT',
  'تاکنون',      // Persian: "until now"
  'حال حاضر',   // Persian: "current"
  'Gegenwart',  // German: "present"
  'heute',      // German: "today"
  'Heute',
  'aktuell',    // German: "current"
  'Aktuell',
]

/**
 * Returns the number of days in a given month.
 * @param year - Full year (e.g., 2020)
 * @param month - Month (1-12)
 * @returns Number of days in that month
 */
function getDaysInMonth(year: number, month: number): number {
  // Month in Date constructor is 0-indexed, so we pass month (1-12) and day 0
  // This gives us the last day of the previous month, which is our month
  return new Date(year, month, 0).getDate()
}

/**
 * Sanitizes a date string by parsing flexible formats and clamping invalid days.
 * 
 * Policy: CLAMP_TO_LAST_VALID_DAY
 * - If the day exceeds the number of days in the month, clamp to the last valid day.
 * - Example: "2020-9-31" → "2020-09-30" (September has 30 days)
 * 
 * Handles:
 * - ISO format with or without leading zeros: "2020-09-15", "2020-9-15"
 * - "Present" equivalents in EN/DE/FA
 * - Year-month only: "2020-09" → "2020-09-01"
 * - Year only: "2020" → "2020-01-01"
 * 
 * @param dateStr - Date string to sanitize
 * @returns Object with sanitized ISO string and parsed Date, or null if unparseable
 */
export function sanitizeDateString(dateStr: unknown): {
  isoString: string
  date: Date
  wasModified: boolean
  originalValue: string
} | null {
  if (!dateStr) return null
  if (typeof dateStr !== 'string') return null
  
  const trimmed = dateStr.trim()
  if (!trimmed) return null
  
  // Handle "present" equivalents
  if (PRESENT_EQUIVALENTS.includes(trimmed)) {
    const now = new Date()
    return {
      isoString: 'present',
      date: now,
      wasModified: false,
      originalValue: trimmed,
    }
  }
  
  // Try to parse as date-like string with flexible format
  // Supports: YYYY-MM-DD, YYYY-M-D, YYYY-MM, YYYY
  const datePatterns = [
    // Full date with potential single-digit month/day: YYYY-M-D or YYYY-MM-DD
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // Year and month only: YYYY-MM or YYYY-M
    /^(\d{4})-(\d{1,2})$/,
    // Year only: YYYY
    /^(\d{4})$/,
  ]
  
  for (const pattern of datePatterns) {
    const match = trimmed.match(pattern)
    if (match) {
      const yearStr = match[1]
      const monthStr = match[2]
      const dayStr = match[3]
      
      if (!yearStr) continue
      
      const year = parseInt(yearStr, 10)
      let month = monthStr ? parseInt(monthStr, 10) : 1
      let day = dayStr ? parseInt(dayStr, 10) : 1
      let wasModified = false
      
      // Validate year range
      if (year < 1900 || year > 2100) {
        continue // Try next pattern or fail
      }
      
      // Clamp month to valid range
      if (month < 1) {
        month = 1
        wasModified = true
      } else if (month > 12) {
        month = 12
        wasModified = true
      }
      
      // Clamp day to valid range for the month
      const maxDays = getDaysInMonth(year, month)
      if (day < 1) {
        day = 1
        wasModified = true
      } else if (day > maxDays) {
        day = maxDays
        wasModified = true
      }
      
      // Format with leading zeros
      const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const date = new Date(year, month - 1, day)
      
      // Final validation that Date object is valid
      if (isNaN(date.getTime())) {
        continue
      }
      
      return {
        isoString,
        date,
        wasModified,
        originalValue: trimmed,
      }
    }
  }
  
  // Try native Date parsing as fallback for other formats
  try {
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      const isoString = date.toISOString().split('T')[0]
      if (!isoString) {
        return { error: 'Date parsing failed', originalValue: trimmed }
      }
      return {
        isoString,
        date,
        wasModified: false,
        originalValue: trimmed,
      }
    }
  } catch {
    // Parsing failed
  }
  
  return null
}

/**
 * Safely converts a value to a string with fallback.
 * @param value - Value to convert
 * @param fallback - Default value if conversion fails
 * @returns String representation or fallback
 */
export function safeString(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

/**
 * Safely converts a value to an array. Returns empty array if not an array.
 * @param value - Value to convert
 * @returns Array or empty array
 */
export function safeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value
  return []
}

/**
 * Safely converts a value to an object with fallback.
 * @param value - Value to convert
 * @param fallback - Default object if conversion fails
 * @returns Object or fallback
 */
export function safeObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T
  }
  return fallback
}

/**
 * Validates if a value can be parsed as a valid date.
 * Uses the sanitizeDateString function for consistent validation.
 * @param dateStr - Date string or number to validate
 * @returns true if valid date, false otherwise
 */
export function isValidDate(dateStr: unknown): boolean {
  if (!dateStr) return false
  
  // Handle numbers directly
  if (typeof dateStr === 'number') {
    const date = new Date(dateStr)
    return !isNaN(date.getTime())
  }
  
  // Use sanitizer for strings
  const sanitized = sanitizeDateString(dateStr)
  return sanitized !== null
}

/**
 * Formats a date string safely, handling invalid dates gracefully.
 * Uses sanitizeDateString to handle malformed dates by clamping.
 * 
 * Policy: CLAMP_TO_LAST_VALID_DAY
 * - Invalid dates like "2020-9-31" are clamped to "2020-09-30"
 * - "Present" equivalents in EN/DE/FA are formatted as "Present"
 * - Completely unparseable dates return empty string (no "Invalid Date" shown)
 * 
 * @param dateStr - Date to format
 * @param options - Intl date formatting options
 * @returns Formatted date string or empty string if unparseable
 */
export function formatDateSafe(
  dateStr: unknown,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }
): string {
  if (!dateStr) return ''
  
  // Try to sanitize the date string
  const sanitized = sanitizeDateString(dateStr)
  
  if (!sanitized) {
    // Completely unparseable - return empty string instead of showing "Invalid Date"
    return ''
  }
  
  // Handle "present" equivalents
  if (sanitized.isoString === 'present') {
    return 'Present'
  }
  
  try {
    return sanitized.date.toLocaleDateString('en-US', options)
  } catch {
    return ''
  }
}

export function formatDateRangeSafe(
  startDate: unknown,
  endDate: unknown
): string {
  const start = formatDateSafe(startDate)
  
  // Check for "present" equivalents using sanitizer
  const endSanitized = sanitizeDateString(endDate)
  if (!endDate || (endSanitized && endSanitized.isoString === 'present')) {
    return start ? `${start} – Present` : ''
  }
  
  const end = formatDateSafe(endDate)
  
  if (!start && !end) return ''
  if (!start) return end
  if (!end) return `${start} – Present`
  
  return `${start} – ${end}`
}

/**
 * Parses a date string safely, handling invalid dates by clamping.
 * Uses sanitizeDateString for consistent parsing and validation.
 * 
 * @param dateStr - Date string to parse
 * @returns Date object or null if unparseable
 */
export function parseDateSafe(dateStr: unknown): Date | null {
  if (!dateStr) return null
  
  // Handle numbers directly
  if (typeof dateStr === 'number') {
    try {
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }
  
  // Use sanitizer for strings
  const sanitized = sanitizeDateString(dateStr)
  return sanitized ? sanitized.date : null
}

export function safeUrl(url: unknown): string | null {
  if (!url) return null
  if (typeof url !== 'string') return null
  
  try {
    const urlObj = new URL(url)
    return urlObj.href
  } catch {
    if (url.startsWith('/') || url.startsWith('./')) {
      return url
    }
    return null
  }
}

export function safeTypeKey(typeKey: unknown): string[] {
  if (!typeKey) return []
  if (Array.isArray(typeKey)) {
    return typeKey.filter((key): key is string => typeof key === 'string')
  }
  return []
}

export function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

export function isEmpty(value: unknown): boolean {
  return !hasContent(value)
}

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return DEFAULT_VALUES.FALLBACK_INITIALS
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return DEFAULT_VALUES.FALLBACK_INITIALS
  const firstPart = parts[0]
  if (!firstPart) return DEFAULT_VALUES.FALLBACK_INITIALS
  if (parts.length === 1) return firstPart.charAt(0).toUpperCase()
  
  const lastPart = parts[parts.length - 1]
  if (!lastPart) return firstPart.charAt(0).toUpperCase()
  return (firstPart.charAt(0) + lastPart.charAt(0)).toUpperCase()
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function isImageUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

export function isPdfUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false
  return /\.pdf$/i.test(url)
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}
