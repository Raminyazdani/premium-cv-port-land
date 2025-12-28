#!/usr/bin/env python3
"""
Validation script for German CV translation.
Checks structural equality, value preservation, and translation completeness.
"""

import json
import re
import hashlib
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Key mapping from English to German (for top-level sections only)
TOP_LEVEL_KEY_MAPPING = {
    "basics": "grunddaten",
    "profiles": "profile",
    "education": "ausbildung",
    "languages": "sprachen",
    "workshop_and_certifications": "schulungen_und_zertifikate",
    "skills": "faehigkeiten",
    "experiences": "erfahrungen",
    "projects": "projekte",
    "publications": "publikationen",
    "references": "referenzen",
}

# Keys that are intentionally kept unchanged for app compatibility
ALLOWED_UNCHANGED_KEYS = {
    "institution",  # Used across multiple sections
    "logo_url",     # Technical field
    "url",          # URL field
    "name",         # Generic name field
    "position",     # Position title
    "status",       # Status field
    "uuid",         # Identifier
    "doi",          # DOI identifier
    "issn",         # ISSN identifier
    "isbn",         # ISBN identifier
    "repository_url",  # URL field
    "GER",          # German translation of CEFR
}

# Values that should NOT be changed
URL_PATTERN = re.compile(r'https?://[^\s]+')
EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
DATE_PATTERN = re.compile(r'\d{4}-\d{2}-\d{2}')

# Common English words to detect untranslated content
ENGLISH_STOPWORDS = {
    'the', 'and', 'with', 'developed', 'built', 'implemented', 'created',
    'designed', 'worked', 'managed', 'performed', 'responsible', 'for',
    'utilizing', 'including', 'various', 'multiple', 'comprehensive'
}

# Tech terms that should remain unchanged
TECH_TERMS = {
    'Python', 'Django', 'React', 'Flask', 'FastAPI', 'JavaScript', 'TypeScript',
    'Node.js', 'Express', 'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'AWS', 'Azure',
    'TensorFlow', 'PyTorch', 'scikit-learn', 'Jupyter', 'BLAST', 'KEGG',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'REST', 'API', 'JSON', 'CSV',
    'IELTS', 'GLP', 'GMP', 'PCR', 'qPCR', 'ELISA', 'HPLC', 'FACS',
    'RNA', 'DNA', 'ChIP-Seq', 'RNA-seq', 'Pichia pastoris', 'Selenium',
    'BeautifulSoup', 'Jinja2', 'XeLaTeX', 'LaTeX', 'Markdown', 'PDF'
}


def load_json(path: Path) -> Dict:
    """Load JSON file with UTF-8 encoding."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def compute_hash(path: Path) -> str:
    """Compute SHA256 hash of file."""
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def count_elements(data: Any, path: str = "") -> List[Tuple[str, int]]:
    """Count elements at each path in the JSON structure."""
    results = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            new_path = f"{path}.{key}" if path else key
            results.extend(count_elements(value, new_path))
    elif isinstance(data, list):
        results.append((path, len(data)))
        for i, item in enumerate(data):
            new_path = f"{path}[{i}]"
            results.extend(count_elements(item, new_path))
    
    return results


def extract_urls(data: Any) -> List[str]:
    """Extract all URLs from JSON data."""
    urls = []
    
    if isinstance(data, str):
        urls.extend(URL_PATTERN.findall(data))
    elif isinstance(data, dict):
        for value in data.values():
            urls.extend(extract_urls(value))
    elif isinstance(data, list):
        for item in data:
            urls.extend(extract_urls(item))
    
    return urls


def extract_emails(data: Any) -> List[str]:
    """Extract all email addresses from JSON data."""
    emails = []
    
    if isinstance(data, str):
        emails.extend(EMAIL_PATTERN.findall(data))
    elif isinstance(data, dict):
        for value in data.values():
            emails.extend(extract_emails(value))
    elif isinstance(data, list):
        for item in data:
            emails.extend(extract_emails(item))
    
    return emails


def extract_dates(data: Any) -> List[str]:
    """Extract all ISO dates from JSON data."""
    dates = []
    
    if isinstance(data, str):
        dates.extend(DATE_PATTERN.findall(data))
    elif isinstance(data, dict):
        for value in data.values():
            dates.extend(extract_dates(value))
    elif isinstance(data, list):
        for item in data:
            dates.extend(extract_dates(item))
    
    return dates


def check_english_keys(data: Any, path: str = "") -> List[str]:
    """Check if any English keys remain in German translation."""
    issues = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            # Check if key is in top-level English mapping (should be translated)
            if key in TOP_LEVEL_KEY_MAPPING:
                issues.append(f"English top-level key found at {path}: '{key}'")
            new_path = f"{path}.{key}" if path else key
            issues.extend(check_english_keys(value, new_path))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            issues.extend(check_english_keys(item, f"{path}[{i}]"))
    
    return issues


def check_untranslated_values(data: Any, path: str = "") -> List[str]:
    """Check for potentially untranslated English values."""
    issues = []
    
    if isinstance(data, str):
        # Skip URLs, emails, tech terms
        if URL_PATTERN.search(data) or EMAIL_PATTERN.search(data):
            return issues
        
        # Check for common English stopwords
        words = set(data.lower().split())
        found_stopwords = words & ENGLISH_STOPWORDS
        
        # Only report if not a tech term
        if found_stopwords and not any(term.lower() in data.lower() for term in TECH_TERMS):
            issues.append(f"Possibly untranslated at {path}: '{data[:100]}...' (found: {found_stopwords})")
    
    elif isinstance(data, dict):
        for key, value in data.items():
            new_path = f"{path}.{key}" if path else key
            issues.extend(check_untranslated_values(value, new_path))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            issues.extend(check_untranslated_values(item, f"{path}[{i}]"))
    
    return issues


def validate_translation(en_path: Path, de_path: Path) -> Dict[str, Any]:
    """Run full validation on translation."""
    results = {
        "passed": True,
        "errors": [],
        "warnings": [],
        "info": {}
    }
    
    # Load files
    try:
        en_data = load_json(en_path)
        de_data = load_json(de_path)
    except json.JSONDecodeError as e:
        results["passed"] = False
        results["errors"].append(f"JSON parse error: {e}")
        return results
    
    # Compute hashes
    results["info"]["en_hash"] = compute_hash(en_path)
    results["info"]["de_hash"] = compute_hash(de_path)
    
    # Check top-level key translation
    en_keys = set(en_data.keys())
    de_keys = set(de_data.keys())
    
    expected_de_keys = {TOP_LEVEL_KEY_MAPPING.get(k, k) for k in en_keys}
    
    if de_keys != expected_de_keys:
        missing = expected_de_keys - de_keys
        extra = de_keys - expected_de_keys
        if missing:
            results["errors"].append(f"Missing German keys: {missing}")
            results["passed"] = False
        if extra:
            results["warnings"].append(f"Unexpected German keys: {extra}")
    
    # Check array lengths
    section_mapping = {
        "basics": "grunddaten",
        "profiles": "profile",
        "education": "ausbildung",
        "languages": "sprachen",
        "workshop_and_certifications": "schulungen_und_zertifikate",
        "experiences": "erfahrungen",
        "projects": "projekte",
        "publications": "publikationen",
        "references": "referenzen"
    }
    
    for en_key, de_key in section_mapping.items():
        en_val = en_data.get(en_key, [])
        de_val = de_data.get(de_key, [])
        
        if isinstance(en_val, list) and isinstance(de_val, list):
            if len(en_val) != len(de_val):
                results["errors"].append(
                    f"Array length mismatch: {en_key} has {len(en_val)}, {de_key} has {len(de_val)}"
                )
                results["passed"] = False
    
    # Check URLs preserved
    en_urls = set(extract_urls(en_data))
    de_urls = set(extract_urls(de_data))
    
    if en_urls != de_urls:
        missing_urls = en_urls - de_urls
        if missing_urls:
            results["errors"].append(f"URLs changed: {len(missing_urls)} URLs missing from German")
            results["passed"] = False
    
    # Check emails preserved
    en_emails = set(extract_emails(en_data))
    de_emails = set(extract_emails(de_data))
    
    if en_emails != de_emails:
        results["errors"].append("Email addresses changed in translation")
        results["passed"] = False
    
    # Check dates preserved
    en_dates = set(extract_dates(en_data))
    de_dates = set(extract_dates(de_data))
    
    if en_dates != de_dates:
        results["warnings"].append(f"Date format differences: EN has {len(en_dates)}, DE has {len(de_dates)}")
    
    # Check for untranslated English values (warnings only)
    untranslated = check_untranslated_values(de_data)
    if untranslated:
        results["warnings"].extend(untranslated[:10])  # Limit to 10 warnings
    
    # Check for remaining English keys
    english_keys = check_english_keys(de_data)
    if english_keys:
        results["errors"].extend(english_keys[:10])
        results["passed"] = False
    
    return results


def main():
    """Run validation and print results."""
    repo_root = Path(__file__).parent.parent
    
    en_path = repo_root / "frontend" / "src" / "data" / "cv.json"
    de_path = repo_root / "ramin_de.json"
    
    print("=" * 60)
    print("German CV Translation Validation")
    print("=" * 60)
    print()
    
    if not en_path.exists():
        print(f"ERROR: English source not found at {en_path}")
        return 1
    
    if not de_path.exists():
        print(f"ERROR: German translation not found at {de_path}")
        return 1
    
    results = validate_translation(en_path, de_path)
    
    print(f"Source file: {en_path}")
    print(f"Source hash: {results['info'].get('en_hash', 'N/A')}")
    print()
    print(f"Output file: {de_path}")
    print(f"Output hash: {results['info'].get('de_hash', 'N/A')}")
    print()
    
    if results["errors"]:
        print("ERRORS:")
        for error in results["errors"]:
            print(f"  ✗ {error}")
        print()
    
    if results["warnings"]:
        print("WARNINGS:")
        for warning in results["warnings"]:
            print(f"  ⚠ {warning}")
        print()
    
    if results["passed"]:
        print("✓ VALIDATION PASSED")
        return 0
    else:
        print("✗ VALIDATION FAILED")
        return 1


if __name__ == "__main__":
    exit(main())
