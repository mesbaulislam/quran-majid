(function (window) {
  "use strict";
  function find(query) {
    query = String(query || "").toLowerCase().replace(/^\s+|\s+$/g, "");
    if (!query) return [];
    var result = [], list = window.QuranData.surahs();
    for (var i = 0; i < list.length && result.length < 50; i++) {
      var s = list[i], meta = window.QuranData.getMeta(s.number), haystack = [s.number, s.arabicName, s.bengaliName, s.englishName, meta.type].join(" ").toLowerCase();
      if (haystack.indexOf(query) !== -1) result.push({ number: s.number, bengaliName: s.bengaliName, englishName: s.englishName });
      for (var j = 0; j < s.ayahs.length && result.length < 50; j++) if (String(s.ayahs[j].translation || "").toLowerCase().indexOf(query) !== -1) result.push({ number: s.number, ayah: s.ayahs[j].number, bengaliName: s.bengaliName, englishName: s.englishName });
    }
    return result;
  }
  window.QuranSearch = { find: find };
}(window));
