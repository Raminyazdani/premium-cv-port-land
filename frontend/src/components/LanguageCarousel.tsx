/**
 * Language Carousel with 3D Card Effect
 * Displays language options in a 3D carousel with smooth transitions
 */

import { useState, useEffect, useRef } from 'react'
import { Globe } from '@phosphor-icons/react'
import { useLanguage } from '@/context/LanguageContext'
import type { Language } from '@/utils/dataNormalizer'
import { cn } from '@/lib/utils'

interface LanguageOption {
  code: Language
  name: string
  nativeName: string
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
]

export function LanguageCarousel() {
  const { language, setLanguage } = useLanguage()
  const [selectedIndex, setSelectedIndex] = useState(
    LANGUAGES.findIndex(lang => lang.code === language)
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
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

  // Sync selected index with language context
  useEffect(() => {
    const index = LANGUAGES.findIndex(lang => lang.code === language)
    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [language])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        cyclePrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        cycleNext()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        selectCurrent()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  const cyclePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + LANGUAGES.length) % LANGUAGES.length)
  }

  const cycleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % LANGUAGES.length)
  }

  const selectCurrent = () => {
    const selected = LANGUAGES[selectedIndex]
    if (selected) {
      setLanguage(selected.code)
    }
  }

  const selectLanguage = (index: number) => {
    const lang = LANGUAGES[index]
    if (lang) {
      setSelectedIndex(index)
      setLanguage(lang.code)
    }
  }

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    const touch = e.targetTouches[0]
    if (touch) {
      setTouchStart(touch.clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    if (touch) {
      setTouchEnd(touch.clientX)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    
    if (distance > minSwipeDistance) {
      cycleNext()
    } else if (distance < -minSwipeDistance) {
      cyclePrevious()
    }
  }

  const getCardStyle = (index: number) => {
    const position = index - selectedIndex
    
    if (prefersReducedMotion) {
      return {
        opacity: position === 0 ? 1 : 0.5,
        transform: 'none',
      }
    }

    // 3D transforms for carousel effect
    const baseTranslateZ = position === 0 ? 0 : -100
    const translateX = position * 120
    const rotateY = position * 15
    const scale = position === 0 ? 1 : 0.85
    const opacity = position === 0 ? 1 : 0.6

    return {
      transform: `translateX(${translateX}px) translateZ(${baseTranslateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: position === 0 ? 10 : 5 - Math.abs(position),
    }
  }

  return (
    <div 
      ref={carouselRef}
      className="relative w-full max-w-md mx-auto py-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="group"
      aria-label="Language selector carousel"
    >
      <div className="relative h-48 sm:h-56" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {LANGUAGES.map((lang, index) => {
            const isSelected = index === selectedIndex
            const position = index - selectedIndex
            const isVisible = Math.abs(position) <= 1

            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(index)}
                className={cn(
                  'absolute w-48 sm:w-56 h-40 sm:h-48 bg-card border-2 rounded-xl shadow-lg',
                  'flex flex-col items-center justify-center gap-3 sm:gap-4',
                  'cursor-pointer transition-all duration-500 ease-out',
                  'hover:border-primary/70 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
                  isSelected && 'border-primary',
                  !isVisible && 'pointer-events-none'
                )}
                style={getCardStyle(index)}
                aria-label={`Select ${lang.name}`}
                aria-pressed={isSelected}
                tabIndex={isSelected ? 0 : -1}
              >
                <span className="text-5xl sm:text-6xl" aria-hidden="true">
                  {lang.flag}
                </span>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {lang.nativeName}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {lang.name}
                  </p>
                </div>
                {isSelected && (
                  <Globe 
                    size={20} 
                    weight="duotone" 
                    className="text-primary absolute top-3 right-3"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation indicators */}
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Language selection">
        {LANGUAGES.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => selectLanguage(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              index === selectedIndex 
                ? 'bg-primary w-8' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Select ${lang.name}`}
            aria-selected={index === selectedIndex}
            role="tab"
          />
        ))}
      </div>

      {/* Keyboard hints */}
      <p className="text-xs text-center text-muted-foreground mt-4 hidden sm:block">
        Use arrow keys to navigate • Press Enter to select
      </p>
    </div>
  )
}
