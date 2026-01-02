/**
 * Education Feature Module - Data Adapter
 * 
 * This module converts raw CV education data into view models
 * ready for rendering. It handles data normalization, validation,
 * and transformation.
 */

import type { Education } from '@/types/cv'
import type { EducationViewModel } from './model'
import { formatEducationDateRange, isCurrentEducation } from './format'
import { safeString, safeArray, safeUrl } from '@/utils/dataValidation'
import { parseDateSafe } from '@/utils/dataValidation'

/**
 * Converts a raw CV education entry to a view model.
 * 
 * @param education - Raw education data from CV
 * @param index - Index for generating unique ID
 * @param translations - Translation strings for fallbacks
 * @returns EducationViewModel ready for rendering
 */
export function toEducationViewModel(
  education: Education,
  index: number,
  translations: { unknownInstitution: string }
): EducationViewModel {
  const institution = safeString(education.institution, translations.unknownInstitution)
  const studyType = safeString(education.studyType)
  const area = safeString(education.area)
  const location = safeString(education.location)
  const gpa = safeString(education.gpa)
  const logoUrl = education.logo_url ? safeUrl(education.logo_url) : null
  const typeKey = safeArray<string>(education.type_key)
  
  // Create study description from type and area
  let studyDescription = ''
  if (studyType && area) {
    studyDescription = `${studyType} in ${area}`
  } else if (studyType) {
    studyDescription = studyType
  } else if (area) {
    studyDescription = area
  }
  
  // Parse dates for sorting
  const startDate = parseDateSafe(education.startDate)
  const endDate = parseDateSafe(education.endDate)
  
  // Format date range for display
  const dateRange = formatEducationDateRange(education.startDate, education.endDate)
  
  // Check if currently active
  const isCurrent = isCurrentEducation(education.endDate)
  
  // Filter tags for display (exclude "Full CV")
  const tags = typeKey.filter(key => key !== 'Full CV')
  
  return {
    id: `education-${index}-${institution.toLowerCase().replace(/\s+/g, '-')}`,
    institution,
    studyType,
    area,
    studyDescription,
    location,
    dateRange,
    startDate,
    endDate,
    gpa,
    logoUrl,
    tags,
    typeKey,
    isCurrent,
  }
}

/**
 * Converts an array of raw education entries to view models.
 * 
 * @param educationData - Array of raw education data
 * @param translations - Translation strings for fallbacks
 * @returns Array of EducationViewModels
 */
export function toEducationViewModels(
  educationData: Education[],
  translations: { unknownInstitution: string }
): EducationViewModel[] {
  return educationData.map((edu, index) => 
    toEducationViewModel(edu, index, translations)
  )
}

/**
 * Filters education view models by type_key.
 * 
 * @param viewModels - Array of education view models
 * @param selectedFocus - Current focus filter (e.g., "Programming", "Full CV")
 * @returns Filtered array of view models
 */
export function filterByFocus(
  viewModels: EducationViewModel[],
  selectedFocus: string
): EducationViewModel[] {
  if (selectedFocus === 'Full CV' || !selectedFocus) {
    return viewModels
  }
  
  return viewModels.filter(vm => {
    // If no typeKey, always show
    if (vm.typeKey.length === 0) return true
    
    // Check if any typeKey matches the focus
    return vm.typeKey.some(key => 
      key.toLowerCase().includes(selectedFocus.toLowerCase())
    )
  })
}

/**
 * Filters education view models by a specific tag.
 * 
 * @param viewModels - Array of education view models
 * @param tag - Tag to filter by (empty string or "All" shows all)
 * @param allLabel - Label for "all" option (e.g., "All" in EN, "Alle" in DE)
 * @returns Filtered array of view models
 */
export function filterByTag(
  viewModels: EducationViewModel[],
  tag: string,
  allLabel: string
): EducationViewModel[] {
  if (!tag || tag === allLabel) {
    return viewModels
  }
  
  return viewModels.filter(vm => vm.typeKey.includes(tag))
}

/**
 * Sorts education view models by start date (newest first).
 * 
 * @param viewModels - Array of education view models
 * @returns Sorted array (new array, does not mutate original)
 */
export function sortByDateDesc(viewModels: EducationViewModel[]): EducationViewModel[] {
  return [...viewModels].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0
    if (!a.startDate) return 1
    if (!b.startDate) return -1
    return b.startDate.getTime() - a.startDate.getTime()
  })
}

/**
 * Extracts all unique tags from education view models.
 * 
 * @param viewModels - Array of education view models
 * @returns Sorted array of unique tags
 */
export function extractTags(viewModels: EducationViewModel[]): string[] {
  const tagSet = new Set<string>()
  
  viewModels.forEach(vm => {
    vm.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}
