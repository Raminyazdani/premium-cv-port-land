import { useState, useMemo } from 'react'
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
import { getCVData } from '@/lib/cv-data'
import type { Education } from '@/types/cv'

function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate) return ''
  
  const formatDate = (dateStr: string) => {
    if (dateStr.toLowerCase() === 'present') return 'Present'
    
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    } catch {
      return dateStr
    }
  }
  
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  
  return `${start} – ${end}`
}

function parseDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  if (dateStr.toLowerCase() === 'present') return new Date()
  
  try {
    return new Date(dateStr)
  } catch {
    return null
  }
}

interface EducationCardProps {
  education: Education
}

function EducationCard({ education }: EducationCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-1 break-words">
              {education.institution ?? 'Unknown Institution'}
            </CardTitle>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">
                {education.studyType && education.area && (
                  <span>{education.studyType} in {education.area}</span>
                )}
                {education.studyType && !education.area && (
                  <span>{education.studyType}</span>
                )}
                {!education.studyType && education.area && (
                  <span>{education.area}</span>
                )}
              </div>
              
              {education.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} weight="fill" className="shrink-0" />
                  <span>{education.location}</span>
                </div>
              )}
              
              {(education.startDate || education.endDate) && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} weight="fill" className="shrink-0" />
                  <span>{formatDateRange(education.startDate, education.endDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          {education.logo_url && (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={education.logo_url} 
                alt={`${education.institution} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {education.gpa && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <TrendUp size={16} weight="bold" className="text-primary" />
            <span className="font-medium">GPA: {education.gpa}</span>
          </div>
        )}
        
        {education.type_key && education.type_key.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {education.type_key
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
    </Card>
  )
}

export function EducationSection() {
  const cvData = getCVData()
  const education = cvData.education ?? []
  
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    education.forEach(edu => {
      if (edu.type_key) {
        edu.type_key
          .filter(key => key !== 'Full CV')
          .forEach(key => tagSet.add(key))
      }
    })
    return ['All', ...Array.from(tagSet).sort()]
  }, [education])
  
  const filteredEducation = useMemo(() => {
    if (selectedFilter === 'All') {
      return education
    }
    
    return education.filter(edu => 
      edu.type_key?.includes(selectedFilter)
    )
  }, [education, selectedFilter])
  
  const sortedEducation = useMemo(() => {
    return [...filteredEducation].sort((a, b) => {
      const dateA = parseDate(a.startDate)
      const dateB = parseDate(b.startDate)
      
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      
      return dateB.getTime() - dateA.getTime()
    })
  }, [filteredEducation])
  
  if (education.length === 0) {
    return (
      <section id="education" className="py-16 bg-background" aria-labelledby="education-heading">
        <div className="container max-w-6xl px-4">
          <div className="text-center">
            <GraduationCap size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
            <h2 id="education-heading" className="text-3xl font-bold mb-2">
              Education
            </h2>
            <p className="text-muted-foreground">No education history available</p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section id="education" className="py-16 bg-background" aria-labelledby="education-heading">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap size={32} weight="duotone" className="text-primary" />
          </div>
          <h2 id="education-heading" className="text-4xl font-bold mb-3">
            Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My academic journey and continuous learning path
          </p>
        </div>
        
        {allTags.length > 1 && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
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
                      {tag === 'All' && (
                        <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                          {education.length}
                        </Badge>
                      )}
                      {tag !== 'All' && (
                        <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                          {education.filter(edu => edu.type_key?.includes(tag)).length}
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
        
        {sortedEducation.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No education entries match the selected filter
            </p>
            <Button 
              variant="link" 
              onClick={() => setSelectedFilter('All')}
              className="mt-2"
            >
              Clear filter
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            
            <div className="space-y-8">
              {sortedEducation.map((edu, idx) => (
                <div key={idx} className="relative">
                  <div className="hidden md:block absolute left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  
                  <div className="md:pl-20">
                    <EducationCard education={edu} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
