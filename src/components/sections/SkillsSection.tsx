import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Code,
  MagnifyingGlass,
  X,
  Funnel,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { SkillItem, Skills } from '@/types/cv'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const allTypeKeys = useMemo(() => {
    const keysSet = new Set<string>()
    
    Object.values(skills).forEach(category => {
      Object.values(category).forEach(skillsList => {
        if (Array.isArray(skillsList)) {
          skillsList.forEach(skill => {
            skill.type_key?.forEach(key => {
              if (key !== 'Full CV') keysSet.add(key)
            })
          })
        }
      })
    })
    
    return Array.from(keysSet).sort()
  }, [skills])

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchQuery('')
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

          const matchesFilters = selectedFilters.length === 0 ||
            selectedFilters.some(filter => skill.type_key?.includes(filter))

          return matchesSearch && matchesFilters
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
  }, [skills, searchQuery, selectedFilters])

  const totalSkillsCount = useMemo(() => {
    let count = 0
    Object.values(filteredSkills).forEach(category => {
      Object.values(category).forEach(skillsList => {
        if (Array.isArray(skillsList)) {
          count += skillsList.length
        }
      })
    })
    return count
  }, [filteredSkills])

  if (!skills || Object.keys(skills).length === 0) {
    return (
      <section className="w-full py-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Code size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground">No skills data available</h3>
            <p className="text-sm text-muted-foreground mt-2">Add skills to your CV data to display them here.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="w-full py-12 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Technical Skills
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalSkillsCount} skill{totalSkillsCount !== 1 ? 's' : ''} across {Object.keys(filteredSkills).length} categories
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlass 
              size={16} 
              weight="bold" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-9 text-sm"
              aria-label="Search skills"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                aria-label="Clear search"
              >
                <X size={12} />
              </Button>
            )}
          </div>

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-9 gap-2"
              >
                <Funnel size={16} weight="bold" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Categories</h4>
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allTypeKeys.map(key => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${key}`}
                        checked={selectedFilters.includes(key)}
                        onCheckedChange={() => toggleFilter(key)}
                      />
                      <Label
                        htmlFor={`filter-${key}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {Object.keys(filteredSkills).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MagnifyingGlass size={40} weight="duotone" className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-base font-semibold mb-1">No matching skills</h3>
              <p className="text-sm text-muted-foreground mb-3">Try adjusting your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="w-full space-y-2">
            {Object.entries(filteredSkills).map(([topCategory, category]) => (
              <AccordionItem 
                key={topCategory} 
                value={topCategory}
                className="border rounded-lg bg-card px-4"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 text-left">
                    <h3 className="font-semibold text-sm">
                      {topCategory}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {Object.values(category).reduce((acc, skills) => acc + skills.length, 0)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="space-y-3">
                    {Object.entries(category).map(([skillGroupName, skillsList]) => (
                      <div key={skillGroupName} className="space-y-1.5">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          {skillGroupName}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsList.map((skill, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary"
                              className="text-xs font-normal px-2 py-0.5"
                              title={skill.long_name !== skill.short_name ? skill.long_name : undefined}
                            >
                              {skill.short_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}
