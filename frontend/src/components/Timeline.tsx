/**
 * Timeline Visualization Component
 * Displays chronological events with animated progress indicator
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface TimelineEntry {
  id: string
  title: string
  subtitle?: string
  date?: string
  description?: string
  side?: 'left' | 'right'
}

interface TimelineProps {
  entries: TimelineEntry[]
  className?: string
}

export function Timeline({ entries, className }: TimelineProps) {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [visibleEntries, setVisibleEntries] = useState<Set<number>>(new Set())
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // If reduced motion, show all entries immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleEntries(new Set(entries.map((_, i) => i)))
      setProgress(100)
    }
  }, [prefersReducedMotion, entries.length])

  // Calculate progress and active entry based on scroll
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      const timeline = timelineRef.current
      if (!timeline) return

      const rect = timeline.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate progress (0-100%)
      const timelineTop = rect.top
      const timelineHeight = rect.height
      const scrollProgress = Math.max(0, Math.min(100, 
        ((viewportHeight - timelineTop) / (timelineHeight + viewportHeight)) * 100
      ))
      
      setProgress(scrollProgress)

      // Determine active entry
      let newActiveIndex = -1
      let newVisibleEntries = new Set<number>()
      
      entryRefs.current.forEach((ref, index) => {
        if (!ref) return
        
        const entryRect = ref.getBoundingClientRect()
        const entryMiddle = entryRect.top + entryRect.height / 2
        
        // Entry is visible if in viewport
        if (entryRect.top < viewportHeight && entryRect.bottom > 0) {
          newVisibleEntries.add(index)
        }
        
        // Active entry is the one closest to viewport center
        if (entryMiddle < viewportHeight * 0.6 && entryMiddle > viewportHeight * 0.2) {
          newActiveIndex = index
        }
      })
      
      setActiveIndex(newActiveIndex)
      setVisibleEntries(newVisibleEntries)
    }

    handleScroll() // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion, entries.length])

  // Alternate sides if not specified
  const enrichedEntries = useMemo(() => {
    return entries.map((entry, index) => ({
      ...entry,
      side: entry.side || (index % 2 === 0 ? 'left' : 'right')
    }))
  }, [entries])

  if (entries.length === 0) {
    return null
  }

  return (
    <div 
      ref={timelineRef}
      className={cn('relative py-12', className)}
    >
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block">
        {/* Progress indicator */}
        <div 
          className={cn(
            'absolute top-0 left-0 w-full bg-primary transition-all',
            prefersReducedMotion ? 'duration-0' : 'duration-300 ease-out'
          )}
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Mobile vertical line (left side) */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:hidden">
        <div 
          className={cn(
            'absolute top-0 left-0 w-full bg-primary transition-all',
            prefersReducedMotion ? 'duration-0' : 'duration-300 ease-out'
          )}
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Timeline entries */}
      <div className="space-y-12">
        {enrichedEntries.map((entry, index) => {
          const isVisible = visibleEntries.has(index) || prefersReducedMotion
          const isActive = index === activeIndex
          const delay = prefersReducedMotion ? 0 : index * 100

          return (
            <div
              key={entry.id}
              ref={(el) => { entryRefs.current[index] = el }}
              className={cn(
                'relative flex items-center gap-8',
                'transition-all duration-500',
                isVisible ? 'opacity-100' : 'opacity-0',
                entry.side === 'left' && 'md:flex-row',
                entry.side === 'right' && 'md:flex-row-reverse'
              )}
              style={{
                transitionDelay: isVisible ? `${delay}ms` : '0ms',
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* Desktop layout */}
              <div className="hidden md:block md:flex-1 text-right" 
                   style={{ visibility: entry.side === 'left' ? 'visible' : 'hidden' }}>
                {entry.side === 'left' && (
                  <TimelineContent entry={entry} isActive={isActive} align="right" />
                )}
              </div>

              {/* Dot indicator */}
              <div className="absolute left-8 md:relative md:left-auto flex-shrink-0 z-10">
                <div 
                  className={cn(
                    'w-4 h-4 rounded-full border-4 transition-all duration-300',
                    isActive 
                      ? 'bg-primary border-primary scale-125' 
                      : 'bg-background border-border hover:border-primary hover:scale-110'
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 pl-16 md:pl-0">
                {/* Mobile always left, desktop follows side */}
                <div className="md:hidden">
                  <TimelineContent entry={entry} isActive={isActive} align="left" />
                </div>
                <div className="hidden md:block" 
                     style={{ visibility: entry.side === 'right' ? 'visible' : 'hidden' }}>
                  {entry.side === 'right' && (
                    <TimelineContent entry={entry} isActive={isActive} align="left" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface TimelineContentProps {
  entry: TimelineEntry
  isActive: boolean
  align: 'left' | 'right'
}

function TimelineContent({ entry, isActive, align }: TimelineContentProps) {
  return (
    <div 
      className={cn(
        'p-4 rounded-lg border transition-all duration-300',
        'hover:border-primary/50 hover:shadow-md',
        isActive 
          ? 'bg-primary/5 border-primary/30 shadow-sm scale-105' 
          : 'bg-card border-border',
        align === 'right' && 'text-right'
      )}
    >
      {entry.date && (
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {entry.date}
        </p>
      )}
      <h3 className="text-base font-semibold mb-1">{entry.title}</h3>
      {entry.subtitle && (
        <p className="text-sm text-muted-foreground mb-2">{entry.subtitle}</p>
      )}
      {entry.description && (
        <p className="text-sm">{entry.description}</p>
      )}
    </div>
  )
}
