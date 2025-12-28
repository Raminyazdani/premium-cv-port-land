# Architecture & Design System Notes

## Current Structure Overview

```
frontend/src/
├── components/
│   ├── sections/              # Page section components
│   │   ├── HeroSection.tsx
│   │   ├── BasicsSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ExperiencesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── PublicationsSection.tsx
│   │   ├── LanguagesSection.tsx
│   │   ├── WorkshopAndCertificationsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── SkillsVisualizationDashboard.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── ArticlesSection.tsx
│   │   ├── ReferencesSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ProfilesSection.tsx
│   │   ├── EnhancedUIDemo.tsx    # ⚠️ REMOVE - Demo content
│   │   └── Footer.tsx
│   ├── ui/                    # Primitive UI components (shadcn/ui)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   └── tabs.tsx
│   ├── LanguageCarousel.tsx   # 3D language selector (used in EnhancedUIDemo)
│   ├── Timeline.tsx           # Animated timeline (used in EnhancedUIDemo)
│   ├── Header.tsx             # Main navigation header
│   └── ...
├── context/
│   ├── CVDataContext.tsx      # CV data provider
│   ├── LanguageContext.tsx    # Language/i18n state
│   ├── ThemeContext.tsx       # Theme provider
│   └── FilterContext.tsx      # Content filter state
├── hooks/
│   ├── use-parallax.ts
│   ├── use-scroll-animation.ts
│   ├── use-media-modal.ts
│   └── ...
├── lib/
│   ├── cv-data.ts             # CV data extraction helpers
│   ├── i18n.ts                # UI string translations
│   └── utils.ts               # Utility functions
├── utils/
│   ├── dataLoader.ts          # Data loading logic
│   ├── dataNormalizer.ts      # Multi-language data normalization
│   ├── dataValidator.ts       # Data validation
│   └── imageOptimizer.ts      # Cloudinary image optimization
├── types/
│   └── cv.ts                  # TypeScript types for CV data
└── data/
    ├── cv.json                # English CV data (LOCKED)
    ├── ramin_de.json          # German CV data (LOCKED)
    └── ramin_fa.json          # Persian CV data (LOCKED)
```

## Component Inventory

### Primitive Components (ui/)
| Component | Source | Status |
|-----------|--------|--------|
| Avatar | Radix UI | ✅ Good |
| Badge | Custom | ✅ Good |
| Button | Radix UI | ✅ Good |
| Card | Custom | ✅ Good |
| Checkbox | Radix UI | ✅ Good |
| Dialog | Radix UI | ✅ Good |
| DropdownMenu | Radix UI | ✅ Good |
| Input | Custom | ✅ Good |
| Label | Radix UI | ⚠️ Sourcemap warning |
| Popover | Radix UI | ⚠️ Sourcemap warning |
| ScrollArea | Radix UI | ⚠️ Sourcemap warning |
| Separator | Radix UI | ⚠️ Sourcemap warning |
| Slider | Radix UI | ⚠️ Sourcemap warning |
| Switch | Radix UI | ⚠️ Sourcemap warning |
| Tabs | Radix UI | ⚠️ Sourcemap warning |

### Section Components
| Component | Bundle Size | Data Source | Translation |
|-----------|-------------|-------------|-------------|
| HeroSection | In main | CVDataContext | ✅ Yes |
| BasicsSection | 10KB | CVDataContext | ✅ Yes |
| ProfilesSection | 14KB | CVDataContext | ✅ Yes |
| EducationSection | 119KB | CVDataContext | ✅ Yes |
| ExperiencesSection | 10KB | CVDataContext | ✅ Yes |
| ProjectsSection | 10KB | CVDataContext | ✅ Yes |
| PublicationsSection | 14KB | CVDataContext | ✅ Yes |
| LanguagesSection | 14KB | CVDataContext | ✅ Yes |
| WorkshopAndCertificationsSection | 25KB | CVDataContext | ✅ Yes |
| SkillsSection | 15KB | CVDataContext | ✅ Yes |
| SkillsVisualizationDashboard | 436KB ⚠️ | CVDataContext | ⚠️ Partial |
| TestimonialsSection | 14KB | Hardcoded ⚠️ | ❌ No |
| ArticlesSection | 58KB | CVDataContext | ✅ Yes |
| ReferencesSection | 7KB | CVDataContext | ✅ Yes |
| ContactSection | 15KB | CVDataContext | ✅ Yes |
| EnhancedUIDemo | In main | Hardcoded ⚠️ | ❌ No |
| Footer | 2KB | CVDataContext | ⚠️ Bug |

## Duplication Hotspots

### 1. Section Headers
Each section has its own heading pattern with icon + title + description.

**Current Pattern:**
```tsx
<div className="flex items-center gap-2">
  <Icon />
  <h2>Section Title</h2>
</div>
<p>Section description</p>
```

**Recommendation:** Create `SectionHeader` component:
```tsx
<SectionHeader 
  icon={GraduationCap}
  title={t.sections.education}
  description={t.descriptions.education}
/>
```

### 2. Filter Pills
Education, Projects, and Certifications all have similar filter button groups.

**Recommendation:** Create `FilterPills` component:
```tsx
<FilterPills 
  filters={['All', 'Academic', 'Programming']}
  active={activeFilter}
  onChange={setActiveFilter}
/>
```

### 3. Card Layouts
Education, Experience, Projects all use similar card patterns.

**Recommendation:** Create `CVCard` component with variants:
```tsx
<CVCard variant="education" item={educationItem} />
<CVCard variant="experience" item={experienceItem} />
```

### 4. Timeline Display
Experience section has its own timeline, while EnhancedUIDemo has a separate Timeline component.

**Recommendation:** Consolidate timeline components.

## State Management

### Current Pattern
- **CVDataContext**: Holds all CV data
- **LanguageContext**: Manages language state
- **ThemeContext**: Manages theme (light/dark)
- **FilterContext**: Manages content filters

### Assessment
✅ Context API is appropriate for this application size.
❌ No need for external state management (Redux, Zustand).

## Recommended Refactors

### Priority: High
1. **Remove EnhancedUIDemo section** - Irrelevant demo content
2. **Fix Footer data binding** - "Unknown" bug
3. **Create SectionHeader component** - Reduce duplication

### Priority: Medium
4. **Create FilterPills component** - Reuse filter pattern
5. **Lazy load SkillsVisualizationDashboard** - 436KB chunk
6. **Fix deprecated API calls** - getCVData(), getBasics()
7. **Remove or translate TestimonialsSection** - Placeholder content

### Priority: Low
8. **Create CVCard component** - Standardize card layouts
9. **Implement design tokens** - Consistent spacing/colors
10. **Self-host Google Fonts** - Avoid external dependency

## Technology Recommendations

### Current Stack (Keep)
- ✅ Vite 7.x - Fast build tool
- ✅ React 19 - Latest React
- ✅ TypeScript 5.7 - Type safety
- ✅ Tailwind CSS 4 - Utility CSS
- ✅ Radix UI - Accessible primitives
- ✅ Framer Motion 12 - Animations

### Potential Additions (Not Required)
- ❌ React Router - Not needed (SPA with single route)
- ❌ Redux/Zustand - Not needed (Context sufficient)
- ❌ UI Kit (MUI/Chakra) - Not needed (already using shadcn/ui pattern)

### Bundle Optimization
Current main bundle: 818KB (gzip: 225KB)

**Recommendations:**
1. Lazy load SkillsVisualizationDashboard (uses Recharts)
2. Lazy load EducationSection (119KB)
3. Lazy load ArticlesSection (58KB)
4. Consider alternative to @phosphor-icons (1514 icons loaded)

## File Dependencies

### EnhancedUIDemo Dependencies (to remove)
- `frontend/src/components/sections/EnhancedUIDemo.tsx`
- `frontend/src/components/LanguageCarousel.tsx` (can keep if used elsewhere)
- `frontend/src/components/Timeline.tsx` (can repurpose for Experience)

### Locked Files (DO NOT MODIFY)
- `frontend/src/data/cv.json`
- `frontend/src/data/ramin_de.json`
- `frontend/src/data/ramin_fa.json`
