import 'https://polyfill.io/v3/polyfill.min.js';

// render has an issue with replaceAll causing errors to be thrown which stops the render. This is a pollyfil for all renders
String.prototype.replaceAll = function (str, newStr) {
  // If a regex pattern
  if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
    return this.replace(str, newStr);
  }
  // If a string
  return this.split(str).join(newStr);
};
