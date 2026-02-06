#!/usr/bin/env python3
"""
LSG Bible Scraper - Scrapes the Louis Segond 1910 Bible from BibleGateway.com
This version is in the public domain.

Usage:
    python lsg_biblegateway_scraper.py
    python lsg_biblegateway_scraper.py --resume    # Resume interrupted scrape
    python lsg_biblegateway_scraper.py --test       # Test with Genesis 1 only
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import logging
import sys
import os
import re
import argparse
from pathlib import Path
from typing import Dict, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('lsg_biblegateway.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# =====================================================================
# Bible Structure: 66 books, English names used in the JSON output
# mapped to French search terms for BibleGateway
# =====================================================================

BIBLE_BOOKS = [
    # Old Testament
    {"en": "Genesis",           "fr_search": "Genèse",              "chapters": 50},
    {"en": "Exodus",            "fr_search": "Exode",               "chapters": 40},
    {"en": "Leviticus",         "fr_search": "Lévitique",           "chapters": 27},
    {"en": "Numbers",           "fr_search": "Nombres",             "chapters": 36},
    {"en": "Deuteronomy",       "fr_search": "Deutéronome",         "chapters": 34},
    {"en": "Joshua",            "fr_search": "Josué",               "chapters": 24},
    {"en": "Judges",            "fr_search": "Juges",               "chapters": 21},
    {"en": "Ruth",              "fr_search": "Ruth",                "chapters": 4},
    {"en": "I Samuel",          "fr_search": "1 Samuel",            "chapters": 31},
    {"en": "II Samuel",         "fr_search": "2 Samuel",            "chapters": 24},
    {"en": "I Kings",           "fr_search": "1 Rois",              "chapters": 22},
    {"en": "II Kings",          "fr_search": "2 Rois",              "chapters": 25},
    {"en": "I Chronicles",      "fr_search": "1 Chroniques",        "chapters": 29},
    {"en": "II Chronicles",     "fr_search": "2 Chroniques",        "chapters": 36},
    {"en": "Ezra",              "fr_search": "Esdras",              "chapters": 10},
    {"en": "Nehemiah",          "fr_search": "Néhémie",             "chapters": 13},
    {"en": "Esther",            "fr_search": "Esther",              "chapters": 10},
    {"en": "Job",               "fr_search": "Job",                 "chapters": 42},
    {"en": "Psalms",            "fr_search": "Psaumes",             "chapters": 150},
    {"en": "Proverbs",          "fr_search": "Proverbes",           "chapters": 31},
    {"en": "Ecclesiastes",      "fr_search": "Ecclésiaste",         "chapters": 12},
    {"en": "Song of Solomon",   "fr_search": "Cantique des Cantiques", "chapters": 8},
    {"en": "Isaiah",            "fr_search": "Ésaïe",               "chapters": 66},
    {"en": "Jeremiah",          "fr_search": "Jérémie",             "chapters": 52},
    {"en": "Lamentations",      "fr_search": "Lamentations",        "chapters": 5},
    {"en": "Ezekiel",           "fr_search": "Ézéchiel",            "chapters": 48},
    {"en": "Daniel",            "fr_search": "Daniel",              "chapters": 12},
    {"en": "Hosea",             "fr_search": "Osée",                "chapters": 14},
    {"en": "Joel",              "fr_search": "Joël",                "chapters": 3},
    {"en": "Amos",              "fr_search": "Amos",                "chapters": 9},
    {"en": "Obadiah",           "fr_search": "Abdias",              "chapters": 1},
    {"en": "Jonah",             "fr_search": "Jonas",               "chapters": 4},
    {"en": "Micah",             "fr_search": "Michée",              "chapters": 7},
    {"en": "Nahum",             "fr_search": "Nahum",               "chapters": 3},
    {"en": "Habakkuk",          "fr_search": "Habacuc",             "chapters": 3},
    {"en": "Zephaniah",         "fr_search": "Sophonie",            "chapters": 3},
    {"en": "Haggai",            "fr_search": "Aggée",               "chapters": 2},
    {"en": "Zechariah",         "fr_search": "Zacharie",            "chapters": 14},
    {"en": "Malachi",           "fr_search": "Malachie",            "chapters": 4},
    # New Testament
    {"en": "Matthew",           "fr_search": "Matthieu",            "chapters": 28},
    {"en": "Mark",              "fr_search": "Marc",                "chapters": 16},
    {"en": "Luke",              "fr_search": "Luc",                 "chapters": 24},
    {"en": "John",              "fr_search": "Jean",                "chapters": 21},
    {"en": "Acts",              "fr_search": "Actes",               "chapters": 28},
    {"en": "Romans",            "fr_search": "Romains",             "chapters": 16},
    {"en": "I Corinthians",     "fr_search": "1 Corinthiens",       "chapters": 16},
    {"en": "II Corinthians",    "fr_search": "2 Corinthiens",       "chapters": 13},
    {"en": "Galatians",         "fr_search": "Galates",             "chapters": 6},
    {"en": "Ephesians",         "fr_search": "Éphésiens",           "chapters": 6},
    {"en": "Philippians",       "fr_search": "Philippiens",         "chapters": 4},
    {"en": "Colossians",        "fr_search": "Colossiens",          "chapters": 4},
    {"en": "I Thessalonians",   "fr_search": "1 Thessaloniciens",   "chapters": 5},
    {"en": "II Thessalonians",  "fr_search": "2 Thessaloniciens",   "chapters": 3},
    {"en": "I Timothy",         "fr_search": "1 Timothée",          "chapters": 6},
    {"en": "II Timothy",        "fr_search": "2 Timothée",          "chapters": 4},
    {"en": "Titus",             "fr_search": "Tite",                "chapters": 3},
    {"en": "Philemon",          "fr_search": "Philémon",            "chapters": 1},
    {"en": "Hebrews",           "fr_search": "Hébreux",             "chapters": 13},
    {"en": "James",             "fr_search": "Jacques",             "chapters": 5},
    {"en": "I Peter",           "fr_search": "1 Pierre",            "chapters": 5},
    {"en": "II Peter",          "fr_search": "2 Pierre",            "chapters": 3},
    {"en": "I John",            "fr_search": "1 Jean",              "chapters": 5},
    {"en": "II John",           "fr_search": "2 Jean",              "chapters": 1},
    {"en": "III John",          "fr_search": "3 Jean",              "chapters": 1},
    {"en": "Jude",              "fr_search": "Jude",                "chapters": 1},
    {"en": "Revelation of John","fr_search": "Apocalypse",          "chapters": 22},
]

# Total expected: 1189 chapters
TOTAL_CHAPTERS = sum(b["chapters"] for b in BIBLE_BOOKS)

PROGRESS_FILE = "lsg_biblegateway_progress.json"
OUTPUT_FILE = "../../versions/fr/LSG.json"
REQUEST_DELAY = 1.5  # seconds between requests (be polite)


class LSGBibleGatewayScraper:
    """Scrape LSG 1910 from BibleGateway.com"""

    def __init__(self):
        self.base_url = "https://www.biblegateway.com/passage/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        })
        self.bible_data: Dict = {}
        self.progress: Dict = {}
        self.stats = {"chapters_scraped": 0, "verses_scraped": 0, "errors": 0}

    def load_progress(self) -> bool:
        """Load progress from a previous interrupted scrape"""
        if os.path.exists(PROGRESS_FILE):
            try:
                with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.bible_data = data.get("bible_data", {})
                    self.progress = data.get("progress", {})
                    self.stats = data.get("stats", self.stats)
                logger.info(f"Resumed from progress file. {self.stats['chapters_scraped']}/{TOTAL_CHAPTERS} chapters done.")
                return True
            except Exception as e:
                logger.warning(f"Could not load progress: {e}")
        return False

    def save_progress(self):
        """Save current progress to disk"""
        try:
            with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
                json.dump({
                    "bible_data": self.bible_data,
                    "progress": self.progress,
                    "stats": self.stats
                }, f, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error saving progress: {e}")

    def is_chapter_done(self, book_en: str, chapter: int) -> bool:
        """Check if a chapter has already been scraped"""
        key = f"{book_en}_{chapter}"
        return self.progress.get(key, False)

    def mark_chapter_done(self, book_en: str, chapter: int):
        """Mark a chapter as completed"""
        key = f"{book_en}_{chapter}"
        self.progress[key] = True

    def clean_verse_text(self, text: str) -> str:
        """Clean up verse text: remove extra spaces, footnote markers, etc."""
        # Remove footnote references like (a), (b), etc.
        text = re.sub(r'\([a-z]\)', '', text)
        # Remove cross-reference markers
        text = re.sub(r'\[\w+\]', '', text)
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        # Remove leading/trailing whitespace
        text = text.strip()
        # Remove verse number if it appears at the start
        text = re.sub(r'^\d+\s+', '', text)
        return text

    def fetch_chapter(self, book_fr: str, chapter: int, retries: int = 3) -> Optional[Dict[str, str]]:
        """
        Fetch a single chapter from BibleGateway.
        Returns dict of {verse_number: verse_text} or None on failure.
        """
        search_term = f"{book_fr} {chapter}"
        params = {
            "search": search_term,
            "version": "LSG"
        }

        for attempt in range(retries):
            try:
                response = self.session.get(self.base_url, params=params, timeout=30)
                response.raise_for_status()

                soup = BeautifulSoup(response.text, 'html.parser')

                # Find the passage text container
                passage = soup.find('div', class_='passage-text')
                if not passage:
                    # Try alternate class
                    passage = soup.find('div', class_='result-text-style-normal')
                if not passage:
                    logger.warning(f"No passage container found for {search_term}")
                    if attempt < retries - 1:
                        time.sleep(3)
                        continue
                    return None

                verses = {}

                # Find all verse spans with class 'text'
                verse_spans = passage.find_all('span', class_='text')

                for span in verse_spans:
                    verse_num = None

                    # Method 1: Extract verse number from the span's CSS class
                    # Classes look like: ['text', 'Gen-1-3'] -> verse 3
                    span_classes = span.get('class', [])
                    for cls in span_classes:
                        match = re.match(r'[A-Za-z0-9]+-(\d+)-(\d+)', cls)
                        if match:
                            verse_num = int(match.group(2))
                            break

                    # Method 2: Fallback - look for chapternum (verse 1) or versenum
                    if verse_num is None:
                        chapter_num_elem = span.find('span', class_='chapternum')
                        if chapter_num_elem:
                            verse_num = 1
                        else:
                            # versenum is a <sup> tag, not <span>
                            verse_num_elem = span.find('sup', class_='versenum')
                            if verse_num_elem:
                                try:
                                    verse_num = int(verse_num_elem.get_text(strip=True))
                                except (ValueError, TypeError):
                                    pass

                    if verse_num is None:
                        continue

                    # Remove chapter number, verse number, footnotes, cross-references
                    for elem in span.find_all('span', class_='chapternum'):
                        elem.decompose()
                    for elem in span.find_all('sup', class_='versenum'):
                        elem.decompose()
                    for elem in span.find_all('sup', class_='footnote'):
                        elem.decompose()
                    for elem in span.find_all('sup', class_='crossreference'):
                        elem.decompose()

                    verse_text = span.get_text(separator=' ', strip=True)
                    verse_text = self.clean_verse_text(verse_text)

                    if verse_text and verse_num:
                        str_num = str(verse_num)
                        if str_num in verses:
                            verses[str_num] += " " + verse_text
                        else:
                            verses[str_num] = verse_text

                if verses:
                    # Final cleanup: strip each verse text
                    verses = {k: v.strip() for k, v in verses.items() if v.strip()}
                    return verses
                else:
                    logger.warning(f"No verses extracted for {search_term} (attempt {attempt + 1})")
                    if attempt < retries - 1:
                        time.sleep(3)

            except requests.RequestException as e:
                logger.warning(f"Network error for {search_term} (attempt {attempt + 1}): {e}")
                if attempt < retries - 1:
                    time.sleep(5)
            except Exception as e:
                logger.error(f"Unexpected error for {search_term}: {e}")
                if attempt < retries - 1:
                    time.sleep(3)

        logger.error(f"Failed to fetch {search_term} after {retries} attempts")
        return None

    def scrape(self, test_mode: bool = False, resume: bool = False):
        """Scrape the entire LSG Bible from BibleGateway"""

        if resume:
            self.load_progress()

        books_to_scrape = BIBLE_BOOKS[:1] if test_mode else BIBLE_BOOKS
        total_books = len(books_to_scrape)
        chapters_done = 0

        logger.info("=" * 60)
        logger.info("LSG 1910 Bible Scraper - BibleGateway.com")
        logger.info(f"Books to scrape: {total_books}")
        logger.info(f"Total chapters: {sum(b['chapters'] for b in books_to_scrape)}")
        logger.info("=" * 60)

        for book_idx, book in enumerate(books_to_scrape, 1):
            book_en = book["en"]
            book_fr = book["fr_search"]
            num_chapters = book["chapters"]

            if book_en not in self.bible_data:
                self.bible_data[book_en] = {}

            logger.info(f"\n📖 [{book_idx}/{total_books}] {book_fr} ({book_en}) - {num_chapters} chapters")

            for chapter in range(1, num_chapters + 1):
                if self.is_chapter_done(book_en, chapter):
                    chapters_done += 1
                    continue

                verses = self.fetch_chapter(book_fr, chapter)

                if verses:
                    self.bible_data[book_en][str(chapter)] = verses
                    self.stats["chapters_scraped"] += 1
                    self.stats["verses_scraped"] += len(verses)
                    self.mark_chapter_done(book_en, chapter)
                    chapters_done += 1

                    logger.info(
                        f"  ✅ {book_fr} {chapter}: {len(verses)} versets "
                        f"({chapters_done}/{sum(b['chapters'] for b in books_to_scrape)})"
                    )
                else:
                    self.stats["errors"] += 1
                    logger.error(f"  ❌ {book_fr} {chapter}: ÉCHEC")

                # Save progress after each chapter
                self.save_progress()

                # Rate limiting
                time.sleep(REQUEST_DELAY)

        logger.info("\n" + "=" * 60)
        logger.info("Scraping terminé!")
        logger.info(f"  Chapitres: {self.stats['chapters_scraped']}")
        logger.info(f"  Versets:   {self.stats['verses_scraped']}")
        logger.info(f"  Erreurs:   {self.stats['errors']}")
        logger.info("=" * 60)

    def count_total_verses(self) -> int:
        """Count total verses in the scraped data"""
        total = 0
        for book in self.bible_data.values():
            for chapter in book.values():
                total += len(chapter)
        return total

    def save_final_json(self, output_path: str = OUTPUT_FILE):
        """Save the final Bible JSON in the project format"""
        total_verses = self.count_total_verses()

        output_data = {
            "version": "LSG",
            "language": "fr",
            "translation": "Louis Segond 1910",
            "description": "Bible Louis Segond 1910 - Traduction française du domaine public",
            "source": "Public Domain (via BibleGateway.com)",
            "total_books": len(self.bible_data),
            "total_verses": total_verses,
            "books": self.bible_data
        }

        # Ensure output directory exists
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        logger.info(f"\n💾 Bible LSG 1910 sauvegardée: {output_path}")
        logger.info(f"   {len(self.bible_data)} livres, {total_verses} versets")

        # Verify key verses
        self.verify_key_verses()

    def verify_key_verses(self):
        """Verify that key verses are correct LSG 1910 text"""
        checks = [
            ("Genesis", "1", "1", "Au commencement"),
            ("John", "3", "16", "Car Dieu a tant aimé le monde"),
            ("Psalms", "23", "1", "L'Éternel est mon berger"),
            ("Romans", "8", "28", "Nous savons"),
            ("Revelation of John", "22", "21", "grâce"),
        ]

        logger.info("\n🔍 Vérification des versets clés:")
        for book, ch, v, expected_start in checks:
            if book in self.bible_data and ch in self.bible_data[book] and v in self.bible_data[book][ch]:
                text = self.bible_data[book][ch][v]
                ok = expected_start.lower() in text.lower()
                status = "✅" if ok else "⚠️"
                logger.info(f"  {status} {book} {ch}:{v} = {text[:80]}...")
            else:
                logger.warning(f"  ❌ {book} {ch}:{v} - MANQUANT!")


def main():
    parser = argparse.ArgumentParser(description="Scrape LSG 1910 Bible from BibleGateway.com")
    parser.add_argument('--resume', action='store_true', help='Resume from a previous interrupted scrape')
    parser.add_argument('--test', action='store_true', help='Test mode: scrape only Genesis 1')
    parser.add_argument('--output', type=str, default=OUTPUT_FILE, help='Output JSON file path')
    args = parser.parse_args()

    scraper = LSGBibleGatewayScraper()

    if args.test:
        logger.info("🧪 Mode test: scraping uniquement Genèse...")
        scraper.scrape(test_mode=True)
    else:
        scraper.scrape(resume=args.resume)

    scraper.save_final_json(args.output)

    # Clean up progress file on successful completion
    if not args.test and scraper.stats["errors"] == 0:
        if os.path.exists(PROGRESS_FILE):
            os.remove(PROGRESS_FILE)
            logger.info("🗑️  Fichier de progression supprimé.")


if __name__ == "__main__":
    main()
