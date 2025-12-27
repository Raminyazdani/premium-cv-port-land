import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  MagnifyingGlass,
  X,
  Link as LinkIcon,
  Users,
  CalendarBlank,
  FileText,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import { getStoredFocusFilter, type FocusFilter, isVisibleWithFilter } from '@/lib/focusFilterManager'
import { useStaggeredScrollAnimation } from '@/hooks/use-scroll-animation'
import type { Publication } from '@/types/cv'

interface PublicationCardProps {
  publication: Publication
}

function PublicationCard({ publication }: PublicationCardProps) {
  const displayTitle = publication.title || 'Untitled Publication'
  const hasLink = !!(publication.url || publication.URL || publication.identifiers?.doi)
  const externalLink = publication.url || publication.URL || (publication.identifiers?.doi ? `https://doi.org/${publication.identifiers.doi}` : null)

  const authorsDisplay = useMemo(() => {
    if (!publication.authors || publication.authors.length === 0) return null
    return publication.authors.join(', ')
  }, [publication.authors])

  const dateDisplay = useMemo(() => {
    if (publication.date) return publication.date
    if (publication.year) {
      const parts = [String(publication.year)]
      if (publication.month) parts.push(String(publication.month).padStart(2, '0'))
      if (publication.day) parts.push(String(publication.day).padStart(2, '0'))
      return parts.join('-')
    }
    return null
  }, [publication.date, publication.year, publication.month, publication.day])

  const venueDisplay = useMemo(() => {
    if (publication.journal) return publication.journal
    if (publication.publisher) return publication.publisher
    if (publication.institution) return publication.institution
    return null
  }, [publication.journal, publication.publisher, publication.institution])

  const typeVariant = useMemo(() => {
    const type = publication.type?.toLowerCase() || ''
    if (type.includes('thesis')) return 'default'
    if (type.includes('chapter')) return 'secondary'
    if (type.includes('review')) return 'outline'
    return 'default'
  }, [publication.type])

  const statusColor = useMemo(() => {
    const status = publication.status?.toLowerCase() || ''
    if (status === 'published') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (status === 'submitted') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    if (status.includes('waiting')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    return 'bg-muted text-muted-foreground'
  }, [publication.status])

  return (
    <Card className="group hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors mb-2">
              {displayTitle}
            </CardTitle>
            
            <div className="flex flex-wrap gap-1.5 mb-2">
              {publication.type && (
                <Badge variant={typeVariant as any} className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {publication.type}
                </Badge>
              )}
              {publication.status && (
                <Badge className={`text-xs ${statusColor}`}>
                  {publication.status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {authorsDisplay && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{authorsDisplay}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          {venueDisplay && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{venueDisplay}</span>
            </div>
          )}
          
          {dateDisplay && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarBlank className="h-4 w-4 flex-shrink-0" />
              <span>{dateDisplay}</span>
            </div>
          )}
          
          {publication.correspondent && (
            <div className="text-xs text-muted-foreground">
              Correspondent: {publication.correspondent}
            </div>
          )}
          
          {publication.supervisors && publication.supervisors.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Supervisors: {publication.supervisors.join(', ')}
            </div>
          )}
          
          {publication.identifiers?.isbn && (
            <div className="text-xs text-muted-foreground">
              ISBN: {publication.identifiers.isbn}
            </div>
          )}
        </div>
        
        {hasLink && externalLink && (
          <div className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full group/btn"
              asChild
            >
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View publication: ${displayTitle}`}
              >
                <LinkIcon className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                View Publication
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PublicationsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [currentFocusFilter, setCurrentFocusFilter] = useState<FocusFilter>(getStoredFocusFilter())
  
  const data = getCVData()
  const publications = data.publications || []

  useEffect(() => {
    const handleFocusFilterChange = (event: CustomEvent<{ filter: FocusFilter }>) => {
      setCurrentFocusFilter(event.detail.filter)
    }
    
    window.addEventListener('focusFilterChange', handleFocusFilterChange as EventListener)
    
    return () => {
      window.removeEventListener('focusFilterChange', handleFocusFilterChange as EventListener)
    }
  }, [])

  const filteredPublications = useMemo(() => {
    let filtered = publications

    filtered = filtered.filter(pub => {
      const typeKeys = Array.isArray(pub.type_key) 
        ? pub.type_key.map(k => typeof k === 'string' ? k : k.name || '')
        : []
      
      return isVisibleWithFilter(typeKeys, currentFocusFilter)
    })

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(pub => {
        const status = pub.status?.toLowerCase() || ''
        const type = pub.type?.toLowerCase() || ''
        
        if (selectedFilter === 'published') return status === 'published'
        if (selectedFilter === 'submitted') return status === 'submitted'
        if (selectedFilter === 'waiting') return status.includes('waiting')
        if (selectedFilter === 'thesis') return type.includes('thesis')
        if (selectedFilter === 'chapter') return type.includes('chapter')
        if (selectedFilter === 'review') return type.includes('review')
        if (selectedFilter === 'paper') return type.includes('paper') || type.includes('research')
        
        return true
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(pub => {
        const searchableText = [
          pub.title,
          ...(pub.authors || []),
          pub.type,
          pub.status,
          pub.journal,
          pub.publisher,
          pub.institution,
        ].filter(Boolean).join(' ').toLowerCase()
        
        return searchableText.includes(query)
      })
    }

    return filtered
  }, [publications, selectedFilter, searchQuery, currentFocusFilter])

  const publicationCounts = useMemo(() => {
    const focusFilteredPublications = publications.filter(pub => {
      const typeKeys = Array.isArray(pub.type_key) 
        ? pub.type_key.map(k => typeof k === 'string' ? k : k.name || '')
        : []
      
      return isVisibleWithFilter(typeKeys, currentFocusFilter)
    })

    const counts = {
      all: focusFilteredPublications.length,
      published: 0,
      submitted: 0,
      waiting: 0,
      thesis: 0,
      chapter: 0,
      review: 0,
      paper: 0,
    }

    focusFilteredPublications.forEach(pub => {
      const status = pub.status?.toLowerCase() || ''
      const type = pub.type?.toLowerCase() || ''
      
      if (status === 'published') counts.published++
      if (status === 'submitted') counts.submitted++
      if (status.includes('waiting')) counts.waiting++
      if (type.includes('thesis')) counts.thesis++
      if (type.includes('chapter')) counts.chapter++
      if (type.includes('review')) counts.review++
      if (type.includes('paper') || type.includes('research')) counts.paper++
    })

    return counts
  }, [publications, currentFocusFilter])

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  if (publications.length === 0) {
    return (
      <section id="publications" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Publications</h2>
          <p className="text-muted-foreground">No publications available.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="publications" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Publications</h2>
        </div>
        <p className="text-muted-foreground">
          Research papers, theses, book chapters, and academic publications
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search publications by title, author, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
              aria-label="Search publications"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All ({publicationCounts.all})
            </TabsTrigger>
            <TabsTrigger value="published" className="text-xs sm:text-sm">
              Published ({publicationCounts.published})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="text-xs sm:text-sm">
              Submitted ({publicationCounts.submitted})
            </TabsTrigger>
            <TabsTrigger value="waiting" className="text-xs sm:text-sm">
              Waiting ({publicationCounts.waiting})
            </TabsTrigger>
            <TabsTrigger value="paper" className="text-xs sm:text-sm">
              Papers ({publicationCounts.paper})
            </TabsTrigger>
            <TabsTrigger value="thesis" className="text-xs sm:text-sm">
              Thesis ({publicationCounts.thesis})
            </TabsTrigger>
            <TabsTrigger value="chapter" className="text-xs sm:text-sm">
              Chapters ({publicationCounts.chapter})
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs sm:text-sm">
              Reviews ({publicationCounts.review})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedFilter} className="mt-6">
            {filteredPublications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No publications match your current filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPublications.map((pub, index) => (
                  <PublicationCard key={index} publication={pub} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filteredPublications.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            Showing {filteredPublications.length} of {publicationCounts.all} publication{publicationCounts.all !== 1 ? 's' : ''}
            {currentFocusFilter !== 'Full CV' && (
              <span className="ml-1">
                (filtered by <span className="font-medium">{currentFocusFilter}</span>)
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
