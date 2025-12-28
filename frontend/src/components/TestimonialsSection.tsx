/**
 * Testimonials Section
 * 
 * Carousel with auto-rotation for testimonials and recommendations.
 * Supports keyboard navigation, swipe gestures, and accessibility.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Quotes,
  CaretLeft,
  CaretRight,
  Star,
  LinkedinLogo,
  Pause,
  Play
} from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import type { Testimonial } from '@/types/cv'

// Auto-rotation interval in milliseconds
const AUTO_ROTATE_INTERVAL = 6000

// Translations
const testimonialTranslations = {
  en: {
    title: 'Testimonials & Recommendations',
    subtitle: 'What colleagues and clients say',
    linkedIn: 'View on LinkedIn',
    noTestimonials: 'No testimonials available',
    previous: 'Previous testimonial',
    next: 'Next testimonial',
    pause: 'Pause auto-rotation',
    play: 'Resume auto-rotation',
    of: 'of'
  },
  de: {
    title: 'Empfehlungen & Testimonials',
    subtitle: 'Was Kollegen und Kunden sagen',
    linkedIn: 'Auf LinkedIn ansehen',
    noTestimonials: 'Keine Empfehlungen verfügbar',
    previous: 'Vorherige Empfehlung',
    next: 'Nächste Empfehlung',
    pause: 'Automatische Rotation pausieren',
    play: 'Automatische Rotation fortsetzen',
    of: 'von'
  },
  fa: {
    title: 'توصیه‌ها و نظرات',
    subtitle: 'نظر همکاران و مشتریان',
    linkedIn: 'مشاهده در لینکدین',
    noTestimonials: 'توصیه‌ای موجود نیست',
    previous: 'توصیه قبلی',
    next: 'توصیه بعدی',
    pause: 'توقف چرخش خودکار',
    play: 'ادامه چرخش خودکار',
    of: 'از'
  }
}

// Sample testimonials for demo (can be removed when real data is available)
const sampleTestimonials: Testimonial[] = [
  {
    quote: "Ramin is an exceptional bioinformatician with a deep understanding of both computational methods and biological systems. His work on single-cell RNA-seq analysis was instrumental in advancing our research.",
    author: "Dr. Jane Smith",
    title: "Principal Investigator",
    company: "University Research Lab",
    rating: 5,
    date: "2024-01"
  },
  {
    quote: "Working with Ramin was a pleasure. He consistently delivered high-quality code and his expertise in data science helped us solve complex analytical challenges.",
    author: "John Doe",
    title: "Senior Data Scientist",
    company: "Tech Company",
    rating: 5,
    date: "2023-12"
  },
  {
    quote: "Ramin's full-stack development skills and attention to detail made him an invaluable team member. He always went above and beyond to ensure project success.",
    author: "Sarah Johnson",
    title: "Product Manager",
    company: "Software Startup",
    rating: 5,
    date: "2023-08"
  }
]

interface StarRatingProps {
  rating: number
  max?: number
}

function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-500' : 'text-muted-foreground/30'}`}
          weight={i < rating ? 'fill' : 'regular'}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const data = useCV()
  const { language, isRTL } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()
  
  // Use sample testimonials if no real data
  const testimonials = data.testimonials?.length ? data.testimonials : sampleTestimonials
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  const t = testimonialTranslations[language] || testimonialTranslations.en

  // Navigate to previous testimonial
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }, [testimonials.length])

  // Navigate to next testimonial
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }, [testimonials.length])

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused || isHovered || testimonials.length <= 1) {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
        autoRotateRef.current = null
      }
      return
    }

    autoRotateRef.current = setInterval(goToNext, AUTO_ROTATE_INTERVAL)

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [isPaused, isHovered, goToNext, testimonials.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        isRTL ? goToNext() : goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        isRTL ? goToPrevious() : goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, isRTL])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        isRTL ? goToPrevious() : goToNext()
      } else {
        isRTL ? goToNext() : goToPrevious()
      }
    }

    setTouchStart(null)
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!testimonials.length) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="testimonials"
      className={`w-full py-12 sm:py-16 px-3 sm:px-4 bg-muted/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      aria-label={t.title}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Quotes className="h-6 w-6 sm:h-8 sm:w-8 text-primary" weight="fill" />
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t.subtitle}
          </p>
          <Separator className="mt-4 max-w-xs mx-auto" />
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Card className="border-primary/10 overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-10">
              {/* Quote */}
              <div className="relative">
                <Quotes 
                  className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" 
                  weight="fill"
                />
                <blockquote 
                  className="text-base sm:text-lg leading-relaxed pl-6 pr-2 italic text-foreground/90"
                  aria-live="polite"
                >
                  "{currentTestimonial.quote}"
                </blockquote>
              </div>

              {/* Author Info */}
              <div className={`mt-6 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20">
                  {currentTestimonial.photoUrl ? (
                    <AvatarImage 
                      src={currentTestimonial.photoUrl} 
                      alt={currentTestimonial.author}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(currentTestimonial.author)}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <p className="font-semibold text-base sm:text-lg">
                    {currentTestimonial.author}
                  </p>
                  {(currentTestimonial.title || currentTestimonial.company) && (
                    <p className="text-sm text-muted-foreground">
                      {[currentTestimonial.title, currentTestimonial.company]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  )}
                  <div className={`flex items-center gap-3 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {currentTestimonial.rating && (
                      <StarRating rating={currentTestimonial.rating} />
                    )}
                    {currentTestimonial.linkedInUrl && (
                      <a
                        href={currentTestimonial.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={t.linkedIn}
                      >
                        <LinkedinLogo className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <>
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm ${
                  isRTL ? 'right-2 sm:-right-5' : 'left-2 sm:-left-5'
                }`}
                onClick={isRTL ? goToNext : goToPrevious}
                aria-label={t.previous}
              >
                <CaretLeft className="h-5 w-5" />
              </Button>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm ${
                  isRTL ? 'left-2 sm:-left-5' : 'right-2 sm:-right-5'
                }`}
                onClick={isRTL ? goToPrevious : goToNext}
                aria-label={t.next}
              >
                <CaretRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Pagination & Controls */}
        {testimonials.length > 1 && (
          <div className={`flex items-center justify-center gap-4 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Dots */}
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-6'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Testimonial ${index + 1} ${t.of} ${testimonials.length}`}
                />
              ))}
            </div>

            {/* Pause/Play Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? t.play : t.pause}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>

            {/* Counter */}
            <Badge variant="outline" className="text-xs">
              {currentIndex + 1} / {testimonials.length}
            </Badge>
          </div>
        )}
      </div>
    </section>
  )
}
