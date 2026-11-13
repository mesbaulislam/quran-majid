#!/usr/bin/env node
"use strict";
var fs = require("fs");
var manifest = JSON.parse(fs.readFileSync("manifest.webapp", "utf8"));
var quran = JSON.parse(fs.readFileSync("data/quran.json", "utf8"));
var metadata = JSON.parse(fs.readFileSync("data/metadata.json", "utf8"));
if (manifest.version !== "2.1.0") throw new Error("manifest version must be 2.1.0");
if (!quran.surahs || quran.surahs.length !== 114) throw new Error("quran.json must contain 114 Surahs");
if (!metadata.surahs || metadata.surahs.length !== 114) throw new Error("metadata must contain 114 Surahs");
if (!metadata.juz || metadata.juz.length !== 30) throw new Error("metadata must contain 30 Juz records");
quran.surahs.forEach(function (s, i) { var m = metadata.surahs[i]; if (s.number !== i + 1 || m.number !== s.number) throw new Error("Surah order mismatch at " + (i + 1)); if (s.ayahCount !== s.ayahs.length || m.ayahCount !== s.ayahCount) throw new Error("Ayah count mismatch at Surah " + s.number); });
console.log("OK: Version 2.1 metadata is synchronized with quran.json; 114 Surahs, 30 Juz, and " + quran.surahs.reduce(function (n, s) { return n + s.ayahs.length; }, 0) + " Ayahs.");
