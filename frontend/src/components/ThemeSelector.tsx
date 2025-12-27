import { useState, useEffect } from 'react'
import { Check, Palette, Lock } from '@phosphor-icons/react'
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
  getAvailableThemes,
  setTheme, 
  initializeTheme 
} from '@/lib/themeManager'

interface ThemeSelectorProps {
  konamiUnlocked?: boolean
}

export function ThemeSelector({ konamiUnlocked = false }: ThemeSelectorProps = {}) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('normal')
  const [isChanging, setIsChanging] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const availableThemes = getAvailableThemes(konamiUnlocked)

  useEffect(() => {
    const theme = initializeTheme()
    setCurrentTheme(theme)
  }, [])

  const handleThemeChange = async (theme: ThemeName) => {
    if (isChanging) return
    
    setIsChanging(true)
    const selectedTheme = availableThemes.find(t => t.id === theme)
    
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
            data-theme-selector
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
          {availableThemes.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              disabled={isChanging}
              className="flex items-start gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              role="menuitemradio"
              aria-checked={currentTheme === option.id}
            >
              <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                {currentTheme === option.id ? (
                  <Check className="h-4 w-4 text-primary" weight="bold" aria-hidden="true" />
                ) : option.secret && !konamiUnlocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {option.label}
                  {option.secret && konamiUnlocked && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                      Secret
                    </span>
                  )}
                </div>
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
