/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkboilerplate"] = self["webpackChunkboilerplate"] || []).push([["modules_textFit_js"],{

/***/ "./modules/limiters.js":
/*!*****************************!*\
  !*** ./modules/limiters.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"charLimit\": () => (/* binding */ charLimit),\n/* harmony export */   \"dynamicAssign\": () => (/* binding */ dynamicAssign),\n/* harmony export */   \"maxHeightCheck\": () => (/* binding */ maxHeightCheck),\n/* harmony export */   \"maxLineCheck\": () => (/* binding */ maxLineCheck),\n/* harmony export */   \"innerWidth\": () => (/* binding */ innerWidth),\n/* harmony export */   \"innerHeight\": () => (/* binding */ innerHeight),\n/* harmony export */   \"countLines\": () => (/* binding */ countLines)\n/* harmony export */ });\n// count the number of lines inside of the current direct element\r\nfunction countLines(target) {\r\n  let testBox = document.createElement(\"span\");\r\n  testBox.style.fontSize = target.style.fontSize;\r\n  testBox.style.display = \"inline-block\";\r\n  testBox.innerText = \"⠀\";\r\n  target.appendChild(testBox);\r\n  let oneLineHeight = innerHeight(testBox);\r\n  testBox.remove();\r\n  let lines = innerHeight(target) / oneLineHeight;\r\n  target.dataset.lineCount = lines; // adds property for CSS targeting\r\n  return lines;\r\n}\r\n\r\n// Calculate height without padding.\r\nfunction innerHeight(el) {\r\n  var style = window.getComputedStyle(el, null);\r\n  var height = parseFloat(style.getPropertyValue(\"height\"));\r\n  var box_sizing = style.getPropertyValue(\"box-sizing\");\r\n  if (box_sizing == \"border-box\") {\r\n    var padding_top = parseFloat(style.getPropertyValue(\"padding-top\"));\r\n    var padding_bottom = parseFloat(style.getPropertyValue(\"padding-bottom\"));\r\n    var border_top = parseFloat(style.getPropertyValue(\"border-top-width\"));\r\n    var border_bottom = parseFloat(\r\n      style.getPropertyValue(\"border-bottom-width\")\r\n    );\r\n    height = height - padding_top - padding_bottom - border_top - border_bottom;\r\n  }\r\n  return height;\r\n}\r\n\r\n// Calculate width without padding.\r\nfunction innerWidth(el) {\r\n  var style = window.getComputedStyle(el, null);\r\n  var width = parseFloat(style.getPropertyValue(\"width\"));\r\n  var box_sizing = style.getPropertyValue(\"box-sizing\");\r\n  if (box_sizing == \"border-box\") {\r\n    var padding_left = parseFloat(style.getPropertyValue(\"padding-left\"));\r\n    var padding_right = parseFloat(style.getPropertyValue(\"padding-right\"));\r\n    var border_left = parseFloat(style.getPropertyValue(\"border-left-width\"));\r\n    var border_right = parseFloat(style.getPropertyValue(\"border-right-width\"));\r\n    width = width - padding_left - padding_right - border_left - border_right;\r\n  }\r\n  return width;\r\n}\r\n\r\nfunction maxLineCheck(orientation = \"portrait\") {\r\n  const isExportMode = window.location.href.indexOf(\"exports\") > -1;\r\n  const isLocalDev = window.location.href.indexOf(\"localhost\") > -1;\r\n  const preventExportOverflow =\r\n    document.body.dataset.preventExportOverflow === \"true\";\r\n  const isProjectKit = isLocalDev\r\n    ? undefined\r\n    : window.parent.document.querySelector(\".preview-frame\");\r\n\r\n  if ((isExportMode && preventExportOverflow) || isProjectKit) return;\r\n\r\n  const textBlocks = document.querySelectorAll(\"[data-max-line]\");\r\n\r\n  textBlocks.forEach((block) => {\r\n    const lineCount = countLines(block);\r\n    // Getting the data-max-line attribute value (max number of lines allowed) and letting the number of an alt if the page is landscape\r\n    const maxLine =\r\n      orientation == \"portrait\"\r\n        ? block.dataset.maxLine\r\n        : block.dataset.maxLineAlt || block.dataset.maxLine;\r\n\r\n    lineCount > maxLine\r\n      ? block.classList.add(\"overflow\")\r\n      : block.classList.remove(\"overflow\");\r\n  });\r\n  return true;\r\n}\r\n\r\n/**\r\n*Detailed instruction can be found here:\r\n https://github.com/aleks-frontend/max-height-check\r\n*/\r\nfunction maxHeightCheck(variation = \"primary\") {\r\n  const isExportMode = window.location.href.indexOf(\"exports\") > -1;\r\n  const isLocalDev = window.location.href.indexOf(\"localhost\") > -1;\r\n  const preventExportOverflow =\r\n    document.body.dataset.preventExportOverflow === \"true\";\r\n  const isProjectKit = isLocalDev\r\n    ? undefined\r\n    : window.parent.document.querySelector(\".preview-frame\");\r\n\r\n  if ((isExportMode && preventExportOverflow) || isProjectKit) return;\r\n\r\n  const textBlocks = document.querySelectorAll(\"[data-max-height]\");\r\n\r\n  textBlocks.forEach((block) => {\r\n    const dynamicCheck =\r\n      block.dataset.maxHeight == \"dynamic\" ||\r\n      block.dataset.maxHeightDynamic == \"true\";\r\n    if (dynamicCheck) dynamicAssign(block);\r\n\r\n    const cssCheck = block.dataset.maxHeight == \"css\";\r\n    const bodyComputedStyle = window.getComputedStyle(document.body);\r\n    const blockHeight = block.scrollHeight;\r\n    const unit = block.dataset.maxHeightUnit || \"px\";\r\n    const maxHeightAlt = block.dataset.maxHeightAlt || block.dataset.maxHeight;\r\n    let maxHeight =\r\n      variation == \"primary\" ? block.dataset.maxHeight : maxHeightAlt;\r\n\r\n    if (cssCheck) {\r\n      const computedBlockStyle = window.getComputedStyle(block);\r\n      maxHeight = parseFloat(computedBlockStyle.maxHeight);\r\n    } else {\r\n      // Setting the element's max-height\r\n      block.style.maxHeight = maxHeight + unit;\r\n\r\n      // Recalculating maxHeight in case 'rem' is set as a unit\r\n      if (unit == \"rem\")\r\n        maxHeight = maxHeight * parseFloat(bodyComputedStyle.fontSize);\r\n    }\r\n\r\n    // Adding an 'overflow' class to an element if it's offset height exceedes the max-line-height\r\n    blockHeight > maxHeight\r\n      ? block.classList.add(\"overflow\")\r\n      : block.classList.remove(\"overflow\");\r\n  });\r\n}\r\n\r\nfunction dynamicAssign(element) {\r\n  const container = element.parentNode;\r\n  container.style.overflow = \"hidden\";\r\n  const containerComputed = {\r\n    height: parseFloat(window.getComputedStyle(container).height),\r\n    top: parseFloat(window.getComputedStyle(container).paddingTop),\r\n    bottom: parseFloat(window.getComputedStyle(container).paddingBottom),\r\n  };\r\n  const containerHeight = Math.floor(\r\n    containerComputed.height - containerComputed.top - containerComputed.bottom\r\n  );\r\n  const subtrahends = [...container.querySelectorAll(\".js-subtrahend\")];\r\n\r\n  const subtrahendsHeight = subtrahends.reduce((totalHeight, subtrahend) => {\r\n    const subtrahendMargins = {\r\n      top: parseFloat(window.getComputedStyle(subtrahend).marginTop),\r\n      bottom: parseFloat(window.getComputedStyle(subtrahend).marginBottom),\r\n    };\r\n    return (\r\n      totalHeight +\r\n      subtrahend.offsetHeight +\r\n      subtrahendMargins.top +\r\n      subtrahendMargins.bottom\r\n    );\r\n  }, 0);\r\n\r\n  const dynamicHeight = containerHeight - subtrahendsHeight;\r\n\r\n  element.dataset.maxHeightDynamic = \"true\";\r\n  element.dataset.maxHeight = dynamicHeight;\r\n  container.style.overflow = \"visible\";\r\n}\r\n\r\n// Adding limit for the word length\r\nfunction charLimit() {\r\n  const elements = document.querySelectorAll(\"[data-char-limit]\");\r\n\r\n  elements.forEach((element) => {\r\n    const limit = element.dataset.charLimit;\r\n\r\n    if (element == null) {\r\n      return;\r\n    }\r\n    var tokenValue = element.querySelectorAll(\".token-value\");\r\n\r\n    if (tokenValue.length != 0) {\r\n      element = tokenValue.item(0);\r\n    }\r\n    var code = element.innerText;\r\n    if (code.length > limit) {\r\n      // Check Token Again\r\n      if (tokenValue.length != 0) {\r\n        element.parentNode.classList.add(\"overflow\");\r\n      } else {\r\n        element.classList.add(\"overflow\");\r\n      }\r\n    } else {\r\n      // Check Token Again\r\n      if (tokenValue.length != 0) {\r\n        element.parentNode.classList.remove(\"overflow\");\r\n      } else {\r\n        element.classList.remove(\"overflow\");\r\n      }\r\n    }\r\n  });\r\n}\r\n\r\n\n\n//# sourceURL=webpack://boilerplate/./modules/limiters.js?");

/***/ }),

/***/ "./modules/textFit.js":
/*!****************************!*\
  !*** ./modules/textFit.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ textFit)\n/* harmony export */ });\n/* harmony import */ var _limiters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./limiters.js */ \"./modules/limiters.js\");\n\n/**\n * textFit v3.1.0\n * Previously known as jQuery.textFit\n * 11/2014 by STRML (strml.github.com)\n * MIT License\n *\n * To use: textFit(document.getElementById('target-div'), options);\n *\n * Will make the *text* content inside a container scale to fit the container\n * The container is required to have a set width and height\n * Uses binary search to fit text with minimal layout calls.\n * Version 2.0 does not use jQuery.\n */\n/* global define:true, document:true, window:true, HTMLElement:true*/\n\n// (function (root, factory) {\n//   \"use strict\";\n\n//   // UMD shim\n//   if (typeof define === \"function\" && define.amd) {\n//     // AMD\n//     define([], factory);\n//   } else if (typeof exports === \"object\") {\n//     // Node/CommonJS\n//     module.exports = factory();\n//   } else {\n//     // Browser\n//     root.textFit = factory();\n//   }\n// })(typeof global === \"object\" ? global : this, function () {\n//   \"use strict\";\n\n  var defaultSettings = {\n    alignVert: false, // if true, textFit will align vertically using css tables\n    alignHoriz: false, // if true, textFit will set text-align: center\n    multiLine: false, // if true, textFit will not set white-space: no-wrap\n    stopOverflow: false, // if true, a error we be thrown if the content is overflowing\n    maxLine: false, // if true, textFit will throw and error if the text is over the supplied number of lines\n    detectMultiLine: true, // disable to turn off automatic multi-line sensing\n    fontUnit: \"px\", // what unit should the final font be. using rems or mm is sometimes useful\n    fontChangeSize: 0.1, // how much should the font size by ajusted by each time. 0.1 and 0.01 is useful for when using a rem font unit\n    minFontSize: 6,\n    display: \"inline-block\", // in case you need to change this\n    maxFontSize: 80,\n    reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance\n    widthOnly: false, // if true, textFit will fit text to element width, regardless of text height\n    alignVertWithFlexbox: false, // if true, textFit will use flexbox for vertical alignment\n  };\n\n  function textFit(els, options) {\n    if (!options) options = {};\n\n    // Extend options.\n    var settings = {};\n    for (var key in defaultSettings) {\n      if (options.hasOwnProperty(key)) {\n        settings[key] = options[key];\n      } else {\n        settings[key] = defaultSettings[key];\n      }\n    }\n\n    // Convert jQuery objects into arrays\n    if (typeof els.toArray === \"function\") {\n      els = els.toArray();\n    }\n\n    // Support passing a single el\n    var elType = Object.prototype.toString.call(els);\n    if (\n      elType !== \"[object Array]\" &&\n      elType !== \"[object NodeList]\" &&\n      elType !== \"[object HTMLCollection]\"\n    ) {\n      els = [els];\n    }\n\n    // Process each el we've passed.\n    for (var i = 0; i < els.length; i++) {\n      try {\n        processItem(els[i], settings);\n      } catch (e) {\n        throw new Error(e.message);\n      }\n    }\n  };\n\n  /**\n   * The meat. Given an el, make the text inside it fit its parent.\n   * @param  {DOMElement} el       Child el.\n   * @param  {Object} settings     Options for fit.\n   */\n  function processItem(el, settings) {\n    if (!isElement(el) || (!settings.reProcess && el.getAttribute(\"textFitted\"))) {\n      return false;\n    }\n\n    // Set textFitted attribute so we know this was processed.\n    if (!settings.reProcess) {\n      el.setAttribute(\"textFitted\", 1);\n    }\n\n    var innerSpan, originalHeight, originalHTML, originalWidth;\n    var low, mid, high;\n\n    // Get element data.\n    originalHTML = el.innerHTML;\n    originalWidth = (0,_limiters_js__WEBPACK_IMPORTED_MODULE_0__.innerWidth)(el);\n    originalHeight = (0,_limiters_js__WEBPACK_IMPORTED_MODULE_0__.innerHeight)(el);\n\n    // Don't process if we can't find box dimensions\n    if (!originalWidth || (!settings.widthOnly && !originalHeight)) {\n      if (!settings.widthOnly)\n        throw new Error(\n          \"Set a static height and width on the target element \" +\n            el.outerHTML +\n            \" before using textFit!\"\n        );\n      else\n        throw new Error(\n          \"Set a static width on the target element \" +\n            el.outerHTML +\n            \" before using textFit!\"\n        );\n    }\n    // Add textFitted span inside this container.\n    if (originalHTML.indexOf(\"textFitted\") === -1) {\n      innerSpan = document.createElement(\"span\");\n      innerSpan.className = \"textFitted\";\n      // Inline block ensure it takes on the size of its contents, even if they are enclosed\n      // in other tags like <p>\n      innerSpan.style[\"display\"] = settings.display;\n      innerSpan.innerHTML = originalHTML;\n      el.innerHTML = \"\";\n      el.appendChild(innerSpan);\n    } else {\n      // Reprocessing.\n      innerSpan = el.querySelector(\"span.textFitted\");\n      // Remove vertical align if we're reprocessing.\n      if (hasClass(innerSpan, \"textFitAlignVert\")) {\n        innerSpan.className = innerSpan.className.replace(\n          \"textFitAlignVert\",\n          \"\"\n        );\n        innerSpan.style[\"height\"] = \"\";\n        el.className.replace(\"textFitAlignVertFlex\", \"\");\n      }\n    }\n\n    // Prepare & set alignment\n    if (settings.alignHoriz) {\n      el.style[\"text-align\"] = \"center\";\n      innerSpan.style[\"text-align\"] = \"center\";\n    }\n\n    // Check if this string is multiple lines\n    // Not guaranteed to always work if you use wonky line-heights\n    var multiLine = settings.multiLine;\n    if (\n      settings.detectMultiLine &&\n      !multiLine &&\n      innerSpan.scrollHeight >=\n        parseFloat(window.getComputedStyle(innerSpan)[\"font-size\"], 10) * 2\n    ) {\n      multiLine = true;\n    }\n    // If we're not treating this as a multiline string, don't var it wrap.\n    if (!multiLine) {\n      el.style[\"white-space\"] = \"nowrap\";\n    }\n\n    var maxLine = parseInt(el.dataset.maxLine || settings.maxLine);\n    var startingSize = innerSpan.style.fontSize;\n\n    low = settings.minFontSize;\n    high = settings.maxFontSize;\n    // Binary search for highest best fit\n    var size = low;\n    while (low <= high) {\n      mid = parseFloat(((high + low) / 2).toFixed(2));\n      innerSpan.style.fontSize = mid + settings.fontUnit;\n\n      var scrollWidth = innerSpan.scrollWidth <= originalWidth;\n      var scrollHeight =\n        settings.widthOnly || innerSpan.scrollHeight <= originalHeight;\n\n      // check if too many lines and if it is then we need to adjust the font size accordingly\n      var maxLines = false;\n      if (Number.isInteger(maxLine)) {\n        var lineCount = countLines(innerSpan);\n        maxLines = lineCount > maxLine;\n      }\n\n      if (scrollWidth && scrollHeight && !maxLines) {\n        size = mid;\n        low = mid + settings.fontChangeSize;\n      } else {\n        high = mid - settings.fontChangeSize;\n      }\n      // await injection point\n    }\n    if (startingSize !== size + settings.fontUnit) {\n      console.log(\"textFit font changed size: \", size + settings.fontUnit);\n    }\n    // updating font if differs:\n    if (innerSpan.style.fontSize != size + settings.fontUnit)\n      innerSpan.style.fontSize = size + settings.fontUnit;\n\n    // add the required CSS in order to stop overflows\n    if (Number.isInteger(maxLine) || settings.stopOverflow) {\n      if (!document.getElementById(\"overflowStyleSheet\")) {\n        var style = [\".overflow > span {\", \"overflow: hidden;\", \"}\"].join(\"\");\n\n        var css = document.createElement(\"style\");\n        css.type = \"text/css\";\n        css.id = \"overflowStyleSheet\";\n        css.innerHTML = style;\n        document.body.appendChild(css);\n      }\n\n      // detect if data max lines has been exceeded\n      if (Number.isInteger(maxLine)) {\n        el.classList.remove(\"overflow\");\n        delete el.dataset.customOverflowMessage;\n        var lineCount = countLines(innerSpan);\n        el.dataset.lineCount = lineCount;\n        if (lineCount > maxLine) {\n          el.dataset.customOverflowMessage =\n            \"Too much content has been added for the allowed space\";\n          el.classList.add(\"overflow\");\n        }\n      }\n      // detect if the content is larger than it's parent\n      if (settings.stopOverflow) {\n        var overflow = (0,_limiters_js__WEBPACK_IMPORTED_MODULE_0__.innerHeight)(el) < innerSpan.scrollHeight;\n        if (overflow) {\n          el.classList.add(\"overflow\");\n        }\n      }\n    }\n    // Our height is finalized. If we are aligning vertically, set that up.\n    if (settings.alignVert) {\n      addStyleSheet();\n      var height = innerSpan.scrollHeight;\n      if (window.getComputedStyle(el)[\"position\"] === \"static\") {\n        el.style[\"position\"] = \"relative\";\n      }\n      if (!hasClass(innerSpan, \"textFitAlignVert\")) {\n        innerSpan.className = innerSpan.className + \" textFitAlignVert\";\n      }\n      innerSpan.style[\"height\"] = height + \"px\";\n      if (\n        settings.alignVertWithFlexbox &&\n        !hasClass(el, \"textFitAlignVertFlex\")\n      ) {\n        el.className = el.className + \" textFitAlignVertFlex\";\n      }\n    }\n  }\n\n  // Returns true if it is a DOM element\n  function isElement(o) {\n    return typeof HTMLElement === \"object\"\n      ? o instanceof HTMLElement //DOM2\n      : o &&\n          typeof o === \"object\" &&\n          o !== null &&\n          o.nodeType === 1 &&\n          typeof o.nodeName === \"string\";\n  }\n\n  function hasClass(element, cls) {\n    return (\" \" + element.className + \" \").indexOf(\" \" + cls + \" \") > -1;\n  }\n\n  // count the number of lines inside of the current direct element  \n  function countLines(target) {\n    var testBox = document.createElement(\"span\")\n    // testBox.setAttribute('style', target.getAttribute('style'));\n    testBox.style.fontSize = target.style.fontSize;\n    testBox.style.display = 'inline-block';\n    testBox.innerText = '⠀';\n    target.appendChild(testBox);\n    var oneLineHeight = (0,_limiters_js__WEBPACK_IMPORTED_MODULE_0__.innerHeight)(testBox);\n    testBox.remove();\n    var lines = (0,_limiters_js__WEBPACK_IMPORTED_MODULE_0__.innerHeight)(target) / oneLineHeight;\n    return lines;\n  }\n\n  // Better than a stylesheet dependency\n  function addStyleSheet() {\n    if (document.getElementById(\"textFitStyleSheet\")) return;\n    var style = [\n      \".textFitAlignVert{\",\n      \"position: absolute;\",\n      \"top: 0; right: 0; bottom: 0; left: 0;\",\n      \"margin: auto;\",\n      \"display: flex;\",\n      \"justify-content: center;\",\n      \"flex-direction: column;\",\n      \"}\",\n      \".textFitAlignVertFlex{\",\n      \"display: flex;\",\n      \"}\",\n      \".textFitAlignVertFlex .textFitAlignVert{\",\n      \"position: static;\",\n      \"}\",\n    ].join(\"\");\n\n    var css = document.createElement(\"style\");\n    css.type = \"text/css\";\n    css.id = \"textFitStyleSheet\";\n    css.innerHTML = style;\n    document.body.appendChild(css);\n  }\n// });\n\n\n//# sourceURL=webpack://boilerplate/./modules/textFit.js?");

/***/ })

}]);