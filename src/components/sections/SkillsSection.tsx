import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { Skills } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStoredFocusFilter, type FocusFilter, isVisibleWithFilter } from '@/lib/focusFilterManager'

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
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
    if (skillsArray.length > 0 && !selectedCategory) {
      setSelectedCategory(skillsArray[0].category)
    }
  }, [skillsArray, selectedCategory])

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  const totalSkills = skillsArray.reduce((sum, cat) => sum + cat.totalCount, 0)

  return (
    <section id="skills" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {totalSkills} skills across {skillsArray.length} domains
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
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1 sm:gap-2 mb-6 bg-muted/50 p-2">
              {skillsArray.map(({ category, totalCount }) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span className="truncate max-w-[120px] sm:max-w-none">{category}</span>
                  <Badge variant="secondary" className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-1.5 py-0">
                    {totalCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {skillsArray.map(({ category, groups }) => (
              <TabsContent key={category} value={category} className="mt-0 space-y-6">
                {groups.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground border-l-4 border-primary pl-3">
                      {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs sm:text-sm font-normal hover:bg-primary hover:text-primary-foreground transition-colors cursor-default py-1.5 px-3"
                          title={skill.long_name !== skill.short_name ? skill.long_name : undefined}
                        >
                          {skill.short_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  )
}
