import './polyfills.js'
function dynamicReplace(selector = null, data = null) {
  if (selector != null && data != null) 
  { 
    dynamicReplaceMulti(selector, data);
  } else {
    dynamicReplaceSingle();
  }
}

function dynamicReplaceMulti(target, data) {
  const targets = document.querySelectorAll(target);
  if (targets.length === 0) return;

  targets.forEach(function (target) {
    data.forEach(function (item) {
      const inputValue = item[0];
      const lookup = item[1];

      if (
        target.innerText.includes(lookup) != -1 &&
        (inputValue != "" || inputValue.length != 0)
      ) {
        target.innerHTML = target.innerHTML.replaceAll(lookup, inputValue); //If found replace
      } else {
        let lookupSpan = `<span class='lookup-value'>${lookup}</span>`;
        // console.log(target.innerHTML);
        let temp = target.innerHTML.split(lookupSpan);
        temp = temp.map((x) => x.replaceAll(lookup, lookupSpan));
        target.innerHTML = temp.join(lookupSpan);
      }
    });
  });
}

function dynamicReplaceSingle() {
  const elements = document.querySelectorAll("[data-replace-from]");
  if (elements.length === 0) return;

  elements.forEach((el) => {
    const text = el.innerText;
    const html = el.innerHTML;
    const lookup = el.dataset.replaceFrom;
    const replace = el.dataset.replaceTo;

    if (text.search(lookup) != -1 && (replace != "" || replace.length != 0)) {
      el.innerHTML = html.replaceAll(lookup, replace);
    }
  });
}

export { dynamicReplace, dynamicReplaceSingle, dynamicReplaceMulti }