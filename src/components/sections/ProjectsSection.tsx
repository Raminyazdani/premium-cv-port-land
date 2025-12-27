import { useState, useMemo } from 'react'
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
import { getCVData } from '@/lib/cv-data'
import { useStaggeredScrollAnimation } from '@/hooks/use-scroll-animation'
import type { Project } from '@/types/cv'
import { safeString, safeUrl, safeArray, isImageUrl } from '@/utils/dataValidation'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  const title = safeString(project.title || project.name, 'Untitled Project')
  const description = safeString(project.description)
  const url = project.url ? safeUrl(project.url) : null
  const typeKeys = safeArray<string>(project.type_key)

  const uniqueDomains = useMemo(() => {
    const domains = new Set<string>()
    typeKeys.forEach(key => {
      const normalized = key.toLowerCase()
      if (normalized === 'programming') domains.add('Programming')
      else if (normalized === 'bioinformatics') domains.add('Bioinformatics')
      else if (normalized === 'biotechnology') domains.add('Biotechnology')
      else if (normalized === 'academic') domains.add('Academic')
      else if (normalized === 'student projects') domains.add('Student Projects')
      else if (normalized === 'robotics') domains.add('Robotics')
      else if (normalized === 'embedded systems') domains.add('Embedded Systems')
    })
    return Array.from(domains)
  }, [typeKeys])

  const detectImageUrl = useMemo(() => {
    if (!description) return null
    const imageRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/i
    const match = description.match(imageRegex)
    if (!match) return null
    
    const detectedUrl = safeUrl(match[0])
    return detectedUrl && isImageUrl(detectedUrl) ? detectedUrl : null
  }, [description])

  return (
    <Card className="group hover:border-primary/50 transition-all duration-200 h-full flex flex-col overflow-hidden">
      {detectImageUrl && (
        <div className="w-full h-48 overflow-hidden bg-muted">
          <img
            src={detectImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {uniqueDomains.map((domain, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          {description && (
            <CardDescription className="text-sm leading-relaxed line-clamp-4">
              {description}
            </CardDescription>
          )}
        </div>
        
        {url && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full group/btn"
              asChild
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View project: ${title}`}
              >
                <GithubLogo className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                View Repository
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
  
  const data = getCVData()
  const projects = data.projects ?? []

  const allDomains = useMemo(() => {
    const domains = new Set<string>()
    projects.forEach(project => {
      const typeKeys = project.type_key || []
      typeKeys.forEach(key => {
        if (key.toLowerCase() === 'programming') domains.add('Programming')
        else if (key.toLowerCase() === 'bioinformatics') domains.add('Bioinformatics')
        else if (key.toLowerCase() === 'biotechnology') domains.add('Biotechnology')
        else if (key.toLowerCase() === 'academic') domains.add('Academic')
        else if (key.toLowerCase() === 'student projects') domains.add('Student Projects')
        else if (key.toLowerCase() === 'robotics') domains.add('Robotics')
        else if (key.toLowerCase() === 'embedded systems') domains.add('Embedded Systems')
      })
    })
    return Array.from(domains).sort()
  }, [projects])

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
          if (key.toLowerCase() === 'programming') projectDomains.add('Programming')
          else if (key.toLowerCase() === 'bioinformatics') projectDomains.add('Bioinformatics')
          else if (key.toLowerCase() === 'biotechnology') projectDomains.add('Biotechnology')
          else if (key.toLowerCase() === 'academic') projectDomains.add('Academic')
          else if (key.toLowerCase() === 'student projects') projectDomains.add('Student Projects')
          else if (key.toLowerCase() === 'robotics') projectDomains.add('Robotics')
          else if (key.toLowerCase() === 'embedded systems') projectDomains.add('Embedded Systems')
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
  }, [uniqueProjects, searchQuery, selectedDomains, hasLinkFilter])

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

  if (projects.length === 0) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center bg-muted/20 px-4 py-16">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              No Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No projects have been added yet.
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section id="projects" className="w-full min-h-screen bg-gradient-to-b from-background via-muted/20 to-background px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary" />
              Projects & Portfolio
            </h2>
            <p className="text-muted-foreground">
              A collection of programming, bioinformatics, and research projects
            </p>
          </div>
          <Separator />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="project-search"
              placeholder="Search projects by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
            {allDomains.map(domain => (
              <Badge
                key={domain}
                variant={selectedDomains.has(domain) ? 'default' : 'outline'}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => toggleDomain(domain)}
              >
                {domain}
              </Badge>
            ))}
            
            <Separator orientation="vertical" className="h-6" />
            
            <Badge
              variant={hasLinkFilter === true ? 'default' : 'outline'}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setHasLinkFilter(curr => curr === true ? null : true)}
            >
              Has Link
            </Badge>
            
            {hasActiveFilters && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {uniqueProjects.length} projects
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-8">
              <div className="text-center space-y-2">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  No projects match your current filters
                </p>
                <Button variant="link" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            </Card>
          ) : (
            <div 
              ref={containerRef as React.RefObject<HTMLDivElement>}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredProjects.map((project, idx) => (
                <div key={idx} style={getItemStyle(idx)}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
