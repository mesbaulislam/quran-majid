(function (window) {
  "use strict";

  var defaults = {
    arabicSize: 25,
    bengaliSize: 16,

    showTranslation: true,

    darkMode: false,

    theme: "default",
    readingStyle: "standard",

    language: "bn"
  };

  function get() {

    var saved =
      window.QuranStorage.read(
        "settings",
        {}
      );

    var result = {};

    for (
      var key in defaults
    ) {

      if (
        saved[key] ===
        undefined
      ) {

        result[key] =
          defaults[key];

      } else {

        result[key] =
          saved[key];
      }
    }

    /*
     * Old darkMode compatibility
     */

    if (
      saved.theme ===
        undefined &&
      saved.darkMode ===
        true
    ) {

      result.theme =
        "dark";
    }

    return result;
  }

  function save(settings) {

    window.QuranStorage.write(
      "settings",
      settings
    );

    apply(settings);
  }

  function apply(settings) {

    var theme =
      settings.theme ||
      (
        settings.darkMode
          ? "dark"
          : "default"
      );

    var style =
      settings.readingStyle ||
      "standard";

    document.body.className =
      theme +
      " reading-" +
      style;

    document.documentElement.style.setProperty(
      "--arabic-size",
      settings.arabicSize +
      "px"
    );

    document.documentElement.style.setProperty(
      "--bengali-size",
      settings.bengaliSize +
      "px"
    );
  }

  function reset() {

    save(
      defaults
    );

    return get();
  }

  window.QuranSettings = {

    defaults:
      defaults,

    get:
      get,

    save:
      save,

    apply:
      apply,

    reset:
      reset
  };

})(window);