// render has an issue with replaceAll causing errors to be thrown which stops the render.
// This is a pollyfil for all renders
String.prototype.replaceAll = function (str, newStr) {
  // If a regex pattern
  if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
    return this.replace(str, newStr);
  }
  // If a string
  return this.split(str).join(newStr);
};

function dynamicReplaceMulti(target, data, colour) {
  const targets = document.querySelectorAll(target);
  if (targets.length === 0) return;

  targets.forEach((target) => {
    data.forEach((item) => {
      const inputValue = item[0];
      const lookup = item[1];

      if (
        target.innerText.includes(lookup) !== -1
        && (inputValue !== '' || inputValue.length !== 0)
      ) {
        target.innerHTML = target.innerHTML.replaceAll(lookup, inputValue); // If found replace
      } else {
        const lookupSpan = `<span ${(colour ? `style="color:${colour};"` : '')} class="lookup-value">${lookup}</span>`;
        // console.log(target.innerHTML);
        let temp = target.innerHTML.split(lookupSpan);
        temp = temp.map((x) => x.replaceAll(lookup, lookupSpan));
        target.innerHTML = temp.join(lookupSpan);
      }
    });
  });
}

function dynamicReplaceSingle() {
  const elements = document.querySelectorAll('[data-replace-from]');
  if (elements.length === 0) return;

  elements.forEach((el) => {
    const text = el.innerText;
    const html = el.innerHTML;
    const lookup = el.dataset.replaceFrom;
    const replace = el.dataset.replaceTo;

    if (text.search(lookup) !== -1 && (replace !== '' || replace.length !== 0)) {
      el.innerHTML = html.replaceAll(lookup, replace);
    }
  });
}

function dynamicReplace(selector = null, data = null, colour = null) {
  if (selector !== null && data !== null) {
    dynamicReplaceMulti(selector, data, colour);
  } else {
    dynamicReplaceSingle();
  }
}

export { dynamicReplace, dynamicReplaceSingle, dynamicReplaceMulti };
