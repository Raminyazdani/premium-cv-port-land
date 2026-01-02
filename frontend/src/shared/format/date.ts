/**
 * Shared date formatting utilities for CV sections.
 * Provides locale-aware date formatting with fallback handling.
 */

import { sanitizeDateString, parseDateSafe } from '@/utils/dataValidation'

/**
 * Date format options for different display contexts
 */
export type DateFormatType = 'short' | 'medium' | 'long' | 'year-only' | 'month-year'

/**
 * Get Intl.DateTimeFormatOptions based on format type
 */
export function getDateFormatOptions(format: DateFormatType): Intl.DateTimeFormatOptions {
  switch (format) {
    case 'short':
      return { year: 'numeric', month: 'short' }
    case 'medium':
      return { year: 'numeric', month: 'short', day: 'numeric' }
    case 'long':
      return { year: 'numeric', month: 'long', day: 'numeric' }
    case 'year-only':
      return { year: 'numeric' }
    case 'month-year':
      return { year: 'numeric', month: 'long' }
    default:
      return { year: 'numeric', month: 'short' }
  }
}

/**
 * Formats a date string safely for display.
 * 
 * @param dateStr - Date string to format
 * @param format - Format type (default: 'short')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string or empty string if unparseable
 */
export function formatDate(
  dateStr: unknown,
  format: DateFormatType = 'short',
  locale: string = 'en-US'
): string {
  if (!dateStr) return ''
  
  const sanitized = sanitizeDateString(dateStr)
  
  if (!sanitized) {
    return ''
  }
  
  // Handle "present" equivalents
  if (sanitized.isoString === 'present') {
    return 'Present'
  }
  
  try {
    return sanitized.date.toLocaleDateString(locale, getDateFormatOptions(format))
  } catch {
    return ''
  }
}

/**
 * Formats a date range for display.
 * 
 * @param startDate - Start date string
 * @param endDate - End date string (optional, defaults to "Present")
 * @param format - Format type (default: 'short')
 * @param locale - Locale for formatting (default: 'en-US')
 * @param presentLabel - Label for ongoing dates (default: 'Present')
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: unknown,
  endDate: unknown,
  format: DateFormatType = 'short',
  locale: string = 'en-US',
  presentLabel: string = 'Present'
): string {
  const start = formatDate(startDate, format, locale)
  
  // Check for "present" equivalents using sanitizer
  const endSanitized = sanitizeDateString(endDate)
  if (!endDate || (endSanitized && endSanitized.isoString === 'present')) {
    return start ? `${start} – ${presentLabel}` : ''
  }
  
  const end = formatDate(endDate, format, locale)
  
  if (!start && !end) return ''
  if (!start) return end
  if (!end) return `${start} – ${presentLabel}`
  
  return `${start} – ${end}`
}

/**
 * Sorts items by date in descending order (newest first).
 * Items without dates are placed at the end.
 * 
 * @param items - Array of items to sort
 * @param getDate - Function to extract date from each item
 * @returns Sorted array (new array, does not mutate original)
 */
export function sortByDateDesc<T>(
  items: T[],
  getDate: (item: T) => unknown
): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseDateSafe(getDate(a))
    const dateB = parseDateSafe(getDate(b))
    
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Sorts items by date in ascending order (oldest first).
 * Items without dates are placed at the end.
 * 
 * @param items - Array of items to sort
 * @param getDate - Function to extract date from each item
 * @returns Sorted array (new array, does not mutate original)
 */
export function sortByDateAsc<T>(
  items: T[],
  getDate: (item: T) => unknown
): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseDateSafe(getDate(a))
    const dateB = parseDateSafe(getDate(b))
    
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    return dateA.getTime() - dateB.getTime()
  })
}
