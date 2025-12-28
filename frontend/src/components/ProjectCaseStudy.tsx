/**
 * Project Case Study Component
 * 
 * Expandable project cards with full case study view including
 * problem statement, solution, process, results, and image gallery.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Folder,
  GithubLogo,
  Globe,
  CaretDown,
  CaretUp,
  X,
  ArrowSquareOut,
  Lightbulb,
  Wrench,
  Target,
  ChartLineUp,
  Image as ImageIcon,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react'
import { useLanguage } from '@/context/LanguageContext'
import type { Project } from '@/types/cv'

// Translations
const caseStudyTranslations = {
  en: {
    viewCaseStudy: 'View Case Study',
    collapse: 'Collapse',
    problem: 'Problem',
    solution: 'Solution',
    process: 'Process',
    results: 'Results',
    technologies: 'Technologies',
    gallery: 'Gallery',
    links: 'Links',
    metrics: 'Key Metrics',
    viewProject: 'View Project',
    viewCode: 'View Code',
    liveDemo: 'Live Demo',
    close: 'Close',
    of: 'of',
    previous: 'Previous image',
    next: 'Next image'
  },
  de: {
    viewCaseStudy: 'Fallstudie ansehen',
    collapse: 'Einklappen',
    problem: 'Problem',
    solution: 'Lösung',
    process: 'Prozess',
    results: 'Ergebnisse',
    technologies: 'Technologien',
    gallery: 'Galerie',
    links: 'Links',
    metrics: 'Wichtige Kennzahlen',
    viewProject: 'Projekt ansehen',
    viewCode: 'Code ansehen',
    liveDemo: 'Live-Demo',
    close: 'Schließen',
    of: 'von',
    previous: 'Vorheriges Bild',
    next: 'Nächstes Bild'
  },
  fa: {
    viewCaseStudy: 'مشاهده مطالعه موردی',
    collapse: 'جمع کردن',
    problem: 'مسئله',
    solution: 'راه‌حل',
    process: 'فرآیند',
    results: 'نتایج',
    technologies: 'فناوری‌ها',
    gallery: 'گالری',
    links: 'لینک‌ها',
    metrics: 'معیارهای کلیدی',
    viewProject: 'مشاهده پروژه',
    viewCode: 'مشاهده کد',
    liveDemo: 'نسخه آزمایشی',
    close: 'بستن',
    of: 'از',
    previous: 'تصویر قبلی',
    next: 'تصویر بعدی'
  }
}

interface ProjectCaseStudyCardProps {
  project: Project
  isExpanded?: boolean
  onToggle?: () => void
  deepLinked?: boolean
}

interface ImageGalleryProps {
  images: string[]
  title: string
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { language, isRTL } = useLanguage()
  const t = caseStudyTranslations[language] || caseStudyTranslations.en

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!images.length) return null

  return (
    <>
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx)
              setIsModalOpen(true)
            }}
            className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              currentIndex === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
            }`}
          >
            <img
              src={img}
              alt={`${title} screenshot ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {currentIndex === idx && (
              <div className="absolute inset-0 bg-primary/20" />
            )}
          </button>
        ))}
      </div>

      {/* Modal Gallery */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{title} - {t.gallery}</DialogTitle>
            <DialogDescription>Image {currentIndex + 1} of {images.length}</DialogDescription>
          </DialogHeader>
          
          <div className="relative bg-black">
            <img
              src={images[currentIndex]}
              alt={`${title} screenshot ${currentIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-black/50 hover:bg-black/70 ${
                    isRTL ? 'right-2' : 'left-2'
                  }`}
                  onClick={goToPrevious}
                  aria-label={t.previous}
                >
                  <CaretLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1/2 -translate-y-1/2 h-10 w-10 text-white bg-black/50 hover:bg-black/70 ${
                    isRTL ? 'left-2' : 'right-2'
                  }`}
                  onClick={goToNext}
                  aria-label={t.next}
                >
                  <CaretRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
              {currentIndex + 1} {t.of} {images.length}
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-white bg-black/50 hover:bg-black/70"
              onClick={() => setIsModalOpen(false)}
              aria-label={t.close}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface MetricCardProps {
  label: string
  value: string
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <p className="text-2xl sm:text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

interface CaseStudySectionProps {
  icon: React.ReactNode
  title: string
  content: string
}

function CaseStudySectionBlock({ icon, title, content }: CaseStudySectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
        {icon}
        {title}
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed pl-6">
        {content}
      </p>
    </div>
  )
}

export function ProjectCaseStudyCard({
  project,
  isExpanded = false,
  onToggle,
  deepLinked = false
}: ProjectCaseStudyCardProps) {
  const [expanded, setExpanded] = useState(isExpanded || deepLinked)
  const { language, isRTL } = useLanguage()
  const cardRef = useRef<HTMLDivElement>(null)
  
  const t = caseStudyTranslations[language] || caseStudyTranslations.en

  const title = project.title || project.name || 'Untitled Project'
  const description = project.description || ''
  const caseStudy = project.caseStudy
  const hasCaseStudy = !!caseStudy && (
    caseStudy.problem ||
    caseStudy.solution ||
    caseStudy.process ||
    caseStudy.results ||
    (caseStudy.images && caseStudy.images.length > 0)
  )

  // Handle deep linking
  useEffect(() => {
    if (deepLinked && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [deepLinked])

  // Handle keyboard navigation
  useEffect(() => {
    if (!expanded) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpanded(false)
        onToggle?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded, onToggle])

  const handleToggle = () => {
    setExpanded(!expanded)
    onToggle?.()
  }

  // Generate project ID for deep linking
  const projectId = useMemo(() => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }, [title])

  return (
    <Card 
      ref={cardRef}
      id={`project-${projectId}`}
      className={`transition-all duration-300 overflow-hidden ${
        expanded ? 'ring-2 ring-primary/30' : 'hover:border-primary/30'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary shrink-0" />
              <span className="truncate">{title}</span>
            </CardTitle>
            {project.type_key && project.type_key.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.type_key.slice(0, 3).map((key, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {key}
                  </Badge>
                ))}
                {project.type_key.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.type_key.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {description && (
          <CardDescription className={`text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
            {description}
          </CardDescription>
        )}

        {/* Collapsed Links */}
        {!expanded && project.url && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <GithubLogo className="h-4 w-4 mr-2" />
                {t.viewCode}
              </a>
            </Button>
          </div>
        )}

        {/* Expand Button */}
        {hasCaseStudy && (
          <Button
            variant={expanded ? 'secondary' : 'default'}
            size="sm"
            onClick={handleToggle}
            className="w-full gap-2"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <CaretUp className="h-4 w-4" />
                {t.collapse}
              </>
            ) : (
              <>
                <CaretDown className="h-4 w-4" />
                {t.viewCaseStudy}
              </>
            )}
          </Button>
        )}

        {/* Expanded Case Study Content */}
        {expanded && caseStudy && (
          <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Separator />

            {/* Problem */}
            {caseStudy.problem && (
              <CaseStudySectionBlock
                icon={<Lightbulb className="h-4 w-4 text-yellow-500" />}
                title={t.problem}
                content={caseStudy.problem}
              />
            )}

            {/* Solution */}
            {caseStudy.solution && (
              <CaseStudySectionBlock
                icon={<Target className="h-4 w-4 text-green-500" />}
                title={t.solution}
                content={caseStudy.solution}
              />
            )}

            {/* Process */}
            {caseStudy.process && (
              <CaseStudySectionBlock
                icon={<Wrench className="h-4 w-4 text-blue-500" />}
                title={t.process}
                content={caseStudy.process}
              />
            )}

            {/* Results */}
            {caseStudy.results && (
              <CaseStudySectionBlock
                icon={<ChartLineUp className="h-4 w-4 text-purple-500" />}
                title={t.results}
                content={caseStudy.results}
              />
            )}

            {/* Metrics */}
            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <ChartLineUp className="h-4 w-4" />
                  {t.metrics}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {caseStudy.metrics.map((metric, idx) => (
                    <MetricCard key={idx} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {caseStudy.technologies && caseStudy.technologies.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">
                  {t.technologies}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {caseStudy.images && caseStudy.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {t.gallery}
                </h4>
                <ImageGallery images={caseStudy.images} title={title} />
              </div>
            )}

            {/* Links */}
            {(project.url || (caseStudy.links && caseStudy.links.length > 0)) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">
                  {t.links}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <GithubLogo className="h-4 w-4 mr-2" />
                        {t.viewCode}
                        <ArrowSquareOut className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {caseStudy.links?.map((link, idx) => (
                    <Button key={idx} variant="outline" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        {link.label}
                        <ArrowSquareOut className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Hook to handle deep linking for projects
 */
export function useProjectDeepLink() {
  const [deepLinkedProject, setDeepLinkedProject] = useState<string | null>(null)

  useEffect(() => {
    // Check URL hash for project ID
    const hash = window.location.hash
    if (hash.startsWith('#project-')) {
      const projectId = hash.slice(1) // Remove the #
      setDeepLinkedProject(projectId)
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#project-')) {
        setDeepLinkedProject(hash.slice(1))
      } else {
        setDeepLinkedProject(null)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setDeepLink = useCallback((projectId: string | null) => {
    if (projectId) {
      window.history.pushState(null, '', `#${projectId}`)
      setDeepLinkedProject(projectId)
    } else {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
      setDeepLinkedProject(null)
    }
  }, [])

  return { deepLinkedProject, setDeepLink }
}
