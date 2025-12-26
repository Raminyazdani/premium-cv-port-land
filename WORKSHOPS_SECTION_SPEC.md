# Workshops & Certifications Section — Design Specification

## Overview
This section displays professional certifications, workshops, and training courses organized by issuing institution. It provides comprehensive filtering, search capabilities, and visual indicators to help visitors quickly assess the breadth of professional development.

---

## Information Architecture

### Section Header
1. **Icon**: Certificate icon in accent color within circular background
2. **Title**: "Workshops & Certifications" (h2)
3. **Subtitle**: "Professional development and continuous learning achievements"
4. **Statistics**: Total count of certifications from total issuers

### Filter & Search Panel
1. **Search Bar**:
   - Full-width search input with magnifying glass icon
   - Placeholder: "Search certifications or issuers..."
   - Real-time filtering as user types
   - Searches both certification names and issuer names

2. **Domain Filter Buttons**:
   - Label: "Filter by domain:"
   - Buttons for each unique domain extracted from `type_key` arrays:
     - Academic, Bioinformatics, Biotechnology, Programming
   - Multi-select: Users can select multiple domains simultaneously
   - Active state: Filled button style
   - Inactive state: Outline button style

3. **Certificate Toggle**:
   - Switch component with label: "Show only with certificates"
   - Filters to show only entries where `certificate: true`

4. **Clear Filters Button**:
   - Appears only when filters are active
   - Ghost/link style with X icon
   - Resets all filters and search

### Issuer Accordions
Each issuer is displayed as an accordion item:

1. **Accordion Trigger** (collapsed state):
   - Institution/issuer name (h3)
   - Badge showing number of visible certifications
   - Chevron icon indicating expandable state

2. **Accordion Content** (expanded state):
   - Stack of certification cards
   - Each card contains full certification details

### Certification Cards
Each certification is displayed as a card with:

1. **Certificate Indicator Icon** (left side):
   - `certificate: true` → Gold seal icon (Seal component, filled, accent color)
   - `certificate: false` → Gray certificate icon (Certificate component, duotone)

2. **Title**:
   - Certification name (h4, font-semibold)
   - Line-clamp with proper wrapping for long titles

3. **Metadata Row**:
   - Date: Calendar icon + formatted date (e.g., "Sep 10, 2023")
   - Duration: Clock icon + duration string (e.g., "45 hours")
   - Icons are small (14px) with proper spacing

4. **Type Key Tags**:
   - Small outline badges for each domain tag
   - Excludes "Full CV" tag (internal use only)
   - Wrap to multiple lines if needed

5. **Certificate Link** (right side, if URL exists):
   - Button with link icon
   - Label: "Certificate" (hidden on mobile, icon only)
   - Opens in new tab with `rel="noopener noreferrer"`

### Empty States

1. **No Data at All**:
   - Large certificate icon (muted)
   - Heading: "Workshops & Certifications"
   - Message: "No certifications available"

2. **No Results from Filters**:
   - Large certificate icon (muted)
   - Message: "No certifications match your filters"
   - Button: "Clear all filters"

---

## Components Used

### shadcn Components
- **Card** (`@/components/ui/card`): For filter panel and certification items
- **Accordion** (`@/components/ui/accordion`): For issuer groupings
- **Badge** (`@/components/ui/badge`): For counts and type_key tags
- **Button** (`@/components/ui/button`): For filters, links, and actions
- **Input** (`@/components/ui/input`): For search field
- **Switch** (`@/components/ui/switch`): For "show certified only" toggle
- **Label** (`@/components/ui/label`): For form labels
- **Separator** (`@/components/ui/separator`): Optional visual breaks

### Phosphor Icons
- **Certificate** (`<CertificateIcon />`): Section header and workshop indicator
- **Seal** (`<Seal />`): Certified indicator
- **MagnifyingGlass** (`<MagnifyingGlass />`): Search icon
- **CalendarBlank** (`<CalendarBlank />`): Date indicator
- **Clock** (`<Clock />`): Duration indicator
- **Link** (`<LinkIcon />`): Certificate link button
- **X** (`<X />`): Clear filters

---

## Responsive Behavior

### Desktop (≥1024px)
- Two-column filter layout when appropriate
- Accordions default to collapsed (or open first 3 if ≤3 issuers)
- Certificate button shows full label: "Certificate"
- Generous spacing and padding

### Tablet (768px–1023px)
- Single-column filter layout
- Accordions default collapsed
- Certificate button shows label
- Comfortable touch targets

### Mobile (<768px)
- Stack all filter controls vertically
- Accordions default collapsed
- Certificate button: icon only (no text)
- Search bar full width
- Domain filter buttons wrap naturally
- Compact spacing but maintain 44px touch targets

---

## Accessibility Checklist

- [ ] **Semantic HTML**: Section uses `<section>`, headings use proper hierarchy (h2 → h3 → h4)
- [ ] **ARIA Labels**:
  - Search input: `aria-label="Search certifications"`
  - Certificate link buttons: `aria-label="View certificate for {name}"`
  - Icons have `aria-label` or `aria-hidden="true"` when decorative
- [ ] **Keyboard Navigation**:
  - All interactive elements (buttons, accordions, links) are keyboard accessible
  - Focus visible on all interactive elements
  - Tab order is logical
- [ ] **Focus Management**:
  - Visible focus indicators on buttons, inputs, accordions
  - Focus trap not needed (non-modal interface)
- [ ] **Color Contrast**:
  - Text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
  - Icons meet 3:1 contrast ratio
  - Badge colors have sufficient contrast
- [ ] **Screen Reader Support**:
  - Accordion state announced (expanded/collapsed)
  - Badge counts properly associated
  - Empty states have descriptive text
- [ ] **Reduced Motion**: Accordion animations respect `prefers-reduced-motion`

---

## Edge Cases & Empty States

### Edge Cases

1. **Missing `type_key`**: If a certification has no `type_key` or an empty array, it should still display but won't be filterable by domain

2. **Invalid Dates**: If `date` is unparseable (e.g., "2020-9-31"), display the original string; optionally add `date_parse_error: true` flag in normalized data

3. **Missing Duration**: Display certification without duration line if null

4. **Missing Certificate URL**: No certificate button appears

5. **Very Long Names**: Use proper text wrapping with `break-words` and `leading-snug`

6. **Single Issuer**: Still use accordion for consistency, but could default to open

7. **No Certifications for Issuer**: Should never happen in well-formed data, but issuer accordion would be hidden

8. **Search with No Results**: Show "No certifications match your filters" empty state

9. **Multiple Filters Active**: Intersection logic (cert must match ALL active filters)

### Empty States

1. **No data in JSON**: Show clean empty state with icon and message
2. **All filtered out**: Show "No matches" message with clear button
3. **Issuer with no visible certs after filtering**: Hide that issuer's accordion entirely

---

## Privacy Considerations

### Public Display
All certifications in this section are intended for public display as part of a professional portfolio. No sensitive personal information is included.

### Optional Privacy Features (Future Enhancement)
- Could add a "Show only highlights" toggle to display a curated subset
- Could gate behind authentication if user wants to limit access
- Certificate URLs point to cloud storage (Cloudinary) which is publicly accessible

---

## SEO & Structured Data (Optional)

### Schema.org Markup
Consider implementing `Person` → `hasCredential` schema:

```json
{
  "@type": "Person",
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Microarray Data Analysis in R Software",
      "credentialCategory": "certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Tuf North Academy"
      },
      "url": "https://res.cloudinary.com/...",
      "dateCreated": "2020-09-31",
      "educationalLevel": "Professional Development"
    }
  ]
}
```

---

## Data Handling & Normalization Rules

### Date Normalization
- Input format: `YYYY-MM-DD` or `YYYY-M-D`
- Display format: "Month DD, YYYY" (e.g., "Sep 10, 2023")
- Invalid dates: Keep original string, add `date_parse_error: true` flag
- For sorting: Parse to Date object; invalid dates sort to end

### Type Key Processing
- Array of strings
- Filter out "Full CV" for display purposes
- Extract unique values across all certifications for filter buttons
- Case-sensitive matching

### Certificate Boolean
- `true`: Display gold seal icon, included in "certified only" filter
- `false` or missing: Display gray certificate icon, excluded from "certified only" filter

### Duration
- Display as-is (free-form string: "18 hours", "20 weeks", etc.)
- No normalization needed

### URL Validation
- If `URL` is `null` or empty string, hide certificate button
- If present, validate it's a string and use as-is
- Always open in new tab with security attributes

---

## Performance Considerations

1. **Memoization**:
   - Memoize filtered issuer list
   - Memoize sorted certifications within each issuer
   - Memoize extracted tags for filter buttons

2. **Debouncing**:
   - Search input should not trigger re-render on every keystroke
   - Use controlled state with immediate display, filter logic on debounced value (or just let React handle it efficiently)

3. **Lazy Rendering**:
   - Accordions are collapsed by default, content not rendered until opened
   - Reduces initial render cost for large datasets

4. **Date Parsing**:
   - Parse dates once, cache results
   - Use memoization for date formatting

---

## Implementation Notes

### State Management
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
const [showCertifiedOnly, setShowCertifiedOnly] = useState(false)
```

### Filtering Logic
1. Filter issuers based on whether they have at least one visible certification
2. For each certification, check:
   - Does it match the search query (name or issuer)?
   - Does it match selected domain filters (intersection)?
   - Does it match the certified-only toggle?
3. Sort certifications by date (newest first)

### Default Accordion State
- If 3 or fewer issuers: Open all by default
- If more than 3 issuers: Collapse all by default
- Mobile: Always collapse by default

---

## Testing Checklist

- [ ] Search filters certifications by name
- [ ] Search filters certifications by issuer
- [ ] Domain filters work individually
- [ ] Multiple domain filters work together (AND logic)
- [ ] Certified-only toggle works correctly
- [ ] Clear filters button resets all state
- [ ] Accordions expand/collapse correctly
- [ ] Certificate links open in new tab
- [ ] Invalid dates display without breaking
- [ ] Missing fields (duration, URL) handled gracefully
- [ ] Empty state displays when appropriate
- [ ] No results state displays when filters yield nothing
- [ ] Mobile responsive layout works
- [ ] Keyboard navigation works
- [ ] Screen reader announces accordion state
- [ ] Focus indicators visible

---

## Future Enhancements

1. **Sort Options**: Allow sorting by date, name, or issuer
2. **Export**: Download filtered certifications as PDF or CSV
3. **Timeline View**: Alternative visualization showing certifications on a timeline
4. **Statistics**: Show breakdown by domain, year, or issuer
5. **Recommendations**: "Similar certifications" or "Next steps" suggestions
6. **Verification**: Link to verification service if available
7. **Expiration**: Track and display expiration dates for certifications that expire
