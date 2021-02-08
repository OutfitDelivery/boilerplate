// render has an issue with replace all causing errors to be thrown which stops the render. This is a pollyfil for all renders 
function replaceAll(content, replaceFrom, replaceTo) {
  if (content && replaceFrom && replaceTo) {
    while(~content.indexOf(replaceFrom)) {
      content = content.replace(replaceFrom, replaceTo)
    }
    console.log(content)
  }
  return content;
}

function removeWord() {
  let elements = document.querySelectorAll("[data-remove-word]");
  elements.forEach((el) => {
    let wordToRemove = el.dataset.removeWord;
    let text = el.innerHTML;
    var res = replaceAll(text, wordToRemove, "");
    el.innerHTML = res;
  });
}

function dynamicReplace(selector = null, data = null) {
  if (selector != null && data != null) dynamicReplaceMulti(selector, data);
  dynamicReplaceSingle();
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
        target.innerHTML = replaceAll(target.innerHTML, lookup, inputValue); //If found replace
      } else {
        //NEED TO FIX
        let lookupSpan = `<span class='lookup-value'>${lookup}</span>`;
        console.log(target.innerHTML);
        let temp = target.innerHTML.split(lookupSpan);
        temp = temp.map((x) => replaceAll(x, lookup, lookupSpan));
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
      el.innerHTML = replaceAll(html, lookup, replace);
    }
  });
}
