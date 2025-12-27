import { useState, useMemo } from 'react'
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

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())

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
    if (!searchQuery) return skills

    const result: Skills = {}
    const query = searchQuery.toLowerCase()

    Object.entries(skills).forEach(([topCat, category]) => {
      const filteredCategory: typeof category = {}

      Object.entries(category).forEach(([skillGroupName, skillsList]) => {
        if (!Array.isArray(skillsList)) return

        const matchingSkills = skillsList.filter(skill => 
          skill.long_name.toLowerCase().includes(query) ||
          skill.short_name.toLowerCase().includes(query)
        )

        if (matchingSkills.length > 0) {
          filteredCategory[skillGroupName] = matchingSkills
        }
      })

      if (Object.keys(filteredCategory).length > 0) {
        result[topCat] = filteredCategory
      }
    })

    return result
  }, [skills, searchQuery])

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
    <section id="skills" className="w-full py-16 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-muted-foreground">
            {skillsArray.reduce((sum, cat) => sum + cat.totalCount, 0)} skills across {skillsArray.length} domains
          </p>
        </div>

        <div className="mb-6 relative max-w-md">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <X size={14} />
            </Button>
          )}
        </div>

        {skillsArray.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No skills found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {skillsArray.map(({ category, groups, totalCount }) => (
              <Collapsible
                key={category}
                open={openCategories.has(category)}
                onOpenChange={() => toggleCategory(category)}
              >
                <div className="border rounded-lg bg-card overflow-hidden">
                  <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <CaretDown
                        size={18}
                        weight="bold"
                        className={`text-muted-foreground transition-transform ${
                          openCategories.has(category) ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <h3 className="text-base font-semibold text-left">
                        {category}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {totalCount}
                    </Badge>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 space-y-4">
                      {groups.map((group) => (
                        <div key={group.name} className="space-y-2">
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {group.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {group.items.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs font-normal hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-default"
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
