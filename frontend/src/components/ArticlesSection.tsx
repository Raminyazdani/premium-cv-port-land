/**
 * Articles Section Component
 * 
 * Displays blog posts and articles in a grid layout
 * with support for internal and external articles
 */

import { useState, useMemo, useCallback } from 'react'
import { marked } from 'marked'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowSquareOut, 
  Clock, 
  Star, 
  Eye,
  Calendar
} from '@phosphor-icons/react'
import { useCVData } from '@/context/CVDataContext'
import { useTranslation, useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import type { Article } from '@/types/cv'

interface ArticleCardProps {
  article: Article
  onClick: () => void
  t: ReturnType<typeof useTranslation>
  isRTL: boolean
}

function ArticleCard({ article, onClick, t, isRTL }: ArticleCardProps) {
  const formattedDate = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null

  return (
    <Card 
      className={cn(
        "group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        article.featured && "ring-2 ring-primary/30"
      )}
      onClick={onClick}
    >
      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {article.featured && (
            <Badge 
              className="absolute top-3 right-3 bg-primary text-primary-foreground gap-1"
            >
              <Star size={12} weight="fill" />
              {t.articles?.featured || 'Featured'}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="space-y-2">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
          {article.external && (
            <ArrowSquareOut 
              size={16} 
              className={cn("inline-block ml-2 opacity-50", isRTL && "ml-0 mr-2")} 
            />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {article.summary && (
          <CardDescription className="line-clamp-3">
            {article.summary}
          </CardDescription>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formattedDate}
            </span>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime} min
            </span>
          )}
        </div>
        {typeof article.views === 'number' && (
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {article.views.toLocaleString()}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

interface ArticleModalProps {
  article: Article | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ArticleModal({ article, open, onOpenChange }: ArticleModalProps) {
  if (!article) return null

  const htmlContent = article.content ? marked(article.content) : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {article.tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <DialogTitle className="text-xl sm:text-2xl">{article.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            {article.publishDate && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(article.publishDate).toLocaleDateString()}
              </span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} min read
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {article.coverImage && (
          <div className="relative h-48 sm:h-64 -mx-6 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div 
            className="prose prose-sm dark:prose-invert max-w-none py-4"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function ArticlesSection() {
  const { data } = useCVData()
  const t = useTranslation()
  const { isRTL } = useLanguage()
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const articlesData = useMemo(() => data?.articles || [], [data?.articles])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    articlesData.forEach(article => {
      article.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [articlesData])

  // Filter articles by tag
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articlesData
    return articlesData.filter(article => 
      article.tags?.includes(selectedTag)
    )
  }, [articlesData, selectedTag])

  // Sort articles: featured first, then by date
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      
      const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0
      const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0
      return dateB - dateA
    })
  }, [filteredArticles])

  const handleArticleClick = useCallback((article: Article) => {
    if (article.external && article.externalURL) {
      window.open(article.externalURL, '_blank', 'noopener,noreferrer')
    } else {
      setSelectedArticle(article)
      setModalOpen(true)
    }
  }, [])

  if (articlesData.length === 0) {
    return null
  }

  return (
    <section id="articles" className="py-12 sm:py-16 lg:py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
          isRTL && "sm:flex-row-reverse"
        )}>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            {t.articles?.title || 'Articles & Blog'}
          </h2>
          
          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                {t.articles?.all_tags || 'All'}
              </Button>
              {allTags.slice(0, 5).map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article, index) => (
              <ArticleCard
                key={article.slug || index}
                article={article}
                onClick={() => handleArticleClick(article)}
                t={t}
                isRTL={isRTL}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t.articles?.no_articles || 'No articles available'}
          </div>
        )}

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </section>
  )
}
