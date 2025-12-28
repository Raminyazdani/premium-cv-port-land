/**
 * Page Corner Curl Effect
 * A subtle corner curl effect in the bottom-right corner
 * Reveals a hint of "page behind" effect with hover interaction
 */

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PageCornerCurlProps {
  onClick?: () => void
}

export function PageCornerCurl({ onClick }: PageCornerCurlProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    motionQuery.addEventListener('change', handleMotionChange)
    
    // Check for mobile viewport
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mobileQuery.matches)
    
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    mobileQuery.addEventListener('change', handleMobileChange)
    
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      mobileQuery.removeEventListener('change', handleMobileChange)
    }
  }, [])

  // Hide on mobile (effect too small)
  if (isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-40 cursor-pointer no-print',
        'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label="Page corner - click to scroll to top"
    >
      {/* Page behind layer */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-tl from-muted/50 to-transparent',
          'rounded-tl-full'
        )}
      />
      
      {/* Curled corner */}
      <div
        className={cn(
          'absolute bottom-0 right-0',
          'origin-bottom-right',
          prefersReducedMotion ? '' : 'transition-all duration-300 ease-out'
        )}
        style={{
          width: isHovered ? '80%' : '60%',
          height: isHovered ? '80%' : '60%',
        }}
      >
        {/* Shadow under curl */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-br from-transparent via-black/5 to-black/20',
            'rounded-tl-[100%]',
            prefersReducedMotion ? '' : 'transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-50'
          )}
        />
        
        {/* Curl paper effect */}
        <div
          className={cn(
            'absolute inset-0 overflow-hidden',
            'bg-gradient-to-br from-background via-background to-muted',
            'rounded-tl-[100%]',
            'shadow-[-2px_-2px_8px_rgba(0,0,0,0.15)]',
            prefersReducedMotion ? '' : 'transition-transform duration-300',
            isHovered ? 'scale-110' : 'scale-100'
          )}
          style={{
            transformOrigin: 'bottom right',
            transform: `${isHovered ? 'rotate(-5deg)' : 'rotate(0deg)'} scale(${isHovered ? 1.1 : 1})`,
          }}
        >
          {/* Subtle gradient overlay for depth */}
          <div
            className={cn(
              'absolute inset-0',
              'bg-gradient-to-tl from-primary/10 via-transparent to-transparent'
            )}
          />
        </div>
      </div>
      
      {/* Hidden page content peek */}
      <div
        className={cn(
          'absolute bottom-2 right-2',
          'text-[8px] text-muted-foreground/50',
          'pointer-events-none',
          prefersReducedMotion ? '' : 'transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        ↑
      </div>
    </div>
  )
}
