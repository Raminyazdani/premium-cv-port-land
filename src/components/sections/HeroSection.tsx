import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  EnvelopeSimple,
  MapPin,
  LinkedinLogo,
  GithubLogo,
  ArrowDown,
} from '@phosphor-icons/react'
import { getBasics, getProfilePhotoUrl, getCoverPhotoUrl, getInitials, formatLocation, getFullName, getRoles } from '@/lib/cv-data'
import { getProfiles } from '@/lib/cv-data'
import type { Profile } from '@/types/cv'

const iconMap: Record<string, typeof LinkedinLogo> = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
}

function SocialButton({ profile }: { profile: Profile }) {
  const network = profile.network?.toLowerCase() ?? ''
  const Icon = iconMap[network]
  
  if (!Icon || !profile.url) return null
  
  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      className="hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all"
    >
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${profile.network} profile`}
      >
        <Icon size={20} weight="fill" />
      </a>
    </Button>
  )
}

export function HeroSection() {
  const basics = getBasics()
  const profiles = getProfiles()
  const fullName = getFullName(basics)
  const roles = getRoles(basics?.label)
  const profilePhoto = getProfilePhotoUrl()
  const coverPhoto = getCoverPhotoUrl()
  const location = basics?.location?.[0] ? formatLocation(basics.location[0]) : null
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

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
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: coverPhoto
          ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${coverPhoto})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: coverPhoto ? 'transparent' : 'var(--background)',
      }}
    >
      {!coverPhoto && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
      )}

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Avatar className="h-32 w-32 lg:h-40 lg:w-40 border-4 border-background shadow-2xl">
              <AvatarImage src={profilePhoto || undefined} alt={fullName} />
              <AvatarFallback className="text-3xl lg:text-4xl font-bold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className={`text-4xl lg:text-6xl font-bold mb-4 font-heading ${coverPhoto ? 'text-white' : 'text-foreground'}`}>
            {fullName}
          </h1>

          <div className="min-h-[2.5rem] mb-6">
            {roles.length > 0 && (
              <p
                className={`text-xl lg:text-2xl font-medium transition-opacity duration-500 ${
                  coverPhoto ? 'text-white/90' : 'text-muted-foreground'
                }`}
                key={currentRoleIndex}
              >
                {roles[currentRoleIndex]}
              </p>
            )}
          </div>

          {location && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <MapPin size={20} weight="fill" className={coverPhoto ? 'text-white/80' : 'text-muted-foreground'} />
              <span className={`text-sm lg:text-base ${coverPhoto ? 'text-white/90' : 'text-muted-foreground'}`}>
                {location}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {basics?.email && (
              <Button
                variant={coverPhoto ? 'secondary' : 'default'}
                size="lg"
                asChild
                className="gap-2"
              >
                <a href={`mailto:${basics.email}`}>
                  <EnvelopeSimple size={20} weight="fill" />
                  Get in Touch
                </a>
              </Button>
            )}

            {profiles.slice(0, 2).map((profile) => (
              <SocialButton key={profile.network} profile={profile} />
            ))}
          </div>

          <button
            onClick={handleScrollToAbout}
            className={`mt-12 animate-bounce ${coverPhoto ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            aria-label="Scroll to about section"
          >
            <ArrowDown size={32} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  )
}
