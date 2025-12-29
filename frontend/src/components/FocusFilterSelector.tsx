import { useEffect, useState, useMemo } from 'react'
import { Check, FunnelSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFilter } from '@/context/FilterContext'
import { useCV } from '@/context/CVDataContext'
import { useTranslation } from '@/context/LanguageContext'
import type { CVData } from '@/types/cv'

interface FilterOption {
  id: string
  label: string
  description: string
}

function deriveFilterOptions(cvData: CVData): FilterOption[] {
  const typeKeySet = new Set<string>()
  
  typeKeySet.add('Full CV')

  const collectTypeKeys = (data: unknown) => {
    if (!data) return
    
    if (Array.isArray(data)) {
      data.forEach(item => collectTypeKeys(item))
    } else if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>
      if (obj.type_key && Array.isArray(obj.type_key)) {
        obj.type_key.forEach((key: unknown) => {
          if (typeof key === 'string' && key && key !== 'Full CV') {
            typeKeySet.add(key)
          }
        })
      }
      Object.values(obj).forEach(value => collectTypeKeys(value))
    }
  }

  collectTypeKeys(cvData)

  const sortedKeys = Array.from(typeKeySet).sort((a, b) => {
    if (a === 'Full CV') return -1
    if (b === 'Full CV') return 1
    return a.localeCompare(b)
  })

  return sortedKeys.map(key => ({
    id: key,
    label: key,
    description: key === 'Full CV' 
      ? 'Show all content' 
      : `Show ${key.toLowerCase()}-related content`
  }))
}

export function FocusFilterSelector() {
  const { selectedFocus, setSelectedFocus, setAvailableFocusOptions } = useFilter()
  const cvData = useCV()
  const t = useTranslation()
  const [announcement, setAnnouncement] = useState('')
  
  const filterOptions = useMemo(() => deriveFilterOptions(cvData), [cvData])

  useEffect(() => {
    setAvailableFocusOptions(filterOptions.map(o => o.id))
  }, [filterOptions, setAvailableFocusOptions])

  const handleFilterChange = (filter: string) => {
    setSelectedFocus(filter)
    const selected = filterOptions.find(o => o.id === filter)
    setAnnouncement(`Content filter changed to ${selected?.label || filter}. ${selected?.description || ''}`)
  }

  return (
    <>
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="relative"
            aria-label={t.a11y.filter_focus}
          >
            <FunnelSimple className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Content Focus</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className="flex items-start gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              role="menuitemradio"
              aria-checked={selectedFocus === option.id}
            >
              <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                {selectedFocus === option.id && (
                  <Check className="h-4 w-4 text-primary" weight="bold" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
