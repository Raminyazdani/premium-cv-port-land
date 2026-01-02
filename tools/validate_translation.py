#!/usr/bin/env python3
"""
Validation script for Persian CV translation.
Checks structural equality, key translation completeness, and value preservation.

Usage:
    python3 validate_translation.py [--en-file PATH] [--fa-file PATH]
"""

import argparse
import json
import hashlib
import sys
import re
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

# Configuration constants
ENGLISH_WORD_THRESHOLD = 3  # Minimum number of English stopwords to trigger warning

# Common English stopwords that should NOT appear in translated values
ENGLISH_STOPWORDS = {
    'the', 'and', 'with', 'developed', 'building', 'using', 'for', 'from',
    'have', 'has', 'was', 'were', 'been', 'being', 'that', 'this', 'which',
    'also', 'more', 'some', 'such', 'than', 'then', 'when', 'where', 'while',
    'about', 'after', 'before', 'between', 'through', 'during', 'under',
    'into', 'over', 'their', 'there', 'would', 'could', 'should', 'these',
    'those', 'other', 'only', 'very', 'just', 'most', 'much', 'many', 'each',
    'every', 'both', 'same', 'different', 'various', 'several', 'another'
}

# Values that should remain unchanged (tech names, URLs, etc.)
PRESERVED_PATTERNS = [
    r'^https?://',  # URLs
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',  # Emails
    r'^\+?\d[\d\s()-]+$',  # Phone numbers
    r'^\d{4}(-\d{2})?(-\d{2})?$',  # Dates (ISO format)
    r'^[A-Za-z0-9_-]{10,}$',  # Generic IDs (UUID-like patterns)
    r'^[A-Z]{2,}$',  # Acronyms like GLP, GMP
]

# Tech names that should NOT be translated
TECH_NAMES = {
    'Python', 'Django', 'React', 'JavaScript', 'TypeScript', 'Node.js',
    'Express.js', 'Flask', 'FastAPI', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'SQLite', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab',
    'TensorFlow', 'PyTorch', 'Plotly', 'Matplotlib', 'Seaborn', 'BLAST',
    'R', 'C++', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'KNIME', 'Conda',
    'Selenium', 'BeautifulSoup', 'IELTS', 'CEFR', 'GLP', 'GMP', 'HPLC',
    'PCR', 'qPCR', 'RNA', 'DNA', 'ELISA', 'FACS', 'PhD', 'MSc', 'BSc',
    'XeLaTeX', 'Jinja2', 'LaTeX', 'PDF', 'JSON', 'CSV', 'REST', 'API',
    'CI/CD', 'ML', 'AI', 'UI/UX', 'CSTR', 'DFBA', 'MFA', 'RSM', 'DoE',
    'ORM', 'ERD', 'ACID', 'SSL', 'TCP', 'IP', 'HTTP', 'HTTPS', 'VPN',
    'DNS', 'DHCP', 'OSI', 'ACL', 'IoT', 'venv', 'n8n', 'Azure', 'Firebase'
}


def compute_sha256(filepath: str) -> str:
    """Compute SHA256 hash of a file."""
    with open(filepath, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def load_json(filepath: str) -> Dict:
    """Load JSON file with UTF-8 encoding."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_all_paths(obj: Any, prefix: str = '') -> Set[str]:
    """Recursively get all JSON paths."""
    paths = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            paths.add(path)
            paths.update(get_all_paths(value, path))
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            path = f"{prefix}[{i}]"
            paths.add(path)
            paths.update(get_all_paths(item, path))
    return paths


def get_structure(obj: Any) -> Any:
    """Get the structure of a JSON object (type, array lengths, key sets)."""
    if isinstance(obj, dict):
        return {k: get_structure(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [get_structure(item) for item in obj]
    else:
        return type(obj).__name__


def compare_array_lengths(en_obj: Any, fa_obj: Any, path: str = '') -> List[str]:
    """Compare array lengths between English and Persian versions."""
    errors = []
    if isinstance(en_obj, dict) and isinstance(fa_obj, dict):
        # We can't compare keys directly since they're translated
        # Just compare the values recursively
        en_values = list(en_obj.values())
        fa_values = list(fa_obj.values())
        if len(en_values) == len(fa_values):
            for i, (en_val, fa_val) in enumerate(zip(en_values, fa_values)):
                key = list(en_obj.keys())[i]
                errors.extend(compare_array_lengths(en_val, fa_val, f"{path}.{key}"))
    elif isinstance(en_obj, list) and isinstance(fa_obj, list):
        if len(en_obj) != len(fa_obj):
            errors.append(f"Array length mismatch at {path}: EN={len(en_obj)}, FA={len(fa_obj)}")
        else:
            for i, (en_item, fa_item) in enumerate(zip(en_obj, fa_obj)):
                errors.extend(compare_array_lengths(en_item, fa_item, f"{path}[{i}]"))
    return errors


def is_preserved_value(value: str) -> bool:
    """Check if a value should remain unchanged."""
    if not isinstance(value, str):
        return True
    for pattern in PRESERVED_PATTERNS:
        if re.match(pattern, value):
            return True
    if value in TECH_NAMES:
        return True
    return False


def check_urls_preserved(en_obj: Any, fa_obj: Any, path: str = '') -> List[str]:
    """Check that URLs are preserved exactly."""
    errors = []
    if isinstance(en_obj, str) and isinstance(fa_obj, str):
        if en_obj.startswith('http') and en_obj != fa_obj:
            errors.append(f"URL modified at {path}: EN='{en_obj}' vs FA='{fa_obj}'")
    elif isinstance(en_obj, dict) and isinstance(fa_obj, dict):
        en_values = list(en_obj.values())
        fa_values = list(fa_obj.values())
        if len(en_values) == len(fa_values):
            for i, (en_val, fa_val) in enumerate(zip(en_values, fa_values)):
                key = list(en_obj.keys())[i]
                errors.extend(check_urls_preserved(en_val, fa_val, f"{path}.{key}"))
    elif isinstance(en_obj, list) and isinstance(fa_obj, list):
        for i, (en_item, fa_item) in enumerate(zip(en_obj, fa_obj)):
            errors.extend(check_urls_preserved(en_item, fa_item, f"{path}[{i}]"))
    return errors


def check_english_leftovers(fa_obj: Any, path: str = '') -> List[str]:
    """Check for untranslated English content in Persian version."""
    warnings = []
    if isinstance(fa_obj, str):
        # Check for English stopwords (but allow tech names)
        words = fa_obj.lower().split()
        english_words = [w for w in words if w in ENGLISH_STOPWORDS]
        # Only warn if there are multiple English stopwords (to avoid false positives)
        if len(english_words) >= ENGLISH_WORD_THRESHOLD:
            warnings.append(f"Possible untranslated English at {path}: '{fa_obj[:100]}...'")
    elif isinstance(fa_obj, dict):
        for key, value in fa_obj.items():
            # Check keys for English
            if re.match(r'^[a-zA-Z_]+$', key) and len(key) > 3:
                warnings.append(f"English key remains at {path}: '{key}'")
            warnings.extend(check_english_leftovers(value, f"{path}.{key}"))
    elif isinstance(fa_obj, list):
        for i, item in enumerate(fa_obj):
            warnings.extend(check_english_leftovers(item, f"{path}[{i}]"))
    return warnings


def has_persian_content(text: str) -> bool:
    """Check if text contains Persian/Arabic characters."""
    persian_pattern = re.compile(r'[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]')
    return bool(persian_pattern.search(text))


def check_persian_presence(fa_obj: Any, path: str = '') -> List[str]:
    """Check that translatable values contain Persian text."""
    warnings = []
    if isinstance(fa_obj, str):
        # Skip URLs, emails, tech names, etc.
        if not is_preserved_value(fa_obj) and len(fa_obj) > 20:
            if not has_persian_content(fa_obj):
                warnings.append(f"No Persian text at {path}: '{fa_obj[:100]}...'")
    elif isinstance(fa_obj, dict):
        for key, value in fa_obj.items():
            warnings.extend(check_persian_presence(value, f"{path}.{key}"))
    elif isinstance(fa_obj, list):
        for i, item in enumerate(fa_obj):
            warnings.extend(check_persian_presence(item, f"{path}[{i}]"))
    return warnings


def validate_translation(en_file: str, fa_file: str) -> Dict[str, Any]:
    """Run all validations on the translation."""
    results = {
        'source_hash': None,
        'parsed': {'en': False, 'fa': False},
        'errors': [],
        'warnings': [],
        'checks': {}
    }

    # Compute source hash
    results['source_hash'] = compute_sha256(en_file)
    print(f"Source file (cv.json) SHA256: {results['source_hash']}")

    # Try to parse both files
    try:
        en_data = load_json(en_file)
        results['parsed']['en'] = True
        print("✓ English JSON parsed successfully")
    except Exception as e:
        results['errors'].append(f"Failed to parse English JSON: {e}")
        return results

    try:
        fa_data = load_json(fa_file)
        results['parsed']['fa'] = True
        print("✓ Persian JSON parsed successfully")
    except Exception as e:
        results['errors'].append(f"Failed to parse Persian JSON: {e}")
        return results

    # Check array lengths match
    print("\nChecking array lengths...")
    array_errors = compare_array_lengths(en_data, fa_data)
    results['checks']['array_lengths'] = len(array_errors) == 0
    if array_errors:
        results['errors'].extend(array_errors)
        for err in array_errors[:5]:  # Show first 5
            print(f"  ✗ {err}")
    else:
        print("  ✓ All array lengths match")

    # Check URLs preserved
    print("\nChecking URL preservation...")
    url_errors = check_urls_preserved(en_data, fa_data)
    results['checks']['urls_preserved'] = len(url_errors) == 0
    if url_errors:
        results['errors'].extend(url_errors)
        for err in url_errors[:5]:
            print(f"  ✗ {err}")
    else:
        print("  ✓ All URLs preserved")

    # Check for English leftovers
    print("\nChecking for English leftovers...")
    english_warnings = check_english_leftovers(fa_data)
    results['warnings'].extend(english_warnings)
    if english_warnings:
        for warn in english_warnings[:10]:
            print(f"  ⚠ {warn}")
    else:
        print("  ✓ No obvious English leftovers")

    # Check Persian content presence
    print("\nChecking Persian content presence...")
    persian_warnings = check_persian_presence(fa_data)
    results['warnings'].extend(persian_warnings)
    if persian_warnings:
        for warn in persian_warnings[:10]:
            print(f"  ⚠ {warn}")
    else:
        print("  ✓ Persian content detected in translatable values")

    # Summary
    print("\n" + "="*60)
    print("VALIDATION SUMMARY")
    print("="*60)
    print(f"Errors: {len(results['errors'])}")
    print(f"Warnings: {len(results['warnings'])}")
    print(f"Source unchanged: Hash = {results['source_hash']}")

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
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Validate Persian CV translation against English source.'
    )
    parser.add_argument(
        '--en-file',
        type=Path,
        help='Path to English source JSON (default: frontend/src/data/cv.json)'
    )
    parser.add_argument(
        '--fa-file',
        type=Path,
        help='Path to Persian translation JSON (default: cv_fa.json)'
    )
    args = parser.parse_args()

    # Determine file paths
    repo_root = Path(__file__).parent.parent
    en_file = args.en_file or (repo_root / 'frontend' / 'src' / 'data' / 'cv.json')
    fa_file = args.fa_file or (repo_root / 'cv_fa.json')

    if not en_file.exists():
        print(f"Error: English source not found at {en_file}")
        sys.exit(1)

    if not fa_file.exists():
        print(f"Error: Persian translation not found at {fa_file}")
        sys.exit(1)

    results = validate_translation(str(en_file), str(fa_file))

    # Exit with error code if validation failed
    if results['errors']:
        sys.exit(1)
    sys.exit(0)


if __name__ == '__main__':
    main()
    """Run validation and print results."""
    repo_root = Path(__file__).parent.parent
    
    en_path = repo_root / "frontend" / "src" / "data" / "cv.json"
    de_path = repo_root / "cv_de.json"
    
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
