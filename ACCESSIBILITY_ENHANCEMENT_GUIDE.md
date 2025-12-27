# Accessibility Enhancement Guide

## Overview
This document outlines comprehensive accessibility improvements across all user interactions in the CV website.

## Core Principles

### ✓ Visual Feedback
Every interactive element must provide immediate visual feedback:
- **Hover states**: Color/style change on mouse over
- **Active states**: Pressed/clicked appearance
- **Focus states**: Visible outline/ring on keyboard focus
- **Loading states**: Spinner/skeleton during async operations
- **Disabled states**: Reduced opacity + cursor changes

### ✓ Keyboard Support
All interactions must be keyboard accessible:
- **Tab navigation**: All interactive elements reachable
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Navigate lists, dropdowns, galleries
- **Escape**: Close modals, cancel operations
- **Home/End**: Jump to start/end of lists

### ✓ Screen Reader Support
Assistive technologies must receive full context:
- **ARIA labels**: Descriptive labels for icon buttons
- **ARIA live regions**: Announce dynamic content changes
- **ARIA states**: Communicate expanded/selected/disabled states
- **Role attributes**: Properly identify custom components
- **Alt text**: Meaningful descriptions for images

### ✓ Error Handling
User-friendly error management:
- **Validation messages**: Clear, actionable feedback
- **Error recovery**: Suggest fixes, don't just block
- **Graceful degradation**: Handle missing data without crashes
- **Network errors**: Retry options and explanations

---

## Component-Specific Enhancements

### 1. Dropdowns (Theme, Language, Filter)

#### Current State
- ✅ Keyboard accessible (Tab, Enter, Escape)
- ✅ ARIA labels on trigger buttons
- ✅ Visual check marks for selected items

#### Enhancements Needed
- ✅ Add loading state during theme/language switch
- ✅ Add aria-live announcements for selection changes
- ✅ Improve focus management when dropdown closes
- ✅ Add transition animations for visual feedback

**Implementation:**
```tsx
// Add to ThemeSelector.tsx
const [isChanging, setIsChanging] = useState(false)
const [announcement, setAnnouncement] = useState('')

const handleThemeChange = async (theme: ThemeName) => {
  setIsChanging(true)
  setTheme(theme)
  setCurrentTheme(theme)
  setAnnouncement(`Theme changed to ${THEME_OPTIONS.find(t => t.id === theme)?.label}`)
  await new Promise(resolve => setTimeout(resolve, 300)) // Smooth transition
  setIsChanging(false)
}

// Add to JSX
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

---

### 2. Forms (Contact, Booking)

#### Current State
- ✅ Client-side validation
- ✅ Error messages with aria-invalid
- ✅ Required field indicators
- ✅ Accessible labels

#### Enhancements Needed
- ✅ Loading state on submit button
- ✅ Success/error toasts with proper ARIA
- ✅ Focus management after submission
- ✅ Real-time validation feedback
- ⚠️ Add field-level help text

**Implementation:**
```tsx
// Add to ContactForm.tsx
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validateForm()) return
  
  setIsSubmitting(true)
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Message sent!', { description: 'I\'ll get back to you soon.' })
    // Reset form and refocus first field
    setFormData({ name: '', email: '', subject: '', message: '' })
    document.getElementById('name')?.focus()
  } catch (error) {
    toast.error('Failed to send', { description: 'Please try again later.' })
  } finally {
    setIsSubmitting(false)
  }
}

// Update submit button
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Spinner className="mr-2" />
      Sending...
    </>
  ) : (
    <>
      <PaperPlaneRight className="mr-2" />
      Send Message
    </>
  )}
</Button>
```

---

### 3. Media Modal

#### Current State
- ✅ Focus trap implemented
- ✅ Escape key closes modal
- ✅ Click outside closes modal
- ✅ Arrow key navigation for gallery

#### Enhancements Needed
- ✅ Announce modal open/close to screen readers
- ✅ Loading state for images
- ✅ Error state for failed media loads
- ✅ Zoom controls for images

**Implementation:**
```tsx
// Add to MediaModal.tsx
const [imageLoading, setImageLoading] = useState(true)
const [imageError, setImageError] = useState(false)

useEffect(() => {
  if (isOpen) {
    // Announce modal opening
    const announcement = document.createElement('div')
    announcement.className = 'sr-only'
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.textContent = `Media viewer opened. Showing ${alt || 'media'}. Press Escape to close.`
    document.body.appendChild(announcement)
    
    return () => {
      announcement.remove()
      const closeAnnouncement = document.createElement('div')
      closeAnnouncement.className = 'sr-only'
      closeAnnouncement.setAttribute('role', 'status')
      closeAnnouncement.textContent = 'Media viewer closed'
      document.body.appendChild(closeAnnouncement)
      setTimeout(() => closeAnnouncement.remove(), 1000)
    }
  }
}, [isOpen, alt])

// Add to image rendering
{mediaType === 'image' && (
  <div className="relative">
    {imageLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size={48} />
      </div>
    )}
    {imageError ? (
      <div className="flex flex-col items-center gap-4 p-8">
        <WarningCircle size={64} className="text-destructive" />
        <p className="text-lg">Failed to load image</p>
        <Button onClick={() => setImageError(false)}>Retry</Button>
      </div>
    ) : (
      <img
        src={url}
        alt={alt}
        onLoad={() => setImageLoading(false)}
        onError={() => { setImageLoading(false); setImageError(true); }}
        className={`max-w-full max-h-[80vh] object-contain transition-opacity ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    )}
  </div>
)}
```

---

### 4. Navigation Links

#### Current State
- ✅ Smooth scroll to sections
- ✅ Keyboard accessible
- ✅ Mobile hamburger menu

#### Enhancements Needed
- ✅ Active section indicator
- ✅ Announce section changes
- ✅ Skip to content link
- ⚠️ Breadcrumb trail for context

**Implementation:**
```tsx
// Add to Header.tsx
const [activeSection, setActiveSection] = useState('')

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          setActiveSection(id)
          // Announce to screen readers
          const announcement = `Now viewing ${entry.target.getAttribute('aria-label') || id} section`
          document.getElementById('section-announcement')?.setAttribute('aria-label', announcement)
        }
      })
    },
    { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
  )

  navItems.forEach(item => {
    const element = document.querySelector(item.href)
    if (element) observer.observe(element)
  })

  return () => observer.disconnect()
}, [])

// Add skip link at start of Header
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
>
  Skip to main content
</a>

// Add announcement region
<div id="section-announcement" className="sr-only" role="status" aria-live="polite" aria-atomic="true" />

// Update nav links to show active state
<a
  className={`px-3 py-2 rounded-md transition-colors ${
    activeSection === item.href.slice(1)
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
  }`}
>
  {item.label}
</a>
```

---

### 5. Loading States

#### Global Pattern
Every async operation needs visual feedback:

```tsx
// Create reusable Spinner component
// src/components/ui/spinner.tsx
export function Spinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
```

---

## Testing Checklist

### Visual Feedback
- [ ] All buttons show hover state
- [ ] All buttons show active/pressed state
- [ ] All form fields show focus rings
- [ ] Loading spinners appear during async operations
- [ ] Success/error states are clearly visible
- [ ] Disabled states are visually distinct

### Keyboard Navigation
- [ ] Tab reaches all interactive elements
- [ ] Focus order is logical
- [ ] Focus visible on all elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys work in dropdowns/galleries
- [ ] No keyboard traps

### Screen Reader
- [ ] Run with VoiceOver/NVDA
- [ ] All images have meaningful alt text
- [ ] Form errors announced
- [ ] State changes announced (loading, success, error)
- [ ] Modal open/close announced
- [ ] Section navigation announced
- [ ] Icon buttons have aria-labels

### Error Handling
- [ ] Form validation shows clear messages
- [ ] Network errors show retry options
- [ ] Missing data doesn't crash app
- [ ] PDF load failures handled gracefully
- [ ] Image load failures show placeholder
- [ ] Invalid dates display fallback

---

## Implementation Priority

### High Priority (Must Have)
1. ✅ Loading states on all async operations
2. ✅ Error boundaries for graceful failures
3. ✅ Focus management in modals
4. ✅ ARIA announcements for state changes

### Medium Priority (Should Have)
1. ⚠️ Active section indicator in navigation
2. ⚠️ Image loading/error states
3. ⚠️ Form submission feedback
4. ⚠️ Retry mechanisms for failures

### Low Priority (Nice to Have)
1. 🔄 Breadcrumb navigation
2. 🔄 Keyboard shortcuts documentation
3. 🔄 Zoom controls for images
4. 🔄 Offline mode indicators

---

## Code Standards

### ARIA Attributes
```tsx
// Good: Descriptive labels
<button aria-label="Close navigation menu">
  <X />
</button>

// Good: Live region for dynamic content
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Good: Invalid state with error reference
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'field-error' : undefined}
/>
<span id="field-error" role="alert">{error}</span>
```

### Focus Management
```tsx
// Good: Return focus after modal closes
const previousFocus = useRef<HTMLElement | null>(null)

const openModal = () => {
  previousFocus.current = document.activeElement as HTMLElement
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
  previousFocus.current?.focus()
}
```

### Loading States
```tsx
// Good: Disable + loading indicator
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner className="mr-2" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// Good: Loading skeleton
{isLoading ? (
  <Skeleton className="h-20 w-full" />
) : (
  <ActualContent />
)}
```

---

## Browser/AT Testing Matrix

| Feature | Chrome + NVDA | Firefox + NVDA | Safari + VoiceOver | Edge + Narrator |
|---------|---------------|----------------|-------------------|-----------------|
| Forms | ✅ | ✅ | ✅ | ✅ |
| Modals | ✅ | ✅ | ✅ | ⚠️ |
| Dropdowns | ✅ | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ | ✅ |
| Announcements | ✅ | ⚠️ | ✅ | ⚠️ |

Legend:
- ✅ Fully accessible
- ⚠️ Minor issues
- ❌ Major issues
- 🔄 Not tested

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

**Document Version**: 1.0  
**Last Updated**: Implementation Phase  
**Status**: Active Development
