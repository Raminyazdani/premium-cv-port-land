# Publications Section — Design Specification

## Information Architecture

### Hierarchy
1. **Section Header**
   - BookOpen icon + "Publications" title
   - Descriptive subtitle
   
2. **Controls Layer**
   - Search input (full-width, with clear button)
   - Tab-based filters (8 tabs: All, Published, Submitted, Waiting, Papers, Thesis, Chapters, Reviews)
   
3. **Content Grid**
   - 2-column grid on desktop (md breakpoint)
   - 1-column on mobile
   - Publication cards with hover states

4. **Publication Card Structure**
   - Header: Title (hover:primary) + Type badge + Status badge
   - Authors line with Users icon
   - Venue/Publisher line with BookOpen icon
   - Date line with CalendarBlank icon
   - Optional correspondent/supervisors/ISBN
   - Optional "View Publication" button (external link)

### Content Organization
- Publications are filterable by:
  - **Status**: Published, Submitted, Waiting for Submission
  - **Type**: Research Paper, Master Thesis, Book Chapter, Review Article
- Search filters by: title, authors, type, status, journal, publisher, institution
- Tabs show counts dynamically based on data

## Components

### Primary Components
- **Card** (shadcn): Container for each publication
- **Badge** (shadcn): Type and status indicators with custom colors
- **Button** (shadcn): Search clear button + external link buttons
- **Input** (shadcn): Search field
- **Tabs** (shadcn): Filter navigation
- **Phosphor Icons**: BookOpen, MagnifyingGlass, X, LinkIcon, Users, CalendarBlank, FileText

### Card States
- **Default**: border-border
- **Hover**: border-primary/50, title transitions to primary color
- **Focus**: Visible focus ring on interactive elements

### Status Color Coding
- **Published**: Green (bg-green-100 text-green-800 / dark variants)
- **Submitted**: Blue (bg-blue-100 text-blue-800 / dark variants)
- **Waiting**: Amber (bg-amber-100 text-amber-800 / dark variants)
- **Other**: Muted

### Type Badge Variants
- **Thesis**: default variant
- **Chapter**: secondary variant
- **Review**: outline variant
- **Paper**: default variant

## Responsive Behavior

### Mobile (< 768px)
- Search input: Full width, stacked vertically
- Tabs: 4-column grid, smaller text (text-xs)
- Publication cards: 1 column, full width
- Authors/content: line-clamp-2 to prevent overflow
- Icons: Consistent size (h-4 w-4)

### Tablet (768px - 1024px)
- Tabs: 4-column grid, standard text
- Publication cards: 2-column grid with gap-6
- Search: Flex-row with filters

### Desktop (> 1024px)
- Tabs: 8-column grid showing all options
- Publication cards: 2-column grid
- Max-width container: 7xl (1280px)
- Optimal reading width maintained

## Accessibility Checklist

### Semantic HTML
- ✅ `<section>` with id="publications" for anchor navigation
- ✅ Proper heading hierarchy (h2 for section title)
- ✅ `<nav>` implicit in Tabs component

### Keyboard Navigation
- ✅ Tab order: Search → Clear button → Tab filters → Publication cards → External links
- ✅ All interactive elements keyboard accessible
- ✅ Enter/Space activate buttons
- ✅ Arrow keys navigate tabs

### Screen Readers
- ✅ aria-label on search input: "Search publications"
- ✅ aria-label on clear button: "Clear search"
- ✅ aria-label on external links: "View publication: {title}"
- ✅ Icons paired with text or proper aria labels
- ✅ Tab counts announced with filter labels

### Visual Accessibility
- ✅ Focus visible states on all interactive elements
- ✅ Color not sole indicator (status uses badges with text)
- ✅ Sufficient color contrast (WCAG AA compliant)
- ✅ Text remains readable on all backgrounds
- ✅ Icon sizes meet minimum touch target (44×44px buttons)

### ARIA Attributes
- ✅ Tabs implement proper ARIA roles (automatic via shadcn)
- ✅ Search input has descriptive placeholder
- ✅ External links have rel="noopener noreferrer"

## Edge Cases & Empty States

### No Publications
- Display centered empty state:
  - BookOpen icon (h-12 w-12)
  - "Publications" heading
  - "No publications available." message

### No Filter Results
- Card with centered content:
  - BookOpen icon
  - "No publications match your current filters."
  - Encourages user to adjust filters or search

### Missing Data Handling
- **No title**: Fallback to "Untitled Publication"
- **No authors**: Authors section hidden
- **No venue**: Venue line hidden
- **No date**: Date line hidden
- **No URL/DOI**: Link button hidden
- **No correspondent**: Line hidden
- **No supervisors**: Line hidden
- **No ISBN**: Line hidden

### Long Content
- **Title**: No truncation, wraps naturally with leading-tight
- **Authors**: line-clamp-2 (shows 2 lines, then ellipsis)
- **Description**: Not shown in this section (only metadata)

### Duplicate Handling
- Publications rendered as-is from data
- Index-based keys used (safe for static content)
- User responsible for data deduplication

### URL Variations
- Checks `url`, `URL` (capital), and `identifiers.doi`
- DOI automatically converted to https://doi.org/{doi} link
- Invalid URLs passed through (browser handles)

## Privacy Considerations

### Public by Default
- All publication metadata treated as public academic record
- No privacy toggles in this section (academic CVs are public)
- External links open in new tabs with noopener/noreferrer

### Contact Information
- Correspondent and supervisor names shown (standard academic practice)
- No email/phone for correspondents (only names)
- If privacy needed, must be handled at data source level

### External Links
- All links open in new window (`target="_blank"`)
- Security: `rel="noopener noreferrer"` prevents tab-nabbing
- User aware via button label ("View Publication")

### Type Key Usage
- type_key arrays enable CV tailoring (Academic vs Industry versions)
- This component displays all publications (filtering by type_key not implemented)
- Could add domain filtering similar to Projects section if needed

## SEO & Metadata

### Structured Data (Recommended Future Enhancement)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ramin Yazdani",
  "publishedWorks": [
    {
      "@type": "ScholarlyArticle",
      "name": "Publication Title",
      "author": ["Author 1", "Author 2"],
      "datePublished": "2024-09-15",
      "publisher": { "@type": "Organization", "name": "Taylor & Francis" },
      "url": "https://...",
      "identifier": "doi:..."
    }
  ]
}
```

### Benefits
- Enhanced Google Scholar indexing
- Rich snippets in search results
- Better academic profile visibility
- Citation management integration

## Performance Considerations

### Memoization
- `authorsDisplay`: Memoized author string joining
- `dateDisplay`: Memoized date formatting logic
- `venueDisplay`: Memoized venue selection (journal > publisher > institution)
- `typeVariant`: Memoized badge variant calculation
- `statusColor`: Memoized status color classes
- `filteredPublications`: Memoized filter + search logic
- `publicationCounts`: Memoized count calculations
- `uniqueDomains`: Could be added if domain filtering implemented

### Search Debouncing
- Not currently debounced (filter is fast with small dataset)
- Add debounce if dataset grows > 100 items:
  ```typescript
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300)
  ```

### Lazy Loading
- Not needed for typical academic CVs (< 50 publications)
- If dataset > 100, consider:
  - Virtual scrolling (react-window)
  - Pagination
  - Infinite scroll

## Component Integration

### Data Source
```typescript
import { getCVData } from '@/lib/cv-data'
const data = getCVData()
const publications = data.publications || []
```

### TypeScript Type
```typescript
import type { Publication } from '@/types/cv'
```

### Import Path
```typescript
import { PublicationsSection } from '@/components/sections/PublicationsSection'
```

### Usage in App.tsx
```typescript
<PublicationsSection />
```

### Section Ordering
Placed after Projects, before Languages (academic flow):
1. Basics
2. Profiles
3. Education
4. Experiences
5. Projects
6. **Publications** ← New
7. Languages
8. Workshops & Certifications
9. Skills
