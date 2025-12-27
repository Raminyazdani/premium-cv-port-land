# Language Selection - Quick Reference

## 🚀 Quick Start

### Switch Language (User)
1. Click globe icon in header
2. Select: English / Deutsch / فارسی
3. Content updates automatically
4. Language persists across refresh

### Use in Components (Developer)
```tsx
import { useCVData } from '@/context/CVDataContext'
import { extractBasics, getFullName } from '@/lib/cv-data'

function MyComponent() {
  const { data } = useCVData()  // Always English schema!
  const basics = extractBasics(data)
  const name = getFullName(basics)
  
  return <h1>{name}</h1>
}
```

### UI Translations
```tsx
import { useTranslation } from '@/context/LanguageContext'

function MyComponent() {
  const t = useTranslation()
  
  return (
    <div>
      <h2>{t.sections.education}</h2>  {/* "Education" / "Bildung" / "تحصیلات" */}
      <button>{t.actions.download_cv}</button>
    </div>
  )
}
```

---

## 🔑 Key Files

| Purpose | File | What It Does |
|---------|------|--------------|
| **Language State** | `src/context/LanguageContext.tsx` | Manages current language, RTL state |
| **Data Provider** | `src/context/CVDataContext.tsx` | Provides normalized CV data |
| **Normalization** | `src/utils/dataNormalizer.ts` | Converts DE/FA → EN schema |
| **Key Mappings** | `src/config/keyMappings.ts` | Maps keys across languages |
| **UI Strings** | `src/lib/i18n.ts` | Translates buttons, labels, headings |
| **Language Selector** | `src/components/LanguageSelector.tsx` | Dropdown component |

---

## 📝 Common Tasks

### Add a New Section Component
```tsx
import { useCVData } from '@/context/CVDataContext'

export function MySection() {
  const { data } = useCVData()
  const items = data.my_section || []  // Always use English keys!
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )
}
```

### Check Current Language
```tsx
import { useLanguage } from '@/context/LanguageContext'

function MyComponent() {
  const { language, isRTL } = useLanguage()
  
  if (language === 'fa') {
    // Persian-specific logic
  }
  
  if (isRTL) {
    // RTL-specific styling
  }
}
```

### Change Language Programmatically
```tsx
import { useLanguage } from '@/context/LanguageContext'

function LanguageButton() {
  const { setLanguage } = useLanguage()
  
  return (
    <button onClick={() => setLanguage('de')}>
      Deutsch
    </button>
  )
}
```

---

## ⚠️ Do's and Don'ts

### ✅ DO
- Use `useCVData()` hook to get data
- Use English keys in your components (`basics`, `education`, etc.)
- Use `useTranslation()` for UI text
- Extract helpers from `cv-data.ts` (e.g., `extractBasics()`, `getFullName()`)

### ❌ DON'T
- Import JSON files directly (`import cv from '@/data/cv.json'` ❌)
- Use deprecated functions (`getBasics()`, `getProfiles()` ❌)
- Hardcode UI text in English (`"Education"` ❌ → use `t.sections.education` ✅)
- Modify locked files (`cv.json`, `ramin_de.json`, `ramin_fa.json` ❌)

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Language Switching
```bash
# Start dev server
npm run dev

# Open browser
http://localhost:5173/?lang=de  # German
http://localhost:5173/?lang=fa  # Persian (RTL)
http://localhost:5173/?lang=en  # English
```

### Regenerate Hashes (After Authorized File Changes)
```bash
node tests/generate-hashes.js
```

---

## 🔒 Locked Files

**Never modify these files directly:**
- `src/data/cv.json`
- `src/data/ramin_de.json`
- `src/data/ramin_fa.json`

**Why?** Tests will fail (hash mismatch).

**If you must update:** Get approval, make changes, run `node tests/generate-hashes.js`

---

## 🐛 Troubleshooting

### Data doesn't update when switching language
- ✅ Verify component uses `useCVData()` (not direct import)
- ✅ Check console for errors
- ✅ Verify JSON files exist and are valid

### RTL not working for Persian
- ✅ Check `<html dir="rtl">` is set (inspect element)
- ✅ Verify `src/styles/rtl.css` exists and is imported
- ✅ Check if component has hardcoded `text-align: left`

### Tests failing (hash mismatch)
- ⚠️ Someone modified a locked file!
- ❌ **DO NOT** regenerate hashes without approval
- ✅ Revert changes to locked files
- ✅ If intentional, get approval → run `node tests/generate-hashes.js`

### UI text not translating
- ✅ Check if using `useTranslation()` hook
- ✅ Verify key exists in `src/lib/i18n.ts`
- ✅ Add missing translations for DE/FA

---

## 📚 Full Documentation

- **Complete Guide**: `LANGUAGE_IMPLEMENTATION_FINAL_REPORT.md`
- **Summary**: `LANGUAGE_IMPLEMENTATION_SUMMARY.md`
- **This Quick Ref**: `LANGUAGE_QUICK_REFERENCE.md`

---

## 🆘 Help

1. Read full documentation
2. Check inline code comments
3. Run tests: `npm test`
4. Check console warnings
5. Ask team for guidance

---

**Last Updated**: 2025-01-30
