import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  UserCircle,
  Envelope,
  Phone,
  MapPin,
  Buildings,
  Eye,
  EyeSlash,
  FilePdf,
} from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useFilter, shouldShowEntry } from '@/context/FilterContext'
import { MediaThumbnail } from '@/components/MediaThumbnail'
import { MediaModal } from '@/components/MediaModal'
import { useMediaModal } from '@/hooks/use-media-modal'
import type { Reference } from '@/types/cv'
import { toast } from 'sonner'

interface ReferenceCardProps {
  reference: Reference
  onOpenMedia: (url: string, alt: string) => void
}

function ReferenceCard({ reference, onOpenMedia }: ReferenceCardProps) {
  const [contactVisible, setContactVisible] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`)
    })
  }

  const hasContact = (reference.email && reference.email.length > 0) || reference.phone

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCircle className="text-primary" weight="duotone" />
              {reference.name}
            </CardTitle>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {reference.position}
            </p>
          </div>
          {reference.URL && (
            <MediaThumbnail
              url={reference.URL}
              alt={`${reference.name} - Reference Letter`}
              className="w-24 h-24"
              onClick={() => onOpenMedia(reference.URL!, `${reference.name} - Reference Letter`)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reference.department && (
          <div className="flex items-start gap-2 text-sm">
            <Buildings className="text-muted-foreground mt-0.5 shrink-0" size={16} />
            <span className="text-muted-foreground">{reference.department}</span>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-sm">
          <Buildings className="text-muted-foreground mt-0.5 shrink-0" weight="duotone" size={16} />
          <div>
            <div className="font-medium">{reference.institution}</div>
            {reference.location && (
              <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <MapPin size={14} weight="duotone" />
                {reference.location}
              </div>
            )}
          </div>
        </div>

        {hasContact && (
          <>
            <Separator />
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setContactVisible(!contactVisible)}
                className="w-full justify-center text-sm"
              >
                {contactVisible ? (
                  <>
                    <EyeSlash className="mr-1.5" size={16} />
                    Hide Contact
                  </>
                ) : (
                  <>
                    <Eye className="mr-1.5" size={16} />
                    Show Contact
                  </>
                )}
              </Button>

              {contactVisible && (
                <div className="space-y-2 pt-2">
                  {reference.email && reference.email.length > 0 && (
                    <div className="space-y-1.5">
                      {reference.email.map((email, idx) => (
                        <button
                          key={idx}
                          onClick={() => copyToClipboard(email, 'Email')}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-1.5 rounded hover:bg-muted"
                        >
                          <Envelope size={14} weight="duotone" />
                          <span className="break-all">{email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {reference.phone && (
                    <div className="space-y-1.5">
                      {Array.isArray(reference.phone) ? (
                        reference.phone.map((phone, idx) => (
                          <button
                            key={idx}
                            onClick={() => copyToClipboard(phone.formatted || '', 'Phone')}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-1.5 rounded hover:bg-muted"
                          >
                            <Phone size={14} weight="duotone" />
                            <span>{phone.formatted}</span>
                          </button>
                        ))
                      ) : typeof reference.phone === 'string' ? (
                        <button
                          onClick={() => copyToClipboard(reference.phone as string, 'Phone')}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-1.5 rounded hover:bg-muted"
                        >
                          <Phone size={14} weight="duotone" />
                          <span>{reference.phone}</span>
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {reference.type_key && reference.type_key.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {reference.type_key.slice(1).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ReferencesSection() {
  const cvData = useCV()
  const allReferences = cvData.references || []
  const { selectedFocus } = useFilter()
  const mediaModal = useMediaModal()

  const filteredReferences = allReferences.filter(reference => 
    shouldShowEntry(reference.type_key, selectedFocus)
  )

  if (filteredReferences.length === 0) {
    return null
  }

  return (
    <section id="references" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
          <UserCircle weight="duotone" className="text-primary" size={36} />
          References
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Professional references available for verification. Contact details are provided upon request for legitimate professional inquiries.
        </p>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground italic">
            Note: Contact information is hidden by default to respect privacy. Click "Show Contact" to reveal details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredReferences.map((reference, index) => (
          <ReferenceCard 
            key={index} 
            reference={reference} 
            onOpenMedia={mediaModal.openModal}
          />
        ))}
      </div>

      <MediaModal
        url={mediaModal.currentUrl}
        alt={mediaModal.currentAlt}
        isOpen={mediaModal.isOpen}
        onClose={mediaModal.closeModal}
        mediaList={mediaModal.mediaList}
        currentIndex={mediaModal.currentIndex}
        onNavigate={mediaModal.navigateToIndex}
      />
    </section>
  )
}
