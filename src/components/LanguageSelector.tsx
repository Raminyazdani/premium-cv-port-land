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
import { 
  type LanguageCode, 
  LANGUAGE_OPTIONS, 
  setLanguage, 
  initializeLanguage 
} from '@/lib/languageManager'

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')

  useEffect(() => {
    const language = initializeLanguage()
    setCurrentLanguage(language)
  }, [])

  const handleLanguageChange = (language: LanguageCode) => {
    setLanguage(language)
    setCurrentLanguage(language)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          aria-label="Select language"
        >
          <Translate className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className="flex items-center justify-between cursor-pointer"
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
              <Check className="h-4 w-4 text-primary" weight="bold" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
