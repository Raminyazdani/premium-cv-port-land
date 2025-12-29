/**
 * Skills Carousel Component
 * Interactive carousel/slider for skill categories with navigation and keyboard support
 */

import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Skills } from '@/types/cv'
import { useTranslation, useSkillCategoryLabel } from '@/context/LanguageContext'
import { interpolate } from '@/lib/i18n'

interface SkillsCarouselProps {
  skills: Skills
  className?: string
}

export function SkillsCarousel({ skills, className }: SkillsCarouselProps) {
  const t = useTranslation()
  const getSkillLabel = useSkillCategoryLabel()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(1)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

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

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3)
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2)
      } else {
        setCardsPerView(1)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  // Convert skills object to array with display labels
  const skillsArray = useMemo(() => {
    return Object.entries(skills).map(([category, subcategories]) => {
      const groups = Object.entries(subcategories).map(([name, items]) => ({
        name,
        displayName: getSkillLabel(name), // Localized subcategory label
        items: Array.isArray(items) ? items : []
      }))
      const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0)
      return { 
        category, 
        displayCategory: getSkillLabel(category), // Localized category label
        groups, 
        totalCount 
      }
    })
  }, [skills, getSkillLabel])

  const maxIndex = Math.max(0, skillsArray.length - cardsPerView)

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(Math.min(maxIndex, index))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [maxIndex])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    
    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrevious()
    }
  }

  if (skillsArray.length === 0) {
    return null
  }

  const visibleCards = skillsArray.slice(currentIndex, currentIndex + cardsPerView)
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  return (
    <div 
      className={cn('relative w-full', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows */}
      {skillsArray.length > cardsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10',
              'h-10 w-10 sm:h-12 sm:w-12',
              'shadow-lg hover:scale-110 transition-transform',
              'disabled:opacity-30 disabled:hover:scale-100',
              '-translate-x-1/2'
            )}
            aria-label={t.a11y?.previous_skill_category}
          >
            <CaretLeft size={20} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10',
              'h-10 w-10 sm:h-12 sm:w-12',
              'shadow-lg hover:scale-110 transition-transform',
              'disabled:opacity-30 disabled:hover:scale-100',
              'translate-x-1/2'
            )}
            aria-label={t.a11y?.next_skill_category}
          >
            <CaretRight size={20} weight="bold" />
          </Button>
        </>
      )}

      {/* Carousel Cards */}
      <div className="overflow-hidden px-2 sm:px-4">
        <div 
          className={cn(
            'flex gap-4 transition-transform',
            prefersReducedMotion ? 'duration-0' : 'duration-500 ease-in-out'
          )}
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView + 1.5)}%)`,
          }}
        >
          {skillsArray.map(({ category, displayCategory, groups, totalCount }, index) => (
            <div
              key={category}
              className={cn(
                'flex-shrink-0 bg-card border border-border rounded-lg p-5 shadow-sm',
                'hover:border-primary/50 hover:shadow-md transition-all',
                cardsPerView === 1 && 'w-full',
                cardsPerView === 2 && 'w-[calc(50%-0.5rem)]',
                cardsPerView === 3 && 'w-[calc(33.333%-0.75rem)]'
              )}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">{displayCategory}</h3>
                <Badge variant="secondary" className="text-xs">
                  {interpolate(t.skills?.skills_count || '{count} skills', { count: totalCount })}
                </Badge>
              </div>

              <div className="space-y-3">
                {groups.slice(0, 3).map((group) => (
                  <div key={group.name}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                      {group.displayName}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.slice(0, 6).map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs font-normal hover:bg-primary hover:text-primary-foreground transition-colors"
                          title={skill.long_name !== skill.short_name ? skill.long_name : undefined}
                        >
                          {skill.short_name}
                        </Badge>
                      ))}
                      {group.items.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{group.items.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {groups.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    {interpolate(t.skills?.more_categories || '+{count} more categories', { count: groups.length - 3 })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {skillsArray.length > cardsPerView && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label={t.a11y?.skill_category_nav}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={interpolate(t.a11y?.go_to_slide || 'Go to slide {number}', { number: index + 1 })}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  )
}
