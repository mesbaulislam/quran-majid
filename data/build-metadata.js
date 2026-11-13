#!/usr/bin/env node
"use strict";
var fs = require("fs"), path = require("path"), xml = fs.readFileSync(process.argv[2] || "/tmp/quran-data.xml", "utf8"), juz = JSON.parse(fs.readFileSync(process.argv[3] || "/tmp/juz.json", "utf8"));
var surahMeta = [], re = /<sura\s+index="(\d+)"\s+ayas="(\d+)"\s+start="(\d+)"\s+name="([^"]*)"\s+tname="([^"]*)"\s+ename="([^"]*)"\s+type="([^"]*)"/g, m;
while ((m = re.exec(xml))) surahMeta.push({ number: Number(m[1]), ayahCount: Number(m[2]), type: m[7] === "Medinan" ? "Madani" : "Makki", order: Number(m[6]), introduction: "" });
if (surahMeta.length !== 114) throw new Error("Expected 114 Tanzil Surah metadata records");
var out = { source: { name: "Tanzil Quran metadata + semarketir/quranjson Juz boundaries", tanzilUrl: "https://tanzil.net/docs/quran_metadata", juzUrl: "https://github.com/semarketir/quranjson/blob/master/source/juz.json", note: "Surah introductions are intentionally empty when no verified source is bundled." }, surahs: surahMeta, juz: juz.map(function (j) { return { number: Number(j.index), fromSurah: Number(j.start.index), fromAyah: Number(j.start.verse.replace("verse_", "")), toSurah: Number(j.end.index), toAyah: Number(j.end.verse.replace("verse_", "")) }; }) };
if (out.juz.length !== 30) throw new Error("Expected 30 Juz records");
fs.writeFileSync(process.argv[4] || path.join(__dirname, "..", "data", "metadata.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("Wrote metadata.json with 114 Surahs and 30 Juz records.");
