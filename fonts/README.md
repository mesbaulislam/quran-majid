# Quran KaiOS

A lightweight, fully offline Quran reader for KaiOS feature phones. It uses vanilla HTML, CSS, and JavaScript, with no framework, CDN, API, analytics, authentication, or device permissions.

## File tree

```text
quran-kaios/
├── manifest.webapp
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── quran.js
│   ├── search.js
│   ├── settings.js
│   └── storage.js
├── data/
│   ├── README.md
│   ├── LICENSE.txt
│   ├── quran.schema.json
│   └── quran.json                 # generated locally from verified data; not fabricated here
├── fonts/
│   └── README.md
├── icons/
│   ├── icon-56.png
│   └── icon-112.png
└── tools/
    ├── generate-icons.py
    └── validate-data.js
```

`manifest.webapp` declares the KaiOS web app, local launch path, icons, developer placeholders, and no permissions. `index.html` contains all screens. `css/style.css` implements the 240×320-oriented interface, focus states, responsive sizing, and dark mode. `js/app.js` coordinates screens and persistence; `navigation.js` handles physical keys; `quran.js` loads and renders only a four-Ayah window; `search.js` performs simple offline matching; `settings.js` manages preferences; and `storage.js` wraps localStorage safely. `data/quran.json` is the only required generated file that is not filled with religious text in this delivery. The two icon files are generated locally by the included Python script.

## Data contract

Create `data/quran.json` according to `data/quran.schema.json`. It must contain exactly 114 Surahs and synchronized Ayahs. Use a trusted Arabic source and separately licensed Bengali translation and pronunciation/transliteration. Do not change trusted Arabic text during conversion. Run:

```bash
node tools/validate-data.js data/quran.json
```

The validator must print `OK` before packaging. See `data/README.md` and `data/LICENSE.txt` for attribution and licensing requirements.

## Creating the project manually

Create the folders exactly as shown, copy each supplied file into the matching path, and place your verified generated dataset at `data/quran.json`. If you use a local Arabic font, put its licensed font file under `fonts/` and update the `font-family` declaration in `css/style.css`; the current app deliberately falls back to a system serif font so it remains usable without an unlicensed font.

Generate icons if needed:

```bash
python3 tools/generate-icons.py
```

Replace `YOUR NAME` and the example developer URL in `manifest.webapp`. Keep the icon names and root-absolute paths unchanged unless you also edit the manifest.

## Manual ZIP procedure

From the directory containing `quran-kaios`, verify that `manifest.webapp` is at the project root, not inside an extra nested directory. Run `node tools/validate-data.js data/quran.json`, then create the archive yourself with your operating system’s archive tool. On Linux/macOS, from the parent directory run:

```bash
zip -r quran-kaios.zip quran-kaios
```

Do not include unrelated editor files, credentials, or a parent directory that hides `manifest.webapp`.

## KaiOS testing

Test the uncompressed directory in a KaiOS simulator or developer workflow, then test the manually packaged app on a compatible device. Check launch and splash behavior; home menu focus; all 114 Surahs; opening a Surah; previous/next reading windows; Arabic shaping; Bengali glyphs; pronunciation and translation toggles; search by name and number; bookmark creation/removal; last-read restoration; settings persistence; dark mode; Backspace and SoftRight; D-pad and Enter; offline operation with network disabled; app close/restart; and phone restart persistence. Confirm that malformed or missing `data/quran.json` displays `Quran data could not be loaded.` rather than crashing.

## Optional font and audio notes

A Quranic Arabic font may be added only after checking its redistribution terms. Audio is intentionally omitted from Version 1. If later added, use locally stored KaiOS-compatible audio files and a per-Surah structure such as `audio/001/001.mp3`; expect substantial storage growth and test codec support on the target handset.

## References

[1]: https://developer.kaiostech.com/docs/getting-started/main-concepts/manifest "KaiOS Manifest documentation"
[2]: https://tanzil.net/docs/text_license "Tanzil Quran Text License"
[3]: https://tanzil.net/docs/download "Tanzil Quran Text Download documentation"
