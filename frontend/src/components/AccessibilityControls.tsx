/**
 * Accessibility Controls Component
 * 
 * Provides UI for accessibility settings including:
 * - Font size controls
 * - High contrast mode toggle
 * - Dyslexia-friendly font toggle
 */

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  TextAa, 
  Plus, 
  Minus, 
  ArrowCounterClockwise,
  Eye,
  TextT,
  AccessibilityMotion
} from '@phosphor-icons/react'
import { useAccessibility } from '@/context/AccessibilityContext'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface AccessibilityControlsProps {
  className?: string
}

export function AccessibilityControls({ className }: AccessibilityControlsProps) {
  const t = useTranslation()
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    dyslexiaFont,
    toggleDyslexiaFont,
    reducedMotion
  } = useAccessibility()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9 sm:h-10 sm:w-10", className)}
          aria-label={t.accessibility?.font_size || 'Accessibility settings'}
        >
          <TextAa size={20} weight="bold" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">
            {t.accessibility?.font_size || 'Accessibility'}
          </h4>
          
          {/* Font Size Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                {t.accessibility?.font_size || 'Font Size'}
              </Label>
              <span className="text-sm text-muted-foreground">
                {fontSize}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={decreaseFontSize}
                disabled={fontSize <= 75}
                aria-label={t.accessibility?.decrease_font || 'Decrease font size'}
              >
                <Minus size={16} weight="bold" />
              </Button>
              
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((fontSize - 75) / 75) * 100}%` }}
                />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={increaseFontSize}
                disabled={fontSize >= 150}
                aria-label={t.accessibility?.increase_font || 'Increase font size'}
              >
                <Plus size={16} weight="bold" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={resetFontSize}
                disabled={fontSize === 100}
                aria-label={t.accessibility?.reset_font || 'Reset font size'}
              >
                <ArrowCounterClockwise size={16} weight="bold" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-muted-foreground" />
              <Label htmlFor="high-contrast" className="text-sm cursor-pointer">
                {t.accessibility?.high_contrast || 'High Contrast'}
              </Label>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          </div>
          
          {/* Dyslexia Font Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TextT size={18} className="text-muted-foreground" />
              <Label htmlFor="dyslexia-font" className="text-sm cursor-pointer">
                {t.accessibility?.dyslexia_font || 'Dyslexia Font'}
              </Label>
            </div>
            <Switch
              id="dyslexia-font"
              checked={dyslexiaFont}
              onCheckedChange={toggleDyslexiaFont}
            />
          </div>
          
          {/* Reduced Motion Status */}
          {reducedMotion && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AccessibilityMotion size={18} />
              <span>{t.accessibility?.reduced_motion || 'Reduced motion enabled'}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
