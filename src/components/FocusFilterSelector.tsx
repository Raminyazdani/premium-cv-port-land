import { useEffect } from 'react'
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
import { getCVData } from '@/lib/cv-data'

interface FilterOption {
  id: string
  label: string
  description: string
}

function deriveFilterOptions(): FilterOption[] {
  const cvData = getCVData()
  const typeKeySet = new Set<string>()
  
  typeKeySet.add('Full CV')

  const collectTypeKeys = (data: any) => {
    if (!data) return
    
    if (Array.isArray(data)) {
      data.forEach(item => collectTypeKeys(item))
    } else if (typeof data === 'object') {
      if (data.type_key && Array.isArray(data.type_key)) {
        data.type_key.forEach((key: string) => {
          if (key && key !== 'Full CV') {
            typeKeySet.add(key)
          }
        })
      }
      Object.values(data).forEach(value => collectTypeKeys(value))
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
  const filterOptions = deriveFilterOptions()

  useEffect(() => {
    setAvailableFocusOptions(filterOptions.map(o => o.id))
  }, [])

  const handleFilterChange = (filter: string) => {
    setSelectedFocus(filter)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          aria-label="Filter content focus"
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
            className="flex items-start gap-2 cursor-pointer"
          >
            <div className="flex items-center justify-center w-5 h-5 mt-0.5">
              {selectedFocus === option.id && (
                <Check className="h-4 w-4" weight="bold" />
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
  )
}
