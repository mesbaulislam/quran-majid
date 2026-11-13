#!/usr/bin/env node
"use strict";
var fs = require("fs");
var input = process.argv[2] || "quran_bn.json";
var output = process.argv[3] || "data/quran.json";
var source = JSON.parse(fs.readFileSync(input, "utf8"));
if (!Array.isArray(source) || source.length !== 114) throw new Error("Source must contain exactly 114 Surahs");
var result = { surahs: source.map(function (s, si) {
  if (s.id !== si + 1 || !Array.isArray(s.verses)) throw new Error("Invalid Surah order at index " + si);
  return {
    number: s.id,
    arabicName: s.name,
    bengaliName: s.translation,
    englishName: s.transliteration,
    ayahCount: s.total_verses,
    ayahs: s.verses.map(function (v, vi) {
      if (v.id !== vi + 1 || !v.text || !v.translation) throw new Error("Missing text at " + s.id + ":" + (vi + 1));
      return {
        number: v.id,
        arabic: v.text,
        pronunciation: "",
        translation: v.translation
      };
    })
  };
}) };
fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log("Wrote " + output + "; pronunciation is intentionally empty and must be added only from a verified licensed source.");
