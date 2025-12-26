# Skills Section - Design Specification & Implementation

## Information Architecture

The Skills section presents a comprehensive, highly navigable interface for showcasing technical expertise across multiple domains:

### Hierarchy
1. **Top-Level Categories** (e.g., "Programming & Scripting", "Bioinformatics Domains")
2. **Mid-Level Categories** (e.g., "Machine Learning & Data Science")
3. **Skill Groups** (e.g., "Programming Languages")
4. **Individual Skills** (Chips with short names)

### Display Order
- Categories displayed alphabetically or as defined in JSON
- Skills within each group displayed as interactive chips
- Search results maintain hierarchical grouping

## Components

### 1. Search & Filter Bar (Card)
- **Global Search Input**
  - Icon: MagnifyingGlass (left)
  - Placeholder: "Search skills (e.g., Python, React, BLAST...)"
  - Clear button (X icon) appears when text is entered
  - Debounced search (instant feedback)
  - Matches: `long_name` OR `short_name` (case-insensitive)

- **Domain Filter Buttons**
  - Horizontal scrollable row of top-level category buttons
  - Single selection mode (toggle on/off)
  - Active state: `variant="default"`, Inactive: `variant="outline"`

- **Category Filter Badges**
  - Derived from all `type_key` values (excluding "Full CV")
  - Multi-select toggles
  - Active state: `variant="default"`, Inactive: `variant="outline"`
  - Only shows unique values

- **Clear All Button**
  - Only visible when any filter/search is active
  - Resets: search query, domain filter, category filters

- **Results Counter**
  - "X skills found" text with Info icon
  - Updates dynamically with filtering

### 2. Skills Display Grid
- **Top Category Headers**
  - H3 with Code icon
  - Separated by horizontal separators

- **Mid-Level Category Headers**
  - H4 in muted color
  - Groups subcategory cards

- **Subcategory Cards**
  - Card with hover shadow effect
  - Header: Subcategory name with Code icon
  - Content: Flex-wrapped skill chips
  - Responsive: Full width on mobile, grid on desktop

### 3. Skill Chips (Interactive Buttons)
- **Appearance**
  - Button variant: outline
  - Displays: `short_name`
  - Hover effect: accent background
  - Size: Small, auto height

- **Interaction**
  - Click opens Sheet (slide-in panel from right)
  - Keyboard accessible

### 4. Skill Detail Sheet (Modal)
- **Sheet Header**
  - Title: `long_name` (large, bold)
  - Description: "Skill details and categories"

- **Content Sections**
  - **Short Name**: Display field with Tag icon
  - **Categories**: Badge list of `type_key` values (excluding "Full CV")
  - Secondary variant badges

- **Behavior**
  - Slide-in from right
  - Overlay backdrop
  - Close: X button, ESC key, or outside click
  - Max width: `sm:max-w-lg`

### 5. Empty States
- **No Skills Data**
  - Large Code icon (duotone)
  - Heading: "No skills data available"
  - Subtext: "Add skills to your CV data to display them here."

- **No Search Results**
  - MagnifyingGlass icon (duotone)
  - Heading: "No skills match your filters"
  - Subtext: "Try adjusting your search or filters"
  - "Clear Filters" button

## Responsive Behavior

### Mobile (<768px)
- Search bar: Full width, stacked
- Domain filters: Horizontal scroll
- Category badges: Wrap to multiple rows
- Subcategory cards: Single column
- Skill chips: Wrap naturally
- Sheet: Full width

### Tablet (768px - 1024px)
- Search and filters: 2-column when appropriate
- Cards: Single column, wider
- Skill chips: More per row

### Desktop (>1024px)
- Max width: 7xl container
- Search bar: Inline with Clear All button
- Filter sections: Expand horizontally
- Multiple subcategory cards can appear side-by-side (if designed for grid)

## Accessibility Checklist

✅ **Semantic HTML**
- Section element with descriptive heading
- Proper heading hierarchy (H2 → H3 → H4)

✅ **Keyboard Navigation**
- All interactive elements focusable via Tab
- Sheet can be closed with ESC
- Buttons and badges have visible focus states

✅ **Screen Reader Support**
- `aria-label` on icon-only buttons
- Sheet has proper ARIA attributes (handled by Radix UI)
- Search input has placeholder and label

✅ **Color Contrast**
- Text meets WCAG AA (4.5:1 for normal text)
- Badges use theme colors with sufficient contrast
- Focus indicators clearly visible

✅ **Interactive Feedback**
- Hover states on all clickable elements
- Active/selected states clearly differentiated
- Loading/transition states smooth

## Edge Cases & Handling

### Missing or Malformed Data
- **No skills object**: Show empty state
- **Empty category**: Skip rendering
- **Empty subcategory**: Skip rendering
- **Null `type_key`**: Treat as empty array
- **Missing `short_name` or `long_name`**: Use fallback "Unnamed Skill"

### Search & Filter Edge Cases
- **Empty search + no filters**: Show all skills
- **Search with no results**: Show "No results" state
- **All skills filtered out**: Show "No results" state
- **Rapid typing in search**: Handle gracefully (useMemo optimizes)

### Performance Considerations
- **Large skill lists**: Memoized filtering prevents re-renders
- **Many categories**: Virtual scrolling not needed (reasonable count expected)
- **Filter combinations**: Efficient AND/OR logic

## Privacy Considerations

- **No sensitive data**: Skills are public professional information
- **No personal tracking**: All filtering happens client-side
- **No external calls**: Data loaded from local JSON

## Type Safety & Data Validation

### TypeScript Interfaces
```typescript
interface SkillItem {
  long_name: string
  short_name: string
  type_key: string[]
}

interface SkillSubcategory {
  [subcategoryName: string]: SkillItem[]
}

interface SkillCategory {
  [categoryName: string]: SkillSubcategory
}

interface Skills {
  [topCategoryName: string]: SkillCategory
}
```

### Runtime Checks
- Array checks before `.map()`
- Null/undefined checks for optional fields
- Graceful fallbacks for missing data

## SEO Optimization

### Semantic HTML
- Clear heading structure for crawlers
- Descriptive section headings
- Proper use of semantic elements

### Meta Information
- Skills are indexable via heading text
- Clear content hierarchy

### Structured Data (Optional Future Enhancement)
- Could use `schema.org/Person` → `hasSkill` or `knowsAbout`
- JSON-LD with skill names and categories

## Performance Metrics

### Expected Performance
- **Initial Render**: <100ms (memoized calculations)
- **Search/Filter Update**: <50ms (optimized useMemo)
- **Sheet Open**: <200ms (smooth animation)

### Optimization Strategies
- `useMemo` for expensive filtering operations
- `useState` for controlled search input
- Component-level memoization for skill chips (if needed)

## JSON Output Schema

The skills data structure in `cv.json`:

```json
{
  "skills": {
    "TopLevelCategory1": {
      "MidLevelCategory1": {
        "SkillGroup1": [
          {
            "long_name": "Full skill name",
            "short_name": "Short name",
            "type_key": ["Full CV", "Programming", "Academic"]
          }
        ]
      }
    }
  }
}
```

### Validation Rules
1. ✅ All `long_name` values preserved exactly as input
2. ✅ All `short_name` values preserved exactly as input
3. ✅ All `type_key` arrays preserved (no merging/deduplication)
4. ✅ Category structure maintained exactly as nested in input
5. ✅ No invented or inferred skills
6. ✅ Empty arrays/objects allowed (handled gracefully)

## Implementation Status

### ✅ Completed
- TypeScript interfaces defined
- Skills data added to cv.json
- SkillsSection component created
- Search functionality implemented
- Multi-level filtering (domain + category)
- Skill detail sheet
- Empty states
- Responsive design
- Accessibility features
- Component integrated into App.tsx

### 🎯 Testing Checklist
1. ✅ Skills render with correct hierarchy
2. ✅ Search filters skills correctly
3. ✅ Domain filters work (single selection)
4. ✅ Category filters work (multi-selection)
5. ✅ Filters can be cleared
6. ✅ Skill sheets open with correct data
7. ✅ Empty states display properly
8. ✅ Responsive on mobile/tablet/desktop
9. ✅ Keyboard navigation works
10. ✅ No console errors or warnings

## Design Philosophy

### Visual Identity
- **Modern & Clean**: Minimalist card-based layout
- **Hierarchy**: Clear visual distinction between category levels
- **Interactive**: Hover effects and smooth transitions
- **Informative**: Rich detail views via sheets
- **Scannable**: Chip-based skill display for quick recognition

### Color Usage
- Primary: Category headers and icons
- Accent: Active filters and hover states
- Muted: Secondary text and subtle backgrounds
- Theme-aware: Works in light and dark modes

### Typography
- H2: Section title (4xl-5xl, gradient)
- H3: Top category (2xl-3xl, bold)
- H4: Mid category (lg, semibold, muted)
- Body: Cards and chips (base, medium)

## Future Enhancements (Out of Scope)

1. **Skill Proficiency Levels**: Add visual indicators (beginner/expert)
2. **Related Projects**: Link skills to project entries
3. **Skill Timeline**: When each skill was acquired
4. **Export Filtered View**: Download filtered skill set as PDF/JSON
5. **Skill Endorsements**: External validation (if applicable)
6. **Interactive Visualization**: Graph/chart view of skill relationships
