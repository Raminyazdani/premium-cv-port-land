import { useState, useEffect } from 'react'
import { Check, Translate } from '@phosphor-icons/react'
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
  type LanguageCode, 
  LANGUAGE_OPTIONS, 
  setLanguage, 
  initializeLanguage 
} from '@/lib/languageManager'

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')
  const [isChanging, setIsChanging] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const language = initializeLanguage()
    setCurrentLanguage(language)
  }, [])

  const handleLanguageChange = async (language: LanguageCode) => {
    if (isChanging) return
    
    setIsChanging(true)
    const selectedLang = LANGUAGE_OPTIONS.find(l => l.code === language)
    
    setLanguage(language)
    setCurrentLanguage(language)
    setAnnouncement(`Language changed to ${selectedLang?.label || language}`)
    
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
            aria-label="Select language"
            disabled={isChanging}
          >
            {isChanging ? (
              <Spinner size={20} label="Changing language" />
            ) : (
              <Translate className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleLanguageChange(option.code)}
              disabled={isChanging}
              className="flex items-center justify-between cursor-pointer focus:bg-accent focus:text-accent-foreground"
              role="menuitemradio"
              aria-checked={currentLanguage === option.code}
            >
              <span className="flex items-center gap-2">
                <span>{option.nativeLabel}</span>
                {option.code !== option.nativeLabel.toLowerCase().slice(0, 2) && (
                  <span className="text-xs text-muted-foreground">
                    ({option.label})
                  </span>
                )}
              </span>
              {currentLanguage === option.code && (
                <Check className="h-4 w-4 text-primary" weight="bold" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
