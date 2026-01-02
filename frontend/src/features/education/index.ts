/**
 * Education Feature Module
 * 
 * This module exports all education-related functionality:
 * - Types (model.ts)
 * - Data transformations (adapter.ts)
 * - Formatting utilities (format.ts)
 * - Presentational components (components/)
 * 
 * Usage:
 * ```tsx
 * import { 
 *   toEducationViewModels, 
 *   sortByDateDesc, 
 *   EducationCard 
 * } from '@/features/education'
 * ```
 */

// Types
export type { 
  EducationViewModel, 
  EducationSectionProps, 
  EducationCardProps,
  EducationFilterOptions,
} from './model'

// Adapter functions
export {
  toEducationViewModel,
  toEducationViewModels,
  filterByFocus,
  filterByTag,
  sortByDateDesc,
  extractTags,
} from './adapter'

// Formatting utilities
export {
  formatEducationDateRange,
  formatEducationDate,
  isCurrentEducation,
  formatGpa,
  formatStudyTypeAndArea,
  getEducationDuration,
} from './format'

// Presentational components
export {
  EducationCard,
  EducationTimeline,
  EducationFilter,
  EducationEmptyState,
} from './components'
