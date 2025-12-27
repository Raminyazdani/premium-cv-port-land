import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X, CaretDown } from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { Skills } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { getStoredFocusFilter, type FocusFilter, isVisibleWithFilter } from '@/lib/focusFilterManager'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [currentFilter, setCurrentFilter] = useState<FocusFilter>(getStoredFocusFilter())

  useEffect(() => {
    const handleFilterChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ filter: FocusFilter }>
      setCurrentFilter(customEvent.detail.filter)
    }

    window.addEventListener('focusFilterChange', handleFilterChange)
    return () => window.removeEventListener('focusFilterChange', handleFilterChange)
  }, [])

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

  useEffect(() => {
    if (searchQuery) {
      const allCategories = new Set(skillsArray.map(s => s.category))
      setExpandedCategories(allCategories)
    } else {
      setExpandedCategories(new Set())
    }
  }, [searchQuery, skillsArray])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const expandAll = () => {
    const allCategories = new Set(skillsArray.map(s => s.category))
    setExpandedCategories(allCategories)
  }

  const collapseAll = () => {
    setExpandedCategories(new Set())
  }

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  const totalSkills = skillsArray.reduce((sum, cat) => sum + cat.totalCount, 0)
  const allExpanded = expandedCategories.size === skillsArray.length

  return (
    <section id="skills" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Skills & Expertise</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {totalSkills} skills across {skillsArray.length} domains
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={allExpanded ? collapseAll : expandAll}
              className="text-xs"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
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
            className="pl-10 pr-10 h-10 text-sm"
            aria-label="Search skills"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
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
          <div className="grid gap-3">
            {skillsArray.map(({ category, groups, totalCount }) => {
              const isExpanded = expandedCategories.has(category)
              
              return (
                <Collapsible
                  key={category}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category)}
                  className="border border-border rounded-lg bg-card"
                >
                  <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg group">
                    <div className="flex items-center gap-3">
                      <CaretDown 
                        size={20} 
                        className={`transition-transform text-muted-foreground ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-left">{category}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {totalCount}
                      </Badge>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="grid gap-4 pt-2">
                      {groups.map((group) => (
                        <div key={group.name} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {group.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {group.items.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs font-normal hover:bg-primary hover:text-primary-foreground transition-colors cursor-default py-1 px-2.5"
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
                </Collapsible>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
