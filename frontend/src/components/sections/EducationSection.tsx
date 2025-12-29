import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  GraduationCap,
  MapPin,
  Calendar,
  TrendUp,
} from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'
import { SectionWrapper } from '@/components/composites/SectionWrapper'
import { useFilteredData } from '@/hooks/useFilteredData'
import type { Education } from '@/types/cv'
import { 
  formatDateRangeSafe, 
  parseDateSafe, 
  safeString, 
  safeArray,
  safeUrl,
} from '@/utils/dataValidation'
import { logger } from '@/lib/logger'

interface EducationCardProps {
  education: Education
  index: number
}

const MotionCard = motion.create(Card)

function EducationCard({ education, index }: EducationCardProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  const institution = safeString(education.institution, 'Unknown Institution')
  const studyType = safeString(education.studyType)
  const area = safeString(education.area)
  const location = safeString(education.location)
  const gpa = safeString(education.gpa)
  const logoUrl = education.logo_url ? safeUrl(education.logo_url) : null
  const typeKeys = safeArray<string>(education.type_key)

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1] as const
      }
    }
  }

  const CardComponent = prefersReducedMotion ? Card : MotionCard

  return (
    <CardComponent 
      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      {...(!prefersReducedMotion && {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
        variants: cardVariants
      })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-1 break-words">
              {institution}
            </CardTitle>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {(studyType || area) && (
                <div className="font-medium text-foreground">
                  {studyType && area && <span>{studyType} in {area}</span>}
                  {studyType && !area && <span>{studyType}</span>}
                  {!studyType && area && <span>{area}</span>}
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} weight="fill" className="shrink-0" />
                  <span>{location}</span>
                </div>
              )}
              
              {(education.startDate || education.endDate) && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} weight="fill" className="shrink-0" />
                  <span>{formatDateRangeSafe(education.startDate, education.endDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          {logoUrl && (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt={`${institution} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {gpa && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <TrendUp size={16} weight="bold" className="text-primary" />
            <span className="font-medium">GPA: {gpa}</span>
          </div>
        )}
        
        {typeKeys.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {typeKeys
              .filter(key => key !== 'Full CV')
              .map((key, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs"
                >
                  {key}
                </Badge>
              ))}
          </div>
        )}
      </CardContent>
    </CardComponent>
  )
}

export function EducationSection() {
  const cvData = useCV()
  const education = cvData.education ?? []
  const t = useTranslation()
  
  // DEBUG: Log what we receive
  logger.group('📋 [EducationSection] Render')
  logger.debug('cvData.education exists:', cvData.education !== undefined)
  logger.debug('cvData.education is array:', Array.isArray(cvData.education))
  logger.debug('education length:', education.length)
  if (education.length > 0) {
    logger.debug('First education item:', education[0])
    logger.debug('First education type_key:', education[0]?.type_key)
  }
  logger.groupEnd()
  
  const [selectedFilter, setSelectedFilter] = useState<string>(t.filters.all)
  
  // Sorting function for education entries (newest first)
  const sortByDateDesc = useCallback((a: Education, b: Education) => {
    const dateA = parseDateSafe(a.startDate)
    const dateB = parseDateSafe(b.startDate)
    
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    return dateB.getTime() - dateA.getTime()
  }, [])
  
  // Use the shared hook for global focus filtering and sorting
  const filteredByGlobalFocus = useFilteredData({
    data: education,
    getTypeKey: (item) => item.type_key,
    sortFn: sortByDateDesc,
  })
  
  // Collect all tags for secondary filter
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    filteredByGlobalFocus.forEach(edu => {
      if (edu.type_key) {
        edu.type_key
          .filter(key => key !== 'Full CV')
          .forEach(key => tagSet.add(key))
      }
    })
    return [t.filters.all, ...Array.from(tagSet).sort()]
  }, [filteredByGlobalFocus, t.filters.all])
  
  // Apply secondary filter (within-section tag filter)
  const filteredEducation = useMemo(() => {
    if (selectedFilter === t.filters.all) {
      return filteredByGlobalFocus
    }
    
    return filteredByGlobalFocus.filter(edu => 
      edu.type_key?.includes(selectedFilter)
    )
  }, [filteredByGlobalFocus, selectedFilter, t.filters.all])
  
  return (
    <SectionWrapper
      id="education"
      title={t.sections.education}
      icon={<GraduationCap size={32} weight="duotone" />}
      isEmpty={education.length === 0}
      emptyMessage={t.empty.no_education}
      subtitle="My academic journey and continuous learning path"
    >
      {/* Secondary filter (tag-based) */}
      {allTags.length > 1 && (
        <>
          <div className="mb-8 -mt-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t.actions.filter}:</span>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedFilter === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(tag)}
                    className="transition-all"
                  >
                    {tag}
                    {tag === t.filters.all && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                        {filteredByGlobalFocus.length}
                      </Badge>
                    )}
                    {tag !== t.filters.all && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                        {filteredByGlobalFocus.filter(edu => edu.type_key?.includes(tag)).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Separator className="mb-8" />
        </>
      )}
      
      {/* Education content */}
      {filteredEducation.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t.empty.no_results}
          </p>
          <Button 
            variant="link" 
            onClick={() => setSelectedFilter(t.filters.all)}
            className="mt-2"
          >
            {t.actions.clear}
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          
          <div className="space-y-8">
            {filteredEducation.map((edu, idx) => (
              <div key={idx} className="relative">
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                
                <div className="md:pl-20">
                  <EducationCard education={edu} index={idx} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
