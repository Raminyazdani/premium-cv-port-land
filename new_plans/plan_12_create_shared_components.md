# Plan 12: Create Shared Section Components

## Title
Create SectionWrapper and useFilteredData to Reduce Duplication

---

## Scope

### In Scope
- Create `SectionWrapper` component for common section structure
- Create `useFilteredData` hook for filtering/sorting logic
- Create `EntryCard` base component for education/experience/project cards
- Refactor one section as proof of concept

### Out of Scope
- Refactoring all 15 sections (can be done incrementally later)
- Changing visual design
- Adding new section types

---

## Symptoms

**What developers experience:**
- Same patterns repeated in 15+ section files
- Copy-paste changes when updating structure
- Inconsistent implementation of filters/sorting
- 4-7 useMemo calls per section

---

## Evidence

### Report References
- [FRONTEND_REFACTOR_AUDIT.md - PATTERN-004 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#3-section-component-pattern-repetition)
- [FRONTEND_REFACTOR_AUDIT.md - DESIGN-001 (Medium)](../qa/reports/FRONTEND_REFACTOR_AUDIT.md#missing-abstractions)

### Repeated Patterns Across Sections
```typescript
// Every section has:
if (data.length === 0) {
  return (
    <section id="..." className="py-16 ...">
      <Icon />
      <h2>{t.sections.xxx}</h2>
      <p>{t.empty.no_xxx}</p>
    </section>
  )
}

return (
  <section id="..." className="...">
    <div className="container max-w-...">
      <h2>...</h2>
      <Separator />
      {filteredData.map(...)}
    </div>
  </section>
)
```

### Duplicated useMemo Chains
- EducationSection: 4 useMemo
- ExperiencesSection: 4 useMemo
- ProjectsSection: 5 useMemo
- PublicationsSection: 7 useMemo

---

## Likely Root Cause

**Mechanism:**
- Sections created without shared abstractions
- No component library for common patterns
- Copy-paste development

---

## Fix Strategy

### Step 1: Create SectionWrapper
```typescript
// components/composites/SectionWrapper.tsx
interface SectionWrapperProps {
  id: string
  title: string
  icon: React.ReactNode
  isEmpty: boolean
  emptyMessage?: string
  children: React.ReactNode
}

export function SectionWrapper({
  id,
  title,
  icon,
  isEmpty,
  emptyMessage,
  children
}: SectionWrapperProps) {
  const { isRTL } = useLanguage()
  
  if (isEmpty) {
    return (
      <section id={id} className={cn("py-16 text-center", isRTL && "rtl")}>
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
        {emptyMessage && <p className="text-muted">{emptyMessage}</p>}
      </section>
    )
  }
  
  return (
    <section id={id} className={cn("py-16", isRTL && "rtl")}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          {icon}
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <Separator className="mb-8" />
        {children}
      </div>
    </section>
  )
}
```

### Step 2: Create useFilteredData hook
```typescript
// hooks/useFilteredData.ts
interface UseFilteredDataOptions<T> {
  data: T[]
  getTypeKey: (item: T) => string[] | undefined
  sortFn?: (a: T, b: T) => number
}

export function useFilteredData<T>({
  data,
  getTypeKey,
  sortFn
}: UseFilteredDataOptions<T>) {
  const { selectedFocus } = useFilter()
  
  return useMemo(() => {
    const filtered = data.filter(item => 
      shouldShowEntry(getTypeKey(item), selectedFocus)
    )
    
    return sortFn ? filtered.sort(sortFn) : filtered
  }, [data, selectedFocus, sortFn])
}
```

### Step 3: Create composites directory
```bash
mkdir -p frontend/src/components/composites
```

### Step 4: Refactor EducationSection as proof
```typescript
// Before: 308 LOC with 4 useMemo calls
// After: ~100 LOC using shared components

export function EducationSection() {
  const { data } = useCVData()
  const t = useTranslation()
  
  const filteredEducation = useFilteredData({
    data: data?.education || [],
    getTypeKey: (item) => item.type_key,
    sortFn: sortByDate
  })
  
  return (
    <SectionWrapper
      id="education"
      title={t.sections.education}
      icon={<GraduationCap className="h-8 w-8" />}
      isEmpty={filteredEducation.length === 0}
      emptyMessage={t.empty.no_education}
    >
      <div className="grid gap-6">
        {filteredEducation.map((item, index) => (
          <EducationCard key={index} item={item} />
        ))}
      </div>
    </SectionWrapper>
  )
}
```

### Files to Create
- `frontend/src/components/composites/SectionWrapper.tsx`
- `frontend/src/components/composites/index.ts`
- `frontend/src/hooks/useFilteredData.ts`

### Files to Modify (proof of concept)
- `frontend/src/components/sections/EducationSection.tsx`

---

## Acceptance Criteria

- [ ] SectionWrapper component created
- [ ] useFilteredData hook created
- [ ] At least one section refactored to use new components
- [ ] Visual output identical to before
- [ ] Empty states work correctly
- [ ] RTL layout works correctly

---

## Regression Tests

### Manual Tests
1. View education section in all languages
2. Apply focus filter → Verify filtering works
3. Empty state → Verify message appears
4. RTL layout → Verify correct alignment

### Unit Tests
```typescript
describe('SectionWrapper', () => {
  it('shows empty state when isEmpty is true', () => {
    render(<SectionWrapper id="test" title="Test" icon={<div />} isEmpty={true} />)
    expect(screen.queryByRole('heading')).toBeInTheDocument()
  })
})

describe('useFilteredData', () => {
  it('filters by selected focus', () => {
    const data = [
      { name: 'A', type_key: ['Programming'] },
      { name: 'B', type_key: ['Bioinformatics'] }
    ]
    
    // With Programming filter
    const { result } = renderHook(() => useFilteredData({
      data,
      getTypeKey: (item) => item.type_key
    }), { wrapper: FilterProvider({ selectedFocus: 'Programming' }) })
    
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('A')
  })
})
```

---

## Risk & Rollback

### Risk Level: MEDIUM

**Why medium:**
- Creating new abstraction layer
- Need to ensure all edge cases covered
- Incremental adoption reduces risk

**Mitigation:**
- Refactor one section first
- Test thoroughly before more sections
- Keep old pattern available for edge cases

**Rollback:**
Revert to direct implementation in sections.

---

## Dependencies

**Blocks:** None (future sections can adopt incrementally)

**Blocked by:**
- plan_04 (Consolidate Filter Logic - need unified filter)
- plan_11 (Refactor CVDataContext - need stable data API)

---

## Commit Message Guidance

### Short
```
feat(components): create SectionWrapper and useFilteredData

Added shared components to reduce section duplication:
- SectionWrapper for common section structure
- useFilteredData hook for filter/sort logic
Refactored EducationSection as proof of concept.

Fixes: PATTERN-004, DESIGN-001
```

---

*Plan ready for implementation*
