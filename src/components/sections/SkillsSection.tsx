import React, { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Code,
  MagnifyingGlass,
  X,
  Tag,
  Info,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { SkillItem, Skills } from '@/types/cv'
import { useIsMobile } from '@/hooks/use-mobile'

interface SkillChipProps {
  skill: SkillItem
}

function SkillChip({ skill }: SkillChipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-auto py-2 px-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
          aria-label={`View details for ${skill.short_name}`}
        >
          <span className="font-medium text-sm">{skill.short_name}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{skill.long_name}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Skill details and categories
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Tag size={16} weight="fill" />
              Short Name
            </h4>
            <p className="text-base">{skill.short_name}</p>
          </div>

          {skill.type_key && skill.type_key.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Code size={16} weight="fill" />
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {skill.type_key
                  .filter(key => key !== 'Full CV')
                  .map((key, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {key}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface SubcategoryCardProps {
  subcategoryName: string
  skills: SkillItem[]
}

function SubcategoryCard({ subcategoryName, skills }: SubcategoryCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <h4 className="font-semibold text-base mb-4 text-foreground flex items-center gap-2">
          <Code size={18} weight="duotone" className="text-primary" />
          {subcategoryName}
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <SkillChip key={idx} skill={skill} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SkillsSection() {
  const data = getCVData()
  const skills = (data.skills as Skills) ?? {}
  const isMobile = useIsMobile()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedTopCategory, setSelectedTopCategory] = useState<string>('')

  const allTypeKeys = useMemo(() => {
    const keysSet = new Set<string>()
    
    Object.values(skills).forEach(category => {
      Object.values(category).forEach(subcategory => {
        Object.values(subcategory).forEach(skillsList => {
          if (Array.isArray(skillsList)) {
            skillsList.forEach(skill => {
              skill.type_key?.forEach(key => {
                if (key !== 'Full CV') keysSet.add(key)
              })
            })
          }
        })
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
    setSelectedTopCategory('')
  }

  const filteredSkills = useMemo(() => {
    const result: Skills = {}

    const topCategoriesToProcess = selectedTopCategory 
      ? [selectedTopCategory] 
      : topCategories

    topCategoriesToProcess.forEach(topCat => {
      const category = skills[topCat]
      if (!category) return

      const filteredCategory: typeof category = {}

      Object.entries(category).forEach(([subCatName, subcategory]) => {
        const filteredSubcategory: { [key: string]: SkillItem[] } = {}

        Object.entries(subcategory).forEach(([skillGroupName, skillsList]) => {
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
            filteredSubcategory[skillGroupName] = matchingSkills
          }
        })

        if (Object.keys(filteredSubcategory).length > 0) {
          filteredCategory[subCatName] = filteredSubcategory
        }
      })

      if (Object.keys(filteredCategory).length > 0) {
        result[topCat] = filteredCategory
      }
    })

    return result
  }, [skills, searchQuery, selectedFilters, selectedTopCategory, topCategories])

  const totalSkillsCount = useMemo(() => {
    let count = 0
    Object.values(filteredSkills).forEach(category => {
      Object.values(category).forEach(subcategory => {
        Object.values(subcategory).forEach(skillsList => {
          if (Array.isArray(skillsList)) {
            count += skillsList.length
          }
        })
      })
    })
    return count
  }, [filteredSkills])

  if (!skills || Object.keys(skills).length === 0) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-b from-background to-muted/30 py-16 px-4">
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
    <section className="w-full min-h-screen bg-gradient-to-b from-background via-muted/10 to-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my diverse technical expertise across programming, bioinformatics, data science, and laboratory techniques
          </p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlass 
                  size={20} 
                  weight="bold" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  type="text"
                  placeholder="Search skills (e.g., Python, React, BLAST...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
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

              {(selectedFilters.length > 0 || searchQuery || selectedTopCategory) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="shrink-0"
                  aria-label="Clear all filters"
                >
                  <X size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {topCategories.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Domain</h3>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map(topCat => (
                    <Button
                      key={topCat}
                      size="sm"
                      variant={selectedTopCategory === topCat ? 'default' : 'outline'}
                      onClick={() => setSelectedTopCategory(selectedTopCategory === topCat ? '' : topCat)}
                      className="transition-all duration-200"
                    >
                      {topCat}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {allTypeKeys.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {allTypeKeys.map(key => (
                    <Badge
                      key={key}
                      variant={selectedFilters.includes(key) ? 'default' : 'outline'}
                      className="cursor-pointer hover:opacity-80 transition-all duration-200"
                      onClick={() => toggleFilter(key)}
                    >
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Info size={16} weight="fill" />
                <span>{totalSkillsCount} skill{totalSkillsCount !== 1 ? 's' : ''} found</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(filteredSkills).length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-16 text-center">
              <MagnifyingGlass size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No skills match your filters</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(filteredSkills).map(([topCategory, category]) => (
              <div key={topCategory}>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                  <Code size={28} weight="bold" className="text-primary" />
                  {topCategory}
                </h3>

                <div className="space-y-8">
                  {Object.entries(category).map(([subcategoryName, subcategory]) => (
                    <div key={subcategoryName}>
                      <h4 className="text-lg font-semibold mb-4 text-muted-foreground pl-1">
                        {subcategoryName}
                      </h4>
                      
                      <div className="grid gap-4 grid-cols-1">
                        {Object.entries(subcategory).map(([skillGroupName, skillsList]) => (
                          <SubcategoryCard
                            key={skillGroupName}
                            subcategoryName={skillGroupName}
                            skills={skillsList}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mt-12" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
