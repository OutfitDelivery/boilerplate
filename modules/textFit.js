import { getWidth, getHeight } from './limiters.js'
/**
 * textFit v3.1.0
 * Previously known as jQuery.textFit
 * 11/2014 by STRML (strml.github.com)
 * MIT License
 *
 * To use: textFit(document.getElementById('target-div'), options);
 *
 * Will make the *text* content inside a container scale to fit the container
 * The container is required to have a set width and height
 * Uses binary search to fit text with minimal layout calls.
 * Version 2.0 does not use jQuery.
 */
/* global define:true, document:true, window:true, HTMLElement:true*/

// (function (root, factory) {
//   "use strict";

//   // UMD shim
//   if (typeof define === "function" && define.amd) {
//     // AMD
//     define([], factory);
//   } else if (typeof exports === "object") {
//     // Node/CommonJS
//     module.exports = factory();
//   } else {
//     // Browser
//     root.textFit = factory();
//   }
// })(typeof global === "object" ? global : this, function () {
//   "use strict";

  var defaultSettings = {
    alignVert: false, // if true, textFit will align vertically using css tables
    alignHoriz: false, // if true, textFit will set text-align: center
    multiLine: false, // if true, textFit will not set white-space: no-wrap
    stopOverflow: false, // if true, a error we be thrown if the content is overflowing
    maxLine: false, // if true, textFit will throw and error if the text is over the supplied number of lines
    detectMultiLine: true, // disable to turn off automatic multi-line sensing
    fontUnit: "px", // what unit should the final font be. using rems or mm is sometimes useful
    fontChangeSize: 0.1, // how much should the font size by ajusted by each time. 0.1 and 0.01 is useful for when using a rem font unit
    minFontSize: 6,
    display: "inline-block", // in case you need to change this
    maxFontSize: 80,
    reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
    widthOnly: false, // if true, textFit will fit text to element width, regardless of text height
    alignVertWithFlexbox: false, // if true, textFit will use flexbox for vertical alignment
  };

  export default function textFit(els, options) {
    if (!options) options = {};

    // Extend options.
    var settings = {};
    for (var key in defaultSettings) {
      if (options.hasOwnProperty(key)) {
        settings[key] = options[key];
      } else {
        settings[key] = defaultSettings[key];
      }
    }

    // Convert jQuery objects into arrays
    if (typeof els.toArray === "function") {
      els = els.toArray();
    }

    // Support passing a single el
    var elType = Object.prototype.toString.call(els);
    if (
      elType !== "[object Array]" &&
      elType !== "[object NodeList]" &&
      elType !== "[object HTMLCollection]"
    ) {
      els = [els];
    }

    // Process each el we've passed.
    for (var i = 0; i < els.length; i++) {
      try {
        processItem(els[i], settings);
      } catch (e) {
        throw new Error(e.message);
      }
    }
  };

  /**
   * The meat. Given an el, make the text inside it fit its parent.
   * @param  {DOMElement} el       Child el.
   * @param  {Object} settings     Options for fit.
   */
  function processItem(el, settings) {
    if (!isElement(el) || (!settings.reProcess && el.getAttribute("textFitted"))) {
      return false;
    }

    // Set textFitted attribute so we know this was processed.
    if (!settings.reProcess) {
      el.setAttribute("textFitted", 1);
    }

    var innerSpan, originalHeight, originalHTML, originalWidth;
    var low, mid, high;

    // Get element data.
    originalHTML = el.innerHTML;
    originalWidth = getWidth(el);
    originalHeight = getHeight(el);

    // Don't process if we can't find box dimensions
    if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
      if (!settings.widthOnly)
        throw new Error(
          "Set a static height and width on the target element " +
            el.outerHTML +
            " before using textFit!"
        );
      else
        throw new Error(
          "Set a static width on the target element " +
            el.outerHTML +
            " before using textFit!"
        );
    }
    // Add textFitted span inside this container.
    if (originalHTML.indexOf("textFitted") === -1) {
      innerSpan = document.createElement("span");
      innerSpan.className = "textFitted";
      // Inline block ensure it takes on the size of its contents, even if they are enclosed
      // in other tags like <p>
      innerSpan.style["display"] = settings.display;
      innerSpan.innerHTML = originalHTML;
      el.innerHTML = "";
      el.appendChild(innerSpan);
    } else {
      // Reprocessing.
      innerSpan = el.querySelector("span.textFitted");
      // Remove vertical align if we're reprocessing.
      if (hasClass(innerSpan, "textFitAlignVert")) {
        innerSpan.className = innerSpan.className.replace(
          "textFitAlignVert",
          ""
        );
        innerSpan.style["height"] = "";
        el.className.replace("textFitAlignVertFlex", "");
      }
    }

    // Prepare & set alignment
    if (settings.alignHoriz) {
      el.style["text-align"] = "center";
      innerSpan.style["text-align"] = "center";
    }

    // Check if this string is multiple lines
    // Not guaranteed to always work if you use wonky line-heights
    var multiLine = settings.multiLine;
    if (
      settings.detectMultiLine &&
      !multiLine &&
      innerSpan.scrollHeight >=
        parseFloat(window.getComputedStyle(innerSpan)["font-size"], 10) * 2
    ) {
      multiLine = true;
    }
    // If we're not treating this as a multiline string, don't var it wrap.
    if (!multiLine) {
      el.style["white-space"] = "nowrap";
    }

    var maxLine = parseInt(el.dataset.maxLine || settings.maxLine);
    var startingSize = innerSpan.style.fontSize;

    low = settings.minFontSize;
    high = settings.maxFontSize;
    // Binary search for highest best fit
    var size = low;
    while (low <= high) {
      mid = parseFloat(((high + low) / 2).toFixed(2));
      innerSpan.style.fontSize = mid + settings.fontUnit;

      var scrollWidth = innerSpan.scrollWidth <= originalWidth;
      var scrollHeight =
        settings.widthOnly || innerSpan.scrollHeight <= originalHeight;

      // check if too many lines and if it is then we need to adjust the font size accordingly
      var maxLines = false;
      if (Number.isInteger(maxLine)) {
        var lineCount = countLines(innerSpan);
        maxLines = lineCount > maxLine;
      }

      if (scrollWidth && scrollHeight && !maxLines) {
        size = mid;
        low = mid + settings.fontChangeSize;
      } else {
        high = mid - settings.fontChangeSize;
      }
      // await injection point
    }
    if (startingSize !== size + settings.fontUnit) {
      console.log("textFit font changed size: ", size + settings.fontUnit);
    }
    // updating font if differs:
    if (innerSpan.style.fontSize != size + settings.fontUnit)
      innerSpan.style.fontSize = size + settings.fontUnit;

    // add the required CSS in order to stop overflows
    if (Number.isInteger(maxLine) || settings.stopOverflow) {
      if (!document.getElementById("overflowStyleSheet")) {
        var style = [".overflow > span {", "overflow: hidden;", "}"].join("");

        var css = document.createElement("style");
        css.type = "text/css";
        css.id = "overflowStyleSheet";
        css.innerHTML = style;
        document.body.appendChild(css);
      }

      // detect if data max lines has been exceeded
      if (Number.isInteger(maxLine)) {
        el.classList.remove("overflow");
        delete el.dataset.customOverflowMessage;
        var lineCount = countLines(innerSpan);
        el.dataset.lineCount = lineCount;
        if (lineCount > maxLine) {
          el.dataset.customOverflowMessage =
            "Too much content has been added for the allowed space";
          el.classList.add("overflow");
        }
      }
      // detect if the content is larger than it's parent
      if (settings.stopOverflow) {
        var overflow = getHeight(el) < getHeight(innerSpan);
        if (overflow) {
          el.classList.add("overflow");
        }
      }
    }
    // Our height is finalized. If we are aligning vertically, set that up.
    if (settings.alignVert) {
      addStyleSheet();
      var height = innerSpan.scrollHeight;
      if (window.getComputedStyle(el)["position"] === "static") {
        el.style["position"] = "relative";
      }
      if (!hasClass(innerSpan, "textFitAlignVert")) {
        innerSpan.className = innerSpan.className + " textFitAlignVert";
      }
      innerSpan.style["height"] = height + "px";
      if (
        settings.alignVertWithFlexbox &&
        !hasClass(el, "textFitAlignVertFlex")
      ) {
        el.className = el.className + " textFitAlignVertFlex";
      }
    }
  }

  // Returns true if it is a DOM element
  function isElement(o) {
    return typeof HTMLElement === "object"
      ? o instanceof HTMLElement //DOM2
      : o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
  }

  function hasClass(element, cls) {
    return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
  }

  // count the number of lines inside of the current direct element  
  function countLines(target) {
    var testBox = document.createElement("span")
    // testBox.setAttribute('style', target.getAttribute('style'));
    testBox.style.fontSize = target.style.fontSize;
    testBox.style.display = 'inline-block';
    testBox.innerText = '⠀';
    target.appendChild(testBox);
    var oneLineHeight = getHeight(testBox);
    testBox.remove();
    var lines = getHeight(target) / oneLineHeight;
    return lines;
  }

  // Better than a stylesheet dependency
  function addStyleSheet() {
    if (document.getElementById("textFitStyleSheet")) return;
    var style = [
      ".textFitAlignVert{",
      "position: absolute;",
      "top: 0; right: 0; bottom: 0; left: 0;",
      "margin: auto;",
      "display: flex;",
      "justify-content: center;",
      "flex-direction: column;",
      "}",
      ".textFitAlignVertFlex{",
      "display: flex;",
      "}",
      ".textFitAlignVertFlex .textFitAlignVert{",
      "position: static;",
      "}",
    ].join("");

    var css = document.createElement("style");
    css.type = "text/css";
    css.id = "textFitStyleSheet";
    css.innerHTML = style;
    document.body.appendChild(css);
  }
// });
