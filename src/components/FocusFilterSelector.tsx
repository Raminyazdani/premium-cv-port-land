import { useState, useEffect } from 'react'
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
import { 
  type FocusFilter, 
  FOCUS_FILTER_OPTIONS, 
  setFocusFilter, 
  initializeFocusFilter 
} from '@/lib/focusFilterManager'

export function FocusFilterSelector() {
  const [currentFilter, setCurrentFilter] = useState<FocusFilter>('Full CV')

  useEffect(() => {
    const filter = initializeFocusFilter()
    setCurrentFilter(filter)
  }, [])

  const handleFilterChange = (filter: FocusFilter) => {
    setFocusFilter(filter)
    setCurrentFilter(filter)
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
        {FOCUS_FILTER_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => handleFilterChange(option.id)}
            className="flex items-start gap-2 cursor-pointer"
          >
            <div className="flex items-center justify-center w-5 h-5 mt-0.5">
              {currentFilter === option.id && (
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
