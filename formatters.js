function removeWord() {
  let elements = document.querySelectorAll("[data-remove-word]");
  elements.forEach(el => {
    let wordToRemove = el.dataset.removeWord;
    let text = el.innerHTML;
    var res = text.replaceAll(wordToRemove, "");
    el.innerHTML = res;
  });
}
