(function (window) {
  "use strict";

  var currentScreen = "home";

  /*
   * Back stack keeps the previous screen and its focused item.
   * This prevents Back from always jumping to the first option.
   */
  var history = [];


  function activeFocusIndex() {

    var items =
      focusables();

    if (!items.length) {
      return 0;
    }

    var active =
      document.activeElement;

    for (
      var i = 0;
      i < items.length;
      i++
    ) {

      if (items[i] === active) {
        return i;
      }
    }

    return 0;
  }


  function restoreFocus(index) {

    var items =
      focusables();

    if (!items.length) {
      return;
    }

    index = Number(index);

    if (!isFinite(index)) {
      index = 0;
    }

    index = Math.max(
      0,
      Math.min(
        Math.floor(index),
        items.length - 1
      )
    );

    items[index].focus();

    if (
      typeof items[index].scrollIntoView ===
      "function"
    ) {
      items[index].scrollIntoView(false);
    }
  }


  function visibleScreen() {

    return document.querySelector(
      ".screen:not(.hidden)"
    );
  }


  function focusables() {

    var screen =
      visibleScreen();


    if (!screen) {
      return [];
    }


    return screen.querySelectorAll(
      "button, input, [tabindex='0']"
    );
  }


  function getScrollContainer() {

    var screen =
      visibleScreen();


    if (!screen) {
      return null;
    }


    /*
     * These screens are mainly
     * text/list scrolling screens.
     */
    var selectors = [

      ".help-content",

      ".about-content",

      "#reader-content"
    ];


    for (
      var i = 0;
      i < selectors.length;
      i++
    ) {

      var element =
        screen.querySelector(
          selectors[i]
        );


      if (
        element &&
        element.scrollHeight >
          element.clientHeight
      ) {

        return element;
      }
    }


    return null;
  }


  function scrollContent(
    delta
  ) {

    var content =
      getScrollContainer();


    if (!content) {
      return false;
    }


    var amount =
      Math.max(
        35,
        Math.floor(
          content.clientHeight *
          0.65
        )
      );


    content.scrollTop =
      Math.max(
        0,
        Math.min(
          content.scrollHeight -
            content.clientHeight,

          content.scrollTop +
            delta *
            amount
        )
      );


    return true;
  }


  function move(
    delta
  ) {

    var items =
      focusables();


    if (!items.length) {
      return;
    }


    var active =
      document.activeElement;


    var index =
      -1;


    for (
      var i = 0;
      i < items.length;
      i++
    ) {

      if (
        items[i] ===
        active
      ) {

        index =
          i;

        break;
      }
    }


    index =
      (
        index +
        delta +
        items.length
      ) %
      items.length;


    items[index].focus();


    if (
      typeof items[index].scrollIntoView ===
      "function"
    ) {

      items[index].scrollIntoView(
        false
      );
    }
  }


  function open(
    name,
    remember,
    restoreIndex
  ) {

    if (
      remember !== false &&
      currentScreen !== name
    ) {

      history.push({
        screen: currentScreen,
        focusIndex: activeFocusIndex()
      });
    }

    var screens =
      document.querySelectorAll(
        ".screen"
      );

    for (
      var i = 0;
      i < screens.length;
      i++
    ) {
      screens[i].classList.add(
        "hidden"
      );
    }

    var target =
      document.getElementById(
        name
      );

    if (!target) {
      return;
    }

    target.classList.remove(
      "hidden"
    );

    currentScreen =
      name;

    var softkeys =
      document.getElementById(
        "softkeys"
      );

    if (softkeys) {

      if (name === "home") {
        softkeys.classList.remove(
          "hidden"
        );
      } else {
        softkeys.classList.add(
          "hidden"
        );
      }
    }

    if (
      restoreIndex !== undefined &&
      restoreIndex !== null
    ) {
      restoreFocus(restoreIndex);
      return;
    }

    restoreFocus(0);
  }


  function back() {

    if (
      currentScreen ===
      "home"
    ) {
      return;
    }

    var entry =
      history.length
        ? history.pop()
        : null;

    if (!entry) {
      open(
        "home",
        false,
        0
      );
      return;
    }

    open(
      entry.screen,
      false,
      entry.focusIndex
    );
  }


  function exit() {

    try {

      window.close();

    } catch (e) {}
  }


  function activate() {

    var element =
      document.activeElement;


    if (
      element &&
      typeof element.click ===
        "function"
    ) {

      element.click();
    }
  }


  function keyValue(
    event
  ) {

    return (
      event.key ||
      event.keyCode
    );
  }


  document.addEventListener(
    "keydown",
    function (event) {

      var key =
        keyValue(event);


      /*
       * READER — keypad/D-pad ownership is centralized here.
       */

      if (
        currentScreen ===
        "reader"
      ) {


        if (
          key === "1" ||
          key === 49
        ) {

          event.preventDefault();

          window.QuranApp.adjustFont(
            -2
          );

          return;
        }


        if (
          key === "2" ||
          key === 50
        ) {

          event.preventDefault();

          window.QuranApp.previousSurah();

          return;
        }


        if (
          key === "3" ||
          key === 51
        ) {

          event.preventDefault();

          window.QuranApp.adjustFont(
            2
          );

          return;
        }


        if (
          key === "4" ||
          key === 52
        ) {

          event.preventDefault();

          window.QuranApp.showHistory();

          return;
        }


        if (
          key === "5" ||
          key === 53
        ) {

          event.preventDefault();

          window.QuranApp
            .toggleCurrentBookmark();

          return;
        }


        if (
          key === "6" ||
          key === 54
        ) {

          event.preventDefault();

          window.QuranApp
            .showCurrentSurahInfo();

          return;
        }


        if (
          key === "7" ||
          key === 55
        ) {

          event.preventDefault();

          window.QuranApp
            .showGoAyah();

          return;
        }


        if (
          key === "8" ||
          key === 56
        ) {

          event.preventDefault();

          window.QuranApp.nextSurah();

          return;
        }


        if (
          key === "9" ||
          key === 57
        ) {

          event.preventDefault();

          window.QuranApp
            .toggleCurrentFavourite();

          return;
        }


        /*
         * Reader:
         * first scroll current Ayah,
         * then change Ayah.
         */
        if (
          key === "ArrowUp" ||
          key === 38
        ) {

          event.preventDefault();

          window.QuranApp.readerMove(
            -1
          );

          return;
        }


        if (
          key === "ArrowDown" ||
          key === 40
        ) {

          event.preventDefault();

          window.QuranApp.readerMove(
            1
          );

          return;
        }
      }


      /*
       * HELP / ABOUT / LONG TEXT SCREENS
       *
       * ArrowUp / ArrowDown should scroll
       * the actual content instead of trying
       * to focus non-button text.
       */

      if (
        key === "ArrowUp" ||
        key === 38
      ) {

        if (
          currentScreen === "help" ||
          currentScreen === "about" ||
          currentScreen === "progress"
        ) {

          if (
            scrollContent(-1)
          ) {

            event.preventDefault();

            return;
          }
        }


        /*
         * Normal list navigation.
         */

        event.preventDefault();

        move(-1);

        return;
      }


      if (
        key === "ArrowDown" ||
        key === 40
      ) {

        if (
          currentScreen === "help" ||
          currentScreen === "about" ||
          currentScreen === "progress"
        ) {

          if (
            scrollContent(1)
          ) {

            event.preventDefault();

            return;
          }
        }


        event.preventDefault();

        move(1);

        return;
      }


      /*
       * Normal left/right navigation.
       */

      if (
        key === "ArrowLeft" ||
        key === 37
      ) {

        event.preventDefault();

        move(-1);

        return;
      }


      if (
        key === "ArrowRight" ||
        key === 39
      ) {

        event.preventDefault();

        move(1);

        return;
      }


      /*
       * ENTER
       */

      if (
        key === "Enter" ||
        key === 13
      ) {

        event.preventDefault();

        activate();

        return;
      }


      /*
       * BACK
       */

      if (
        key === "Backspace" ||
        key === 8 ||
        key === "Escape"
      ) {

        event.preventDefault();

        back();

        return;
      }


      /*
       * Soft Right
       */

      if (
        key === "SoftRight"
      ) {

        event.preventDefault();

        back();

        return;
      }


      /*
       * Soft Left
       *
       * On Home it opens the Menu screen;
       * everywhere else it activates the focused item.
       */

      if (
        key === "SoftLeft"
      ) {

        event.preventDefault();

        if (
          currentScreen === "home" &&
          window.QuranApp &&
          typeof window.QuranApp.openMenu ===
            "function"
        ) {

          window.QuranApp.openMenu();

        } else {

          activate();
        }

        return;
      }

    }
  );


  window.QuranNavigation = {

    open:
      open,

    back:
      back,

    exit:
      exit,

    move:
      move,

    current:
      function () {
        return currentScreen;
      }
  };

})(window);