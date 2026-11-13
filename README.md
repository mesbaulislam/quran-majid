# Quran Majid

A lightweight, fully offline Quran reader for KaiOS feature phones. Version 2.4.0.

Quran Majid puts the complete Quran — **114 Surahs, 30 Juz, 6,236 Ayahs** — on a small keypad phone with no internet connection needed. It shows the Arabic text with a Bengali translation, and remembers where you stopped reading.

> **Platform:** KaiOS 2.5 (240×320 keypad phones, e.g. Energizer E241S)
> **Developer:** Mesbaul Islam ([@mesbaulislam](https://github.com/mesbaulislam))

## Features

- **Complete offline Quran** — all 114 Surahs and 6,236 Ayahs bundled in `data/quran.json`; no internet, account, or download needed after install
- **Arabic text + Bengali translation** — every ayah shows the Arabic verse and its Bengali meaning (translation can be toggled off in Settings)
- **Continue Reading** — Home shows your last-read position and overall reading progress
- **Surah list** — browse all 114 Surahs with Makki/Madani type and ayah counts; search by name or number
- **Reader** — reads in a four-ayah window with previous/next navigation; zoom Arabic and Bengali text in and out
- **Go to Ayah** — jump straight to any verse, e.g. `2:255`
- **Juz / Para list** — browse all 30 Juz with their Surah:Ayah ranges
- **Bookmarks** — save any ayah and come back to it later
- **Favourites** — mark favourite Surahs
- **Reading history & progress** — see what you have read and how far you have come
- **Offline search** — find a Surah by name, number, or Bengali meaning
- **App Language setting** — switch the app interface between বাংলা and English; the Arabic Quran text and translation stay the same
- **Themes & reading styles** — Default (Dark Emerald Green + Gold) or Dark theme; Standard or Compact reading layout; adjustable Arabic and Bengali font sizes
- **Help screen** — built-in reader shortcuts and keypad navigation guide
- **Keypad-first navigation** — D-pad, OK/Enter, Back, and softkeys; no touchscreen needed
- **Persistent state** — bookmarks, favourites, history, progress, and settings survive app restarts (localStorage)
- **Lightweight** — vanilla HTML/CSS/JavaScript, no framework, no CDN, no analytics, no ads SDK beyond the KaiAds banner on Home

## Reader shortcuts

| Key | Action |
| --- | --- |
| 1 | Zoom out |
| 2 | Previous Surah |
| 3 | Zoom in |
| 4 | History |
| 5 | Bookmark / Remove bookmark |
| 6 | Surah information |
| 7 | Go to Ayah |
| 8 | Next Surah |
| 9 | Favourite / Remove favourite |

↑ / ↓ scroll within an ayah; at the bottom ↓ moves to the next ayah, at the top ↑ moves to the previous one. Back returns to the previous screen, Enter selects.

## Technologies used

- **Vanilla HTML, CSS, and ES5 JavaScript** — no framework, no build step, no CDN, no API
- **KaiOS 2.5** — `manifest.webapp`, fullscreen web app, 240×320 layout
- **localStorage** — settings, bookmarks, favourites, history, and progress
- **KaiAds SDK v5** — banner ad slot on the Home screen (`js/kaiads.v5.min.js`, `app-ads.txt`)
- **Node.js** — data tools under `tools/` (import and validate the Quran dataset)
- **Python 3 + Pillow** — app icon generator (`tools/generate-icons.py`)

## Project structure

```text
quran-majid/
├── manifest.webapp            # KaiOS app manifest (version 2.4.0)
├── index.html                 # All screens (Splash, Home, Surah List, Reader, ...)
├── README.md
├── app-ads.txt                # KaiAds ads.txt entries
├── css/
│   └── style.css              # Dark Emerald Green + Gold theme, 240x320 layout
├── js/
│   ├── app.js                 # Screens, menus, i18n (bn/en), KaiAds setup
│   ├── navigation.js          # Physical keypad handling
│   ├── quran.js               # Loads and renders the 4-ayah reading window
│   ├── search.js              # Offline Surah search
│   ├── settings.js            # Preferences (language, theme, font sizes, ...)
│   ├── storage.js             # Safe localStorage wrapper
│   └── kaiads.v5.min.js       # KaiAds SDK (bundled)
├── data/
│   ├── quran.json             # 114 Surahs, 6,236 Ayahs (Arabic + Bengali)
│   ├── metadata.json          # Surah metadata (type, ayah counts) + Juz ranges
│   ├── quran.schema.json      # JSON Schema for data/quran.json
│   ├── LICENSE.txt            # Data licensing and attribution notice
│   ├── README.md              # Data contract
│   ├── Quran JSON data format guide.md
│   ├── build-metadata.js      # Builds metadata.json from Tanzil + juz sources
│   └── validate-v21.js
├── fonts/
│   └── README.md              # No bundled font; falls back to system serif
├── icons/
│   ├── icon-56.png
│   └── icon-112.png
└── tools/
    ├── generate-icons.py      # Regenerates icons/icon-56.png and icon-112.png
    ├── import-quran-json.js   # Converts a 114-Surah source file to data/quran.json
    └── validate-data.js       # Validates data/quran.json against the contract
```

## Installation and setup

### On a KaiOS phone

1. Download the project (clone this repository or download it as a ZIP).
2. Create the installable archive from the project root, so `manifest.webapp` is at the top level of the archive — not inside an extra folder:

   ```bash
   zip -r quran-majid.zip quran-majid
   ```

3. Install the ZIP on a KaiOS 2.5 device using your usual sideloading workflow (KaiOS WebIDE / Developer Portal). The app needs no permissions and works fully offline.

### For development

```bash
git clone https://github.com/mesbaulislam/quran-majid.git
cd quran-majid
```

Open `index.html` in a browser or load the folder in a KaiOS simulator to try the interface. The app reads `data/quran.json` at startup; if the data file is missing or malformed it shows `Quran data could not be loaded.` instead of crashing.

### Working with the data

Validate the bundled dataset:

```bash
node tools/validate-data.js data/quran.json
```

> **Note:** the bundled validator requires a non-empty `pronunciation` string for every ayah. The dataset shipped in this release leaves the `pronunciation` field empty (the reader shows it only when present), so the validator reports missing-pronunciation errors on the shipped data. The app itself runs fine with this data — this is the same dataset released as v2.4.0 on KaiStore.

Regenerate the app icons (requires Python 3 and Pillow):

```bash
python3 tools/generate-icons.py
```

Rebuild `data/quran.json` from a verified 114-Surah source file and rebuild the metadata with `tools/import-quran-json.js` and `data/build-metadata.js` — see `data/README.md` for the data contract first. Never change the trusted Arabic text during conversion.

## Usage

1. Open **Quran Majid** — the Home screen shows your last-read position and progress.
2. Pick **Continue Reading** to resume, or **Surah List** to choose a Surah.
3. In the Reader, use ↑ / ↓ to move between ayahs and keys 1–9 for the shortcuts above.
4. Use **Go to Ayah** (`Surah:Ayah`, e.g. `2:255`) to jump to a specific verse.
5. Bookmark ayahs (key 5) and favourite Surahs (key 9) to find them again from Home.
6. Open **Settings** to change the app language (বাংলা / English), theme, reading style, font sizes, or to turn the translation on/off.

## Screenshots

No screenshots are bundled in this repository yet.

## Data sources, credits & licensing

- **Arabic Quran text:** Tanzil Quran Text, Copyright (C) 2007–2021 Tanzil Project, Creative Commons Attribution 3.0. Verbatim copying is permitted; the text must not be changed, and copies must keep the copyright notice, attribution to the Tanzil Project, and a link to https://tanzil.net. See `data/LICENSE.txt`.
- **Juz boundaries:** derived from the [semarketir/quranjson](https://github.com/semarketir/quranjson) Juz data (see `data/metadata.json`).
- **Bengali translation:** no license is asserted by this project for the Bengali translation — see `data/LICENSE.txt` before redistributing it.
- **Fonts:** no font file is bundled; the app falls back to the device's system serif font. Add a font only after checking its redistribution terms.
- **KaiAds:** the KaiAds SDK is bundled under its own terms; the publisher configuration in the app belongs to the developer.
- **App code:** no separate code license file is included in this repository.

## Developer

**Mesbaul Islam** — [@mesbaulislam](https://github.com/mesbaulislam)

© 2026 Quran Majid
