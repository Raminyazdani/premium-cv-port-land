/**
 * Education Section Component
 * 
 * This component uses the education feature module for:
 * - Data transformation (adapter)
 * - Date formatting (format)
 * - Presentational components (EducationCard, EducationTimeline, etc.)
 * 
 * The section component focuses on:
 * - Data fetching (from context)
 * - State management (filters)
 * - Layout composition
 */

import { useState, useMemo } from 'react'
import { Separator } from '@/components/ui/separator'
import { GraduationCap } from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'
import { SectionWrapper } from '@/components/composites/SectionWrapper'
import { useFilteredData } from '@/hooks/useFilteredData'
import { logger } from '@/lib/logger'

// Feature module imports
import {
  toEducationViewModels,
  sortByDateDesc,
  filterByTag,
  extractTags,
  EducationTimeline,
  EducationFilter,
  EducationEmptyState,
} from '@/features/education'

export function EducationSection() {
  const cvData = useCV()
  const rawEducation = cvData.education ?? []
  const t = useTranslation()
  
  // DEBUG: Log what we receive
  logger.group('📋 [EducationSection] Render')
  logger.debug('cvData.education exists:', cvData.education !== undefined)
  logger.debug('cvData.education is array:', Array.isArray(cvData.education))
  logger.debug('education length:', rawEducation.length)
  if (rawEducation.length > 0) {
    logger.debug('First education item:', rawEducation[0])
    logger.debug('First education type_key:', rawEducation[0]?.type_key)
  }
  logger.groupEnd()
  
  const [selectedFilter, setSelectedFilter] = useState<string>(t.filters.all)
  
  // Use the shared hook for global focus filtering
  const filteredByGlobalFocus = useFilteredData({
    data: rawEducation,
    getTypeKey: (item) => item.type_key,
  })
  
  // Transform raw data to view models using the adapter
  const viewModels = useMemo(() => {
    const models = toEducationViewModels(filteredByGlobalFocus, {
      unknownInstitution: t.fallbacks.unknown_institution,
    })
    return sortByDateDesc(models)
  }, [filteredByGlobalFocus, t.fallbacks.unknown_institution])
  
  // Extract tags for filter UI
  const allTags = useMemo(() => extractTags(viewModels), [viewModels])
  
  // Apply secondary filter (within-section tag filter)
  const filteredEducation = useMemo(() => {
    return filterByTag(viewModels, selectedFilter, t.filters.all)
  }, [viewModels, selectedFilter, t.filters.all])
  
  // Calculate tag counts for filter badges
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    viewModels.forEach(vm => {
      vm.tags.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })
    return counts
  }, [viewModels])
  
  return (
    <SectionWrapper
      id="education"
      title={t.sections.education}
      icon={<GraduationCap size={32} weight="duotone" />}
      isEmpty={rawEducation.length === 0}
      emptyMessage={t.empty.no_education}
      subtitle={t.sectionSubtitles.education}
    >
      {/* Secondary filter (tag-based) */}
      {allTags.length > 0 && (
        <>
          <div className="mb-8 -mt-4">
            <EducationFilter
              tags={allTags}
              selectedTag={selectedFilter}
              allLabel={t.filters.all}
              filterLabel={t.actions.filter}
              onTagSelect={setSelectedFilter}
              tagCounts={tagCounts}
              totalCount={viewModels.length}
            />
          </div>
          <Separator className="mb-8" />
        </>
      )}
      
      {/* Education content */}
      {filteredEducation.length === 0 ? (
        <EducationEmptyState
          message={t.empty.no_results}
          clearLabel={t.actions.clear}
          onClear={() => setSelectedFilter(t.filters.all)}
        />
      ) : (
        <EducationTimeline items={filteredEducation} />
      )}
    </SectionWrapper>
  )
}
