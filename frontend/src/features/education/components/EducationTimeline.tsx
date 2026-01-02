/**
 * Education Timeline Component
 * 
 * Renders education entries in a timeline layout with
 * a vertical line and dots for each entry.
 */

import type { EducationViewModel } from '../model'
import { EducationCard } from './EducationCard'

interface EducationTimelineProps {
  /** Array of education view models to display */
  items: EducationViewModel[]
}

/**
 * EducationTimeline displays education entries in a vertical timeline
 * with connecting lines and dots.
 */
export function EducationTimeline({ items }: EducationTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
      
      <div className="space-y-8">
        {items.map((edu, idx) => (
          <div key={edu.id} className="relative">
            {/* Timeline dot */}
            <div className="hidden md:block absolute left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
            
            <div className="md:pl-20">
              <EducationCard education={edu} index={idx} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
