/**
 * Scroll Progress Indicator Component
 * Shows horizontal progress bar at top of page
 * Fills as user scrolls, matches theme color
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollProgressIndicatorProps {
  showSectionMarkers?: boolean
  sections?: string[]
}

export function ScrollProgressIndicator({
  showSectionMarkers = false,
  sections = [],
}: ScrollProgressIndicatorProps = {}) {
  const [progress, setProgress] = useState(0)
  const [sectionPositions, setSectionPositions] = useState<number[]>([])

  // Calculate scroll progress
  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      const totalScroll = documentHeight - windowHeight
      const currentProgress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0

      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    // Calculate section marker positions
    const calculateSectionPositions = () => {
      if (!showSectionMarkers || sections.length === 0) return

      const positions = sections
        .map(sectionId => {
          const element = document.querySelector(sectionId)
          if (!element) return null

          const elementTop = element.getBoundingClientRect().top + window.scrollY
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight
          const position = (elementTop / documentHeight) * 100

          return Math.min(100, Math.max(0, position))
        })
        .filter((pos): pos is number => pos !== null)

      setSectionPositions(positions)
    }

    calculateProgress()
    calculateSectionPositions()

    const handleScroll = () => {
      window.requestAnimationFrame(calculateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateSectionPositions, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateSectionPositions)
    }
  }, [showSectionMarkers, sections])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 no-print h-[3px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-border/30" />

      {/* Progress bar fill */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full bg-primary transition-all duration-150 ease-out',
          'shadow-[0_0_10px_rgba(var(--primary),0.5)]'
        )}
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px currentColor',
        }}
      />

      {/* Section markers */}
      {showSectionMarkers &&
        sectionPositions.map((position, index) => (
          <div
            key={`marker-${index}`}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60 border border-background"
            style={{
              left: `${position}%`,
            }}
            aria-hidden="true"
          />
        ))}
    </div>
  )
}
