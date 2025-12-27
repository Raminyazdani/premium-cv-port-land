import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X, CaretDown } from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { Skills } from '@/types/cv'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { getStoredFocusFilter, type FocusFilter, isVisibleWithFilter } from '@/lib/focusFilterManager'

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [currentFilter, setCurrentFilter] = useState<FocusFilter>(getStoredFocusFilter())

  useEffect(() => {
    const handleFilterChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ filter: FocusFilter }>
      setCurrentFilter(customEvent.detail.filter)
    }

    window.addEventListener('focusFilterChange', handleFilterChange)
    return () => window.removeEventListener('focusFilterChange', handleFilterChange)
  }, [])

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const filteredSkills = useMemo(() => {
    const result: Skills = {}

    Object.entries(skills).forEach(([topCat, category]) => {
      const filteredCategory: typeof category = {}

      Object.entries(category).forEach(([skillGroupName, skillsList]) => {
        if (!Array.isArray(skillsList)) return

        const matchingSkills = skillsList.filter(skill => {
          const matchesSearch = !searchQuery || 
            skill.long_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.short_name.toLowerCase().includes(searchQuery.toLowerCase())
          
          const matchesFilter = isVisibleWithFilter(skill.type_key, currentFilter)
          
          return matchesSearch && matchesFilter
        })

        if (matchingSkills.length > 0) {
          filteredCategory[skillGroupName] = matchingSkills
        }
      })

      if (Object.keys(filteredCategory).length > 0) {
        result[topCat] = filteredCategory
      }
    })

    return result
  }, [skills, searchQuery, currentFilter])

  const skillsArray = useMemo(() => {
    return Object.entries(filteredSkills).map(([category, subcategories]) => {
      const groups = Object.entries(subcategories).map(([name, items]) => ({
        name,
        items: Array.isArray(items) ? items : []
      }))
      const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0)
      return { category, groups, totalCount }
    })
  }, [filteredSkills])

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  return (
    <section id="skills" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {skillsArray.reduce((sum, cat) => sum + cat.totalCount, 0)} skills across {skillsArray.length} domains
          </p>
        </div>

        <div className="mb-6 relative max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 text-base"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 touch-manipulation"
              aria-label="Clear search"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {skillsArray.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-muted-foreground">
            <MagnifyingGlass size={40} className="sm:w-12 sm:h-12 mx-auto mb-4 opacity-30" />
            <p className="text-base sm:text-lg px-4">No skills found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {skillsArray.map(({ category, groups, totalCount }) => (
              <Collapsible
                key={category}
                open={openCategories.has(category)}
                onOpenChange={() => toggleCategory(category)}
              >
                <div className="border rounded-lg bg-card overflow-hidden">
                  <CollapsibleTrigger className="w-full px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 transition-colors group touch-manipulation">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <CaretDown
                        size={16}
                        weight="bold"
                        className={`text-muted-foreground transition-transform flex-shrink-0 sm:w-[18px] sm:h-[18px] ${
                          openCategories.has(category) ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <h3 className="text-sm sm:text-base font-semibold text-left truncate">
                        {category}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                      {totalCount}
                    </Badge>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 space-y-3 sm:space-y-4">
                      {groups.map((group) => (
                        <div key={group.name} className="space-y-2">
                          <h4 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {group.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {group.items.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs font-normal hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-default py-1 px-2 sm:px-2.5"
                                title={skill.long_name !== skill.short_name ? skill.long_name : undefined}
                              >
                                {skill.short_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
