# Translation Report: English CV → Persian (Farsi)

## Files Read/Written

| Operation | File Path | Description |
|-----------|-----------|-------------|
| Read | `frontend/src/data/cv.json` | English canonical CV (source of truth) |
| Written | `ramin_fa.json` | Persian translation at repo root |
| Written | `tools/validate_translation.py` | Validation script |

## Source File Integrity

- **Source file**: `frontend/src/data/cv.json`
- **SHA256 hash before**: `c62f32a8a4319502b093cb7254ef3a7068a581e8b96b700e350c5b7bdca432a1`
- **SHA256 hash after**: `c62f32a8a4319502b093cb7254ef3a7068a581e8b96b700e350c5b7bdca432a1`
- **Status**: ✅ **UNCHANGED** (byte-identical)

## Output File

- **Output file**: `ramin_fa.json`
- **SHA256 hash**: `a2354a1e4c916cdce3f9a530073a39449b5c2c8094f29af43cf74b0d816b3f31`
- **JSON validity**: ✅ Valid UTF-8 JSON
- **Encoding**: UTF-8, no BOM

## Validation Results

### Automated Checks

| Check | Status | Notes |
|-------|--------|-------|
| JSON parses | ✅ Pass | Both EN and FA parse successfully |
| Array lengths match | ✅ Pass | All sections have matching item counts |
| URLs preserved | ✅ Pass | All URLs unchanged |
| Emails preserved | ✅ Pass | All email addresses unchanged |
| Dates preserved | ✅ Pass | ISO format dates unchanged |
| Structure match | ✅ Pass | Same nesting structure |

### Section Counts

| Section | EN Count | FA Count | Match |
|---------|----------|----------|-------|
| basics | 1 | 1 | ✅ |
| profiles | 4 | 4 | ✅ |
| education | 5 | 5 | ✅ |
| languages | 3 | 3 | ✅ |
| workshop_and_certifications | 10 | 10 | ✅ |
| experiences | 5 | 5 | ✅ |
| projects | 26 | 26 | ✅ |
| publications | 5 | 5 | ✅ |
| references | 5 | 5 | ✅ |
| skills (top-level categories) | 8 | 8 | ✅ |

## Key Translation Dictionary

| English Key | Persian Key (فارسی) |
|-------------|---------------------|
| `basics` | `اطلاعات_پایه` |
| `profiles` | `پروفایل‌ها` |
| `education` | `تحصیلات` |
| `languages` | `زبان‌ها` |
| `workshop_and_certifications` | `کارگاه‌ها_و_گواهی‌ها` |
| `skills` | `مهارت‌ها` |
| `experiences` | `سوابق` |
| `projects` | `پروژه‌ها` |
| `publications` | `انتشارات` |
| `references` | `معرف‌ها` |
| `fname` | `نام_کوچک` |
| `lname` | `نام_خانوادگی` |
| `email` | `ایمیل` |
| `phone` | `تلفن` |
| `summary` | `خلاصه` |
| `institution` | `مؤسسه` |
| `studyType` | `مقطع` |
| `startDate` | `تاریخ_شروع` |
| `endDate` | `تاریخ_پایان` |
| `title` | `عنوان` |
| `description` | `توضیحات` |
| `url` | `پیوند` |
| `name` | `نام` |
| `position` | `سمت` |
| `role` | `نقش` |
| `duration` | `مدت` |
| `type_key` | `کلید_نوع` |

## Values Deliberately Left Unchanged

Per the issue requirements, the following types of values were preserved in their original form:

### 1. URLs and Links
All URLs (https://, http://) were preserved exactly, including:
- GitHub profile URLs
- LinkedIn, ORCID, Google Scholar URLs
- Certificate/document URLs on Cloudinary
- Publication URLs

### 2. Email Addresses
- `raya00001@stud.uni-saarland.de`
- All reference email addresses

### 3. Phone Numbers
- `+49 (0) 176 666 52181`
- Reference phone numbers

### 4. Dates (ISO Format)
- `2024-10-20`, `2023-12-28`, etc.
- All dates in ISO format preserved exactly

### 5. Technical/Tool Names
Technology names kept in Latin script:
- Python, Django, React, JavaScript, TypeScript
- TensorFlow, PyTorch, scikit-learn
- Docker, Kubernetes, Git, GitHub
- PostgreSQL, MySQL, MongoDB, Redis
- BLAST, HPLC, PCR, qPCR, ELISA
- HTML, CSS, Bootstrap, Tailwind
- All bioinformatics tools (Bowtie2, BWA, HISAT2, etc.)

### 6. Standard Identifiers
- DOI, ISBN, ISSN, PMID, PMCID, arXiv
- UUID/unique identifiers

### 7. Proper Nouns
- Personal names (author names, supervisor names)
- Company names (Kamadani Foodstuff Trading LLC, etc.)
- University names kept as-is or with widely-used Persian forms
- Institution names in references

### 8. Academic/Scientific Terms with Acronyms
- GLP, GMP (kept with English acronym)
- CEFR language level codes
- RSM, DoE, CSTR (scientific methodology terms)

## Persian Writing Quality Notes

1. **نیم‌فاصله**: Used appropriately in compound words (e.g., `زیست‌فناوری`, `برنامه‌نویسی`)
2. **Professional terminology**: Used standard Persian CV terminology
3. **RTL-compatible**: Text flows naturally right-to-left
4. **No placeholder strings**: No "نامشخص", "undefined", or similar placeholders introduced
5. **Consistent style**: Same terminology used consistently across sections

## Self-Overseer Checklist

- [x] `cv.json` unchanged (hash identical: `c62f32a8a...`)
- [x] `ramin_fa.json` parses and matches structure/array lengths
- [x] All keys translated to Persian, no English section keys remain
- [x] Values translated except allowed tokens; no obvious English sentences remain
- [x] URLs/emails/dates/numbers preserved exactly
- [x] Report file created with validation evidence

## Validation Script

A validation script is provided at `tools/validate_translation.py` that can be run to verify:

```bash
python3 tools/validate_translation.py
```

The script checks:
1. JSON parsing (both EN and FA)
2. Structural equality (array lengths)
3. URL preservation
4. Detection of untranslated English content
5. Persian text presence verification

---

*Generated: 2025-12-28*
