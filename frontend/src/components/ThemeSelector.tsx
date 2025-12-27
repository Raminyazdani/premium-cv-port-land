import { useState, useEffect } from 'react'
import { Check, Palette } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { 
  type ThemeName, 
  THEME_OPTIONS, 
  setTheme, 
  initializeTheme 
} from '@/lib/themeManager'

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('normal')
  const [isChanging, setIsChanging] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const theme = initializeTheme()
    setCurrentTheme(theme)
  }, [])

  const handleThemeChange = async (theme: ThemeName) => {
    if (isChanging) return
    
    setIsChanging(true)
    const selectedTheme = THEME_OPTIONS.find(t => t.id === theme)
    
    setTheme(theme)
    setCurrentTheme(theme)
    setAnnouncement(`Theme changed to ${selectedTheme?.label || theme}`)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsChanging(false)
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
            aria-label="Select theme"
            disabled={isChanging}
          >
            {isChanging ? (
              <Spinner size={20} label="Changing theme" />
            ) : (
              <Palette className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Theme Presets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {THEME_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              disabled={isChanging}
              className="flex items-start gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              role="menuitemradio"
              aria-checked={currentTheme === option.id}
            >
              <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                {currentTheme === option.id && (
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
