/**
 * Enhanced UI Features Demo Section
 * Showcases the new premium UI components
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LanguageCarousel } from '@/components/LanguageCarousel'
import { Timeline, type TimelineEntry } from '@/components/Timeline'
import { Sparkle } from '@phosphor-icons/react'

const demoTimelineEntries: TimelineEntry[] = [
  {
    id: '1',
    title: '3D Language Carousel',
    subtitle: 'Interactive language selector with 3D transforms',
    date: '2024',
    description: 'Smooth transitions, keyboard navigation, and touch support',
  },
  {
    id: '2',
    title: 'Premium Button Effects',
    subtitle: 'Enhanced interactive elements',
    date: '2024',
    description: 'Hover animations, ripple effects, and magnetic cursor following',
  },
  {
    id: '3',
    title: 'Parallax Scrolling',
    subtitle: 'Depth-based scroll effects',
    date: '2024',
    description: 'Smooth parallax backgrounds with performance optimization',
  },
  {
    id: '4',
    title: 'Skills Carousel',
    subtitle: 'Interactive skill category slider',
    date: '2024',
    description: 'Responsive carousel with swipe gestures and keyboard navigation',
  },
  {
    id: '5',
    title: 'Timeline Visualization',
    subtitle: 'Scroll-based progress animation',
    date: '2024',
    description: 'Animated timeline with staggered entry animations',
  },
]

export function EnhancedUIDemo() {
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkle size={20} weight="fill" className="text-primary" />
            <span className="text-sm font-medium text-primary">Enhanced UI Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Premium Interactive Components</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the new interactive UI features with smooth animations, 
            keyboard navigation, and accessibility support.
          </p>
        </div>

        <Separator />

        {/* 3D Language Carousel Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              3D Language Carousel
            </CardTitle>
            <CardDescription>
              Click a card to select a language. Use arrow keys to navigate and Enter to confirm.
              Swipe left/right on mobile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageCarousel />
          </CardContent>
        </Card>

        {/* Timeline Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              Animated Timeline
            </CardTitle>
            <CardDescription>
              Scroll down to see the timeline animate. Progress indicator fills as you scroll.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Timeline entries={demoTimelineEntries} />
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Parallax Scrolling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hero section now features smooth parallax background scrolling 
                (disabled on mobile for performance).
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">🎨 Interactive Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All buttons now have premium hover effects including scale, 
                shadow elevation, and ripple animations.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">♿ Accessibility First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All animations respect prefers-reduced-motion and include 
                full keyboard navigation support.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">📱 Touch Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Swipe gestures work seamlessly on mobile devices for 
                carousel navigation and interactions.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">⚡ Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Uses Intersection Observer and requestAnimationFrame 
                for smooth, jank-free animations.
              </p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardHeader>
              <CardTitle className="text-lg">🎪 Skills Carousel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Skills section now includes a carousel view option 
                with responsive card layouts (1/2/3 cards).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Note about implementation */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Note:</strong> These features are fully integrated throughout the site. 
              Check the hero section for parallax, skills section for carousel view, 
              and all buttons for interactive effects.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
