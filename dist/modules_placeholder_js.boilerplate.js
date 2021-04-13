/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkboilerplate"] = self["webpackChunkboilerplate"] || []).push([["modules_placeholder_js"],{

/***/ "./modules/placeholder.js":
/*!********************************!*\
  !*** ./modules/placeholder.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ setupPlaceholder)\n/* harmony export */ });\nfunction setupPlaceholder(placeholderVisibility, placeholderImages) {\n    // If array length < 1 or the first item is \"\" or null or undefined\n    if (\n      placeholderImages.length < 1 ||\n      placeholderImages[0] == \"\" ||\n      placeholderImages[0] == null ||\n      placeholderImages[0] == undefined ||\n      placeholderVisibility == \"hide\"\n    )\n      return;\n  \n    var pages = document.querySelectorAll(\".page .container\");\n    pages.forEach((page, index) => {\n      let placeholderImage = placeholderImages[index];\n      if (\n        placeholderImage == \"\" ||\n        placeholderImage == null ||\n        placeholderImage == undefined\n      )\n        placeholderImage = placeholderImages[0];\n  \n      let placeholderStructure = `<div class=\"placeholderImage\" style=\"background-image: url('${placeholderImage}')\"></div>`;\n      page.insertAdjacentHTML(\"afterbegin\", placeholderStructure);\n    });\n  }\n\n//# sourceURL=webpack://boilerplate/./modules/placeholder.js?");

/***/ })

}]);