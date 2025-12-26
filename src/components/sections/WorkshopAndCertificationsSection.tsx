import React, { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Certificate as CertificateIcon,
  MagnifyingGlass,
  CalendarBlank,
  Clock,
  Link as LinkIcon,
  Seal,
  X,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { WorkshopIssuer, Certification } from '@/types/cv'

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function parseDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  
  try {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

interface CertificationItemProps {
  certification: Certification
}

function CertificationItem({ certification }: CertificationItemProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="shrink-0 mt-0.5">
                {certification.certificate ? (
                  <Seal size={20} weight="fill" className="text-accent" aria-label="Certified" />
                ) : (
                  <CertificateIcon size={20} weight="duotone" className="text-muted-foreground" aria-label="Workshop" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1 break-words leading-snug">
                  {certification.name ?? 'Unnamed Certification'}
                </h4>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                  {certification.date && (
                    <div className="flex items-center gap-1.5">
                      <CalendarBlank size={14} weight="fill" className="shrink-0" />
                      <span>{formatDate(certification.date)}</span>
                    </div>
                  )}
                  
                  {certification.duration && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} weight="fill" className="shrink-0" />
                      <span>{certification.duration}</span>
                    </div>
                  )}
                </div>
                
                {certification.type_key && certification.type_key.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {certification.type_key
                      .filter(key => key !== 'Full CV')
                      .map((key, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-xs px-2 py-0"
                        >
                          {key}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {certification.URL && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="shrink-0"
            >
              <a
                href={certification.URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View certificate for ${certification.name}`}
              >
                <LinkIcon size={16} weight="bold" />
                <span className="ml-1.5 hidden sm:inline">Certificate</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface IssuerAccordionProps {
  issuer: WorkshopIssuer
  searchQuery: string
  selectedFilters: Set<string>
  showCertifiedOnly: boolean
}

function IssuerAccordion({ issuer, searchQuery, selectedFilters, showCertifiedOnly }: IssuerAccordionProps) {
  const filteredCertifications = useMemo(() => {
    const certs = issuer.certifications ?? []
    
    return certs.filter(cert => {
      if (showCertifiedOnly && !cert.certificate) return false
      
      if (selectedFilters.size > 0) {
        const certTags = cert.type_key ?? []
        const hasMatchingTag = certTags.some(tag => selectedFilters.has(tag))
        if (!hasMatchingTag) return false
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const nameMatch = cert.name?.toLowerCase().includes(query)
        const issuerMatch = issuer.issuer?.toLowerCase().includes(query)
        return nameMatch || issuerMatch
      }
      
      return true
    })
  }, [issuer, searchQuery, selectedFilters, showCertifiedOnly])
  
  const sortedCertifications = useMemo(() => {
    return [...filteredCertifications].sort((a, b) => {
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)
      
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      
      return dateB.getTime() - dateA.getTime()
    })
  }, [filteredCertifications])
  
  if (sortedCertifications.length === 0) return null
  
  return (
    <AccordionItem value={issuer.issuer ?? 'unknown'} className="border rounded-lg px-1">
      <AccordionTrigger className="hover:no-underline px-4 py-4">
        <div className="flex items-center justify-between w-full pr-4">
          <h3 className="text-lg font-semibold text-left">
            {issuer.issuer ?? 'Unknown Issuer'}
          </h3>
          <Badge variant="secondary" className="ml-2">
            {sortedCertifications.length}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 pt-2">
          {sortedCertifications.map((cert, idx) => (
            <CertificationItem key={idx} certification={cert} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function WorkshopAndCertificationsSection() {
  const cvData = getCVData()
  const workshopsData = cvData.workshop_and_certifications ?? []
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false)
  
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    workshopsData.forEach(issuer => {
      issuer.certifications?.forEach(cert => {
        cert.type_key?.filter(key => key !== 'Full CV').forEach(key => tagSet.add(key))
      })
    })
    return Array.from(tagSet).sort()
  }, [workshopsData])
  
  const toggleFilter = (tag: string) => {
    setSelectedFilters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tag)) {
        newSet.delete(tag)
      } else {
        newSet.add(tag)
      }
      return newSet
    })
  }
  
  const clearAllFilters = () => {
    setSelectedFilters(new Set())
    setSearchQuery('')
    setShowCertifiedOnly(false)
  }
  
  const visibleIssuers = useMemo(() => {
    return workshopsData.filter(issuer => {
      const certs = issuer.certifications ?? []
      
      return certs.some(cert => {
        if (showCertifiedOnly && !cert.certificate) return false
        
        if (selectedFilters.size > 0) {
          const certTags = cert.type_key ?? []
          const hasMatchingTag = certTags.some(tag => selectedFilters.has(tag))
          if (!hasMatchingTag) return false
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const nameMatch = cert.name?.toLowerCase().includes(query)
          const issuerMatch = issuer.issuer?.toLowerCase().includes(query)
          return nameMatch || issuerMatch
        }
        
        return true
      })
    })
  }, [workshopsData, searchQuery, selectedFilters, showCertifiedOnly])
  
  const totalCertifications = useMemo(() => {
    return workshopsData.reduce((sum, issuer) => 
      sum + (issuer.certifications?.length ?? 0), 0
    )
  }, [workshopsData])
  
  const hasActiveFilters = searchQuery.trim() !== '' || selectedFilters.size > 0 || showCertifiedOnly
  
  if (workshopsData.length === 0) {
    return (
      <section className="py-16 bg-muted/30" aria-labelledby="workshops-heading">
        <div className="container max-w-6xl px-4">
          <div className="text-center">
            <CertificateIcon size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
            <h2 id="workshops-heading" className="text-3xl font-bold mb-2">
              Workshops & Certifications
            </h2>
            <p className="text-muted-foreground">No certifications available</p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-16 bg-muted/30" aria-labelledby="workshops-heading">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <CertificateIcon size={32} weight="duotone" className="text-accent" />
          </div>
          <h2 id="workshops-heading" className="text-4xl font-bold mb-3">
            Workshops & Certifications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional development and continuous learning achievements
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {totalCertifications} certification{totalCertifications !== 1 ? 's' : ''} from {workshopsData.length} issuer{workshopsData.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlass 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
                />
                <Input
                  type="search"
                  placeholder="Search certifications or issuers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Search certifications"
                />
              </div>
              
              {allTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Filter by domain:</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedFilters.has(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleFilter(tag)}
                        className="transition-all"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="certified-only"
                    checked={showCertifiedOnly}
                    onCheckedChange={setShowCertifiedOnly}
                  />
                  <Label 
                    htmlFor="certified-only" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Show only with certificates
                  </Label>
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground"
                  >
                    <X size={16} className="mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {visibleIssuers.length === 0 ? (
          <div className="text-center py-12">
            <CertificateIcon size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No certifications match your filters
            </p>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <Accordion 
            type="multiple" 
            className="space-y-3"
            defaultValue={visibleIssuers.length <= 3 ? visibleIssuers.map(i => i.issuer ?? 'unknown') : []}
          >
            {visibleIssuers.map((issuer, idx) => (
              <IssuerAccordion
                key={idx}
                issuer={issuer}
                searchQuery={searchQuery}
                selectedFilters={selectedFilters}
                showCertifiedOnly={showCertifiedOnly}
              />
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}
