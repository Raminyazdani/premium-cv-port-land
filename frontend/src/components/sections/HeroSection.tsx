import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  EnvelopeSimple,
  MapPin,
  LinkedinLogo,
  GithubLogo,
  ArrowDown,
} from '@phosphor-icons/react'
import { extractBasics, extractProfilePhotoUrl, extractCoverPhotoUrl, extractProfiles, getInitials, formatLocation, getFullName, getRoles } from '@/lib/cv-data'
import { useCVData } from '@/context/CVDataContext'
import { optimizeCloudinaryImage } from '@/utils/imageOptimizer'
import type { Profile } from '@/types/cv'
import { useTranslation } from '@/context/LanguageContext'
import { useParallax } from '@/hooks/use-parallax'
import { interpolate } from '@/lib/i18n'

const iconMap: Record<string, typeof LinkedinLogo> = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
}

function SocialButton({ profile, t }: { profile: Profile; t: ReturnType<typeof useTranslation> }) {
  const network = profile.network?.toLowerCase() ?? ''
  const Icon = iconMap[network]
  
  if (!Icon || !profile.url) return null
  
  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      className="h-11 w-11 sm:h-12 sm:w-12 hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all touch-manipulation"
    >
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={interpolate(t.a11y.visit_profile, { network: profile.network || '' })}
      >
        <Icon size={20} weight="fill" className="sm:w-5 sm:h-5" />
      </a>
    </Button>
  )
}

export function HeroSection() {
  const { data } = useCVData()
  const t = useTranslation()
  const basics = extractBasics(data)
  const profiles = extractProfiles(data)
  const fullName = getFullName(basics)
  const roles = getRoles(basics?.label)
  const profilePhoto = extractProfilePhotoUrl(basics)
  const coverPhoto = extractCoverPhotoUrl(basics)
  const optimizedCover = coverPhoto 
    ? optimizeCloudinaryImage(coverPhoto, { width: 1920, quality: 'auto:good', format: 'auto' })
    : null
  const location = (() => {
    if (!basics?.location) return null
    const loc = Array.isArray(basics.location) ? basics.location[0] : basics.location
    return loc ? formatLocation(loc) : null
  })()
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  
  // Add parallax effect to cover image
  const { ref: parallaxRef, style: parallaxStyle } = useParallax({ 
    speed: 0.5, 
    disableOnMobile: true 
  })

  useEffect(() => {
    if (roles.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [roles.length])

  const handleScrollToAbout = () => {
    const element = document.querySelector('#about')
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section
      ref={parallaxRef as React.RefObject<HTMLElement>}
      id="hero"
      data-hero
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-14 sm:pt-16 lg:pt-20"
    >
      {/* Parallax background layer */}
      {optimizedCover && (
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${optimizedCover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...parallaxStyle,
          }}
        />
      )}
      
      {!optimizedCover && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
      )}

      <div className="container relative z-10 px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Avatar 
              data-profile-image
              className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 border-4 border-background shadow-2xl"
            >
              <AvatarImage 
                src={profilePhoto || undefined} 
                alt={fullName}
                loading="eager"
                fetchPriority="high"
              />
              <AvatarFallback className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 font-heading px-2 ${optimizedCover ? 'text-white' : 'text-foreground'}`}>
            {fullName}
          </h1>

          <div className="min-h-[2rem] sm:min-h-[2.5rem] mb-4 sm:mb-6 px-4" aria-live="polite">
            {roles.length > 0 && (
              <p
                className={`text-lg sm:text-xl lg:text-2xl font-medium transition-opacity duration-500 ${
                  optimizedCover ? 'text-white/90' : 'text-muted-foreground'
                }`}
                key={currentRoleIndex}
              >
                {roles[currentRoleIndex]}
              </p>
            )}
          </div>

          {location && (
            <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 px-4">
              <MapPin size={18} className={`sm:w-5 sm:h-5 ${optimizedCover ? 'text-white/80' : 'text-muted-foreground'}`} weight="fill" />
              <span className={`text-sm sm:text-base ${optimizedCover ? 'text-white/90' : 'text-muted-foreground'}`}>
                {location}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
            {basics?.email && (
              <Button
                variant={optimizedCover ? 'secondary' : 'default'}
                size="lg"
                asChild
                className="gap-2 h-11 sm:h-12 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
              >
                <a href={`mailto:${basics.email}`} className="touch-manipulation">
                  <EnvelopeSimple size={18} weight="fill" className="sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">{t.actions.get_in_touch}</span>
                  <span className="xs:hidden">{t.actions.contact}</span>
                </a>
              </Button>
            )}

            {profiles.slice(0, 2).map((profile, index) => {
              const profileData = profile as Profile
              return (
                <SocialButton 
                  key={profileData?.network || `profile-${index}`} 
                  profile={profileData}
                  t={t}
                />
              )
            })}
          </div>

          <button
            onClick={handleScrollToAbout}
            className={`mt-8 sm:mt-12 animate-bounce touch-manipulation p-2 ${optimizedCover ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            aria-label={t.a11y.scroll_to_about}
          >
            <ArrowDown size={28} weight="bold" className="sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>
    </section>
  )
}
