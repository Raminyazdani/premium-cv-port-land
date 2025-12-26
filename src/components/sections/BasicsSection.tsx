import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  EnvelopeSimple, 
  Phone, 
  MapPin, 
  Copy, 
  Check,
  LinkedinLogo,
  GithubLogo,
  TwitterLogo,
  Globe,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import { getBasics, getProfilePhotoUrl, getInitials, formatLocation } from '@/lib/cv-data'
import { copyToClipboard } from '@/lib/clipboard'
import type { Profile } from '@/types/cv'

const iconMap: Record<string, typeof LinkedinLogo> = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  twitter: TwitterLogo,
  default: Globe
}

function SocialLink({ profile }: { profile: Profile }) {
  const network = profile.network?.toLowerCase() ?? 'default'
  const Icon = iconMap[network] ?? iconMap.default
  
  if (!profile.url) return null
  
  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      className="hover:scale-105 transition-transform"
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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    const success = await copyToClipboard(text, label)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-2"
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check size={16} weight="bold" className="text-green-600" />
      ) : (
        <Copy size={16} />
      )}
    </Button>
  )
}

export function BasicsSection() {
  const basics = getBasics()
  const [showPhone, setShowPhone] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  
  if (!basics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    )
  }
  
  const photoUrl = getProfilePhotoUrl()
  const initials = getInitials(basics.name)
  const location = formatLocation(basics.location)
  const roles = basics.label?.split('·').map(r => r.trim()) ?? []
  
  const summary = basics.summary ?? ''
  const summaryLines = summary.split('\n').filter(Boolean)
  const shouldTruncate = summary.length > 200
  const displaySummary = summaryExpanded || !shouldTruncate 
    ? summary 
    : summary.slice(0, 200) + '...'
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent/5 to-background"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, oklch(0.35 0.15 250 / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, oklch(0.70 0.15 60 / 0.08) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="container max-w-6xl px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-center">
          <div className="flex flex-col items-center lg:items-start gap-6">
            <Avatar className="h-64 w-64 border-4 border-background shadow-2xl">
              <AvatarImage src={photoUrl ?? undefined} alt={basics.name ?? 'Profile'} />
              <AvatarFallback className="text-6xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {basics.profiles && basics.profiles.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                {basics.profiles.map((profile, idx) => (
                  <SocialLink key={idx} profile={profile} />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                {basics.name ?? 'Unknown'}
              </h1>
              
              {roles.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center lg:justify-start mb-4">
                  {roles.map((role, idx) => (
                    <Badge key={idx} variant="secondary" className="text-base px-4 py-1">
                      {role}
                    </Badge>
                  ))}
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-2 text-muted-foreground justify-center lg:justify-start mb-6">
                  <MapPin size={18} weight="fill" />
                  <span>{location}</span>
                </div>
              )}
            </div>
            
            {summary && (
              <div className="max-w-2xl">
                <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
                  {displaySummary}
                </p>
                {shouldTruncate && (
                  <Button
                    variant="link"
                    onClick={() => setSummaryExpanded(!summaryExpanded)}
                    className="mt-2 px-0"
                  >
                    {summaryExpanded ? 'Show less' : 'Read more'}
                  </Button>
                )}
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex flex-col gap-4">
              {basics.email && (
                <div className="flex items-center gap-3 justify-center lg:justify-start group">
                  <EnvelopeSimple size={20} className="text-muted-foreground" weight="fill" />
                  <a 
                    href={`mailto:${basics.email}`}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {basics.email}
                  </a>
                  <CopyButton text={basics.email} label="Email" />
                </div>
              )}
              
              {basics.phone && (basics.phone.number || basics.phone.formatted) && (
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <Phone size={20} className="text-muted-foreground" weight="fill" />
                  {showPhone ? (
                    <>
                      <span className="text-foreground font-medium">
                        {basics.phone.formatted ?? basics.phone.number}
                      </span>
                      <CopyButton 
                        text={basics.phone.formatted ?? basics.phone.number ?? ''} 
                        label="Phone" 
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPhone(false)}
                        className="h-8"
                      >
                        <EyeSlash size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPhone(true)}
                      className="h-8"
                    >
                      <Eye size={16} className="mr-2" />
                      Show phone
                    </Button>
                  )}
                </div>
              )}
              
              {basics.url && (
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <Globe size={20} className="text-muted-foreground" weight="fill" />
                  <a 
                    href={basics.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {basics.url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
