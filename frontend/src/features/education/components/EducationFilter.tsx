/**
 * Education Filter Component
 * 
 * Provides tag-based filtering UI for education entries.
 */

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EducationFilterProps {
  /** All available filter tags */
  tags: string[]
  /** Currently selected tag */
  selectedTag: string
  /** Label for "All" option */
  allLabel: string
  /** Label for filter UI */
  filterLabel: string
  /** Callback when tag is selected */
  onTagSelect: (tag: string) => void
  /** Count of items for each tag */
  tagCounts: Map<string, number>
  /** Total count of items */
  totalCount: number
}

/**
 * EducationFilter renders filter buttons for education tags.
 */
export function EducationFilter({
  tags,
  selectedTag,
  allLabel,
  filterLabel,
  onTagSelect,
  tagCounts,
  totalCount,
}: EducationFilterProps) {
  const allTags = [allLabel, ...tags]
  
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm font-medium text-muted-foreground">
        {filterLabel}:
      </span>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => {
          const isSelected = selectedTag === tag
          const count = tag === allLabel ? totalCount : (tagCounts.get(tag) || 0)
          
          return (
            <Button
              key={tag}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTagSelect(tag)}
              className="transition-all"
            >
              {tag}
              <Badge 
                variant="secondary" 
                className="ml-2 px-1.5 py-0 text-xs"
              >
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
