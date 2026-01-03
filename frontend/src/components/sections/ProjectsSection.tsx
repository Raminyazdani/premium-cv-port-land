import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Folder,
  GithubLogo,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useStaggeredScrollAnimation } from '@/hooks/use-scroll-animation'
import { MediaModal } from '@/components/MediaModal'
import { useMediaModal } from '@/hooks/use-media-modal'
import { useTranslation } from '@/context/LanguageContext'
import { SectionWrapper } from '@/components/composites/SectionWrapper'
import type { Project } from '@/types/cv'
import { safeString, safeUrl, safeArray, isImageUrl } from '@/utils/dataValidation'
import { logger } from '@/lib/logger'

interface ProjectCardProps {
  project: Project
  onOpenMedia: (url: string, alt: string) => void
}

function ProjectCard({ project, onOpenMedia }: ProjectCardProps) {
  const t = useTranslation()
  const title = safeString(project.title || project.name, t.fallbacks.untitled_project)
  const description = safeString(project.description)
  const url = project.url ? safeUrl(project.url) : null
  const typeKeys = safeArray<string>(project.type_key)

  const uniqueDomains = useMemo(() => {
    const domains = new Set<string>()
    typeKeys.forEach(key => {
      const normalized = key.toLowerCase()
      if (normalized === 'programming') domains.add(t.domains.programming)
      else if (normalized === 'bioinformatics') domains.add(t.domains.bioinformatics)
      else if (normalized === 'biotechnology') domains.add(t.domains.biotechnology)
      else if (normalized === 'academic') domains.add(t.domains.academic)
      else if (normalized === 'student projects') domains.add(t.domains.student_projects)
      else if (normalized === 'robotics') domains.add(t.domains.robotics)
      else if (normalized === 'embedded systems') domains.add(t.domains.embedded_systems)
    })
    return Array.from(domains)
  }, [typeKeys, t.domains])

  const detectImageUrl = useMemo(() => {
    if (!description) return null
    const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/i
    const match = description.match(imageRegex)
    if (!match) return null
    
    const detectedUrl = safeUrl(match[0])
    return detectedUrl && isImageUrl(detectedUrl) ? detectedUrl : null
  }, [description])

  return (
    <Card className="card-interactive group hover:border-primary/50 transition-all duration-200 h-full flex flex-col overflow-hidden">
      {detectImageUrl && (
        <button
          onClick={() => onOpenMedia(detectImageUrl, title)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpenMedia(detectImageUrl, title)
            }
          }}
          className="relative w-full h-40 sm:h-48 overflow-hidden bg-muted cursor-pointer"
          aria-label={`View image for ${title}`}
          type="button"
        >
          <img
            src={detectImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Click to view</span>
          </div>
        </button>
      )}
      
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {uniqueDomains.map((domain, idx) => (
                <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex-1">
          {description && (
            <CardDescription className="text-xs sm:text-sm leading-relaxed line-clamp-4">
              {description}
            </CardDescription>
          )}
        </div>
        
        {url && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full group/btn h-10 sm:h-9 text-sm touch-manipulation"
              asChild
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View project: ${title}`}
              >
                <GithubLogo className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                {t.projects.view_code}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())
  const [hasLinkFilter, setHasLinkFilter] = useState<boolean | null>(null)
  const t = useTranslation()
  
  const { isOpen, currentUrl, currentAlt, openModal, closeModal } = useMediaModal()
  
  const data = useCV()
  const projects = data.projects ?? []
  
  // DEBUG: Log what we receive
  logger.group('📋 [ProjectsSection] Render')
  logger.debug('data.projects exists:', data.projects !== undefined)
  logger.debug('data.projects is array:', Array.isArray(data.projects))
  logger.debug('projects length:', projects.length)
  if (projects.length > 0) {
    logger.debug('First project:', projects[0])
    logger.debug('First project type_key:', projects[0]?.type_key)
  }
  logger.groupEnd()

  // Helper to map type_key values to translated domain labels
  const mapKeyToDomain = useCallback((key: string): string | null => {
    const normalized = key.toLowerCase()
    if (normalized === 'programming') return t.domains.programming
    if (normalized === 'bioinformatics') return t.domains.bioinformatics
    if (normalized === 'biotechnology') return t.domains.biotechnology
    if (normalized === 'academic') return t.domains.academic
    if (normalized === 'student projects') return t.domains.student_projects
    if (normalized === 'robotics') return t.domains.robotics
    if (normalized === 'embedded systems') return t.domains.embedded_systems
    return null
  }, [t.domains])

  const allDomains = useMemo(() => {
    const domains = new Set<string>()
    projects.forEach(project => {
      const typeKeys = project.type_key || []
      typeKeys.forEach(key => {
        const domain = mapKeyToDomain(key)
        if (domain) domains.add(domain)
      })
    })
    return Array.from(domains).sort()
  }, [projects, mapKeyToDomain])

  const uniqueProjects = useMemo(() => {
    const seen = new Map<string, Project>()
    projects.forEach(project => {
      const key = `${project.title || project.name}-${project.description}-${project.url || ''}`
      if (!seen.has(key)) {
        seen.set(key, project)
      }
    })
    return Array.from(seen.values())
  }, [projects])

  const filteredProjects = useMemo(() => {
    return uniqueProjects.filter(project => {
      const title = (project.title || project.name || '').toLowerCase()
      const description = (project.description || '').toLowerCase()
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || 
                           description.includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      if (selectedDomains.size > 0) {
        const projectDomains = new Set<string>()
        const typeKeys = project.type_key || []
        typeKeys.forEach(key => {
          const domain = mapKeyToDomain(key)
          if (domain) projectDomains.add(domain)
        })
        
        const hasSelectedDomain = Array.from(selectedDomains).some(domain => 
          projectDomains.has(domain)
        )
        if (!hasSelectedDomain) return false
      }

      if (hasLinkFilter !== null) {
        const projectHasLink = !!project.url
        if (projectHasLink !== hasLinkFilter) return false
      }

      return true
    })
  }, [uniqueProjects, searchQuery, selectedDomains, hasLinkFilter, mapKeyToDomain])

  const { containerRef, getItemStyle } = useStaggeredScrollAnimation(filteredProjects.length, {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
  })

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev => {
      const newSet = new Set(prev)
      if (newSet.has(domain)) {
        newSet.delete(domain)
      } else {
        newSet.add(domain)
      }
      return newSet
    })
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedDomains(new Set())
    setHasLinkFilter(null)
  }

  const hasActiveFilters = searchQuery !== '' || selectedDomains.size > 0 || hasLinkFilter !== null

  // Use SectionWrapper for standardized empty state handling
  if (projects.length === 0) {
    return (
      <SectionWrapper
        id="projects"
        title={t.sections.projects}
        icon={<Folder size={32} weight="duotone" />}
        isEmpty={true}
        emptyMessage={t.empty.no_projects}
        subtitle={t.sectionSubtitles.projects}
        className="bg-gradient-to-b from-background via-muted/20 to-background"
      >
        {/* Children required by SectionWrapper but not rendered when isEmpty */}
        <div />
      </SectionWrapper>
    )
  }

  return (
    <section id="projects" className="w-full min-h-screen bg-gradient-to-b from-background via-muted/20 to-background px-3 sm:px-4 py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
              <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              {t.sections.projects}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t.sectionSubtitles.projects}
            </p>
          </div>
          <Separator />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="project-search"
              placeholder={t.actions.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-base"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">{t.actions.filter}:</span>
            {allDomains.map(domain => (
              <Badge
                key={domain}
                variant={selectedDomains.has(domain) ? 'default' : 'outline'}
                className="cursor-pointer hover:border-primary transition-colors text-xs sm:text-sm py-1 px-2 touch-manipulation"
                onClick={() => toggleDomain(domain)}
              >
                {domain}
              </Badge>
            ))}
            
            <Separator orientation="vertical" className="h-5 sm:h-6 hidden xs:block" />
            
            <Badge
              variant={hasLinkFilter === true ? 'default' : 'outline'}
              className="cursor-pointer hover:border-primary transition-colors text-xs sm:text-sm py-1 px-2 touch-manipulation"
              onClick={() => setHasLinkFilter(curr => curr === true ? null : true)}
            >
              {t.actions.has_link}
            </Badge>
            
            {hasActiveFilters && (
              <>
                <Separator orientation="vertical" className="h-5 sm:h-6 hidden xs:block" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 sm:h-7 text-xs px-2 sm:px-3 touch-manipulation"
                >
                  <X className="h-3 w-3 mr-1" />
                  {t.actions.clear}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.counts.showing_x_of_y_projects
                .replace('{current}', String(filteredProjects.length))
                .replace('{total}', String(uniqueProjects.length))}
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-6 sm:p-8">
              <div className="text-center space-y-2">
                <Folder className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t.empty.no_results}
                </p>
                <Button variant="link" size="sm" onClick={clearAllFilters} className="touch-manipulation">
                  {t.actions.clear}
                </Button>
              </div>
            </Card>
          ) : (
            <div 
              ref={containerRef as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {filteredProjects.map((project, idx) => (
                <div key={idx} style={getItemStyle(idx)}>
                  <ProjectCard project={project} onOpenMedia={openModal} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <MediaModal
        url={currentUrl}
        alt={currentAlt}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </section>
  )
}
