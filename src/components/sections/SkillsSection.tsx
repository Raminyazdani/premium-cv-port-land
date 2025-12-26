import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Code,
  MagnifyingGlass,
  X,
  Tag,
  Info,
  CaretRight,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { SkillItem, Skills } from '@/types/cv'
import { useIsMobile } from '@/hooks/use-mobile'

interface SkillBadgeProps {
  skill: SkillItem
}

function SkillBadge({ skill }: SkillBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasDetails = skill.long_name !== skill.short_name || (skill.type_key && skill.type_key.filter(k => k !== 'Full CV').length > 0)

  if (!hasDetails) {
    return (
      <Badge 
        variant="secondary"
        className="text-xs font-medium px-2 py-0.5"
      >
        {skill.short_name}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge 
          variant="secondary"
          className="text-xs font-medium px-2 py-0.5 cursor-pointer hover:bg-accent transition-colors"
        >
          {skill.short_name}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{skill.long_name}</DialogTitle>
          <DialogDescription>Skill details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {skill.type_key && skill.type_key.filter(k => k !== 'Full CV').length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Tag size={14} weight="fill" className="text-muted-foreground" />
                Categories
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skill.type_key
                  .filter(key => key !== 'Full CV')
                  .map((key, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="text-xs"
                    >
                      {key}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SkillGroupProps {
  subcategoryName: string
  skills: SkillItem[]
}

function SkillGroup({ subcategoryName, skills }: SkillGroupProps) {
  return (
    <div className="border-l-2 border-primary/20 pl-4 py-2">
      <h4 className="text-sm font-semibold text-foreground mb-2">
        {subcategoryName}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, idx) => (
          <SkillBadge key={idx} skill={skill} />
        ))}
      </div>
    </div>
  )
}

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  const isMobile = useIsMobile()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

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

  const topCategories = useMemo(() => {
    return Object.keys(skills).sort()
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
      <section className="w-full py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
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
    <section id="skills" className="w-full py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Technical Skills
          </h2>
          <p className="text-base text-muted-foreground">
            Comprehensive technical expertise across multiple domains
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlass 
                size={18} 
                weight="bold" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10"
                aria-label="Search skills"
              />
              {searchQuery && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            {(selectedFilters.length > 0 || searchQuery) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                size="sm"
                className="shrink-0"
                aria-label="Clear all filters"
              >
                <X size={14} className="mr-1.5" />
                Clear
              </Button>
            )}
          </div>

          {allTypeKeys.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTypeKeys.map(key => (
                <Badge
                  key={key}
                  variant={selectedFilters.includes(key) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                  onClick={() => toggleFilter(key)}
                >
                  {key}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info size={14} weight="fill" />
            <span>{totalSkillsCount} skill{totalSkillsCount !== 1 ? 's' : ''}</span>
          </div>
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
          <Tabs defaultValue={topCategories[0]} className="w-full">
            <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-muted/50 p-1">
              {topCategories.map(topCat => (
                <TabsTrigger 
                  key={topCat} 
                  value={topCat}
                  className="text-xs px-3 py-1.5 data-[state=active]:bg-background"
                >
                  {topCat}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(filteredSkills).map(([topCategory, category]) => (
              <TabsContent key={topCategory} value={topCategory} className="mt-6 space-y-4">
                {Object.entries(category).map(([skillGroupName, skillsList]) => (
                  <SkillGroup
                    key={skillGroupName}
                    subcategoryName={skillGroupName}
                    skills={skillsList}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  )
}
