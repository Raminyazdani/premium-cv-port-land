# CV/Portfolio Website - Product Requirements Document

A premium, production-quality personal CV/portfolio website driven by structured JSON data.

**Experience Qualities:**
1. **Professional** - Conveys credibility and attention to detail through polished design and typography
2. **Accessible** - Works flawlessly for all users across devices and assistive technologies
3. **Memorable** - Creates a lasting impression through thoughtful micro-interactions and visual personality

**Complexity Level:** Light Application (multiple features with basic state)
This is a content-rich portfolio site with filtering, search, privacy toggles, and smooth navigation. It's more than a static showcase but simpler than a full CRUD application.

## Essential Features

### Hero/Basics Section
- **Functionality**: Display professional identity (name, roles, photo, summary, contact info)
- **Purpose**: Create strong first impression and provide immediate access to contact methods
- **Trigger**: Loads on page entry
- **Progression**: View hero → Reveal phone (optional) → Copy contact info → Navigate to sections
- **Success criteria**: All contact actions work; privacy toggle functions; responsive across devices

### Profiles Section
- **Functionality**: Display professional and academic social profiles (LinkedIn, GitHub, Google Scholar, ORCID) as interactive icon links
- **Purpose**: Enable visitors to connect across multiple platforms and verify professional identity
- **Trigger**: Loads after hero section
- **Progression**: View profile icons → Hover for tooltip → Click to visit profile → Optional: Open menu to copy link
- **Success criteria**: Icons display with tooltips; links open in new tabs with rel="me"; copy action works; profiles ordered by importance (LinkedIn/GitHub first, then academic)

### Navigation & Routing
- **Functionality**: Smooth section navigation with active states
- **Purpose**: Allow quick access to any CV section
- **Trigger**: Click nav links or scroll
- **Progression**: Click section → Smooth scroll/route → Update active state → Show content
- **Success criteria**: Keyboard accessible; works on mobile; clear visual feedback

### Type-key Filtering
- **Functionality**: Filter content by tags (Academic, Programming, Bioinformatics, etc.)
- **Purpose**: Allow viewers to see relevant experience/projects only
- **Trigger**: Click filter chips
- **Progression**: View all → Select filter → See filtered content → Clear to reset
- **Success criteria**: Fast filtering; clear empty states; counts update correctly

### Dark/Light Mode
- **Functionality**: Toggle theme preference
- **Purpose**: Respect user preferences and reduce eye strain
- **Trigger**: Click theme toggle
- **Progression**: Click toggle → Theme switches → Preference persists
- **Success criteria**: All colors meet WCAG AA contrast; no flash on load

### Copy-to-Clipboard Actions
- **Functionality**: One-click copy for email, phone, links
- **Purpose**: Streamline contact workflows
- **Trigger**: Click copy button
- **Progression**: Click → Copy to clipboard → Show toast confirmation
- **Success criteria**: Works across browsers; clear feedback; fallback for unsupported browsers

## Edge Case Handling

- **Missing profile photo**: Show elegant placeholder with initials
- **No social profiles**: Hide social section gracefully with empty state message
- **Empty profiles section**: Display contextual message "No profiles available"
- **Invalid profile URLs**: Validate and omit profiles without valid URLs
- **Missing network names**: Display as "Profile" with globe icon
- **Network name variants**: Normalize variants (e.g., "ORCHID" → "ORCID")
- **Empty sections**: Display "Coming soon" or contextual message
- **Long names/titles**: Truncate with ellipsis; show full on hover/focus
- **Invalid URLs**: Validate and show fallback or omit
- **No phone number**: Hide phone reveal toggle entirely
- **Null dates**: Show "Present" or omit date range

## Design Direction

The design should feel **polished, confident, and contemporary** - like a high-quality design portfolio or tech company careers page. It should balance professionalism with personality, using **bold typography**, **generous whitespace**, and **purposeful color** to create visual interest without overwhelming the content.

## Color Selection

**Deep blue as the foundation** with **warm accents** to balance professionalism with approachability.

- **Primary Color**: Deep Blue `oklch(0.35 0.15 250)` - Communicates trust, intelligence, professionalism
- **Secondary Colors**: 
  - Slate Gray `oklch(0.45 0.02 250)` - Supporting text and less prominent actions
  - Light Background `oklch(0.98 0.005 250)` - Clean, spacious feel
- **Accent Color**: Warm Amber `oklch(0.70 0.15 60)` - CTAs, highlights, interactive states - draws attention without harshness
- **Foreground/Background Pairings**:
  - Primary Blue on Light Background: White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Accent Amber on Light Background: Dark text `oklch(0.25 0 0)` - Ratio 12.1:1 ✓
  - Body text: Charcoal `oklch(0.25 0.01 250)` on Light Background - Ratio 11.8:1 ✓
  - Muted text: Slate `oklch(0.50 0.02 250)` on Light Background - Ratio 4.6:1 ✓

## Font Selection

Typography should feel **modern, highly readable, and slightly distinctive** - avoiding ubiquitous choices while maintaining professional credibility.

- **Headings**: Space Grotesk (bold, geometric, distinctive character)
- **Body**: Inter (excellent readability, professional, works at all sizes)

**Typographic Hierarchy:**
- H1 (Name): Space Grotesk Bold / 48px desktop, 36px mobile / tight tracking (-0.02em)
- H2 (Section titles): Space Grotesk Bold / 32px desktop, 24px mobile / tight tracking
- H3 (Subsections): Space Grotesk SemiBold / 24px desktop, 20px mobile / normal tracking
- Body (Paragraphs): Inter Regular / 16px / line-height 1.6
- Small (Labels, meta): Inter Medium / 14px / line-height 1.5
- Button text: Inter SemiBold / 15px / letter-spacing 0.01em

## Animations

Animations should be **subtle and purposeful** - enhancing usability without calling attention to themselves. Focus on **state transitions, feedback, and spatial orientation**.

Key animation moments:
- Hero entrance: Gentle fade-up on load (300ms ease-out)
- Section reveals: Stagger children on scroll into view (100ms delay between)
- Button interactions: Scale (0.98) + subtle shadow shift on press (150ms)
- Copy feedback: Checkmark icon fade + micro-bounce (200ms)
- Theme toggle: Smooth color transition (300ms ease-in-out)
- Filter chips: Background color shift (200ms) + border pulse on select
- Phone reveal: Height expansion with ease-out curve (250ms)

## Component Selection

**Components:**
- **Card**: Section containers, project cards, experience entries - Tailwind custom with `bg-card border border-border`
- **Button**: All CTAs and actions - Shadcn Button with variants (default, outline, ghost)
- **Badge**: Role labels, skill tags, type_key filters - Shadcn Badge
- **Avatar**: Profile photo - Shadcn Avatar with fallback
- **Separator**: Section dividers - Shadcn Separator
- **Dialog**: Full bio expansion, detailed project views - Shadcn Dialog
- **Tooltip**: Icon explanations, truncated text reveals - Shadcn Tooltip
- **Tabs**: Navigation between filtered views - Shadcn Tabs
- **Accordion**: Expandable sections (education, certifications) - Shadcn Accordion
- **Toast**: Copy confirmations, action feedback - Sonner

**Customizations:**
- Custom gradient backgrounds using CSS (mesh gradients with multiple radial-gradients)
- Copy button component with clipboard API + toast integration
- Phone reveal toggle with smooth height animation
- Social link grid with hover lift effect
- Filter chip set with active state management

**States:**
- Buttons: Default → Hover (scale 1.02, shadow-md) → Active (scale 0.98) → Focus (ring-2) → Disabled (opacity-50, cursor-not-allowed)
- Inputs: Default (border-input) → Focus (border-primary, ring-2) → Error (border-destructive) → Success (border-green-500)
- Cards: Default → Hover (shadow-lg, translate-y-[-2px]) for interactive cards
- Links: Underline on hover with color shift (200ms)

**Icon Selection:**
- Contact: EnvelopeSimple, Phone, MapPin (Phosphor)
- Social: LinkedinLogo, GithubLogo, TwitterLogo, Globe (Phosphor)
- Actions: Copy, Check, Download, Eye, EyeSlash (Phosphor)
- Navigation: CaretDown, CaretUp, List (Phosphor)
- Theme: Moon, Sun (Phosphor)

**Spacing:**
- Section padding: py-16 md:py-24 (64px/96px)
- Card padding: p-6 md:p-8 (24px/32px)
- Element gaps: gap-4 (16px) for related items, gap-8 (32px) for distinct groups
- Max content width: max-w-6xl (1152px) centered

**Mobile:**
- Hero: Stack photo above text on mobile
- Navigation: Hamburger menu (Sheet component) below 768px
- Filter chips: Horizontal scroll with snap points
- Contact grid: Single column below 640px
- Typography: Reduce font sizes by ~25% on mobile (using responsive classes)
- Touch targets: Minimum 44px height for all interactive elements
