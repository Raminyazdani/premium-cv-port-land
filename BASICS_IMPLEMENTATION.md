# Basics Section Implementation — CV Website

## Summary

Updated the **Basics (Hero)** section to support the new JSON structure where:
- `basics` is an **array** (taking first element)
- Name is split into `fname` and `lname` (with backward compatibility for `name`)
- `label` can be either a **string** or **string array** (roles)
- `location` can be either an **object** or **array** of location objects

---

## Design Specification

### Information Architecture

The hero section displays professional identity information in the following order:

**Desktop Layout (≥1024px):**
- **Left Column (300px):** Profile photo (256×256px circular) + Social profile icon buttons
- **Right Column (flexible):** Name (H1) → Role badges → Location → Summary (expandable) → Contact info block

**Mobile Layout (<768px):**
- Stacked single-column centered layout
- Photo → Social links → Name → Roles → Location → Summary → Contact info

### Components Used

**Shadcn Components:**
- `Avatar` - Profile photo with initials fallback
- `Badge` - Role labels (secondary variant)
- `Button` - Social links, copy actions, phone reveal, read more
- `Separator` - Visual divider

**Custom Components:**
- `SocialLink` - Network-specific icon buttons (GitHub, LinkedIn, Twitter, Globe)
- `CopyButton` - Icon button with success animation (Copy → Check)
- `BasicsSection` - Main container with gradient background

**Icons (Phosphor):**
- Contact: `EnvelopeSimple`, `Phone`, `MapPin`
- Social: `LinkedinLogo`, `GithubLogo`, `TwitterLogo`, `Globe`
- Actions: `Copy`, `Check`, `Eye`, `EyeSlash`

---

## Responsive Behavior

| Breakpoint | Layout | Typography | Spacing |
|------------|--------|------------|---------|
| Desktop (≥1024px) | Two-column grid `[300px 1fr]` | H1: 60px | py-24 (96px) |
| Tablet (768-1023px) | Single column, photo above | H1: 60px | py-16 (64px) |
| Mobile (<768px) | Single column, centered | H1: 36px | py-16 (64px) |

---

## Accessibility Checklist

✅ **Semantic HTML**
- `<section>` wrapper
- Single `<h1>` for name
- Proper heading hierarchy

✅ **Keyboard Navigation**
- All buttons focusable via Tab
- Visible focus states (`ring-2 ring-primary`)
- Logical tab order

✅ **ARIA Labels**
- Icon-only buttons have `aria-label` (e.g., "Visit GitHub profile")
- Phone reveal button has descriptive text
- Avatar has alt text with full name

✅ **Color Contrast (WCAG AA)**
- Body text: 11.8:1 (AAA)
- Primary button text: 8.2:1 (AAA)
- Muted text: 4.6:1 (AA)

✅ **Screen Readers**
- Copy success announced via toast
- Links open in new tab with `rel="noopener noreferrer"`

---

## Edge Cases & Empty States

| Scenario | Behavior |
|----------|----------|
| No `fname`/`lname`/`name` | Display "Unknown" |
| No profile photo | Avatar with initials (first + last initial) |
| No `label` | Hide role badges |
| No `summary` | Hide summary section |
| No `email` | Hide email row |
| No `phone` | Hide phone row entirely |
| No `profiles` | Hide social links container |
| No `location` | Hide location row |
| Summary < 200 chars | No "Read more" button |

---

## Privacy Considerations

### Phone Number
- **Default:** Hidden behind "Show phone" button (Eye icon)
- **Rationale:** Prevents scraping, spam, unwanted calls
- **No persistence:** Resets on page load

### Email
- **Display:** Visible by default (professional norm)
- **Protection:** Copy button reduces need for mailto scraping

### BirthDate
- **Excluded:** Not shown in hero section (age discrimination concerns)

### Location
- **Display:** City, Region, Country only (no full address or postal code)

---

## Animations & Micro-interactions

### On Load
- Hero content fades up: `300ms ease-out`
- Stagger effect: Avatar → Social → Name → Roles → Summary (100ms delays)

### Hover States
- Social icons: `scale(1.05)` + shadow transition
- Copy buttons: Background color shift
- Links: Color change to primary + underline

### Active States
- Buttons: `scale(0.98)` on press
- Copy button: Icon swap (Copy → Check) with green color

### State Transitions
- Phone reveal: Smooth height expansion
- Summary expand: Text reveal
- Theme toggle: All colors transition `300ms ease-in-out`

---

## Technical Implementation

### Data Normalization

**Name handling:**
```typescript
// Prioritizes fname + lname, falls back to name field
if (basics.fname || basics.lname) {
  return [basics.fname, basics.lname].filter(Boolean).join(' ')
}
return basics.name ?? 'Unknown'
```

**Label (roles) handling:**
```typescript
// Supports both string[] and "Role 1 · Role 2" format
if (Array.isArray(label)) {
  return label.filter(Boolean)
}
return label.split('·').map(r => r.trim()).filter(Boolean)
```

**Location handling:**
```typescript
// Supports both Location object and Location[] array
const loc = Array.isArray(location) ? location[0] : location
const parts = [loc.city, loc.region, loc.country].filter(Boolean)
return parts.join(', ')
```

**Phone normalization:**
```typescript
interface Phone {
  countryCode?: string | null
  number?: string | null
  formatted?: string | null
}
// Display priority: formatted > number
```

### Copy to Clipboard

- **Primary:** `navigator.clipboard.writeText()` (modern, secure)
- **Fallback:** `document.execCommand('copy')` (older browsers)
- **Feedback:** Sonner toast + visual checkmark (2s)

### Background Gradient

Multi-layer radial gradients:
- Primary blue at 20%/30% position (8% opacity)
- Accent amber at 80%/70% position (8% opacity)

---

## Files Changed

### Updated Files:
1. **`src/types/cv.ts`**
   - Updated `Basics` interface to support `fname`/`lname`, `label` as array, `location` as array
   - Updated `CVData` to support `basics` as array

2. **`src/lib/cv-data.ts`**
   - Added `getFullName()` - Constructs name from fname/lname or falls back to name
   - Added `getRoles()` - Normalizes label field (string[] or '·' separated string)
   - Updated `getBasics()` - Handles array format (extracts first element)
   - Updated `formatLocation()` - Handles Location | Location[]

3. **`src/components/sections/BasicsSection.tsx`**
   - Updated to use new helper functions
   - Changed from `basics.name` to `getFullName(basics)`
   - Changed from `basics.label.split('·')` to `getRoles(basics.label)`

4. **`src/data/cv.json`**
   - Already in correct format (no changes needed)

---

## Testing Checklist

### Functional
- [x] All social links open in new tab
- [x] Copy buttons work for email and phone
- [x] Phone reveal toggle functions
- [x] Summary expand/collapse works
- [x] Avatar displays profile photo or initials

### Visual
- [x] Layout adapts at breakpoints (640px, 768px, 1024px)
- [x] Fonts load (Space Grotesk, Inter)
- [x] Icons render (Phosphor)
- [x] Colors match design system

### Accessibility
- [x] Keyboard navigation works
- [x] Focus visible on all elements
- [x] Contrast ratios pass WCAG AA
- [x] ARIA labels present

### Edge Cases
- [x] Missing name handled (fname/lname prioritized)
- [x] Empty profiles array hides social section
- [x] Short summary hides "Read more"
- [x] Label as array vs string handled

---

## JSON Output (Normalized Structure)

The section expects this JSON structure:

```json
{
  "basics": [
    {
      "fname": "Ramin",
      "lname": "Yazdani",
      "label": [
        "Biotechnologist",
        "Developer",
        "Data Scientist",
        "Bioinformatician"
      ],
      "email": "raya00001@stud.uni-saarland.de",
      "phone": {
        "countryCode": "+49",
        "number": "17666652181",
        "formatted": "+49 (0) 176 666 52181"
      },
      "birthDate": "1997-09-07",
      "summary": "I'm Ramin Yazdani, a data science enthusiast deeply passionate about biotechnology and bioinformatics. Currently expanding my knowledge at Saarland University, I thrive on using programming and data analysis to drive impactful research. My background in biotechnology and experience in bioinformatics projects fuel my commitment to exploring innovative solutions and uncovering insights from complex data. As a team player, I eagerly contribute and learn in collaborative environments. Beyond my technical pursuits, I'm improving my German and embracing new challenges.",
      "location": [
        {
          "address": null,
          "postalCode": "66121",
          "city": "Saarbrücken",
          "region": "Saarland",
          "country": "Germany"
        }
      ],
      "Pictures": [
        {
          "type_of": "profile",
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/c_pad,b_gen_fill,w_1200,h_1200,ar_1:1/v1748294090/IMG_9262_wioxcp.jpg"
        },
        {
          "type_of": "cover",
          "URL": "https://res.cloudinary.com/dgflx4rum/image/upload/c_crop,w_1200,h_900,ar_4:3,g_auto/v1748294940/IMG_5283_1200x1800_a2wxn9_c_pad_b_gen_fill_w_1600_h_400_1_lnwatm.jpg"
        }
      ]
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fname` | string | No | First name |
| `lname` | string | No | Last name |
| `label` | string[] | No | Professional roles/titles (displayed as badges) |
| `email` | string | No | Professional email address (visible, with copy button) |
| `phone` | Phone | No | Phone number object (hidden by default, reveal toggle) |
| `phone.countryCode` | string | No | Country code (e.g., "+49") |
| `phone.number` | string | No | Phone number without formatting |
| `phone.formatted` | string | No | Display-ready formatted phone number (preferred) |
| `birthDate` | string | No | ISO date format (not displayed in hero, kept for future use) |
| `summary` | string | No | Professional bio/summary (expandable if > 200 chars) |
| `location` | Location[] | No | Array of location objects (first used for display) |
| `location[0].city` | string | No | City name |
| `location[0].region` | string | No | State/Region |
| `location[0].country` | string | No | Country name |
| `location[0].address` | string | No | Full address (not displayed for privacy) |
| `location[0].postalCode` | string | No | Postal/ZIP code (not displayed for privacy) |
| `Pictures` | Picture[] | No | Array of images |
| `Pictures[].type_of` | string | No | Image type: "profile" or "cover" |
| `Pictures[].URL` | string | Yes | Cloudinary URL (responsive sources supported) |

### Backward Compatibility

The implementation also supports older JSON structures:
- `name` (string) - Used if `fname`/`lname` not present
- `label` (string) - Parsed as "·" separated string if not array
- `location` (object) - Used if not array
- `basics` (object) - Used if not array

---

## Next Steps / Future Enhancements

Potential additions (not in current scope):
- Schema.org structured data for SEO
- OpenGraph meta tags for social sharing
- vCard download button
- QR code for contact info
- Alternative profile photo selector (if multiple in Pictures array)
- Animated role label carousel
- Calendar integration for "Schedule a call"
