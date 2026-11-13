(function (window) {
  "use strict";
  var PREFIX = "quranKaiOS.";
  function read(key, fallback) {
    try { var value = window.localStorage.getItem(PREFIX + key); return value === null ? fallback : JSON.parse(value); }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function remove(key) { try { window.localStorage.removeItem(PREFIX + key); } catch (e) {} }
  window.QuranStorage = { read: read, write: write, remove: remove };
}(window));
