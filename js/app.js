(function (window) {
  "use strict";

  var currentSurah = 1;
  var currentAyah = 1;

  var settings = {
    arabicSize: 25,
    bengaliSize: 16,
    showTranslation: true,
    darkMode: false
  };

  var totalAyahs = 6236;


  var homeMenuKeys = [
    "mContinue",
    "mSurahs",
    "mBookmarks",
    "mGoAyah",
    "mSettings",
    "mHelp",
    "mAbout"
  ];

  var homeMenuIcons = [
    "book",
    "list",
    "bookmark",
    "go",
    "gear",
    "help",
    "info"
  ];


  /*
   * Inline SVG icons (no icon font needed on KaiOS).
   */

  var ICONS = {
    book: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><path d=\"M7 3.2C5.6 2.1 3.4 1.9 2 2.1V11.4C3.4 11.2 5.6 11.4 7 12.5C8.4 11.4 10.6 11.2 12 11.4V2.1C10.6 1.9 8.4 2.1 7 3.2Z M7 3.2V12.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\"/></svg>",
    list: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"><path d=\"M4.5 3.5H12.5M4.5 7H12.5M4.5 10.5H12.5\"/></g><g fill=\"currentColor\"><circle cx=\"2\" cy=\"3.5\" r=\"1.1\"/><circle cx=\"2\" cy=\"7\" r=\"1.1\"/><circle cx=\"2\" cy=\"10.5\" r=\"1.1\"/></g></svg>",
    heart: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><path d=\"M7 12.2C3.6 9.7 1.6 7.4 1.6 5C1.6 3.1 3.1 1.8 4.8 1.8C5.9 1.8 6.7 2.4 7 3.1C7.3 2.4 8.1 1.8 9.2 1.8C10.9 1.8 12.4 3.1 12.4 5C12.4 7.4 10.4 9.7 7 12.2Z\" fill=\"currentColor\"/></svg>",
    go: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 7H10.5M7.2 3.4L11 7 7.2 10.6\"/></g></svg>",
    layers: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linejoin=\"round\"><path d=\"M7 1.8L12.5 4.8 7 7.8 1.5 4.8Z\"/><path d=\"M1.5 7.6 7 10.6 12.5 7.6\"/><path d=\"M1.5 10.2 7 13.2 12.5 10.2\"/></g></svg>",
    search: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"><circle cx=\"6\" cy=\"6\" r=\"3.8\"/><path d=\"M8.9 8.9L12.4 12.4\"/></g></svg>",
    bookmark: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><path d=\"M3.8 1.8H10.2V12.4L7 9.8 3.8 12.4Z\" fill=\"currentColor\"/></svg>",
    clock: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\"><circle cx=\"7\" cy=\"7\" r=\"5.4\"/><path d=\"M7 4.2V7.2L9.6 8.8\"/></g></svg>",
    chart: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g fill=\"currentColor\"><rect x=\"2\" y=\"8\" width=\"2.6\" height=\"4.2\"/><rect x=\"5.7\" y=\"5.5\" width=\"2.6\" height=\"6.7\"/><rect x=\"9.4\" y=\"2.8\" width=\"2.6\" height=\"9.4\"/></g></svg>",
    gear: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\"><circle cx=\"7\" cy=\"7\" r=\"2.2\"/><path d=\"M7 1.2V3.2M7 10.8V12.8M1.2 7H3.2M10.8 7H12.8M2.9 2.9L4.3 4.3M9.7 9.7L11.1 11.1M11.1 2.9L9.7 4.3M4.3 9.7L2.9 11.1\"/></g></svg>",
    help: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><text x=\"7\" y=\"11.5\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"bold\" fill=\"currentColor\">?</text></svg>",
    info: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.4\" fill=\"none\"><circle cx=\"7\" cy=\"7\" r=\"5.4\"/></g><text x=\"7\" y=\"10.6\" text-anchor=\"middle\" font-size=\"8.5\" font-weight=\"bold\" fill=\"currentColor\">i</text></svg>",
    power: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"><path d=\"M4 4.2A4.8 4.8 0 1 0 10 4.2\"/><path d=\"M7 1.5V7\"/></g></svg>",
    globe: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.3\" fill=\"none\"><circle cx=\"7\" cy=\"7\" r=\"5.4\"/><ellipse cx=\"7\" cy=\"7\" rx=\"2.6\" ry=\"5.4\"/><path d=\"M1.6 7H12.4\"/></g></svg>",
    sun: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.4\" fill=\"none\" stroke-linecap=\"round\"><circle cx=\"7\" cy=\"7\" r=\"3\"/><path d=\"M7 1V2.6M7 11.4V13M1 7H2.6M11.4 7H13M2.8 2.8L3.9 3.9M10.1 10.1L11.2 11.2M11.2 2.8L10.1 3.9M3.9 10.1L2.8 11.2\"/></g></svg>",
    font: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><text x=\"7\" y=\"11\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"bold\" fill=\"currentColor\">Aa</text></svg>",
    style: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><g stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linecap=\"round\"><path d=\"M2 10.5H8M4 8.5L2 12.5M9 3H5.5M7.2 3V12.5\"/></g></svg>",
    translate: "<svg viewBox=\"0 0 14 14\" class=\"ic\"><text x=\"7\" y=\"11\" text-anchor=\"middle\" font-size=\"8\" font-weight=\"bold\" fill=\"currentColor\">Aঅ</text></svg>"
  };


  /*
   * App interface language table.
   * This only translates the app UI chrome.
   * Quran content (Arabic text, translation) is never touched.
   */

  var I18N = {
    bn: {
      appTitle: "কুরআন মাজীদ",
      mContinue: "চালিয়ে পড়ুন",
      mSurahs: "সূরার তালিকা",
      mFav: "প্রিয় সুরা",
      mGoAyah: "আয়াতে যান",
      mJuz: "পারা / জুয",
      mSearch: "অনুসন্ধান",
      mBookmarks: "বুকমার্ক",
      mHistory: "পাঠের ইতিহাস",
      mProgress: "পাঠের অগ্রগতি",
      mSettings: "সেটিংস",
      mHelp: "সাহায্য",
      mAbout: "পরিচিতি",
      mExit: "বন্ধ করুন",
      menuTitle: "মেনু",
      hLastRead: "শেষ পড়া",
      noLastRead: "কোনো পাঠ সংরক্ষিত নেই",
      progressPrefix: "অগ্রগতি: ",
      surahTitle: "সূরার তালিকা",
      surahSearchPh: "সূরা অনুসন্ধান করুন...",
      ayahWord: "আয়াত",
      ayahWordPlural: "আয়াত",
      readerTitle: "পাঠ",
      searchTitle: "অনুসন্ধান",
      searchLabel: "সূরা নাম, নম্বর বা বাংলা অর্থ",
      noResult: "কোনো ফলাফল পাওয়া যায়নি।",
      bmTitle: "বুকমার্ক",
      noBookmark: "কোনো Bookmark নেই।",
      favTitle: "প্রিয় সুরা",
      noFav: "কোনো Favourite Surah নেই।",
      goTitle: "আয়াতে যান",
      goLabel: "Surah:Ayah লিখুন",
      goHint: "উদাহরণ: 1:1, 2:255, 36:58",
      goErrFormat: "উদাহরণ: 2:255",
      goErrNotFound: "এই Ayah পাওয়া যায়নি।",
      juzTitle: "জুজ / পারা",
      juzWord: "জুজ",
      histTitle: "পাঠের ইতিহাস",
      noHistory: "কোনো Reading History নেই।",
      progTitle: "পাঠের অগ্রগতি",
      progressRead: "পড়া হয়েছে",
      surahsStarted: "শুরু করা সূরা",
      setTitle: "সেটিংস",
      setLanguage: "ভাষা (Language)",
      setLangNote: "ভাষা বদলালে শুধু অ্যাপের লেখা বদলাবে। কুরআনের আরবি পাঠ ও অনুবাদ অপরিবর্তিত থাকবে।",
      setTheme: "থিম",
      setStyle: "পাঠের ধরন",
      setArabic: "আরবি Font Size",
      setTrans: "অর্থ Font Size",
      setShowTrans: "অনুবাদ দেখান",
      yes: "হ্যাঁ",
      no: "না",
      helpTitle: "সাহায্য",
      helpUse: "Quran Majid ব্যবহার",
      helpIntro: "এই অ্যাপটি KaiOS keypad phone-এর জন্য তৈরি।",
      helpShortcuts: "Reader Shortcut",
      helpS1: "জুম আউট",
      helpS2: "আগের সূরা",
      helpS3: "জুম ইন",
      helpS4: "ইতিহাস",
      helpS5: "বুকমার্ক / সরান",
      helpS6: "সূরার তথ্য",
      helpS7: "আয়াতে যান",
      helpS8: "পরের সূরা",
      helpS9: "প্রিয় / সরান",
      helpNav: "Reader Navigation",
      helpP1: "↑ / ↓ — আয়াতের মধ্যে scroll",
      helpP2: "আয়াতের একদম নিচে পৌঁছালে ↓ দিয়ে পরের Ayah",
      helpP3: "আয়াতের একদম উপরে গেলে ↑ দিয়ে আগের Ayah",
      helpP4: "Back — আগের screen",
      helpP5: "Enter — Select / Open",
      aboutTitle: "পরিচিতি",
      aboutOffline: "KaiOS-এর জন্য Offline Quran Reader।",
      aboutDeveloper: "ডেভেলপার",
      aboutContact: "যোগাযোগ",
      aboutCredits: "স্বীকৃতি",
      aboutDesigned: "KaiOS feature phone-এর জন্য তৈরি।",
      skMenu: "মেনু",
      skOk: "সিলেক্ট",
      skBack: "ফিরুন",
      surahNumber: "সূরা নম্বর",
      surahType: "ধরন",
      surahAyahCount: "আয়াত সংখ্যা",
      noInfo: "তথ্য নেই",
      makki: "মাক্কী",
      madani: "মাদানী"
    },
    en: {
      appTitle: "Quran Majid",
      mContinue: "Continue Reading",
      mSurahs: "Surah List",
      mFav: "Favourite Surah",
      mGoAyah: "Go to Ayah",
      mJuz: "Juz / Para",
      mSearch: "Search",
      mBookmarks: "Bookmarks",
      mHistory: "Reading History",
      mProgress: "Reading Progress",
      mSettings: "Settings",
      mHelp: "Help",
      mAbout: "About",
      mExit: "Exit",
      menuTitle: "Menu",
      hLastRead: "Last Read",
      noLastRead: "No saved reading",
      progressPrefix: "Progress: ",
      surahTitle: "Surah List",
      surahSearchPh: "Search Surah...",
      ayahWord: "Ayah",
      ayahWordPlural: "Ayahs",
      readerTitle: "Reading",
      searchTitle: "Search",
      searchLabel: "Surah name, number or meaning",
      noResult: "No results found.",
      bmTitle: "Bookmarks",
      noBookmark: "No bookmarks yet.",
      favTitle: "Favourite Surah",
      noFav: "No favourite Surahs yet.",
      goTitle: "Go to Ayah",
      goLabel: "Enter Surah:Ayah",
      goHint: "Example: 1:1, 2:255, 36:58",
      goErrFormat: "Example: 2:255",
      goErrNotFound: "Ayah not found.",
      juzTitle: "Juz / Para",
      juzWord: "Juz",
      histTitle: "Reading History",
      noHistory: "No reading history yet.",
      progTitle: "Reading Progress",
      progressRead: "Read",
      surahsStarted: "Surahs started",
      setTitle: "Settings",
      setLanguage: "Language",
      setLangNote: "Changing the language only changes the app interface. The Arabic Quran text and translation stay the same.",
      setTheme: "Theme",
      setStyle: "Reading Style",
      setArabic: "Arabic Font Size",
      setTrans: "Translation Font Size",
      setShowTrans: "Show Translation",
      yes: "Yes",
      no: "No",
      helpTitle: "Help",
      helpUse: "Using Quran Majid",
      helpIntro: "This app is made for KaiOS keypad phones.",
      helpShortcuts: "Reader Shortcuts",
      helpS1: "Zoom Out",
      helpS2: "Previous Surah",
      helpS3: "Zoom In",
      helpS4: "History",
      helpS5: "Bookmark / Remove",
      helpS6: "Surah Information",
      helpS7: "Go to Ayah",
      helpS8: "Next Surah",
      helpS9: "Favourite / Remove",
      helpNav: "Reader Navigation",
      helpP1: "↑ / ↓ — Scroll inside the Ayah",
      helpP2: "At the bottom of an Ayah, ↓ opens the next Ayah",
      helpP3: "At the top of an Ayah, ↑ opens the previous Ayah",
      helpP4: "Back — Previous screen",
      helpP5: "Enter — Select / Open",
      aboutTitle: "About",
      aboutOffline: "Offline Quran Reader for KaiOS.",
      aboutDeveloper: "Developer",
      aboutContact: "Contact Us",
      aboutCredits: "Credits",
      aboutDesigned: "Designed for KaiOS feature phones.",
      skMenu: "Menu",
      skOk: "Select",
      skBack: "Back",
      surahNumber: "Surah Number",
      surahType: "Type",
      surahAyahCount: "Ayah Count",
      noInfo: "Unknown",
      makki: "Makki",
      madani: "Madani"
    }
  };


  function lang() {
    if (
      settings &&
      settings.language === "en"
    ) {
      return "en";
    }
    return "bn";
  }


  function t(key) {
    var L =
      I18N[lang()] ||
      I18N.bn;

    return L[key] !== undefined
      ? L[key]
      : I18N.bn[key];
  }


  /*
   * Bengali digits for UI numbers in Bengali mode.
   * Latin digits are kept for English mode.
   */

  function bnNum(value) {
    if (lang() !== "bn") {
      return String(value);
    }
    return String(value).replace(
      /[0-9]/g,
      function (d) {
        return "০১২৩৪৫৬৭৮৯".charAt(
          Number(d)
        );
      }
    );
  }


  function nameByLang(surah) {
    if (!surah) {
      return "";
    }
    if (lang() === "en") {
      return surah.englishName ||
        surah.bengaliName ||
        "";
    }
    return surah.bengaliName ||
      surah.englishName ||
      "";
  }


  function typeByLang(type) {
    if (type === "Makki") {
      return t("makki");
    }
    if (type === "Madani") {
      return t("madani");
    }
    return type;
  }


  /*
   * true while the About screen shows a Surah info card
   * instead of the default About content.
   */

  var aboutIsSurahInfo = false;


  function updateLastReadLabel() {

    var lastRead =
      $("last-read-label");

    if (!lastRead) {
      return;
    }

    var last =
      read(
        "lastRead",
        null
      );

    if (
      last &&
      last.surah &&
      window.QuranData
    ) {

      var surah =
        window.QuranData.getSurah(
          Number(last.surah)
        );

      if (surah) {

        lastRead.textContent =
          nameByLang(surah) +
          " — " +
          t("ayahWord") +
          " " +
          bnNum(
            last.ayah || 1
          );

        return;
      }
    }

    lastRead.textContent =
      (last && last.label)
        ? last.label
        : t("noLastRead");
  }


  /*
   * Apply the current app language:
   * 1. static labels via data-i18n attributes
   * 2. re-render the visible screen
   */

  function applyLanguage() {

    settings =
      getSettings();

    var L =
      lang();

    try {
      document.documentElement.setAttribute(
        "lang",
        L
      );
    } catch (e) {}

    var els =
      document.querySelectorAll(
        "[data-i18n]"
      );

    for (
      var i = 0;
      i < els.length;
      i++
    ) {

      var key =
        els[i].getAttribute(
          "data-i18n"
        );

      if (key) {
        els[i].textContent =
          t(key);
      }
    }

    var phs =
      document.querySelectorAll(
        "[data-i18n-ph]"
      );

    for (
      var j = 0;
      j < phs.length;
      j++
    ) {

      var pkey =
        phs[j].getAttribute(
          "data-i18n-ph"
        );

      if (pkey) {
        phs[j].setAttribute(
          "placeholder",
          t(pkey)
        );
      }
    }

    renderAllScreens();
  }


  /*
   * Re-render every screen's dynamic content in the current
   * language. Back navigation only switches screens without
   * re-rendering them, so without this pass a language change
   * would leave previously-built screens in the old language
   * until the app is restarted.
   */

  function renderAllScreens() {

    refreshCurrentScreen();

    renderHomeMenu();

    updateLastReadLabel();

    renderHomeProgress();

    renderProgressContent();

    renderMenu();

    renderSettings();

    var dataReady =
      window.QuranData &&
      window.QuranData.surahs().length > 0;

    if (dataReady) {

      renderSurahScreen();

      renderBookmarkScreen();

      renderFavouriteScreen();

      renderHistoryScreen();

      renderJuzScreen();

      renderSearch();
    }

    if (!aboutIsSurahInfo) {

      renderAboutDefault();

    } else if (dataReady) {

      var surah =
        window.QuranData.getSurah(
          currentSurah
        );

      if (surah) {

        renderSurahInfoContent(
          surah,
          window.QuranData.getMeta(
            currentSurah
          ) || {}
        );
      }
    }
  }


  function refreshCurrentScreen() {

    var cur =
      "home";

    try {

      if (
        window.QuranNavigation &&
        typeof window.QuranNavigation.current ===
          "function"
      ) {
        cur =
          window.QuranNavigation.current();
      }

    } catch (e) {}

    if (cur === "home") {

      renderHomeMenu();

      updateLastReadLabel();

      renderHomeProgress();

      return;
    }

    if (cur === "surah-list") {

      renderSurahScreen();

      return;
    }

    if (cur === "bookmarks") {

      renderBookmarkScreen();

      return;
    }

    if (cur === "favourites") {

      renderFavouriteScreen();

      return;
    }

    if (cur === "history") {

      renderHistoryScreen();

      return;
    }

    if (cur === "juz-list") {

      renderJuzScreen();

      return;
    }

    if (cur === "progress") {

      renderProgressContent();

      return;
    }

    if (cur === "settings") {

      renderSettings();

      return;
    }

    if (cur === "menu") {

      renderMenu();

      return;
    }

    if (cur === "reader") {

      renderReader(
        false
      );

      return;
    }

    if (cur === "search") {

      renderSearch();

      return;
    }

    if (
      cur === "about" &&
      !aboutIsSurahInfo
    ) {

      renderAboutDefault();

      return;
    }
  }


  /*
   * Context menu (Home -> Menu softkey).
   * Only real, working actions are listed.
   */

  var menuScreenItems = [
    {
      key: "mFav",
      icon: "heart",
      action: showFavourites
    },
    {
      key: "mJuz",
      icon: "layers",
      action: showJuz
    },
    {
      key: "mSearch",
      icon: "search",
      action: showSearch
    },
    {
      key: "mHistory",
      icon: "clock",
      action: showHistory
    },
    {
      key: "mProgress",
      icon: "chart",
      action: showProgress
    },
    {
      key: "mExit",
      icon: "power",
      action: exitApp
    }
  ];


  function openMenu() {

    openScreen(
      "menu"
    );

    renderMenu();
  }


  function renderMenu() {

    var menu =
      $("menu-items");

    if (!menu) {
      return;
    }

    menu.innerHTML = "";

    for (
      var i = 0;
      i < menuScreenItems.length;
      i++
    ) {

      var item =
        menuScreenItems[i];

      var button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "menu-item";

      button.setAttribute(
        "tabindex",
        "0"
      );

      button.innerHTML =
        ICONS[item.icon] +
        "<span class='menu-label'>" +
        esc(
          t(item.key)
        ) +
        "</span>" +
        "<span class='menu-chev'>›</span>";

      button.onclick =
        (function (fn) {

          return function () {
            fn();
          };

        })(item.action);

      menu.appendChild(
        button
      );
    }
  }


  function $(id) {
    return document.getElementById(id);
  }


  function esc(value) {
    return String(
      value === undefined || value === null
        ? ""
        : value
    ).replace(
      /[&<>"]/g,
      function (c) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;"
        }[c];
      }
    );
  }


  function read(key, fallback) {
    try {
      if (
        window.QuranStorage &&
        typeof window.QuranStorage.read === "function"
      ) {
        return window.QuranStorage.read(
          key,
          fallback
        );
      }
    } catch (e) {}

    return fallback;
  }


  function write(key, value) {
    try {
      if (
        window.QuranStorage &&
        typeof window.QuranStorage.write === "function"
      ) {
        window.QuranStorage.write(
          key,
          value
        );
      }
    } catch (e) {}
  }


  function safeText(id, text) {
    var el = $(id);
    if (el) {
      el.textContent = text;
    }
  }


  /* =====================================================
     SCREEN
  ===================================================== */

  function openScreen(name) {

    /*
     * Navigation must receive the transition BEFORE the current
     * screen is hidden. Otherwise navigation.js cannot record the
     * correct previous focus for Back.
     */
    if (
      window.QuranNavigation &&
      typeof window.QuranNavigation.open ===
        "function"
    ) {

      try {
        window.QuranNavigation.open(
          name,
          true
        );
        return;
      } catch (e) {}
    }

    /*
     * Safe fallback if navigation.js is unavailable.
     */
    var screens =
      document.querySelectorAll(".screen");

    for (
      var i = 0;
      i < screens.length;
      i++
    ) {
      screens[i].classList.add("hidden");
    }

    var target = $(name);

    if (target) {
      target.classList.remove("hidden");
    }
  }


  /* =====================================================
     HOME
  ===================================================== */


  function renderHomeMenu() {

    var menu =
      $("home-menu");

    if (!menu) {
      return;
    }

    /*
     * IMPORTANT:
     * Always rebuild the complete Home menu.
     */

    menu.innerHTML = "";

    for (
      var i = 0;
      i < homeMenuKeys.length;
      i++
    ) {

      var button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "menu-item";

      button.setAttribute(
        "tabindex",
        "0"
      );

      button.innerHTML =
        ICONS[homeMenuIcons[i]] +
        "<span class='menu-label'>" +
        esc(
          t(homeMenuKeys[i])
        ) +
        "</span>" +
        "<span class='menu-chev'>›</span>";

      button.onclick =
        createHomeAction(i);

      menu.appendChild(
        button
      );
    }
  }


  /* Compatibility alias preserved from V2.1.0. */
  function renderHome() {
    renderHomeMenu();
  }


  function createHomeAction(index) {

    return function () {

      switch (index) {

        case 0:
          continueReading();
          break;

        case 1:
          showSurahs();
          break;

        case 2:
          showBookmarks();
          break;

        case 3:
          showGoAyah();
          break;

        case 4:
          showSettings();
          break;

        case 5:
          showHelp();
          break;

        case 6:
          showAbout();
          break;
      }
    };
  }


  var homeAdRequested = false;


  function loadHomeAd() {

    if (homeAdRequested) {
      return;
    }

    var container =
      $("kaiads-home");

    if (
      !container ||
      typeof window.getKaiAd !== "function"
    ) {
      return;
    }

    homeAdRequested = true;

    // Keep the ad slot only while an ad is being loaded.
    container.style.display = "block";
    container.style.width = "240px";
    container.style.height = "80px";
    container.style.margin = "6px auto 8px";
    container.style.overflow = "hidden";

    var adReady = false;

    // If no real ad arrives, remove the blank space.
    var hideTimer = setTimeout(function () {
      if (!adReady) {
        container.style.display = "none";
        container.style.height = "0px";
        container.style.margin = "0";
      }
    }, 10500);

    try {
      window.getKaiAd({
        publisher: "e5fb8556-5d9a-4fbb-9a54-a8ad00691cd8",
        app: "Quran Majid",
        slot: "home-banner",
        w: 240,
        h: 80,
        test: 0,
        timeout: 10000,
        container: container,
        onerror: function (err) {
          clearTimeout(hideTimer);
          container.style.display = "none";
          container.style.height = "0px";
          container.style.margin = "0";
          try {
            console.log("KaiAds error:", err);
          } catch (e) {}
        },
        onready: function (ad) {
          adReady = true;
          clearTimeout(hideTimer);
          container.style.display = "block";
          container.style.width = "240px";
          container.style.height = "80px";
          container.style.margin = "6px auto 8px";
          container.style.overflow = "hidden";
          try {
            ad.call("display", {
              tabindex: 0,
              display: "block"
            });
          } catch (e) {}
        }
      });
    } catch (e) {
      clearTimeout(hideTimer);
      container.style.display = "none";
      container.style.height = "0px";
      container.style.margin = "0";
      homeAdRequested = false;
    }
  }



  function showHome() {

    var splash =
      $("splash");

    var home =
      $("home");

    if (splash) {
      splash.classList.add(
        "hidden"
      );
    }

    if (home) {
      home.classList.remove(
        "hidden"
      );
    }

    /*
     * MOST IMPORTANT:
     * Render menu every time Home opens.
     */

    renderHomeMenu();

    updateLastReadLabel();

    renderHomeProgress();

    loadHomeAd();
  }


  function continueReading() {

    var last =
      read(
        "lastRead",
        null
      );

    if (
      last &&
      last.surah
    ) {

      openReader(
        Number(last.surah),
        Number(last.ayah || 1)
      );

    } else {

      showSurahs();
    }
  }


  function exitApp() {

    try {
      window.close();
    } catch (e) {}
  }


  /* =====================================================
     SURAH
  ===================================================== */


  function showSurahs() {

    openScreen(
      "surah-list"
    );

    var searchInput =
      $("surah-search");

    if (searchInput) {
      searchInput.value = "";
    }

    renderSurahScreen();
  }


  function renderSurahScreen() {

    if (
      !window.QuranData ||
      typeof window.QuranData.renderSurahList !==
        "function"
    ) {
      return;
    }

    var list =
      window.QuranData.surahs();

    var count =
      $("surah-count");

    if (count) {
      count.textContent =
        bnNum(
          list.length || 114
        );
    }

    var searchInput =
      $("surah-search");

    window.QuranData.renderSurahList(
      $("surah-items"),
      openReader,
      isFavourite,
      searchInput
        ? searchInput.value
        : ""
    );
  }


  function getFavourites() {

    var list =
      read(
        "favourites",
        []
      );

    return Array.isArray(list)
      ? list
      : [];
  }


  function isFavourite(number) {

    return getFavourites().indexOf(
      Number(number)
    ) !== -1;
  }


  function toggleFavourite(number) {

    number =
      Number(number);

    var list =
      getFavourites();

    var index =
      list.indexOf(number);

    if (index >= 0) {
      list.splice(
        index,
        1
      );
    } else {
      list.push(number);
    }

    write(
      "favourites",
      list
    );
  }



  function showFavourites() {

    openScreen(
      "favourites"
    );

    renderFavouriteScreen();
  }


  function renderFavouriteScreen() {

    var container =
      $("favourite-items");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    var list =
      getFavourites();

    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      var number =
        Number(list[i]);

      var surah =
        window.QuranData.getSurah(
          number
        );

      if (!surah) {
        continue;
      }

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "list-item surah-card";

      button.innerHTML =
        "<span class='surah-badge'>" +
        bnNum(number) +
        "</span>" +
        "<span class='surah-names'>" +
        "<span class='surah-main'>" +
        esc(
          nameByLang(surah)
        ) +
        "</span>" +
        "</span>" +
        "<span class='surah-chev'>›</span>";

      button.onclick =
        (function (n) {

          return function () {
            openReader(
              n,
              1
            );
          };

        })(number);

      container.appendChild(
        button
      );
    }

    if (
      !container.children.length
    ) {

      container.innerHTML =
        "<p class='about-content'>" +
        t("noFav") +
        "</p>";
    }
  }


  /* =====================================================
     READER
  ===================================================== */

  function openReader(
    surahNumber,
    ayahNumber
  ) {

    var surah =
      window.QuranData.getSurah(
        surahNumber
      );

    if (!surah) {
      return;
    }

    currentSurah =
      Number(surahNumber);

    currentAyah =
      Math.max(
        1,
        Math.min(
          Number(ayahNumber) || 1,
          Number(surah.ayahCount)
        )
      );

    openScreen(
      "reader"
    );

    renderReader(
      true
    );
  }



  function renderReader(
    resetScroll
  ) {

    try {
      settings =
        window.QuranSettings.get();
    } catch (e) {}

    var surah =
      window.QuranData.getSurah(
        currentSurah
      );

    if (!surah) {
      return;
    }

    currentAyah =
      Math.max(
        1,
        Math.min(
          currentAyah,
          Number(surah.ayahCount)
        )
      );

    var title =
      $("reader-title");

    if (title) {
      title.textContent =
        nameByLang(surah);
    }

    var position =
      $("reader-position");

    if (position) {
      position.textContent =
        bnNum(currentAyah) +
        "/" +
        bnNum(surah.ayahCount);
    }

    var info =
      $("reader-info");

    if (info) {

      var meta =
        window.QuranData.getMeta(
          currentSurah
        ) || {};

      info.innerHTML =
        "<span class='badge'>" +
        esc(
          typeByLang(
            meta.type ||
            t("noInfo")
          )
        ) +
        "</span>";
    }

    var content =
      $("reader-content");

    if (
      !content
    ) {
      return;
    }

    /*
     * quran.js renders ONLY current Ayah.
     */

    window.QuranData.renderReader(
      content,
      currentSurah,
      currentAyah,
      settings,
      bookmarkApi
    );

    applyReaderSize();

    if (
      resetScroll !== false
    ) {
      content.scrollTop = 0;
    }

    saveLastRead(
      surah
    );

    markProgress();
  }


  function applyReaderSize() {

    var content =
      $("reader-content");

    if (!content) {
      return;
    }

    content.style.setProperty(
      "--arabic-size",
      settings.arabicSize +
      "px"
    );

    content.style.setProperty(
      "--bengali-size",
      settings.bengaliSize +
      "px"
    );

  }


  /*
   * One Ayah at a time.
   */

  function readerMove(
    direction
  ) {

    var content =
      $("reader-content");

    var surah =
      window.QuranData.getSurah(
        currentSurah
      );

    if (
      !content ||
      !surah
    ) {
      return;
    }


    var top =
      content.scrollTop;

    var height =
      content.clientHeight;

    var total =
      content.scrollHeight;


    var atTop =
      top <= 2;

    var atBottom =
      top + height >=
      total - 2;


    /*
     * DOWN
     */

    if (
      direction > 0
    ) {

      if (!atBottom) {

        content.scrollTop =
          Math.min(
            total - height,
            top +
              Math.max(
                35,
                Math.floor(
                  height *
                  0.70
                )
              )
          );

        return;
      }


      if (
        currentAyah <
        Number(
          surah.ayahCount
        )
      ) {

        currentAyah++;

        renderReader(
          true
        );

        return;
      }


      if (
        currentSurah <
        114
      ) {

        currentSurah++;

        currentAyah =
          1;

        renderReader(
          true
        );
      }

      return;
    }


    /*
     * UP
     */

    if (
      direction < 0
    ) {

      if (!atTop) {

        content.scrollTop =
          Math.max(
            0,
            top -
              Math.max(
                35,
                Math.floor(
                  height *
                  0.70
                )
              )
          );

        return;
      }


      if (
        currentAyah >
        1
      ) {

        currentAyah--;

        renderReader(
          true
        );

        return;
      }


      if (
        currentSurah >
        1
      ) {

        currentSurah--;

        var previous =
          window.QuranData.getSurah(
            currentSurah
          );

        if (previous) {

          currentAyah =
            Number(
              previous.ayahCount
            );

          renderReader(
            true
          );
        }
      }
    }
  }


  /* =====================================================
     ZOOM
  ===================================================== */

  function adjustFont(
    delta
  ) {

    try {
      settings =
        window.QuranSettings.get();
    } catch (e) {}

    settings.arabicSize =
      Math.max(
        18,
        Math.min(
          40,
          Number(
            settings.arabicSize
          ) +
          delta
        )
      );

    settings.bengaliSize =
      Math.max(
        12,
        Math.min(
          28,
          Number(
            settings.bengaliSize
          ) +
          delta
        )
      );


    try {
      window.QuranSettings.save(
        settings
      );
    } catch (e) {}

    renderReader(
      true
    );
  }


  /* =====================================================
     BOOKMARK
  ===================================================== */

  function getBookmarks() {

    var list =
      read(
        "bookmarks",
        []
      );

    return Array.isArray(list)
      ? list
      : [];
  }


  var bookmarkApi = {

    isBookmarked:
      function (
        surah,
        ayah
      ) {

        var list =
          getBookmarks();

        for (
          var i = 0;
          i < list.length;
          i++
        ) {

          if (
            Number(
              list[i].surah
            ) === Number(surah) &&
            Number(
              list[i].ayah
            ) === Number(ayah)
          ) {

            return true;
          }
        }

        return false;
      },


    toggle:
      function (
        surah,
        ayah
      ) {

        var list =
          getBookmarks();

        var found =
          -1;

        for (
          var i = 0;
          i < list.length;
          i++
        ) {

          if (
            Number(
              list[i].surah
            ) === Number(surah) &&
            Number(
              list[i].ayah
            ) === Number(ayah)
          ) {

            found =
              i;

            break;
          }
        }

        if (
          found >= 0
        ) {

          list.splice(
            found,
            1
          );

        } else {

          list.unshift({
            surah:
              Number(surah),

            ayah:
              Number(ayah)
          });
        }

        write(
          "bookmarks",
          list
        );
      }
  };


  function toggleCurrentBookmark() {

    bookmarkApi.toggle(
      currentSurah,
      currentAyah
    );

    renderReader(
      false
    );
  }



  function showBookmarks() {

    openScreen(
      "bookmarks"
    );

    renderBookmarkScreen();
  }


  function renderBookmarkScreen() {

    var container =
      $("bookmark-items");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    var list =
      getBookmarks();

    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      var item =
        list[i];

      var surah =
        window.QuranData.getSurah(
          item.surah
        );

      if (!surah) {
        continue;
      }

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "list-item";

      button.textContent =
        nameByLang(surah) +
        " — " +
        t("ayahWord") +
        " " +
        bnNum(item.ayah);

      button.onclick =
        (function (
          s,
          a
        ) {

          return function () {

            openReader(
              s,
              a
            );
          };

        })(
          item.surah,
          item.ayah
        );

      container.appendChild(
        button
      );
    }

    if (
      !container.children.length
    ) {

      container.innerHTML =
        "<p class='about-content'>" +
        t("noBookmark") +
        "</p>";
    }
  }


  /* =====================================================
     GO TO AYAH
  ===================================================== */

  function showGoAyah() {

    openScreen(
      "go-ayah"
    );

    var input =
      $("ayah-input");

    var error =
      $("ayah-error");

    if (input) {
      input.value = "";
      input.focus();
    }

    if (error) {
      error.textContent = "";
      error.classList.add(
        "hidden"
      );
    }
  }



  function goAyah() {

    var input =
      $("ayah-input");

    var error =
      $("ayah-error");

    if (!input) {
      return;
    }

    var value =
      input.value
        .replace(
          /\s+/g,
          ""
        )
        .trim();

    var match =
      value.match(
        /^(\d{1,3})[:.-](\d{1,3})$/
      );

    if (!match) {

      if (error) {

        error.textContent =
          t("goErrFormat");

        error.classList.remove(
          "hidden"
        );
      }

      return;
    }

    var s =
      Number(
        match[1]
      );

    var a =
      Number(
        match[2]
      );

    var surah =
      window.QuranData.getSurah(
        s
      );

    if (
      !surah ||
      a < 1 ||
      a > Number(
        surah.ayahCount
      )
    ) {

      if (error) {

        error.textContent =
          t("goErrNotFound");

        error.classList.remove(
          "hidden"
        );
      }

      return;
    }

    openReader(
      s,
      a
    );
  }


  /* =====================================================
     JUZ
  ===================================================== */


  function showJuz() {

    openScreen(
      "juz-list"
    );

    renderJuzScreen();
  }


  function renderJuzScreen() {

    var container =
      $("juz-items");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    var metadata =
      window.QuranData.meta() ||
      {};

    var list =
      Array.isArray(
        metadata.juz
      )
        ? metadata.juz
        : [];

    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      var item =
        list[i];

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "list-item";

      button.textContent =
        t("juzWord") +
        " " +
        bnNum(
          item.number ||
          i + 1
        );

      button.onclick =
        (function (
          x
        ) {

          return function () {

            openReader(
              Number(
                x.fromSurah ||
                x.startSurah
              ),
              Number(
                x.fromAyah ||
                x.startAyah ||
                1
              )
            );
          };

        })(item);

      container.appendChild(
        button
      );
    }
  }


  /* =====================================================
     HISTORY
  ===================================================== */

  function addHistory() {

    var list =
      read(
        "history",
        []
      );

    if (
      !Array.isArray(list)
    ) {
      list = [];
    }

    list =
      list.filter(
        function (item) {

          return !(
            Number(
              item.surah
            ) ===
              currentSurah &&
            Number(
              item.ayah
            ) ===
              currentAyah
          );
        }
      );

    list.unshift({
      surah:
        currentSurah,

      ayah:
        currentAyah,

      time:
        Date.now()
    });

    write(
      "history",
      list.slice(
        0,
        20
      )
    );
  }



  function showHistory() {

    openScreen(
      "history"
    );

    renderHistoryScreen();
  }


  function renderHistoryScreen() {

    var container =
      $("history-items");

    if (!container) {
      return;
    }

    container.innerHTML = "";

    var list =
      read(
        "history",
        []
      );

    if (
      !Array.isArray(list)
    ) {
      list = [];
    }

    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      var item =
        list[i];

      var surah =
        window.QuranData.getSurah(
          item.surah
        );

      if (!surah) {
        continue;
      }

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "list-item";

      button.textContent =
        nameByLang(surah) +
        " — " +
        t("ayahWord") +
        " " +
        bnNum(item.ayah);

      button.onclick =
        (function (
          s,
          a
        ) {

          return function () {

            openReader(
              s,
              a
            );
          };

        })(
          item.surah,
          item.ayah
        );

      container.appendChild(
        button
      );
    }

    if (
      !container.children.length
    ) {

      container.innerHTML =
        "<p class='about-content'>" +
        t("noHistory") +
        "</p>";
    }
  }


  /* =====================================================
     PROGRESS
  ===================================================== */

  function markProgress() {

    var progress =
      read(
        "progress",
        {}
      );

    if (
      !progress ||
      typeof progress !==
        "object"
    ) {
      progress = {};
    }

    progress[
      currentSurah +
      ":" +
      currentAyah
    ] = true;

    write(
      "progress",
      progress
    );
  }


  function progressCount() {

    var progress =
      read(
        "progress",
        {}
      );

    if (
      !progress ||
      typeof progress !==
        "object"
    ) {
      return 0;
    }

    return Object.keys(
      progress
    ).length;
  }


  function progressPercent() {

    if (!totalAyahs) {
      return 0;
    }

    return Math.min(
      100,

      Math.round(
        progressCount() /
          totalAyahs *
          100
      )
    );
  }



  function progressSurahCount() {

    var progress =
      read(
        "progress",
        {}
      );

    if (
      !progress ||
      typeof progress !==
        "object"
    ) {
      return 0;
    }

    var seen = {};

    var keys =
      Object.keys(
        progress
      );

    for (
      var i = 0;
      i < keys.length;
      i++
    ) {

      var parts =
        String(keys[i]).split(":");

      if (
        parts.length === 2
      ) {
        seen[parts[0]] = true;
      }
    }

    return Object.keys(
      seen
    ).length;
  }


  function showProgress() {

    openScreen(
      "progress"
    );

    renderProgressContent();
  }


  function renderProgressContent() {

    var container =
      $("progress-content");

    if (!container) {
      return;
    }

    var percent =
      progressPercent();

    var count =
      progressCount();

    container.innerHTML =

      "<div class='progress-card'>" +

      "<p class='progress-big'>" +
      bnNum(percent) +
      "%</p>" +

      "<div class='progress-track'>" +

      "<span style='width:" +
      percent +
      "%'></span>" +

      "</div>" +

      "<p class='progress-line'>" +
      t("progressRead") +
      ": <strong>" +
      bnNum(count) +
      " / " +
      bnNum(totalAyahs) +
      " " +
      t("ayahWordPlural") +
      "</strong></p>" +

      "<p class='progress-line'>" +
      t("surahsStarted") +
      ": <strong>" +
      bnNum(
        progressSurahCount()
      ) +
      "</strong></p>" +

      "</div>";
  }


  function renderHomeProgress() {

    var percent =
      progressPercent();

    safeText(
      "home-progress",
      t("progressPrefix") +
      bnNum(percent) +
      "%"
    );

    var fill =
      $("home-progress-fill");

    if (fill) {
      fill.style.width =
        percent + "%";
    }
  }


  /* =====================================================
     SEARCH
  ===================================================== */

  function showSearch() {

    openScreen(
      "search"
    );

    var input =
      $("search-input");

    if (input) {
      input.value = "";
      input.focus();
    }
  }



  function renderSearch() {

    var input =
      $("search-input");

    var container =
      $("search-results");

    if (
      !input ||
      !container ||
      !window.QuranSearch
    ) {
      return;
    }

    var results =
      window.QuranSearch.find(
        input.value
      );

    container.innerHTML = "";

    for (
      var i = 0;
      i < results.length;
      i++
    ) {

      var item =
        results[i];

      var primaryName =
        lang() === "en"
          ? (item.englishName || item.bengaliName)
          : (item.bengaliName || item.englishName);

      var secondaryName =
        lang() === "en"
          ? (item.bengaliName || "")
          : (item.englishName || "");

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "list-item";

      button.textContent =
        bnNum(item.number) +
        " — " +
        primaryName +
        " / " +
        secondaryName;

      button.onclick =
        (function (
          x
        ) {

          return function () {

            openReader(
              x.number,
              1
            );
          };

        })(item);

      container.appendChild(
        button
      );
    }

    if (
      !container.children.length
    ) {

      container.innerHTML =
        "<p class='about-content'>" +
        t("noResult") +
        "</p>";
    }
  }


  /* =====================================================
     SETTINGS
  ===================================================== */

  function showSettings() {

    openScreen(
      "settings"
    );

    renderSettings();
  }



  function renderSettings() {

    var container =
      $("settings-items");

    if (!container) {
      return;
    }

    settings =
      getSettings();

    var rows = [
      {
        icon: "globe",
        title: t("setLanguage"),
        value:
          settings.language === "en"
            ? "English"
            : "বাংলা",
        refreshAll: true,
        action: function () {
          settings.language =
            settings.language === "en"
              ? "bn"
              : "en";
        }
      },
      {
        icon: "sun",
        title: t("setTheme"),
        value: settings.theme,
        action: function () {
          if (settings.theme === "default") {
            settings.theme = "dark";
          } else if (settings.theme === "dark") {
            settings.theme = "night";
          } else if (settings.theme === "night") {
            settings.theme = "sepia";
          } else {
            settings.theme = "default";
          }
        }
      },
      {
        icon: "style",
        title: t("setStyle"),
        value: settings.readingStyle,
        action: function () {
          settings.readingStyle =
            settings.readingStyle === "standard"
              ? "compact"
              : "standard";
        }
      },
      {
        icon: "font",
        title: t("setArabic"),
        value: settings.arabicSize,
        action: function () {
          settings.arabicSize =
            settings.arabicSize >= 36
              ? 18
              : settings.arabicSize + 2;
        }
      },
      {
        icon: "font",
        title: t("setTrans"),
        value: settings.bengaliSize,
        action: function () {
          settings.bengaliSize =
            settings.bengaliSize >= 26
              ? 12
              : settings.bengaliSize + 2;
        }
      },
      {
        icon: "translate",
        title: t("setShowTrans"),
        value: settings.showTranslation
          ? t("yes")
          : t("no"),
        action: function () {
          settings.showTranslation =
            !settings.showTranslation;
        }
      }
    ];

    container.innerHTML =
      "";


    for (
      var i = 0;
      i < rows.length;
      i++
    ) {

      var row =
        rows[i];

      var button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "setting-item";

      button.innerHTML =
        ICONS[row.icon] +

        "<span class='set-label'>" +

        esc(
          row.title
        ) +

        "</span>" +

        "<span class='setting-value'>" +

        esc(
          row.value
        ) +

        "</span>";

      button.onclick =
        (function (
          r
        ) {

          return function () {

            r.action();

            try {
              window.QuranSettings.save(
                settings
              );
            } catch (e) {}

            if (r.refreshAll) {
              applyLanguage();
            }

            renderSettings();
          };

        })(row);

      container.appendChild(
        button
      );
    }

    var note =
      document.createElement("p");

    note.className =
      "set-note";

    note.textContent =
      t("setLangNote");

    container.appendChild(
      note
    );
  }


  function getSettings() {

    try {

      var saved =
        window.QuranSettings.get();

      if (
        saved &&
        typeof saved ===
          "object"
      ) {
        return saved;
      }

    } catch (e) {}

    return settings;
  }


  /* =====================================================
     HELP
  ===================================================== */

  function showHelp() {
    openScreen(
      "help"
    );
  }


  /* =====================================================
     ABOUT
  ===================================================== */


  function showAbout() {

    openScreen(
      "about"
    );

    renderAboutDefault();
  }


  function renderAboutDefault() {

    aboutIsSurahInfo =
      false;

    var content =
      $("about-content");

    if (!content) {
      return;
    }

    content.innerHTML =

      "<h2>Quran Majid</h2>" +

      "<p><strong>Version 2.4.0</strong></p>" +

      "<p>" +
      t("aboutOffline") +
      "</p>" +

      "<hr>" +

      "<h3>" +
      t("aboutDeveloper") +
      "</h3>" +

      "<p>" +
      "Mesbaul Islam" +
      "</p>" +

      "<h3>" +
      t("aboutContact") +
      "</h3>" +

      "<p>" +
      "maworld.info08@gmail.com" +
      "</p>" +

      "<h3>" +
      t("aboutCredits") +
      "</h3>" +

      "<p>" +
      "Arabic Quran Text: Tanzil Quran Text" +
      "</p>" +

      "<p>" +
      t("aboutDesigned") +
      "</p>" +

      "<p class='small'>" +
      "© 2026 Quran Majid" +
      "</p>";
  }


  function showCurrentSurahInfo() {

    var surah =
      window.QuranData.getSurah(
        currentSurah
      );

    var meta =
      window.QuranData.getMeta(
        currentSurah
      ) || {};

    if (!surah) {
      return;
    }

    openScreen(
      "about"
    );

    renderSurahInfoContent(
      surah,
      meta
    );
  }


  function renderSurahInfoContent(
    surah,
    meta
  ) {

    aboutIsSurahInfo =
      true;

    var content =
      $("about-content");

    if (!content) {
      return;
    }

    content.innerHTML =

      "<h2>" +
      esc(
        nameByLang(surah)
      ) +
      "</h2>" +

      "<p>" +
      t("surahNumber") +
      ": " +
      bnNum(currentSurah) +
      "</p>" +

      "<p>" +
      t("surahType") +
      ": " +
      esc(
        typeByLang(
          meta.type ||
          t("noInfo")
        )
      ) +
      "</p>" +

      "<p>" +
      t("surahAyahCount") +
      ": " +
      bnNum(surah.ayahCount) +
      "</p>";
  }


  /* =====================================================
     LAST READ
  ===================================================== */


  function saveLastRead(
    surah
  ) {

    write(
      "lastRead",
      {
        surah:
          currentSurah,

        ayah:
          currentAyah,

        label:
          nameByLang(surah) +
          " — " +
          t("ayahWord") +
          " " +
          bnNum(currentAyah)
      }
    );
  }


  /* =====================================================
     CONTACT / GO AYAH
  ===================================================== */


  function bindEvents() {

    var searchInput =
      $("search-input");

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        renderSearch
      );
    }


    var surahSearch =
      $("surah-search");

    if (surahSearch) {

      surahSearch.addEventListener(
        "input",
        renderSurahScreen
      );
    }


    var ayahInput =
      $("ayah-input");

    if (ayahInput) {

      ayahInput.addEventListener(
        "keydown",
        function (event) {

          var key =
            event.key ||
            event.keyCode;

          if (
            key === "Enter" ||
            key === 13
          ) {

            event.preventDefault();

            goAyah();
          }
        }
      );
    }
  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.QuranApp = {

    readerMove:
      readerMove,

    adjustFont:
      adjustFont,

    toggleCurrentBookmark:
      toggleCurrentBookmark,

    toggleCurrentFavourite:
      function () {

        toggleFavourite(
          currentSurah
        );

        renderReader(
          false
        );
      },

    previousSurah:
      function () {

        if (
          currentSurah >
          1
        ) {

          currentSurah--;

          currentAyah =
            1;

          renderReader(
            true
          );
        }
      },

    nextSurah:
      function () {

        if (
          currentSurah <
          114
        ) {

          currentSurah++;

          currentAyah =
            1;

          renderReader(
            true
          );
        }
      },

    showHistory:
      showHistory,

    showGoAyah:
      showGoAyah,

    showCurrentSurahInfo:
      showCurrentSurahInfo,

    showHelp:
      showHelp,

    showAbout:
      showAbout,

    openMenu:
      openMenu
  };


  /* =====================================================
     KEY EVENTS
  ===================================================== */

  /* Reader keypad and D-pad handling is centralized in navigation.js. */


  /* =====================================================
     STARTUP
  ===================================================== */

  function init() {

    /*
     * 1. Apply settings safely
     */
    applySettings();


    /*
     * 2. Apply language first.
     *    This refreshes all static labels
     *    and renders the Home menu.
     */
    applyLanguage();

    bindEvents();


    /*
     * 3. Show Home immediately.
     */
    showHome();


    /*
     * 4. Load Quran data afterwards.
     */
    if (
      window.QuranData &&
      typeof window.QuranData.load ===
        "function"
    ) {

      window.QuranData.load(

        function () {

          var list =
            window.QuranData.surahs();

          var count =
            0;

          for (
            var i = 0;
            i < list.length;
            i++
          ) {

            count +=
              Number(
                list[i].ayahCount ||
                0
              );
          }

          if (
            count > 0
          ) {
            totalAyahs =
              count;
          }

          renderHome();

        },

        function () {

          /*
           * Never remove Home menu
           * because data failed.
           */

          renderHome();
        }
      );
    }
  }


  function applySettings() {

    settings =
      getSettings();

    try {

      window.QuranSettings.apply(
        settings
      );

    } catch (e) {}
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})(window);