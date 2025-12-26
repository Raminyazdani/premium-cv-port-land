import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Translate,
  Certificate,
  CaretDown,
  CaretUp,
  DownloadSimple,
} from '@phosphor-icons/react'
import { getCVData } from '@/lib/cv-data'
import type { Language, LanguageCertification } from '@/types/cv'

function getProficiencyLevel(level?: string | null, cefr?: string | null): number {
  if (cefr) {
    const cefrLevels: Record<string, number> = {
      'A1': 20,
      'A2': 35,
      'B1': 50,
      'B2': 65,
      'C1': 80,
      'C2': 95,
    }
    return cefrLevels[cefr.toUpperCase()] ?? 50
  }
  
  if (level) {
    const levelMap: Record<string, number> = {
      'native': 100,
      'mother tongue': 100,
      'fluent': 85,
      'professional': 75,
      'advanced': 75,
      'intermediate': 55,
      'beginner': 30,
      'elementary': 20,
      'studying': 20,
    }
    return levelMap[level.toLowerCase()] ?? 50
  }
  
  return 50
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

interface CertificationDetailsProps {
  certification: LanguageCertification
  language: string
}

function CertificationDetails({ certification, language }: CertificationDetailsProps) {
  const hasScores = certification.overall !== null || 
    certification.reading !== null || 
    certification.listening !== null || 
    certification.writing !== null || 
    certification.speaking !== null
  
  const hasValidTest = certification.test && certification.test !== 'Mother Tongue'
  
  if (!hasValidTest) return null
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Certificate size={16} weight="duotone" />
          {certification.test}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Certificate size={24} weight="duotone" className="text-primary" />
            {certification.test} - {language}
          </DialogTitle>
          <DialogDescription>
            {certification.organization && `Issued by ${certification.organization}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {hasScores && (
            <div className="space-y-4">
              {certification.overall !== null && certification.overall !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-primary">
                      {certification.overall}
                      {certification.maxScore && ` / ${certification.maxScore}`}
                    </span>
                  </div>
                  {certification.maxScore && certification.overall !== null && certification.overall !== undefined && (
                    <Progress 
                      value={(certification.overall / certification.maxScore) * 100} 
                      className="h-2"
                    />
                  )}
                </div>
              )}
              
              {(certification.reading !== null || 
                certification.listening !== null || 
                certification.writing !== null || 
                certification.speaking !== null) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Component Scores
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {certification.reading !== null && certification.reading !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Reading</span>
                          <span className="font-semibold">{certification.reading}</span>
                        </div>
                        {certification.maxScore && certification.reading !== null && certification.reading !== undefined && (
                          <Progress 
                            value={(certification.reading / certification.maxScore) * 100} 
                            className="h-1.5"
                          />
                        )}
                      </div>
                    )}
                    
                    {certification.listening !== null && certification.listening !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Listening</span>
                          <span className="font-semibold">{certification.listening}</span>
                        </div>
                        {certification.maxScore && certification.listening !== null && certification.listening !== undefined && (
                          <Progress 
                            value={(certification.listening / certification.maxScore) * 100} 
                            className="h-1.5"
                          />
                        )}
                      </div>
                    )}
                    
                    {certification.writing !== null && certification.writing !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Writing</span>
                          <span className="font-semibold">{certification.writing}</span>
                        </div>
                        {certification.maxScore && certification.writing !== null && certification.writing !== undefined && (
                          <Progress 
                            value={(certification.writing / certification.maxScore) * 100} 
                            className="h-1.5"
                          />
                        )}
                      </div>
                    )}
                    
                    {certification.speaking !== null && certification.speaking !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Speaking</span>
                          <span className="font-semibold">{certification.speaking}</span>
                        </div>
                        {certification.maxScore && certification.speaking !== null && certification.speaking !== undefined && (
                          <Progress 
                            value={(certification.speaking / certification.maxScore) * 100} 
                            className="h-1.5"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {certification.examDate && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Exam Date:</span> {formatDate(certification.examDate)}
            </div>
          )}
          
          {certification.URL && (
            <Button asChild className="w-full gap-2">
              <a 
                href={certification.URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <DownloadSimple size={18} weight="bold" />
                View Certificate
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface LanguageCardProps {
  language: Language
}

function LanguageCard({ language }: LanguageCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  const proficiencyPercent = getProficiencyLevel(
    language.proficiency?.level,
    language.proficiency?.CEFR
  )
  
  const validCertifications = language.certifications?.filter(cert => 
    cert.test && cert.test !== 'Mother Tongue'
  ) ?? []
  
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-2xl mb-2">
              {language.language ?? 'Unknown Language'}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {language.proficiency?.level && (
                <Badge variant="default" className="font-semibold">
                  {language.proficiency.level}
                </Badge>
              )}
              
              {language.proficiency?.CEFR && (
                <Badge variant="secondary">
                  {language.proficiency.CEFR}
                </Badge>
              )}
              
              {language.proficiency?.status && (
                <Badge variant="outline" className="text-muted-foreground">
                  {language.proficiency.status}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Proficiency</span>
                <span className="font-medium">{proficiencyPercent}%</span>
              </div>
              <Progress value={proficiencyPercent} className="h-2" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      {validCertifications.length > 0 && (
        <CardContent className="pt-0 space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Certificate size={16} weight="duotone" />
              {validCertifications.length} Certification{validCertifications.length > 1 ? 's' : ''}
            </span>
            {showDetails ? (
              <CaretUp size={16} weight="bold" />
            ) : (
              <CaretDown size={16} weight="bold" />
            )}
          </Button>
          
          {showDetails && (
            <div className="flex flex-wrap gap-2 pt-2">
              {validCertifications.map((cert, idx) => (
                <CertificationDetails
                  key={idx}
                  certification={cert}
                  language={language.language ?? 'Unknown'}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export function LanguagesSection() {
  const cvData = getCVData()
  const languages = cvData.languages ?? []
  
  if (languages.length === 0) {
    return (
      <section className="py-16 bg-muted/30" aria-labelledby="languages-heading">
        <div className="container max-w-6xl px-4">
          <div className="text-center">
            <Translate size={48} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
            <h2 id="languages-heading" className="text-3xl font-bold mb-2">
              Languages
            </h2>
            <p className="text-muted-foreground">No language proficiency information available</p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-16 bg-muted/30" aria-labelledby="languages-heading">
      <div className="container max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Translate size={32} weight="duotone" className="text-primary" />
          </div>
          <h2 id="languages-heading" className="text-4xl font-bold mb-3">
            Languages
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Communication skills across multiple languages
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, idx) => (
            <LanguageCard key={idx} language={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
