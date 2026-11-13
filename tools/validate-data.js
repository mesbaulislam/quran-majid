#!/usr/bin/env node
"use strict";
var fs = require("fs");
var path = process.argv[2] || "data/quran.json";
function fail(message) { console.error("ERROR: " + message); process.exitCode = 1; }
if (!fs.existsSync(path)) { fail("Missing " + path + ". Import verified data before packaging."); process.exit(); }
var data;
try { data = JSON.parse(fs.readFileSync(path, "utf8")); } catch (e) { fail("Invalid UTF-8 JSON: " + e.message); process.exit(); }
if (!data || !Array.isArray(data.surahs) || data.surahs.length !== 114) fail("surahs must contain exactly 114 items");
var seen = {};
(data.surahs || []).forEach(function (s, si) {
  if (!s || s.number !== si + 1) fail("Surah at index " + si + " must have number " + (si + 1));
  if (seen[s.number]) fail("Duplicate Surah number " + s.number); seen[s.number] = true;
  ["arabicName", "bengaliName", "englishName"].forEach(function (k) { if (!s[k]) fail("Surah " + s.number + " missing " + k); });
  if (!Array.isArray(s.ayahs) || s.ayahs.length !== s.ayahCount) fail("Surah " + s.number + " ayahCount does not match ayahs length");
  (s.ayahs || []).forEach(function (a, ai) {
    if (!a || a.number !== ai + 1) fail("Surah " + s.number + " Ayah index " + ai + " must have number " + (ai + 1));
    ["arabic", "pronunciation", "translation"].forEach(function (k) { if (!a[k] || typeof a[k] !== "string") fail("Surah " + s.number + " Ayah " + a.number + " missing " + k); });
  });
});
if (!process.exitCode) console.log("OK: 114 Surahs and synchronized Ayahs validated.");
