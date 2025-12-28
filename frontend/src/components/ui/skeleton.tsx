import { cn } from "@/lib/utils"
import { ComponentProps, useEffect, useState } from "react"

/**
 * Skeleton Loading System
 * Animated shimmer effect with prefers-reduced-motion support
 */

interface SkeletonProps extends ComponentProps<"div"> {
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-muted",
        shimmer && !prefersReducedMotion && "skeleton-shimmer",
        prefersReducedMotion && "bg-muted",
        className
      )}
      {...props}
    />
  )
}

/**
 * Skeleton Text - for text content placeholders
 */
function SkeletonText({ 
  lines = 1, 
  className,
  lastLineWidth = "75%"
}: { 
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4" 
          style={{ 
            width: i === lines - 1 && lines > 1 ? lastLineWidth : '100%' 
          }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton Card - for card content placeholders
 */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

/**
 * Skeleton Section - for full section placeholders
 */
function SkeletonSection({ 
  className,
  items = 3
}: { 
  className?: string
  items?: number
}) {
  return (
    <div className={cn("w-full py-12 px-4", className)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section header */}
        <div className="space-y-2 mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        
        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: items }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton Profile - for profile/basics section
 */
function SkeletonProfile({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

/**
 * Skeleton Timeline - for experience/education timeline
 */
function SkeletonTimeline({ 
  items = 3,
  className 
}: { 
  items?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="w-3 h-3 rounded-full" />
            {i < items - 1 && <Skeleton className="w-0.5 h-24 mt-2" />}
          </div>
          <div className="flex-1 space-y-2 pb-6">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton Skills Grid - for skills section
 */
function SkeletonSkillsGrid({ className }: { className?: string }) {
  // Predefined widths for skill badges (deterministic, no Math.random)
  const firstRowWidths = [80, 70, 90, 60, 85, 75, 95, 65]
  const secondRowWidths = [75, 85, 60, 90, 70, 80]
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Category */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-2">
          {firstRowWidths.map((width, i) => (
            <Skeleton 
              key={i} 
              className="h-8 rounded-full"
              style={{ width: `${width}px` }}
            />
          ))}
        </div>
      </div>
      
      {/* Another category */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex flex-wrap gap-2">
          {secondRowWidths.map((width, i) => (
            <Skeleton 
              key={i} 
              className="h-8 rounded-full"
              style={{ width: `${width}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton Hero - for hero section
 */
function SkeletonHero({ className }: { className?: string }) {
  return (
    <div className={cn("w-full min-h-[60vh] flex items-center justify-center", className)}>
      <div className="text-center space-y-6 max-w-2xl">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <SkeletonText lines={2} className="max-w-md mx-auto" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export { 
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonSection,
  SkeletonProfile,
  SkeletonTimeline,
  SkeletonSkillsGrid,
  SkeletonHero,
}
