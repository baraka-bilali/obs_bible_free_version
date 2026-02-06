/* ========================
   BIBLE API - Charge les versets depuis les fichiers JSON
   ======================== */

let bibleData = {};
let bibleBooks = [];

// Charger la Bible depuis le fichier JSON
async function loadBible(version = 'KING JAMES BIBLE') {
    try {
        const response = await fetch(`../bible-versions/versions/en/${version}.json`);
        bibleData = await response.json();
        
        // Extraire la liste des livres
        bibleBooks = Object.keys(bibleData);
        
        console.log(`Bible ${version} chargée avec ${bibleBooks.length} livres`);
        return true;
    } catch (error) {
        console.error('Erreur lors du chargement de la Bible:', error);
        return false;
    }
}

// Obtenir un verset spécifique
function getVerse(book, chapter, verse) {
    try {
        if (bibleData[book] && bibleData[book][chapter] && bibleData[book][chapter][verse]) {
            return {
                reference: `${book} ${chapter}:${verse}`,
                text: bibleData[book][chapter][verse],
                book: book,
                chapter: chapter,
                verse: verse
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
        if (bibleData[book] && bibleData[book][chapter]) {
            const verses = [];
            const chapterData = bibleData[book][chapter];
            for (let verseNum in chapterData) {
                verses.push({
                    verse: verseNum,
                    text: chapterData[verseNum]
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

// Obtenir tous les livres disponibles
function getBooks() {
    return bibleBooks;
}

// Recherche avec autocomplétion - retourne les livres correspondant aux premières lettres
function searchBooks(query) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return bibleBooks.filter(book => 
        book.toLowerCase().startsWith(lowerQuery)
    );
}

// Parser la référence (ex: "Genesis 1:5")
function parseReference(reference) {
    // Format: "Book Chapter:Verse" ou "Book Chapter:Verse-VerseEnd"
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    
    if (!match) return null;
    
    return {
        book: match[1],
        chapter: match[2],
        verse: match[3],
        verseEnd: match[4] || match[3]
    };
}

// Obtenir un ou plusieurs versets basés sur une référence
function getVersesByReference(reference) {
    const parsed = parseReference(reference);
    if (!parsed) return null;
    
    const verses = [];
    const startVerse = parseInt(parsed.verse);
    const endVerse = parseInt(parsed.verseEnd);
    
    for (let i = startVerse; i <= endVerse; i++) {
        const verse = getVerse(parsed.book, parsed.chapter, i.toString());
        if (verse) {
            verses.push(verse);
        }
    }
    
    return verses.length > 0 ? verses : null;
}

// Charger la Bible au démarrage
document.addEventListener('DOMContentLoaded', function() {
    loadBible('KING JAMES BIBLE');
});
