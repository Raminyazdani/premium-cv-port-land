/**
 * Sound Effects System
 * Optional, opt-in sound effects for UI interactions
 * Uses Web Audio API for low-latency playback
 */

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

type SoundType = 'click' | 'toggle' | 'success' | 'error' | 'navigate' | 'hover'

interface SoundSettings {
  enabled: boolean
  volume: number // 0-1
}

interface SoundEffectsContextType {
  settings: SoundSettings
  setEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
  playSound: (type: SoundType) => void
}

const SoundEffectsContext = createContext<SoundEffectsContextType | null>(null)

const STORAGE_KEY = 'cv-sound-settings'

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: false, // Disabled by default - user must opt-in
  volume: 0.3,
}

// Sound synthesis parameters (frequencies and durations)
const SOUND_CONFIGS: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  click: {
    frequencies: [800, 600],
    durations: [0.03, 0.02],
    type: 'sine',
  },
  toggle: {
    frequencies: [440, 550, 660],
    durations: [0.05, 0.05, 0.1],
    type: 'sine',
  },
  success: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5
    durations: [0.1, 0.1, 0.2],
    type: 'sine',
  },
  error: {
    frequencies: [200, 180],
    durations: [0.1, 0.15],
    type: 'sawtooth',
  },
  navigate: {
    frequencies: [400, 500],
    durations: [0.05, 0.05],
    type: 'triangle',
  },
  hover: {
    frequencies: [600],
    durations: [0.02],
    type: 'sine',
  },
}

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext)
  if (!context) {
    // Return a no-op if not within provider
    return {
      settings: DEFAULT_SETTINGS,
      setEnabled: () => {},
      setVolume: () => {},
      playSound: () => {},
    }
  }
  return context
}

interface SoundEffectsProviderProps {
  children: React.ReactNode
}

export function SoundEffectsProvider({ children }: SoundEffectsProviderProps) {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SETTINGS)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({
          enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : false,
          volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(1, parsed.volume)) : 0.3,
        })
      }
    } catch (e) {
      console.warn('Failed to load sound settings:', e)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.warn('Failed to save sound settings:', e)
    }
  }, [settings])

  // Initialize audio context lazily
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
      } catch (e) {
        console.warn('Web Audio API not available:', e)
        return null
      }
    }
    return audioContextRef.current
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    setSettings(prev => ({ ...prev, volume: clampedVolume }))
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = clampedVolume
    }
  }, [])

  const playSound = useCallback((type: SoundType) => {
    if (!settings.enabled) return
    
    const ctx = getAudioContext()
    if (!ctx) return
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const config = SOUND_CONFIGS[type]
    if (!config) return

    // Update gain
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = settings.volume
    }

    let currentTime = ctx.currentTime

    config.frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const envelope = ctx.createGain()
      
      oscillator.type = config.type
      oscillator.frequency.value = freq
      
      envelope.gain.value = 0
      envelope.gain.linearRampToValueAtTime(settings.volume, currentTime + 0.01)
      envelope.gain.linearRampToValueAtTime(0, currentTime + config.durations[index])
      
      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current || ctx.destination)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + config.durations[index])
      
      currentTime += config.durations[index] * 0.8 // Slight overlap
    })
  }, [settings.enabled, settings.volume, getAudioContext])

  return (
    <SoundEffectsContext.Provider value={{ settings, setEnabled, setVolume, playSound }}>
      {children}
    </SoundEffectsContext.Provider>
  )
}

/**
 * Sound Settings Panel Component
 * For inclusion in settings/preferences UI
 */
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { SpeakerHigh, SpeakerX } from '@phosphor-icons/react'

export function SoundSettingsPanel({ className }: { className?: string }) {
  const { settings, setEnabled, setVolume, playSound } = useSoundEffects()

  return (
    <div className={cn('space-y-4 p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <SpeakerHigh size={20} className="text-primary" />
          ) : (
            <SpeakerX size={20} className="text-muted-foreground" />
          )}
          <Label htmlFor="sound-enabled" className="font-medium">
            Sound Effects
          </Label>
        </div>
        <Switch
          id="sound-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => {
            setEnabled(checked)
            if (checked) {
              playSound('toggle')
            }
          }}
        />
      </div>
      
      {settings.enabled && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Volume: {Math.round(settings.volume * 100)}%
          </Label>
          <Slider
            value={[settings.volume * 100]}
            onValueChange={([value]) => setVolume(value / 100)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Subtle sound feedback for button clicks, navigation, and actions.
        Disabled by default to respect your browsing experience.
      </p>
    </div>
  )
}
