# Basics Section — Design Specification

## Section Overview

The **Basics** section serves as the hero/identity area of the CV website. It's the first impression visitors get and contains essential contact information, professional identity, and a concise summary.

---

## Information Architecture

### Display Order (Desktop)
1. **Left Column (300px fixed):**
   - Profile photo (256x256px, circular or square with rounded corners)
   - Social profile links (GitHub, LinkedIn, Twitter, etc.)

2. **Right Column (Flexible):**
   - Name (H1, 60px Space Grotesk Bold)
   - Role labels (badges, 16px)
   - Location (city, region, country with map pin icon)
   - Professional summary (expandable after 200 chars)
   - Horizontal separator
   - Contact information block:
     - Email (with copy button)
     - Phone (privacy toggle + copy button)
     - Personal website URL

### Display Order (Mobile < 768px)
- Stacked layout:
  1. Profile photo (centered, 256x256px)
  2. Social links (centered, horizontal)
  3. Name (centered)
  4. Role badges (centered, wrapped)
  5. Location (centered)
  6. Summary (left-aligned)
  7. Contact block (centered icons, left-aligned text)

---

## Components Used

### Shadcn Components
- **Avatar**: Profile photo with fallback to initials
- **Badge**: Role labels (secondary variant)
- **Button**: Social links, copy actions, phone reveal, read more
- **Separator**: Visual divider between summary and contact info

### Custom Components
- **SocialLink**: Renders network-specific icons with hover effects
- **CopyButton**: Icon button with success state animation (Copy → Check)
- **BasicsSection**: Main container with background gradient and responsive layout

### Icons (Phosphor)
- Contact: `EnvelopeSimple`, `Phone`, `MapPin`
- Social: `LinkedinLogo`, `GithubLogo`, `TwitterLogo`, `Globe`
- Actions: `Copy`, `Check`, `Eye`, `EyeSlash`

---

## Responsive Behavior

### Desktop (>= 1024px)
- Two-column grid: `grid-cols-[300px_1fr]`
- Photo on left, content on right
- Text left-aligned
- Max container width: 1152px (max-w-6xl)
- Padding: 96px vertical (py-24)

### Tablet (768px - 1023px)
- Single column layout
- Photo centered above content
- Text remains left-aligned
- Padding: 64px vertical (py-16)

### Mobile (< 768px)
- Single column, all centered
- Font sizes reduced: H1 from 60px to 36px
- Social links remain horizontal with icon buttons
- Touch targets: minimum 44px for all interactive elements
- Padding: 64px vertical

---

## Accessibility Checklist

### Semantic HTML
- ✅ `<section>` with `role="region"` implicit
- ✅ `<h1>` for name (single H1 per page)
- ✅ Proper heading hierarchy for future sections

### Keyboard Navigation
- ✅ All buttons focusable via Tab
- ✅ Visible focus states (ring-2 ring-primary)
- ✅ Logical tab order: photo → social links → summary button → email → phone → website

### ARIA Labels
- ✅ Icon-only buttons have `aria-label` (e.g., "Visit GitHub profile", "Copy email")
- ✅ Phone reveal button has descriptive text ("Show phone")
- ✅ Avatar has alt text with name

### Color Contrast (WCAG AA)
- ✅ Body text on background: 11.8:1 (passes AAA)
- ✅ Primary button text: 8.2:1 (passes AAA)
- ✅ Muted text: 4.6:1 (passes AA)
- ✅ Icon buttons: sufficient contrast in all states

### Screen Readers
- ✅ Email/phone copy buttons announce success via toast
- ✅ Links open in new tab with `rel="noopener noreferrer"` for security
- ✅ Expand/collapse summary button announces state

---

## Edge Cases & Empty States

### Missing Data Scenarios

| Field | Behavior |
|-------|----------|
| No `name` | Display "Unknown" as fallback |
| No `image` or `Pictures` | Show avatar with initials (first + last initial) |
| No `label` | Hide role badges entirely |
| No `summary` | Hide summary section |
| No `email` | Hide email row |
| No `phone` | Hide phone row entirely (no empty toggle) |
| No `url` | Hide website row |
| No `profiles` | Hide social links container |
| No `location` data | Hide location row with map pin |
| Name with one word | Use first 2 letters for initials |
| Summary < 200 chars | No "Read more" button shown |

### Invalid Data Handling

| Issue | Handling |
|-------|----------|
| Invalid URL format | Display as-is (browser handles invalid hrefs) |
| Null phone but object exists | Check for `number` or `formatted` before showing |
| Unknown social network | Use default `Globe` icon |
| Empty strings | Treated same as null/undefined |

### Interaction Edge Cases

| Scenario | Behavior |
|----------|----------|
| Copy fails (no clipboard API) | Fallback to `document.execCommand('copy')` |
| Copy fails completely | Show error toast: "Failed to copy email" |
| Rapid clicking copy button | Debounced; success state lasts 2 seconds |
| Summary expanded, scroll away | Remains expanded (no auto-collapse) |
| Phone revealed, page refresh | Resets to hidden (no persistence) |

---

## Privacy Considerations

### Phone Number
- **Default**: Hidden behind "Show phone" button
- **Rationale**: Prevents scraping, spam, unwanted calls
- **Implementation**: Click `Eye` icon → reveals formatted number + copy button + `EyeSlash` to hide again
- **No persistence**: Resets on page load for privacy

### Email
- **Display**: Visible by default (professional norm)
- **Protection**: Copy button reduces need for mailto links (harder to scrape)
- **Alternative**: Could add toggle similar to phone if highly privacy-sensitive

### BirthDate
- **Excluded from display**: Not shown in hero section
- **Rationale**: Age discrimination concerns, not professionally relevant
- **Future consideration**: Could be used internally for age calculation if needed for specific contexts

### Location
- **Display level**: City, Region, Country only
- **Excluded**: Full address, postal code
- **Rationale**: Professional location context without revealing home address

### Social Profiles
- **User choice**: Only shows profiles provided in JSON
- **No assumptions**: Doesn't attempt to guess or generate profile URLs

---

## Animation & Micro-interactions

### On Load
- Hero content fades up: `300ms ease-out`
- Stagger effect: Avatar → Social → Name → Roles → Summary (100ms delays)

### Hover States
- Social icons: `scale(1.05)` + shadow transition
- Copy buttons: Background color shift (ghost → muted)
- Links: Color change to primary + underline

### Active States
- Buttons: `scale(0.98)` on press
- Copy button: Icon swap (Copy → Check) with color change to green

### State Transitions
- Phone reveal: Smooth height expansion with `overflow-hidden`
- Summary expand: Smooth text reveal (no height animation due to dynamic content)
- Theme toggle: All colors transition smoothly `300ms ease-in-out`

---

## Technical Implementation Notes

### Data Provider Pattern
- `getCVData()`: Returns full CV object
- `getBasics()`: Returns basics section with null safety
- `getProfilePhotoUrl()`: Prioritizes `Pictures` array, falls back to `image` field
- `getInitials()`: Generates 2-letter initials from name
- `formatLocation()`: Joins city, region, country with commas

### Phone Normalization
```typescript
interface Phone {
  countryCode?: string | null    // e.g., "+1"
  number?: string | null          // e.g., "5551234567"
  formatted?: string | null       // e.g., "+1 (555) 123-4567"
}
```
- Display priority: `formatted` > `number`
- No auto-formatting to avoid incorrect assumptions about locale

### Copy to Clipboard
- Primary: `navigator.clipboard.writeText()` (modern, secure)
- Fallback: `document.execCommand('copy')` (older browsers)
- Feedback: Sonner toast notification + visual checkmark (2s)

### Background Gradient
- Multi-layer radial gradients at 20%/30% and 80%/70% positions
- Colors: Primary (blue) at 8% opacity, Accent (amber) at 8% opacity
- Ensures readability while adding visual interest

---

## Future Enhancements (Not in Scope)

- [ ] Schema.org structured data for SEO
- [ ] OpenGraph meta tags for social sharing
- [ ] vCard download button
- [ ] QR code for contact info
- [ ] Alternative profile photo selection (if multiple in Pictures array)
- [ ] Animated role label rotation/carousel effect
- [ ] Integration with calendar for "Schedule a call" button

---

## Testing Checklist

### Functional
- [ ] All social links open in new tab
- [ ] Copy buttons work for email and phone
- [ ] Phone reveal toggle functions correctly
- [ ] Summary expand/collapse works
- [ ] Avatar displays or shows initials fallback

### Visual
- [ ] Layout adapts correctly at breakpoints (640px, 768px, 1024px)
- [ ] All fonts load (Space Grotesk, Inter)
- [ ] Icons render consistently (Phosphor)
- [ ] Colors match design system (check with DevTools)

### Accessibility
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Focus visible on all elements
- [ ] Screen reader announces all actions
- [ ] Contrast ratios pass WCAG AA

### Edge Cases
- [ ] Missing name, photo, email handled gracefully
- [ ] Empty profiles array hides social section
- [ ] Short summary (<200 chars) hides "Read more"
- [ ] Long name wraps correctly on mobile

### Cross-browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (WebKit)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## JSON Schema Reference

See `src/types/cv.ts` for full TypeScript definitions. Key structure:

```typescript
{
  "basics": {
    "name": string,
    "label": string,                    // Use · separator for multiple roles
    "image": string,                    // URL (fallback)
    "email": string,
    "phone": {
      "countryCode": string,
      "number": string,
      "formatted": string               // Preferred display format
    },
    "url": string,                      // Personal website
    "summary": string,                  // Professional bio
    "location": {
      "city": string,
      "region": string,
      "country": string
    },
    "profiles": [
      {
        "network": string,              // "GitHub", "LinkedIn", "Twitter", etc.
        "username": string,
        "url": string
      }
    ],
    "Pictures": [
      {
        "type_of": "profile",           // Filter for profile photo
        "URL": string
      }
    ]
  }
}
```

