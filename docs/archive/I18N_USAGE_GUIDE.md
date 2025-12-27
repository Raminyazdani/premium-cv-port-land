# I18N Usage Guide

## Quick Reference for Developers

### How to Use Translations in Components

#### 1. Import the Translation Hook

```typescript
import { useTranslation } from '@/context/LanguageContext'
```

#### 2. Get the Translation Object in Your Component

```typescript
function MyComponent() {
  const t = useTranslation()
  
  return (
    <div>
      <h1>{t.sections.education}</h1>
      <Button>{t.actions.download_cv}</Button>
      <p>{t.empty.no_data}</p>
    </div>
  )
}
```

### Available Translation Categories

All translations are organized into these categories:

- **`t.nav.*`** - Navigation menu items (home, about, education, etc.)
- **`t.sections.*`** - Section headings (hero, basics, education, projects, etc.)
- **`t.actions.*`** - Action buttons and links (download_cv, contact_me, copy, etc.)
- **`t.forms.*`** - Form labels and messages (name, email, send, success_message, etc.)
- **`t.education.*`** - Education-specific terms (institution, degree, gpa, etc.)
- **`t.experience.*`** - Experience-specific terms (role, responsibilities, etc.)
- **`t.projects.*`** - Project-specific terms (view_project, view_code, etc.)
- **`t.publications.*`** - Publication-specific terms (type, authors, journal, etc.)
- **`t.skills.*`** - Skills-specific terms (proficiency, category, etc.)
- **`t.languages_section.*`** - Language proficiency terms (native, fluent, etc.)
- **`t.references.*`** - Reference-specific terms (position, department, etc.)
- **`t.footer.*`** - Footer text (copyright, built_with, etc.)
- **`t.filters.*`** - Filter options (all, programming, bioinformatics, etc.)
- **`t.empty.*`** - Empty state messages (no_data, no_results, etc.)
- **`t.a11y.*`** - Accessibility labels (skip_to_content, menu, etc.)
- **`t.booking.*`** - Booking widget text (title, video_call, phone_call, etc.)
- **`t.validation.*`** - Validation error messages (required, invalid_email, etc.)
- **`t.loading.*`** - Loading state messages (loading, please_wait)

### String Interpolation

For dynamic content (like copyright year), use the `interpolate` function:

```typescript
import { interpolate } from '@/lib/i18n'
import { useTranslation } from '@/context/LanguageContext'

function Footer() {
  const t = useTranslation()
  const currentYear = new Date().getFullYear()
  const name = 'John Doe'
  
  return (
    <p>
      {interpolate(t.footer.copyright, { year: currentYear, name })}
    </p>
  )
}
```

### Switching Languages

Users can switch languages through the `LanguageSelector` component in the header. When the language changes:

1. The `LanguageContext` updates the global language state
2. The `CVDataContext` automatically reloads the correct CV data (EN/DE/FA)
3. All UI text updates through the `useTranslation()` hook
4. The HTML `lang` and `dir` attributes are updated for accessibility
5. RTL layout is applied when Persian is selected

### Adding New Translation Keys

If you need to add new UI text:

1. **Update the TypeScript interface** in `/src/lib/i18n.ts`:

```typescript
export interface UIStrings {
  // ... existing categories ...
  
  my_new_category: {
    my_key: string
    another_key: string
  }
}
```

2. **Add translations for all three languages** (EN/DE/FA):

```typescript
const translations: Record<Language, UIStrings> = {
  en: {
    // ... existing translations ...
    my_new_category: {
      my_key: 'My English Text',
      another_key: 'Another English Text'
    }
  },
  
  de: {
    // ... existing translations ...
    my_new_category: {
      my_key: 'Mein deutscher Text',
      another_key: 'Ein anderer deutscher Text'
    }
  },
  
  fa: {
    // ... existing translations ...
    my_new_category: {
      my_key: 'متن فارسی من',
      another_key: 'متن فارسی دیگر'
    }
  }
}
```

3. **Use the new translation** in your component:

```typescript
const t = useTranslation()
return <p>{t.my_new_category.my_key}</p>
```

### Testing

Run the i18n tests to ensure all dictionaries have identical key sets:

```bash
npm test
```

The tests verify:
- All three languages (EN/DE/FA) have identical key structures
- No missing or empty translations
- Translation functions work correctly
- Interpolation works as expected

### Best Practices

1. **Never hardcode UI strings** - Always use the translation system
2. **Keep keys semantic** - Name keys by their purpose, not their content
3. **Use interpolation for dynamic values** - Don't concatenate strings
4. **Test in all languages** - Verify your changes work in EN, DE, and FA
5. **Consider RTL layout** - Persian uses RTL, so ensure your UI adapts properly
6. **Use proper nouns sparingly** - Most text should be translated

### Common Mistakes to Avoid

❌ **Don't** hardcode strings:
```typescript
<Button>Download CV</Button>
```

✅ **Do** use translations:
```typescript
<Button>{t.actions.download_cv}</Button>
```

❌ **Don't** concatenate strings:
```typescript
const message = 'Hello ' + name + ', you have ' + count + ' messages'
```

✅ **Do** use interpolation:
```typescript
const message = interpolate(t.greeting, { name, count })
```

❌ **Don't** assume LTR layout:
```typescript
<div className="ml-4"> {/* Wrong for RTL languages */}
```

✅ **Do** use logical properties or conditional classes:
```typescript
<div className="ms-4"> {/* Works for both LTR and RTL */}
```

### RTL Support

When the user selects Persian (FA), the application automatically:

1. Sets `<html dir="rtl" lang="fa">` 
2. Applies RTL-aware CSS (see `/src/styles/rtl.css`)
3. Flips layout directions using CSS logical properties
4. Maintains LTR for specific content (emails, URLs, code) using `unicode-bidi: plaintext`

### Language Detection

The system detects the initial language from:

1. URL parameter (`?lang=en`, `?lang=de`, `?lang=fa`)
2. LocalStorage (persisted from previous visits)
3. Browser language preference
4. Defaults to English if none of the above

The selected language is:
- Stored in localStorage for persistence
- Reflected in the URL query parameter
- Used to load the appropriate CV JSON file
- Used to determine which UI dictionary to display

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  (Components use useTranslation() to get UI strings)       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  LanguageContext                            │
│  - Stores current language (en/de/fa)                      │
│  - Provides useTranslation() hook                          │
│  - Updates HTML lang/dir attributes                        │
│  - Persists to localStorage                                │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
┌───────▼────────┐              ┌─────────▼─────────┐
│  UI Strings    │              │    CV Data        │
│  (i18n.ts)     │              │ (CVDataContext)   │
│                │              │                   │
│ - EN Dict      │              │ Loads & normalizes│
│ - DE Dict      │              │ language-specific │
│ - FA Dict      │              │ JSON files        │
└────────────────┘              └───────────────────┘
```

### Troubleshooting

**Problem**: Translations not updating when language changes

**Solution**: Ensure you're using `useTranslation()` hook, not importing translations directly

---

**Problem**: Missing translation key

**Solution**: Check the TypeScript interface and ensure the key exists in all three language dictionaries

---

**Problem**: RTL layout broken for Persian

**Solution**: Use CSS logical properties (`ms-*`, `me-*`, `start`, `end`) instead of physical ones (`ml-*`, `mr-*`, `left`, `right`)

---

**Problem**: Tests failing after adding new keys

**Solution**: Ensure all three language dictionaries (EN/DE/FA) have the exact same key structure

---

For more details, see:
- `/src/lib/i18n.ts` - Translation dictionaries
- `/src/context/LanguageContext.tsx` - Language state management
- `/src/context/CVDataContext.tsx` - CV data loading per language
- `/src/lib/__tests__/i18n.test.ts` - i18n tests
