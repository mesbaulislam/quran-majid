(function (window) {
  "use strict";

  var state = {
    data: null,
    metadata: {
      source: {},
      surahs: [],
      juz: []
    },
    currentSurah: null,
    currentAyah: 1
  };


  function requestJson(url, success, failure) {
    var xhr = new XMLHttpRequest();
    var finished = false;

    var timer = window.setTimeout(
      function () {
        if (finished) return;
        finished = true;
        failure(new Error(url + " timed out"));
      },
      10000
    );

    function done(callback, value) {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      callback(value);
    }

    try {
      xhr.open("GET", url, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4 || finished) return;

        var hasBody =
          typeof xhr.responseText === "string" &&
          xhr.responseText.length > 0;

        var statusOK =
          (xhr.status >= 200 && xhr.status < 300) ||
          (xhr.status === 0 && hasBody);

        if (!statusOK) {
          done(failure, new Error(url + " failed; status=" + xhr.status));
          return;
        }

        try {
          done(success, JSON.parse(xhr.responseText));
        } catch (error) {
          done(failure, error);
        }
      };

      xhr.onerror = function () {
        done(failure, new Error(url + " could not be loaded"));
      };

      xhr.send(null);
    } catch (error) {
      done(failure, error);
    }
  }

  function load(success, failure) {
    requestJson(
      "data/quran.json",
      function (data) {
        if (
          !data ||
          !Array.isArray(data.surahs) ||
          data.surahs.length !== 114
        ) {
          failure(new Error("Invalid quran.json"));
          return;
        }

        state.data = data;

        requestJson(
          "data/metadata.json",
          function (metadata) {
            if (
              metadata &&
              typeof metadata === "object" &&
              Array.isArray(metadata.surahs)
            ) {
              state.metadata = metadata;
            }
            success(state.data, state.metadata);
          },
          function () {
            state.metadata = {
              source: {},
              surahs: [],
              juz: []
            };
            success(state.data, state.metadata);
          }
        );
      },
      function (error) {
        failure(error);
      }
    );
  }


  function surahs() {

    if (
      !state.data ||
      !Array.isArray(
        state.data.surahs
      )
    ) {

      return [];
    }

    return state.data.surahs;
  }


  function meta() {
    return state.metadata || {
      source: {},
      surahs: [],
      juz: []
    };
  }


  function getSurah(
    number
  ) {

    number =
      Number(number);

    var list =
      surahs();


    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      if (
        Number(
          list[i].number
        ) === number
      ) {

        return list[i];
      }
    }


    return null;
  }


  function getMeta(
    number
  ) {

    number =
      Number(number);

    var list =
      Array.isArray(
        state.metadata.surahs
      )
        ? state.metadata.surahs
        : [];


    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      if (
        Number(
          list[i].number
        ) === number
      ) {

        return list[i];
      }
    }


    return {};
  }


  /*
   * UI language helpers (app chrome only — Quran content is
   * never translated). Language lives in QuranSettings
   * ("language": "bn" | "en").
   */

  function uiLang() {
    try {
      if (
        window.QuranSettings &&
        typeof window.QuranSettings.get === "function"
      ) {
        var s = window.QuranSettings.get();
        if (s && s.language === "en") {
          return "en";
        }
      }
    } catch (e) {}
    return "bn";
  }


  var uiText = {
    bn: {
      ayahs: "আয়াত",
      meaning: "বাংলা অর্থ",
      bmAdd: "☆ বুকমার্ক",
      bmRemove: "★ বুকমার্ক সরান",
      noData: "সূরা ডাটা লোড করা যায়নি।",
      noMatch: "কোনো সূরা মেলেনি।"
    },
    en: {
      ayahs: "Ayahs",
      meaning: "Bengali Meaning",
      bmAdd: "☆ Bookmark",
      bmRemove: "★ Remove Bookmark",
      noData: "Surah data could not be loaded.",
      noMatch: "No matching Surah."
    }
  };


  function bnDigits(value, lang) {
    if ((lang || uiLang()) !== "bn") {
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


  function renderSurahList(
    container,
    onOpen,
    isFavourite,
    filter
  ) {

    if (!container) {
      return;
    }


    container.innerHTML =
      "";


    var lang =
      uiLang();

    var txt =
      uiText[lang];

    var query =
      String(filter || "")
        .toLowerCase()
        .replace(/^\s+|\s+$/g, "");


    var list =
      surahs();


    for (
      var i = 0;
      i < list.length;
      i++
    ) {

      var s =
        list[i];


      /*
       * Optional filter from the Surah screen search field.
       * Matches surah number or any of its names.
       */

      if (query) {

        var haystack =
          (
            s.number + " " +
            (s.arabicName || "") + " " +
            (s.bengaliName || "") + " " +
            (s.englishName || "")
          ).toLowerCase();

        if (
          haystack.indexOf(query) ===
          -1
        ) {
          continue;
        }
      }


      var button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "list-item surah-card";


      button.tabIndex =
        0;


      button.setAttribute(
        "data-surah",
        s.number
      );


      var mainName =
        lang === "en"
          ? (s.englishName || s.bengaliName)
          : (s.bengaliName || s.englishName);


      var subName =
        lang === "en"
          ? (s.bengaliName || "")
          : (s.englishName || "");


      var star =
        "";


      if (
        typeof isFavourite ===
          "function" &&
        isFavourite(
          s.number
        )
      ) {

        star =
          " ★";
      }


      button.innerHTML =

        "<span class='surah-badge'>" +

        bnDigits(
          s.number
        ) +

        "</span>" +

        "<span class='surah-names'>" +

        "<span class='surah-main'>" +

        esc(
          mainName
        ) +

        "</span>" +

        "<span class='surah-sub'>" +

        esc(
          subName
        ) +

        " · " +

        bnDigits(
          s.ayahCount
        ) +

        " " +

        txt.ayahs +

        star +

        "</span>" +

        "</span>" +

        "<span class='surah-arabic-inline'>" +

        esc(
          s.arabicName
        ) +

        "</span>" +

        "<span class='surah-chev'>" +

        "›" +

        "</span>";


      button.onclick =
        (function (
          n
        ) {

          return function () {

            onOpen(
              Number(n),
              1
            );
          };

        })(
          s.number
        );


      container.appendChild(
        button
      );
    }


    /*
     * If nothing is shown, explain why instead of a blank screen:
     * either the data did not load, or the filter matched nothing.
     */

    if (
      !container.children.length
    ) {

      container.innerHTML =
        "<p class='about-content'>" +
        (
          list.length
            ? txt.noMatch
            : txt.noData
        ) +
        "</p>";
    }
  }


  /*
   * ONE AYAH ONLY
   */
  function renderReader(
    container,
    surahNumber,
    ayahNumber,
    settings,
    onBookmark
  ) {

    if (!container) {
      return;
    }


    var surah =
      getSurah(
        surahNumber
      );


    if (!surah) {
      return;
    }


    var current =
      Math.max(
        1,
        Math.min(
          Number(
            ayahNumber
          ) || 1,
          surah.ayahs.length
        )
      );


    state.currentSurah =
      Number(
        surahNumber
      );


    state.currentAyah =
      current;


    var ayah =
      surah.ayahs[
        current - 1
      ];


    if (!ayah) {
      return;
    }


    var lang =
      settings &&
      settings.language
        ? settings.language
        : uiLang();

    var txt =
      uiText[lang] ||
      uiText.bn;


    var html =
      "<article " +
      "class='reader-ayah current-ayah' " +
      "data-ayah='" +
      ayah.number +
      "'>" +


      "<div class='ayah-num'>" +

      "<span class='ayah-num-medal'>" +

      bnDigits(
        ayah.number,
        lang
      ) +

      "</span>" +

      "</div>" +


      "<p class='ayah-arabic'>" +
      "﴿ " +
      esc(
        ayah.arabic
      ) +
      " ﴾" +
      "</p>";


    /*
     * Pronunciation is part of the stored ayah data and part of
     * this app's original feature set; show it when present.
     */

    if (
      ayah.pronunciation
    ) {

      html +=

        "<p class='ayah-pron'>" +
        esc(
          ayah.pronunciation
        ) +
        "</p>";
    }


    if (
      settings.showTranslation &&
      ayah.translation
    ) {

      html +=

        "<p class='ayah-label'>" +
        txt.meaning +
        "</p>" +

        "<p class='ayah-bn ayah-translation'>" +
        esc(
          ayah.translation
        ) +
        "</p>";
    }


    if (
      onBookmark
    ) {

      var bookmarked =
        onBookmark.isBookmarked(
          Number(
            surahNumber
          ),
          Number(
            ayah.number
          )
        );


      html +=

        "<button " +
        "class='bookmark-action' " +
        "type='button' " +
        "data-bookmark='" +
        ayah.number +
        "'>" +

        (
          bookmarked
            ? txt.bmRemove
            : txt.bmAdd
        ) +

        "</button>";
    }


    html +=
      "</article>";


    container.innerHTML =
      html;


    /*
     * New Ayah always starts
     * from its own top.
     */
    container.scrollTop =
      0;


    container.setAttribute(
      "data-current-ayah",
      ayah.number
    );


    container.setAttribute(
      "data-total",
      surah.ayahs.length
    );


    var bookmarkButton =
      container.querySelector(
        ".bookmark-action"
      );


    if (
      bookmarkButton &&
      onBookmark
    ) {

      bookmarkButton.onclick =
        function () {

          onBookmark.toggle(
            Number(
              surahNumber
            ),
            Number(
              this.getAttribute(
                "data-bookmark"
              )
            )
          );


          renderReader(
            container,
            surahNumber,
            current,
            settings,
            onBookmark
          );
        };
    }
  }


  function pad(number) {
    return number < 10
      ? "0" + number
      : String(number);
  }


  function esc(value) {

    return String(
      value === undefined ||
      value === null
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


  window.QuranData = {

    load:
      load,

    surahs:
      surahs,

    meta:
      meta,

    getSurah:
      getSurah,

    getMeta:
      getMeta,

    renderSurahList:
      renderSurahList,

    renderReader:
      renderReader,

    state:
      state
  };

})(window);