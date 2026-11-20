/* ========================
   BIBLE API - Works without a web server (file:// protocol)
   Loads Bible data from pre-generated JS files via <script> tags
   ======================== */

let bibleData = {};
let bibleBooks = [];        // Internal English keys (e.g. "Genesis")
let bibleBookNames = [];    // Localized display names (e.g. "Genèse")
let bookNameMapping = {};   // Full mapping from book_name_mapping.json
let currentMapping = {};    // Current version: English -> Localized
let reverseMapping = {};    // Current version: Localized -> English
let currentVersion = '';
let currentVersionKey = '';  // Registry key of the loaded version (e.g. "LSG")
let availableVersions = [];

// Initialize: read data from global window objects (set by <script> tags)
function initBookNameMapping() {
    if (window.BOOK_NAME_MAPPING) {
        bookNameMapping = window.BOOK_NAME_MAPPING;
        console.log('✓ Book name mapping loaded');
    } else {
        console.warn('✗ Book name mapping not found (book_name_mapping.js not loaded)');
    }
}

// Get available versions from the pre-generated index
function getAvailableVersions() {
    initBookNameMapping();

    if (window.BIBLE_VERSIONS_INDEX) {
        availableVersions = window.BIBLE_VERSIONS_INDEX;
        console.log(`✓ ${availableVersions.length} versions available`);
    } else {
        console.warn('✗ Versions index not found (versions-index.js not loaded)');
        availableVersions = [];
    }

    return availableVersions;
}

// Normalize book key: convert Roman numeral prefixes and variant names
// so that data keys like "I Samuel", "II Kings", "III John", "Revelation of John"
// can match mapping keys like "1 Samuel", "2 Kings", "3 John", "Revelation"
function normalizeBookKey(key) {
    let k = key.trim();
    // Convert Roman numeral prefixes to Arabic
    k = k.replace(/^III\s+/, '3 ');
    k = k.replace(/^II\s+/, '2 ');
    k = k.replace(/^I\s+/, '1 ');
    // Normalize variant names
    if (k === 'Revelation of John') k = 'Revelation';
    return k;
}

// Apply mapping for a specific version
function applyBookMapping(mappingKey) {
    currentMapping = {};
    reverseMapping = {};

    if (mappingKey && bookNameMapping[mappingKey]) {
        const map = bookNameMapping[mappingKey];

        // Build a lookup from normalized mapping key -> localized name
        const normalizedMap = {};
        for (const [eng, localized] of Object.entries(map)) {
            normalizedMap[eng] = localized;
            // Also store by normalized key for fallback matching
            normalizedMap[normalizeBookKey(eng)] = localized;
        }

        // Map each Bible data key to its localized name
        for (const bookKey of bibleBooks) {
            const normalized = normalizeBookKey(bookKey);
            // Try exact match first, then normalized match
            const localized = normalizedMap[bookKey] || normalizedMap[normalized];
            if (localized) {
                currentMapping[bookKey] = localized;
                reverseMapping[localized.toLowerCase()] = bookKey;
            }
        }
    }

    // Build localized book names list
    bibleBookNames = bibleBooks.map(engName => {
        return currentMapping[engName] || engName;
    });

    console.log(`Book mapping applied: ${Object.keys(currentMapping).length} mapped names`);
}

// Get localized book name from English key
function getLocalizedBookName(engName) {
    return currentMapping[engName] || engName;
}

// Get English key from localized name
function getEnglishBookName(localizedName) {
    if (!localizedName) return null;
    const lower = localizedName.toLowerCase().trim();

    // Direct reverse mapping
    if (reverseMapping[lower]) return reverseMapping[lower];

    // Check if it's already an English key
    const directMatch = bibleBooks.find(b => b.toLowerCase() === lower);
    if (directMatch) return directMatch;

    return null;
}

// Escape text before inserting it into HTML strings
function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Base path from the page (bible_display/*.html) to the project root,
// used to resolve the jsFile paths of versions-index.js
const BIBLE_JS_BASE_PATH = '../';

// Load the JS data file of a version on demand (works with file://).
// callback(success) is called once the version is in BIBLE_DATA_REGISTRY.
function ensureBibleScript(versionInfo, callback) {
    const registry = window.BIBLE_DATA_REGISTRY || (window.BIBLE_DATA_REGISTRY = {});
    if (registry[versionInfo.key]) {
        callback(true);
        return;
    }
    const script = document.createElement('script');
    script.src = BIBLE_JS_BASE_PATH + versionInfo.jsFile;
    script.onload = function() {
        callback(!!registry[versionInfo.key]);
    };
    script.onerror = function() {
        console.error(`✗ Could not load ${script.src}`);
        callback(false);
    };
    document.head.appendChild(script);
}

// Find the key of the same book in the currently loaded version
// (versions use different conventions, e.g. "I Samuel" vs "1 Samuel")
function findEquivalentBookKey(bookKey) {
    if (!bookKey) return null;
    if (bibleData[bookKey]) return bookKey;
    const normalized = normalizeBookKey(bookKey);
    return bibleBooks.find(b => normalizeBookKey(b) === normalized) || null;
}

// Load a Bible version from the global registry (no fetch needed)
function loadBible(versionKey, mappingKey) {
    if (!window.BIBLE_DATA_REGISTRY || !window.BIBLE_DATA_REGISTRY[versionKey]) {
        console.error(`✗ Bible "${versionKey}" not found in registry. Is the JS file loaded?`);
        return false;
    }

    const entry = window.BIBLE_DATA_REGISTRY[versionKey];
    bibleData = entry.books;
    currentVersion = entry.meta ? entry.meta.version : versionKey;
    currentVersionKey = versionKey;

    // Extract book list (English keys)
    bibleBooks = Object.keys(bibleData);

    // Apply localized mapping
    applyBookMapping(mappingKey || null);

    console.log(`✓ Bible "${versionKey}" loaded with ${bibleBooks.length} books`);
    return true;
}

// Obtenir un verset spécifique (uses English key internally)
function getVerse(book, chapter, verse) {
    try {
        const chStr = String(chapter);
        const vStr = String(verse);
        if (bibleData[book] && bibleData[book][chStr] && bibleData[book][chStr][vStr]) {
            const localName = getLocalizedBookName(book);
            return {
                reference: `${localName} ${chapter}:${verse}`,
                text: bibleData[book][chStr][vStr],
                book: localName,
                bookKey: book,
                chapter: chStr,
                verse: vStr
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération du verset:', error);
        return null;
    }
}

// Obtenir tous les versets d'un chapitre
function getChapter(book, chapter) {
    try {
        const chStr = String(chapter);
        if (bibleData[book] && bibleData[book][chStr]) {
            const verses = [];
            const chapterData = bibleData[book][chStr];
            const localName = getLocalizedBookName(book);
            const verseNums = Object.keys(chapterData).sort((a, b) => parseInt(a) - parseInt(b));
            for (const verseNum of verseNums) {
                verses.push({
                    verse: verseNum,
                    text: chapterData[verseNum],
                    reference: `${localName} ${chapter}:${verseNum}`,
                    bookKey: book,
                    chapter: chStr
                });
            }
            return verses;
        }
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération du chapitre:', error);
        return [];
    }
}

// Obtenir le nombre de chapitres d'un livre
function getChapterCount(book) {
    if (bibleData[book]) {
        return Object.keys(bibleData[book]).length;
    }
    return 0;
}

// Obtenir tous les livres en noms localisés
function getBooks() {
    return bibleBookNames;
}

// Normalize a string: lowercase + strip accents (é→e, ï→i, etc.)
function stripAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Recherche avec autocomplétion (searches localized names)
function searchBooks(query) {
    if (!query) return [];

    const lowerQuery = stripAccents(query.trim());

    // Search in localized names (accent-insensitive)
    let results = bibleBookNames.filter(book =>
        stripAccents(book).startsWith(lowerQuery)
    );

    // If no startsWith match, try includes (accent-insensitive)
    if (results.length === 0) {
        results = bibleBookNames.filter(book =>
            stripAccents(book).includes(lowerQuery)
        );
    }

    // Handle numbered books (e.g., "1j" or "1 j")
    const numMatch = lowerQuery.match(/^(\d+)\s*(.+)/);
    if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        const numberedResults = bibleBookNames.filter(book => {
            const normalized = stripAccents(book);
            return normalized.startsWith(num) && normalized.includes(rest);
        });
        for (const r of numberedResults) {
            if (!results.includes(r)) {
                results.push(r);
            }
        }
    }

    return results;
}

// Parse la référence (ex: "Genèse 1:5", "1 Jean 3:16", "Genesis 1", "1 Jean 1:2-8")
function parseReference(reference) {
    const trimmed = reference.trim();

    // Try format: "Book Chapter:Verse-VerseEnd"
    let match = trimmed.match(/^(.+?)\s+(\d+):(\d+)-(\d+)$/);
    if (match) {
        return { book: match[1].trim(), chapter: match[2], verse: match[3], verseEnd: match[4] };
    }

    // Try format: "Book Chapter:Verse"
    match = trimmed.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
        return { book: match[1].trim(), chapter: match[2], verse: match[3], verseEnd: match[3] };
    }

    // Try format: "Book Chapter" (whole chapter)
    match = trimmed.match(/^(.+?)\s+(\d+)$/);
    if (match) {
        return { book: match[1].trim(), chapter: match[2], verse: null, verseEnd: null };
    }

    return null;
}

// Find the English key for a book from user input (localized or English)
function findBook(bookQuery) {
    if (!bookQuery) return null;

    const lower = stripAccents(bookQuery.trim());

    // 1. Try exact match on localized names -> reverse to English key (accent-insensitive)
    const exactLocalized = bibleBookNames.find(b => stripAccents(b) === lower);
    if (exactLocalized) {
        return getEnglishBookName(exactLocalized) || exactLocalized;
    }

    // 2. Try exact match on English keys (accent-insensitive)
    const exactEng = bibleBooks.find(b => stripAccents(b) === lower);
    if (exactEng) return exactEng;

    // 3. Try startsWith on localized names (accent-insensitive)
    const startsLocalized = bibleBookNames.find(b => stripAccents(b).startsWith(lower));
    if (startsLocalized) {
        return getEnglishBookName(startsLocalized) || startsLocalized;
    }

    // 4. Try startsWith on English keys (accent-insensitive)
    const startsEng = bibleBooks.find(b => stripAccents(b).startsWith(lower));
    if (startsEng) return startsEng;

    return null;
}

/* ========================
   KEYWORD SEARCH (full-text search in the loaded Bible)
   Query syntax:
     mot1 mot2        -> verses containing ALL the words (whole words)
     "une phrase"     -> exact consecutive words (also « … » or “ … ”)
     mot*             -> words starting with "mot"
     -mot             -> exclude verses containing "mot"
   Accent / case / apostrophe insensitive (é = e, œ = oe, ’ = ').
   ======================== */

const SEARCH_WORD_CHARS = 'a-z0-9';
const SEARCH_SPECIAL_FOLDS = {
    'œ': 'oe', 'Œ': 'oe', 'æ': 'ae', 'Æ': 'ae', 'ß': 'ss',
    '’': "'", '‘': "'", '‛': "'", '`': "'", '´': "'", 'ʼ': "'",
    '“': '"', '”': '"', '«': '"', '»': '"', '„': '"'
};
const SEARCH_SPECIAL_RE = /[œŒæÆß’‘‛`´ʼ“”«»„]/g;

// Fold a whole string (fast, used for indexing and queries)
function foldForSearch(str) {
    return String(str)
        .replace(SEARCH_SPECIAL_RE, c => SEARCH_SPECIAL_FOLDS[c])
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase();
}

// Fold a string keeping, for each folded char, the index of its source char
// (used to highlight matches in the original text)
function foldWithMap(str) {
    let folded = '';
    const map = [];
    for (let i = 0; i < str.length; i++) {
        const f = foldForSearch(str[i]);
        for (let k = 0; k < f.length; k++) {
            folded += f[k];
            map.push(i);
        }
    }
    map.push(str.length);
    return { folded, map };
}

// Cache: one index per loaded version
const searchIndexCache = {};

function getSearchIndex() {
    const cacheKey = currentVersionKey || currentVersion;
    if (searchIndexCache[cacheKey]) return searchIndexCache[cacheKey];
    const index = [];
    const byNum = (a, b) => parseInt(a, 10) - parseInt(b, 10);
    for (const bookKey of bibleBooks) {
        const book = bibleData[bookKey];
        for (const ch of Object.keys(book).sort(byNum)) {
            const chapter = book[ch];
            for (const v of Object.keys(chapter).sort(byNum)) {
                index.push({ bookKey, chapter: ch, verse: v, text: chapter[v], norm: foldForSearch(chapter[v]) });
            }
        }
    }
    searchIndexCache[cacheKey] = index;
    return index;
}

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build the regex source matching a word or a phrase (already folded).
// prefixAll: every word may be the start of a longer word (fallback mode).
function buildTermPattern(term, prefixAll) {
    const W = SEARCH_WORD_CHARS;
    const words = term.split(new RegExp(`[^${W}*]+`)).filter(w => w.replace(/\*/g, ''));
    if (words.length === 0) return null;
    const parts = words.map(w => {
        let p = escapeRegExp(w).replace(/\\\*/g, `[${W}]*`);
        if (prefixAll && !w.endsWith('*')) p += `[${W}]*`;
        return p;
    });
    return `(?<![${W}])${parts.join(`[^${W}]+`)}(?![${W}])`;
}

// Parse a user query into include / exclude terms. Returns null if empty.
function parseSearchQuery(query) {
    const folded = foldForSearch(query || '').trim();
    if (!folded) return null;
    const include = [];
    const exclude = [];
    const tokenRe = /(-?)"([^"]*)"?|(\S+)/g;
    let m;
    while ((m = tokenRe.exec(folded))) {
        if (m[2] !== undefined) {
            if (m[2].trim()) (m[1] ? exclude : include).push({ text: m[2].trim(), phrase: true });
        } else {
            let tok = m[3];
            const neg = tok.length > 1 && tok[0] === '-';
            if (neg) tok = tok.slice(1);
            if (tok.replace(/[^a-z0-9]/g, '')) (neg ? exclude : include).push({ text: tok, phrase: false });
        }
    }
    if (include.length === 0) return null;
    return { include, exclude, raw: folded };
}

function compileQuery(parsed, prefixAll) {
    const toRe = (term, prefix) => {
        const src = buildTermPattern(term.text, prefix && !term.phrase);
        return src ? new RegExp(src) : null;
    };
    const include = parsed.include.map(t => toRe(t, prefixAll)).filter(Boolean);
    const exclude = parsed.exclude.map(t => toRe(t, false)).filter(Boolean);
    // Whole query as one phrase: used to rank exact passages first
    const unquotedWords = parsed.include.filter(t => !t.phrase);
    const phraseSrc = !prefixAll && unquotedWords.length > 1 && unquotedWords.length === parsed.include.length
        ? buildTermPattern(unquotedWords.map(t => t.text).join(' '), false) : null;
    return { include, exclude, phrase: phraseSrc ? new RegExp(phraseSrc) : null };
}

function runCompiledSearch(compiled) {
    const exact = [];
    const others = [];
    for (const entry of getSearchIndex()) {
        if (!compiled.include.every(re => re.test(entry.norm))) continue;
        if (compiled.exclude.some(re => re.test(entry.norm))) continue;
        (compiled.phrase && compiled.phrase.test(entry.norm) ? exact : others).push(entry);
    }
    // Exact phrase first, then Bible order
    return exact.concat(others);
}

// Search the loaded Bible. Returns { results, total, approximate, query }.
// If no verse contains the exact words, retries with word beginnings
// (approximate = true), e.g. "aimer" -> "aime", "aimé", "aimera"...
function searchVerses(query) {
    const parsed = parseSearchQuery(query);
    if (!parsed) return { results: [], total: 0, approximate: false, query: null };

    let approximate = false;
    let compiled = compileQuery(parsed, false);
    let matches = runCompiledSearch(compiled);
    if (matches.length === 0) {
        compiled = compileQuery(parsed, true);
        matches = runCompiledSearch(compiled);
        approximate = matches.length > 0;
    }

    const results = matches.map(e => ({
        bookKey: e.bookKey,
        chapter: e.chapter,
        verse: e.verse,
        text: e.text,
        reference: `${getLocalizedBookName(e.bookKey)} ${e.chapter}:${e.verse}`
    }));
    return { results, total: results.length, approximate, query: parsed, compiled };
}

// Escaped HTML of a verse with the matched words wrapped in <mark>
function highlightSearchMatches(text, compiled) {
    if (!compiled) return escapeHtml(text);
    const { folded, map } = foldWithMap(text);
    const ranges = [];
    // When the whole query appears as a phrase, highlight only that phrase
    const patterns = compiled.phrase && compiled.phrase.test(folded) ? [compiled.phrase] : compiled.include;
    for (const re of patterns) {
        const g = new RegExp(re.source, 'g');
        let m;
        while ((m = g.exec(folded))) {
            if (m[0].length === 0) { g.lastIndex++; continue; }
            ranges.push([map[m.index], map[m.index + m[0].length]]);
        }
    }
    if (ranges.length === 0) return escapeHtml(text);
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [ranges[0].slice()];
    for (const r of ranges.slice(1)) {
        const last = merged[merged.length - 1];
        if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
        else merged.push(r.slice());
    }
    let html = '';
    let pos = 0;
    for (const [s, e] of merged) {
        html += escapeHtml(text.slice(pos, s)) + '<mark>' + escapeHtml(text.slice(s, e)) + '</mark>';
        pos = e;
    }
    return html + escapeHtml(text.slice(pos));
}

// Obtenir un ou plusieurs versets basés sur une référence
function getVersesByReference(reference) {
    const parsed = parseReference(reference);
    if (!parsed) return null;

    // Find the actual English book key
    const bookKey = findBook(parsed.book);
    if (!bookKey) return null;

    // If no verse specified, return whole chapter
    if (parsed.verse === null) {
        const chapterVerses = getChapter(bookKey, parsed.chapter);
        return chapterVerses.length > 0 ? chapterVerses : null;
    }

    // Specific verse or range
    const verses = [];
    const startVerse = parseInt(parsed.verse);
    const endVerse = parseInt(parsed.verseEnd);

    for (let i = startVerse; i <= endVerse; i++) {
        const verse = getVerse(bookKey, parsed.chapter, i.toString());
        if (verse) {
            verses.push(verse);
        }
    }

    return verses.length > 0 ? verses : null;
}
