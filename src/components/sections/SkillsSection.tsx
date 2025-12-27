import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { Skills } from '@/types/cv'
import { Button } from '@/components/ui/button'

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<string>('')

  const topCategories = Object.keys(skills)
  
  useMemo(() => {
    if (!selectedTab && topCategories.length > 0) {
      setSelectedTab(topCategories[0])
    }
  }, [topCategories, selectedTab])

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return skills

    const result: Skills = {}

    Object.entries(skills).forEach(([topCat, category]) => {
      const filteredCategory: typeof category = {}

      Object.entries(category).forEach(([skillGroupName, skillsList]) => {
        if (!Array.isArray(skillsList)) return

        const matchingSkills = skillsList.filter(skill => 
          skill.long_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.short_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  return (
    <section id="skills" className="w-full py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-muted-foreground">
            Comprehensive technical proficiencies across multiple domains
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 h-auto flex-wrap gap-2 bg-muted/50 p-2">
            {topCategories.map((category) => {
              const count = Object.values(filteredSkills[category] || {}).reduce(
                (acc, skills) => acc + skills.length,
                0
              )
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                >
                  {category}
                  {count > 0 && (
                    <span className="text-xs opacity-70">({count})</span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {topCategories.map((topCategory) => {
            const category = filteredSkills[topCategory]
            
            return (
              <TabsContent key={topCategory} value={topCategory} className="mt-0">
                {!category || Object.keys(category).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MagnifyingGlass size={40} className="mx-auto mb-3 opacity-50" />
                    <p>No skills found matching your search</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {Object.entries(category).map(([skillGroupName, skillsList]) => (
                      <div 
                        key={skillGroupName}
                        className="space-y-3 p-4 rounded-lg border bg-card"
                      >
                        <h3 className="font-semibold text-sm text-foreground/90">
                          {skillGroupName}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillsList.map((skill, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary"
                              className="text-xs font-normal hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                              title={skill.long_name !== skill.short_name ? skill.long_name : undefined}
                            >
                              {skill.short_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
