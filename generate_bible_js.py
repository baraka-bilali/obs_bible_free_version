#!/usr/bin/env python3
"""
Convert Bible JSON files to JS files loadable via <script> tags.
This allows the app to work without a web server (file:// protocol).

Usage: python3 generate_bible_js.py
Run from the project root directory.
"""

import os
import json
import glob

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
VERSIONS_DIR = os.path.join(PROJECT_ROOT, 'bible-versions', 'versions')
MAPPING_FILE = os.path.join(PROJECT_ROOT, 'bible-versions', 'book_name_mapping.json')
OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'bible-versions', 'js')

def convert_bible_json_to_js(json_path, locale, version_key):
    """Convert a Bible JSON file to a JS file that registers itself globally."""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract books data (handle both formats)
    if 'books' in data:
        books_data = data['books']
        meta = {
            'version': data.get('version', version_key),
            'language': data.get('language', locale),
            'translation': data.get('translation', version_key),
        }
    else:
        books_data = {k: v for k, v in data.items()
                      if isinstance(v, dict) and any(
                          kk.isdigit() for kk in (list(v.keys())[:1] or ['x'])
                      )}
        meta = {
            'version': version_key,
            'language': locale,
            'translation': version_key,
        }

    js_content = (
        f'// Auto-generated from {os.path.basename(json_path)}\n'
        f'// Do not edit manually - run generate_bible_js.py to regenerate\n'
        f'window.BIBLE_DATA_REGISTRY = window.BIBLE_DATA_REGISTRY || {{}};\n'
        f'window.BIBLE_DATA_REGISTRY["{version_key}"] = {{\n'
        f'  meta: {json.dumps(meta, ensure_ascii=False)},\n'
        f'  books: {json.dumps(books_data, ensure_ascii=False)}\n'
        f'}};\n'
    )

    return js_content


def convert_mapping_to_js(mapping_path):
    """Convert book_name_mapping.json to a JS file."""
    with open(mapping_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    js_content = (
        '// Auto-generated from book_name_mapping.json\n'
        '// Do not edit manually - run generate_bible_js.py to regenerate\n'
        f'window.BOOK_NAME_MAPPING = {json.dumps(data, ensure_ascii=False)};\n'
    )

    return js_content


def generate_versions_index(versions):
    """Generate a JS file listing all available versions."""
    js_content = (
        '// Auto-generated index of available Bible versions\n'
        '// Do not edit manually - run generate_bible_js.py to regenerate\n'
        'window.BIBLE_DATA_REGISTRY = window.BIBLE_DATA_REGISTRY || {};\n'
        f'window.BIBLE_VERSIONS_INDEX = {json.dumps(versions, ensure_ascii=False, indent=2)};\n'
    )
    return js_content


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    versions_index = []
    files_generated = 0

    # Known version configurations
    known_versions = [
        {
            'locale': 'fr',
            'file': 'LSG',
            'displayName': 'Louis Segond (LSG)',
            'mappingKey': 'FRENCH: LOUIS SEGOND (1910)',
            'key': 'LSG'
        },
        {
            'locale': 'en',
            'file': 'KING JAMES BIBLE',
            'displayName': 'King James Bible (KJV)',
            'mappingKey': None,
            'key': 'KJV'
        },
        {
            'locale': 'en',
            'file': 'WORLD ENGLISH BIBLE',
            'displayName': 'World English Bible (WEB)',
            'mappingKey': None,
            'key': 'WEB'
        },
    ]

    for v in known_versions:
        json_path = os.path.join(VERSIONS_DIR, v['locale'], f"{v['file']}.json")
        if not os.path.exists(json_path):
            print(f"  ✗ Not found: {json_path}")
            continue

        print(f"  Converting {v['file']}...")
        js_content = convert_bible_json_to_js(json_path, v['locale'], v['key'])

        js_filename = f"{v['key']}.js"
        js_path = os.path.join(OUTPUT_DIR, js_filename)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)

        file_size = os.path.getsize(js_path)
        print(f"  ✓ Generated {js_filename} ({file_size // 1024} KB)")

        versions_index.append({
            'name': v['displayName'],
            'locale': v['locale'],
            'key': v['key'],
            'jsFile': f'bible-versions/js/{js_filename}',
            'mappingKey': v['mappingKey']
        })
        files_generated += 1

    # Generate mapping JS
    if os.path.exists(MAPPING_FILE):
        print("  Converting book_name_mapping...")
        mapping_js = convert_mapping_to_js(MAPPING_FILE)
        mapping_path = os.path.join(OUTPUT_DIR, 'book_name_mapping.js')
        with open(mapping_path, 'w', encoding='utf-8') as f:
            f.write(mapping_js)
        file_size = os.path.getsize(mapping_path)
        print(f"  ✓ Generated book_name_mapping.js ({file_size // 1024} KB)")
        files_generated += 1

    # Generate versions index
    index_js = generate_versions_index(versions_index)
    index_path = os.path.join(OUTPUT_DIR, 'versions-index.js')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_js)
    print(f"  ✓ Generated versions-index.js")
    files_generated += 1

    print(f"\nDone! {files_generated} files generated in {OUTPUT_DIR}")


if __name__ == '__main__':
    print("Generating Bible JS files...")
    main()
