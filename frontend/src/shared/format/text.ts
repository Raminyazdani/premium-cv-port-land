/**
 * Shared text formatting utilities for CV sections.
 * Provides safe string handling with fallbacks.
 */

/**
 * Safely converts a value to a string with fallback.
 * Re-exports from dataValidation for consistency.
 * 
 * @param value - Value to convert
 * @param fallback - Default value if conversion fails
 * @returns String representation or fallback
 */
export function safeText(value: unknown, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

/**
 * Truncates text to a maximum length with ellipsis.
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - String to append when truncated (default: '...')
 * @returns Truncated text or original if shorter than maxLength
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + ellipsis
}

/**
 * Joins an array of strings with a separator, filtering out empty values.
 * 
 * @param parts - Array of string values (may contain null/undefined)
 * @param separator - Separator between parts (default: ', ')
 * @returns Joined string
 */
export function joinNonEmpty(
  parts: (string | null | undefined)[],
  separator: string = ', '
): string {
  return parts
    .filter((part): part is string => typeof part === 'string' && part.trim() !== '')
    .join(separator)
}

/**
 * Formats a study type and area into a readable string.
 * Example: "Master's" + "Computer Science" => "Master's in Computer Science"
 * 
 * @param studyType - Type of study (e.g., "Bachelor's", "Master's")
 * @param area - Area of study (e.g., "Computer Science")
 * @param connector - Word connecting type and area (default: 'in')
 * @returns Formatted string
 */
export function formatStudyTypeAndArea(
  studyType: string | null | undefined,
  area: string | null | undefined,
  connector: string = 'in'
): string {
  const type = safeText(studyType)
  const areaText = safeText(area)
  
  if (type && areaText) {
    return `${type} ${connector} ${areaText}`
  }
  if (type) return type
  if (areaText) return areaText
  return ''
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param text - Text to capitalize
 * @returns Text with first letter capitalized
 */
export function capitalizeFirst(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Gets initials from a name string.
 * 
 * @param name - Full name
 * @param fallback - Fallback if name is empty (default: '?')
 * @returns Initials (e.g., "John Doe" => "JD")
 */
export function getInitials(name: string | null | undefined, fallback: string = '?'): string {
  if (!name || typeof name !== 'string') return fallback
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return fallback
  
  const firstPart = parts[0]
  if (!firstPart) return fallback
  
  if (parts.length === 1) {
    return firstPart.charAt(0).toUpperCase()
  }
  
  const lastPart = parts[parts.length - 1]
  if (!lastPart) return firstPart.charAt(0).toUpperCase()
  
  return (firstPart.charAt(0) + lastPart.charAt(0)).toUpperCase()
}
