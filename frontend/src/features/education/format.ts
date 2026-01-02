/**
 * Education Feature Module - Formatting Utilities
 * 
 * This module provides education-specific formatting functions
 * for dates, labels, and display strings.
 */

import { formatDateRange as sharedFormatDateRange, formatDate } from '@/shared/format/date'
import { sanitizeDateString } from '@/utils/dataValidation'

/**
 * Formats an education date range.
 * Uses "Present" for ongoing education.
 * 
 * @param startDate - Start date string
 * @param endDate - End date string (optional)
 * @param presentLabel - Label for ongoing education (default: 'Present')
 * @returns Formatted date range string
 */
export function formatEducationDateRange(
  startDate: unknown,
  endDate: unknown,
  presentLabel: string = 'Present'
): string {
  return sharedFormatDateRange(startDate, endDate, 'short', 'en-US', presentLabel)
}

/**
 * Formats a single education date (e.g., graduation date).
 * 
 * @param date - Date string
 * @param format - Format type (default: 'medium')
 * @returns Formatted date string
 */
export function formatEducationDate(
  date: unknown,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  return formatDate(date, format)
}

/**
 * Checks if an education entry is currently active (no end date or "present").
 * 
 * @param endDate - End date string
 * @returns true if currently active
 */
export function isCurrentEducation(endDate: unknown): boolean {
  if (!endDate) return true
  
  const sanitized = sanitizeDateString(endDate)
  if (!sanitized) return true
  
  return sanitized.isoString === 'present'
}

/**
 * Formats GPA for display.
 * 
 * @param gpa - GPA value
 * @param label - Label prefix (default: 'GPA:')
 * @returns Formatted GPA string or empty if no GPA
 */
export function formatGpa(
  gpa: string | null | undefined,
  label: string = 'GPA:'
): string {
  if (!gpa || typeof gpa !== 'string' || !gpa.trim()) {
    return ''
  }
  return `${label} ${gpa}`
}

/**
 * Formats study type and area for display.
 * 
 * @param studyType - Type of study (e.g., "Bachelor's")
 * @param area - Area of study (e.g., "Computer Science")
 * @param connector - Word between type and area (default: 'in')
 * @returns Formatted string (e.g., "Bachelor's in Computer Science")
 */
export function formatStudyTypeAndArea(
  studyType: string | null | undefined,
  area: string | null | undefined,
  connector: string = 'in'
): string {
  const type = studyType?.trim() || ''
  const areaText = area?.trim() || ''
  
  if (type && areaText) {
    return `${type} ${connector} ${areaText}`
  }
  if (type) return type
  if (areaText) return areaText
  return ''
}

/**
 * Gets a display label for education duration.
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Human-readable duration (e.g., "2 years", "6 months")
 */
export function getEducationDuration(
  startDate: unknown,
  endDate: unknown
): string {
  const start = sanitizeDateString(startDate)
  const end = sanitizeDateString(endDate)
  
  if (!start) return ''
  
  const startDateObj = start.date
  const endDateObj = end?.isoString === 'present' ? new Date() : (end?.date || new Date())
  
  const diffMs = endDateObj.getTime() - startDateObj.getTime()
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30))
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
  }
  
  const years = Math.floor(diffMonths / 12)
  const remainingMonths = diffMonths % 12
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`
  }
  
  const yearPart = `${years} year${years !== 1 ? 's' : ''}`
  const monthPart = `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  return `${yearPart}, ${monthPart}`
}
