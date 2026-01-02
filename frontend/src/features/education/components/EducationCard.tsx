/**
 * Education Card Component
 * 
 * Presentational component for displaying a single education entry.
 * Receives pre-processed view model data, handles only rendering.
 */

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, TrendUp } from '@phosphor-icons/react'
import type { EducationCardProps } from '../model'

const MotionCard = motion.create(Card)

/**
 * Animation variants for card entrance
 */
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: (index: number) => ({ 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const
    }
  })
}

/**
 * EducationCard displays a single education entry with institution details,
 * dates, location, GPA, and tags.
 */
export function EducationCard({ education, index }: EducationCardProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false
  
  const CardComponent = prefersReducedMotion ? Card : MotionCard

  return (
    <CardComponent 
      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      {...(!prefersReducedMotion && {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
        variants: cardVariants,
        custom: index
      })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-1 break-words">
              {education.institution}
            </CardTitle>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {education.studyDescription && (
                <div className="font-medium text-foreground">
                  {education.studyDescription}
                </div>
              )}
              
              {education.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} weight="fill" className="shrink-0" />
                  <span>{education.location}</span>
                </div>
              )}
              
              {education.dateRange && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} weight="fill" className="shrink-0" />
                  <span>{education.dateRange}</span>
                </div>
              )}
            </div>
          </div>
          
          {education.logoUrl && (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <img 
                src={education.logoUrl} 
                alt={`${education.institution} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {education.gpa && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <TrendUp size={16} weight="bold" className="text-primary" />
            <span className="font-medium">GPA: {education.gpa}</span>
          </div>
        )}
        
        {education.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {education.tags.map((tag, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </CardComponent>
  )
}
