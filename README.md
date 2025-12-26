# CV/Portfolio Website

A premium, production-quality personal CV/portfolio website built with React, TypeScript, and the Spark framework. Fully driven by structured JSON data for easy customization and reusability.

## 🚀 Features

- **JSON-Driven**: Single source of truth for all CV data
- **Modern UI**: Clean, professional design with Space Grotesk and Inter typography
- **Responsive**: Mobile-first design that works beautifully on all devices
- **Accessible**: WCAG AA compliant with keyboard navigation and ARIA labels
- **Theme Support**: Light and dark modes with smooth transitions
- **Privacy Controls**: Optional phone number reveal and copy-to-clipboard functionality
- **Type-Safe**: Full TypeScript coverage with comprehensive type definitions

## 📁 Project Structure

```
src/
├── components/
│   ├── sections/
│   │   └── BasicsSection.tsx    # Hero/identity section
│   └── ui/                       # Shadcn components (40+ preinstalled)
├── data/
│   └── cv.json                   # CV data source (replace with your data)
├── lib/
│   ├── cv-data.ts               # Data provider utilities
│   ├── clipboard.ts             # Copy-to-clipboard helper
│   └── utils.ts                 # General utilities
├── types/
│   └── cv.ts                    # TypeScript type definitions
├── App.tsx                       # Main application component
└── index.css                     # Theme and global styles
```

## 🎨 Design System

**Typography:**
- Headings: Space Grotesk (Bold/SemiBold)
- Body: Inter (Regular/Medium/SemiBold)

**Colors:**
- Primary: Deep Blue `oklch(0.35 0.15 250)` - Trust and professionalism
- Accent: Warm Amber `oklch(0.70 0.15 60)` - Highlights and CTAs
- Background: Light `oklch(0.98 0.005 250)` - Clean, spacious feel

**Components:**
- Built with Shadcn UI v4 components
- Phosphor Icons for consistent iconography
- Framer Motion for subtle animations (when needed)

## 🔧 How to Use

### Running the App

The Spark environment is pre-configured. The app runs automatically in your Spark workspace.

### Customizing with Your Data

1. **Replace the CV JSON:**
   Edit `src/data/cv.json` with your personal information. The JSON schema is defined in `src/types/cv.ts`.

2. **Required fields for basics section:**
   ```json
   {
     "basics": {
       "name": "Your Name",
       "label": "Your Title · Your Role",
       "email": "your.email@example.com",
       "summary": "Your professional summary...",
       "location": {
         "city": "Your City",
         "region": "Your State/Province",
         "country": "Your Country"
       },
       "profiles": [
         {
           "network": "GitHub",
           "username": "yourusername",
           "url": "https://github.com/yourusername"
         }
       ]
     }
   }
   ```

3. **Optional fields:**
   - `phone`: Include `countryCode`, `number`, and `formatted` for privacy-controlled display
   - `Pictures`: Array of `{type_of: "profile", URL: "https://..."}` for profile photo
   - `url`: Personal website URL
   - `birthDate`: ISO date (hidden by default for privacy)

### Data Privacy Guidelines

- Phone numbers are hidden behind a "Show phone" toggle
- Email includes copy-to-clipboard for convenience
- No sensitive data is stored in Spark's shared store
- All CV data lives in local JSON files within the project

## 🎯 Current Implementation Status

**✅ Completed (Step 1):**
- Basics/Hero section with:
  - Profile photo with fallback to initials
  - Name, roles, and location display
  - Expandable professional summary
  - Social profile links (GitHub, LinkedIn, Twitter, etc.)
  - Email with copy-to-clipboard
  - Privacy-controlled phone number display
  - Responsive layout
  - Dark/light theme support

**🔜 Coming in Future Steps:**
- Work experience section
- Education section
- Skills section with type_key filtering
- Projects showcase
- Publications
- Certifications
- Languages
- References
- Navigation and routing
- Print/PDF export

## 🏗️ Architecture Decisions

**Why JSON-driven?**
- Single source of truth for all content
- Easy to update without touching code
- Portable: swap JSON to use for another person
- Can be generated from other systems (LinkedIn export, etc.)

**Why local data storage?**
- Privacy: No personal data in Spark's shared store
- Portability: Bundle with the project
- Performance: No network requests for core data

**Why TypeScript?**
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Self-documenting code with interface definitions

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

Your CV data and customizations remain your own.
