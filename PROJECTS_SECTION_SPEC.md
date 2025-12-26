# Projects Section - Design Specification

## Information Architecture

The Projects section presents a portfolio/showcase of programming, bioinformatics, biotechnology, and research projects. The section is optimized for scanning, filtering, and clicking through to demos/repositories.

### Display Order
1. **Section Header**: Title, icon, and description
2. **Search & Filter Controls**: Search bar, domain filters, link availability toggle
3. **Results Count**: Display showing filtered vs total projects
4. **Project Grid**: Responsive grid of project cards

### Content Hierarchy (Per Project Card)
- **Title**: Project name (primary identifier)
- **Domain Badges**: Visual tags from `type_key` (Programming, Bioinformatics, etc.)
- **Description**: 2-3 line summary with line-clamp
- **Repository Link**: GitHub/external link button (if URL exists)

---

## Components

### Primary Components

#### 1. ProjectCard
- **Card container** with hover effects (border color change on hover)
- **Header section**:
  - Title (group-hover state for color transition)
  - Domain badges (compact, secondary variant)
- **Content section**:
  - Description (line-clamped to 4 lines)
  - Repository link button (if URL available)
- **Accessibility**: 
  - Proper ARIA labels on links
  - Focus-visible states
  - Semantic card structure

#### 2. Search Bar
- Icon-prefixed input field
- Real-time filtering
- Placeholder: "Search projects by title or description..."

#### 3. Filter Controls
- **Domain filters**: Badge-based toggles for Programming, Bioinformatics, Biotechnology, Academic, Student Projects, Robotics, Embedded Systems
- **Link availability**: "Has Link" toggle badge
- **Clear filters** button (appears when any filter is active)

#### 4. Empty States
- **No projects**: Card with icon and message
- **No filtered results**: Card with icon, message, and "Clear all filters" link

---

## Responsive Behavior

### Mobile (< 768px)
- Single column grid
- Full-width cards
- Stacked filter badges with wrapping
- Search bar full width

### Tablet (768px - 1024px)
- 2-column grid
- Filter badges wrap naturally
- Maintained spacing and readability

### Desktop (> 1024px)
- 3-column grid
- Horizontal filter layout
- Optimal card aspect ratios
- Enhanced hover states

---

## Accessibility Checklist

- [x] Semantic HTML structure (section, heading hierarchy)
- [x] Keyboard navigation support
  - [x] All interactive elements keyboard-accessible
  - [x] Logical tab order
  - [x] Focus-visible states on all controls
- [x] ARIA attributes
  - [x] `aria-label` on external links
  - [x] Proper button semantics
- [x] Screen reader friendly
  - [x] Descriptive button text
  - [x] Meaningful headings
  - [x] Clear filter state communication
- [x] Color contrast (WCAG AA compliant)
  - [x] Text on backgrounds
  - [x] Badge colors
  - [x] Interactive element states

---

## Edge Cases & Empty States

### Edge Cases Handled
1. **Duplicate projects**: Deduplicated by title+description+url combination
2. **Missing URLs**: Cards without URLs show only description (no link button)
3. **Long titles**: Natural wrapping with proper line-height
4. **Long descriptions**: Line-clamped to 4 lines for visual consistency
5. **Missing type_key**: Projects render without domain badges
6. **No search results**: Clear empty state with filter reset option

### Empty States
1. **No projects at all**: 
   - Centered card with folder icon
   - "No projects have been added yet" message

2. **No filtered results**:
   - Card with folder icon
   - "No projects match your current filters" message
   - "Clear all filters" action button

---

## Privacy Considerations

### Public Data
- All projects displayed are intended for public portfolio viewing
- External links are clearly marked and open in new tabs
- No sensitive or private data in project descriptions

### Data Handling
- Project URLs validated before rendering
- `rel="noopener noreferrer"` on all external links for security
- No tracking or analytics on project clicks

### Optional Visibility (Not Implemented)
- No privacy toggles needed - all projects are portfolio items
- If needed in future: Add `isPublic` field to project schema

---

## Data Handling & Normalization

### Input Schema
```typescript
interface Project {
  title?: string | null
  name?: string | null  // fallback if title missing
  description?: string | null
  url?: string | null
  type_key?: string[] | null
}
```

### Normalization Rules
1. **Title Resolution**: Uses `project.title` first, falls back to `project.name`, defaults to "Untitled Project"
2. **Deduplication**: Creates unique key from `title-description-url` combination
3. **Domain Extraction**: Maps `type_key` values to display domains:
   - `"programming"` → `"Programming"`
   - `"bioinformatics"` → `"Bioinformatics"`
   - `"biotechnology"` → `"Biotechnology"`
   - `"academic"` → `"Academic"`
   - `"student projects"` → `"Student Projects"`
   - `"robotics"` → `"Robotics"`
   - `"embedded systems"` → `"Embedded Systems"`
4. **URL Validation**: Checks for truthy URL before rendering link button
5. **Type Key Handling**: Safely handles missing or empty `type_key` arrays

### Filter Logic
- **Search**: Case-insensitive substring match on title and description
- **Domain filter**: Projects must have at least one selected domain (OR logic)
- **Link filter**: Boolean match on URL presence
- **Combined filters**: AND logic between filter types

---

## Performance Considerations

- **Memoization**: 
  - `allDomains` computed once and cached
  - `uniqueProjects` deduplication memoized
  - `filteredProjects` updates only when dependencies change
- **Efficient Filtering**: Single pass through projects array
- **Minimal Re-renders**: Strategic use of `useMemo` for expensive computations

---

## Design Tokens Used

### Colors
- `--primary`: Interactive elements, hover states
- `--muted`: Backgrounds, secondary text
- `--border`: Card borders, separators
- `--card`: Card backgrounds

### Spacing
- Section padding: `py-16 md:py-24`
- Card gap: `gap-4`
- Content spacing: `space-y-4`, `space-y-8`

### Typography
- Section title: `text-3xl md:text-4xl font-bold`
- Card title: `text-lg font-semibold`
- Description: `text-sm`
- Muted text: `text-muted-foreground`

---

## Future Enhancements (Not Implemented)

- Project detail modal with full description, tech stack, and screenshots
- Sorting options (date, title, domain)
- "Featured projects" section at top
- Project tags/technology chips
- View count or popularity metrics
- Integration with GitHub API for live stats
