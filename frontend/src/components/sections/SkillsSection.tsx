import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X, CaretDown, SquaresFour, ListBullets } from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import type { Skills } from '@/types/cv'
import { Button } from '@/components/ui/button'
import { useFilter, shouldShowEntry } from '@/context/FilterContext'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { SkillsCarousel } from '@/components/SkillsCarousel'
import { useTranslation, useSkillCategoryLabel } from '@/context/LanguageContext'
import { interpolate } from '@/lib/i18n'

type ViewMode = 'list' | 'carousel'

/**
 * Sanitize a string to be a valid HTML ID
 * Removes or replaces characters that are not valid in IDs
 */
function toValidId(str: string): string {
  // Replace spaces and special characters with hyphens, remove non-alphanumeric chars
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'category' // Fallback if result is empty
}

export function SkillsSection() {
  const data = useCV()
  const skills = (data.skills as Skills) ?? {}
  const t = useTranslation()
  const getSkillLabel = useSkillCategoryLabel()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { selectedFocus } = useFilter()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { ref, isVisible } = useScrollAnimation()

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
          
          const matchesFilter = shouldShowEntry(skill.type_key, selectedFocus)
          
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
  }, [skills, searchQuery, selectedFocus])

  const skillsArray = useMemo(() => {
    return Object.entries(filteredSkills).map(([category, subcategories]) => {
      const groups = Object.entries(subcategories).map(([name, items]) => ({
        name,
        displayName: getSkillLabel(name), // Localized subcategory label
        items: Array.isArray(items) ? items : []
      }))
      const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0)
      return { 
        category, 
        displayCategory: getSkillLabel(category), // Localized category label
        groups, 
        totalCount 
      }
    })
  }, [filteredSkills, getSkillLabel])

  useEffect(() => {
    const firstSkill = skillsArray[0]
    if (skillsArray.length > 0 && expandedCategories.size === 0 && firstSkill) {
      setExpandedCategories(new Set([firstSkill.category]))
    }
  }, [skillsArray.length])

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
    setExpandedCategories(new Set(skillsArray.map(s => s.category)))
  }

  const collapseAll = () => {
    setExpandedCategories(new Set())
  }

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  const totalSkills = skillsArray.reduce((sum, cat) => sum + cat.totalCount, 0)
  const allExpanded = expandedCategories.size === skillsArray.length
  const noneExpanded = expandedCategories.size === 0

  return (
    <section 
      id="skills" 
      ref={ref as React.RefObject<HTMLElement>}
      className={`w-full py-12 sm:py-16 px-3 sm:px-4 bg-muted/30 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t.sections.skills}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {interpolate(t.skills?.skills_across_domains || '{count} skills across {domains} domains', { count: totalSkills, domains: skillsArray.length })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
            <Input
              type="text"
              placeholder={t.skills?.search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 text-sm"
              aria-label={t.a11y.search_skills}
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                aria-label={t.a11y.clear_search}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {/* View mode toggle */}
            <div className="flex gap-1 border border-border rounded-md p-1">
              <Button 
                size="sm" 
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
                aria-label={t.a11y.list_view}
              >
                <ListBullets size={16} weight="bold" />
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === 'carousel' ? 'default' : 'ghost'}
                onClick={() => setViewMode('carousel')}
                className="h-8 w-8 p-0"
                aria-label={t.a11y.carousel_view}
              >
                <SquaresFour size={16} weight="bold" />
              </Button>
            </div>
            
            {viewMode === 'list' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={expandAll}
                  disabled={allExpanded}
                  className="text-xs sm:text-sm"
                >
                  {t.actions?.expand_all}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={collapseAll}
                  disabled={noneExpanded}
                  className="text-xs sm:text-sm"
                >
                  {t.actions?.collapse_all}
                </Button>
              </>
            )}
          </div>
        </div>

        {skillsArray.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-card border border-border rounded-lg">
            <MagnifyingGlass size={40} className="sm:w-12 sm:h-12 mx-auto mb-4 opacity-30" />
            <p className="text-base sm:text-lg px-4 text-muted-foreground">
              {interpolate(t.skills?.no_skills_matching || 'No skills found matching "{query}"', { query: searchQuery })}
            </p>
          </div>
        ) : viewMode === 'carousel' ? (
          <SkillsCarousel skills={filteredSkills} />
        ) : (
          <div className="space-y-3">
            {skillsArray.map(({ category, displayCategory, groups, totalCount }) => {
              const isExpanded = expandedCategories.has(category)
              const categoryId = `skills-${toValidId(category)}`
              
              return (
                <div 
                  key={category}
                  className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-primary/50"
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                    aria-expanded={isExpanded}
                    aria-controls={categoryId}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <CaretDown 
                        size={20} 
                        weight="bold"
                        className={`flex-shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <h3 className="text-base sm:text-lg font-semibold truncate">{displayCategory}</h3>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {totalCount}
                      </Badge>
                    </div>
                  </button>

                  {isExpanded && (
                    <div 
                      id={categoryId}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {groups.map((group) => (
                        <div key={group.name} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {group.displayName}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {group.items.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs sm:text-sm font-normal hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150 cursor-default py-1 px-2 sm:py-1.5 sm:px-3"
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
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
