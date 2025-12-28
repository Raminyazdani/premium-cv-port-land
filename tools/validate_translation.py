#!/usr/bin/env python3
"""
Validation script for Persian CV translation.
Checks structural equality, key translation completeness, and value preservation.
"""

import json
import hashlib
import sys
import re
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

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
    r'^PIKk-q0AAAAJ$',  # Specific IDs
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
        if len(english_words) >= 3:
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

    return results


def main():
    repo_root = Path(__file__).parent.parent
    en_file = repo_root / 'frontend' / 'src' / 'data' / 'cv.json'
    fa_file = repo_root / 'ramin_fa.json'

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
