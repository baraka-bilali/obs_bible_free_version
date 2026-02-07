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
- 🎬 **Intégration OBS native** — source navigateur avec animations de transition
- ⌨️ **Hotkeys OBS** — jusqu'à 10 emplacements de versets contrôlables par raccourcis clavier
- 🎨 **Thèmes** — thème sombre et clair inclus, personnalisables
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

Deux thèmes sont inclus :

- **Sombre** (`common/css/themes/dark/theme.css`) — défaut
- **Clair** (`common/css/themes/light/theme.css`)

Pour changer de thème, modifier le lien CSS dans `browser-source.html` et `control-panel.html`.

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
