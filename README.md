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
- ⌨️ **Hotkeys OBS** — jusqu'à 10 emplacements de versets contrôlables par raccourcis clavier
- 🎨 **16 Thèmes** — sombres, clairs, néon, artistiques et plus, tous personnalisables
- 🔽 **Navigation double mode** — flèches pour parcourir ou basculer directement entre versets
- 👁️ **Visibilité du verset** — masquer/afficher sans désélectionner
- 🎚️ **Opacité 3 modes** — contrôle de transparence global, fond uniquement ou texte uniquement
- 📂 **Hors-ligne** — toutes les Bibles sont stockées en JSON local, aucune connexion nécessaire

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
│       ├── bible-api.js           # API de chargement des Bibles JSON
│       ├── versets.js              # Base de données versets (exemples)
│       ├── hotkeys.js              # État des hotkeys (écrit par le Lua)
│       ├── jquery.js
│       └── jscolor.js
│
├── bible-versions/                # Sous-module : données bibliques
│   ├── versions/
│   │   ├── fr/
│   │   │   └── LSG.json           # Louis Segond 1910 (31 102 versets)
│   │   └── en/
│   │       ├── KING JAMES BIBLE.json
│   │       └── WORLD ENGLISH BIBLE.json
│   ├── scraping/                  # Scripts de scraping
│   └── ...
│
├── logos/                         # Logos et ressources graphiques
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
   git clone --recursive https://github.com/<votre-utilisateur>/obs_bible_free_version.git
   ```

2. **Charger le script Lua dans OBS** :
   - Ouvrir OBS → `Outils` → `Scripts`
   - Cliquer sur `+` et sélectionner `bible_display/bible_hotkeys.lua`

3. **Ajouter la source navigateur dans OBS** :
   - Ajouter une source `Navigateur` dans votre scène
   - Cocher `Fichier local` et sélectionner `bible_display/browser-source.html`
   - Largeur recommandée : `1920` — Hauteur : `200`

4. **Ouvrir le panneau de contrôle** :
   - Ouvrir `bible_display/control-panel.html` dans votre navigateur
   - Ou l'ajouter comme Dock personnalisé dans OBS (`Vue` → `Docks` → `Docks de navigateur personnalisés`)

---

## 📝 Utilisation

### Panneau de contrôle

1. **Sélectionner la version biblique** dans le menu déroulant (Louis Segond, KJV, etc.)
2. **Saisir la référence** dans le format `Livre Chapitre:Verset` (ex : `Genesis 1:1`)
3. **Cliquer sur Submit** pour afficher le verset dans OBS

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
| **Display Verse** | Afficher / basculer le verset courant |
| **Hide Verse** | Masquer le verset |
| **Slot #1 à #10** | Charger un verset pré-enregistré |

### Format des références

```
Genesis 1:1          → un verset unique
Genesis 1:1-5        → une plage de versets
John 3:16            → référence en anglais (noms des livres)
```

> **Note** : les noms de livres dans le JSON utilisent la convention anglaise (`Genesis`, `Exodus`, `I Samuel`, `Revelation of John`, etc.)

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
3. Utiliser les scrapers fournis dans `bible-versions/scraping/` pour automatiser le processus

---

## 🎨 Thèmes

16 thèmes sont inclus, répartis en trois catégories :

- **Par défaut** — Classic Dark, Royal Purple, Warm Gold, Ocean Blue, Clean White, Forest Green, Crimson, Transparent
- **Modernes** — Modern Neon, Cyber Pink, Electric Blue, Matrix Green, Professional Blue
- **Artistiques** — Stained Glass, Sunset Horizon, Aurora Night, Vintage Parchment

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

- Le **panneau de contrôle** charge les Bibles JSON via `bible-api.js` et écrit le verset sélectionné dans le `localStorage`
- La **source navigateur** lit le `localStorage` et affiche le verset avec animations
- Le **script Lua** écoute les hotkeys OBS et écrit l'état dans `hotkeys.js`

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
- ⌨️ **OBS Hotkeys** — up to 10 verse slots controllable by keyboard shortcuts
- 🎨 **16 Themes** — dark, light, neon, artistic and more, all customizable
- 🔽 **Dual-mode navigation** — arrow keys to browse or directly switch verses
- 👁️ **Verse visibility toggle** — hide/show without deselecting
- 🎚️ **3-mode opacity** — control transparency for the whole block, background only, or text only
- 📂 **Offline** — all Bibles are stored locally in JSON, no internet connection needed

---

## 🚀 Installation

### Prerequisites

- [OBS Studio](https://obsproject.com/) (version 28+)
- A modern web browser (for the control panel)

### Steps

1. **Clone the repository** into a folder accessible by OBS:
   ```bash
   git clone --recursive https://github.com/<your-username>/obs_bible_free_version.git
   ```

2. **Load the Lua script in OBS**:
   - Open OBS → `Tools` → `Scripts`
   - Click `+` and select `bible_display/bible_hotkeys.lua`

3. **Add the browser source in OBS**:
   - Add a `Browser` source to your scene
   - Check `Local File` and select `bible_display/browser-source.html`
   - Recommended width: `1920` — Height: `200`

4. **Open the control panel**:
   - Open `bible_display/control-panel.html` in your browser
   - Or add it as a Custom Dock in OBS (`View` → `Docks` → `Custom Browser Docks`)

---

## 📝 Usage

### Control Panel

1. **Select the Bible version** from the dropdown menu (Louis Segond, KJV, etc.)
2. **Enter the reference** in the format `Book Chapter:Verse` (e.g. `Genesis 1:1`)
3. **Click Submit** to display the verse in OBS

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
| **Display Verse** | Show / toggle the current verse |
| **Hide Verse** | Hide the verse |
| **Slot #1 to #10** | Load a pre-saved verse |

### Reference Format

```
Genesis 1:1          → a single verse
Genesis 1:1-5        → a range of verses
John 3:16            → English book names
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
3. Use the scrapers provided in `bible-versions/scraping/` to automate the process

---

## 🎨 Themes

16 themes are included, split into three categories:

- **Default** — Classic Dark, Royal Purple, Warm Gold, Ocean Blue, Clean White, Forest Green, Crimson, Transparent
- **Modern** — Modern Neon, Cyber Pink, Electric Blue, Matrix Green, Professional Blue
- **Artistic** — Stained Glass, Sunset Horizon, Aurora Night, Vintage Parchment

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
