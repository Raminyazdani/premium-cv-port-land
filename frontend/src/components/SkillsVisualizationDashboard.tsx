/**
 * Skills Visualization Dashboard
 * 
 * Interactive visualization of skills with radar charts, bar charts,
 * and bubble charts. Respects prefers-reduced-motion.
 */

import { useState, useMemo, useEffect } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartLine, ChartBar, ChartScatter, Eye } from '@phosphor-icons/react'
import { useCV } from '@/context/CVDataContext'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import type { Skills } from '@/types/cv'

// Chart type options
type ChartType = 'radar' | 'bar' | 'bubble'

// Color palette for charts
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1, 220 90% 56%))',
  'hsl(var(--chart-2, 160 60% 45%))',
  'hsl(var(--chart-3, 30 80% 55%))',
  'hsl(var(--chart-4, 280 65% 60%))',
  'hsl(var(--chart-5, 340 75% 55%))'
]

// Translations
const chartTranslations = {
  en: {
    title: 'Skills Visualization',
    description: 'Interactive view of skills across different domains',
    radar: 'Radar Chart',
    bar: 'Bar Chart',
    bubble: 'Bubble Chart',
    category: 'Category',
    skills: 'Skills',
    skillCount: 'Skill Count',
    viewDetails: 'View Details',
    totalSkills: 'Total Skills',
    categories: 'Categories',
    clickToFilter: 'Click to filter'
  },
  de: {
    title: 'Fähigkeiten-Visualisierung',
    description: 'Interaktive Ansicht der Fähigkeiten in verschiedenen Bereichen',
    radar: 'Radardiagramm',
    bar: 'Balkendiagramm',
    bubble: 'Blasendiagramm',
    category: 'Kategorie',
    skills: 'Fähigkeiten',
    skillCount: 'Anzahl der Fähigkeiten',
    viewDetails: 'Details anzeigen',
    totalSkills: 'Gesamtzahl der Fähigkeiten',
    categories: 'Kategorien',
    clickToFilter: 'Klicken zum Filtern'
  },
  fa: {
    title: 'تجسم مهارت‌ها',
    description: 'نمای تعاملی مهارت‌ها در حوزه‌های مختلف',
    radar: 'نمودار راداری',
    bar: 'نمودار میله‌ای',
    bubble: 'نمودار حبابی',
    category: 'دسته',
    skills: 'مهارت‌ها',
    skillCount: 'تعداد مهارت',
    viewDetails: 'مشاهده جزئیات',
    totalSkills: 'مجموع مهارت‌ها',
    categories: 'دسته‌ها',
    clickToFilter: 'برای فیلتر کلیک کنید'
  }
}

interface SkillCategoryData {
  category: string
  count: number
  fullMark: number
  subcategories: { name: string; count: number }[]
}

interface BubbleData {
  x: number
  y: number
  z: number
  name: string
  category: string
}

export function SkillsVisualizationDashboard() {
  const data = useCV()
  const skills = (data.skills as Skills) ?? {}
  const { language, isRTL } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()
  const [chartType, setChartType] = useState<ChartType>('radar')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  const t = chartTranslations[language] || chartTranslations.en

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Transform skills data for charts
  const chartData = useMemo((): SkillCategoryData[] => {
    return Object.entries(skills).map(([category, subcategories]) => {
      const subcatData: { name: string; count: number }[] = []
      let totalCount = 0
      
      if (typeof subcategories === 'object' && subcategories !== null) {
        Object.entries(subcategories).forEach(([name, skillList]) => {
          if (Array.isArray(skillList)) {
            const count = skillList.length
            totalCount += count
            subcatData.push({ name, count })
          }
        })
      }
      
      return {
        category,
        count: totalCount,
        fullMark: 50, // Max for radar chart
        subcategories: subcatData
      }
    }).filter(d => d.count > 0)
  }, [skills])

  // Bubble chart data
  const bubbleData = useMemo((): BubbleData[] => {
    const data: BubbleData[] = []
    let xIndex = 0
    
    chartData.forEach((cat, catIndex) => {
      cat.subcategories.forEach((subcat, subIndex) => {
        data.push({
          x: xIndex + subIndex * 10,
          y: catIndex * 100 + Math.random() * 50,
          z: subcat.count * 100,
          name: subcat.name,
          category: cat.category
        })
      })
      xIndex += 100
    })
    
    return data
  }, [chartData])

  // Total skills count
  const totalSkills = useMemo(() => {
    return chartData.reduce((sum, cat) => sum + cat.count, 0)
  }, [chartData])

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => prev === category ? null : category)
  }

  if (!skills || Object.keys(skills).length === 0) {
    return null
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="skills-visualization"
      className={`w-full py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-b from-muted/30 to-background transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${prefersReducedMotion ? '' : 'transition-all'}`}
      style={prefersReducedMotion ? { transition: 'none' } : undefined}
    >
      <div className="max-w-7xl mx-auto">
        <Card className="border-primary/10">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <ChartLine className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  {t.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {t.description}
                </CardDescription>
              </div>
              
              {/* Stats badges */}
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  {t.totalSkills}: {totalSkills}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {t.categories}: {chartData.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
              <TabsList className="mb-6">
                <TabsTrigger value="radar" className="gap-2">
                  <ChartLine className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.radar}</span>
                </TabsTrigger>
                <TabsTrigger value="bar" className="gap-2">
                  <ChartBar className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.bar}</span>
                </TabsTrigger>
                <TabsTrigger value="bubble" className="gap-2">
                  <ChartScatter className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.bubble}</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Radar Chart */}
              <TabsContent value="radar" className="mt-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        className="text-xs"
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 'auto']}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      />
                      <Radar
                        name={t.skills}
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.5}
                        animationDuration={prefersReducedMotion ? 0 : 500}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as SkillCategoryData
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold text-sm">{data.category}</p>
                                <p className="text-muted-foreground text-sm">
                                  {t.skillCount}: {data.count}
                                </p>
                                <div className="mt-2 text-xs text-muted-foreground">
                                  {data.subcategories.slice(0, 3).map((sub, i) => (
                                    <div key={i}>{sub.name}: {sub.count}</div>
                                  ))}
                                  {data.subcategories.length > 3 && (
                                    <div>+{data.subcategories.length - 3} more</div>
                                  )}
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              {/* Bar Chart */}
              <TabsContent value="bar" className="mt-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis 
                        type="category" 
                        dataKey="category" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as SkillCategoryData
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold text-sm">{data.category}</p>
                                <p className="text-muted-foreground text-sm">
                                  {t.skillCount}: {data.count}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        animationDuration={prefersReducedMotion ? 0 : 500}
                        onClick={(data) => handleCategoryClick(data.category)}
                        className="cursor-pointer"
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={selectedCategory === entry.category 
                              ? 'hsl(var(--primary))'
                              : COLORS[index % COLORS.length]
                            }
                            opacity={selectedCategory && selectedCategory !== entry.category ? 0.4 : 1}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              {/* Bubble Chart */}
              <TabsContent value="bubble" className="mt-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="position" 
                        tick={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="position" 
                        tick={false}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} name="count" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as BubbleData
                            return (
                              <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold text-sm">{data.name}</p>
                                <p className="text-muted-foreground text-xs">{data.category}</p>
                                <p className="text-primary text-sm mt-1">
                                  {Math.round(data.z / 100)} {t.skills}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter 
                        data={bubbleData} 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        animationDuration={prefersReducedMotion ? 0 : 500}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Bubble size represents number of skills in each subcategory
                </p>
              </TabsContent>
            </Tabs>
            
            {/* Category Legend */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">{t.clickToFilter}:</p>
              <div className="flex flex-wrap gap-2">
                {chartData.map((cat, index) => (
                  <Button
                    key={cat.category}
                    variant={selectedCategory === cat.category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryClick(cat.category)}
                    className="gap-1"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {cat.category}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {cat.count}
                    </Badge>
                  </Button>
                ))}
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className="text-muted-foreground"
                  >
                    Clear filter
                  </Button>
                )}
              </div>
            </div>
            
            {/* Selected Category Details */}
            {selectedCategory && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {selectedCategory}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {chartData
                    .find(c => c.category === selectedCategory)
                    ?.subcategories.map((sub, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-2 bg-background rounded border"
                      >
                        <span className="text-sm">{sub.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {sub.count}
                        </Badge>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
