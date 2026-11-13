# Quran JSON data format guide

## 1. Required application JSON

Create `data/quran.json` with this shape. The strings below are placeholders only; replace them with verified source values. Do not treat the placeholders as Quranic content.

```json
{
  "surahs": [
    {
      "number": 1,
      "arabicName": "VERIFIED_ARABIC_SURAH_NAME",
      "bengaliName": "VERIFIED_BENGALI_SURAH_NAME",
      "englishName": "VERIFIED_ENGLISH_NAME",
      "ayahCount": 7,
      "ayahs": [
        {
          "number": 1,
          "arabic": "VERIFIED_TANZIL_AYA_TEXT",
          "pronunciation": "VERIFIED_LICENSED_BENGALI_PRONUNCIATION",
          "translation": "VERIFIED_LICENSED_BENGALI_TRANSLATION"
        }
      ]
    }
  ]
}
```

The real file must contain all 114 Surahs. The number of entries in each `ayahs` array must equal `ayahCount`; Ayah numbers must start at 1 and increase contiguously. Arabic, pronunciation, and translation records are joined by the same pair `(surah.number, ayah.number)`.

## 2. Tanzil XML shape

The official Tanzil download page offers UTF-8 text, text-with-Ayah-numbers, XML, and SQL output. The XML representation is conventionally structured as a root Quran element containing Surah elements and Ayah elements, with numeric identifiers and text attributes. A structural example is:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<quran>
  <sura index="1" name="VERIFIED_ARABIC_SURAH_NAME">
    <aya index="1" text="VERIFIED_TANZIL_AYA_TEXT" />
    <aya index="2" text="VERIFIED_TANZIL_AYA_TEXT" />
  </sura>
</quran>
```

The displayed text values above are deliberately non-content placeholders. Download the actual XML from Tanzil’s official download page, select one consistent Arabic text variant, and preserve the `text` value verbatim. Do not use an HTML parser that changes entities or whitespace without checking the resulting Arabic string.

Tanzil translation downloads use the same Surah/Ayah identity concept. Treat the downloaded translation text as a separate source and join it by numeric Surah and Ayah identifiers, never by text matching. The Bengali pronunciation/transliteration source must be handled the same way.

## 3. Safe conversion approach

A reliable conversion pipeline should first parse each source into a dictionary keyed by `(surah_number, ayah_number)`:

```text
arabic[(1, 1)]        = exact Tanzil Arabic text
translation[(1, 1)]   = licensed Bengali translation
pronunciation[(1, 1)] = licensed Bengali pronunciation
```

Then use the Surah metadata and the three dictionaries to create the application JSON. Abort if any key is missing, duplicated, out of order, or has empty text. Do not silently fill missing records.

## 4. Reference converter template

Save the following as `tools/merge-tanzil-data.py`. It expects three XML files using the Tanzil-style `<sura index="...">` and `<aya index="..." text="...">` structure, plus a metadata JSON file containing the Surah names and counts. It does not contain Quran text and cannot create missing records.

```python
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def read_xml(path):
    root = ET.parse(path).getroot()
    values = {}
    for sura in root.findall(".//sura"):
        surah = int(sura.attrib["index"])
        for aya in sura.findall("./aya"):
            ayah = int(aya.attrib["index"])
            text = aya.attrib.get("text", "")
            if not text.strip():
                raise ValueError(f"Empty text at {surah}:{ayah} in {path}")
            key = (surah, ayah)
            if key in values:
                raise ValueError(f"Duplicate record {surah}:{ayah} in {path}")
            values[key] = text
    return values


def main():
    if len(sys.argv) != 6:
        print("Usage: merge-tanzil-data.py metadata.json arabic.xml pronunciation.xml translation.xml output.json")
        raise SystemExit(2)

    metadata_path, arabic_path, pronunciation_path, translation_path, output_path = map(Path, sys.argv[1:])
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    arabic = read_xml(arabic_path)
    pronunciation = read_xml(pronunciation_path)
    translation = read_xml(translation_path)

    output = {"surahs": []}
    surahs = metadata["surahs"]
    if len(surahs) != 114:
        raise ValueError("metadata must contain exactly 114 Surahs")

    for expected_number, source_sura in enumerate(surahs, start=1):
        if int(source_sura["number"]) != expected_number:
            raise ValueError(f"Surah order error at {expected_number}")
        count = int(source_sura["ayahCount"])
        ayahs = []
        for ayah_number in range(1, count + 1):
            key = (expected_number, ayah_number)
            if key not in arabic or key not in pronunciation or key not in translation:
                raise ValueError(f"Missing synchronized record {expected_number}:{ayah_number}")
            ayahs.append({
                "number": ayah_number,
                "arabic": arabic[key],
                "pronunciation": pronunciation[key],
                "translation": translation[key],
            })
        output["surahs"].append({
            "number": expected_number,
            "arabicName": source_sura["arabicName"],
            "bengaliName": source_sura["bengaliName"],
            "englishName": source_sura["englishName"],
            "ayahCount": count,
            "ayahs": ayahs,
        })

    Path(output_path).write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
```

The metadata file used by this template should have this non-scriptural shape:

```json
{
  "surahs": [
    {
      "number": 1,
      "arabicName": "VERIFIED_ARABIC_SURAH_NAME",
      "bengaliName": "VERIFIED_BENGALI_SURAH_NAME",
      "englishName": "VERIFIED_ENGLISH_NAME",
      "ayahCount": 7
    }
  ]
}
```

Populate it for all 114 Surahs from a verified metadata source. Do not guess counts or names.

## 5. Commands

From the project root:

```bash
python3 tools/merge-tanzil-data.py metadata.json arabic.xml pronunciation.xml translation.xml data/quran.json
node tools/validate-data.js data/quran.json
```

If the converter or validator reports any missing or mismatched record, stop and correct the source mapping. Never replace the missing value with a guessed verse, translation, or pronunciation.

## 6. Licensing checklist

Keep the Tanzil copyright and license notice with the Arabic data. Tanzil’s terms permit verbatim copying and distribution, prohibit changing the text, and require clear attribution plus a link to `https://tanzil.net`. Confirm separate redistribution permission for the Bengali translation and pronunciation source, and record those terms in `data/LICENSE.txt` before packaging.

## References

[1]: https://tanzil.net/download/ "Tanzil official Quran text download"
[2]: https://tanzil.net/docs/text_license "Tanzil Quran text license"
[3]: https://tanzil.net/docs/quran_metadata "Tanzil Quran metadata"
[4]: https://tanzil.net/docs/faq "Tanzil FAQ"
