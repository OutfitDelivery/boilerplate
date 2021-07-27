export default function setupPlaceholder(placeholderVisibility, placeholderImages) {
    if (placeholderImages && typeof placeholderImages === 'string') {
      placeholderImages = [placeholderImages]
    }
    // If array length < 1 or the first item is "" or null or undefined
    if (
      placeholderImages.length < 1 ||
      !placeholderImages[0] || 
      placeholderVisibility === "hide"
    )
      return;
  
    var pages = document.querySelectorAll(".page .container");
    pages.forEach((page, index) => {
      let placeholderImage = placeholderImages[index];
      if (
        placeholderImage == "" ||
        placeholderImage == null ||
        placeholderImage == undefined
      )
        placeholderImage = placeholderImages[0];
  
      let placeholderStructure = `<div class="placeholderImage" style="background-image: url('${placeholderImage}')"></div>`;
      page.insertAdjacentHTML("afterbegin", placeholderStructure);
    });
  }