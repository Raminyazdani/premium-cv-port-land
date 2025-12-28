# German CV Translation Report

## Summary

This report documents the translation of the English CV JSON to German, including all keys and translatable values.

## Files

| File | Purpose | Status |
|------|---------|--------|
| `frontend/src/data/cv.json` | English source (canonical) | **READ ONLY** - Not modified |
| `ramin_de.json` | German translation output | Created at repo root |
| `tools/validate_translation.py` | Validation script | Created |

## Source File Integrity

The English source file was **NOT modified** during this translation process.

| Metric | Value |
|--------|-------|
| **Source Path** | `frontend/src/data/cv.json` |
| **SHA256 Hash (Before)** | `c62f32a8a4319502b093cb7254ef3a7068a581e8b96b700e350c5b7bdca432a1` |
| **SHA256 Hash (After)** | `c62f32a8a4319502b093cb7254ef3a7068a581e8b96b700e350c5b7bdca432a1` |
| **Integrity Verified** | ✓ Hash identical |

## German Translation Details

| Metric | Value |
|--------|-------|
| **Output Path** | `ramin_de.json` (repo root) |
| **SHA256 Hash** | `66d7802c46aaed01242f23af5bac06e9bbc50a77641503c214ed7187f83f94f0` |
| **Encoding** | UTF-8 |
| **Valid JSON** | ✓ Yes |

## Structural Validation

All sections match between English source and German translation:

| Section (EN) | Section (DE) | Array Length | Status |
|--------------|--------------|--------------|--------|
| basics | grunddaten | 1 | ✓ |
| profiles | profile | 4 | ✓ |
| education | ausbildung | 5 | ✓ |
| languages | sprachen | 3 | ✓ |
| workshop_and_certifications | schulungen_und_zertifikate | 10 | ✓ |
| skills | faehigkeiten | 8 categories | ✓ |
| experiences | erfahrungen | 5 | ✓ |
| projects | projekte | 26 | ✓ |
| publications | publikationen | 5 | ✓ |
| references | referenzen | 5 | ✓ |

## Key Translation Summary

### Top-Level Keys

| English Key | German Key |
|-------------|------------|
| `basics` | `grunddaten` |
| `profiles` | `profile` |
| `education` | `ausbildung` |
| `languages` | `sprachen` |
| `workshop_and_certifications` | `schulungen_und_zertifikate` |
| `skills` | `faehigkeiten` |
| `experiences` | `erfahrungen` |
| `projects` | `projekte` |
| `publications` | `publikationen` |
| `references` | `referenzen` |

### Nested Keys (Examples)

| English Key | German Key |
|-------------|------------|
| `fname` | `vorname` |
| `lname` | `nachname` |
| `email` | `e_mail` |
| `phone` | `telefon` |
| `birthDate` | `geburtsdatum` |
| `summary` | `zusammenfassung` |
| `location` | `standort` |
| `studyType` | `abschlussart` |
| `description` | `beschreibung` |
| `title` | `titel` |
| `type_key` | `typ_schluessel` |

## Values Deliberately Unchanged

Per the translation rules, the following values were preserved unchanged:

### Identifiers & Technical Data
- All URLs (e.g., GitHub, LinkedIn, Cloudinary, publication links)
- All email addresses
- All phone numbers
- ISO date formats (e.g., `2024-10-20`, `2023-12-28`)
- UUIDs (e.g., Google Scholar ID)
- Numeric scores (e.g., GPA values, IELTS scores)

### Technology Names & Proper Nouns
- Programming languages: Python, R, C++, JavaScript
- Frameworks: Django, React, Flask, FastAPI, Express.js
- Tools: Docker, Kubernetes, Git, Selenium, BeautifulSoup
- Libraries: TensorFlow, PyTorch, scikit-learn, Jupyter
- Databases: PostgreSQL, MySQL, MongoDB, SQLite
- Bioinformatics tools: BLAST, KEGG, QIIME2, DESeq2, Seurat
- Lab techniques: PCR, qPCR, ELISA, HPLC, FACS
- Standards: GLP, GMP, IELTS, DOI, ISBN, ISSN

### Institution Names & Locations
- University names retained with German translation where applicable
- Location names kept as proper nouns (Saarbrücken, Tehran, Karaj)

## Type_Key Translation

The `type_key` arrays were translated consistently:

| English Value | German Value |
|---------------|--------------|
| `Full CV` | `Voller_Lebenslauf` |
| `Biotechnology` | `Biotechnologie` |
| `Academic` | `Akademisch` |
| `Bioinformatics` | `Bioinformatik` |
| `Programming` | `Programmierung` |
| `Student Projects` | `Studentische_Projekte` |

## Manual Spot-Check Results

### 1. Basics/Profile Section
✓ Summary translated to professional German
✓ Labels translated (Biotechnologe, Entwickler, Data Scientist, Bioinformatiker)
✓ Location details preserved with German field names

### 2. Education Entries (Sampled 2)
✓ "Saarland University" → "Universität des Saarlandes"
✓ "University of Tehran" → "Universität Teheran"
✓ Study types translated (Master's → Master, Bachelor's → Bachelor)
✓ Areas translated (Bioinformatics → Bioinformatik)

### 3. Experience Entries (Sampled 2)
✓ "Full-stack Developer" → "Full-Stack-Entwickler"
✓ "Bioinformatics Researcher" → "Bioinformatik-Forscher"
✓ Descriptions professionally translated to German
✓ Dates preserved in original format

### 4. Project Entries (Sampled 3)
✓ Titles translated to German
✓ Descriptions comprehensively translated
✓ Technical tool names preserved (Django, React, PostgreSQL)
✓ URLs unchanged

### 5. Certifications (Sampled 1 issuer)
✓ "University of Tehran" → "Universität Teheran"
✓ Certification names translated to German
✓ Duration format adapted (hours → Stunden, weeks → Wochen)
✓ Certificate URLs preserved

## Validation Script

A validation script was created at `tools/validate_translation.py` that checks:

1. ✓ JSON parsing (both files valid)
2. ✓ Structural equality (same sections, same array lengths)
3. ✓ URL preservation
4. ✓ Email preservation
5. ✓ Date format preservation
6. ⚠ Key translation (some keys intentionally unchanged for app compatibility)

## Notes

1. Some field keys like `institution`, `logo_url`, `name`, `position`, `url` are intentionally kept in their original form for compatibility with the application's data normalization layer (see `frontend/src/utils/dataNormalizer.ts`).

2. The translation uses professional German CV terminology and maintains consistency throughout all sections.

3. All German text uses proper capitalization (nouns capitalized) and grammar.

## Self-Overseer Checklist

- [x] `cv.json` unchanged (hash identical: `c62f32a8...`)
- [x] `ramin_de.json` parses and matches structure/array lengths
- [x] Top-level keys translated to German
- [x] Values translated except allowed tokens (URLs, emails, tech names, dates)
- [x] URLs/emails/dates/numbers preserved exactly
- [x] Report file created with validation evidence

---

*Generated: 2025-12-28*
