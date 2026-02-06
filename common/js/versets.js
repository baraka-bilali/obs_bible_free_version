/* ========================
   BIBLE VERSES DATABASE
   ======================== */

// Base de données des versets bibliques avec exemples
// Format: "livre chapitre:verset" => { reference, text, book, bible }

const versetsDatabase = {
    // GENÈSE
    "Genèse 1:1": {
        reference: "Genèse 1:1",
        text: "Au commencement, Dieu créa les cieux et la terre.",
        book: "genese",
        chapter: 1,
        verse: 1,
        bible: "louis_segond"
    },
    "Genèse 3:16": {
        reference: "Genèse 3:16",
        text: "La femme répondit au serpent: Nous mangeons du fruit des arbres du jardin.",
        book: "genese",
        chapter: 3,
        verse: 16,
        bible: "louis_segond"
    },

    // EXODE
    "Exode 20:3": {
        reference: "Exode 20:3",
        text: "Tu n'auras pas d'autres dieux devant ma face.",
        book: "exode",
        chapter: 20,
        verse: 3,
        bible: "louis_segond"
    },
    "Exode 20:8": {
        reference: "Exode 20:8",
        text: "Souviens-toi du jour du repos, pour le sanctifier.",
        book: "exode",
        chapter: 20,
        verse: 8,
        bible: "louis_segond"
    },

    // LÉVITIQUE
    "Lévitique 19:18": {
        reference: "Lévitique 19:18",
        text: "Tu aimeras ton prochain comme toi-même. Je suis l'Éternel.",
        book: "levitique",
        chapter: 19,
        verse: 18,
        bible: "louis_segond"
    },

    // NOMBRES
    "Nombres 6:24": {
        reference: "Nombres 6:24",
        text: "L'Éternel te bénisse et te garde!",
        book: "nombres",
        chapter: 6,
        verse: 24,
        bible: "louis_segond"
    },

    // DEUTÉRONOME
    "Deutéronome 6:4": {
        reference: "Deutéronome 6:4",
        text: "Écoute, Israël! L'Éternel, notre Dieu, est le seul Éternel.",
        book: "deuteronome",
        chapter: 6,
        verse: 4,
        bible: "louis_segond"
    },

    // PSAUMES
    "Psaumes 23:1": {
        reference: "Psaumes 23:1",
        text: "L'Éternel est mon berger: je ne manquerai de rien.",
        book: "psaumes",
        chapter: 23,
        verse: 1,
        bible: "louis_segond"
    },
    "Psaumes 100:1": {
        reference: "Psaumes 100:1",
        text: "Poussez des cris de joie vers l'Éternel, habitants de toute la terre!",
        book: "psaumes",
        chapter: 100,
        verse: 1,
        bible: "louis_segond"
    },

    // PROVERBES
    "Proverbes 3:5": {
        reference: "Proverbes 3:5",
        text: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.",
        book: "proverbes",
        chapter: 3,
        verse: 5,
        bible: "louis_segond"
    },

    // MATTHIEU
    "Matthieu 5:3": {
        reference: "Matthieu 5:3",
        text: "Heureux les pauvres en esprit, car le royaume des cieux est à eux!",
        book: "matthieu",
        chapter: 5,
        verse: 3,
        bible: "louis_segond"
    },
    "Matthieu 5:6": {
        reference: "Matthieu 5:6",
        text: "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés!",
        book: "matthieu",
        chapter: 5,
        verse: 6,
        bible: "louis_segond"
    },
    "Matthieu 22:37": {
        reference: "Matthieu 22:37",
        text: "Jésus lui dit: Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, et de toute ta pensée.",
        book: "matthieu",
        chapter: 22,
        verse: 37,
        bible: "louis_segond"
    },

    // MARC
    "Marc 10:45": {
        reference: "Marc 10:45",
        text: "Car le Fils de l'homme est venu, non pour être servi, mais pour servir et donner sa vie en rançon pour plusieurs.",
        book: "marc",
        chapter: 10,
        verse: 45,
        bible: "louis_segond"
    },

    // LUC
    "Luc 1:37": {
        reference: "Luc 1:37",
        text: "Car rien n'est impossible à Dieu.",
        book: "luc",
        chapter: 1,
        verse: 37,
        bible: "louis_segond"
    },

    // JEAN
    "Jean 3:16": {
        reference: "Jean 3:16",
        text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
        book: "jean",
        chapter: 3,
        verse: 16,
        bible: "louis_segond"
    },
    "Jean 11:25": {
        reference: "Jean 11:25",
        text: "Jésus lui dit: Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort.",
        book: "jean",
        chapter: 11,
        verse: 25,
        bible: "louis_segond"
    },
    "Jean 14:6": {
        reference: "Jean 14:6",
        text: "Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.",
        book: "jean",
        chapter: 14,
        verse: 6,
        bible: "louis_segond"
    },

    // ACTES
    "Actes 2:38": {
        reference: "Actes 2:38",
        text: "Pierre leur dit: Repentez-vous, et que chacun de vous soit baptisé au nom de Jésus-Christ, pour le pardon de vos péchés; et vous recevrez le don du Saint-Esprit.",
        book: "actes",
        chapter: 2,
        verse: 38,
        bible: "louis_segond"
    },

    // ROMAINS
    "Romains 3:23": {
        reference: "Romains 3:23",
        text: "Car tous ont péché et sont privés de la gloire de Dieu.",
        book: "romains",
        chapter: 3,
        verse: 23,
        bible: "louis_segond"
    },
    "Romains 6:23": {
        reference: "Romains 6:23",
        text: "Car le salaire du péché, c'est la mort; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus-Christ, notre Seigneur.",
        book: "romains",
        chapter: 6,
        verse: 23,
        bible: "louis_segond"
    },
    "Romains 10:9": {
        reference: "Romains 10:9",
        text: "Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé.",
        book: "romains",
        chapter: 10,
        verse: 9,
        bible: "louis_segond"
    },

    // 1 CORINTHIENS
    "1 Corinthiens 13:4": {
        reference: "1 Corinthiens 13:4",
        text: "L'amour est patient, l'amour est plein de bonté; il n'est pas envieux; l'amour ne se vante pas, il ne s'enfle pas d'orgueil.",
        book: "1corinthiens",
        chapter: 13,
        verse: 4,
        bible: "louis_segond"
    },

    // PHILIPPIENS
    "Philippiens 4:8": {
        reference: "Philippiens 4:8",
        text: "Au reste, frères, que tout ce qui est vrai, tout ce qui est honorable, tout ce qui est juste, tout ce qui est pur, tout ce qui est aimable, tout ce qui mérite l'approbation, soit l'objet de vos pensées.",
        book: "philippiens",
        chapter: 4,
        verse: 8,
        bible: "louis_segond"
    },

    // 2 TIMOTHÉE
    "2 Timothée 2:15": {
        reference: "2 Timothée 2:15",
        text: "Efforce-toi de te présenter devant Dieu comme un homme éprouvé, un ouvrier qui n'a point à rougir, qui dispense droitement la parole de la vérité.",
        book: "2timothee",
        chapter: 2,
        verse: 15,
        bible: "louis_segond"
    },

    // HÉBREUX
    "Hébreux 11:1": {
        reference: "Hébreux 11:1",
        text: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.",
        book: "hebreux",
        chapter: 11,
        verse: 1,
        bible: "louis_segond"
    },

    // 1 PIERRE
    "1 Pierre 3:15": {
        reference: "1 Pierre 3:15",
        text: "Mais sanctifiez dans vos cœurs Christ le Seigneur, étant toujours prêts à vous défendre, avec douceur et respect, contre quiconque vous demande raison de l'espérance qui est en vous.",
        book: "1pierre",
        chapter: 3,
        verse: 15,
        bible: "louis_segond"
    },

    // 1 JEAN
    "1 Jean 4:7": {
        reference: "1 Jean 4:7",
        text: "Bien-aimés, aimons-nous les uns les autres; car l'amour est de Dieu, et quiconque aime est né de Dieu et connaît Dieu.",
        book: "1jean",
        chapter: 4,
        verse: 7,
        bible: "louis_segond"
    },

    // APOCALYPSE
    "Apocalypse 1:8": {
        reference: "Apocalypse 1:8",
        text: "Je suis l'Alpha et l'Oméga, dit le Seigneur Dieu, celui qui est, qui était, et qui vient, le Tout-Puissant.",
        book: "apocalypse",
        chapter: 1,
        verse: 8,
        bible: "louis_segond"
    },
    "Apocalypse 21:4": {
        reference: "Apocalypse 21:4",
        text: "Il essuiera toute larme de leurs yeux; la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.",
        book: "apocalypse",
        chapter: 21,
        verse: 4,
        bible: "louis_segond"
    }
};

// Fonction pour récupérer un verset
function getVerse(reference) {
    return versetsDatabase[reference] || null;
}

// Fonction pour rechercher des versets par livre
function getVersesByBook(book) {
    return Object.values(versetsDatabase).filter(v => v.book === book);
}

// Fonction pour obtenir tous les versets d'une Bible
function getVersesByBible(bible) {
    return Object.values(versetsDatabase).filter(v => v.bible === bible);
}

// Fonctions utilitaires
function saveVerseToDisplay(reference, text, bible) {
    localStorage.setItem('currentVerseReference', reference);
    localStorage.setItem('currentVerseText', text);
    localStorage.setItem('currentVerseSource', getBibleName(bible));
}

function getBibleName(bibleCode) {
    const names = {
        'louis_segond': 'Louis Segond',
        'bible_du_semeur': 'Bible du Semeur',
        'nouvelle_king_james': 'Nouvelle King James',
        'ostervald': 'Ostervald'
    };
    return names[bibleCode] || 'Bible';
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        versetsDatabase,
        getVerse,
        getVersesByBook,
        getVersesByBible,
        saveVerseToDisplay,
        getBibleName
    };
}
