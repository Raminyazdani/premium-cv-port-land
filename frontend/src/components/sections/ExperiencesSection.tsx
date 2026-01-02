import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Briefcase,
  Calendar,
  Buildings,
  MapPin,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'
import { useFilter, shouldShowEntry } from '@/context/FilterContext'
import type { Experience } from '@/types/cv'

function parseDuration(durationStr?: string | null, presentLabel: string = 'Present'): { startDate: Date | null; endDate: Date | null; displayDuration: string } {
  if (!durationStr) return { startDate: null, endDate: null, displayDuration: '' }

  const parts = durationStr.split('-').map(p => p.trim())
  
  if (parts.length !== 2) {
    return { startDate: null, endDate: null, displayDuration: durationStr }
  }

  const parseDate = (dateStr: string): Date | null => {
    if (dateStr.toLowerCase() === 'recent' || dateStr.toLowerCase() === 'present') {
      return new Date()
    }
    
    try {
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }

  const formatDate = (dateStr: string): string => {
    if (dateStr.toLowerCase() === 'recent' || dateStr.toLowerCase() === 'present') {
      return presentLabel
    }
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    } catch {
      return dateStr
    }
  }

  const startPart = parts[0] ?? ''
  const endPart = parts[1] ?? ''
  
  const startDate = parseDate(startPart)
  const endDate = parseDate(endPart)
  const displayDuration = `${formatDate(startPart)} – ${formatDate(endPart)}`

  return { startDate, endDate, displayDuration }
}

function inferCategory(institution?: string | null, role?: string | null): 'Academic' | 'Industry' {
  if (!institution && !role) return 'Industry'
  
  const combined = `${institution ?? ''} ${role ?? ''}`.toLowerCase()
  
  const academicKeywords = ['university', 'research', 'thesis', 'academic', 'laboratory', 'bioinformatics researcher']
  const isAcademic = academicKeywords.some(keyword => combined.includes(keyword))
  
  return isAcademic ? 'Academic' : 'Industry'
}

interface ProcessedExperience extends Omit<Experience, 'startDate' | 'endDate'> {
  startDate: Date | null
  endDate: Date | null
  category: 'Academic' | 'Industry'
}

interface ExperienceCardProps {
  experience: ProcessedExperience
  presentLabel: string
  t: ReturnType<typeof useTranslation>
}

function ExperienceCard({ experience, presentLabel, t }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { displayDuration } = parseDuration(experience.duration, presentLabel)
  const category = experience.category
  const categoryLabel = category === 'Academic' ? t.domains.academic : t.domains.industry

  const hasExpandableContent = experience.description && experience.description.length > 150

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${category === 'Academic' ? 'bg-primary' : 'bg-accent'}`} />
      
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg md:text-xl font-semibold leading-tight">
              {experience.role || t.fallbacks.untitled_role}
            </CardTitle>
            {experience.institution && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Buildings className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm md:text-base">{experience.institution}</span>
              </div>
            )}
            {experience.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{experience.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{displayDuration}</span>
            </div>
            <Badge variant="secondary" className="w-fit">
              {categoryLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {experience.primaryFocus && (
          <ul className="space-y-2">
            <li className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>{t.experience.focus}:</strong> {experience.primaryFocus}</span>
            </li>
          </ul>
        )}
        
        {experience.description && (
          <ul className="space-y-2">
            <li className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-primary font-bold mt-1">•</span>
              <span>
                {hasExpandableContent && !isExpanded ? (
                  <>
                    {experience.description.substring(0, 150)}...
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-1 p-0 h-auto font-semibold"
                      onClick={() => setIsExpanded(true)}
                    >
                      {t.actions.show_more} <CaretDown className="ml-1 h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    {experience.description}
                    {hasExpandableContent && (
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-1 p-0 h-auto font-semibold"
                        onClick={() => setIsExpanded(false)}
                      >
                        {t.actions.show_less} <CaretUp className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </>
                )}
              </span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ExperiencesSection() {
  const [groupBy, setGroupBy] = useState<'none' | 'category'>('category')
  const { selectedFocus } = useFilter()
  
  const data = useCV()
  const t = useTranslation()
  const experiences = data.experiences ?? []
  const presentLabel = t.experience.present

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => 
      shouldShowEntry(exp.type_key, selectedFocus)
    )
  }, [experiences, selectedFocus])

  const processedExperiences = useMemo(() => {
    return filteredExperiences.map(exp => {
      const { startDate, endDate } = parseDuration(exp.duration)
      const category = inferCategory(exp.institution, exp.role)
      
      return {
        ...exp,
        startDate,
        endDate,
        category,
      }
    })
  }, [filteredExperiences])

  const sortedExperiences = useMemo(() => {
    return [...processedExperiences].sort((a, b) => {
      const aDate = a.endDate ?? a.startDate ?? new Date(0)
      const bDate = b.endDate ?? b.startDate ?? new Date(0)
      return bDate.getTime() - aDate.getTime()
    })
  }, [processedExperiences])

  const grouped = useMemo((): Record<string, typeof sortedExperiences> => {
    if (groupBy === 'none') {
      return { All: sortedExperiences }
    }
    
    const academic = sortedExperiences.filter(exp => exp.category === 'Academic')
    const industry = sortedExperiences.filter(exp => exp.category === 'Industry')
    
    const result: Record<string, typeof sortedExperiences> = {}
    if (academic.length > 0) result[t.domains.academic] = academic
    if (industry.length > 0) result[t.domains.industry] = industry
    
    return result
  }, [sortedExperiences, groupBy, t.domains.academic, t.domains.industry])

  if (experiences.length === 0) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-muted/20 px-4 py-16">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t.empty.no_experience}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.empty.no_experiences_added}
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (filteredExperiences.length === 0) {
    return (
      <section id="experience" className="w-full min-h-screen bg-gradient-to-b from-muted/30 to-background px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-primary" />
                {t.sections.experiences}
              </h2>
              <p className="text-muted-foreground">
                {t.sectionSubtitles.experiences}
              </p>
            </div>
            <Separator />
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                {t.empty.no_experiences_filter}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="w-full min-h-screen bg-gradient-to-b from-muted/30 to-background px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-primary" />
                {t.sections.experiences}
              </h2>
              <p className="text-muted-foreground">
                {t.sectionSubtitles.experiences}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={groupBy === 'none' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('none')}
              >
                {t.actions.timeline}
              </Button>
              <Button
                variant={groupBy === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('category')}
              >
                {t.actions.by_category}
              </Button>
            </div>
          </div>
          <Separator />
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([groupName, exps]) => (
            <div key={groupName} className="space-y-4">
              {groupBy === 'category' && (
                <h3 className="text-xl font-semibold text-foreground/90">
                  {groupName}
                </h3>
              )}
              
              <div className="space-y-4 relative">
                {groupBy === 'none' && (
                  <div className="absolute left-[calc(0.5rem-1px)] top-0 bottom-0 w-px bg-border hidden md:block" />
                )}
                
                {exps.map((exp, idx) => (
                  <div key={idx} className="relative">
                    {groupBy === 'none' && (
                      <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />
                    )}
                    <div className={groupBy === 'none' ? 'md:ml-10' : ''}>
                      <ExperienceCard experience={exp} presentLabel={presentLabel} t={t} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
