/* ========================
   BIBLE API - Charge les versets depuis les fichiers JSON
   ======================== */

let bibleData = {};
let bibleBooks = [];        // Internal English keys (e.g. "Genesis")
let bibleBookNames = [];    // Localized display names (e.g. "Genèse")
let bookNameMapping = {};   // Full mapping from book_name_mapping.json
let currentMapping = {};    // Current version: English -> Localized
let reverseMapping = {};    // Current version: Localized -> English
let currentVersion = '';
let availableVersions = [];

// Load book name mappings
async function loadBookNameMapping() {
    try {
        const response = await fetch('../bible-versions/book_name_mapping.json');
        if (response.ok) {
            bookNameMapping = await response.json();
            console.log('✓ Book name mapping loaded');
        }
    } catch (e) {
        console.warn('Could not load book name mapping:', e.message);
    }
}

// Apply mapping for a specific version
function applyBookMapping(mappingKey) {
    currentMapping = {};
    reverseMapping = {};

    if (mappingKey && bookNameMapping[mappingKey]) {
        const map = bookNameMapping[mappingKey];
        for (const [eng, localized] of Object.entries(map)) {
            currentMapping[eng] = localized;
            reverseMapping[localized.toLowerCase()] = eng;
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

// Load locally available Bible versions
async function loadLocalVersions() {
    // Load mapping first
    await loadBookNameMapping();

    const localVersions = [];

    const filesToTry = [
        { locale: 'fr', file: 'LSG', displayName: 'Louis Segond (LSG)', mappingKey: 'FRENCH: LOUIS SEGOND (1910)' },
        { locale: 'en', file: 'KING JAMES BIBLE', displayName: 'King James Bible (KJV)', mappingKey: null },
        { locale: 'en', file: 'WORLD ENGLISH BIBLE', displayName: 'World English Bible (WEB)', mappingKey: null }
    ];

    for (const entry of filesToTry) {
        const encodedFile = encodeURIComponent(entry.file);
        const path = `../bible-versions/versions/${entry.locale}/${encodedFile}.json`;
        try {
            const response = await fetch(path);
            if (response.ok) {
                localVersions.push({
                    name: entry.displayName,
                    locale: entry.locale,
                    fileName: entry.file,
                    path: path,
                    mappingKey: entry.mappingKey
                });
                console.log(`✓ Version found: ${entry.displayName}`);
            } else {
                console.warn(`✗ Could not find ${entry.displayName}: HTTP ${response.status}`);
            }
        } catch (e) {
            console.warn(`✗ Error loading ${entry.displayName}:`, e.message);
        }
    }

    availableVersions = localVersions;
    console.log(`Total versions found: ${localVersions.length}`);
    return localVersions;
}

// Charger la Bible depuis le fichier JSON
async function loadBible(path, mappingKey) {
    try {
        const response = await fetch(path);
        const data = await response.json();

        // Handle two JSON formats:
        // Format 1 (LSG): { version, language, books: { Book: { chapter: { verse: text } } } }
        // Format 2 (KJV/WEB): { Book: { chapter: { verse: text } } }
        if (data.books) {
            bibleData = data.books;
            currentVersion = data.version || '';
        } else {
            bibleData = {};
            for (const key of Object.keys(data)) {
                if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                    const firstKey = Object.keys(data[key])[0];
                    if (firstKey && !isNaN(firstKey)) {
                        bibleData[key] = data[key];
                    }
                }
            }
            currentVersion = '';
        }

        // Extract book list (English keys)
        bibleBooks = Object.keys(bibleData);

        // Apply localized mapping
        applyBookMapping(mappingKey || null);

        console.log(`Bible chargée avec ${bibleBooks.length} livres`);
        return true;
    } catch (error) {
        console.error('Erreur lors du chargement de la Bible:', error);
        return false;
    }
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
                    reference: `${localName} ${chapter}:${verseNum}`
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

// Recherche avec autocomplétion (searches localized names)
function searchBooks(query) {
    if (!query) return [];

    const lowerQuery = query.toLowerCase().trim();

    // Search in localized names
    let results = bibleBookNames.filter(book =>
        book.toLowerCase().startsWith(lowerQuery)
    );

    // If no startsWith match, try includes
    if (results.length === 0) {
        results = bibleBookNames.filter(book =>
            book.toLowerCase().includes(lowerQuery)
        );
    }

    // Handle numbered books (e.g., "1j" or "1 j")
    const numMatch = lowerQuery.match(/^(\d+)\s*(.+)/);
    if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        const numberedResults = bibleBookNames.filter(book => {
            const lower = book.toLowerCase();
            return lower.startsWith(num) && lower.includes(rest);
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

    const lower = bookQuery.toLowerCase().trim();

    // 1. Try exact match on localized names -> reverse to English key
    const exactLocalized = bibleBookNames.find(b => b.toLowerCase() === lower);
    if (exactLocalized) {
        return getEnglishBookName(exactLocalized) || exactLocalized;
    }

    // 2. Try exact match on English keys
    const exactEng = bibleBooks.find(b => b.toLowerCase() === lower);
    if (exactEng) return exactEng;

    // 3. Try startsWith on localized names
    const startsLocalized = bibleBookNames.find(b => b.toLowerCase().startsWith(lower));
    if (startsLocalized) {
        return getEnglishBookName(startsLocalized) || startsLocalized;
    }

    // 4. Try startsWith on English keys
    const startsEng = bibleBooks.find(b => b.toLowerCase().startsWith(lower));
    if (startsEng) return startsEng;

    return null;
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
