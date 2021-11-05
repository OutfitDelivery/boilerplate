export default function setupPlaceholder(placeholderImages = [], placeholderVisibility) {
  if (placeholderImages && typeof placeholderImages === 'string') {
    // eslint-disable-next-line no-param-reassign
    placeholderImages = [placeholderImages];
  }
  document.querySelectorAll('.placeholderImage').forEach((e) => e.remove());
  // If array length < 1 or the first item is "" or null or undefined
  if (
    placeholderImages.length < 1
    || !placeholderImages[0]
    || placeholderVisibility === 'hide'
  ) {
    return;
  }

  const pages = document.querySelectorAll('.page .bleed');
  pages.forEach((page, index) => {
    let placeholderImage = placeholderImages[index];
    if (
      placeholderImage === '' || placeholderImage === null || placeholderImage === undefined
    // eslint-disable-next-line prefer-destructuring
    ) { placeholderImage = placeholderImages[0]; }

    const placeholderStructure = `<div class="placeholderImage" style="background-image: url('${placeholderImage}')"></div>`;
    page.insertAdjacentHTML('afterbegin', placeholderStructure);
  });
}
