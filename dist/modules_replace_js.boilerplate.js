/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkboilerplate"] = self["webpackChunkboilerplate"] || []).push([["modules_replace_js"],{

/***/ "./modules/polyfills.js":
/*!******************************!*\
  !*** ./modules/polyfills.js ***!
  \******************************/
/***/ (() => {

eval("// render has an issue with replaceAll causing errors to be thrown which stops the render. This is a pollyfil for all renders\nString.prototype.replaceAll = function (str, newStr) {\n  // If a regex pattern\n  if (Object.prototype.toString.call(str).toLowerCase() === \"[object regexp]\") {\n    return this.replace(str, newStr);\n  }\n  // If a string\n  return this.split(str).join(newStr);\n};\n\n\n//# sourceURL=webpack://boilerplate/./modules/polyfills.js?");

/***/ }),

/***/ "./modules/replace.js":
/*!****************************!*\
  !*** ./modules/replace.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dynamicReplace\": () => (/* binding */ dynamicReplace),\n/* harmony export */   \"dynamicReplaceSingle\": () => (/* binding */ dynamicReplaceSingle),\n/* harmony export */   \"dynamicReplaceMulti\": () => (/* binding */ dynamicReplaceMulti)\n/* harmony export */ });\n/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills.js */ \"./modules/polyfills.js\");\n/* harmony import */ var _polyfills_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polyfills_js__WEBPACK_IMPORTED_MODULE_0__);\n\r\nfunction dynamicReplace(selector = null, data = null) {\r\n  if (selector != null && data != null) \r\n  { \r\n    dynamicReplaceMulti(selector, data);\r\n  } else {\r\n    dynamicReplaceSingle();\r\n  }\r\n}\r\n\r\nfunction dynamicReplaceMulti(target, data) {\r\n  const targets = document.querySelectorAll(target);\r\n  if (targets.length === 0) return;\r\n\r\n  targets.forEach(function (target) {\r\n    data.forEach(function (item) {\r\n      const inputValue = item[0];\r\n      const lookup = item[1];\r\n\r\n      if (\r\n        target.innerText.includes(lookup) != -1 &&\r\n        (inputValue != \"\" || inputValue.length != 0)\r\n      ) {\r\n        target.innerHTML = target.innerHTML.replaceAll(lookup, inputValue); //If found replace\r\n      } else {\r\n        let lookupSpan = `<span class='lookup-value'>${lookup}</span>`;\r\n        // console.log(target.innerHTML);\r\n        let temp = target.innerHTML.split(lookupSpan);\r\n        temp = temp.map((x) => x.replaceAll(lookup, lookupSpan));\r\n        target.innerHTML = temp.join(lookupSpan);\r\n      }\r\n    });\r\n  });\r\n}\r\n\r\nfunction dynamicReplaceSingle() {\r\n  const elements = document.querySelectorAll(\"[data-replace-from]\");\r\n  if (elements.length === 0) return;\r\n\r\n  elements.forEach((el) => {\r\n    const text = el.innerText;\r\n    const html = el.innerHTML;\r\n    const lookup = el.dataset.replaceFrom;\r\n    const replace = el.dataset.replaceTo;\r\n\r\n    if (text.search(lookup) != -1 && (replace != \"\" || replace.length != 0)) {\r\n      el.innerHTML = html.replaceAll(lookup, replace);\r\n    }\r\n  });\r\n}\r\n\r\n\n\n//# sourceURL=webpack://boilerplate/./modules/replace.js?");

/***/ })

}]);