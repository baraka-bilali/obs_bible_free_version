# 📖 OBS Bible Free Version — Affichage de versets bibliques pour OBS Studio

> *« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »* — Psaume 119:105

Système complet pour afficher des versets bibliques en temps réel dans **OBS Studio**, avec panneau de contrôle web, hotkeys et thèmes personnalisables.

![Auteur](https://img.shields.io/badge/auteur-Becker_Baraka-purple.svg)
![License](https://img.shields.io/badge/licence-GPL--3.0-blue.svg)
![OBS](https://img.shields.io/badge/OBS_Studio-compatible-green.svg)
![Languages](https://img.shields.io/badge/langues-FR_|_EN-orange.svg)

**Créé avec ❤️ et foi par [Becker Baraka](https://github.com/becker-baraka)** — Ingénieur passionné & Chrétien.

---

## ✨ Fonctionnalités

- 📖 **Recherche de versets** — par livre, chapitre et verset avec autocomplétion
- 🔄 **Multi-versions** — Louis Segond 1910 (FR), King James Bible (EN), World English Bible (EN)
- 🎬 **Intégration OBS native** — source navigateur avec animations de transition fluides
- ⌨️ **Hotkeys OBS** — afficher/masquer le verset et envoyer les 10 premiers favoris par raccourcis clavier
- ⭐ **Favoris** — conservés entre les sessions
- 🎨 **28 Thèmes** — sombres, clairs, néon, artistiques, diffusion et plus, tous personnalisables
- 🔽 **Navigation double mode** — flèches pour parcourir ou basculer directement entre versets
- 👁️ **Visibilité du verset** — masquer/afficher sans désélectionner
- 🎚️ **Opacité 3 modes** — contrôle de transparence global, fond uniquement ou texte uniquement
- 📂 **Hors-ligne** — toutes les Bibles sont stockées localement, aucune connexion nécessaire (seules les polices web optionnelles viennent de Google Fonts ; sans Internet, une police de secours est utilisée)

---

## 📁 Structure du projet

```
obs_bible_free_version/
├── bible_display/                 # Interface principale
│   ├── browser-source.html        # Source navigateur OBS (affichage du verset)
│   ├── control-panel.html         # Panneau de contrôle (sélection des versets)
│   └── bible_hotkeys.lua          # Script Lua pour les hotkeys OBS
│
├── common/                        # Ressources partagées
│   ├── css/
│   │   ├── style-control_panel.css
│   │   ├── style-source.css
│   │   ├── cp-icons.css
│   │   └── themes/
│   │       ├── dark/theme.css
│   │       └── light/theme.css
│   └── js/
│       ├── bible-api.js           # API des Bibles (chargement, recherche, références)
│       ├── bible-fonts.js         # Polices disponibles
│       ├── hotkeys.js             # État des hotkeys (écrit par le Lua, lu par le panneau)
│       ├── jquery.js
│       └── jscolor.js
│
├── bible-versions/                # Données bibliques
│   ├── versions/                  # Sources JSON
│   │   ├── fr/LSG.json            # Louis Segond 1910 (31 102 versets)
│   │   └── en/                    # KING JAMES BIBLE.json, WORLD ENGLISH BIBLE.json
│   ├── js/                        # Fichiers générés par generate_bible_js.py (chargés par le panneau)
│   ├── book_name_mapping.json     # Noms de livres localisés
│   └── scraping/                  # Scripts de scraping
│
├── generate_bible_js.py           # Conversion JSON → JS (fonctionnement sans serveur)
├── LICENSE                        # Licence GPL-3.0
└── README.md
```

---

## 🚀 Installation

### Prérequis

- [OBS Studio](https://obsproject.com/) (version 28+)
- Un navigateur web moderne (pour le panneau de contrôle)

### Étapes

1. **Cloner le dépôt** dans un dossier accessible par OBS :
   ```bash
   git clone https://github.com/<votre-utilisateur>/obs_bible_free_version.git
   ```

2. **Charger le script Lua dans OBS** :
   - Ouvrir OBS → `Outils` → `Scripts`
   - Cliquer sur `+` et sélectionner `bible_display/bible_hotkeys.lua`

3. **Ajouter la source navigateur dans OBS** :
   - Ajouter une source `Navigateur` dans votre scène
   - Cocher `Fichier local` et sélectionner `bible_display/browser-source.html`
   - **Largeur : `1920` — Hauteur : `1080`** (ou `1280` × `720`, même ratio 16:9)
   - Dans OBS, redimensionnez la source en gardant le **ratio 16:9** (maintenez **Shift** en étirant) pour éviter toute déformation du texte

4. **Ouvrir le panneau de contrôle comme Dock OBS** (recommandé) :
   - `Docks` → `Docks de navigateur personnalisés`, URL : `file:///<chemin>/bible_display/control-panel.html`

   > ⚠️ Le panneau transmet les versets à la source navigateur via le `localStorage` du navigateur intégré d'OBS. Ouvert dans un navigateur externe (Chrome, Edge…), le panneau a son propre stockage et **les versets n'apparaîtront pas dans OBS**.

---

## 📝 Utilisation

### Panneau de contrôle

1. **Sélectionner la version biblique** dans le menu déroulant (Louis Segond, KJV, etc.)
2. **Saisir la référence** dans le format `Livre Chapitre:Verset` (ex : `Jean 3:16`)
3. **Cliquer sur Afficher**, puis cliquer sur un verset pour l'envoyer dans OBS

Changer de version réaffiche le même passage dans la nouvelle version (et met à jour le verset à l'écran). La version choisie est mémorisée.

### Recherche par mots clés 🔭

Vous connaissez le récit mais pas la référence ? Cliquez sur le bouton à gauche du champ (l'icône devient des **jumelles**), puis tapez des mots ou une phrase :

| Saisie | Résultat |
|--------|----------|
| `bon berger` | versets contenant **tous** ces mots (mots entiers, accents et majuscules ignorés) |
| `"lumière du monde"` | la phrase exacte |
| `pierre*` | les mots commençant par « pierre » (pierres, pierreux…) |
| `lazare -marthe` | exclut les versets contenant « marthe » |

Les versets contenant la phrase complète apparaissent en premier, puis les autres dans l'ordre biblique, avec les mots trouvés surlignés. Cliquez sur un résultat pour l'afficher dans OBS, ou sur **Chapitre ↗** pour lire le contexte (la flèche ← ramène aux résultats). Si aucun mot exact n'est trouvé, la recherche se fait automatiquement sur le début des mots.

### Raccourcis clavier (onglet Bible)

| Touche | Action |
|--------|--------|
| **↑ / ↓** | Parcourir les versets (mode curseur) ou basculer le verset actif (mode live) |
| **Enter** | Confirmer et afficher le verset surligné |
| **← / →** | Naviguer au chapitre précédent / suivant |
| **+** | Ajouter le verset courant aux favoris |

### Hotkeys OBS

Le script Lua enregistre 12 hotkeys configurables dans OBS (`Paramètres` → `Raccourcis`) :

| Hotkey | Action |
|--------|--------|
| **Bible: Show / Hide Verse** | Masquer le verset affiché / le réafficher (ou afficher le verset surligné) |
| **Bible: Hide Verse** | Masquer le verset |
| **Bible: Show Favorite #1 à #10** | Afficher le favori n° 1 à 10 de l'onglet Liste (numéro affiché devant chaque favori) |

> Les hotkeys sont exécutées par le panneau de contrôle : il doit être ouvert (dans un Dock OBS).

### Format des références

```
Jean 3:16            → un verset unique
Jean 3:16-18         → une plage de versets
Jean 3               → un chapitre entier
John 3:16            → les noms anglais fonctionnent aussi
```

---

## 📚 Bibles disponibles

| Version | Langue | Fichier | Versets | Licence |
|---------|--------|---------|---------|---------|
| **Louis Segond 1910** | 🇫🇷 Français | `versions/fr/LSG.json` | 31 102 | Domaine public |
| **King James Bible** | 🇬🇧 Anglais | `versions/en/KING JAMES BIBLE.json` | — | Domaine public |
| **World English Bible** | 🇬🇧 Anglais | `versions/en/WORLD ENGLISH BIBLE.json` | — | Domaine public |

### Ajouter une nouvelle version

1. Créer un fichier JSON avec la structure suivante :
   ```json
   {
     "version": "CODE",
     "language": "xx",
     "translation": "Nom complet",
     "books": {
       "Genesis": {
         "1": {
           "1": "Texte du verset...",
           "2": "..."
         }
       }
     }
   }
   ```
2. Le placer dans `bible-versions/versions/<langue>/`
3. L'ajouter à la liste `known_versions` de `generate_bible_js.py`, puis lancer `python generate_bible_js.py`
4. Utiliser les scrapers fournis dans `bible-versions/scraping/` pour automatiser le processus

---

## 🎨 Thèmes

28 thèmes sont inclus, répartis en cinq catégories :

- **Par défaut** — Transparent, Classic Dark, Royal Purple, Warm Gold, Ocean Blue, Clean White, Forest Green, Crimson
- **Vedettes** — Ruby Blue, Frosted Glass, Solid, Bread and Wine
- **Modernes** — Modern Neon, Cyber Pink, Electric Blue, Matrix Green, Professional Blue
- **Artistiques** — Stained Glass, Sunset Horizon, Aurora Night, Vintage Parchment, Abstract Blue, Abstract Paint, Elegant Quote
- **Diffusion** — Church Broadcast, Church Gold, Church Blue, Dark Cinema

Changez de thème directement dans l'onglet **Thème** du panneau de contrôle.

---

## 🤝 Contribuer

Ce projet est **entièrement open source** et libre à toute personne souhaitant nous aider à le perfectionner !

Vous pouvez contribuer de plusieurs façons :
- 🐛 Signaler des bugs en créant une [Issue](../../issues)
- 💡 Proposer de nouvelles fonctionnalités
- 🔧 Soumettre une Pull Request avec vos améliorations
- 🌍 Ajouter de nouvelles traductions bibliques
- 📝 Améliorer la documentation

Toute contribution, grande ou petite, est la bienvenue. Ensemble, rendons cet outil encore meilleur pour la communauté !

---

## 💖 Soutenir le projet

Si vous appréciez ce projet et souhaitez faire un don pour soutenir son développement et son amélioration, n'hésitez pas à me contacter :

| Plateforme | Lien |
|------------|------|
| 📱 **WhatsApp** | [+243 980 139 630](https://wa.me/243980139630) |
| 📘 **Facebook** | [Baraka Bilali](https://web.facebook.com/baraka.bilali.9/about) |
| 💼 **LinkedIn** | [Ben Becker Baraka](https://www.linkedin.com/in/ben-becker-baraka/) |
| 📸 **Instagram** | [@baraka_becker](https://www.instagram.com/baraka_becker/) |

Votre soutien, même un simple message d'encouragement, nous motive à continuer ! 🙏

---

## 🛠️ Architecture technique

```
┌─────────────────────┐     localStorage      ┌──────────────────────┐
│   control-panel     │ ──────────────────▶    │   browser-source     │
│   (navigateur)      │                        │   (OBS)              │
└─────────────────────┘                        └──────────────────────┘
         │                                               ▲
         │ charge                                        │ lit
         ▼                                               │
┌─────────────────────┐                        ┌──────────────────────┐
│   bible-api.js      │                        │   hotkeys.js         │
│   (fetch JSON)      │                        │   (état Lua)         │
└─────────────────────┘                        └──────────────────────┘
         │                                               ▲
         │ lit                                           │ écrit
         ▼                                               │
┌─────────────────────┐                        ┌──────────────────────┐
│   versions/*.json   │                        │   bible_hotkeys.lua  │
│   (Bibles)          │                        │   (script OBS)       │
└─────────────────────┘                        └──────────────────────┘
```

- Le **panneau de contrôle** charge uniquement la Bible choisie (fichier `bible-versions/js/*.js`) et écrit le verset sélectionné dans le `localStorage`
- La **source navigateur** lit le `localStorage` et affiche le verset avec animations
- Le **script Lua** écoute les hotkeys OBS et écrit un compteur par hotkey dans `hotkeys.js` ; le **panneau** relit ce fichier régulièrement et exécute l'action correspondante

---

## 📄 Licence

Copyright © 2025-2026 **Becker Baraka**. Tous droits réservés.

Ce projet est sous licence [GNU General Public License v3.0](LICENSE). Vous êtes libre de l'utiliser, le modifier et le redistribuer sous les mêmes conditions. Voir le fichier [LICENSE](LICENSE) pour les détails.

Les textes bibliques inclus (LSG 1910, KJV, WEB) sont dans le **domaine public**.

---

## 👤 Auteur

**Becker Baraka** — Ingénieur passionné & Chrétien

- Conçu et développé intégralement de A à Z
- Scraping des données bibliques via [BibleGateway.com](https://www.biblegateway.com/)

> *Soli Deo Gloria* 🙏

---
---

# 🇬🇧 English Version

# 📖 OBS Bible Free Version — Bible Verse Display for OBS Studio

> *"Your word is a lamp for my feet, a light on my path."* — Psalm 119:105

A complete system to display Bible verses in real-time in **OBS Studio**, with a web control panel, hotkeys, and customizable themes.

![Author](https://img.shields.io/badge/author-Becker_Baraka-purple.svg)
![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![OBS](https://img.shields.io/badge/OBS_Studio-compatible-green.svg)
![Languages](https://img.shields.io/badge/languages-FR_|_EN-orange.svg)

**Made with ❤️ and faith by [Becker Baraka](https://github.com/becker-baraka)** — Passionate Engineer & Christian.

---

## ✨ Features

- 📖 **Verse search** — by book, chapter and verse with autocomplete
- 🔄 **Multi-version** — Louis Segond 1910 (FR), King James Bible (EN), World English Bible (EN)
- 🎬 **Native OBS integration** — browser source with transition animations
- ⌨️ **OBS Hotkeys** — show/hide the verse and send the first 10 favorites with keyboard shortcuts
- ⭐ **Favorites** — kept between sessions
- 🎨 **28 Themes** — dark, light, neon, artistic, broadcast and more, all customizable
- 🔽 **Dual-mode navigation** — arrow keys to browse or directly switch verses
- 👁️ **Verse visibility toggle** — hide/show without deselecting
- 🎚️ **3-mode opacity** — control transparency for the whole block, background only, or text only
- 📂 **Offline** — all Bibles are stored locally, no internet connection needed (only the optional web fonts come from Google Fonts; offline, a fallback font is used)

---

## 🚀 Installation

### Prerequisites

- [OBS Studio](https://obsproject.com/) (version 28+)
- A modern web browser (for the control panel)

### Steps

1. **Clone the repository** into a folder accessible by OBS:
   ```bash
   git clone https://github.com/<your-username>/obs_bible_free_version.git
   ```

2. **Load the Lua script in OBS**:
   - Open OBS → `Tools` → `Scripts`
   - Click `+` and select `bible_display/bible_hotkeys.lua`

3. **Add the browser source in OBS**:
   - Add a `Browser` source to your scene
   - Check `Local File` and select `bible_display/browser-source.html`
   - Recommended width: `1920` — Height: `1080` (or `1280` × `720`, same 16:9 ratio)
   - In OBS, resize the source while keeping **16:9 aspect ratio** (hold **Shift** when dragging) to avoid text distortion

4. **Open the control panel as an OBS Dock** (recommended):
   - `Docks` → `Custom Browser Docks`, URL: `file:///<path>/bible_display/control-panel.html`

   > ⚠️ The panel sends verses to the browser source through the `localStorage` of OBS's built-in browser. Opened in an external browser (Chrome, Edge…), the panel has its own storage and **verses will not appear in OBS**.

---

## 📝 Usage

### Control Panel

1. **Select the Bible version** from the dropdown menu (Louis Segond, KJV, etc.)
2. **Enter the reference** in the format `Book Chapter:Verse` (e.g. `John 3:16`)
3. **Click Submit**, then click a verse to send it to OBS

Switching versions shows the same passage in the new version (and updates the verse on screen). The selected version is remembered.

### Keyword Search 🔭

You remember the story but not the reference? Click the button left of the field (the icon turns into **binoculars**), then type words or a phrase:

| Input | Result |
|-------|--------|
| `good shepherd` | verses containing **all** these words (whole words, accents and case ignored) |
| `"light of the world"` | the exact phrase |
| `stone*` | words starting with "stone" (stones, stoned…) |
| `lazarus -martha` | excludes verses containing "martha" |

Verses containing the whole phrase come first, then the others in Bible order, with matches highlighted. Click a result to show it in OBS, or **Chapter ↗** to read the context (the ← arrow returns to the results). If no exact word is found, the search automatically falls back to word beginnings.

### Keyboard Shortcuts (Bible tab)

| Key | Action |
|-----|--------|
| **↑ / ↓** | Browse verses (cursor mode) or switch active verse (live mode) |
| **Enter** | Confirm and display the highlighted verse |
| **← / →** | Navigate to previous / next chapter |
| **+** | Add current verse to favorites |

### OBS Hotkeys

The Lua script registers 12 configurable hotkeys in OBS (`Settings` → `Hotkeys`):

| Hotkey | Action |
|--------|--------|
| **Bible: Show / Hide Verse** | Hide the displayed verse / show it again (or show the highlighted verse) |
| **Bible: Hide Verse** | Hide the verse |
| **Bible: Show Favorite #1 to #10** | Show favorite #1 to #10 of the List tab (number shown before each favorite) |

> Hotkeys are executed by the control panel: it must be open (in an OBS Dock).

### Reference Format

```
John 3:16            → a single verse
John 3:16-18         → a range of verses
John 3               → a whole chapter
Jean 3:16            → localized book names work with their version
```

---

## 📚 Available Bibles

| Version | Language | File | Verses | License |
|---------|----------|------|--------|---------|
| **Louis Segond 1910** | 🇫🇷 French | `versions/fr/LSG.json` | 31,102 | Public domain |
| **King James Bible** | 🇬🇧 English | `versions/en/KING JAMES BIBLE.json` | — | Public domain |
| **World English Bible** | 🇬🇧 English | `versions/en/WORLD ENGLISH BIBLE.json` | — | Public domain |

### Adding a New Version

1. Create a JSON file with the following structure:
   ```json
   {
     "version": "CODE",
     "language": "xx",
     "translation": "Full name",
     "books": {
       "Genesis": {
         "1": {
           "1": "Verse text...",
           "2": "..."
         }
       }
     }
   }
   ```
2. Place it in `bible-versions/versions/<language>/`
3. Add it to the `known_versions` list of `generate_bible_js.py`, then run `python generate_bible_js.py`
4. Use the scrapers provided in `bible-versions/scraping/` to automate the process

---

## 🎨 Themes

28 themes are included, split into five categories:

- **Default** — Transparent, Classic Dark, Royal Purple, Warm Gold, Ocean Blue, Clean White, Forest Green, Crimson
- **Featured** — Ruby Blue, Frosted Glass, Solid, Bread and Wine
- **Modern** — Modern Neon, Cyber Pink, Electric Blue, Matrix Green, Professional Blue
- **Artistic** — Stained Glass, Sunset Horizon, Aurora Night, Vintage Parchment, Abstract Blue, Abstract Paint, Elegant Quote
- **Broadcast** — Church Broadcast, Church Gold, Church Blue, Dark Cinema

Switch themes directly from the **Theme** tab in the control panel.

---

## 🤝 Contributing

This project is **fully open source** and free for anyone who wants to help us improve it!

You can contribute in several ways:
- 🐛 Report bugs by creating an [Issue](../../issues)
- 💡 Suggest new features
- 🔧 Submit a Pull Request with your improvements
- 🌍 Add new Bible translations
- 📝 Improve the documentation

Every contribution, big or small, is welcome. Together, let's make this tool even better for the community!

---

## 💖 Support the Project

If you enjoy this project and would like to make a donation to support its development and improvement, feel free to contact me:

| Platform | Link |
|----------|------|
| 📱 **WhatsApp** | [+243 980 139 630](https://wa.me/243980139630) |
| 📘 **Facebook** | [Baraka Bilali](https://web.facebook.com/baraka.bilali.9/about) |
| 💼 **LinkedIn** | [Ben Becker Baraka](https://www.linkedin.com/in/ben-becker-baraka/) |
| 📸 **Instagram** | [@baraka_becker](https://www.instagram.com/baraka_becker/) |

Your support, even a simple word of encouragement, motivates us to keep going! 🙏

---

## 📄 License

Copyright © 2025-2026 **Becker Baraka**. All rights reserved.

This project is licensed under [GNU General Public License v3.0](LICENSE). You are free to use, modify, and redistribute it under the same terms. See the [LICENSE](LICENSE) file for details.

The included Bible texts (LSG 1910, KJV, WEB) are in the **public domain**.

---

## 👤 Author

**Becker Baraka** — Passionate Engineer & Christian

- Designed and developed entirely from scratch
- Bible data scraped from [BibleGateway.com](https://www.biblegateway.com/)

> *Soli Deo Gloria* 🙏
