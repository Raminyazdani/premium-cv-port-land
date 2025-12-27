# UI Rendering Instructions

**applyTo**: `["src/components/**/*.tsx", "src/pages/**/*.tsx", "src/App.tsx"]`

## Purpose

Guidelines for rendering CV sections and UI components in a multilingual environment.

## Critical Rules

### 1. Always Handle Empty Data
Every component must gracefully handle empty arrays, objects, or undefined values.

```typescript
// ✅ Good: Handle empty data
function EducationSection({ education }: { education: CVData['education'] }) {
  if (!education || education.length === 0) {
    return <EmptyState message={t.empty.no_education} />
  }
  
  return <div>{education.map(item => ...)}</div>
}

// ❌ Bad: Assuming data exists
function EducationSection({ education }) {
  return <div>{education.map(item => ...)}</div> // Crashes if education is undefined
}
```

### 2. Use Optional Chaining for Nested Properties
```typescript
// ✅ Good: Safe property access
<p>{item.institution?.toLowerCase()}</p>
<p>{item.basics?.[0]?.fname}</p>

// ❌ Bad: Can crash on undefined
<p>{item.institution.toLowerCase()}</p>
<p>{item.basics[0].fname}</p>
```

### 3. Never Display "undefined" or "null" as Text
```typescript
// ✅ Good: Provide defaults
<p>{item.email || 'No email provided'}</p>
<p>{item.phone ?? 'N/A'}</p>

// ❌ Bad: Shows "undefined" string
<p>{item.email}</p>
<p>{String(item.phone)}</p>
```

### 4. Use UI Translations, Not CV Content
- **UI text** (buttons, labels, headings) comes from `src/lib/i18n.ts`
- **CV content** (name, education, projects) comes from `CVDataContext`

```typescript
// ✅ Good: Use i18n for UI, context for content
const t = useTranslation()
const { cvData } = useCVData()

return (
  <section>
    <h2>{t.sections.education}</h2>
    {cvData.education.map(item => (
      <div key={item.institution}>
        <h3>{item.institution}</h3>
      </div>
    ))}
  </section>
)

// ❌ Bad: Hardcoding UI text
return <h2>Education</h2> // Won't translate to DE/FA
```

### 5. Respect RTL Layout for Persian
```typescript
// Use isRTL from LanguageContext
const { isRTL } = useLanguage()

// Apply RTL-aware styles
<div className={cn("flex", isRTL && "flex-row-reverse")}>
  <Icon className={cn("mr-2", isRTL && "mr-0 ml-2")} />
  <span>{text}</span>
</div>
```

### 6. Filtering by type_key
Many CV items have a `type_key` array for filtering by focus area:

```typescript
const { selectedFocus } = useFilter()

// Filter items that match current focus
const filtered = items.filter(item => {
  if (selectedFocus === 'Full CV') return true
  return item.type_key?.includes(selectedFocus)
})
```

## Component Patterns

### Section Component Structure
```typescript
interface SectionProps {
  data: CVData['education'] // Specific section type
}

export function EducationSection({ data }: SectionProps) {
  const t = useTranslation()
  const { selectedFocus } = useFilter()
  const { isRTL } = useLanguage()
  
  // Filter by focus
  const filtered = useMemo(() => 
    filterByFocus(data, selectedFocus),
    [data, selectedFocus]
  )
  
  // Handle empty state
  if (filtered.length === 0) {
    return <EmptyState message={t.empty.no_education} />
  }
  
  return (
    <section>
      <h2>{t.sections.education}</h2>
      {filtered.map(item => (
        <EducationCard key={item.institution} item={item} />
      ))}
    </section>
  )
}
```

### Card Component Structure
```typescript
interface CardProps {
  item: CVData['education'][number]
}

export function EducationCard({ item }: CardProps) {
  const t = useTranslation()
  const { isRTL } = useLanguage()
  
  return (
    <div className={cn("card", isRTL && "rtl")}>
      <h3>{item.institution || t.empty.no_data}</h3>
      <p>{item.studyType}</p>
      {item.area && <p>{item.area}</p>}
      {item.startDate && (
        <time dateTime={item.startDate}>
          {formatDate(item.startDate)}
        </time>
      )}
    </div>
  )
}
```

## Common Rendering Issues

### Issue: "undefined" showing in UI
**Cause**: Missing null check or default value
**Fix**: Use optional chaining and nullish coalescing
```typescript
// Before
<p>{item.institution}</p>

// After
<p>{item.institution ?? 'Unknown institution'}</p>
```

### Issue: Section appears empty despite having data
**Cause**: Overly aggressive filtering or type_key mismatch
**Fix**: Check filter logic and try "Full CV" mode
```typescript
// Debug filtering
console.log('Raw data:', data)
console.log('Filtered data:', filtered)
console.log('Selected focus:', selectedFocus)
```

### Issue: RTL layout broken for Persian
**Cause**: Hard-coded directional classes
**Fix**: Use isRTL-aware styles
```typescript
// Before
<div className="flex items-center gap-2 ml-4">

// After
<div className={cn(
  "flex items-center gap-2",
  isRTL ? "mr-4" : "ml-4"
)}>
```

### Issue: Arrays/Objects showing as "[object Object]"
**Cause**: Trying to render complex objects directly
**Fix**: Destructure and render specific properties
```typescript
// Before
<p>{item.Pictures}</p> // Shows [object Object]

// After
{item.Pictures?.map(pic => (
  <img key={pic.URL} src={pic.URL} alt={pic.type_of} />
))}
```

## Testing Rendered Output

### Manual Testing
1. Start dev server: `npm run dev`
2. Test each language:
   - EN: `http://localhost:5173/?lang=en`
   - DE: `http://localhost:5173/?lang=de`
   - FA: `http://localhost:5173/?lang=fa`
3. Check each section for:
   - ✅ Content renders
   - ✅ No "undefined" strings
   - ✅ Empty states when appropriate
   - ✅ RTL layout for FA

### Component Testing
```typescript
import { render, screen } from '@testing-library/react'
import { EducationSection } from './EducationSection'

test('handles empty education array', () => {
  render(<EducationSection data={[]} />)
  expect(screen.getByText(/no education/i)).toBeInTheDocument()
})

test('renders education items', () => {
  const data = [{
    institution: 'Test University',
    studyType: "Master's",
    area: 'Computer Science'
  }]
  
  render(<EducationSection data={data} />)
  expect(screen.getByText('Test University')).toBeInTheDocument()
  expect(screen.getByText("Master's")).toBeInTheDocument()
})

test('does not show undefined', () => {
  const data = [{
    institution: 'Test University',
    studyType: undefined // Missing field
  }]
  
  render(<EducationSection data={data} />)
  expect(screen.queryByText('undefined')).not.toBeInTheDocument()
})
```

## Accessibility Requirements

- Use semantic HTML (`<section>`, `<article>`, `<time>`, etc.)
- Provide `aria-label` for icon-only buttons
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers (at least VoiceOver or NVDA)

## When to Update This File

Update these instructions when:
- Adding new section components
- Changing how filtering works
- Discovering new rendering edge cases
- Adding new UI patterns
