/**
 * Skill Tooltip Component
 * Shows detailed information about a skill on hover/focus
 * Includes full name, proficiency level, and optional additional info
 */

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion'

interface SkillTooltipProps {
  shortName: string
  longName: string
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience?: number
  children: React.ReactNode
  className?: string
}

const PROFICIENCY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

const PROFICIENCY_COLORS = {
  beginner: 'bg-blue-500',
  intermediate: 'bg-green-500',
  advanced: 'bg-yellow-500',
  expert: 'bg-red-500',
}

export function SkillTooltip({
  shortName,
  longName,
  proficiencyLevel,
  yearsOfExperience,
  children,
  className,
}: SkillTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const prefersReducedMotion = useReducedMotion()
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate tooltip position based on available space
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      
      // Prefer top, but switch to bottom if not enough space
      if (spaceAbove < 100 && spaceBelow > spaceAbove) {
        setPosition('bottom')
      } else {
        setPosition('top')
      }
    }
  }, [isVisible])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(true), 150)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(false), 100)
  }

  // Long press for mobile
  const handleTouchStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(true), 500)
  }

  const handleTouchEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  // Only show full tooltip if there's additional info beyond short name
  const hasAdditionalInfo = 
    (longName && longName !== shortName) || 
    proficiencyLevel || 
    yearsOfExperience

  if (!hasAdditionalInfo) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={triggerRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-2 min-w-max max-w-xs',
            'bg-popover text-popover-foreground',
            'border border-border rounded-lg shadow-lg',
            'text-sm',
            prefersReducedMotion 
              ? 'opacity-100' 
              : 'animate-in fade-in-0 zoom-in-95 duration-150',
            position === 'top' 
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' 
              : 'top-full left-1/2 -translate-x-1/2 mt-2'
          )}
        >
          {/* Arrow */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2',
              'w-2 h-2 bg-popover border-border rotate-45',
              position === 'top' 
                ? 'top-full -mt-1 border-r border-b' 
                : 'bottom-full -mb-1 border-l border-t'
            )}
          />
          
          {/* Content */}
          <div className="relative space-y-1.5">
            {longName && longName !== shortName && (
              <p className="font-semibold">{longName}</p>
            )}
            
            {proficiencyLevel && (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    PROFICIENCY_COLORS[proficiencyLevel]
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {PROFICIENCY_LABELS[proficiencyLevel]}
                </span>
              </div>
            )}
            
            {yearsOfExperience && yearsOfExperience > 0 && (
              <p className="text-xs text-muted-foreground">
                {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} of experience
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
