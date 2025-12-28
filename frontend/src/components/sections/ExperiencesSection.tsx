import { useState, useMemo, useEffect } from 'react'
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
import { useTranslation, useFormatters } from '@/context/LanguageContext'
import { isVisibleWithFilter, type FocusFilter, getStoredFocusFilter } from '@/lib/focusFilterManager'
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

  const startDate = parseDate(parts[0])
  const endDate = parseDate(parts[1])
  const displayDuration = `${formatDate(parts[0])} – ${formatDate(parts[1])}`

  return { startDate, endDate, displayDuration }
}

function inferCategory(institution?: string | null, role?: string | null): 'Academic' | 'Industry' {
  if (!institution && !role) return 'Industry'
  
  const combined = `${institution ?? ''} ${role ?? ''}`.toLowerCase()
  
  const academicKeywords = ['university', 'research', 'thesis', 'academic', 'laboratory', 'bioinformatics researcher']
  const isAcademic = academicKeywords.some(keyword => combined.includes(keyword))
  
  return isAcademic ? 'Academic' : 'Industry'
}

interface ExperienceCardProps {
  experience: Experience
  presentLabel: string
}

function ExperienceCard({ experience, presentLabel }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { displayDuration } = parseDuration(experience.duration, presentLabel)
  const category = inferCategory(experience.institution, experience.role)

  const hasExpandableContent = experience.description && experience.description.length > 150

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${category === 'Academic' ? 'bg-primary' : 'bg-accent'}`} />
      
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg md:text-xl font-semibold leading-tight">
              {experience.role || 'Untitled Role'}
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
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {experience.primaryFocus && (
          <ul className="space-y-2">
            <li className="text-sm leading-relaxed flex items-start gap-2">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>Focus:</strong> {experience.primaryFocus}</span>
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
                      Show more <CaretDown className="ml-1 h-3 w-3" />
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
                        Show less <CaretUp className="ml-1 h-3 w-3" />
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
  const [currentFilter, setCurrentFilter] = useState<FocusFilter>('Full CV')
  
  const data = useCV()
  const t = useTranslation()
  const experiences = data.experiences ?? []
  const presentLabel = t.experience.present

  useEffect(() => {
    const filter = getStoredFocusFilter()
    setCurrentFilter(filter)

    const handleFilterChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ filter: FocusFilter }>
      setCurrentFilter(customEvent.detail.filter)
    }

    window.addEventListener('focusFilterChange', handleFilterChange)
    return () => window.removeEventListener('focusFilterChange', handleFilterChange)
  }, [])

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => 
      isVisibleWithFilter(exp.type_key, currentFilter)
    )
  }, [experiences, currentFilter])

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

  const grouped = useMemo(() => {
    if (groupBy === 'none') {
      return { All: sortedExperiences }
    }
    
    const academic = sortedExperiences.filter(exp => exp.category === 'Academic')
    const industry = sortedExperiences.filter(exp => exp.category === 'Industry')
    
    return {
      ...(academic.length > 0 && { Academic: academic }),
      ...(industry.length > 0 && { Industry: industry }),
    }
  }, [sortedExperiences, groupBy])

  if (experiences.length === 0) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-muted/20 px-4 py-16">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              No Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No professional experiences have been added yet.
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
                Professional Experience
              </h2>
              <p className="text-muted-foreground">
                A timeline of roles, research, and contributions
              </p>
            </div>
            <Separator />
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                No experiences match the current focus filter. Try selecting "Full CV" to see all experiences.
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
                Professional Experience
              </h2>
              <p className="text-muted-foreground">
                A timeline of roles, research, and contributions
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={groupBy === 'none' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('none')}
              >
                Timeline
              </Button>
              <Button
                variant={groupBy === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('category')}
              >
                By Category
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
                      <ExperienceCard experience={exp} presentLabel={presentLabel} />
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
