/**
 * Education Feature Module - View Model Types
 * 
 * This module defines the view model types for the education section.
 * These types represent the data shape needed for rendering,
 * separate from the raw CV data types.
 */

/**
 * View model for a single education entry.
 * Contains all pre-processed data needed for rendering.
 */
export interface EducationViewModel {
  /** Unique identifier for React keys */
  id: string
  /** Name of the educational institution */
  institution: string
  /** Type of study (e.g., "Bachelor's", "Master's") */
  studyType: string
  /** Area/field of study */
  area: string
  /** Combined study type and area (e.g., "Master's in Computer Science") */
  studyDescription: string
  /** Location of the institution */
  location: string
  /** Formatted date range (e.g., "Jan 2020 – Dec 2022") */
  dateRange: string
  /** Start date for sorting purposes */
  startDate: Date | null
  /** End date for sorting purposes */
  endDate: Date | null
  /** GPA if available */
  gpa: string
  /** URL to institution logo */
  logoUrl: string | null
  /** Tags for filtering (excluding "Full CV") */
  tags: string[]
  /** Original type_key array for filtering */
  typeKey: string[]
  /** Whether this is currently active (no end date) */
  isCurrent: boolean
}

/**
 * Props for the education section component.
 */
export interface EducationSectionProps {
  /** Optional additional CSS classes */
  className?: string
}

/**
 * Props for an individual education card.
 */
export interface EducationCardProps {
  /** Education view model data */
  education: EducationViewModel
  /** Index for staggered animations */
  index: number
}

/**
 * Available filter options for education entries.
 */
export interface EducationFilterOptions {
  /** All available tag options */
  tags: string[]
  /** Currently selected tag filter */
  selectedTag: string
}
